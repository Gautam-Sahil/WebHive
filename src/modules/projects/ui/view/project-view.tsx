"use client";


import { Suspense, useState } from "react";
import { Fragment } from "@/generated/prisma/client";
import { MessagesContainer } from "../components/messages-container";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { ProjectHeader } from './../components/project-header';

interface props {
  projectId: string;
}

export const ProjectView = ({ projectId }: props) => {
   
   const [activeFragment, setActiveFragment] = useState<Fragment | null>(null);
   

  return (
    <div className="h-screen">
        <ResizablePanelGroup direction="horizontal">
            <ResizablePanel
             defaultSize={35}
              minSize={20}
              className="flex flex-col min-h-0" >
               <Suspense fallback={<p> Loading projects...</p>}>
                <ProjectHeader
                projectId={projectId}
                /></Suspense>
                <Suspense fallback={
               <p>lodding messages...</p>
                }>
      <MessagesContainer projectId={projectId}
      activeFragment={activeFragment}
      setActiveFragment={setActiveFragment}

      /></Suspense>
      </ResizablePanel>
        <ResizableHandle withHandle/>
            <ResizablePanel
             defaultSize={65}
              minSize={50} >
       TODO: Preview
        </ResizablePanel>
            
        </ResizablePanelGroup>
    </div>
  );
};
