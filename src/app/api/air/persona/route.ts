import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { getCached, setCached } from "@/lib/apiCache";

const client = new Anthropic();

const GRADE_LABEL: Record<string, string> = {
  GOOD: "좋음", MODERATE: "보통", BAD: "나쁨", VERY_BAD: "매우 나쁨",
};

const PERSONAS = {
  child:  "어린이 (12세 이하)",
  adult:  "성인",
  senior: "고령자 (65세 이상)",
};

async function fetchOne(persona: string, pm25: string, pm10: string, grade: string): Promise<string> {
  const response = await client.messages.create({
    model: "claude-opus-4-6",
    max_tokens: 200,
    system: `대기질 건강 전문가. 아래 형식으로만 한국어로 답하세요. 마크다운 기호(**, ##, -, *) 절대 사용 금지. 각 항목은 한 줄로.

건강 영향: (1문장)
권장 행동: (행동1 · 행동2)`,
    messages: [{
      role: "user",
      content: `PM2.5 ${pm25}µg/m³, PM10 ${pm10}µg/m³ (${GRADE_LABEL[grade] ?? grade}) / 대상: ${PERSONAS[persona as keyof typeof PERSONAS]}`,
    }],
  });
  const block = response.content.find((b) => b.type === "text");
  return block?.type === "text" ? block.text.trim() : "";
}

export async function GET(req: NextRequest) {
  const pm25  = req.nextUrl.searchParams.get("pm25")  ?? "0";
  const pm10  = req.nextUrl.searchParams.get("pm10")  ?? "0";
  const grade = req.nextUrl.searchParams.get("grade") ?? "GOOD";

  const cacheKey = `personas:${pm25}:${pm10}:${grade}`;
  const cached = getCached(cacheKey);
  if (cached) return NextResponse.json(JSON.parse(cached));

  try {
    const [child, adult, senior] = await Promise.all([
      fetchOne("child",  pm25, pm10, grade),
      fetchOne("adult",  pm25, pm10, grade),
      fetchOne("senior", pm25, pm10, grade),
    ]);

    const result = { child, adult, senior };
    setCached(cacheKey, JSON.stringify(result));
    return NextResponse.json(result);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "AI 가이드를 불러오지 못했습니다.";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
