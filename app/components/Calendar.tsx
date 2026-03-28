"use client";

import { useState } from "react";
import { Todo } from "../types";

interface CalendarProps {
  todos: Todo[];
  selectedDate: string | null;
  onSelectDate: (date: string | null) => void;
}

const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export default function Calendar({ todos, selectedDate, onSelectDate }: CalendarProps) {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const dueDatesSet = new Set(todos.map((t) => t.dueDate).filter(Boolean) as string[]);
  const overdueDatesSet = new Set(
    todos
      .filter((t) => t.dueDate && !t.completed && new Date(t.dueDate + "T00:00:00") < new Date(today.toDateString()))
      .map((t) => t.dueDate as string)
  );

  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  function toDateStr(day: number) {
    return `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  }

  function prevMonth() {
    if (viewMonth === 0) { setViewMonth(11); setViewYear((y) => y - 1); }
    else setViewMonth((m) => m - 1);
  }

  function nextMonth() {
    if (viewMonth === 11) { setViewMonth(0); setViewYear((y) => y + 1); }
    else setViewMonth((m) => m + 1);
  }

  function handleDayClick(dateStr: string) {
    onSelectDate(selectedDate === dateStr ? null : dateStr);
  }

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white shadow-sm p-4 sticky top-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={prevMonth}
          className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <span className="text-sm font-semibold text-slate-700">
          {MONTHS[viewMonth]} {viewYear}
        </span>
        <button
          onClick={nextMonth}
          className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 mb-1">
        {DAYS.map((d) => (
          <div key={d} className="text-center text-xs font-medium text-slate-400 py-1">
            {d}
          </div>
        ))}
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7 gap-y-1">
        {cells.map((day, i) => {
          if (!day) return <div key={`empty-${i}`} />;
          const dateStr = toDateStr(day);
          const isToday = dateStr === todayStr;
          const isSelected = dateStr === selectedDate;
          const hasTasks = dueDatesSet.has(dateStr);
          const hasOverdue = overdueDatesSet.has(dateStr);

          return (
            <button
              key={dateStr}
              onClick={() => handleDayClick(dateStr)}
              className={`relative flex flex-col items-center justify-center h-8 w-8 mx-auto rounded-full text-xs font-medium transition-all duration-150
                ${isSelected ? "bg-gradient-to-br from-violet-500 to-indigo-500 text-white shadow-md" :
                  isToday ? "bg-indigo-50 text-violet-600 font-bold ring-2 ring-violet-300" :
                  "text-slate-600 hover:bg-slate-100"}
              `}
            >
              {day}
              {hasTasks && !isSelected && (
                <span className={`absolute bottom-0.5 w-1 h-1 rounded-full ${hasOverdue ? "bg-rose-400" : "bg-indigo-400"}`} />
              )}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col gap-1.5">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span className="w-2 h-2 rounded-full bg-indigo-400 flex-shrink-0" />
          Tasks due
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span className="w-2 h-2 rounded-full bg-rose-400 flex-shrink-0" />
          Overdue
        </div>
      </div>

      {/* Clear filter */}
      {selectedDate && (
        <button
          onClick={() => onSelectDate(null)}
          className="mt-3 w-full text-xs text-violet-500 hover:text-violet-700 font-medium transition-colors"
        >
          Clear date filter
        </button>
      )}
    </div>
  );
}
