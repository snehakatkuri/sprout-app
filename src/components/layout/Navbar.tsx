"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

export default function Navbar() {
  const pathname  = usePathname();
  const router    = useRouter();
  const [user, setUser] = useState<User | null>(null);

  const onResults = pathname === "/results" || pathname.startsWith("/activity");

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between px-10 h-16 bg-[#FAFAF6]/90 backdrop-blur-md border-b border-[#EAE8E2]">
      <Link
        href="/"
        className="flex items-center gap-2 font-[family-name:var(--font-fraunces)] text-[22px] font-medium text-[#1E3A1E] tracking-tight"
      >
        <span className="w-7 h-7 bg-[#4C7A3A] rounded-[50%_50%_50%_10px] flex items-center justify-center text-sm">
          🌱
        </span>
        Sprout
      </Link>

      <div className="flex items-center gap-2">
        {onResults && (
          <Link
            href="/search"
            className="px-4 py-2 rounded-full text-sm font-medium text-[#1C1C1A] hover:bg-[#EAE8E2] transition-colors"
          >
            ← Edit search
          </Link>
        )}

        {user ? (
          <>
            <Link
              href="/saved"
              className="px-4 py-2 rounded-full text-sm font-medium text-[#1C1C1A] hover:bg-[#EAE8E2] transition-colors flex items-center gap-1.5"
            >
              ♥ Saved
            </Link>
            <div className="flex items-center gap-2 pl-2 border-l border-[#EAE8E2]">
              <div className="w-8 h-8 rounded-full bg-[#D4EAC8] flex items-center justify-center text-sm font-semibold text-[#1E3A1E]">
                {(user.user_metadata?.full_name?.[0] ?? user.email?.[0] ?? "U").toUpperCase()}
              </div>
              <button
                onClick={handleSignOut}
                className="text-xs text-[#9A9590] hover:text-[#1C1C1A] transition-colors"
              >
                Sign out
              </button>
            </div>
          </>
        ) : (
          <>
            <Link
              href="/auth/signin"
              className="px-4 py-2 rounded-full text-sm font-medium text-[#1C1C1A] hover:bg-[#EAE8E2] transition-colors"
            >
              Sign in
            </Link>
            <Link
              href="/auth/signup"
              className="px-5 py-2 rounded-full text-sm font-medium bg-[#1E3A1E] text-white hover:bg-[#4C7A3A] transition-colors"
            >
              Sign up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
