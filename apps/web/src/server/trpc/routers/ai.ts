import { z } from "zod";
import { adminProcedure, orgProcedure, router } from "@/server/trpc/init";

const AI_SERVICE_URL = () => process.env.AI_SERVICE_URL ?? "http://localhost:8000";
const INTERNAL_SECRET = () => process.env.AI_SERVICE_INTERNAL_SECRET ?? "";

function aiHeaders() {
  return {
    "Content-Type": "application/json",
    "X-Internal-Secret": INTERNAL_SECRET(),
  };
}

export const aiRouter = router({
  // Org-scoped usage history
  usage: orgProcedure.query(async ({ ctx }) => {
    return ctx.prisma.aiUsage.findMany({
      where: { orgId: ctx.org.id },
      orderBy: { usedAt: "desc" },
      take: 50,
      select: {
        id: true,
        model: true,
        inputTokens: true,
        outputTokens: true,
        cost: true,
        usedAt: true,
        userId: true,
      },
    });
  }),

  // Run the demo agent via FastAPI
  agentRun: orgProcedure
    .input(z.object({ task: z.string().min(1).max(2000) }))
    .mutation(async ({ ctx, input }) => {
      const res = await fetch(`${AI_SERVICE_URL()}/agents/run`, {
        method: "POST",
        headers: aiHeaders(),
        body: JSON.stringify({
          task: input.task,
          userId: ctx.session.user.id,
          orgId: ctx.org.id,
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

  docs: router({
    // Ingest a document into the org's Qdrant collection
    ingest: adminProcedure
      .input(
        z.object({
          docId: z.string(),
          filename: z.string(),
          content: z.string().min(1),
        }),
      )
      .mutation(async ({ ctx, input }) => {
        const res = await fetch(`${AI_SERVICE_URL()}/rag/ingest`, {
          method: "POST",
          headers: aiHeaders(),
          body: JSON.stringify({
            orgId: ctx.org.id,
            docId: input.docId,
            filename: input.filename,
            content: input.content,
          }),
        });

        if (!res.ok) {
          const err = await res.text();
          throw new Error(`Ingest failed: ${err}`);
        }

        return res.json() as Promise<{ docId: string; chunks: number }>;
      }),

    // List all ingested documents for this org
    list: orgProcedure.query(async ({ ctx }) => {
      const res = await fetch(
        `${AI_SERVICE_URL()}/rag/list?orgId=${ctx.org.id}`,
        { headers: { "X-Internal-Secret": INTERNAL_SECRET() } },
      );

      if (!res.ok) return [];
      return res.json() as Promise<{ docId: string; filename: string; chunks: number }[]>;
    }),

    // Delete a document from this org's collection
    delete: adminProcedure
      .input(z.object({ docId: z.string() }))
      .mutation(async ({ ctx, input }) => {
        const res = await fetch(`${AI_SERVICE_URL()}/rag/delete`, {
          method: "DELETE",
          headers: aiHeaders(),
          body: JSON.stringify({ orgId: ctx.org.id, docId: input.docId }),
        });

        if (!res.ok) {
          const err = await res.text();
          throw new Error(`Delete failed: ${err}`);
        }

        return { success: true };
      }),
  }),
});
