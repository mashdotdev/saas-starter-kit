import SignUpForm from "@/components/auth/sign-up-form";
import Link from "next/link";

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-heading uppercase text-white tracking-tight">
            Create account
          </h1>
          <p className="text-sm text-white/60">
            Start shipping your AI SaaS today
          </p>
        </div>
        <SignUpForm />
        <p className="text-center text-sm text-white/50">
          Already have an account?{" "}
          <Link href="/sign-in" className="text-white underline underline-offset-4">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
