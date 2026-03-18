"use client";

import { create } from "zustand";
import type { Location, LocationData } from "@/types/air";

interface AirState {
  loading: boolean;
  activeLocationIdx: number;
  lastUpdated: string;
  activePersona: string;
  isModalOpen: boolean;
  locations: Location[];
  locationData: LocationData[];

  setLoading: (v: boolean) => void;
  setActiveLocationIdx: (idx: number) => void;
  setLastUpdated: (t: string) => void;
  setActivePersona: (p: string) => void;
  setModalOpen: (v: boolean) => void;
  addLocation: (loc: Location, data: LocationData) => void;
}

const DEFAULT_LOCATIONS: Location[] = [
  { id: "current", name: "현 위치",  addr: "서울시 강남구 (추정)", iconType: "navigation" },
  { id: "home",    name: "우리 집",  addr: "서울시 종로구",        iconType: "home" },
  { id: "office",  name: "회사",     addr: "서울시 성동구",        iconType: "building" },
];

const DEFAULT_DATA: LocationData[] = [
  {
    pm25: 14, pm10: 25,  temp: 18, humidity: 42, cigarettes: 0.3,
    ventTime: "지금 바로 가능",
    indices: { car: "추천", laundry: "실외건조", exercise: "적정" },
  },
  {
    pm25: 48, pm10: 72,  temp: 12, humidity: 38, cigarettes: 1.5,
    ventTime: "오후 2:00 ~ 2:30",
    indices: { car: "비추천", laundry: "실내건조", exercise: "주의" },
  },
  {
    pm25: 82, pm10: 145, temp: 10, humidity: 30, cigarettes: 3.2,
    ventTime: "밤 10시 이후",
    indices: { car: "금지", laundry: "금지", exercise: "위험" },
  },
];

export const useAirStore = create<AirState>((set) => ({
  loading: true,
  activeLocationIdx: 0,
  lastUpdated: "",
  activePersona: "adult",
  isModalOpen: false,
  locations: DEFAULT_LOCATIONS,
  locationData: DEFAULT_DATA,

  setLoading:          (v) => set({ loading: v }),
  setActiveLocationIdx:(idx) => set({ activeLocationIdx: idx, loading: true }),
  setLastUpdated:      (t) => set({ lastUpdated: t }),
  setActivePersona:    (p) => set({ activePersona: p }),
  setModalOpen:        (v) => set({ isModalOpen: v }),
  addLocation: (loc, data) =>
    set((s) => ({
      locations:    [...s.locations, loc],
      locationData: [...s.locationData, data],
      isModalOpen:  false,
      activeLocationIdx: s.locations.length,
    })),
}));
