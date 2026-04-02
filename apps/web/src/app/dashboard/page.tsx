import { headers } from "next/headers";
import { auth } from "@/server/auth";
import { prisma } from "@/server/db";
import { getActiveOrgId } from "@/lib/active-org";
import EmptyState from "@/components/dashboard/empty-state";
import CreateOrg from "@/components/dashboard/create-org";

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const activeOrgId = await getActiveOrgId();

  const membership = session
    ? await prisma.membership.findFirst({
        where: {
          userId: session.user.id,
          ...(activeOrgId ? { orgId: activeOrgId } : {}),
        },
        include: { org: true },
        orderBy: { joinedAt: "asc" },
      })
    : null;

  if (!membership) {
    return (
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-heading uppercase text-white tracking-tight">
            Welcome
          </h1>
          <p className="text-sm text-white/50 mt-1">
            Create an organization to get started
          </p>
        </div>
        <CreateOrg />
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-heading uppercase text-white tracking-tight">
          Dashboard
        </h1>
        <p className="text-sm text-white/50 mt-1">
          {membership.org.name} — {membership.org.plan} plan
        </p>
      </div>
      <EmptyState />
    </div>
  );
}
