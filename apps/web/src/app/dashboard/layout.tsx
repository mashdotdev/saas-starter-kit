import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/server/auth";
import { prisma } from "@/server/db";
import { getActiveOrgId } from "@/lib/active-org";
import Sidebar from "@/components/dashboard/sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/sign-in");

  const memberships = await prisma.membership.findMany({
    where: { userId: session.user.id },
    include: { org: true },
    orderBy: { joinedAt: "asc" },
  });

  const activeOrgId = await getActiveOrgId();
  type Membership = (typeof memberships)[number];
  const activeOrg =
    memberships.find((m: Membership) => m.orgId === activeOrgId)?.org ??
    memberships[0]?.org ??
    null;

  const orgs = memberships.map((m: Membership) => ({ id: m.orgId, name: m.org.name }));

  return (
    <div className="min-h-screen bg-black flex">
      <Sidebar user={session.user} orgs={orgs} activeOrgId={activeOrg?.id ?? null} />
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
