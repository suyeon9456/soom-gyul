"use client";

import { useState } from "react";
import { X } from "lucide-react";

interface Props {
  onAdd: (name: string, addr: string) => void;
  onClose: () => void;
}

export default function AddLocationModal({ onAdd, onClose }: Props) {
  const [name, setName] = useState("");
  const [addr, setAddr] = useState("");

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-scale-in"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white w-full max-w-sm rounded-[2.5rem] p-8 shadow-2xl animate-scale-in">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-black text-slate-800">새 장소 추가</h3>
          <button
            onClick={onClose}
            className="p-2 bg-slate-100 text-slate-400 rounded-full hover:bg-slate-200 transition-colors active:scale-90"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-5">
          <div>
            <label className="text-sm font-black text-slate-400 uppercase mb-1 block ml-1">장소 이름</label>
            <input
              type="text" value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="예: 공원"
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3.5
                         text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/20
                         focus:border-blue-500 transition-all"
            />
          </div>
          <div>
            <label className="text-sm font-black text-slate-400 uppercase mb-1 block ml-1">상세 주소</label>
            <input
              type="text" value={addr}
              onChange={(e) => setAddr(e.target.value)}
              placeholder="예: 서울시 송파구"
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3.5
                         text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/20
                         focus:border-blue-500 transition-all"
            />
          </div>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-3">
          <button
            onClick={onClose}
            className="py-4 rounded-2xl text-sm font-black text-slate-400 bg-slate-100
                       hover:bg-slate-200 transition-all active:scale-95"
          >
            취소
          </button>
          <button
            onClick={() => onAdd(name, addr)}
            disabled={!name || !addr}
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
