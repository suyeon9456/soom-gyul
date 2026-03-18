export type AqiGrade = "GOOD" | "MODERATE" | "BAD" | "VERY_BAD";

export type PersonaType = "child" | "adult" | "senior";

export interface AqiLevel {
  label: string;
  color: string; // Tailwind bg class
  text: string; // Tailwind text class
  bg: string; // Tailwind bg-light class
  border: string; // Tailwind border class
  statusTag: string; // Tailwind combined class for tag
  skyGradient: string;
  cityOpacity: string;
  cityBlur: string;
  particleColor: string;
  meshColors: [string, string, string, string];
  iconName: string; // lucide icon name string
  desc: string;
}

export interface LocationData {
  pm25: number;
  pm10: number;
  temp: number;
  humidity: number;
  cigarettes: number;
  ventTime: string;
  indices: {
    car: string;
    laundry: string;
    exercise: string;
  };
}

export interface Location {
  id: string;
  name: string;
  addr: string;
  iconType: "navigation" | "home" | "building" | "map";
  stationName?: string; // 에어코리아 측정소명 (현 위치는 동적 결정)
}

export interface PersonaGuide {
  label: string;
  iconName: string;
  impact: string;
  action: string;
}
