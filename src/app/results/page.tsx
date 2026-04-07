"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Navbar from "@/components/layout/Navbar";
import { mockActivities } from "@/lib/mockActivities";
import { Activity } from "@/types";

const MAP_PINS = [
  { id: "1", label: "Tiny Brushstrokes", left: "30%", top: "45%" },
  { id: "2", label: "Golden Gate Trail",  left: "55%", top: "32%" },
  { id: "3", label: "Exploratorium",      left: "70%", top: "55%" },
  { id: "4", label: "Aqua Cubs",          left: "22%", top: "65%" },
  { id: "5", label: "Little Composers",  left: "45%", top: "70%" },
  { id: "6", label: "SF Zoo",             left: "60%", top: "78%" },
];

export default function ResultsPage() {
  const router = useRouter();
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-[#FAFAF6] flex flex-col">
      <Navbar />

      <div className="flex flex-1 overflow-hidden" style={{ height: "calc(100vh - 64px)" }}>
        {/* ── Left panel ── */}
        <div className="flex flex-col border-r border-[#EAE8E2] overflow-hidden" style={{ width: 420, flexShrink: 0 }}>
          {/* Toolbar */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-[#EAE8E2] bg-white flex-shrink-0">
            <div>
              <span className="font-[family-name:var(--font-fraunces)] text-xl font-normal text-[#1E3A1E]">
                {mockActivities.length} activities
              </span>{" "}
              <span className="text-sm text-[#9A9590]">near San Francisco</span>
            </div>
            <select className="text-xs font-medium px-3 py-2 border border-[#EAE8E2] rounded-full bg-white text-[#1C1C1A] outline-none cursor-pointer appearance-none pr-7"
              style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%239A9590' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E\")", backgroundRepeat: "no-repeat", backgroundPosition: "right 8px center" }}>
              <option>Best match</option>
              <option>Distance</option>
              <option>Price: low–high</option>
              <option>Age fit</option>
            </select>
          </div>

          {/* Cards */}
          <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-3.5">
            {mockActivities.map(activity => (
              <ActivityCard
                key={activity.id}
                activity={activity}
                highlighted={hovered === activity.id}
                onHover={setHovered}
                onClick={() => router.push(`/activity/${activity.id}`)}
              />
            ))}
          </div>
        </div>

        {/* ── Map panel ── */}
        <div className="flex-1 relative overflow-hidden bg-[#EEF5E8]">
          {/* Grid lines */}
          <div className="absolute inset-0"
            style={{
              background: "repeating-linear-gradient(0deg, transparent, transparent 59px, rgba(107,160,80,.08) 60px), repeating-linear-gradient(90deg, transparent, transparent 59px, rgba(107,160,80,.08) 60px)"
            }}
          />
          {/* Roads SVG */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 600" fill="none" preserveAspectRatio="xMidYMid slice">
            <path d="M0 200 Q200 180 400 220 T800 200" stroke="rgba(255,255,255,0.7)" strokeWidth="10"/>
            <path d="M0 350 Q300 320 500 370 T800 340" stroke="rgba(255,255,255,0.7)" strokeWidth="10"/>
            <path d="M200 0 Q220 200 200 400 T220 600" stroke="rgba(255,255,255,0.7)" strokeWidth="10"/>
            <path d="M500 0 Q520 150 510 350 T530 600" stroke="rgba(255,255,255,0.7)" strokeWidth="10"/>
            <path d="M100 0 L130 600" stroke="rgba(255,255,255,0.3)" strokeWidth="5"/>
            <path d="M350 0 L370 600" stroke="rgba(255,255,255,0.3)" strokeWidth="5"/>
            <path d="M0 100 L800 110" stroke="rgba(255,255,255,0.3)" strokeWidth="5"/>
            <path d="M0 450 L800 445" stroke="rgba(255,255,255,0.3)" strokeWidth="5"/>
          </svg>

          {/* Pins */}
          {MAP_PINS.map(pin => (
            <button
              key={pin.id}
              onClick={() => router.push(`/activity/${pin.id}`)}
              onMouseEnter={() => setHovered(pin.id)}
              onMouseLeave={() => setHovered(null)}
              className="absolute flex flex-col items-center z-10 group"
              style={{ left: pin.left, top: pin.top, transform: "translate(-50%, -100%)" }}
            >
              <div className={[
                "text-white text-xs font-semibold rounded-[8px] px-2.5 py-1.5 whitespace-nowrap shadow-sm transition-all",
                hovered === pin.id ? "bg-[#4C7A3A] scale-110" : "bg-[#1E3A1E]",
              ].join(" ")}>
                {pin.label}
              </div>
              <div className={[
                "w-0 h-0 border-l-[6px] border-r-[6px] border-l-transparent border-r-transparent border-t-[8px] transition-all",
                hovered === pin.id ? "border-t-[#4C7A3A]" : "border-t-[#1E3A1E]",
              ].join(" ")} />
            </button>
          ))}

          {/* Center label */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white rounded-[14px] px-5 py-3 text-sm text-[#9A9590] shadow-md flex items-center gap-2 z-10">
            <span>📍</span> San Francisco, CA
          </div>
        </div>
      </div>
    </div>
  );
}

function ActivityCard({
  activity, highlighted, onHover, onClick,
}: {
  activity: Activity;
  highlighted: boolean;
  onHover: (id: string | null) => void;
  onClick: () => void;
}) {
  return (
    <div
      className={[
        "flex bg-white border rounded-[22px] overflow-hidden cursor-pointer transition-all",
        highlighted
          ? "border-transparent shadow-[0_4px_20px_rgba(30,58,30,.10)] translate-x-1"
          : "border-[#EAE8E2] hover:border-transparent hover:shadow-[0_4px_20px_rgba(30,58,30,.10)] hover:translate-x-1",
      ].join(" ")}
      onClick={onClick}
      onMouseEnter={() => onHover(activity.id)}
      onMouseLeave={() => onHover(null)}
    >
      <div className="w-[110px] flex-shrink-0 relative overflow-hidden">
        <Image
          src={activity.imageUrl}
          alt={activity.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="110px"
        />
      </div>
      <div className="p-4 flex flex-col gap-2 flex-1">
        <div className="text-[11px] font-bold tracking-[.07em] uppercase text-[#4C7A3A]">
          {activity.type}
        </div>
        <div className="font-[family-name:var(--font-fraunces)] text-[17px] font-normal text-[#1E3A1E] leading-tight">
          {activity.name}
        </div>
        <div className="flex flex-wrap gap-2.5 text-xs text-[#9A9590]">
          <span>📍 {activity.distanceMiles} miles</span>
          <span>🕐 {activity.driveMinutes} min drive</span>
        </div>
        <div className="flex gap-1.5 flex-wrap mt-1">
          <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[rgba(107,160,80,.12)] text-[#4C7A3A]">
            Ages {activity.ageMax ? `${activity.ageMin}–${activity.ageMax}` : `${activity.ageMin}+`}
          </span>
          <span className={[
            "px-2.5 py-1 rounded-full text-[11px] font-semibold",
            activity.cost === null
              ? "bg-[rgba(30,58,30,.1)] text-[#1E3A1E]"
              : "bg-[#F3F1EB] text-[#9A9590]",
          ].join(" ")}>
            {activity.costLabel}
          </span>
        </div>
      </div>
    </div>
  );
}
