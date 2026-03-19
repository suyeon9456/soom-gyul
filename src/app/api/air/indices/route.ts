import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { getCached, setCached } from "@/lib/apiCache";

const client = new Anthropic();

export async function GET(req: NextRequest) {
  const pm25  = req.nextUrl.searchParams.get("pm25") ?? "0";
  const pm10  = req.nextUrl.searchParams.get("pm10") ?? "0";
  const grade = req.nextUrl.searchParams.get("grade") ?? "GOOD";

  const GRADE_LABEL: Record<string, string> = {
    GOOD: "좋음", MODERATE: "보통", BAD: "나쁨", VERY_BAD: "매우 나쁨",
  };

  const cacheKey = `indices:${pm25}:${pm10}:${grade}`;
  const cached = getCached(cacheKey);
  if (cached) return NextResponse.json(JSON.parse(cached));

  try {
    const response = await client.messages.create({
      model: "claude-opus-4-6",
      max_tokens: 200,
      system: `대기질 수치를 보고 세 가지 생활 지수를 판단해서 JSON으로만 응답하세요. 다른 텍스트 없이 JSON만 출력하세요.

응답 형식:
{
  "laundry": "실외건조" | "실내건조",
  "exercise": "적정" | "주의" | "위험",
  "car": "추천" | "비추천" | "금지",
  "reason": "한 줄 판단 근거 (30자 이내)"
}`,
      messages: [{
        role: "user",
        content: `PM2.5 ${pm25}µg/m³, PM10 ${pm10}µg/m³ (등급: ${GRADE_LABEL[grade] ?? grade})`,
      }],
    });

    const text = response.content.find((b) => b.type === "text")?.text ?? "";
    const json = JSON.parse(text.replace(/```json\n?|\n?```/g, "").trim());
    setCached(cacheKey, JSON.stringify(json));
    return NextResponse.json(json);
  } catch {
    // 폴백: 기존 정적 로직
    const g = Math.max(
      parseFloat(pm25) <= 15 ? 1 : parseFloat(pm25) <= 35 ? 2 : parseFloat(pm25) <= 75 ? 3 : 4,
      parseFloat(pm10) <= 30 ? 1 : parseFloat(pm10) <= 80 ? 2 : parseFloat(pm10) <= 150 ? 3 : 4,
    );
    return NextResponse.json({
      laundry:  g <= 1 ? "실외건조" : "실내건조",
      exercise: g <= 1 ? "적정" : g <= 2 ? "주의" : "위험",
      car:      g <= 1 ? "추천" : g <= 2 ? "비추천" : "금지",
      reason:   "기본 기준 적용",
    });
  }
}
