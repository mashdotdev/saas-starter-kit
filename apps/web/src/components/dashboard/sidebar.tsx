"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import OrgSwitcher from "@/components/dashboard/org-switcher";

const navItems = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/ai", label: "AI Chat" },
  { href: "/dashboard/billing", label: "Billing" },
  { href: "/dashboard/settings/members", label: "Members" },
  { href: "/dashboard/settings", label: "Settings" },
];

interface SidebarProps {
  user: { name: string; email: string; image?: string | null };
  orgs: { id: string; name: string }[];
  activeOrgId: string | null;
}

export default function Sidebar({ user, orgs, activeOrgId }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleSignOut() {
    await authClient.signOut();
    router.push("/sign-in");
  }

  return (
    <aside className="w-60 shrink-0 border-r border-white/10 flex flex-col min-h-screen">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-white/10">
        <span className="font-heading text-white uppercase tracking-widest text-sm">
          SaaS Kit
        </span>
      </div>

      {/* Org switcher */}
      {orgs.length > 0 && (
        <div className="px-3 pt-3 pb-2 border-b border-white/5">
          <p className="text-[10px] text-white/30 uppercase tracking-widest px-3 mb-1">
            Organization
          </p>
          <OrgSwitcher orgs={orgs} activeOrgId={activeOrgId} />
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ href, label }) => {
          const active =
            href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center px-3 py-2 rounded-md text-sm transition-colors",
                active
                  ? "bg-white/10 text-white font-medium"
                  : "text-white/50 hover:text-white hover:bg-white/5",
              )}
            >
              {label}
            </Link>
          );
        })}
      </nav>

      {/* User + sign out */}
      <div className="px-3 py-4 border-t border-white/10 space-y-3">
        <div className="px-3 space-y-0.5">
          <p className="text-xs text-white font-medium truncate">{user.name}</p>
          <p className="text-xs text-white/40 truncate">{user.email}</p>
        </div>
        <button
          onClick={handleSignOut}
          className="w-full text-left px-3 py-2 rounded-md text-xs text-white/50 hover:text-white hover:bg-white/5 transition-colors"
        >
          Sign out
        </button>
      </div>
    </aside>
  );
}
