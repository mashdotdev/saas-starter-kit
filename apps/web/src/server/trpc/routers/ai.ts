import { TRPCError } from "@trpc/server";
import { protectedProcedure, router } from "@/server/trpc/init";

export const aiRouter = router({
  // NOT_IMPLEMENTED — Phase 2 will add AI agent endpoints
  chat: protectedProcedure.query(() => {
    throw new TRPCError({
      code: "NOT_IMPLEMENTED",
      message: "AI features are coming in Phase 2",
    });
  }),
});
