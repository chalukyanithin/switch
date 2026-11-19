// ==============================================================================
// SWITCH SOCIAL PLATFORM - SIGNUP PAGE
// File: app/signup/page.tsx
// Production Supabase Authentication Registration Screen
// ==============================================================================

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, ArrowLeft, CheckCircle2, ShieldCheck } from "lucide-react";
import { AuthService } from "@/lib/services/auth.service";
import GoogleSignInButton from "@/components/ui/GoogleSignInButton";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMessage("");

    // 1. Password confirmation check
    if (password !== confirmPassword) {
      setError("Passwords do not match. Please verify both entries.");
      setLoading(false);
      return;
    }

    // 2. Password complexity check
    const pwdCheck = AuthService.validatePassword(password);
    if (!pwdCheck.valid) {
      setError(pwdCheck.error || "Password does not meet security requirements.");
      setLoading(false);
      return;
    }

    // 3. Username validation
    const userCheck = AuthService.validateUsername(username);
    if (!userCheck.valid) {
      setError(userCheck.error || "Invalid username format.");
      setLoading(false);
      return;
    }

    try {
      const res = await AuthService.signUp({
        username: username.trim(),
        displayName: displayName.trim() || username.trim(),
        email: email.trim(),
        password,
      });

      if (!res.success) {
        setError(res.error || "Registration failed. Please try again.");
      } else if (res.needsEmailConfirmation) {
        setSuccessMessage(
          "Account created! Please check your email to confirm your account, then sign in."
        );
      } else {
        // Automatic login & redirect to Switch
        router.push("/");
        router.refresh();
      }
    } catch {
      setError("An unexpected network error occurred while connecting to the backend.");
    } finally {
      setLoading(false);
    }
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
          <h1 className="text-xl font-bold text-foreground">Create Your Account</h1>
          <p className="text-xs text-muted-foreground">
            One identity across Technology, Cricket, and Meme worlds
          </p>
        </div>

        {/* Feedback Alerts */}
        {error && (
          <div className="text-xs text-destructive text-center font-semibold bg-destructive/10 border border-destructive/20 p-3 rounded-xl animate-in fade-in">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="text-xs text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40 p-4 rounded-xl flex items-start gap-2.5 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <div className="space-y-2">
              <p className="font-semibold leading-relaxed">{successMessage}</p>
              <Link
                href="/login"
                className="inline-block text-xs font-bold text-primary underline"
              >
                Proceed to Sign In →
              </Link>
            </div>
          </div>
        )}

        {!successMessage && (
          <div className="space-y-4">
            <GoogleSignInButton
              label="Sign up with Google"
              redirectTo={typeof window !== "undefined" ? `${window.location.origin}/api/auth/callback` : undefined}
              onError={(msg) => setError(msg)}
            />

            <div className="relative flex items-center justify-center">
              <div className="border-t border-border w-full" />
              <span className="bg-card px-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider relative shrink-0">
                or sign up with email
              </span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username */}
            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">
                Username <span className="text-destructive">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-mono text-muted-foreground">
                  @
                </span>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s/g, ""))}
                  required
                  placeholder="elena_bakes"
                  className="w-full pl-7 pr-3.5 py-2 rounded-xl border border-input bg-background text-foreground text-sm focus:border-primary focus:outline-none transition-colors"
                />
              </div>
              <p className="text-[10px] text-muted-foreground mt-1">
                Letters, numbers, underscores, and periods. (Min 3 chars)
              </p>
            </div>

            {/* Display Name */}
            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">
                Display Name (Optional)
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Elena Rostova"
                className="w-full px-3.5 py-2 rounded-xl border border-input bg-background text-foreground text-sm focus:border-primary focus:outline-none transition-colors"
              />
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">
                Email Address <span className="text-destructive">*</span>
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

            {/* Password */}
            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">
                Password <span className="text-destructive">*</span>
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="At least 6 characters"
                className="w-full px-3.5 py-2 rounded-xl border border-input bg-background text-foreground text-sm focus:border-primary focus:outline-none transition-colors"
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">
                Confirm Password <span className="text-destructive">*</span>
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="Re-enter your password"
                className="w-full px-3.5 py-2 rounded-xl border border-input bg-background text-foreground text-sm focus:border-primary focus:outline-none transition-colors"
              />
            </div>

            {/* Submit Action */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/95 text-primary-foreground font-semibold rounded-xl py-2.5 transition-colors flex justify-center items-center gap-2 text-sm cursor-pointer shadow-xs active:scale-98"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Join Switch</span>
                </>
              )}
            </button>
          </form>
        </div>
      )}

        {/* Existing account prompt */}
        <p className="text-center text-xs text-muted-foreground pt-1">
          Already have an account?{" "}
          <Link href="/login" className="text-primary font-semibold hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
