

import { createAgent, openai } from "@inngest/agent-kit";
import { inngest } from "./client";

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event }) => {

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
    return { output };
  },
);