// ==============================================================================
// SWITCH SOCIAL PLATFORM - LOGIN PAGE
// File: app/login/page.tsx
// Production Supabase Authentication Login Screen
// ==============================================================================

"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Loader2, ArrowLeft, LogIn, Sparkles } from "lucide-react";
import { AuthService } from "@/lib/services/auth.service";
import GoogleSignInButton from "@/components/ui/GoogleSignInButton";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTarget = searchParams?.get("redirect") || "/";
  const urlError = searchParams?.get("error");

  useEffect(() => {
    if (urlError) {
      if (urlError === "oauth_failed" || urlError === "no_code_provided") {
        setError("Google authentication could not be completed. Please try again.");
      } else {
        setError(decodeURIComponent(urlError));
      }
    }
  }, [urlError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await AuthService.signIn({
        email: email.trim(),
        password,
      });

      if (!res.success) {
        setError(res.error || "Invalid email or password. Please try again.");
        setLoading(false);
      } else {
        router.push(redirectTarget);
        router.refresh();
      }
    } catch {
      setError("An unexpected network error occurred while connecting to the backend.");
      setLoading(false);
    }
  };

  const handleDemoFill = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword("switchbot123");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background text-foreground p-4 sm:p-6 transition-colors">
      <div className="w-full max-w-md switch-card p-6 sm:p-8 space-y-6">
        {/* Back Link */}
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Switch</span>
          </Link>
        </div>

        {/* Brand Header */}
        <div className="text-center space-y-1.5">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <img src="/switch-logo-blue.png" alt="Switch" className="w-8 h-8 rounded-lg" />
            <span className="font-extrabold text-xl tracking-tight text-foreground">
              SWITCH
            </span>
          </Link>
          <h1 className="text-xl font-bold text-foreground">Welcome Back</h1>
          <p className="text-xs text-muted-foreground">
            Sign in to switch between Technology, Cricket, and Meme worlds
          </p>
        </div>

        {/* Error Feedback */}
        {error && (
          <div className="text-xs text-destructive text-center font-semibold bg-destructive/10 border border-destructive/20 p-3 rounded-xl animate-in fade-in">
            {error}
          </div>
        )}

        {/* Google OAuth One-Click Sign In */}
        <div className="space-y-4">
          <GoogleSignInButton
            redirectTo={typeof window !== "undefined" ? `${window.location.origin}/api/auth/callback?next=${encodeURIComponent(redirectTarget)}` : undefined}
            onError={(msg) => setError(msg)}
          />

          <div className="relative flex items-center justify-center">
            <div className="border-t border-border w-full" />
            <span className="bg-card px-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider relative shrink-0">
              or continue with email
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@domain.com"
              className="w-full px-3.5 py-2 rounded-xl border border-input bg-background text-foreground text-sm focus:border-primary focus:outline-none transition-colors"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-medium text-foreground">
                Password
              </label>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full px-3.5 py-2 rounded-xl border border-input bg-background text-foreground text-sm focus:border-primary focus:outline-none transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary/95 text-primary-foreground font-semibold rounded-xl py-2.5 transition-colors flex justify-center items-center gap-2 text-sm cursor-pointer shadow-xs active:scale-98"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                <span>Sign In</span>
              </>
            )}
          </button>
        </form>

        {/* Quick Demo Credentials */}
        <div className="pt-2 border-t border-border space-y-2">
          <p className="text-[11px] font-semibold text-muted-foreground flex items-center justify-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Developer Sandbox Quick-Fill</span>
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            <button
              type="button"
              onClick={() => handleDemoFill("tech.lead@switch.social")}
              className="px-2.5 py-1 text-[11px] font-mono rounded-lg border border-border bg-secondary/50 hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              tech.lead
            </button>
            <button
              type="button"
              onClick={() => handleDemoFill("meme.queen@switch.social")}
              className="px-2.5 py-1 text-[11px] font-mono rounded-lg border border-border bg-secondary/50 hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              meme.queen
            </button>
            <button
              type="button"
              onClick={() => handleDemoFill("pitch.analyst@switch.social")}
              className="px-2.5 py-1 text-[11px] font-mono rounded-lg border border-border bg-secondary/50 hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              pitch.analyst
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground pt-1">
          Don&apos;t have an account yet?{" "}
          <Link href="/signup" className="text-primary font-semibold hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
