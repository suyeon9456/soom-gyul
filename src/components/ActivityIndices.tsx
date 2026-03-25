"use client";

import { useEffect, useState } from "react";
import { Home, Shirt, Dumbbell, Car } from "lucide-react";
import type { LocationData } from "@/types/air";
import type { AqiGrade } from "@/types/air";

interface Indices {
  laundry:  string;
  exercise: string;
  car:      string;
  reason:   string;
}

interface Props {
  data:      LocationData;
  mainGrade: AqiGrade;
}

const ANTHROPIC_API_KEY = process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY!;

const GRADE_LABEL: Record<string, string> = {
  GOOD: "좋음", MODERATE: "보통", BAD: "나쁨", VERY_BAD: "매우 나쁨",
};

function calcFallback(pm25: number, pm10: number): Indices {
  const g = Math.max(
    pm25 <= 15 ? 1 : pm25 <= 35 ? 2 : pm25 <= 75 ? 3 : 4,
    pm10 <= 30 ? 1 : pm10 <= 80 ? 2 : pm10 <= 150 ? 3 : 4,
  );
  return {
    laundry:  g <= 1 ? "실외건조" : "실내건조",
    exercise: g <= 1 ? "적정" : g <= 2 ? "주의" : "위험",
    car:      g <= 1 ? "추천" : g <= 2 ? "비추천" : "금지",
    reason:   "기본 기준 적용",
  };
}

export default function ActivityIndices({ data, mainGrade }: Props) {
  const [indices, setIndices] = useState<Indices | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!data) return;
    setLoading(true);

    const system = `대기질 수치를 보고 세 가지 생활 지수를 판단해서 JSON으로만 응답하세요. 다른 텍스트 없이 JSON만 출력하세요.

응답 형식:
{
  "laundry": "실외건조" | "실내건조",
  "exercise": "적정" | "주의" | "위험",
  "car": "추천" | "비추천" | "금지",
  "reason": "한 줄 판단 근거 (30자 이내)"
}`;

    fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        "anthropic-dangerous-direct-browser-access": "true",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 200,
        system,
        messages: [{
          role: "user",
          content: `PM2.5 ${data.pm25}µg/m³, PM10 ${data.pm10}µg/m³ (등급: ${GRADE_LABEL[mainGrade] ?? mainGrade})`,
        }],
      }),
    })
      .then((r) => r.json())
      .then((json) => {
        const text = json.content?.find((b: { type: string }) => b.type === "text")?.text ?? "";
        const parsed = JSON.parse(text.replace(/```json\n?|\n?```/g, "").trim());
        setIndices(parsed);
      })
      .catch(() => setIndices(calcFallback(data.pm25, data.pm10)))
      .finally(() => setLoading(false));
  }, [data?.pm25, data?.pm10, mainGrade]); // eslint-disable-line react-hooks/exhaustive-deps

  const items = [
    { Icon: Shirt,    label: "빨래 지수", val: indices?.laundry,  good: "실외건조" },
    { Icon: Dumbbell, label: "야외 운동", val: indices?.exercise, good: "적정" },
    { Icon: Car,      label: "세차 지수", val: indices?.car,      good: "추천" },
  ];

  return (
    <div className="space-y-4 mb-6">
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

      <div className="grid grid-cols-3 gap-3">
        {items.map(({ Icon, label, val, good }) => (
          <div
            key={label}
            className="bg-white/95 backdrop-blur-md rounded-3xl p-4 border border-white shadow-sm
                       flex flex-col items-center text-center transition-all hover:shadow-md hover:scale-105 active:scale-95"
          >
            <Icon size={20} className="text-slate-400 mb-2" />
            <span className="text-sm font-black text-slate-400 uppercase mb-1">{label}</span>
            {loading || !val ? (
              <span className="w-10 h-4 bg-slate-100 rounded animate-pulse" />
            ) : (
              <span className={`text-sm font-black ${val === good ? "text-emerald-600" : "text-rose-600"}`}>
                {val}
              </span>
            )}
          </div>
        ))}
      </div>

      {indices?.reason && !loading && (
        <p className="text-xs text-slate-400 font-medium text-center">{indices.reason}</p>
      )}
    </div>
  );
}
