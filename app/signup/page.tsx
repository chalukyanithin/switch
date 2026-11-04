"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, ArrowLeft } from "lucide-react";

export default function Signup() {
  const [username, setUsername] = useState("");
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
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      if (res.ok) {
        router.push("/login");
      } else {
        const data = await res.json();
        setError(data.message || "Failed to register account.");
      }
    } catch {
      setError("Network error attempting to register.");
    } finally {
      setLoading(false);
    }
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
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">Create an Account</h1>
          <p className="text-xs text-gray-500">One identity across all specialized interest worlds</p>
        </div>

        {error && (
          <div className="text-xs text-red-500 text-center font-semibold bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 p-2.5 rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">Username</label>
            <input 
              type="text" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              required 
              placeholder="e.g. ElenaBakes"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-[#506ffc]/20 focus:border-[#506ffc] outline-none transition" 
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">Email Address</label>
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
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">Password</label>
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
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Join Switch"}
          </button>
        </form>

        <p className="text-center text-xs text-gray-500">
          Already have an account? <Link href="/login" className="text-[#506ffc] font-bold hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
