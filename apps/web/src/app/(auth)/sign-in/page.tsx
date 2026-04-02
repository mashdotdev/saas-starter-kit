import SignInForm from "@/components/auth/sign-in-form";
import Link from "next/link";

interface Props {
  searchParams: Promise<{ next?: string }>;
}

export default async function SignInPage({ searchParams }: Props) {
  const { next } = await searchParams;

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-heading uppercase text-white tracking-tight">
            Welcome back
          </h1>
          <p className="text-sm text-white/60">Sign in to your account</p>
        </div>
        <SignInForm nextUrl={next} />
        <p className="text-center text-sm text-white/50">
          Don&apos;t have an account?{" "}
          <Link
            href={next ? `/sign-up?next=${encodeURIComponent(next)}` : "/sign-up"}
            className="text-white underline underline-offset-4"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
