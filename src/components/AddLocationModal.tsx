"use client";

import { useState, useEffect, useRef } from "react";
import { X, Search, MapPin, Loader2 } from "lucide-react";

interface Props {
  onAdd: (name: string, addr: string) => void;
  onClose: () => void;
}

interface Place {
  id: string;
  place_name: string;
  address_name: string;
  road_address_name: string;
  category_name: string;
}

const INPUT_CLS = `w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3.5
  text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/20
  focus:border-blue-500 transition-all`;

export default function AddLocationModal({ onAdd, onClose }: Props) {
  const [name,    setName]    = useState("");
  const [query,   setQuery]   = useState("");
  const [results, setResults] = useState<Place[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<Place | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!query.trim() || selected) { setResults([]); return; }

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `https://dapi.kakao.com/v2/local/search/keyword.json?query=${encodeURIComponent(query)}&size=10`,
          { headers: { Authorization: `KakaoAK ${process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY}` } },
        );
        const data = await res.json();
        setResults(data.documents ?? []);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 400);
  }, [query, selected]);

  function handleSelect(place: Place) {
    setSelected(place);
    setQuery(place.place_name);
    setName(place.place_name);
    setResults([]);
  }

  function handleQueryChange(val: string) {
    setQuery(val);
    setSelected(null);
  }

  const addr = selected?.road_address_name || selected?.address_name || "";
  const canAdd = !!name && !!selected;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white w-full max-w-sm rounded-[2.5rem] p-8 shadow-2xl overflow-visible">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-black text-slate-800">새 장소 추가</h3>
          <button
            onClick={onClose}
            className="p-2 bg-slate-100 text-slate-400 rounded-full hover:bg-slate-200 transition-colors active:scale-90"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          {/* 장소 검색 */}
          <div>
            <label className="text-sm font-black text-slate-400 uppercase mb-1 block ml-1">장소 검색</label>
            <div className="relative">
              <input
                type="text"
                value={query}
                onChange={(e) => handleQueryChange(e.target.value)}
                placeholder="예: 강남역, 롯데월드"
                className={INPUT_CLS + " pr-10"}
                autoFocus
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                {loading ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
              </div>

              {/* 검색 결과 */}
              {results.length > 0 && (
                <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-slate-100 rounded-2xl shadow-xl overflow-y-auto max-h-52 z-50">
                  {results.map((place) => (
                    <button
                      key={place.id}
                      onClick={() => handleSelect(place)}
                      className="w-full text-left px-4 py-3 hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0"
                    >
                      <div className="flex items-start gap-2">
                        <MapPin size={14} className="text-blue-400 mt-0.5 shrink-0" />
                        <div>
                          <p className="text-sm font-black text-slate-800">{place.place_name}</p>
                          <p className="text-xs text-slate-400 mt-0.5">
                            {place.road_address_name || place.address_name}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 선택된 주소 표시 */}
          {selected && (
            <div className="bg-blue-50 border border-blue-100 rounded-2xl px-4 py-3 flex items-start gap-2">
              <MapPin size={14} className="text-blue-400 mt-0.5 shrink-0" />
              <p className="text-xs font-bold text-blue-600">{addr}</p>
            </div>
          )}

          {/* 장소 이름 */}
          <div>
            <label className="text-sm font-black text-slate-400 uppercase mb-1 block ml-1">저장 이름</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="예: 회사, 헬스장"
              className={INPUT_CLS}
            />
          </div>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-3">
          <button
            onClick={onClose}
            className="py-4 rounded-2xl text-sm font-black text-slate-400 bg-slate-100 hover:bg-slate-200 transition-all active:scale-95"
          >
            취소
          </button>
          <button
            onClick={() => canAdd && onAdd(name, addr)}
            disabled={!canAdd}
            className="py-4 rounded-2xl text-sm font-black text-white bg-blue-600
                       hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all
                       disabled:opacity-50 disabled:shadow-none active:scale-95 hover:scale-105"
          >
            추가하기
          </button>
        </div>
      </div>
    </div>
  );
}
