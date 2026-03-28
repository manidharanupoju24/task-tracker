"use client";

interface StatsBarProps {
  total: number;
  completed: number;
}

export default function StatsBar({ total, completed }: StatsBarProps) {
  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white shadow-sm p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-slate-600">Overall Progress</span>
        <span className="text-sm font-bold bg-gradient-to-r from-violet-600 to-indigo-500 bg-clip-text text-transparent">{percentage}%</span>
      </div>
      <div className="w-full bg-slate-100 rounded-full h-2.5">
        <div
          className="h-2.5 rounded-full transition-all duration-500 bg-gradient-to-r from-violet-500 to-indigo-400"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="flex justify-between mt-3 text-xs text-slate-400">
        <span className="text-emerald-500 font-medium">{completed} completed</span>
        <span>{total - completed} remaining</span>
      </div>
    </div>
  );
}
