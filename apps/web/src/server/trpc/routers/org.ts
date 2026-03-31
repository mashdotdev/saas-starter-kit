import { protectedProcedure, router } from "@/server/trpc/init";

export const orgRouter = router({
  // Stub — org management coming in Phase 2
  list: protectedProcedure.query(async ({ ctx }) => {
    return ctx.prisma.membership.findMany({
      where: { userId: ctx.session.user.id },
      include: { org: true },
    });
  }),
});
