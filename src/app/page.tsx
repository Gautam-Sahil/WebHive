"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button"; // ⬅️ shadcn button stays
import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery } from "@tanstack/react-query";

const Home = () => {
  const [value, setName] = useState<string>("");
  const trpc = useTRPC();
  const { data: messages } = useQuery(trpc.messages.getMany.queryOptions());
  const createMessage = useMutation(trpc.messages.create.mutationOptions({}));

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
        disabled={createMessage.isPending}
        onClick={() => createMessage.mutate({ value: value })}
      >
        Submit
      </Button>
      {JSON.stringify(messages, null, 2)}
    </div>
  );
};

export default Home;
