import { headers } from "next/headers";
import { auth } from "@/server/auth";
import { prisma } from "@/server/db";
import { getActiveOrgId } from "@/lib/active-org";

export const maxDuration = 60;

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
  if (membership.role !== "admin") return Response.json({ error: "Admin only" }, { status: 403 });

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  if (!file) return Response.json({ error: "No file provided" }, { status: 400 });

  let content = "";
  const filename = file.name;

  if (file.type === "application/pdf" || filename.endsWith(".pdf")) {
    // For PDFs, send raw bytes to FastAPI which handles extraction
    const arrayBuffer = await file.arrayBuffer();
    const bytes = Buffer.from(arrayBuffer);
    content = bytes.toString("base64");
  } else {
    content = await file.text();
  }

  const docId = crypto.randomUUID();
  const aiServiceUrl = process.env.AI_SERVICE_URL ?? "http://localhost:8000";
  const internalSecret = process.env.AI_SERVICE_INTERNAL_SECRET ?? "";

  const res = await fetch(`${aiServiceUrl}/rag/ingest`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Internal-Secret": internalSecret },
    body: JSON.stringify({
      orgId: membership.orgId,
      docId,
      filename,
      content,
      isPdf: file.type === "application/pdf" || filename.endsWith(".pdf"),
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    return Response.json({ error: `Ingest failed: ${err}` }, { status: 500 });
  }

  return Response.json(await res.json());
}
