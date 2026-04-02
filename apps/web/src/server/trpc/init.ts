import { initTRPC, TRPCError } from "@trpc/server";
import { cache } from "react";
import { headers } from "next/headers";
import { auth } from "@/server/auth";
import { prisma } from "@/server/db";
import { getActiveOrgId } from "@/lib/active-org";

export const createTRPCContext = cache(async () => {
  const h = await headers();
  const session = await auth.api.getSession({ headers: h });
  return { session, prisma };
});

type Context = Awaited<ReturnType<typeof createTRPCContext>>;

const t = initTRPC.context<Context>().create();

export const router = t.router;
export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.session) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({ ctx: { ...ctx, session: ctx.session } });
});

export const orgProcedure = protectedProcedure.use(async ({ ctx, next }) => {
  const activeOrgId = await getActiveOrgId();
  const membership = await ctx.prisma.membership.findFirst({
    where: {
      userId: ctx.session.user.id,
      ...(activeOrgId ? { orgId: activeOrgId } : {}),
    },
    include: { org: true },
    orderBy: { joinedAt: "asc" },
  });
  if (!membership) {
    throw new TRPCError({ code: "FORBIDDEN", message: "No org membership found" });
  }
  return next({ ctx: { ...ctx, org: membership.org, membership } });
});

export const adminProcedure = orgProcedure.use(({ ctx, next }) => {
  if (ctx.membership.role !== "admin") {
    throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
  }
  return next({ ctx });
});
