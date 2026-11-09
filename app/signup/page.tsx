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
          <h1 className="text-xl font-bold text-foreground">Create an Account</h1>
          <p className="text-xs text-muted-foreground">One identity across all specialized interest worlds</p>
        </div>

        {error && (
          <div className="text-xs text-destructive text-center font-semibold bg-destructive/10 border border-destructive/20 p-2.5 rounded-md">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5">Username</label>
            <input 
              type="text" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              required 
              placeholder="e.g. ElenaBakes"
              className="w-full px-3.5 py-2 rounded-md border border-input bg-background text-foreground text-sm focus:border-primary focus:outline-none transition-colors" 
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5">Email Address</label>
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
            <label className="block text-xs font-medium text-foreground mb-1.5">Password</label>
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
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Join Switch"}
          </button>
        </form>

        <p className="text-center text-xs text-muted-foreground">
          Already have an account? <Link href="/login" className="text-primary font-semibold hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
