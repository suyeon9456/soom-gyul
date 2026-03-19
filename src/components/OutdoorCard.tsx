"use client";

import { Sun, Wind, Bike, TreePine } from "lucide-react";
import type { AqiGrade } from "@/types/air";

interface Props {
  locationName: string;
  grade: AqiGrade;
}

const CONTENT = {
  GOOD: {
    emoji: "🌤️",
    title: "야외활동 최적의 날",
    desc: "공기가 맑고 깨끗해요. 산책, 러닝, 자전거 등 야외활동을 마음껏 즐겨보세요!",
    activities: ["러닝 · 조깅", "자전거 타기", "공원 산책"],
    bg: "bg-gradient-to-br from-emerald-400 to-teal-500",
    iconColor: "text-emerald-100",
    tagBg: "bg-white/20",
  },
  MODERATE: {
    emoji: "🌥️",
    title: "야외활동 가능한 날",
    desc: "일반적인 야외활동은 괜찮아요. 장시간 격렬한 운동은 살짝 주의하세요.",
    activities: ["가벼운 산책", "짧은 라이딩", "야외 카페"],
    bg: "bg-gradient-to-br from-sky-400 to-blue-500",
    iconColor: "text-sky-100",
    tagBg: "bg-white/20",
  },
};

export default function OutdoorCard({ locationName, grade }: Props) {
  const c = CONTENT[grade as keyof typeof CONTENT];
  if (!c) return null;

  return (
    <div className={`${c.bg} rounded-[2.5rem] p-6 text-white mb-8 shadow-2xl relative overflow-hidden`}>
      <div className="absolute right-4 top-4 opacity-10 pointer-events-none">
        <Sun size={110} />
      </div>
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-2xl">{c.emoji}</span>
          <div>
            <p className="text-xs font-black uppercase tracking-widest opacity-80">{locationName}</p>
            <h4 className="font-black text-lg leading-tight">{c.title}</h4>
          </div>
        </div>

        <p className="text-sm font-medium opacity-90 leading-relaxed mb-4">{c.desc}</p>

        <div className="flex gap-2 flex-wrap">
          {c.activities.map((act) => (
            <span key={act} className={`${c.tagBg} text-xs font-black px-3 py-1.5 rounded-full backdrop-blur-sm`}>
              {act}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
