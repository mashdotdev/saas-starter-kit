"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { setActiveOrg } from "@/lib/active-org-actions";
import { cn } from "@/lib/utils";

interface Props {
  orgs: { id: string; name: string }[];
  activeOrgId: string | null;
}

export default function OrgSwitcher({ orgs, activeOrgId }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const active = orgs.find((o) => o.id === activeOrgId) ?? orgs[0];

  if (orgs.length === 0) return null;

  async function handleSwitch(orgId: string) {
    await setActiveOrg(orgId);
    setOpen(false);
    router.refresh();
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-3 py-2 rounded-md text-sm text-white/80 hover:text-white hover:bg-white/5 transition-colors"
      >
        <span className="truncate font-medium">{active?.name ?? "Select org"}</span>
        <svg
          className={cn("w-3 h-3 ml-2 shrink-0 transition-transform", open && "rotate-180")}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute left-0 right-0 mt-1 rounded-md border border-white/10 bg-zinc-900 shadow-lg z-10 overflow-hidden">
          {orgs.map((org) => (
            <button
              key={org.id}
              onClick={() => handleSwitch(org.id)}
              className={cn(
                "w-full text-left px-3 py-2 text-sm transition-colors",
                org.id === activeOrgId
                  ? "text-white bg-white/10"
                  : "text-white/60 hover:text-white hover:bg-white/5",
              )}
            >
              {org.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
