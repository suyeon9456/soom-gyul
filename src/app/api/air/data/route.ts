import { NextRequest, NextResponse } from "next/server";

const BASE = "http://apis.data.go.kr/B552584/ArpltnInforInqireSvc";
const API_KEY = process.env.NEXT_PUBLIC_AIR_KOREA_API_KEY!;

interface RawItem {
  dataTime: string;
  pm25Value: string;
  pm10Value: string;
  o3Value: string;
  no2Value: string;
  so2Value: string;
  coValue: string;
  khaiValue: string;
  khaiGrade: string;
  pm10Grade: string;
  pm25Grade: string;
}

/** 하루치(최대 24건) 중 PM2.5+PM10 합이 가장 낮은 시간대 문자열 반환 */
function findBestVentTime(items: RawItem[]): string {
  const valid = items.filter(
    (it) => it.pm25Value !== "-" && it.pm10Value !== "-",
  );
  if (!valid.length) return "데이터 없음";

  const best = valid.reduce((min, cur) => {
    const score = parseFloat(cur.pm25Value) * 2 + parseFloat(cur.pm10Value); // PM2.5 가중
    const minScore = parseFloat(min.pm25Value) * 2 + parseFloat(min.pm10Value);
    return score < minScore ? cur : min;
  });

  // "2026-03-18 14:00" → "오후 2:00"
  const hour = parseInt(best.dataTime.split(" ")[1].split(":")[0], 10);
  const label =
    hour === 0
      ? "자정"
      : hour < 12
        ? `오전 ${hour}시`
        : hour === 12
          ? "정오"
          : `오후 ${hour - 12}시`;

  return label;
}

export async function GET(req: NextRequest) {
  const station = req.nextUrl.searchParams.get("station");
  if (!station) {
    return NextResponse.json({ error: "station required" }, { status: 400 });
  }

  const params = new URLSearchParams({
    serviceKey: API_KEY,
    returnType: "json",
    numOfRows: "24", // 하루치 전체
    pageNo: "1",
    stationName: station,
    dataTerm: "DAILY",
    ver: "1.0",
  });

  const res = await fetch(`${BASE}/getMsrstnAcctoRltmMesureDnsty?${params}`, {
    next: { revalidate: 300 },
  });

  if (!res.ok) {
    return NextResponse.json({ error: "upstream error" }, { status: 502 });
  }

  const json = await res.json();
  const items: RawItem[] = json?.response?.body?.items;

  if (!items?.length) {
    return NextResponse.json({ error: "no data" }, { status: 404 });
  }

  const latest = items[0]; // 가장 최근 시간
  const ventTime = findBestVentTime(items);

  return NextResponse.json({
    dataTime: latest.dataTime,
    pm25: parseFloat(latest.pm25Value) || 0,
    pm10: parseFloat(latest.pm10Value) || 0,
    o3: parseFloat(latest.o3Value) || 0,
    no2: parseFloat(latest.no2Value) || 0,
    so2: parseFloat(latest.so2Value) || 0,
    co: parseFloat(latest.coValue) || 0,
    khai: parseFloat(latest.khaiValue) || 0,
    khaiGrade: latest.khaiGrade,
    pm10Grade: latest.pm10Grade,
    pm25Grade: latest.pm25Grade,
    ventTime, // 오늘 중 PM이 가장 낮은 시간
  });
}
