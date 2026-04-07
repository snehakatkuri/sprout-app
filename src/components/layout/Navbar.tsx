"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
  const onResults = pathname === "/results" || pathname.startsWith("/activity");

  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between px-10 h-16 bg-cream/90 backdrop-blur-md border-b border-mist">
      <Link
        href="/"
        className="flex items-center gap-2 font-display text-[22px] font-medium text-forest tracking-tight"
      >
        <span className="w-7 h-7 bg-sage rounded-[50%_50%_50%_10px] flex items-center justify-center text-sm">
          🌱
        </span>
        Sprout
      </Link>

      <div className="flex items-center gap-2">
        {onResults && (
          <Link
            href="/search"
            className="px-4 py-2 rounded-full text-sm font-medium text-ink hover:bg-mist transition-colors"
          >
            ← Edit search
          </Link>
        )}
        <button className="px-4 py-2 rounded-full text-sm font-medium text-ink hover:bg-mist transition-colors">
          Sign in
        </button>
        <Link
          href="/search"
          className="px-5 py-2 rounded-full text-sm font-medium bg-forest text-white hover:bg-sage transition-colors"
        >
          Find activities
        </Link>
      </div>
    </nav>
  );
}
