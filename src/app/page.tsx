
"use client";

import { Button } from "@/components/ui/button";
import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";

const Home =  () => {
  const trpc = useTRPC();
  const invoke = useMutation(trpc.invoke.mutationOptions({}));

  return (
   <div className="p-4 max-4-7xl mx-auto">
    <Button disabled={invoke.isPending} onClick={() => invoke.mutate({ text: "Gautam"})} >Hello World</Button>
   </div>
    );
}

export default Home;