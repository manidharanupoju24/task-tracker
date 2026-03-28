"use client";

import { motion } from "framer-motion";

interface StatCardsProps {
  total: number;
  active: number;
  completed: number;
  overdue: number;
}

const cards = [
  {
    key: "total",
    label: "Total",
    gradient: "from-violet-500 to-indigo-500",
    bg: "from-violet-50 to-indigo-50",
    text: "text-violet-600",
    border: "border-violet-100",
  },
  {
    key: "active",
    label: "Active",
    gradient: "from-amber-400 to-orange-400",
    bg: "from-amber-50 to-orange-50",
    text: "text-amber-600",
    border: "border-amber-100",
  },
  {
    key: "completed",
    label: "Completed",
    gradient: "from-emerald-400 to-teal-400",
    bg: "from-emerald-50 to-teal-50",
    text: "text-emerald-600",
    border: "border-emerald-100",
  },
  {
    key: "overdue",
    label: "Overdue",
    gradient: "from-rose-400 to-pink-400",
    bg: "from-rose-50 to-pink-50",
    text: "text-rose-600",
    border: "border-rose-100",
  },
];

export default function StatCards({ total, active, completed, overdue }: StatCardsProps) {
  const values: Record<string, number> = { total, active, completed, overdue };

  return (
    <div className="grid grid-cols-4 gap-3">
      {cards.map((card, i) => (
        <motion.div
          key={card.key}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.07 }}
          className={`bg-gradient-to-br ${card.bg} border ${card.border} rounded-2xl p-4 flex flex-col gap-1`}
        >
          <span className={`text-2xl font-bold ${card.text}`}>{values[card.key]}</span>
          <div className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full bg-gradient-to-br ${card.gradient}`} />
            <span className="text-xs text-slate-500 font-medium">{card.label}</span>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
