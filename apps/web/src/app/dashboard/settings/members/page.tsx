import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/server/auth";
import { prisma } from "@/server/db";
import { getActiveOrgId } from "@/lib/active-org";
import InviteMembers from "@/components/dashboard/invite-members";

export default async function MembersPage() {
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

  const members = await prisma.membership.findMany({
    where: { orgId: membership.orgId },
    include: { user: { select: { id: true, name: true, email: true, image: true } } },
    orderBy: { joinedAt: "asc" },
  });

  const pendingInvites = await prisma.orgInvite.findMany({
    where: { orgId: membership.orgId, expiresAt: { gt: new Date() } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-heading uppercase text-white tracking-tight">Members</h1>
        <p className="text-sm text-white/50 mt-1">
          Manage members and invitations for {membership.org.name}
        </p>
      </div>
      <InviteMembers
        orgId={membership.orgId}
        currentUserId={session.user.id}
        currentUserRole={membership.role}
        members={members.map((m: (typeof members)[number]) => ({
          id: m.id,
          userId: m.userId,
          role: m.role,
          joinedAt: m.joinedAt.toISOString(),
          user: m.user,
        }))}
        pendingInvites={pendingInvites.map((i: (typeof pendingInvites)[number]) => ({
          id: i.id,
          email: i.email,
          role: i.role,
          expiresAt: i.expiresAt.toISOString(),
        }))}
      />
    </div>
  );
}
