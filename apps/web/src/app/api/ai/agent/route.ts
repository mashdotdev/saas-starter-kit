import { headers } from "next/headers";
import { auth } from "@/server/auth";
import { checkRateLimit } from "@/lib/rate-limit";

export async function POST(req: Request) {
  // Auth
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Rate limit
  const { success } = await checkRateLimit(session.user.id);
  if (!success) {
    return Response.json(
      { error: "Rate limit exceeded. Try again in a minute." },
      { status: 429 },
    );
  }

  const { task } = await req.json();
  if (!task || typeof task !== "string") {
    return Response.json({ error: "task is required" }, { status: 400 });
  }

  const aiServiceUrl = process.env.AI_SERVICE_URL ?? "http://localhost:8000";
  const internalSecret = process.env.AI_SERVICE_INTERNAL_SECRET ?? "";

  const res = await fetch(`${aiServiceUrl}/agents/run`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Internal-Secret": internalSecret,
    },
    body: JSON.stringify({
      task,
      userId: session.user.id,
      orgId: "",
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    return Response.json(
      { error: data.detail ?? "Agent error" },
      { status: res.status },
    );
  }

  return Response.json(data);
}
