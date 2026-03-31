import { createHmac } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/server/db";

function verifySignature(rawBody: string, signature: string): boolean {
  const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET!;
  const hmac = createHmac("sha256", secret);
  hmac.update(rawBody);
  const digest = hmac.digest("hex");
  return digest === signature;
}

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signature = req.headers.get("x-signature") ?? "";

  if (!verifySignature(rawBody, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let payload: Record<string, unknown>;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const eventName = payload.meta as { event_name?: string };
  const data = payload.data as {
    id?: string;
    attributes?: {
      status?: string;
      custom_data?: { org_id?: string };
    };
  };

  if (
    eventName?.event_name === "subscription_created" ||
    eventName?.event_name === "subscription_updated"
  ) {
    const orgId = data?.attributes?.custom_data?.org_id;
    const lemonSqueezyId = data?.id;
    const status = data?.attributes?.status;

    if (orgId && lemonSqueezyId) {
      await prisma.org.update({
        where: { id: orgId },
        data: {
          plan: status === "active" ? "pro" : "free",
          lemonSqueezyId,
        },
      });
    }
  }

  if (eventName?.event_name === "subscription_cancelled") {
    const orgId = data?.attributes?.custom_data?.org_id;
    if (orgId) {
      await prisma.org.update({
        where: { id: orgId },
        data: { plan: "free" },
      });
    }
  }

  return NextResponse.json({ received: true });
}
