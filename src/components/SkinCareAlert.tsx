"use client";

import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";
import type { LocationData, AqiGrade } from "@/types/air";

interface Props {
  data:      LocationData;
  mainGrade: AqiGrade;
}

const ANTHROPIC_API_KEY = process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY!;

const GRADE_LABEL: Record<string, string> = {
  GOOD: "좋음", MODERATE: "보통", BAD: "나쁨", VERY_BAD: "매우 나쁨",
};

export default function SkinCareAlert({ data, mainGrade }: Props) {
  const [text,    setText]    = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!data) return;
    setText("");
    setLoading(true);

    const controller = new AbortController();

    fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        "anthropic-dangerous-direct-browser-access": "true",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 200,
        stream: true,
        system: `당신은 피부과 전문의입니다. 규칙을 반드시 지키세요.
- 마크다운(**, ##, *, #) 절대 사용 금지. 일반 텍스트만 사용.
- 2~3문장 이내로만 작성.
- 피부 영향 1가지 + 즉각적인 행동 1가지만 포함.
- 친근하고 실용적인 톤, 한국어로만 답하세요.`,
        messages: [{
          role: "user",
          content: `PM2.5 ${data.pm25}µg/m³, PM10 ${data.pm10}µg/m³ (등급: ${GRADE_LABEL[mainGrade] ?? mainGrade}) 기준으로 피부 영향을 알려주세요.`,
        }],
      }),
    })
      .then(async (res) => {
        const reader = res.body?.getReader();
        if (!reader) return;
        const decoder = new TextDecoder();
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const lines = decoder.decode(value).split("\n");
          for (const line of lines) {
            if (!line.startsWith("data: ")) continue;
            const data = line.slice(6);
            if (data === "[DONE]") break;
            try {
              const json = JSON.parse(data);
              if (json.type === "content_block_delta" && json.delta?.type === "text_delta") {
                setText((prev) => prev + json.delta.text);
              }
            } catch {}
          }
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [data?.pm25, data?.pm10, mainGrade]); // eslint-disable-line react-hooks/exhaustive-deps

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
