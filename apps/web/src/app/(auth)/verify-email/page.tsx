import Link from "next/link";

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4">
      <div className="w-full max-w-sm text-center space-y-4">
        <div className="text-4xl">✉️</div>
        <h1 className="text-2xl font-heading uppercase text-white tracking-tight">
          Check your email
        </h1>
        <p className="text-sm text-white/60 leading-relaxed">
          We&apos;ve sent a verification link to your email address. Click the
          link to activate your account.
        </p>
        <p className="text-sm text-white/40">
          Already verified?{" "}
          <Link href="/sign-in" className="text-white underline underline-offset-4">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
