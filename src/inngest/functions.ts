import { Sandbox } from "@e2b/code-interpreter";
import { createAgent, createNetwork, createTool, openai, type Tool } from "@inngest/agent-kit";
import { inngest } from "./client";
import { getSandbox, lastAssistantTextMesageContent } from "./utils";
import { z } from "zod";
import { PROMPT } from "@/prompt";
import prisma from "@/lib/db";


interface AgentState {
  summary: string;
  files: { [path: string]: string };

};


export const AICoderFunction = inngest.createFunction(
  { id: "AICoder" },
  { event: "AICoder/run" },
  async ({ event, step }) => {
    
    // 1. Initialize Sandbox
    const sandboxId = await step.run("get-sandbox-id", async () => {
      const sandbox = await Sandbox.create("webhive-nextjs-test");
      return sandbox.sandboxId;
    });

    // 2. Configure the Agent
    const AICoder = createAgent<AgentState> ({
      name: "AICoder",
      description: "An Expert AI coding agent",
      system: PROMPT,
      model: openai({
        model: "llama-3.3-70b-versatile",
        apiKey: process.env.GROQ_API_KEY,
        baseUrl: "https://api.groq.com/openai/v1",
      }),
      tools: [
        // --- TERMINAL TOOL ---
        createTool({
          name: "terminal",
          description: "Use the terminal to run commands",
          parameters: z.object({ command: z.string() }),
          handler: async ({ command }, { step }) => {
            return await step?.run("terminal", async () => {
              const buffers = { stdout: "", stderr: "" };
              try {
                const sandbox = await getSandbox(sandboxId);
                const result = await sandbox.commands.run(command, {
                    onStdout: (data: string) => { buffers.stdout += data; },
                    onStderr: (data: string) => { buffers.stderr += data; },
                });
                return result.stdout;
              } catch (e) {
                return `Command failed: ${e}\nstdout: ${buffers.stdout}\nstderr: ${buffers.stderr}`;
              }
            });
          }
        }),

        // --- FILE TOOL (THIS IS THE ONLY THING I MODIFIED TO FIX YOUR BUILD ERRORS) ---
       // ... inside functions.ts tools ...
// ... inside functions.ts tools ...

        createTool({
          name: "createOrUpdateFiles",
          description: "Create or update files in the sandbox",
          parameters: z.object({
            files: z.array(
              z.object({
                path: z.string(),
                content: z.string(),
              }),
            ),
          }),
          handler: async ({ files }, { step, network }: Tool.Options<AgentState> ) => {
            const newFiles = await step?.run("createOrUpdateFiles", async () => {
              try {
                const updatedFiles = network.state.data.files || {};
                const sandbox = await getSandbox(sandboxId);

                for (const file of files) {
                  let cleanContent = file.content;

                  // --- SANITIZER (CRITICAL FIXES) ---

                  // 1. Remove Markdown Code Blocks
                  cleanContent = cleanContent.replace(/^```[a-z]*\n?/im, "").replace(/```$/im, "");

                  // 2. Fix literal "\n" strings
                  if (cleanContent.includes("\\n")) {
                    cleanContent = cleanContent.replace(/\\n/g, "\n");
                  }

                  // 3. Fix "use client" Syntax
                  const useClientRegex = /^['"]?use client['"]?;?\s*/i;
                  if (cleanContent.trim().match(useClientRegex)) {
                     cleanContent = cleanContent.replace(useClientRegex, "");
                     cleanContent = '"use client";\n' + cleanContent;
                  }

                  // 4. Fix Hallucinated "Heading" Component
                  if (cleanContent.includes("Heading")) {
                    cleanContent = cleanContent.replace(/import\s+.*Heading.*\s+from\s+['"].*['"];?/g, "");
                    cleanContent = cleanContent.replace(/<Heading/g, "<h1").replace(/<\/Heading>/g, "</h1>");
                  }

                  // 5. (NEW) Fix Hallucinated Layout Components (Footer, Navigation, etc.)
                  // The AI invents these, but they don't exist. We strip the import and the tag.
                  const badComponents = ["Footer", "Navigation", "Header", "Sidebar"];
                  badComponents.forEach(comp => {
                    if (cleanContent.includes(comp)) {
                        // Remove the import line (e.g., import Footer from '@/components/ui/footer')
                        const importRegex = new RegExp(`import\\s+.*${comp}.*\\s+from\\s+['"].*['"];?`, 'g');
                        cleanContent = cleanContent.replace(importRegex, "");
                        
                        // Remove the tag usage (e.g., <Footer />)
                        const tagRegex = new RegExp(`<${comp}\\s*\\/?>`, 'g');
                        cleanContent = cleanContent.replace(tagRegex, "");
                    }
                  });

                  // --- END SANITIZER ---

                  await sandbox.files.write(file.path, cleanContent);
                  updatedFiles[file.path] = cleanContent;
                }
                return updatedFiles;
              } catch (e) {
                return "Error: " + e;
              }
            });

            if (typeof newFiles === "object") {
              network.state.data.files = newFiles;
            }
          }
        }),
        // --- READ TOOL ---
        createTool({
            name: "readFiles",
            description: "Read files from the sandbox",
            parameters: z.object({ files: z.array(z.string()) }),
            handler: async ({ files }, { step }) => {
                return await step?.run("readFiles", async () => {
                    try {
                        const sandbox = await getSandbox(sandboxId);
                        const results = [];
                        for (const f of files) results.push(await sandbox.files.read(f));
                        return JSON.stringify(results);
                    } catch(e) { return "Error reading: " + e}
                })
            }
        })
      ],
      // --- RESTORING YOUR LIFECYCLE LOGIC ---
      lifecycle: {
        onResponse: async ({ result, network}) => {
          const lastAssistantMessageText = lastAssistantTextMesageContent(result);
          if (lastAssistantMessageText && network){
            if(lastAssistantMessageText.includes("<task_summary>")){
              network.state.data.summary = lastAssistantMessageText;
            }
          }
          return result;
        },
      },
    });

    // --- RESTORING YOUR NETWORK LOGIC ---
    const network = createNetwork<AgentState>({
      name: "coding-agent-network",
      agents: [AICoder],
      maxIter: 5,
      router: async ({ network }) => {
        const summary = network.state.data.summary;
        if (summary){
          return;
        }
        return AICoder;
      },
    });

    const result = await network.run(event.data.value);
    
    const isError = !result.state.data.summary || Object.keys(result.state.data.files || {}).length === 0;

    const sandboxUrl = await step.run("get-sandbox-url", async () => {
      const sandbox = await getSandbox(sandboxId);
      const host = sandbox.getHost(3000);
      return `https://${host}`;
    });

    await step.run("save-result", async () => {
      
      if (isError){
        return await prisma.message.create({
          data:{
            projectId: event.data.projectId,
            content: "Agent failed to produce a valid result.",
            role: "ASSISTANT",
            type: "ERROR",
          },
        });
      }

      return await prisma.message.create({
        data:{
          projectId: event.data.projectId,
          content: result.state.data.summary,
          role: "ASSISTANT",
          type: "RESULT",
          fragment: {
            create:{
              sandboxUrl: sandboxUrl,
              title: "Fragment",
              files: result.state.data.files,
            },
          },
        },
      })
    });

    return {
       url: sandboxUrl,
       title: "Fragment",
       files: result.state.data.files,
       summary: result.state.data.summary,
    };
  },
);