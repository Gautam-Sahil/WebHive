import z from "zod";
import prisma from "@/lib/db";
import { inngest } from "@/inngest/client";
import { generateSlug } from "random-word-slugs"
import { protectedProcedure, createTRPCRouter } from "@/trpc/init";

import { TRPCError } from "@trpc/server";
import { consumeCredits } from "@/lib/usage";



export const projectsRouter = createTRPCRouter({
    getOne: protectedProcedure
    .input(z.object({
        id: z.string().min(1, { message:"Project ID cannot be empty"  }),
    }))
    .query(async ({input, ctx}) => {
        const existingproject = await prisma.project.findUnique({
            where: { id: input.id,
                userId: ctx.auth.userId,
             },
        });
       if (!existingproject) {
        throw new TRPCError({
            code: "NOT_FOUND",
            message: "Project not found",
        });
       }

        return existingproject;
    }),

    getMany: protectedProcedure
    .query(async ({ ctx }) => {
        const projects = await prisma.project.findMany({
            where: {
              userId: ctx.auth.userId,
            },
            orderBy: {
                updatedAt: 'desc',
            },
          
        });
        return projects;
    }),

    create: protectedProcedure
    .input(
        z.object({
            value: z.string()
            .min(1, { message:"Promt cannot be empty" } )
            .max(10000, { message: "Promt cannot exceed 1000 characters" }),

        })
    )
    .mutation(async ({ input, ctx }) => {
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
         const createdProject = await prisma.project.create({
            data: {
                userId: ctx.auth.userId,
                name: generateSlug(2, { format: "kebab", }),
                messages: {create: {
                    content: input.value,
                    role: "USER",
                    type: "RESULT",
                }, },
            },
        });
     


         await inngest.send({
                   name: "AICoder/run",
                  data: {
                     value: input.value,
                     projectId: createdProject.id,
                    },
              });
        return createdProject;
      
    }),
});