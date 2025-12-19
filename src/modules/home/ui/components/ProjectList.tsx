"use client";

import { Button } from "@/components/ui/button";
import { useTRPC } from "@/trpc/client";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import Image from "next/image";
import Link from "next/link";

export const ProjectList = () => {
  const trpc = useTRPC();
  const { user } = useUser();
  
  // FIX: Added refetchInterval here too
  const { data: projects } = useQuery({
    ...trpc.projects.getMany.queryOptions(),
    refetchInterval: 5000, // Check every 5 seconds
  });

  if (!user) return null;

  return (
    <div
      className="
    w-full rounded-xl p-8 border
    flex flex-col gap-y-6 sm:gap-y-4
    bg-white
    bg-[url('https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/hero/gradientBackground.png')]
    bg-cover bg-center bg-no-repeat
    dark:bg-sidebar
  "
    >
      <h2 className="text-2xl font-semibold">
        {user?.firstName}&apos;s Projects
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {projects?.length === 0 && (
          <div className="col-span-full text-center">
            <p className="text-sm text-muted-foreground">No Projects Found</p>
          </div>
        )}
        {projects?.map((project) => (
          <Button
            key={project.id}
            variant="outline"
            className="font-normal h-auto justify-start w-full text-start p-4
  bg-white/80 dark:bg-black/40
  backdrop-blur-md
  border border-black/20"
            asChild
          >
            <Link href={`/projects/${project.id}`}>
              <div className="flex items-center gap-x-4">
                <Image
                  src="/beyond.png"
                  alt="Webhive"
                  width={32}
                  height={32}
                  className="object-contain rounded-full"
                />
                <div className="flex flex-col">
                  {/* Provide a min-width so it doesn't jump too much */}
                  <h3 className="truncate font-medium min-h-[20px]">
                    {project.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {formatDistanceToNow(project.updatedAt, {
                      addSuffix: true,
                    })}
                  </p>
                </div>
              </div>
            </Link>
          </Button>
        ))}
      </div>
    </div>
  );
};