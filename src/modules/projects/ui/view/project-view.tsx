"use client";

import { Suspense, useState, useEffect } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useAuth } from "@clerk/nextjs";
import { MessagesContainer } from "../components/messages-container";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { ProjectHeader } from "../components/project-header";
import { FragmentWeb } from "../components/fragment-web";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bug, ChessQueenIcon, CodeXmlIcon, CrownIcon, HandFistIcon, } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FileExplorer } from "@/components/file-explorer";
import { UserControl } from "@/components/user-control";
import { Fragment } from "@/generated/prisma";

interface Props {
  projectId: string;
}

export const ProjectView = ({ projectId }: Props) => {
  const { has } = useAuth();
  const hasProAccess = has?.({ plan: "pro" });

  const [activeFragment, setActiveFragment] = useState<Fragment | null>(null);
  const [tabState, setTabState] = useState<"preview" | "code">("preview");

  // ✅ Client-only mount to avoid SSR hydration issues
  const [mounted, setMounted] = useState(false);
useEffect(() => setMounted(true), []); // eslint-disable-line react-hooks/set-state-in-effect
if (!mounted) return null;


  return (
    <div
      className="
        h-screen w-full
        bg-[url('https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/hero/gradientBackground.png')]
        bg-cover bg-center
        dark:bg-gradient-to-b dark:from-gray-900 dark:to-black
      "
    >
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={35} minSize={20} className="flex flex-col min-h-0">
          <ErrorBoundary fallback={<p>Project header error aaya! bhago</p>}>
            <Suspense fallback={<p>Loading projects...</p>}>
              <ProjectHeader projectId={projectId} />
            </Suspense>
          </ErrorBoundary>

          <ErrorBoundary fallback={<p>Messages Container error aaya! bhago</p>}>
            <Suspense fallback={<p>Loading messages...</p>}>
              <MessagesContainer
                projectId={projectId}
                activeFragment={activeFragment}
                setActiveFragment={setActiveFragment}
              />
            </Suspense>
          </ErrorBoundary>
        </ResizablePanel>

        <ResizableHandle className="hover:bg-primary transition-colors" />

        <ResizablePanel defaultSize={65} minSize={50}>
          <Tabs
            className="h-full gap-y-0"
            defaultValue="preview"
            value={tabState}
            onValueChange={(value) => setTabState(value as "preview" | "code")}
          >
            <div className="w-full flex items-center p-2 border-b gap-x-2">
              <TabsList className="h-8 p-0 border rounded-md">
                <TabsTrigger value="preview" className="rounded-md">
                  <Bug /> <span>Live</span>
                </TabsTrigger>
                <TabsTrigger value="code" className="rounded-md">
                  <CodeXmlIcon /> <span>Code</span>
                </TabsTrigger>
              </TabsList>

              <div className="ml-auto flex items-center gap-x-2">
                {!hasProAccess && (
                  <Button asChild size="sm" variant="tertiary">
                    <Link href="/pricing">
                      <ChessQueenIcon/> Upgrade
                    </Link>
                  </Button>
                )}
                <UserControl />
              </div>
            </div>

            <TabsContent value="preview">
              {!!activeFragment && <FragmentWeb data={activeFragment} />}
            </TabsContent>

            <TabsContent value="code" className="min-h-0">
              {!!activeFragment?.files && (
                <FileExplorer files={activeFragment.files as { [path: string]: string }} />
              )}
            </TabsContent>
          </Tabs>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};
