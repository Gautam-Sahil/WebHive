import z from "zod";
import prisma from "@/lib/db";
import { inngest } from "@/inngest/client";

import { protectedProcedure, createTRPCRouter } from "@/trpc/init";
import { auth } from '@clerk/nextjs/server';
import { TRPCError } from "@trpc/server";
import { consumeCredits } from "@/lib/usage";



export const messagesRouter = createTRPCRouter({
    getMany: protectedProcedure
    .input(
        z.object({
            projectId: z.string().min(1, { message:"Project ID cannot be empty"  }),
        })
    ) 

    .query(async ({ input, ctx }) => {
        const message = await prisma.message.findMany({
            where: {
                projectId: input.projectId,
                project:{
                    userId: ctx.auth.userId,
                }
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

    create: protectedProcedure
    .input(
        z.object({
            value: z.string()
            .min(1, { message:"Message cannot be empty" } )
            .max(10000, { message: "Message cannot exceed 1000 characters"
                }),
                projectId: z.string().min(1, { message:"Project ID cannot be empty"  }),
        })
    )
    .mutation(async ({ input, ctx }) => {
        const existingproject = await prisma.project.findUnique({
            where: {
                id: input.projectId,
                userId: ctx.auth.userId,
            },
        });

        if(!existingproject){
            throw new TRPCError({
                code: "NOT_FOUND", 
                message: "Project Not Found"
            });
        }
        
        // --- FIX STARTS HERE ---
        try {
            await consumeCredits(); 
        } catch (error) {
            // Check if it's our specific credit error
            if (error instanceof Error && error.message === "You have ran out of credits") {
                throw new TRPCError({
                    code: "TOO_MANY_REQUESTS",
                    message: "You have ran out of credits"
                });
            }

            // Otherwise, it's a real unexpected error
            throw new TRPCError({ 
                code: "BAD_REQUEST", 
                message: "Something went wrong." 
            });
        }
        // --- FIX ENDS HERE ---
       
        // Logic to create a message
      const createMessage = await prisma.message.create({
            data: {
                    projectId: existingproject.id,
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