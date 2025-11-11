import { inngest } from "@/inngest/client";
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { generateText } from 'ai';
import prisma from "@/lib/db";

const google = createGoogleGenerativeAI();

export const execute = inngest.createFunction(
  { id: "execute-ai" },
  { event: "execute/ai" },
  async ({ event , step }) => {
   const {steps} = await step.ai.wrap(
    "gemini-generate-text",
    generateText,{
      model : google("gemini-2.5-flash"),
      system : "You are a helpful assistant.",
      prompt : "Can you help me to explain what is cryptography ? "
    }
   )
   return step;
  },
);