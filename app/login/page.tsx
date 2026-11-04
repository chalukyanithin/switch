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
      <div className="w-full max-w-md bg-card rounded-3xl shadow-xl p-8 border border-border space-y-6">
        {/* Back Link */}
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Switch</span>
          </Link>
        </div>

        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <img src="/switch-logo-blue.png" alt="Switch" className="w-10 h-10 rounded-xl shadow-xs" />
            <span className="font-black text-2xl tracking-tight bg-gradient-to-r from-[#506ffc] to-blue-700 bg-clip-text text-transparent">
              SWITCH
            </span>
          </Link>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">Welcome Back</h1>
          <p className="text-xs text-gray-500">Sign in to your account to switch worlds</p>
        </div>

        {error && (
          <div className="text-xs text-red-500 text-center font-semibold bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 p-2.5 rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@domain.com"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-[#506ffc]/20 focus:border-[#506ffc] outline-none transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-[#506ffc]/20 focus:border-[#506ffc] outline-none transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#506ffc] hover:bg-blue-600 text-white font-bold rounded-xl py-3 transition-colors flex justify-center items-center shadow-lg shadow-[#506ffc]/25 text-sm cursor-pointer"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign In to Switch"}
          </button>
        </form>

        {/* Demo Login Quick Fills */}
        <div className="pt-2 border-t border-gray-100 dark:border-gray-800 space-y-2">
          <p className="text-[11px] font-semibold text-gray-400 text-center flex items-center justify-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-500" />
            Quick Demo Accounts:
          </p>
          <div className="flex flex-wrap gap-1.5 justify-center">
            <button
              type="button"
              onClick={() => handleDemoLogin("alpha@bot.switch")}
              className="px-2.5 py-1 rounded-lg text-xs bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors"
            >
              Chef Elena (Demo)
            </button>
            <button
              type="button"
              onClick={() => handleDemoLogin("guru@bot.switch")}
              className="px-2.5 py-1 rounded-lg text-xs bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors"
            >
              Engineer Sarah (Demo)
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-gray-500">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-[#506ffc] font-bold hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
