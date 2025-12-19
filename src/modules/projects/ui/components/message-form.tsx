import { z } from "zod"
import { toast } from "sonner";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Usage } from "./usage";
import { zodResolver } from "@hookform/resolvers/zod"
import TextareaAutosize from "react-textarea-autosize"
import { ArrowUpIcon, Loader2Icon } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { useTRPC } from "@/trpc/client";
import { Button } from "@/components/ui/button";
import { Form, FormField } from "@/components/ui/form";
import { useRouter } from "next/navigation";




interface props {
    projectId:string;
};

const formShema = z.object({
    value: z.string()
            .min(1, { message:"Message cannot be empty" } )
            .max(10000, { message: "Message cannot exceed 1000 characters"
                }),
})


export const MessageForm = ({ projectId }: props) => {

const trpc = useTRPC();
const router = useRouter();
const queryClient = useQueryClient();

const { data: usage } = useQuery(trpc.usage.status.queryOptions());
 const form = useForm<z.infer<typeof formShema>>({
  resolver: zodResolver(formShema),
  defaultValues:{
    value: "",
  },
 });

 const createMessage = useMutation(trpc.messages.create.mutationOptions({
  onSuccess: () =>{
    form.reset();
    queryClient.invalidateQueries(
      trpc.messages.getMany.queryOptions({
        projectId
      }),
    );
    queryClient.invalidateQueries(
      trpc.usage.status.queryOptions()
    );

  },
  onError: (error) =>{

    toast.error(error.message);
    if(error.data?.code === "TOO_MANY_REQUESTS" ) {
      router.push("/pricing");
    }
  }
 }));
  
 const onSubmit = async (values: z.infer<typeof formShema>) => {
  await createMessage.mutateAsync({
    value: values.value,
    projectId,
  })
 };
 
   const [isFocused, setIsFocused] = useState(false);
 const isPending = createMessage.isPending;
 const isButtonDisabled = isPending || !form.formState.isValid;
 
    const showUsage =!!usage;

  return (
  <Form {...form}>
  {showUsage && (
    <Usage points={usage.remainingPoints} msBeforeNext={usage.msBeforeNext} />
  )}

  <form
    onSubmit={form.handleSubmit(onSubmit)}
    className={cn(
      "relative group rounded-2xl transition-all",
      showUsage && "rounded-t-none"
    )}
  >
    {/* Glow effect */}
    <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-blue-300/40 via-cyan-300/40 to-blue-300/40 blur-2xl opacity-0 group-hover:opacity-40 transition-all duration-500" />

    <div
      className={cn(
        "relative  border  transition-all",
        "bg-white dark:bg-sidebar", // automatically adapts dark mode
        isFocused ? "border-cyan-400/70" : "border-gray-500/40"
      )}
    >
      <FormField
        control={form.control}
        name="value"
        render={({ field }) => (
          <div className="relative p-2">
            <TextareaAutosize
              {...field}
              disabled={isPending}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              minRows={2}
              maxRows={8}
              placeholder="Enter a prompt here."
              className={cn(
                "w-full px-2 py-6  resize-none bg-transparent border-none outline-none leading-relaxed",
                "text-black dark:text-white placeholder:text-muted-foreground",
                "overflow-y-auto scrollbar-hide"
              )}
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                  e.preventDefault();
                  form.handleSubmit(onSubmit)(e);
                }
              }}
            />

            {/* Submit button */}
            <div className="absolute right-6 bottom-6">
              <Button
                type="submit"
                disabled={isButtonDisabled}
                className={cn(
                  "w-10 h-10 rounded-xl transition-all",
                  isButtonDisabled
                    ? "bg-slate-300/40 text-muted-foreground cursor-not-allowed"
                    : "bg-gradient-to-br from-blue-400 to-cyan-400 shadow-lg shadow-blue-300/40 hover:scale-110 active:scale-95"
                )}
              >
                {isPending ? (
                  <Loader2Icon className="w-6 h-6 animate-spin" />
                ) : (
                  <ArrowUpIcon className="w-6 h-6" />
                )}
              </Button>
            </div>
          </div>
        )}
      />

      {/* Footer when focused */}
      {isFocused && (
        <div className="flex items-center justify-between px-6 py-4 border-t border-blue-200/50 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            AI generation ready
          </div>
          <div>
            <kbd className="px-2 py-1 rounded bg-muted border mx-1">⌘</kbd>
            <kbd className="px-2 py-1 rounded bg-muted border mx-1">↵</kbd>
            to submit
          </div>
        </div>
      )}
    </div>
  </form>
</Form>

       
    
  );
};