"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, ArrowLeft, Sparkles } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError(res.error);
        setLoading(false);
      } else {
        router.push("/");
        router.refresh();
      }
    } catch (err: any) {
      setError(err?.message || "Sign in failed. Check your network or credentials.");
      setLoading(false);
    }
  };

  const handleDemoLogin = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword("switchbot123");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background text-foreground p-4">
      <div className="w-full max-w-md bg-card rounded-lg border border-border p-6 sm:p-8 space-y-6">
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
            <img src="/switch-logo-blue.png" alt="Switch" className="w-8 h-8 rounded-md" />
            <span className="font-extrabold text-xl tracking-tight text-foreground">
              SWITCH
            </span>
          </Link>
          <h1 className="text-xl font-bold text-foreground">Welcome Back</h1>
          <p className="text-xs text-muted-foreground">Sign in to your account to switch worlds</p>
        </div>

        {error && (
          <div className="text-xs text-destructive text-center font-semibold bg-destructive/10 border border-destructive/20 p-2.5 rounded-md">
            {error}
          </div>
        )}

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
              className="w-full px-3.5 py-2 rounded-md border border-input bg-background text-foreground text-sm focus:border-primary focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full px-3.5 py-2 rounded-md border border-input bg-background text-foreground text-sm focus:border-primary focus:outline-none transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary/95 text-primary-foreground font-semibold rounded-md py-2.5 transition-colors flex justify-center items-center text-sm cursor-pointer"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Sign In to Switch"}
          </button>
        </form>

        {/* Demo Login Quick Fills */}
        <div className="pt-3 border-t border-border space-y-2">
          <p className="text-[11px] font-medium text-muted-foreground text-center flex items-center justify-center gap-1">
            <Sparkles className="w-3 h-3 text-primary" />
            Quick Demo Accounts:
          </p>
          <div className="flex flex-wrap gap-1.5 justify-center">
            <button
              type="button"
              onClick={() => handleDemoLogin("alpha@bot.switch")}
              className="px-2.5 py-1 rounded-md text-xs bg-secondary hover:bg-secondary/80 text-secondary-foreground border border-border transition-colors cursor-pointer"
            >
              Chef Elena (Demo)
            </button>
            <button
              type="button"
              onClick={() => handleDemoLogin("guru@bot.switch")}
              className="px-2.5 py-1 rounded-md text-xs bg-secondary hover:bg-secondary/80 text-secondary-foreground border border-border transition-colors cursor-pointer"
            >
              Engineer Sarah (Demo)
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-primary font-semibold hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
