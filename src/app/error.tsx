"use client";

import { useEffect } from "react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#FAFAF6] flex flex-col items-center justify-center gap-5 text-center px-6">
      <span className="text-5xl">😔</span>
      <h1 className="font-[family-name:var(--font-fraunces)] text-3xl font-normal text-[#1E3A1E]">
        Something went wrong
      </h1>
      <p className="text-sm text-[#9A9590] max-w-xs">
        We hit an unexpected error. Try again or go back home.
      </p>
      <div className="flex gap-3 mt-2">
        <button
          onClick={reset}
          className="px-6 py-3 rounded-full bg-[#1E3A1E] text-white text-sm font-medium hover:bg-[#4C7A3A] transition-colors"
        >
          Try again
        </button>
        <a
          href="/"
          className="px-6 py-3 rounded-full border border-[#1E3A1E] text-[#1E3A1E] text-sm font-medium hover:bg-[#1E3A1E] hover:text-white transition-colors"
        >
          Go home
        </a>
      </div>
    </div>
  );
}
