import z from "zod";
import prisma from "@/lib/db";
import { inngest } from "@/inngest/client";

import { baseProcedure, createTRPCRouter } from "@/trpc/init";



export const messagesRouter = createTRPCRouter({
    getMany: baseProcedure
    .input(
        z.object({
            projectId: z.string().min(1, { message:"Project ID cannot be empty"  }),
        })
    ) 

    .query(async ({ input }) => {
        const message = await prisma.message.findMany({
            where: {
                projectId: input.projectId,
            },
            include :{
                fragment: true,
            },
            orderBy: {
                updatedAt: 'asc',
            },
          
        });
        return message;
    }),

    create: baseProcedure
    .input(
        z.object({
            value: z.string()
            .min(1, { message:"Message cannot be empty" } )
            .max(10000, { message: "Message cannot exceed 1000 characters"
                }),
                projectId: z.string().min(1, { message:"Project ID cannot be empty"  }),
        })
    )
    .mutation(async ({ input }) => {
        // Logic to create a message
      const createMessage = await prisma.message.create({
            data: {
                    projectId: input.projectId,
                content: input.value,
                role: "USER",
                type: "RESULT",
            },
        });

         await inngest.send({
                   name: "AICoder/run",
                  data: {
                     value: input.value,
                     projectId: input.projectId,
                    },
              });
        return createMessage;
      
    }),
});