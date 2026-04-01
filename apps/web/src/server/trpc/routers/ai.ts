import { z } from "zod";
import { protectedProcedure, router } from "@/server/trpc/init";

export const aiRouter = router({
  // Usage history for the current user
  usage: protectedProcedure.query(async ({ ctx }) => {
    return ctx.prisma.aiUsage.findMany({
      where: { userId: ctx.session.user.id },
      orderBy: { usedAt: "desc" },
      take: 50,
      select: {
        id: true,
        model: true,
        inputTokens: true,
        outputTokens: true,
        cost: true,
        usedAt: true,
      },
    });
  }),

  // Runs the demo agent via the FastAPI service
  agentRun: protectedProcedure
    .input(z.object({ task: z.string().min(1).max(2000) }))
    .mutation(async ({ ctx, input }) => {
      const aiServiceUrl = process.env.AI_SERVICE_URL ?? "http://localhost:8000";
      const internalSecret = process.env.AI_SERVICE_INTERNAL_SECRET ?? "";

      const res = await fetch(`${aiServiceUrl}/agents/run`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Internal-Secret": internalSecret,
        },
        body: JSON.stringify({
          task: input.task,
          userId: ctx.session.user.id,
          orgId: "",
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: "Agent error" }));
        throw new Error(err.detail ?? "Agent request failed");
      }

      return res.json() as Promise<{
        result: string;
        toolCalls: { tool: string; input: unknown; output: unknown }[];
        inputTokens: number;
        outputTokens: number;
      }>;
    }),
});
