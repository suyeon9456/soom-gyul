"use client";

import { useEffect, useState, useCallback } from "react";
import { Wind, RefreshCw, MapPin, Plus } from "lucide-react";

import MeshGradient from "./MeshGradient";
import Skeleton from "./Skeleton";
import LocationTabs from "./LocationTabs";
import MainStatusCard from "./MainStatusCard";
import ActivityIndices from "./ActivityIndices";
import PersonaGuide from "./PersonaGuide";
import SkinCareAlert from "./SkinCareAlert";
import CigaretteCard from "./CigaretteCard";
import AddLocationModal from "./AddLocationModal";

import { AQI_LEVELS, getPM25Grade, getPM10Grade } from "@/constants/aqi";
import { STATIONS } from "@/constants/stations";
import {
  fetchAirData,
  fetchNearbyStation,
  getCurrentPosition,
  calcCigarettes,
} from "@/lib/airApi";
import type { Location, LocationData } from "@/types/air";

/* ── 기본 위치 (고정 측정소명 지정) ─────────────────────── */
const DEFAULT_LOCATIONS: Location[] = [
  {
    id: "current",
    name: "현 위치",
    addr: "위치 확인 중...",
    iconType: "navigation",
  },
  {
    id: "home",
    name: "우리 집",
    addr: "서울시 종로구",
    iconType: "home",
    stationName: "종로구",
  },
  {
    id: "office",
    name: "회사",
    addr: "서울시 성동구",
    iconType: "building",
    stationName: "성동구",
  },
];

/* PM 등급별 생활 지수 계산 */
function calcIndices(pm25: number, pm10: number) {
  const grade = Math.max(
    pm25 <= 15 ? 1 : pm25 <= 35 ? 2 : pm25 <= 75 ? 3 : 4,
    pm10 <= 30 ? 1 : pm10 <= 80 ? 2 : pm10 <= 150 ? 3 : 4,
  );
  return {
    laundry: grade <= 1 ? "실외건조" : "실내건조",
    exercise: grade <= 1 ? "적정" : grade <= 2 ? "주의" : "위험",
    car: grade <= 1 ? "추천" : grade <= 2 ? "비추천" : "금지",
  };
}

/* ═══════════════════════════════════════════════════════ */
export default function AirDashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const [lastUpdated, setLastUpdated] = useState("");
  const [activePersona, setActivePersona] = useState("adult");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [locations, setLocations] = useState<Location[]>(DEFAULT_LOCATIONS);
  const [locationData, setLocationData] = useState<LocationData[]>([]);

  /* 현 위치 → 가장 가까운 측정소명 취득 */
  const resolveCurrentStation = useCallback(async (): Promise<string> => {
    try {
      const coords = await getCurrentPosition();
      const nearby = await fetchNearbyStation(
        coords.latitude,
        coords.longitude,
      );
      setLocations((prev) =>
        prev.map((loc) =>
          loc.id === "current"
            ? { ...loc, addr: nearby.addr, stationName: nearby.stationName }
            : loc,
        ),
      );
      return nearby.stationName;
    } catch {
      // GPS 실패 시 기본값
      setLocations((prev) =>
        prev.map((loc) =>
          loc.id === "current"
            ? { ...loc, addr: "서울시 종로구 (기본값)" }
            : loc,
        ),
      );
      return "종로구";
    }
  }, []);

  /* 특정 위치 데이터 fetch */
  const fetchLocationData = useCallback(
    async (loc: Location): Promise<LocationData> => {
      let stationName = loc.stationName;
      if (!stationName && loc.id === "current") {
        stationName = await resolveCurrentStation();
      }
      if (!stationName) stationName = "종로구"; // fallback

      const api = await fetchAirData(stationName);
      return {
        pm25: api.pm25,
        pm10: api.pm10,
        temp: 0,
        humidity: 0,
        cigarettes: calcCigarettes(api.pm25),
        ventTime: api.ventTime,
        indices: calcIndices(api.pm25, api.pm10),
      };
    },
    [resolveCurrentStation],
  );

  /* 활성 위치 데이터 갱신 */
  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchLocationData(locations[activeIdx]);
      setLocationData((prev) => {
        const next = [...prev];
        next[activeIdx] = data;
        return next;
      });
      setLastUpdated(
        new Date().toLocaleTimeString("ko-KR", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      );
    } catch (e) {
      setError("데이터를 불러오지 못했습니다.");
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [activeIdx, locations, fetchLocationData]);

  /* 탭 변경 또는 마운트 시 fetch */
  useEffect(() => {
    refresh();
  }, [activeIdx]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleAddLocation = (name: string, addr: string) => {
    const matched = STATIONS.find((s) => addr.includes(s.name));
    const newLoc: Location = {
      id: `loc-${Date.now()}`,
      name,
      addr,
      iconType: "map",
      stationName: matched?.name,
    };
    setLocations((prev) => [...prev, newLoc]);
    setActiveIdx(locations.length);
    setIsModalOpen(false);
  };

  /* 현재 탭 데이터 */
  const currentData = locationData[activeIdx];
  const pm25Grade = currentData ? getPM25Grade(currentData.pm25) : "GOOD";
  const pm10Grade = currentData ? getPM10Grade(currentData.pm10) : "GOOD";
  const mainGrade =
    currentData && currentData.pm25 > currentData.pm10 / 2
      ? pm25Grade
      : pm10Grade;
  const mainStatus = AQI_LEVELS[mainGrade];
  const pm25Status = AQI_LEVELS[pm25Grade];
  const pm10Status = AQI_LEVELS[pm10Grade];

  return (
    <div className="min-h-screen font-sans text-slate-900 p-4 md:p-8 relative transition-all duration-1000">
      {!loading && currentData && (
        <MeshGradient colors={mainStatus.meshColors} />
      )}

      <div className="max-w-md mx-auto relative">
        {/* Header */}
        <header className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-xl text-white shadow-lg">
              <Wind size={20} />
            </div>
            <h1 className="text-lg font-bold tracking-tight text-slate-800">
              숨결 실시간 대기
            </h1>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setIsModalOpen(true)}
              className="p-2 bg-white/80 backdrop-blur rounded-full border border-slate-200 text-slate-400
                         hover:text-blue-500 transition-all shadow-sm active:scale-90"
            >
              <Plus size={18} />
            </button>
            <button
              onClick={refresh}
              disabled={loading}
              className="p-2 bg-white/80 backdrop-blur rounded-full border border-slate-200 text-slate-400
                         hover:text-blue-500 transition-all shadow-sm disabled:opacity-50 active:scale-90"
            >
              <RefreshCw
                size={18}
                className={loading ? "animate-spin-icon" : ""}
              />
            </button>
          </div>
        </header>

        {/* Location tabs */}
        <LocationTabs
          locations={locations}
          activeIdx={activeIdx}
          onSelect={setActiveIdx}
        />

        {/* Content */}
        {loading || !currentData ? (
          <Skeleton />
        ) : error ? (
          <div className="bg-rose-50 border border-rose-200 rounded-3xl p-6 text-center">
            <p className="text-rose-600 font-bold">{error}</p>
            <button
              onClick={refresh}
              className="mt-3 text-sm text-rose-500 underline"
            >
              다시 시도
            </button>
          </div>
        ) : (
          <div className="animate-fade-in-up">
            {/* Location title */}
            <div className="mb-6 flex justify-between items-end">
              <div>
                <div className="flex items-center gap-1 text-slate-500/80 text-sm font-bold mb-1">
                  <MapPin size={12} />
                  <span>{locations[activeIdx].addr}</span>
                </div>
                <h2 className="text-2xl font-black text-slate-800">
                  {locations[activeIdx].name === "현 위치"
                    ? "현재 위치"
                    : locations[activeIdx].name}{" "}
                  상태
                </h2>
              </div>
              <span className="text-sm font-bold text-slate-400 mb-1 leading-none uppercase tracking-tighter font-mono">
                {lastUpdated}
              </span>
            </div>

            <MainStatusCard
              mainStatus={mainStatus}
              mainGrade={mainGrade}
              pm25Status={pm25Status}
              pm10Status={pm10Status}
              data={currentData}
            />
            <ActivityIndices data={currentData} />
            <PersonaGuide
              activePersona={activePersona}
              onSelect={setActivePersona}
            />
            <SkinCareAlert />
            <CigaretteCard
              locationName={locations[activeIdx].name}
              cigarettes={currentData.cigarettes}
            />
          </div>
        )}

        {/* Modal */}
        {isModalOpen && (
          <AddLocationModal
            onAdd={handleAddLocation}
            onClose={() => setIsModalOpen(false)}
          />
        )}

        <footer className="text-center pb-12 opacity-30">
          <p className="text-sm font-bold uppercase tracking-[0.2em] leading-loose text-slate-800 font-mono">
            에어코리아 실시간 대기질 데이터
            <br />
            한국환경공단 제공
          </p>
        </footer>
      </div>
    </div>
  );
}
