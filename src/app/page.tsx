import Link from "next/link";
import Navbar from "@/components/layout/Navbar";

const CATEGORIES = [
  { label: "Sports",        emoji: "⚽", tag: "Sports" },
  { label: "Arts & Crafts", emoji: "🎨", tag: "Arts" },
  { label: "Science",       emoji: "🔬", tag: "Science" },
  { label: "Outdoors",      emoji: "🌲", tag: "Outdoors" },
  { label: "Music",         emoji: "🎵", tag: "Music" },
  { label: "Animals",       emoji: "🐾", tag: "Animals" },
  { label: "Cooking",       emoji: "🍳", tag: "Cooking" },
  { label: "Swimming",      emoji: "🏊", tag: "Swimming" },
];

const STEPS = [
  { n: "1", title: "Tell us about your kid",  desc: "Set their age, interests, and how far you're willing to travel. Takes under a minute." },
  { n: "2", title: "Browse curated results",  desc: "See activities on a map and list view, filtered to fit your budget and schedule." },
  { n: "3", title: "Save your favourites",    desc: "Create an account to save activities and get personalised suggestions over time." },
  { n: "4", title: "Go have fun",             desc: "Get directions and venue details. Booking and scheduling coming in the next release." },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#FAFAF6]">
      <Navbar />

      {/* ── Hero ── */}
      <section className="relative min-h-[calc(100vh-64px)] flex items-center px-10 py-20 overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 60% 80% at 80% 50%, rgba(212,234,200,.5) 0%, transparent 70%), radial-gradient(ellipse 40% 40% at 10% 90%, rgba(107,160,80,.08) 0%, transparent 60%)",
          }}
        />
        <div
          className="pointer-events-none absolute -right-24 top-1/2 -translate-y-1/2 w-[560px] h-[560px] rounded-full opacity-70"
          style={{ background: "radial-gradient(ellipse, #D4EAC8 0%, transparent 70%)" }}
        />

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-[#4C7A3A] mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#6BA050]" />
            Kid-friendly, curator-approved
          </div>

          <h1 className="font-[family-name:var(--font-fraunces)] text-[clamp(48px,6vw,76px)] font-normal leading-[1.08] tracking-tight text-[#1E3A1E] mb-6">
            Discover activities
            <br />
            your kids will{" "}
            <em className="italic text-[#4C7A3A]">love</em>
          </h1>

          <p className="text-lg font-light text-[#9A9590] leading-relaxed mb-12 max-w-md">
            Find the perfect outing — from arts and science to sports and the
            outdoors — matched to your child&apos;s age, interests, and your budget.
          </p>

          <div className="flex items-center gap-3 bg-white rounded-[32px] px-6 py-2 max-w-[480px]"
            style={{ boxShadow: "0 12px 48px rgba(30,58,30,.14)" }}>
            <span className="text-[#9A9590] text-sm">📍</span>
            <input
              type="text"
              placeholder="Enter your city or postcode…"
              className="flex-1 text-sm bg-transparent border-none outline-none text-[#1C1C1A] placeholder:text-[#9A9590] py-2"
            />
            <Link
              href="/search"
              className="bg-[#1E3A1E] text-white text-sm font-medium px-5 py-2.5 rounded-full hover:bg-[#4C7A3A] transition-colors whitespace-nowrap"
            >
              Find activities →
            </Link>
          </div>

          <div className="flex gap-10 mt-14">
            {[
              { num: "12k+", label: "Activities listed" },
              { num: "480",  label: "Cities covered" },
              { num: "Free", label: "Always free to use" },
            ].map(({ num, label }) => (
              <div key={label}>
                <div className="font-[family-name:var(--font-fraunces)] text-3xl font-medium text-[#1E3A1E] tracking-tight">
                  {num}
                </div>
                <div className="text-xs text-[#9A9590] mt-0.5">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Categories ── */}
      <section className="px-10 py-20 bg-[#F3F1EB]">
        <h2 className="font-[family-name:var(--font-fraunces)] text-xs font-normal tracking-[.1em] uppercase text-[#9A9590] mb-8">
          Browse by interest
        </h2>
        <div className="flex flex-wrap gap-4">
          {CATEGORIES.map(({ label, emoji, tag }) => (
            <Link
              key={label}
              href={`/search?interest=${tag}`}
              className="bg-white border border-[#EAE8E2] rounded-[22px] px-6 py-5 flex flex-col gap-2 min-w-[130px] hover:border-[#4C7A3A] hover:shadow-md hover:-translate-y-0.5 transition-all"
            >
              <span className="text-2xl">{emoji}</span>
              <span className="text-sm font-medium text-[#1C1C1A]">{label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="px-10 py-24 max-w-5xl mx-auto">
        <div className="mb-16">
          <div className="text-xs font-semibold tracking-widest uppercase text-[#4C7A3A] mb-3">
            How it works
          </div>
          <h2 className="font-[family-name:var(--font-fraunces)] text-[clamp(32px,4vw,48px)] font-normal text-[#1E3A1E] tracking-tight leading-tight">
            Find the right activity
            <br />
            in three steps
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {STEPS.map(({ n, title, desc }) => (
            <div key={n} className="flex flex-col gap-4">
              <div className="w-9 h-9 rounded-full bg-[#D4EAC8] flex items-center justify-center font-[family-name:var(--font-fraunces)] text-base font-medium text-[#1E3A1E]">
                {n}
              </div>
              <div className="font-semibold text-base text-[#1C1C1A]">{title}</div>
              <div className="text-sm text-[#9A9590] leading-relaxed">{desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="px-10 py-12 border-t border-[#EAE8E2] flex items-center justify-between text-sm text-[#9A9590]">
        <div className="flex items-center gap-2 font-[family-name:var(--font-fraunces)] text-xl font-medium text-[#1E3A1E]">
          <span className="w-7 h-7 bg-[#4C7A3A] rounded-[50%_50%_50%_10px] flex items-center justify-center text-sm">
            🌱
          </span>
          Sprout
        </div>
        <div>© 2026 Sprout. Making every weekend count.</div>
      </footer>
    </div>
  );
}
