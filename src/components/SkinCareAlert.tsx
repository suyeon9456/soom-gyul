"use client";

import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";
import type { LocationData } from "@/types/air";
import type { AqiGrade } from "@/types/air";

interface Props {
  data:      LocationData;
  mainGrade: AqiGrade;
}

export default function SkinCareAlert({ data, mainGrade }: Props) {
  const [text,    setText]    = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!data) return;
    setText("");
    setLoading(true);

    const params = new URLSearchParams({
      pm25:  String(data.pm25),
      pm10:  String(data.pm10),
      grade: mainGrade,
    });

    const controller = new AbortController();

    fetch(`/api/air/skincare?${params}`, { signal: controller.signal })
      .then(async (res) => {
        const reader = res.body?.getReader();
        if (!reader) return;
        const decoder = new TextDecoder();
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          setText((prev) => prev + decoder.decode(value));
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [data?.pm25, data?.pm10, mainGrade]);

  return (
    <div className="bg-gradient-to-r from-rose-50/80 to-orange-50/80 backdrop-blur-md rounded-3xl p-5 mb-6
                    border border-rose-100 shadow-sm flex items-center gap-4
                    hover:scale-[1.02] active:scale-[0.98] transition-all">
      <div className="bg-white p-3 rounded-2xl text-rose-500 shadow-sm border border-rose-200/50 shrink-0">
        <Sparkles size={24} />
      </div>
      <div className="flex-1">
        <h4 className="text-sm font-black text-rose-700 mb-0.5 tracking-tight flex items-center gap-1.5">
          피부 보호 가이드
          {loading && <span className="inline-block w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />}
        </h4>
        <p className="text-sm text-rose-600/80 font-medium leading-snug">
          {text || (loading ? "" : "데이터를 불러오는 중...")}
        </p>
      </div>
    </div>
  );
}
