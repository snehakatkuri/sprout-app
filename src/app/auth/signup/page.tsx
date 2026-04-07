"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function SignUpPage() {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [name, setName]         = useState("");
  const [error, setError]       = useState("");
  const [success, setSuccess]   = useState(false);
  const [loading, setLoading]   = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email, password,
      options: { data: { full_name: name } },
    });
    if (error) { setError(error.message); setLoading(false); return; }
    setSuccess(true);
    setLoading(false);
  };

  const handleGoogle = async () => {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${location.origin}/auth/callback` },
    });
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[#FAFAF6] flex items-center justify-center px-4">
        <div className="w-full max-w-[400px] text-center">
          <div className="text-5xl mb-4">🌱</div>
          <h1 className="font-[family-name:var(--font-fraunces)] text-3xl font-normal text-[#1E3A1E] mb-3">Check your email</h1>
          <p className="text-sm text-[#9A9590] leading-relaxed mb-6">
            We sent a confirmation link to <strong className="text-[#1C1C1A]">{email}</strong>. Click the link to activate your account.
          </p>
          <Link href="/auth/signin" className="text-sm text-[#1E3A1E] font-medium hover:underline">
            Back to sign in
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAF6] flex items-center justify-center px-4">
      <div className="w-full max-w-[400px]">
        <Link href="/" className="flex items-center justify-center gap-2 mb-10">
          <span className="w-8 h-8 bg-[#4C7A3A] rounded-[50%_50%_50%_10px] flex items-center justify-center text-base">🌱</span>
          <span className="font-[family-name:var(--font-fraunces)] text-2xl font-medium text-[#1E3A1E]">Sprout</span>
        </Link>

        <div className="bg-white border border-[#EAE8E2] rounded-[24px] p-8">
          <h1 className="font-[family-name:var(--font-fraunces)] text-3xl font-normal text-[#1E3A1E] mb-1">Create account</h1>
          <p className="text-sm text-[#9A9590] mb-8">Save activities and get personalised suggestions.</p>

          <button
            onClick={handleGoogle}
            className="w-full flex items-center justify-center gap-3 py-3 border border-[#EAE8E2] rounded-[14px] text-sm font-medium text-[#1C1C1A] hover:bg-[#F3F1EB] transition-colors mb-6"
          >
            <svg width="18" height="18" viewBox="0 0 18 18"><path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/><path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/><path d="M3.964 10.707A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.007-2.332z" fill="#FBBC05"/><path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.961L3.964 7.293C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/></svg>
            Continue with Google
          </button>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-[#EAE8E2]" />
            <span className="text-xs text-[#9A9590]">or</span>
            <div className="flex-1 h-px bg-[#EAE8E2]" />
          </div>

          <form onSubmit={handleSignUp} className="flex flex-col gap-4">
            {error && (
              <div className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-[10px] px-4 py-3">
                {error}
              </div>
            )}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold tracking-[.06em] uppercase text-[#9A9590]">Your name</label>
              <input
                type="text" value={name} onChange={e => setName(e.target.value)}
                placeholder="Jane Smith"
                className="px-4 py-3 border border-[#EAE8E2] rounded-[14px] text-sm outline-none focus:border-[#4C7A3A] focus:shadow-[0_0_0_3px_rgba(107,160,80,.12)] transition-all placeholder:text-[#9A9590]"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold tracking-[.06em] uppercase text-[#9A9590]">Email</label>
              <input
                type="email" required value={email} onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="px-4 py-3 border border-[#EAE8E2] rounded-[14px] text-sm outline-none focus:border-[#4C7A3A] focus:shadow-[0_0_0_3px_rgba(107,160,80,.12)] transition-all placeholder:text-[#9A9590]"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold tracking-[.06em] uppercase text-[#9A9590]">Password</label>
              <input
                type="password" required minLength={6} value={password} onChange={e => setPassword(e.target.value)}
                placeholder="Min. 6 characters"
                className="px-4 py-3 border border-[#EAE8E2] rounded-[14px] text-sm outline-none focus:border-[#4C7A3A] focus:shadow-[0_0_0_3px_rgba(107,160,80,.12)] transition-all placeholder:text-[#9A9590]"
              />
            </div>
            <button
              type="submit" disabled={loading}
              className="w-full py-3 bg-[#1E3A1E] text-white text-sm font-medium rounded-[14px] hover:bg-[#4C7A3A] transition-colors disabled:opacity-60 mt-2"
            >
              {loading ? "Creating account…" : "Create account"}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-[#9A9590] mt-6">
          Already have an account?{" "}
          <Link href="/auth/signin" className="text-[#1E3A1E] font-medium hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
