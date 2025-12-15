import { Button } from "@/components/ui/button";
import { useAuth } from "@clerk/nextjs";
import { formatDuration, intervalToDuration } from "date-fns";
import { CrownIcon } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";

interface Props {
  points: number;
  msBeforeNext: number;
}

export const Usage = ({ points, msBeforeNext }: Props) => {

    const { has } = useAuth();
    const hasProAccess = has?.({ plan: "pro" });
  const resetDuration = useMemo(() => {
  if (!msBeforeNext || msBeforeNext <= 0) {
    return "soon";
  }



  const now = new Date();
  const end = new Date(now.getTime() + msBeforeNext);

  const duration = formatDuration(
    intervalToDuration({
      start: now,
      end,
    }),
    {
      format: ["months", "days", "hours"],
    }
  );

  return duration || "soon";
}, [msBeforeNext]);



  return (
    <div className="rounded-t-xl bg-background border border-b-0 p-2.5">
      <div className="flex items-center gap-x-2">
        <div>
          <p className="text-sm">{points} {hasProAccess ? " ": "free"} credits remaining</p>
          <p className="text-xs text-muted-foreground">
            Resets in {resetDuration}
          </p>
        </div>
         {!hasProAccess && (
        <Button asChild size="sm" variant="tertiary" className="ml-auto">
          <Link href="/pricing">
            <CrownIcon className="mr-1 h-4 w-4" />
            Upgrade
          </Link>
        </Button>
         )}
      </div>
    </div>
  );
};
