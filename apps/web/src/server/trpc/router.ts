import { router } from "@/server/trpc/init";
import { userRouter } from "@/server/trpc/routers/user";
import { orgRouter } from "@/server/trpc/routers/org";
import { billingRouter } from "@/server/trpc/routers/billing";
import { aiRouter } from "@/server/trpc/routers/ai";

export const appRouter = router({
  user: userRouter,
  org: orgRouter,
  billing: billingRouter,
  ai: aiRouter,
});

export type AppRouter = typeof appRouter;
