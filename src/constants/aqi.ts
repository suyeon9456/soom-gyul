import type { AqiGrade, AqiLevel, PersonaGuide } from "@/types/air";

export const AQI_LEVELS: Record<AqiGrade, AqiLevel> = {
  GOOD: {
    label: "좋음",
    color: "bg-emerald-500",
    text: "text-emerald-600",
    bg: "bg-emerald-70",
    border: "border-emerald-200",
    statusTag: "bg-emerald-100 text-emerald-700",
    skyGradient: "from-sky-400 to-teal-200",
    cityOpacity: "opacity-100",
    cityBlur: "",
    particleColor: "rgba(255,255,255,0.4)",
    meshColors: ["#10b981", "#38bdf8", "#6ee7b7", "#f0fdf4"],
    iconName: "CheckCircle2",
    desc: "공기가 아주 맑아요! 마음껏 숨 쉬세요.",
  },
  MODERATE: {
    label: "보통",
    color: "bg-amber-500",
    text: "text-amber-700",
    bg: "bg-amber-50",
    border: "border-amber-200",
    statusTag: "bg-amber-100 text-amber-800",
    skyGradient: "from-sky-300 to-amber-100",
    cityOpacity: "opacity-80",
    cityBlur: "blur-[1px]",
    particleColor: "rgba(255,255,255,0.3)",
    meshColors: ["#f59e0b", "#fbbf24", "#bfdbfe", "#fffbeb"],
    iconName: "Info",
    desc: "무난한 날씨입니다. 환기하기에도 적당해요.",
  },
  BAD: {
    label: "나쁨",
    color: "bg-orange-500",
    text: "text-orange-700",
    bg: "bg-orange-50",
    border: "border-orange-200",
    statusTag: "bg-orange-100 text-orange-800",
    skyGradient: "from-orange-200 to-slate-400",
    cityOpacity: "opacity-60",
    cityBlur: "blur-[2px]",
    particleColor: "rgba(100,100,100,0.2)",
    meshColors: ["#f97316", "#fb923c", "#94a3b8", "#fff7ed"],
    iconName: "AlertTriangle",
    desc: "공기가 탁합니다. 마스크를 꼭 착용하세요.",
  },
  VERY_BAD: {
    label: "매우 나쁨",
    color: "bg-rose-600",
    text: "text-rose-700",
    bg: "bg-rose-50",
    border: "border-rose-200",
    statusTag: "bg-rose-100 text-rose-800",
    skyGradient: "from-slate-500 to-rose-300",
    cityOpacity: "opacity-40",
    cityBlur: "blur-[4px]",
    particleColor: "rgba(80,80,80,0.3)",
    meshColors: ["#e11d48", "#f43f5e", "#475569", "#fff1f2"],
    iconName: "AlertCircle",
    desc: "위험한 수준입니다. 가급적 외출을 피하세요.",
  },
};

export const PERSONA_GUIDES: Record<string, PersonaGuide> = {
  child: {
    label: "어린이",
    iconName: "Baby",
    impact: "호흡기 발달 저해 우려",
    action: "실외 활동 중단 및 실내 놀이",
  },
  adult: {
    label: "성인",
    iconName: "User",
    impact: "피로 누적 및 심혈관 부담",
    action: "KF94 마스크 및 무리한 운동 자제",
  },
  senior: {
    label: "어르신",
    iconName: "HeartPulse",
    impact: "기저 질환 급격한 악화 위험",
    action: "외출 절대 금지 및 창문 폐쇄",
  },
};

export function getPM25Grade(val: number): AqiGrade {
  if (val <= 15) return "GOOD";
  if (val <= 35) return "MODERATE";
  if (val <= 75) return "BAD";
  return "VERY_BAD";
}

export function getPM10Grade(val: number): AqiGrade {
  if (val <= 30) return "GOOD";
  if (val <= 80) return "MODERATE";
  if (val <= 150) return "BAD";
  return "VERY_BAD";
}
