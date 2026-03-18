export default function Skeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="h-10 w-full bg-slate-200 rounded-2xl" />
      <div className="h-64 bg-slate-200 rounded-5xl" />
      <div className="grid grid-cols-3 gap-3">
        <div className="h-20 bg-slate-200 rounded-3xl" />
        <div className="h-20 bg-slate-200 rounded-3xl" />
        <div className="h-20 bg-slate-200 rounded-3xl" />
      </div>
      <div className="h-32 bg-slate-200 rounded-3xl" />
      <div className="h-24 bg-slate-200 rounded-3xl" />
    </div>
  );
}
