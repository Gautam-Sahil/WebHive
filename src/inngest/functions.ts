
import { Sandbox } from "@e2b/code-interpreter";
import { createAgent, openai } from "@inngest/agent-kit";
import { inngest } from "./client";
import { getSandbox } from "./utils";


export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    const sandboxId = await step.run("get-sandbox-id", async () =>{
      const sandbox = await Sandbox.create("webhive-nextjs-test")
      return sandbox.sandboxId;
    });
    const summarizer = createAgent({
      name: "summarizer",
      system: "You are next.js developer. you write the readable and maintnable code. you write simple next.js and react snippets",
      model: openai({
        // 1. THIS IS THE FIX: The new, supported Groq model
        model: "llama-3.3-70b-versatile", 
        
        // 2. Your Groq API Key
        apiKey: process.env.GROQ_API_KEY,
        
        // 3. Groq Base URL
        baseUrl: "https://api.groq.com/openai/v1",
      }),
    });

    const { output } = await summarizer.run(
      `write the following snippets: ${event.data.value}`
    );

    console.log("Agent Output:", output);

 const sandboxUrl = await step.run("get-sandbox-url", async () =>{
   const sandbox = await getSandbox(sandboxId);
   const host = sandbox.getHost(3000);
   return `https://${host}`;
 })

    return { output, sandboxUrl };
  },
);