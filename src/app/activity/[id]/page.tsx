"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { mockActivities } from "@/lib/mockActivities";
import { createClient } from "@/lib/supabase/client";
import { Activity } from "@/types";

export default function ActivityDetailPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [saved, setSaved]       = useState(false);
  const [userId, setUserId]     = useState<string | null>(null);
  const [saving, setSaving]     = useState(false);
  const [loading, setLoading]   = useState(true);
  const [activity, setActivity] = useState<Activity | null>(null);

  useEffect(() => {
    // Simulate load (replace with real API fetch when available)
    const found = mockActivities.find(a => a.id === id) ?? mockActivities[0];
    setTimeout(() => { setActivity(found); setLoading(false); }, 400);

    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) return;
      setUserId(data.user.id);
      const { data: existing } = await supabase
        .from("saved_activities")
        .select("id")
        .eq("user_id", data.user.id)
        .eq("activity_id", id)
        .maybeSingle();
      setSaved(!!existing);
    });
  }, [id]);

  const toggleSave = async () => {
    if (!userId) { router.push("/auth/signin"); return; }
    if (!activity) return;
    setSaving(true);
    const supabase = createClient();
    if (saved) {
      await supabase.from("saved_activities").delete().eq("user_id", userId).eq("activity_id", id);
      setSaved(false);
    } else {
      await supabase.from("saved_activities").insert({
        user_id: userId, activity_id: id,
        name: activity.name, type: activity.type,
        image_url: activity.imageUrl, address: activity.address,
        cost_label: activity.costLabel, distance: activity.distanceMiles,
      });
      setSaved(true);
    }
    setSaving(false);
  };

  if (loading) return <DetailSkeleton onBack={() => router.push("/results")} />;
  if (!activity) return <NotFound />;

  return (
    <div className="min-h-screen bg-[#FAFAF6]">
      {/* Hero */}
      <div className="relative h-[300px] sm:h-[420px] overflow-hidden">
        <Image src={activity.imageUrl} alt={activity.name} fill className="object-cover" priority sizes="100vw" unoptimized />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(30,58,30,.65) 0%, transparent 60%)" }} />

        <button onClick={() => router.push("/results")} className="absolute top-5 left-5 sm:top-6 sm:left-8 z-10 flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/25 text-white rounded-full px-4 py-2.5 text-sm font-medium hover:bg-white/25 transition-colors">
          ← Back
        </button>

        <div className="absolute bottom-5 left-5 right-5 sm:bottom-7 sm:left-8 sm:right-8 flex items-end justify-between z-10 gap-4">
          <div className="min-w-0">
            <div className="text-[11px] font-bold tracking-[.12em] uppercase text-white/70 mb-1.5">{activity.type}</div>
            <h1 className="font-[family-name:var(--font-fraunces)] text-2xl sm:text-[38px] font-normal text-white tracking-tight leading-tight">{activity.name}</h1>
          </div>
          <button onClick={toggleSave} disabled={saving} className={["flex items-center gap-2 rounded-full px-4 py-2.5 sm:px-5 sm:py-3 text-sm font-medium border transition-all flex-shrink-0 self-end disabled:opacity-70", saved ? "bg-white text-[#1E3A1E] border-white" : "bg-white/15 backdrop-blur-sm border-white/30 text-white hover:bg-white hover:text-[#1E3A1E] hover:border-white"].join(" ")}>
            <span className={`text-base transition-transform ${saved ? "scale-125" : ""}`}>{saved ? "♥" : "♡"}</span>
            <span className="hidden sm:inline">{saving ? "…" : saved ? "Saved" : "Save"}</span>
          </button>
        </div>
      </div>

      {/* Body — single col on mobile, two col on desktop */}
      <div className="max-w-4xl mx-auto px-5 sm:px-10 py-8 sm:py-12 pb-20 grid grid-cols-1 md:grid-cols-[1fr_300px] gap-8 md:gap-12">
        <div>
          <Section title="About this activity">
            <p className="text-base leading-[1.75] text-[#3a3a38]">{activity.description}</p>
          </Section>
          <Section title="Tags">
            <div className="flex flex-wrap gap-2">
              {activity.tags.map(tag => (
                <span key={tag} className="px-4 py-2 rounded-full border border-[#EAE8E2] text-sm font-medium text-[#1C1C1A] bg-white">{tag}</span>
              ))}
            </div>
          </Section>
          <Section title="What to bring">
            <p className="text-base leading-relaxed text-[#3a3a38]">All materials provided. Wear clothes you don&apos;t mind getting messy!</p>
          </Section>
          {!userId && (
            <div className="mt-6 p-5 bg-[#D4EAC8] rounded-[16px] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="font-semibold text-[#1E3A1E] text-sm">Save activities for later</div>
                <div className="text-xs text-[#4C7A3A] mt-0.5">Create a free account to build your list.</div>
              </div>
              <Link href="/auth/signup" className="px-4 py-2.5 bg-[#1E3A1E] text-white text-sm font-medium rounded-full hover:bg-[#4C7A3A] transition-colors whitespace-nowrap">
                Sign up free
              </Link>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div>
          <div className="bg-white border border-[#EAE8E2] rounded-[22px] overflow-hidden mb-5">
            {[
              { icon: "🎂", label: "Age range", value: activity.ageMax ? `${activity.ageMin}–${activity.ageMax} years` : `${activity.ageMin}+ years` },
              { icon: "💰", label: "Cost",       value: activity.costLabel },
              { icon: "⏱️", label: "Duration",   value: activity.duration ?? "Varies" },
              { icon: "📅", label: "Schedule",   value: activity.schedule ?? "See venue" },
              { icon: "📍", label: "Distance",   value: `${activity.distanceMiles} miles · ${activity.driveMinutes} min drive` },
            ].map(({ icon, label, value }, i, arr) => (
              <div key={label} className={`flex items-center gap-3.5 px-5 py-4 ${i < arr.length - 1 ? "border-b border-[#EAE8E2]" : ""}`}>
                <div className="w-9 h-9 rounded-full bg-[#D4EAC8] flex items-center justify-center text-base flex-shrink-0">{icon}</div>
                <div>
                  <div className="text-[10px] font-bold tracking-[.07em] uppercase text-[#9A9590]">{label}</div>
                  <div className="text-sm font-medium text-[#1C1C1A] mt-0.5">{value}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="relative h-40 rounded-[22px] overflow-hidden border border-[#EAE8E2] bg-[#EEF5E8] mb-3">
            <div className="absolute inset-0" style={{ background: "repeating-linear-gradient(0deg, transparent, transparent 29px, rgba(107,160,80,.1) 30px), repeating-linear-gradient(90deg, transparent, transparent 29px, rgba(107,160,80,.1) 30px)" }} />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-5 h-5 bg-[#1E3A1E] shadow-md z-10" style={{ borderRadius: "50% 50% 50% 0", transform: "rotate(-45deg)" }} />
            </div>
          </div>
          <p className="text-xs text-[#9A9590] leading-relaxed mb-3">{activity.address}</p>
          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(activity.address)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#1E3A1E] text-white text-sm font-medium rounded-[14px] hover:bg-[#4C7A3A] transition-colors"
          >
            🗺️ Get directions
          </a>
        </div>
      </div>
    </div>
  );
}

/* ── Loading skeleton ── */
function DetailSkeleton({ onBack }: { onBack: () => void }) {
  return (
    <div className="min-h-screen bg-[#FAFAF6] animate-pulse">
      <div className="relative h-[300px] sm:h-[420px] bg-[#EAE8E2]">
        <button onClick={onBack} className="absolute top-5 left-5 sm:top-6 sm:left-8 z-10 flex items-center gap-2 bg-white/40 rounded-full px-4 py-2.5 text-sm text-transparent">
          ← Back
        </button>
        <div className="absolute bottom-5 left-5 sm:bottom-7 sm:left-8">
          <div className="h-3 w-20 bg-white/30 rounded mb-3" />
          <div className="h-8 w-72 bg-white/40 rounded" />
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-5 sm:px-10 py-10 grid grid-cols-1 md:grid-cols-[1fr_300px] gap-8">
        <div className="flex flex-col gap-4">
          <div className="h-3 w-24 bg-[#EAE8E2] rounded" />
          <div className="h-4 bg-[#EAE8E2] rounded w-full" />
          <div className="h-4 bg-[#EAE8E2] rounded w-5/6" />
          <div className="h-4 bg-[#EAE8E2] rounded w-4/6" />
        </div>
        <div className="bg-white border border-[#EAE8E2] rounded-[22px] h-64" />
      </div>
    </div>
  );
}

/* ── 404 inside page ── */
function NotFound() {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-[#FAFAF6] flex flex-col items-center justify-center gap-4 text-center px-6">
      <span className="text-5xl">🌱</span>
      <h1 className="font-[family-name:var(--font-fraunces)] text-3xl text-[#1E3A1E]">Activity not found</h1>
      <p className="text-sm text-[#9A9590]">This activity may no longer be available.</p>
      <button onClick={() => router.push("/results")} className="mt-2 px-6 py-3 rounded-full bg-[#1E3A1E] text-white text-sm font-medium hover:bg-[#4C7A3A] transition-colors">
        Back to results
      </button>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-10">
      <div className="text-[11px] font-bold tracking-[.1em] uppercase text-[#9A9590] mb-4">{title}</div>
      {children}
    </div>
  );
}
