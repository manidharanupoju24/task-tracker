"use client";

import { FilterType, Category } from "../types";

interface FilterBarProps {
  filter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  categoryFilter: Category | "all";
  onCategoryChange: (category: Category | "all") => void;
  totalCount: number;
  activeCount: number;
  completedCount: number;
  onClearCompleted: () => void;
}

export default function FilterBar({
  filter,
  onFilterChange,
  categoryFilter,
  onCategoryChange,
  totalCount,
  activeCount,
  completedCount,
  onClearCompleted,
}: FilterBarProps) {
  const filters: { value: FilterType; label: string }[] = [
    { value: "all", label: `All (${totalCount})` },
    { value: "active", label: `Active (${activeCount})` },
    { value: "completed", label: `Done (${completedCount})` },
  ];

  const categories: { value: Category | "all"; label: string }[] = [
    { value: "all", label: "All" },
    { value: "personal", label: "👤 Personal" },
    { value: "work", label: "💼 Work" },
    { value: "shopping", label: "🛒 Shopping" },
    { value: "other", label: "📌 Other" },
  ];

  return (
    <div className="flex flex-col gap-3">
      {/* Status filters */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex gap-1 bg-slate-100/80 p-1 rounded-xl">
          {filters.map((f) => (
            <button
              key={f.value}
              onClick={() => onFilterChange(f.value)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                filter === f.value
                  ? "bg-white text-violet-600 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {completedCount > 0 && (
          <button
            onClick={() => {
              if (window.confirm(`Delete ${completedCount} completed task${completedCount !== 1 ? "s" : ""}?`)) {
                onClearCompleted();
              }
            }}
            className="text-xs text-slate-400 hover:text-rose-500 transition-colors"
          >
            Clear completed
          </button>
        )}
      </div>

      {/* Category filters */}
      <div className="flex flex-wrap gap-1.5">
        {categories.map((c) => (
          <button
            key={c.value}
            onClick={() => onCategoryChange(c.value)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-150 ${
              categoryFilter === c.value
                ? "bg-gradient-to-r from-violet-500 to-indigo-500 text-white shadow-sm"
                : "bg-slate-100/80 text-slate-500 hover:bg-slate-200"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>
    </div>
  );
}
