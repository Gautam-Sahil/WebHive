import { Sandbox } from "@e2b/code-interpreter";
import { createAgent, createNetwork, createTool, openai, type Message, createState } from "@inngest/agent-kit";
import { inngest } from "./client";
import { getSandbox, lastAssistantTextMesageContent, parseAgentOutput } from "./utils";
import { z } from "zod";
import { FRAGMENT_TITLE_PROMPT, PROMPT, RESPONSE_PROMPT } from "@/prompt";
import prisma from "@/lib/db";

interface AgentState {
  summary: string;
  files: { [path: string]: string };
}

export const AICoderFunction = inngest.createFunction(
  { id: "AICoder" },
  { event: "AICoder/run" },
  async ({ event, step }) => {
    
    // 1. Initialize Sandbox
    const sandboxId = await step.run("get-sandbox-id", async () => {
      const sandbox = await Sandbox.create("webhive-nextjs-test");
      await sandbox.setTimeout(15 * 60_000); 
      return sandbox.sandboxId;
    });

    // 2. Load History
    const previousMessage = await step.run("get-previous-messages", async () => {
      const formattedMessages: Message[] = [];
      const messages = await prisma.message.findMany({
        where: { projectId: event.data.projectId },
        orderBy: { createdAt: "desc" },
        take: 5,
      });
      for (const message of messages) {
        formattedMessages.push({
          type: "text",
          role: message.role === "ASSISTANT" ? "assistant" : "user",
          content: message.content,
        });
      }
      return formattedMessages.reverse();
    });

    const state = createState<AgentState>({
      summary: "",
      files: {},
    }, { messages: previousMessage });

    // 3. Configure the Agent
    const AICoder = createAgent<AgentState>({
      name: "AICoder",
      description: "An Expert AI coding agent",
      system: PROMPT,
      model: openai({
        model: "mistralai/devstral-2512:free",
        apiKey: process.env.OPENROUTER_API_KEY,
        baseUrl: "https://openrouter.ai/api/v1",
      }),
      tools: [
        createTool({
          name: "terminal",
          description: "Use the terminal to run commands",
          parameters: z.object({ command: z.string() }),
          handler: async ({ command }) => {
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
          }
        }),

        createTool({
          name: "createOrUpdateFiles",
          description: "Create or update files in the sandbox",
          parameters: z.object({
            files: z.array(z.object({ path: z.string(), content: z.string() })),
          }),
          handler: async ({ files }, { network }) => {
            try {
              const updatedFiles = network.state.data.files || {};
              const sandbox = await getSandbox(sandboxId);

              for (const file of files) {
                let cleanContent = file.content;
                // Cleanup
                cleanContent = cleanContent.replace(/^```[a-z]*\n?/im, "").replace(/```$/im, "");
                if (cleanContent.includes('\\"')) cleanContent = cleanContent.replace(/\\"/g, '"');
                if (cleanContent.includes('\\n')) cleanContent = cleanContent.replace(/\\n/g, '\n');
                if (cleanContent.startsWith('"') && cleanContent.endsWith('"')) cleanContent = cleanContent.slice(1, -1);
                
                // Fix Home/Page conflict
                if (cleanContent.includes("import { Home") || cleanContent.includes("import {Home")) {
                    cleanContent = cleanContent.replace(/export default function Home\(\)/g, "export default function Page()");
                }
                
                // Fix Use Client
                const useClientRegex = /^['"]?use client['"]?;?\s*/im;
                cleanContent = cleanContent.replace(useClientRegex, ""); 

                // --- CHECK IF COMPONENT IS ALREADY DEFINED ---
                const definesButton = /const\s+Button\s*=|function\s+Button\s*\(|class\s+Button\s+/.test(cleanContent);
                const definesCard = /const\s+Card\s*=|function\s+Card\s*\(|class\s+Card\s+/.test(cleanContent);
                const definesInput = /const\s+Input\s*=|function\s+Input\s*\(|class\s+Input\s+/.test(cleanContent);

                let extraImports = "";
                // Only inject import if it's used AND not defined locally
                if (cleanContent.includes("<Card") && !cleanContent.includes("@/components/ui/card") && !definesCard) {
                    extraImports += `import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card";\n`;
                }
                if (cleanContent.includes("<Button") && !cleanContent.includes("@/components/ui/button") && !definesButton) {
                    extraImports += `import { Button } from "@/components/ui/button";\n`;
                }
                if (cleanContent.includes("<Input") && !cleanContent.includes("@/components/ui/input") && !definesInput) {
                    extraImports += `import { Input } from "@/components/ui/input";\n`;
                }

                // Reassemble
                const needsClient = file.path.includes("page.tsx") || cleanContent.includes("useState") || cleanContent.includes("useEffect") || cleanContent.includes("onClick");
                if (needsClient) {
                    cleanContent = `"use client";\n` + extraImports + cleanContent;
                } else {
                    cleanContent = extraImports + cleanContent;
                }
                
                await sandbox.files.write(file.path, cleanContent);
                updatedFiles[file.path] = cleanContent;
              }
              network.state.data.files = updatedFiles;
              return updatedFiles;
            } catch (e) { return "Error writing files: " + e; }
          }
        }),
        createTool({
          name: "readFiles",
          description: "Read files from the sandbox",
          parameters: z.object({ files: z.array(z.string()) }),
          handler: async ({ files }) => {
              try {
                const sandbox = await getSandbox(sandboxId);
                const results = [];
                for (const f of files) results.push(await sandbox.files.read(f));
                return JSON.stringify(results);
              } catch (e) { return "Error reading: " + e; }
          }
        })
      ],
      lifecycle: {
        onResponse: async ({ result, network }) => {
          const lastAssistantMessageText = lastAssistantTextMesageContent(result);
          if (lastAssistantMessageText && network && lastAssistantMessageText.includes("<task_summary>")) {
              network.state.data.summary = lastAssistantMessageText;
          }
          return result;
        },
      },
    });

    const network = createNetwork<AgentState>({
      name: "coding-agent-network",
      agents: [AICoder],
      maxIter: 5,
      defaultState: state,
      router: async ({ network }) => {
        if (network.state.data.summary) return;
        return AICoder;
      },
    });

    // 4. Run the coding logic
    const result = await network.run(event.data.value, { state });

    let finalSummary = result.state.data.summary;
    const hasFiles = Object.keys(result.state.data.files || {}).length > 0;
    if (!finalSummary && hasFiles) {
      finalSummary = "<task_summary>I have generated the requested application files.</task_summary>";
    }

    // 5. Generate UI Titles 
    const fragmentTitleGenerator = createAgent({
      name: "fragment-title-generator",
      system: FRAGMENT_TITLE_PROMPT,
      model: openai({ model: "llama-3.1-8b-instant", apiKey: process.env.GROQ_API_KEY, baseUrl: "https://api.groq.com/openai/v1" }),
    });

    const responsegenerator = createAgent({
      name: "response-generator",
      system: RESPONSE_PROMPT,
      model: openai({ model: "llama-3.1-8b-instant", apiKey: process.env.GROQ_API_KEY, baseUrl: "https://api.groq.com/openai/v1" }),
    });

    const { output: fragmentTitleOutput } = await fragmentTitleGenerator.run(finalSummary || "App");
    const { output: responseOutput } = await responsegenerator.run(finalSummary || "App built");

    const isError = !hasFiles;

    const sandboxUrl = await step.run("get-sandbox-url", async () => {
      const sandbox = await getSandbox(sandboxId);
      const host = sandbox.getHost(3000);
      return `https://${host}`;
    });

    // 6. SAVE RESULT FIRST
    await step.run("save-result", async () => {
      if (isError) {
        return await prisma.message.create({
          data: { projectId: event.data.projectId, content: "Agent failed.", role: "ASSISTANT", type: "ERROR" },
        });
      }
      return await prisma.message.create({
        data: {
          projectId: event.data.projectId,
          content: parseAgentOutput(responseOutput),
          role: "ASSISTANT",
          type: "RESULT",
          fragment: {
            create: { sandboxUrl: sandboxUrl, title: parseAgentOutput(fragmentTitleOutput), files: result.state.data.files },
          },
        },
      });
    });

    // 7. RENAME PROJECT (STRICT 2 WORDS)
    await step.run("generate-project-name", async () => {
        try {
            const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    model: "llama-3.1-8b-instant",
                    messages: [
                        { 
                          role: "system", 
                          // STRICT PROMPT FOR 2 WORDS
                          content: "You are a Project naming bot generator. Reply with a JSON object containing a 'name' field. The name must be meaningful according to prompt and  STRICTLY 1 or 2 words(max) maximum words. Example: {\"name\": \"Calculator App\"}" 
                        },
                        { role: "user", content: `User Prompt: ${event.data.value}` }
                    ],
                    response_format: { type: "json_object" },
                    max_tokens: 50 
                })
            });

            if (!response.ok) return;

            const data = await response.json();
            let cleanName = "New Project";
            try {
                const parsed = JSON.parse(data.choices?.[0]?.message?.content);
                cleanName = parsed.name || "New Project";
            } catch (e) {
               cleanName = data.choices?.[0]?.message?.content?.split(" ")[0] || "New Project";
            }

            // CLEANUP & HARD LIMIT TO 3 WORDS MAX (Just in case AI hallucinates 4 words)
            // .slice(0, 3) ensures the array never has more than 3 parts (e.g. "future-autopilot-landing" -> "future-autopilot-landing")
            // If result was "future-autopilot-landing-page", it becomes "future-autopilot-landing"
            cleanName = cleanName.toLowerCase()
                .replace(/[^a-z0-9-]/g, "") // remove special chars
                .split(" ")
                .slice(0, 3) // <--- THIS IS THE HARD SCISSOR
                .join(" ");

            if (cleanName && cleanName.length > 2) {
                await prisma.project.update({
                    where: { id: event.data.projectId },
                    data: { name: cleanName }
                });
            }
        } catch (error) {
            console.error("Renaming failed:", error);
        }
    });

    return {
      url: sandboxUrl,
      title: "Fragment",
      files: result.state.data.files,
      summary: finalSummary,
    };
  },
);