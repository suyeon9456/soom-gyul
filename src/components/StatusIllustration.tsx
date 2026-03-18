"use client";

import { Sun, Cloud, CloudFog, Wind } from "lucide-react";
import type { AqiLevel } from "@/types/air";

interface Props {
  status: AqiLevel;
}

export default function StatusIllustration({ status }: Props) {
  return (
    <div
      className={`absolute inset-0 z-0 overflow-hidden bg-gradient-to-b ${status.skyGradient} transition-all duration-1000`}
    >
      {/* Haze overlay for very bad */}
      <div
        className={`absolute inset-0 bg-white/20 transition-opacity duration-1000 ${
          status.label === "매우 나쁨" ? "opacity-60" : "opacity-0"
        }`}
      />

      {/* City silhouette */}
      <div
        className={`absolute bottom-0 w-full transition-all duration-1000 ${status.cityOpacity} ${status.cityBlur}`}
      >
        <svg viewBox="0 0 400 120" className="w-full fill-slate-800/20 translate-y-1">
          <path d="M0,120 L0,90 L15,90 L15,60 L30,60 L30,100 L50,100 L50,40 L80,40 L80,110 L100,110 L100,20 L130,20 L130,90 L150,90 L150,50 L180,50 L180,115 L210,115 L210,10 L250,10 L250,100 L280,100 L280,35 L320,35 L320,95 L350,95 L350,65 L400,65 L400,120 Z" />
        </svg>
      </div>

      {/* Weather icon */}
      <div className="absolute top-6 right-6 opacity-20 text-white">
        {status.label === "좋음"      && <Sun     size={64} className="animate-pulse" />}
        {status.label === "보통"      && <Cloud   size={64} />}
        {status.label === "나쁨"      && <CloudFog size={64} />}
        {status.label === "매우 나쁨" && <Wind    size={64} className="animate-bounce" />}
      </div>
    </div>
  );
}
