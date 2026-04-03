"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

interface Props {
  nextUrl?: string;
}

export default function SignInForm({ nextUrl }: Props) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const destination = nextUrl ?? "/dashboard";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await authClient.signIn.email({
        email,
        password,
        callbackURL: destination,
      });
      if (res.error) {
        setError(res.error.message ?? "Sign in failed");
      } else {
        router.push(destination);
      }
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  }

  async function handleOAuth(provider: "google" | "github") {
    await authClient.signIn.social({
      provider,
      callbackURL: destination,
    });
  }

  return (
    <div className="space-y-4 bg-white/5 p-4 rounded-lg">
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-xs text-white/60 mb-1 uppercase tracking-wider">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={cn(
              "w-full px-3 py-2 rounded-md bg-white/5 border border-white/10",
              "text-white text-sm placeholder:text-white/30",
              "focus:outline-none focus:ring-1 focus:ring-white/30",
            )}
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label className="block text-xs text-white/60 mb-1 uppercase tracking-wider">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className={cn(
              "w-full px-3 py-2 rounded-md bg-white/5 border border-white/10",
              "text-white text-sm placeholder:text-white/30",
              "focus:outline-none focus:ring-1 focus:ring-white/30",
            )}
            placeholder="••••••••"
          />
        </div>
        {error && (
          <p className="text-xs text-red-400 bg-red-400/10 px-3 py-2 rounded-md">
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={loading}
          className={cn(
            "w-full py-2 rounded-md text-sm font-semibold uppercase tracking-wider",
            "bg-white text-black transition-opacity",
            "disabled:opacity-50 disabled:cursor-not-allowed",
          )}
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>

      <div className="relative flex items-center gap-3">
        <div className="flex-1 h-px bg-white/10" />
        <span className="text-xs text-white/30 uppercase tracking-wider">
          or
        </span>
        <div className="flex-1 h-px bg-white/10" />
      </div>

      <div className="space-y-2">
        <button
          onClick={() => handleOAuth("google")}
          className={cn(
            "w-full py-2 rounded-md text-sm font-medium border border-white/10",
            "bg-white/5 text-white/80 hover:bg-white/10 transition-colors",
          )}
        >
          Continue with Google
        </button>
        <button
          onClick={() => handleOAuth("github")}
          className={cn(
            "w-full py-2 rounded-md text-sm font-medium border border-white/10",
            "bg-white/5 text-white/80 hover:bg-white/10 transition-colors",
          )}
        >
          Continue with GitHub
        </button>
      </div>
    </div>
  );
}
