"use client";

import { z } from "zod"
import { toast } from "sonner";
import { useState } from "react";
import { useClerk } from "@clerk/nextjs";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import TextareaAutosize from "react-textarea-autosize";
import { ArrowUpIcon, Loader2Icon } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { useTRPC } from "@/trpc/client";
import { Button } from "@/components/ui/button";
import { Form, FormField } from "@/components/ui/form";
import { PROJECT_TEMPLATES } from "../../contant";






const formShema = z.object({
    value: z.string()
            .min(1, { message:"Message cannot be empty" } )
            .max(10000, { message: "Message cannot exceed 1000 characters"
                }),
})


export const ProjectForm = () => {
const router = useRouter();
const trpc = useTRPC();
const clerk = useClerk();
const queryClient = useQueryClient();
 const form = useForm<z.infer<typeof formShema>>({
  resolver: zodResolver(formShema),
  defaultValues:{
    value: "",
  },
 });

 const createProject = useMutation(trpc.projects.create.mutationOptions({
  onSuccess: (data) =>{
    queryClient.invalidateQueries(
      trpc.projects.getMany.queryOptions(),
    );

     queryClient.invalidateQueries( trpc.usage.status.queryOptions(),);


    router.push(`/projects/${data.id}`);
   

  },
  onError: (error) =>{
    toast.error(error.message);
    if(error.data?.code === "UNAUTHORIZED"){
      clerk.openSignIn();
    }

    if(error.data?.code === "TOO_MANY_REQUESTS") {
         router.push("/pricing")
    }
    
  },
 }));
  
 const onSubmit = async (values: z.infer<typeof formShema>) => {
  await createProject.mutateAsync({
    value: values.value,
  })
 };
 const onSelect = (value:string) => {
    form.setValue("value", value,{
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
    });
 };
 
   const [isFocused, setIsFocused] = useState(false);
 const isPending = createProject.isPending;
 const isButtonDisabled = isPending || !form.formState.isValid;
 
   

  return (
 
    <Form {...form}>
           <section className="space-y-6">
 <form
  onSubmit={form.handleSubmit(onSubmit)}
  className="relative group"
>
  {/* glow */}
  <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-teal-500/50 via-cyan-500/50 to-blue-500/50 blur-2xl opacity-0 group-hover:opacity-40 transition-all duration-500" />

  <div
    className={cn(
      "relative rounded-2xl bg-gradient-to-br from-gray-900 to-black border-2 shadow-2xl transition-all",
      isFocused ? "border-teal-200" : "border-amber-400"
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
            minRows={3}
            maxRows={undefined}
  style={{ overflowY: "hidden" }}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Describe what you want to build..."
         className={cn(
    "w-full min-h-[120px] px-6 py-6 pr-28 resize-none bg-transparent",
    "border-none outline-none text-base text-white", "placeholder:text-muted-foreground leading-relaxed", "overflow-y-auto scrollbar-hide" 

)}

            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                e.preventDefault();
                form.handleSubmit(onSubmit)(e);
              }
            }}
          />

          {/* submit */}
        <div className="absolute right-6 bottom-9 translate-y-1/2 ">

            <Button
              type="submit"
              disabled={isButtonDisabled}
              className={cn(
                "w-11 h-11 rounded-xl transition-all",
                isButtonDisabled
                  ? "bg-muted dark:bg-amber-300/40 text-muted-foreground cursor-not-allowed"
                  : "bg-gradient-to-br from-blue-500 to-cyan-500 shadow-lg shadow-blue-500/40 hover:scale-110 active:scale-95"
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

    {/* footer */}
    {isFocused && (
      <div className="flex items-center justify-between px-6 py-4 border-t border-blue-500/50 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <span className="size-2 rounded-full bg-cyan-500 animate-pulse" />
          AI generation ready
        </div>
        <div>
          <kbd className="px-2 py-1 rounded bg-muted border mx-1">⌘</kbd>
          <kbd className="px-2 py-1 rounded bg-muted border mx-1">↵</kbd>
         <span className="text-teal-400">to submit</span>
        </div>
      </div>
    )}
  </div>
</form>
      <div className="flex-wrap justify-center gap-2 hidden md:flex max-w-3xl ">
        {PROJECT_TEMPLATES.map((template) => (
            <Button key={template.title}
            variant="outline"
            size="sm"
            className="bg-white dark:bg-sidebar dark:hover:bg-teal-500/50"
            onClick={() => onSelect(template.prompt)}>
                {template.emoji} {template.title}


            </Button>
        ))}

      </div>
      </section>
       </Form>
       
    
  );
};