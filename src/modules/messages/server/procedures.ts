import z from "zod";
import prisma from "@/lib/db";
import { inngest } from "@/inngest/client";

import { baseProcedure, createTRPCRouter } from "@/trpc/init";



export const messagesRouter = createTRPCRouter({
    getMany: baseProcedure
    .query(async () => {
        const message = await prisma.message.findMany({
            orderBy: {
                updatedAt: 'desc',
            },
          
        });
        return message;
    }),

    create: baseProcedure
    .input(
        z.object({
            value: z.string().min(1, { message:"Message cannot be empty" } ),
        })
    )
    .mutation(async ({ input }) => {
        // Logic to create a message
      const createMessage = await prisma.message.create({
            data: {
                content: input.value,
                role: "USER",
                type: "RESULT",
            },
        });

         await inngest.send({
                   name: "AICoder/run",
                  data: {
                     value: input.value, }
              });
        return createMessage;
      
    }),
});