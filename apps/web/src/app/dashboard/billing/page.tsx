import { headers } from "next/headers";
import { auth } from "@/server/auth";
import { prisma } from "@/server/db";
import BillingClient from "./billing-client";

export default async function BillingPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  const membership = await prisma.membership.findFirst({
    where: { userId: session!.user.id },
    include: { org: true },
  });

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-heading uppercase text-white tracking-tight">
          Billing
        </h1>
        <p className="text-sm text-white/50 mt-1">Manage your subscription</p>
      </div>
      <BillingClient
        plan={membership?.org.plan ?? "free"}
        orgId={membership?.org.id ?? ""}
        hasSubscription={!!membership?.org.lemonSqueezyId}
      />
    </div>
  );
}
