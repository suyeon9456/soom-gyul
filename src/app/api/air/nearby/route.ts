import { NextRequest, NextResponse } from "next/server";
import { STATIONS } from "@/constants/stations";

/** Haversine 거리 (km) */
function haversine(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
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

export async function GET(req: NextRequest) {
  const lat = parseFloat(req.nextUrl.searchParams.get("lat") ?? "");
  const lng = parseFloat(req.nextUrl.searchParams.get("lng") ?? "");

  if (isNaN(lat) || isNaN(lng)) {
    return NextResponse.json({ error: "lat/lng required" }, { status: 400 });
  }

  let nearest = STATIONS[0];
  let minDist = Infinity;
  for (const s of STATIONS) {
    const d = haversine(lat, lng, s.lat, s.lng);
    if (d < minDist) { minDist = d; nearest = s; }
  }

  return NextResponse.json({
    stationName: nearest.name,
    addr: nearest.addr,
    distance: Math.round(minDist * 10) / 10,
  });
}
