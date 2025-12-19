import { Button } from "@/components/ui/button";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ChevronDownIcon, ChevronLeftIcon, SunMoonIcon, Loader2 } from "lucide-react"; // Added Loader2
import Image from "next/image";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuSeparator,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuPortal,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "next-themes";

interface props {
  projectId: string;
}

export const ProjectHeader = ({ projectId }: props) => {
  const trpc = useTRPC();
  
  // FIX: Added refetchInterval to poll for name changes
  const { data: project } = useSuspenseQuery(
    {
      ...trpc.projects.getOne.queryOptions({ id: projectId }),
      refetchInterval: 4000, // Check every 4 seconds
    }
  );

  const { setTheme, theme } = useTheme();

  return (
    <header className="p-2 flex justify-between items-center border-b ">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="focus-visible:ring-0 hover:bg-transparent hover:opacity-75 transition-opacity pl-2!"
          >
            <Image
              src="/beyond.png"
              alt="webHive"
              width={18}
              height={18}
              className="rounded-full"
            />
            {/* Smooth transition for the name */}
            <span className="text-sm font-medium animate-in fade-in">
                {project.name}
            </span>
            <ChevronDownIcon />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent side="bottom" align="start" className="z-50">
          <DropdownMenuItem asChild>
            <Link href="/" className="flex items-center gap-2">
              <ChevronLeftIcon />
              <span>Go to dashboard</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="gap-2">
              <SunMoonIcon className="size-4 text-muted-foreground" />
              <span>Appearance</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuRadioGroup value={theme} onValueChange={setTheme}>
                  <DropdownMenuRadioItem value="light">
                    <span>Light</span>
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="dark">
                    <span>Dark</span>
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="System">
                    <span>System</span>
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
};