"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button"; // ⬅️ shadcn button stays
import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";

const Home = () => {
  const [value, setName] = useState<string>("");
  const trpc = useTRPC();
  const invoke = useMutation(trpc.invoke.mutationOptions({}));

  return (
    <div className="p-4 max-w-7xl mx-auto space-y-4">
      <input
        type="text"
        placeholder="Enter your name"
        value={value}
        onChange={(e) => setName(e.target.value)}
        className="border p-2 rounded w-full"
      />

      <Button
        disabled={invoke.isPending}
        onClick={() => invoke.mutate({ value: value })}
      >
        Submit
      </Button>
    </div>
  );
};

export default Home;
