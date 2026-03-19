import { NextRequest } from "next/server";
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

  const cacheKey = `skincare:${pm25}:${pm10}:${grade}`;
  const cached = getCached(cacheKey);
  if (cached) {
    return new Response(cached, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
  }

  try {
    const stream = await client.messages.stream({
      model: "claude-opus-4-6",
      max_tokens: 150,
      system: `당신은 피부과 전문의입니다. 현재 대기질 수치가 피부에 미치는 영향을 1~2문장으로 간결하게 알려주세요.
- 수치에 따라 구체적인 피부 영향과 즉각적인 행동 1가지를 포함하세요.
- 경고성 어투보다는 친근하고 실용적인 톤으로 작성하세요.
- 한국어로만 답하세요.`,
      messages: [{
        role: "user",
        content: `PM2.5 ${pm25}µg/m³, PM10 ${pm10}µg/m³ (등급: ${GRADE_LABEL[grade] ?? grade}) 기준으로 피부 영향을 알려주세요.`,
      }],
    });

    const encoder = new TextEncoder();
    let full = "";
    const readable = new ReadableStream({
      async start(controller) {
        for await (const event of stream) {
          if (
            event.type === "content_block_delta" &&
            event.delta.type === "text_delta"
          ) {
            full += event.delta.text;
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }
        setCached(cacheKey, full);
        controller.close();
      },
    });

    return new Response(readable, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  } catch {
    return new Response("피부 정보를 불러오지 못했습니다.", { status: 500 });
  }
}
