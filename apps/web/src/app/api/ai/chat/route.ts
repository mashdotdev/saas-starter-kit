import { headers } from "next/headers";
import { auth } from "@/server/auth";
import { checkRateLimit } from "@/lib/rate-limit";

export const maxDuration = 60;

export async function POST(req: Request) {
  // 1 — Auth
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 2 — Rate limit
  const { success, remaining } = await checkRateLimit(session.user.id);
  if (!success) {
    return Response.json(
      { error: "Rate limit exceeded. Try again in a minute." },
      {
        status: 429,
        headers: { "X-RateLimit-Remaining": "0" },
      },
    );
  }

  // 3 — Parse body
  const body = await req.json();

  // 4 — Forward to FastAPI and stream back
  const aiServiceUrl = process.env.AI_SERVICE_URL ?? "http://localhost:8000";
  const internalSecret = process.env.AI_SERVICE_INTERNAL_SECRET ?? "";

  const fastapiRes = await fetch(`${aiServiceUrl}/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Internal-Secret": internalSecret,
    },
    body: JSON.stringify({
      messages: (body.messages ?? []).map(
        (m: { role: string; content?: string; parts?: { type: string; text?: string }[] }) => ({
          role: m.role,
          content:
            m.content ??
            (m.parts ?? [])
              .filter((p) => p.type === "text")
              .map((p) => p.text ?? "")
              .join(""),
        }),
      ),
      userId: session.user.id,
      orgId: "",
    }),
  });

  if (!fastapiRes.ok) {
    const text = await fastapiRes.text();
    return Response.json(
      { error: `AI service error: ${text}` },
      { status: fastapiRes.status },
    );
  }

  // 5 — Pipe the plain-text stream back to the browser
  return new Response(fastapiRes.body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "X-RateLimit-Remaining": String(remaining),
    },
  });
}
