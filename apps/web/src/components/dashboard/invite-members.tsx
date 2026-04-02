"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { trpc } from "@/lib/trpc-client";
import { cn } from "@/lib/utils";

type Member = {
  id: string;
  userId: string;
  role: string;
  joinedAt: string;
  user: { id: string; name: string; email: string; image?: string | null };
};

type PendingInvite = {
  id: string;
  email: string;
  role: string;
  expiresAt: string;
};

interface Props {
  orgId: string;
  currentUserId: string;
  currentUserRole: string;
  members: Member[];
  pendingInvites: PendingInvite[];
}

export default function InviteMembers({
  orgId,
  currentUserId,
  currentUserRole,
  members,
  pendingInvites,
}: Props) {
  const router = useRouter();
  const isAdmin = currentUserRole === "admin";

  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"member" | "admin" | "viewer">("member");

  const invite = trpc.org.members.invite.useMutation({
    onSuccess: () => {
      setEmail("");
      router.refresh();
    },
  });

  const remove = trpc.org.members.remove.useMutation({
    onSuccess: () => router.refresh(),
  });

  return (
    <div className="space-y-8 max-w-2xl">
      {/* Invite form */}
      {isAdmin && (
        <div className="rounded-lg border border-white/10 p-6 space-y-4">
          <h2 className="text-sm font-medium text-white uppercase tracking-wider">
            Invite a member
          </h2>
          <div className="flex gap-3">
            <input
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 bg-white/5 border border-white/10 rounded-md px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/30"
            />
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as "member" | "admin" | "viewer")}
              className="bg-white/5 border border-white/10 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-white/30"
            >
              <option value="member">Member</option>
              <option value="admin">Admin</option>
              <option value="viewer">Viewer</option>
            </select>
            <button
              onClick={() => invite.mutate({ email, role })}
              disabled={!email || invite.isPending}
              className={cn(
                "px-4 py-2 rounded-md text-sm font-semibold uppercase tracking-wider",
                "bg-white text-black transition-opacity",
                "disabled:opacity-40 disabled:cursor-not-allowed",
              )}
            >
              {invite.isPending ? "Sending…" : "Invite"}
            </button>
          </div>
          {invite.error && (
            <p className="text-xs text-red-400">{invite.error.message}</p>
          )}
          {invite.isSuccess && (
            <p className="text-xs text-green-400">Invitation sent!</p>
          )}
        </div>
      )}

      {/* Member list */}
      <div className="rounded-lg border border-white/10 overflow-hidden">
        <div className="px-6 py-3 border-b border-white/10">
          <h2 className="text-sm font-medium text-white uppercase tracking-wider">
            Members ({members.length})
          </h2>
        </div>
        <ul className="divide-y divide-white/5">
          {members.map((m) => (
            <li key={m.id} className="flex items-center justify-between px-6 py-4">
              <div>
                <p className="text-sm text-white font-medium">{m.user.name}</p>
                <p className="text-xs text-white/40">{m.user.email}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-white/60 uppercase tracking-wider">
                  {m.role}
                </span>
                {isAdmin && m.userId !== currentUserId && (
                  <button
                    onClick={() => remove.mutate({ userId: m.userId })}
                    disabled={remove.isPending}
                    className="text-xs text-white/30 hover:text-red-400 transition-colors disabled:opacity-40"
                  >
                    Remove
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Pending invites */}
      {pendingInvites.length > 0 && (
        <div className="rounded-lg border border-white/10 overflow-hidden">
          <div className="px-6 py-3 border-b border-white/10">
            <h2 className="text-sm font-medium text-white/60 uppercase tracking-wider">
              Pending invites ({pendingInvites.length})
            </h2>
          </div>
          <ul className="divide-y divide-white/5">
            {pendingInvites.map((inv) => (
              <li key={inv.id} className="flex items-center justify-between px-6 py-4">
                <div>
                  <p className="text-sm text-white/70">{inv.email}</p>
                  <p className="text-xs text-white/30">
                    Expires {new Date(inv.expiresAt).toLocaleDateString()}
                  </p>
                </div>
                <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-white/40 uppercase tracking-wider">
                  {inv.role}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
