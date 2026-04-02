"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { trpc } from "@/lib/trpc-client";
import { cn } from "@/lib/utils";

export default function CreateOrg() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugEdited, setSlugEdited] = useState(false);

  const create = trpc.org.create.useMutation({
    onSuccess: () => router.refresh(),
  });

  function handleNameChange(value: string) {
    setName(value);
    if (!slugEdited) {
      setSlug(value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""));
    }
  }

  return (
    <div className="max-w-sm">
      <div className="rounded-lg border border-white/10 p-6 space-y-5">
        <div className="space-y-1">
          <label className="text-xs text-white/50 uppercase tracking-wider">
            Organization name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            placeholder="Acme Inc."
            className="w-full bg-white/5 border border-white/10 rounded-md px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/30"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs text-white/50 uppercase tracking-wider">
            Slug
          </label>
          <input
            type="text"
            value={slug}
            onChange={(e) => { setSlug(e.target.value); setSlugEdited(true); }}
            placeholder="acme-inc"
            className="w-full bg-white/5 border border-white/10 rounded-md px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/30 font-mono"
          />
          <p className="text-xs text-white/30">Lowercase letters, numbers and hyphens only</p>
        </div>

        {create.error && (
          <p className="text-xs text-red-400">{create.error.message}</p>
        )}

        <button
          onClick={() => create.mutate({ name, slug })}
          disabled={!name || !slug || create.isPending}
          className={cn(
            "w-full px-4 py-2 rounded-md text-sm font-semibold uppercase tracking-wider",
            "bg-white text-black transition-opacity",
            "disabled:opacity-40 disabled:cursor-not-allowed",
          )}
        >
          {create.isPending ? "Creating…" : "Create organization"}
        </button>
      </div>
    </div>
  );
}
