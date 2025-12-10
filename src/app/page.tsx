"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button"; // ⬅️ shadcn button stays
import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

const Home = () => {
  const router = useRouter();
  const [value, setName] = useState<string>("");
  const trpc = useTRPC();
  const createProject = useMutation(trpc.projects.create.mutationOptions({
    onError: (error) => {
      console.error("Error creating project:", error.message);
  
    },
    onSuccess: (data) => {
     router.push(`/projects/${data.id}`);
    }
  }));

  return (
    <div className="h-screen w-screen flex  justify-center items-center">
      <div className="max-w-7xl mx-auto flex flex-col items-center gap-y-4 justify-center px-4">
      <input
        type="text"
        placeholder="Enter something..."
        value={value}
        onChange={(e) => setName(e.target.value)}
        className="border p-2 rounded w-full"
      />

      <Button
        disabled={createProject.isPending}
        onClick={() => createProject.mutate({ value: value })}
      >
        Submit
      </Button>
      </div>
    </div>
  );
};

export default Home;
