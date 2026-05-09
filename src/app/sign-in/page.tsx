"use client";

import { useAuthActions } from "@convex-dev/auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowRight, Loader2 } from "lucide-react";

import { AnchrLogo } from "@/components/anchr-logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Mode = "signIn" | "signUp";

export default function SignInPage() {
  const { signIn } = useAuthActions();
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("signIn");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handlePassword(formData: FormData) {
    setError(null);
    setPending(true);
    try {
      await signIn("password", {
        email: formData.get("email") as string,
        password: formData.get("password") as string,
        flow: mode,
      });
      router.push("/dashboard");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not sign in.",
      );
    } finally {
      setPending(false);
    }
  }

  async function handleAnonymous() {
    setError(null);
    setPending(true);
    try {
      await signIn("anonymous");
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not start demo.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="relative flex min-h-screen flex-col bg-black text-white">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
        <AnchrLogo />
      </div>

      <main className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <h1 className="text-balance text-3xl font-semibold tracking-[-0.03em] text-white md:text-4xl">
            {mode === "signIn" ? (
              <>
                Welcome back to{" "}
                <span className="font-serif italic font-normal">Anchr</span>.
              </>
            ) : (
              <>
                Get on{" "}
                <span className="font-serif italic font-normal">air</span>.
              </>
            )}
          </h1>
          <p className="mt-3 text-sm text-white/55">
            {mode === "signIn"
              ? "Sign in to your studio."
              : "Create an account in 10 seconds."}
          </p>

          <form
            action={handlePassword}
            className="mt-8 flex flex-col gap-3"
          >
            <Input
              type="email"
              name="email"
              required
              autoComplete="email"
              placeholder="you@company.com"
              className="h-11 rounded-xl border-white/15 bg-white/[0.04] text-white placeholder:text-white/35 focus-visible:border-white/30"
            />
            <Input
              type="password"
              name="password"
              required
              minLength={8}
              autoComplete={
                mode === "signIn" ? "current-password" : "new-password"
              }
              placeholder="Password (min 8 chars)"
              className="h-11 rounded-xl border-white/15 bg-white/[0.04] text-white placeholder:text-white/35 focus-visible:border-white/30"
            />
            {error ? (
              <p className="text-xs text-red-300/90">{error}</p>
            ) : null}
            <Button
              type="submit"
              disabled={pending}
              className="h-11 rounded-xl bg-white text-sm font-medium text-black hover:bg-white/90"
            >
              {pending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <>
                  {mode === "signIn" ? "Sign in" : "Create account"}
                  <ArrowRight className="ml-1 size-4" />
                </>
              )}
            </Button>
          </form>

          <button
            type="button"
            onClick={() => setMode(mode === "signIn" ? "signUp" : "signIn")}
            className="mt-4 w-full text-center text-xs text-white/55 hover:text-white"
          >
            {mode === "signIn"
              ? "No account? Create one →"
              : "Already have an account? Sign in →"}
          </button>

          <div className="my-7 flex items-center gap-3 text-[10px] uppercase tracking-[0.18em] text-white/30">
            <span className="h-px flex-1 bg-white/10" />
            or
            <span className="h-px flex-1 bg-white/10" />
          </div>

          <Button
            type="button"
            variant="ghost"
            disabled={pending}
            onClick={handleAnonymous}
            className="h-11 w-full rounded-xl border border-white/15 bg-white/[0.03] text-sm font-medium text-white/85 backdrop-blur hover:bg-white/[0.08] hover:text-white"
          >
            Try the demo studio
          </Button>
          <p className="mt-3 text-center text-[11px] text-white/35">
            One-click anonymous session, pre-filled with sample broadcasts.
          </p>
        </div>
      </main>
    </div>
  );
}
