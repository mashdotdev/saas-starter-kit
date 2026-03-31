import { z } from "zod";
import { protectedProcedure, router } from "@/server/trpc/init";
import { createCheckoutUrl, createPortalUrl } from "@/lib/lemon-squeezy";

export const billingRouter = router({
  checkout: protectedProcedure
    .input(z.object({ orgId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const url = await createCheckoutUrl({
        userId: ctx.session.user.id,
        orgId: input.orgId,
        userEmail: ctx.session.user.email,
      });
      return { url };
    }),

  portal: protectedProcedure
    .input(z.object({ orgId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const org = await ctx.prisma.org.findUniqueOrThrow({
        where: { id: input.orgId },
        select: { lemonSqueezyId: true },
      });
      if (!org.lemonSqueezyId) {
        throw new Error("No active subscription found");
      }
      const url = await createPortalUrl(org.lemonSqueezyId);
      return { url };
    }),
});
