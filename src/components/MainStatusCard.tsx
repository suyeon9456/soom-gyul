"use client";

import { CheckCircle2, Info, AlertTriangle, AlertCircle } from "lucide-react";
import StatusIllustration from "./StatusIllustration";
import ParticleBackground from "./ParticleBackground";
import type { AqiLevel, AqiGrade, LocationData } from "@/types/air";

const ICON_MAP = { CheckCircle2, Info, AlertTriangle, AlertCircle };

interface Props {
  mainStatus: AqiLevel;
  mainGrade: AqiGrade;
  pm25Status: AqiLevel;
  pm10Status: AqiLevel;
  data: LocationData;
}

export default function MainStatusCard({
  mainStatus,
  mainGrade,
  pm25Status,
  pm10Status,
  data,
}: Props) {
  const StatusIcon = ICON_MAP[mainStatus.iconName as keyof typeof ICON_MAP];

  return (
    <div
      className={`relative rounded-[2.5rem] p-6 mb-6 shadow-xl border-2 transition-all duration-1000
                  ${mainStatus.border} overflow-hidden min-h-[300px] flex flex-col justify-between
                  hover:scale-[1.01] active:scale-[0.99]`}
    >
      <StatusIllustration status={mainStatus} />
      <ParticleBackground
        count={mainGrade === "GOOD" ? 10 : 35}
        color={mainStatus.particleColor}
      />
      {/* Status */}
      <div className="relative z-10 flex flex-col items-center">
        <div
          className={`mb-3 p-3 rounded-2xl bg-white/90 backdrop-blur-sm shadow-sm
                         transition-transform duration-300 hover:scale-110 ${mainStatus.text}`}
        >
          <StatusIcon size={32} strokeWidth={3} />
        </div>
        <h3
          className={`text-3xl font-black mb-1 drop-shadow-sm ${mainStatus.text}`}
        >
          {mainStatus.label}
        </h3>
        <p
          className="text-slate-800/80 text-sm font-bold text-center px-4 leading-snug
                       bg-white/40 backdrop-blur-md rounded-full py-1 border border-white/50"
        >
          {mainStatus.desc}
        </p>
      </div>
      {/* PM cards */}
      <div className="relative z-10 grid grid-cols-2 gap-4 mt-6">
        <PmCard
          label="초미세먼지 PM2.5"
          value={data.pm25}
          max={100}
          status={pm25Status}
        />
        <PmCard
          label="미세먼지 PM10"
          value={data.pm10}
          max={200}
          status={pm10Status}
        />
      </div>
    </div>
  );
}

function PmCard({
  label,
  value,
  max,
  status,
}: {
  label: string;
  value: number;
  max: number;
  status: AqiLevel;
}) {
  return (
    <div
      className="bg-white/95 backdrop-blur-md rounded-3xl p-4 border border-slate-100 shadow-sm
                    transition-all hover:bg-white hover:scale-105"
    >
      <span className="text-sm font-black text-slate-500 uppercase block mb-1 tracking-tight">
        {label}
      </span>
      <div className="flex items-baseline gap-1 mb-2">
        <span className="text-2xl font-black text-slate-900">{value}</span>
        <span className="text-sm font-bold text-slate-500">μg/m³</span>
      </div>
      <div className="h-1.5 w-full bg-slate-200/50 rounded-full overflow-hidden">
        <div
          className={`h-full ${status.color} transition-all duration-1000`}
          style={{ width: `${Math.min((value / max) * 100, 100)}%` }}
        />
      </div>
      <span
        className={`text-sm font-bold mt-1 inline-block px-2 py-0.5 rounded-full ${status.statusTag}`}
      >
        {status.label}
      </span>
    </div>
  );
}
