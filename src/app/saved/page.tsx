"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import { createClient } from "@/lib/supabase/client";

interface SavedActivity {
  id: string;
  activity_id: string;
  name: string;
  type: string;
  image_url: string;
  address: string;
  cost_label: string;
  distance: number;
}

export default function SavedPage() {
  const router = useRouter();
  const [activities, setActivities] = useState<SavedActivity[]>([]);
  const [loading, setLoading]       = useState(true);

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) { router.push("/auth/signin"); return; }

      const { data: saved } = await supabase
        .from("saved_activities")
        .select("*")
        .eq("user_id", data.user.id)
        .order("created_at", { ascending: false });

      setActivities(saved ?? []);
      setLoading(false);
    });
  }, [router]);

  const unsave = async (id: string) => {
    const supabase = createClient();
    await supabase.from("saved_activities").delete().eq("id", id);
    setActivities(prev => prev.filter(a => a.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#FAFAF6]">
      <Navbar />

      <div className="max-w-3xl mx-auto px-10 py-14 pb-20">
        <div className="mb-10">
          <h1 className="font-[family-name:var(--font-fraunces)] text-[40px] font-normal text-[#1E3A1E] tracking-tight mb-1">
            Saved activities
          </h1>
          <p className="text-sm text-[#9A9590]">Your shortlist of activities to try.</p>
        </div>

        {loading ? (
          <div className="flex flex-col gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex bg-white border border-[#EAE8E2] rounded-[22px] overflow-hidden h-[110px] animate-pulse">
                <div className="w-[110px] bg-[#EAE8E2]" />
                <div className="p-4 flex flex-col gap-2 flex-1">
                  <div className="h-2.5 bg-[#EAE8E2] rounded w-1/3" />
                  <div className="h-4 bg-[#EAE8E2] rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : activities.length === 0 ? (
          <div className="text-center py-20 flex flex-col items-center gap-4">
            <span className="text-5xl">♡</span>
            <div className="font-[family-name:var(--font-fraunces)] text-2xl text-[#1E3A1E]">No saved activities yet</div>
            <p className="text-sm text-[#9A9590] max-w-xs">Start searching and tap Save on activities you like.</p>
            <Link href="/search" className="mt-2 px-6 py-3 rounded-full bg-[#1E3A1E] text-white text-sm font-medium hover:bg-[#4C7A3A] transition-colors">
              Find activities
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {activities.map(a => (
              <div key={a.id} className="flex bg-white border border-[#EAE8E2] rounded-[22px] overflow-hidden hover:shadow-md hover:border-transparent transition-all">
                <div className="w-[110px] flex-shrink-0 relative bg-[#EAE8E2]">
                  <Image src={a.image_url} alt={a.name} fill className="object-cover" sizes="110px" unoptimized />
                </div>
                <div className="p-4 flex flex-col gap-1.5 flex-1 min-w-0">
                  <div className="text-[11px] font-bold tracking-[.07em] uppercase text-[#4C7A3A]">{a.type}</div>
                  <Link href={`/activity/${a.activity_id}`} className="font-[family-name:var(--font-fraunces)] text-[17px] font-normal text-[#1E3A1E] hover:underline truncate">
                    {a.name}
                  </Link>
                  <div className="text-xs text-[#9A9590]">📍 {a.address}</div>
                  <div className="flex gap-2 mt-1">
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#F3F1EB] text-[#9A9590]">{a.cost_label}</span>
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[rgba(107,160,80,.12)] text-[#4C7A3A]">{a.distance} mi</span>
                  </div>
                </div>
                <button
                  onClick={() => unsave(a.id)}
                  className="px-4 text-[#9A9590] hover:text-red-400 transition-colors text-lg flex-shrink-0"
                  title="Remove"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
