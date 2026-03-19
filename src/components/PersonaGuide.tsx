"use client";

import { useEffect, useState } from "react";
import { Activity, Baby, User, HeartPulse, Sparkles } from "lucide-react";
import { PERSONA_GUIDES } from "@/constants/aqi";
import type { LocationData, AqiGrade } from "@/types/air";

interface Props {
  activePersona: string;
  onSelect:      (key: string) => void;
  data:          LocationData;
  mainGrade:     AqiGrade;
}

type PersonaTexts = { child: string; adult: string; senior: string };

const PERSONA_ICONS = { child: Baby, adult: User, senior: HeartPulse };

export default function PersonaGuide({ activePersona, onSelect, data, mainGrade }: Props) {
  const [texts,   setTexts]   = useState<PersonaTexts | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!data) return;
    setTexts(null);
    setLoading(true);

    const params = new URLSearchParams({
      pm25:  String(data.pm25),
      pm10:  String(data.pm10),
      grade: mainGrade,
    });

    const controller = new AbortController();

    fetch(`/api/air/persona?${params}`, { signal: controller.signal })
      .then((res) => res.json())
      .then((json) => { if (!json.error) setTexts(json); })
      .catch(() => {})
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [data?.pm25, data?.pm10, mainGrade]);

  const currentText = texts?.[activePersona as keyof PersonaTexts] ?? "";

  return (
    <div className="bg-white/95 backdrop-blur-md rounded-3xl p-5 shadow-sm border border-white mb-6">
      <h4 className="font-bold text-slate-800 text-sm mb-4 flex items-center gap-2">
        <Activity size={16} className="text-indigo-500" />
        연령대별 맞춤 행동 요령
      </h4>

      <div className="flex gap-2 mb-4 bg-slate-50/50 p-1 rounded-2xl border border-slate-100">
        {(["child", "adult", "senior"] as const).map((key) => {
          const TabIcon = PERSONA_ICONS[key];
          return (
            <button
              key={key}
              onClick={() => onSelect(key)}
              className={`flex-1 py-2 rounded-xl text-sm font-black transition-all
                          flex items-center justify-center gap-1.5 active:scale-95
                          ${activePersona === key
                            ? "bg-white text-indigo-600 shadow-sm"
                            : "text-slate-400 hover:text-slate-600"}`}
            >
              <TabIcon size={14} />
              {PERSONA_GUIDES[key].label}
            </button>
          );
        })}
      </div>

      <div className="bg-slate-50/50 rounded-2xl p-4 border border-slate-100 min-h-[80px]">
        <div className="flex items-center gap-1.5 mb-3">
          <Sparkles size={13} className="text-indigo-400" />
          <span className="text-xs font-black text-indigo-400 uppercase tracking-wide">AI 맞춤 가이드</span>
          {loading && (
            <span className="ml-1 inline-block w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
          )}
        </div>

        {loading ? (
          <div className="space-y-2">
            <div className="h-3 bg-slate-200 rounded animate-pulse w-full" />
            <div className="h-3 bg-slate-200 rounded animate-pulse w-4/5" />
          </div>
        ) : (
          <p className="text-sm font-medium text-slate-700 leading-relaxed whitespace-pre-line">
            {currentText || "데이터를 불러오지 못했습니다."}
          </p>
        )}
      </div>
    </div>
  );
}
