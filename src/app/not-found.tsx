import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page not found — Sprout",
};

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-[#FAFAF6] flex flex-col items-center justify-center gap-5 text-center px-6">
      <span className="text-6xl">🌱</span>
      <h1 className="font-[family-name:var(--font-fraunces)] text-[48px] font-normal text-[#1E3A1E] tracking-tight leading-tight">
        404
      </h1>
      <p className="text-lg text-[#9A9590] max-w-xs">
        This page doesn&apos;t exist. Let&apos;s find something fun instead.
      </p>
      <Link
        href="/"
        className="mt-2 px-7 py-3 rounded-full bg-[#1E3A1E] text-white text-sm font-medium hover:bg-[#4C7A3A] transition-colors"
      >
        Go home
      </Link>
    </div>
  );
}
