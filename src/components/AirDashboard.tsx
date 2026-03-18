"use client";

import { useEffect, useState } from "react";
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
import type { Location, LocationData } from "@/types/air";

/* ── Default mock data ──────────────────────────────── */
const DEFAULT_LOCATIONS: Location[] = [
  {
    id: "current",
    name: "현 위치",
    addr: "서울시 강남구 (추정)",
    iconType: "navigation",
  },
  { id: "home", name: "우리 집", addr: "서울시 종로구", iconType: "home" },
  { id: "office", name: "회사", addr: "서울시 성동구", iconType: "building" },
];

const DEFAULT_DATA: LocationData[] = [
  {
    pm25: 14,
    pm10: 25,
    temp: 18,
    humidity: 42,
    cigarettes: 0.3,
    ventTime: "지금 바로 가능",
    indices: { car: "추천", laundry: "실외건조", exercise: "적정" },
  },
  {
    pm25: 48,
    pm10: 72,
    temp: 12,
    humidity: 38,
    cigarettes: 1.5,
    ventTime: "오후 2:00 ~ 2:30",
    indices: { car: "비추천", laundry: "실내건조", exercise: "주의" },
  },
  {
    pm25: 82,
    pm10: 145,
    temp: 10,
    humidity: 30,
    cigarettes: 3.2,
    ventTime: "밤 10시 이후",
    indices: { car: "금지", laundry: "금지", exercise: "위험" },
  },
];

/* ═══════════════════════════════════════════════════════ */
export default function AirDashboard() {
  const [loading, setLoading] = useState(true);
  const [activeIdx, setActiveIdx] = useState(0);
  const [lastUpdated, setLastUpdated] = useState("");
  const [activePersona, setActivePersona] = useState("adult");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [locations, setLocations] = useState<Location[]>(DEFAULT_LOCATIONS);
  const [locationData, setLocationData] =
    useState<LocationData[]>(DEFAULT_DATA);

  const fetchData = () => {
    setLoading(true);
    setTimeout(() => {
      setLastUpdated(
        new Date().toLocaleTimeString("ko-KR", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      );
      setLoading(false);
    }, 1000);
  };

  useEffect(() => {
    fetchData();
  }, [activeIdx]);

  const handleSelectLocation = (idx: number) => {
    setActiveIdx(idx);
  };

  const handleAddLocation = (name: string, addr: string) => {
    const newLoc: Location = {
      id: `loc-${Date.now()}`,
      name,
      addr,
      iconType: "map",
    };
    const randPM25 = Math.floor(Math.random() * 90) + 5;
    const newData: LocationData = {
      pm25: randPM25,
      pm10: Math.round(randPM25 * 1.8),
      temp: 14,
      humidity: 40,
      cigarettes: parseFloat((randPM25 / 22).toFixed(1)),
      ventTime: "오후 4:00 ~ 5:00",
      indices: { car: "보통", laundry: "실내건조", exercise: "주의" },
    };
    setLocations((prev) => [...prev, newLoc]);
    setLocationData((prev) => [...prev, newData]);
    setActiveIdx(locations.length);
    setIsModalOpen(false);
  };

  /* Derived AQI values */
  const currentData = locationData[activeIdx];
  const pm25Grade = getPM25Grade(currentData.pm25);
  const pm10Grade = getPM10Grade(currentData.pm10);
  const mainGrade =
    currentData.pm25 > currentData.pm10 / 2 ? pm25Grade : pm10Grade;
  const mainStatus = AQI_LEVELS[mainGrade];
  const pm25Status = AQI_LEVELS[pm25Grade];
  const pm10Status = AQI_LEVELS[pm10Grade];

  return (
    <div className="min-h-screen font-sans text-slate-900 p-4 md:p-8 relative transition-all duration-1000">
      {!loading && <MeshGradient colors={mainStatus.meshColors} />}

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
              onClick={fetchData}
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
          onSelect={handleSelectLocation}
        />

        {/* Main content */}
        {loading ? (
          <Skeleton />
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
                Updated: {lastUpdated}
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

        {/* Footer */}
        <footer className="text-center pb-12 opacity-30">
          <p className="text-sm font-bold uppercase tracking-[0.2em] leading-loose text-slate-800 font-mono">
            Multi-location Air Care System
            <br />
            Refined Living Analytics • Design for Health
          </p>
        </footer>
      </div>
    </div>
  );
}
