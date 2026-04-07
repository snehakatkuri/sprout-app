"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import { INTERESTS } from "@/types";

const AGE_OPTIONS = [
  "Select age", "Under 2", "2–4 years", "5–7 years",
  "8–10 years", "11–13 years", "14–16 years",
];

const BUDGET_OPTIONS = [
  { key: "free",   icon: "🆓", label: "Free",   sub: "" },
  { key: "low",    icon: "💚", label: "Low",    sub: "Under $20" },
  { key: "medium", icon: "💛", label: "Medium", sub: "$20–$50" },
  { key: "any",    icon: "✨", label: "Any",    sub: "" },
] as const;

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FAFAF6]" />}>
      <SearchContent />
    </Suspense>
  );
}

function SearchContent() {
  const router = useRouter();
  const params = useSearchParams();

  const [childName, setChildName]   = useState("");
  const [childAge, setChildAge]     = useState("Select age");
  const [location, setLocation]     = useState("");
  const [distance, setDistance]     = useState(10);
  const [travel, setTravel]         = useState(30);
  const [budget, setBudget]         = useState<string>("free");
  const [interests, setInterests]   = useState<string[]>([]);

  useEffect(() => {
    const interest = params.get("interest");
    if (interest) setInterests([interest]);
  }, [params]);

  const toggleInterest = (label: string) => {
    setInterests(prev =>
      prev.includes(label) ? prev.filter(i => i !== label) : [...prev, label]
    );
  };

  const handleSearch = () => {
    const query = new URLSearchParams({
      location,
      childAge,
      interests: interests.join(","),
      distance: String(distance),
      travel: String(travel),
      budget,
    });
    router.push(`/results?${query.toString()}`);
  };

  return (
    <div className="min-h-screen bg-[#FAFAF6]">
      <Navbar />

      <div className="max-w-2xl mx-auto px-5 sm:px-10 py-10 sm:py-14 pb-20">
        <div className="mb-10 sm:mb-12">
          <h1 className="font-[family-name:var(--font-fraunces)] text-[32px] sm:text-[40px] font-normal text-[#1E3A1E] tracking-tight leading-tight mb-2">
            Find an activity
          </h1>
          <p className="text-[#9A9590] text-sm">
            Tell us a little about your child and what you&apos;re looking for.
          </p>
        </div>

        {/* About your child */}
        <FormSection title="About your child">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Child's name (optional)">
              <input className={inputCls} type="text" placeholder="e.g. Emma" value={childName} onChange={e => setChildName(e.target.value)} />
            </Field>
            <Field label="Age">
              <select className={inputCls} value={childAge} onChange={e => setChildAge(e.target.value)}>
                {AGE_OPTIONS.map(o => <option key={o}>{o}</option>)}
              </select>
            </Field>
          </div>
        </FormSection>

        {/* Interests */}
        <FormSection title="Interests">
          <div className="flex flex-wrap gap-2.5">
            {INTERESTS.map(({ label, emoji }) => (
              <button
                key={label}
                onClick={() => toggleInterest(label)}
                className={[
                  "inline-flex items-center gap-1.5 px-4 py-2 rounded-full border text-sm font-medium transition-all",
                  interests.includes(label)
                    ? "bg-[#1E3A1E] border-[#1E3A1E] text-white"
                    : "bg-white border-[#EAE8E2] text-[#1C1C1A] hover:border-[#4C7A3A] hover:text-[#4C7A3A]",
                ].join(" ")}
              >
                <span className="text-[15px]">{emoji}</span> {label}
              </button>
            ))}
          </div>
        </FormSection>

        {/* Location & Distance */}
        <FormSection title="Location & Distance">
          <Field label="Location" className="mb-5">
            <input className={inputCls} type="text" placeholder="City, postcode, or address" value={location} onChange={e => setLocation(e.target.value)} />
          </Field>
          <Field label="Maximum distance">
            <input type="range" min={1} max={50} value={distance} onChange={e => setDistance(Number(e.target.value))} />
            <div className="flex justify-between text-xs text-[#9A9590] mt-2">
              <span>1 mile</span>
              <span>Within <strong className="text-[#1E3A1E]">{distance} miles</strong></span>
              <span>50 miles</span>
            </div>
          </Field>
        </FormSection>

        {/* Travel time */}
        <FormSection title="Travel time">
          <Field label="Maximum travel time">
            <input type="range" min={5} max={120} step={5} value={travel} onChange={e => setTravel(Number(e.target.value))} />
            <div className="flex justify-between text-xs text-[#9A9590] mt-2">
              <span>5 min</span>
              <span>Up to <strong className="text-[#1E3A1E]">{travel} min</strong></span>
              <span>2 hrs</span>
            </div>
          </Field>
        </FormSection>

        {/* Budget */}
        <FormSection title="Budget">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {BUDGET_OPTIONS.map(({ key, icon, label, sub }) => (
              <button
                key={key}
                onClick={() => setBudget(key)}
                className={[
                  "p-3 border rounded-[14px] text-center text-sm font-medium transition-all",
                  budget === key
                    ? "bg-[#1E3A1E] border-[#1E3A1E] text-white"
                    : "bg-white border-[#EAE8E2] text-[#1C1C1A] hover:border-[#4C7A3A]",
                ].join(" ")}
              >
                <span className="block text-lg mb-1">{icon}</span>
                {label}
                {sub && <div className="text-[10px] opacity-70 mt-0.5">{sub}</div>}
              </button>
            ))}
          </div>
        </FormSection>

        <div className="flex flex-col sm:flex-row justify-end gap-3 mt-8">
          <button onClick={() => router.push("/")} className="w-full sm:w-auto px-7 py-3 rounded-full border-[1.5px] border-[#1E3A1E] text-[#1E3A1E] text-sm font-medium hover:bg-[#1E3A1E] hover:text-white transition-colors">
            ← Back
          </button>
          <button onClick={handleSearch} className="w-full sm:w-auto px-7 py-3 rounded-full bg-[#1E3A1E] text-white text-sm font-medium hover:bg-[#4C7A3A] transition-colors shadow-[0_2px_12px_rgba(30,58,30,.2)]">
            Search activities →
          </button>
        </div>
      </div>
    </div>
  );
}

const inputCls = "w-full text-sm px-4 py-3 border-[1.5px] border-[#EAE8E2] rounded-[14px] bg-white text-[#1C1C1A] outline-none focus:border-[#4C7A3A] focus:shadow-[0_0_0_3px_rgba(107,160,80,.12)] placeholder:text-[#9A9590] transition-all appearance-none";

function FormSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-[#EAE8E2] rounded-[22px] p-6 sm:p-8 mb-5">
      <div className="flex items-center gap-3 text-[11px] font-semibold tracking-[.07em] uppercase text-[#9A9590] mb-6">
        {title}
        <span className="flex-1 h-px bg-[#EAE8E2]" />
      </div>
      {children}
    </div>
  );
}

function Field({ label, children, className = "" }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label className="text-[11px] font-semibold tracking-[.06em] uppercase text-[#9A9590]">{label}</label>
      {children}
    </div>
  );
}
