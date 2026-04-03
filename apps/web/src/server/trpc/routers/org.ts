import { z } from "zod";
import { Resend } from "resend";
import { TRPCError } from "@trpc/server";
import type { PrismaClient } from "@repo/db";
type TransactionClient = Parameters<Parameters<PrismaClient["$transaction"]>[0]>[0];
import {
  adminProcedure,
  orgProcedure,
  protectedProcedure,
  router,
} from "@/server/trpc/init";
import { setActiveOrg } from "@/lib/active-org-actions";

function getResend() {
  return new Resend(process.env.RESEND_API_KEY ?? "placeholder");
}

export const orgRouter = router({
  // List all orgs the current user belongs to
  list: protectedProcedure.query(async ({ ctx }) => {
    return ctx.prisma.membership.findMany({
      where: { userId: ctx.session.user.id },
      include: { org: true },
      orderBy: { joinedAt: "asc" },
    });
  }),

  // Create a new org and auto-join as admin
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1).max(100),
        slug: z
          .string()
          .min(1)
          .max(50)
          .regex(/^[a-z0-9-]+$/, "Only lowercase letters, numbers and hyphens"),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const existing = await ctx.prisma.org.findUnique({
        where: { slug: input.slug },
      });
      if (existing) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "An org with this slug already exists",
        });
      }

      const org = await ctx.prisma.$transaction(async (tx: TransactionClient) => {
        const newOrg = await tx.org.create({
          data: { name: input.name, slug: input.slug },
        });
        await tx.membership.create({
          data: {
            userId: ctx.session.user.id,
            orgId: newOrg.id,
            role: "admin",
          },
        });
        return newOrg;
      });

      await setActiveOrg(org.id);
      return org;
    }),

  // Get current org details
  get: orgProcedure.query(async ({ ctx }) => {
    const memberCount = await ctx.prisma.membership.count({
      where: { orgId: ctx.org.id },
    });
    return { ...ctx.org, memberCount };
  }),

  // Update org name or slug (admin only)
  update: adminProcedure
    .input(
      z.object({
        name: z.string().min(1).max(100).optional(),
        slug: z
          .string()
          .min(1)
          .max(50)
          .regex(/^[a-z0-9-]+$/)
          .optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (input.slug) {
        const conflict = await ctx.prisma.org.findFirst({
          where: { slug: input.slug, NOT: { id: ctx.org.id } },
        });
        if (conflict) {
          throw new TRPCError({ code: "CONFLICT", message: "Slug already taken" });
        }
      }
      return ctx.prisma.org.update({
        where: { id: ctx.org.id },
        data: { ...(input.name && { name: input.name }), ...(input.slug && { slug: input.slug }) },
      });
    }),

  members: router({
    // List all members with user details
    list: orgProcedure.query(async ({ ctx }) => {
      return ctx.prisma.membership.findMany({
        where: { orgId: ctx.org.id },
        include: { user: { select: { id: true, name: true, email: true, image: true } } },
        orderBy: { joinedAt: "asc" },
      });
    }),

    // Invite a user by email
    invite: adminProcedure
      .input(
        z.object({
          email: z.string().email(),
          role: z.enum(["admin", "member", "viewer"]).default("member"),
        }),
      )
      .mutation(async ({ ctx, input }) => {
        // Check if user is already a member
        const existingUser = await ctx.prisma.user.findUnique({
          where: { email: input.email },
        });
        if (existingUser) {
          const existingMembership = await ctx.prisma.membership.findUnique({
            where: { userId_orgId: { userId: existingUser.id, orgId: ctx.org.id } },
          });
          if (existingMembership) {
            throw new TRPCError({ code: "CONFLICT", message: "User is already a member" });
          }
        }

        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

        const invite = await ctx.prisma.orgInvite.upsert({
          where: { orgId_email: { orgId: ctx.org.id, email: input.email } },
          update: { role: input.role, invitedBy: ctx.session.user.id, expiresAt, token: undefined },
          create: {
            orgId: ctx.org.id,
            email: input.email,
            role: input.role,
            invitedBy: ctx.session.user.id,
            expiresAt,
          },
        });

        const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
        const inviteUrl = `${appUrl}/invite/${invite.token}`;

        await getResend().emails.send({
          from: process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev",
          to: input.email,
          subject: `You've been invited to join ${ctx.org.name}`,
          html: `
            <p>You've been invited to join <strong>${ctx.org.name}</strong>.</p>
            <p><a href="${inviteUrl}">Click here to accept the invitation</a></p>
            <p>This link expires in 7 days.</p>
          `,
        });

        return { success: true };
      }),

    // Remove a member (admin only, can't remove last admin)
    remove: adminProcedure
      .input(z.object({ userId: z.string() }))
      .mutation(async ({ ctx, input }) => {
        if (input.userId === ctx.session.user.id) {
          throw new TRPCError({ code: "BAD_REQUEST", message: "Use org.leave to remove yourself" });
        }

        const adminCount = await ctx.prisma.membership.count({
          where: { orgId: ctx.org.id, role: "admin" },
        });
        const targetMembership = await ctx.prisma.membership.findUnique({
          where: { userId_orgId: { userId: input.userId, orgId: ctx.org.id } },
        });
        if (targetMembership?.role === "admin" && adminCount <= 1) {
          throw new TRPCError({ code: "BAD_REQUEST", message: "Cannot remove the last admin" });
        }

        await ctx.prisma.membership.delete({
          where: { userId_orgId: { userId: input.userId, orgId: ctx.org.id } },
        });
        return { success: true };
      }),
  }),

  // Leave the org (can't leave if last admin)
  leave: orgProcedure.mutation(async ({ ctx }) => {
    if (ctx.membership.role === "admin") {
      const adminCount = await ctx.prisma.membership.count({
        where: { orgId: ctx.org.id, role: "admin" },
      });
      if (adminCount <= 1) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You are the last admin. Transfer ownership before leaving.",
        });
      }
    }

    await ctx.prisma.membership.delete({
      where: { userId_orgId: { userId: ctx.session.user.id, orgId: ctx.org.id } },
    });
    return { success: true };
  }),
});
