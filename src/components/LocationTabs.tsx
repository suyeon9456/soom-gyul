"use client";

import { Home, Building2, Map, Navigation, X } from "lucide-react";
import type { Location } from "@/types/air";

function LocationIcon({ type }: { type: Location["iconType"] }) {
  if (type === "navigation") return <Navigation size={14} className="shrink-0 fill-blue-500 text-blue-500" />;
  if (type === "home")       return <Home       size={14} className="shrink-0" />;
  if (type === "building")   return <Building2  size={14} className="shrink-0" />;
  return                            <Map        size={14} className="shrink-0" />;
}

interface Props {
  locations: Location[];
  activeIdx: number;
  onSelect: (idx: number) => void;
  onDelete: (idx: number) => void;
}

export default function LocationTabs({ locations, activeIdx, onSelect, onDelete }: Props) {
  return (
    <div className="flex gap-2 mb-6 overflow-x-auto pb-2 no-scrollbar">
      {locations.map((loc, idx) => {
        const isActive = activeIdx === idx;
        const isDeletable = loc.iconType !== "navigation";
        return (
          <button
            key={loc.id}
            onClick={() => onSelect(idx)}
            className={`flex items-center gap-1.5 pl-4 ${isDeletable ? "pr-2" : "pr-4"} py-2.5 rounded-2xl whitespace-nowrap text-sm font-black
                        transition-all border-2 active:scale-95
                        ${isActive
                          ? "bg-slate-900 border-slate-900 text-white shadow-lg"
                          : "bg-white/70 backdrop-blur border-transparent text-slate-400 hover:border-slate-200"
                        }`}
          >
            <LocationIcon type={loc.iconType} />
            {loc.name}
            {isDeletable && (
              <span
                role="button"
                onClick={(e) => { e.stopPropagation(); onDelete(idx); }}
                className={`ml-0.5 p-0.5 rounded-full transition-colors
                            ${isActive ? "hover:bg-white/20" : "hover:bg-slate-200"}`}
              >
                <X size={12} />
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
