import { headers } from "next/headers";
import { auth } from "@/server/auth";
import { prisma } from "@/server/db";
import { getActiveOrgId } from "@/lib/active-org";

export async function POST(req: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const activeOrgId = await getActiveOrgId();
  const membership = await prisma.membership.findFirst({
    where: {
      userId: session.user.id,
      ...(activeOrgId ? { orgId: activeOrgId } : {}),
    },
    orderBy: { joinedAt: "asc" },
  });
  if (!membership) return Response.json({ error: "No org membership" }, { status: 403 });

  const { query, k = 5 } = await req.json();
  if (!query) return Response.json({ error: "query is required" }, { status: 400 });

  const aiServiceUrl = process.env.AI_SERVICE_URL ?? "http://localhost:8000";
  const internalSecret = process.env.AI_SERVICE_INTERNAL_SECRET ?? "";

  const res = await fetch(`${aiServiceUrl}/rag/retrieve`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Internal-Secret": internalSecret },
    body: JSON.stringify({ orgId: membership.orgId, query, k }),
  });

  if (!res.ok) {
    return Response.json({ error: "Retrieval failed" }, { status: 500 });
  }

  return Response.json(await res.json());
}
