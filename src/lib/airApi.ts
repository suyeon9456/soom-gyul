export interface AirApiResponse {
  stationName?: string;
  dataTime: string;
  ventTime: string; // 오늘 중 PM 최저 시간대
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

/** 측정소명으로 실시간 대기질 조회 */
export async function fetchAirData(
  stationName: string,
): Promise<AirApiResponse> {
  const res = await fetch(
    `/api/air/data?station=${encodeURIComponent(stationName)}`,
  );
  if (!res.ok) throw new Error(`fetchAirData failed: ${res.status}`);
  return res.json();
}

/** GPS 좌표로 가장 가까운 측정소 조회 */
export async function fetchNearbyStation(
  lat: number,
  lng: number,
): Promise<NearbyStationResponse> {
  const res = await fetch(`/api/air/nearby?lat=${lat}&lng=${lng}`);
  if (!res.ok) throw new Error(`fetchNearbyStation failed: ${res.status}`);
  return res.json();
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
