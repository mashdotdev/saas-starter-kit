import { headers } from "next/headers";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { auth } from "@/server/auth";
import { prisma } from "@/server/db";
import { setActiveOrg } from "@/lib/active-org-actions";

interface Props {
  params: Promise<{ token: string }>;
}

export default async function InvitePage({ params }: Props) {
  const { token } = await params;

  const invite = await prisma.orgInvite.findUnique({
    where: { token },
    include: { org: true },
  });

  if (!invite) notFound();

  if (invite.expiresAt < new Date()) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black px-4">
        <div className="w-full max-w-sm text-center space-y-4">
          <h1 className="text-2xl font-heading uppercase text-white tracking-tight">
            Invite Expired
          </h1>
          <p className="text-sm text-white/60">
            This invitation has expired. Ask an admin to send a new one.
          </p>
          <Link href="/sign-in" className="text-sm text-white underline underline-offset-4">
            Go to sign in
          </Link>
        </div>
      </div>
    );
  }

  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect(`/sign-in?next=/invite/${token}`);
  }

  if (session.user.email !== invite.email) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black px-4">
        <div className="w-full max-w-sm text-center space-y-4">
          <h1 className="text-2xl font-heading uppercase text-white tracking-tight">
            Wrong Account
          </h1>
          <p className="text-sm text-white/60">
            This invite was sent to <strong>{invite.email}</strong> but you&apos;re
            signed in as <strong>{session.user.email}</strong>.
          </p>
          <p className="text-sm text-white/40">
            Sign out and sign in with the correct account.
          </p>
        </div>
      </div>
    );
  }

  // Accept invite: create membership, delete invite, set active org
  const existingMembership = await prisma.membership.findUnique({
    where: { userId_orgId: { userId: session.user.id, orgId: invite.orgId } },
  });

  if (!existingMembership) {
    await prisma.$transaction([
      prisma.membership.create({
        data: {
          userId: session.user.id,
          orgId: invite.orgId,
          role: invite.role,
          invitedBy: invite.invitedBy,
        },
      }),
      prisma.orgInvite.delete({ where: { token } }),
    ]);
  }

  await setActiveOrg(invite.orgId);
  redirect("/dashboard");
}
