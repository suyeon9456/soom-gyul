import { Sparkles, ChevronRight } from "lucide-react";

export default function SkinCareAlert() {
  return (
    <div className="bg-gradient-to-r from-rose-50/80 to-orange-50/80 backdrop-blur-md rounded-3xl p-5 mb-6
                    border border-rose-100 shadow-sm flex items-center gap-4 group
                    hover:scale-[1.02] active:scale-[0.98] transition-all">
      <div className="bg-white p-3 rounded-2xl text-rose-500 shadow-sm border border-rose-200/50
                      transition-transform group-hover:scale-110">
        <Sparkles size={24} />
      </div>
      <div className="flex-1">
        <h4 className="text-sm font-black text-rose-700 mb-0.5 tracking-tight">피부 긴급 보호 알림</h4>
        <p className="text-sm text-rose-600/80 font-medium leading-snug">
          모공보다 작은 유해 입자가 침투 중입니다. 외출 후 꼼꼼한 세안이 필수입니다!
        </p>
      </div>
      <ChevronRight size={16} className="text-rose-300 shrink-0" />
    </div>
  );
}
