import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/server/auth";
import { prisma } from "@/server/db";
import { getActiveOrgId } from "@/lib/active-org";
import KnowledgeBase from "@/components/dashboard/knowledge-base";

export default async function KnowledgeBasePage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/sign-in");

  const activeOrgId = await getActiveOrgId();
  const membership = await prisma.membership.findFirst({
    where: {
      userId: session.user.id,
      ...(activeOrgId ? { orgId: activeOrgId } : {}),
    },
    include: { org: true },
    orderBy: { joinedAt: "asc" },
  });

  if (!membership) redirect("/dashboard");

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-heading uppercase text-white tracking-tight">
          Knowledge Base
        </h1>
        <p className="text-sm text-white/50 mt-1">
          Upload documents to power AI answers for {membership.org.name}
        </p>
      </div>
      <KnowledgeBase orgId={membership.orgId} role={membership.role} />
    </div>
  );
}
