import { STATIONS } from "@/constants/stations";

export interface AirApiResponse {
  stationName?: string;
  dataTime: string;
  ventTime: string;
  pm25: number;
  pm10: number;
  o3: number;
  no2: number;
  so2: number;
  co: number;
  khai: number;
  khaiGrade: string;
  pm10Grade: string;
  pm25Grade: string;
}

export interface NearbyStationResponse {
  stationName: string;
  addr: string;
  distance: number;
}

const BASE = "http://apis.data.go.kr/B552584/ArpltnInforInqireSvc";
const API_KEY = process.env.NEXT_PUBLIC_AIR_KOREA_API_KEY!;

interface RawItem {
  dataTime: string;
  stationName?: string;
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

function findBestVentTime(items: RawItem[]): string {
  const valid = items.filter(
    (it) => it.pm25Value !== "-" && it.pm10Value !== "-",
  );
  if (!valid.length) return "데이터 없음";

  const best = valid.reduce((min, cur) => {
    const score = parseFloat(cur.pm25Value) * 2 + parseFloat(cur.pm10Value);
    const minScore = parseFloat(min.pm25Value) * 2 + parseFloat(min.pm10Value);
    return score < minScore ? cur : min;
  });

  const hour = parseInt(best.dataTime.split(" ")[1].split(":")[0], 10);
  return hour === 0
    ? "자정"
    : hour < 12
      ? `오전 ${hour}시`
      : hour === 12
        ? "정오"
        : `오후 ${hour - 12}시`;
}

/** 측정소명으로 실시간 대기질 조회 */
export async function fetchAirData(
  stationName: string,
  sido?: string | null,
): Promise<AirApiResponse> {
  if (sido) {
    const params = new URLSearchParams({
      serviceKey: API_KEY,
      returnType: "json",
      numOfRows: "40",
      pageNo: "1",
      sidoName: sido,
      ver: "1.0",
    });
    const res = await fetch(`${BASE}/getCtprvnRltmMesureDnsty?${params}`);
    if (!res.ok) throw new Error(`fetchAirData failed: ${res.status}`);
    const json = await res.json();
    const items: RawItem[] = json?.response?.body?.items ?? [];
    const valid = items.filter((it) => it.pm25Value !== "-" && it.pm10Value !== "-");
    if (!valid.length) throw new Error("no data");

    const avg = (key: keyof RawItem) => {
      const vals = valid.map((it) => parseFloat(it[key] as string)).filter((v) => !isNaN(v));
      return vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : 0;
    };
    const avgItem = {
      ...valid[0],
      pm25Value: avg("pm25Value").toFixed(1),
      pm10Value: avg("pm10Value").toFixed(1),
      o3Value: avg("o3Value").toFixed(3),
      no2Value: avg("no2Value").toFixed(3),
      so2Value: avg("so2Value").toFixed(3),
      coValue: avg("coValue").toFixed(2),
      khaiValue: avg("khaiValue").toFixed(0),
    };
    return {
      dataTime: avgItem.dataTime,
      pm25: parseFloat(avgItem.pm25Value) || 0,
      pm10: parseFloat(avgItem.pm10Value) || 0,
      o3: parseFloat(avgItem.o3Value) || 0,
      no2: parseFloat(avgItem.no2Value) || 0,
      so2: parseFloat(avgItem.so2Value) || 0,
      co: parseFloat(avgItem.coValue) || 0,
      khai: parseFloat(avgItem.khaiValue) || 0,
      khaiGrade: avgItem.khaiGrade,
      pm10Grade: avgItem.pm10Grade,
      pm25Grade: avgItem.pm25Grade,
      ventTime: "데이터 없음",
    };
  }

  const params = new URLSearchParams({
    serviceKey: API_KEY,
    returnType: "json",
    numOfRows: "24",
    pageNo: "1",
    stationName,
    dataTerm: "DAILY",
    ver: "1.0",
  });
  const res = await fetch(`${BASE}/getMsrstnAcctoRltmMesureDnsty?${params}`);
  if (!res.ok) throw new Error(`fetchAirData failed: ${res.status}`);
  const json = await res.json();
  const items: RawItem[] = json?.response?.body?.items;
  if (!items?.length) throw new Error("no data");
  const latest = items[0];
  return {
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
    ventTime: findBestVentTime(items),
  };
}

function haversine(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/** GPS 좌표로 가장 가까운 측정소 조회 */
export function fetchNearbyStation(
  lat: number,
  lng: number,
): Promise<NearbyStationResponse> {
  let nearest = STATIONS[0];
  let minDist = Infinity;
  for (const s of STATIONS) {
    const d = haversine(lat, lng, s.lat, s.lng);
    if (d < minDist) {
      minDist = d;
      nearest = s;
    }
  }
  return Promise.resolve({
    stationName: nearest.name,
    addr: nearest.addr,
    distance: Math.round(minDist * 10) / 10,
  });
}

/** 브라우저 Geolocation으로 현재 GPS 좌표 취득 */
export function getCurrentPosition(): Promise<GeolocationCoordinates> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation not supported"));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve(pos.coords),
      (err) => reject(err),
      { timeout: 8000, maximumAge: 60_000 },
    );
  });
}

/** API grade(1~4) → AqiGrade 변환 */
export function gradeToAqi(
  grade: string,
): "GOOD" | "MODERATE" | "BAD" | "VERY_BAD" {
  const map: Record<string, "GOOD" | "MODERATE" | "BAD" | "VERY_BAD"> = {
    "1": "GOOD",
    "2": "MODERATE",
    "3": "BAD",
    "4": "VERY_BAD",
  };
  return map[grade] ?? "MODERATE";
}

/** 담배비교 환산 (WHO 기준: PM2.5 22µg/m³ ≈ 담배 1개비) */
export function calcCigarettes(pm25: number): number {
  return parseFloat((pm25 / 22).toFixed(1));
}
