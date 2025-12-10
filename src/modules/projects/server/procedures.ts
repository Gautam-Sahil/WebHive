import z from "zod";
import prisma from "@/lib/db";
import { inngest } from "@/inngest/client";
import { generateSlug } from "random-word-slugs"
import { baseProcedure, createTRPCRouter } from "@/trpc/init";

import { TRPCError } from "@trpc/server";



export const projectsRouter = createTRPCRouter({
    getOne: baseProcedure
    .input(z.object({
        id: z.string().min(1, { message:"Project ID cannot be empty"  }),
    }))
    .query(async ({input}) => {
        const existingproject = await prisma.project.findUnique({
            where: { id: input.id },
        });
       if (!existingproject) {
        throw new TRPCError({
            code: "NOT_FOUND",
            message: "Project not found",
        });
       }

        return existingproject;
    }),

    getMany: baseProcedure
    .query(async () => {
        const projects = await prisma.project.findMany({
            orderBy: {
                updatedAt: 'desc',
            },
          
        });
        return projects;
    }),

    create: baseProcedure
    .input(
        z.object({
            value: z.string()
            .min(1, { message:"Promt cannot be empty" } )
            .max(10000, { message: "Promt cannot exceed 1000 characters" }),

        })
    )
    .mutation(async ({ input }) => {
         const createdProject = await prisma.project.create({
            data: {
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