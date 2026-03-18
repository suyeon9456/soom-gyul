"use client";

import { Home, Shirt, Dumbbell, Car } from "lucide-react";
import type { LocationData } from "@/types/air";

interface Props {
  data: LocationData;
}

export default function ActivityIndices({ data }: Props) {
  return (
    <div className="space-y-4 mb-6">
      {/* Ventilation timing */}
      <div className="bg-white/95 backdrop-blur-md rounded-3xl p-5 border border-white shadow-sm
                      flex items-center justify-between group hover:border-blue-200 transition-all
                      hover:scale-[1.02] active:scale-[0.98]">
        <div className="flex items-center gap-3">
          <div className="bg-blue-50 p-2.5 rounded-2xl text-blue-500 group-hover:scale-110 transition-transform">
            <Home size={20} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-800">최적 환기 타이밍</h4>
            <p className="text-sm text-slate-500">대기 정체 해소 시간</p>
          </div>
        </div>
        <span className="text-sm font-black text-blue-600 bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-100">
          {data.ventTime}
        </span>
      </div>

      {/* Activity index grid */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { Icon: Shirt,    label: "빨래 지수", val: data.indices.laundry,  good: "실외건조" },
          { Icon: Dumbbell, label: "야외 운동", val: data.indices.exercise, good: "적정" },
          { Icon: Car,      label: "세차 지수", val: data.indices.car,      good: "추천" },
        ].map(({ Icon, label, val, good }) => (
          <div
            key={label}
            className="bg-white/95 backdrop-blur-md rounded-3xl p-4 border border-white shadow-sm
                       flex flex-col items-center text-center transition-all hover:shadow-md hover:scale-105 active:scale-95"
          >
            <Icon size={20} className="text-slate-400 mb-2" />
            <span className="text-sm font-black text-slate-400 uppercase mb-1">{label}</span>
            <span className={`text-sm font-black ${val === good ? "text-emerald-600" : "text-rose-600"}`}>
              {val}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
