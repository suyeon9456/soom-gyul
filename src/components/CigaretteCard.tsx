import { Cigarette, ChevronRight } from "lucide-react";

interface Props {
  locationName: string;
  cigarettes: number;
}

export default function CigaretteCard({ locationName, cigarettes }: Props) {
  return (
    <div className="bg-slate-900 rounded-[2.5rem] p-6 text-white mb-8 shadow-2xl relative overflow-hidden
                    group active:scale-[0.98] transition-all hover:scale-[1.01]">
      <div className="absolute right-0 top-0 p-8 opacity-5 pointer-events-none">
        <Cigarette size={120} />
      </div>
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-rose-500 p-2 rounded-xl shadow-lg shadow-rose-900/50">
            <Cigarette size={20} />
          </div>
          <h4 className="font-black text-sm text-rose-100 uppercase tracking-widest">유해성 비교 지표</h4>
        </div>
        <div className="space-y-2">
          <p className="text-lg leading-relaxed">
            오늘 <span className="text-rose-400 font-black">{locationName}</span>에서 숨 쉬는 것은
          </p>
          <p className="text-2xl font-black">
            담배 <span className="text-rose-500 text-4xl mx-1">{cigarettes}개비</span>를 피우는 것과 같습니다.
          </p>
        </div>
        <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between">
          <span className="text-sm font-bold text-slate-500 tracking-tight italic">
            ※ 초미세먼지 농도 기반 WHO 환산 수치 기준
          </span>
          <div className="flex items-center gap-1 text-rose-400 text-sm font-bold">
            상세보기 <ChevronRight size={12} />
          </div>
        </div>
      </div>
    </div>
  );
}
