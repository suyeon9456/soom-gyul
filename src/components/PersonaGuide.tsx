"use client";

import { Activity, Baby, User, HeartPulse } from "lucide-react";
import { PERSONA_GUIDES } from "@/constants/aqi";

interface Props {
  activePersona: string;
  onSelect: (key: string) => void;
}

const PERSONA_ICONS = { child: Baby, adult: User, senior: HeartPulse };

export default function PersonaGuide({ activePersona, onSelect }: Props) {
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

      <div className="bg-slate-50/50 rounded-2xl p-4 border border-slate-100 flex flex-col gap-3">
        <div className="flex justify-between items-start">
          <p className="text-sm font-black text-slate-400 uppercase">인체 영향</p>
          <p className="text-sm font-bold text-slate-700 text-right w-2/3">
            {PERSONA_GUIDES[activePersona].impact}
          </p>
        </div>
        <div className="h-px bg-slate-200/50 w-full" />
        <div className="flex justify-between items-start">
          <p className="text-sm font-black text-emerald-500 uppercase">권장 행동</p>
          <p className="text-sm font-bold text-slate-700 text-right w-2/3">
            {PERSONA_GUIDES[activePersona].action}
          </p>
        </div>
      </div>
    </div>
  );
}
