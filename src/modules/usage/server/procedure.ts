import { getUsageStatus } from "@/lib/usage";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";

export const usageRouter = createTRPCRouter({
  status: protectedProcedure.query(async () => {
    const result = await getUsageStatus();

    if (!result) {
       // This shouldn't happen with the fix in lib/usage.ts, 
       // but strictly speaking, it handles the 'not logged in' case.
       throw new TRPCError({ 
         code: "INTERNAL_SERVER_ERROR", 
         message: "Could not fetch usage" 
       });
    }

    return result;
  }),
});