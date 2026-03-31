import { protectedProcedure, router } from "@/server/trpc/init";

export const userRouter = router({
  me: protectedProcedure.query(({ ctx }) => {
    return ctx.session.user;
  }),
});
