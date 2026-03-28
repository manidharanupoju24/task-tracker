"use client";

import { useState } from "react";
import { signIn, signUp } from "@/lib/api";

interface AuthFormProps {
  onAuth: (token: string) => void;
}

export default function AuthForm({ onAuth }: AuthFormProps) {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      if (mode === "signin") {
        const token = await signIn(email, password);
        onAuth(token);
      } else {
        await signUp(email, password, displayName);
        const token = await signIn(email, password);
        onAuth(token);
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-violet-100 via-indigo-50 to-cyan-100 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-violet-600 to-indigo-500 bg-clip-text text-transparent">Task Tracker</h1>
          <p className="text-slate-400 mt-1 text-sm">Stay on top of what matters</p>
        </div>

        {/* Card */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white shadow-sm p-6 space-y-5">
          {/* Mode toggle */}
          <div className="flex rounded-xl bg-slate-50 p-1">
            <button
              type="button"
              onClick={() => { setMode("signin"); setError(null); setSuccessMsg(null); }}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${
                mode === "signin"
                  ? "bg-white text-slate-800 shadow-sm"
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setMode("signup"); setError(null); setSuccessMsg(null); }}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${
                mode === "signup"
                  ? "bg-white text-slate-800 shadow-sm"
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Success message */}
          {successMsg && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm rounded-xl px-4 py-3">
              ✅ {successMsg}
            </div>
          )}

          {/* Error message */}
          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-600 text-sm rounded-xl px-4 py-3">
              ⚠️ {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && (
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1.5">
                  Name
                </label>
                <input
                  type="text"
                  required
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Your name"
                  className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-300 transition-colors"
                />
              </div>
            )}
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1.5">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1.5">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                minLength={6}
                className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300 transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-gradient-to-r from-violet-500 to-indigo-500 hover:from-violet-600 hover:to-indigo-600 disabled:opacity-50 text-white text-sm font-medium rounded-xl transition-all shadow-sm"
            >
              {loading
                ? mode === "signin" ? "Signing in…" : "Creating account…"
                : mode === "signin" ? "Sign In" : "Create Account"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
