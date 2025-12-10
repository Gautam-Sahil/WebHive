
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { ProjectView } from "@/modules/projects/ui/view/project-view";
import { Suspense } from "react";


interface props {
  params: Promise<{
    projectId: string;
  }>
}

const page = async ({ params }:props ) => {
    const { projectId } = await params;
    
    const queryCleint = getQueryClient();
    void queryCleint.prefetchQuery(
    trpc.messages.getMany.queryOptions({
        projectId,
      }),
    );
    void queryCleint.prefetchQuery(
    trpc.projects.getOne.queryOptions({
        id: projectId,
      }),
    );

      
  return (
  
  <HydrationBoundary state={dehydrate(queryCleint)}>
    <Suspense fallback={<div>Loading project...</div>}>
   <ProjectView projectId={projectId} /></Suspense>
  </HydrationBoundary>
);
}
export default page;