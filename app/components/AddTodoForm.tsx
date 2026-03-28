"use client";

import { useState } from "react";
import { Priority, Category, Todo } from "../types";

interface AddTodoFormProps {
  onAdd: (todo: Omit<Todo, "id" | "createdAt" | "completed">) => void;
}

export default function AddTodoForm({ onAdd }: AddTodoFormProps) {
  const [text, setText] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");
  const [category, setCategory] = useState<Category>("personal");
  const [dueDate, setDueDate] = useState("");
  const [notes, setNotes] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    onAdd({
      text: text.trim(),
      priority,
      category,
      dueDate: dueDate || undefined,
      notes: notes.trim() || undefined,
    });

    setText("");
    setDueDate("");
    setNotes("");
    setPriority("medium");
    setCategory("personal");
    setIsExpanded(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-sm border border-white p-5"
    >
      <div className="flex gap-3">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onFocus={() => setIsExpanded(true)}
          placeholder="Add a new task..."
          className="flex-1 px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent text-slate-700 placeholder-slate-400 text-sm bg-white/80"
        />
        <button
          type="submit"
          disabled={!text.trim()}
          className="px-5 py-3 bg-gradient-to-r from-violet-500 to-indigo-500 hover:from-violet-600 hover:to-indigo-600 disabled:from-slate-200 disabled:to-slate-200 disabled:cursor-not-allowed text-white rounded-xl font-medium text-sm transition-all duration-150 flex items-center gap-2 shadow-sm"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          Add
        </button>
      </div>

      {isExpanded && (
        <div className="mt-4 flex flex-wrap gap-3">
          {/* Priority */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">
              Priority
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as Priority)}
              className="px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
            >
              <option value="low">🟢 Low</option>
              <option value="medium">🟡 Medium</option>
              <option value="high">🔴 High</option>
            </select>
          </div>

          {/* Category */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as Category)}
              className="px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
            >
              <option value="personal">👤 Personal</option>
              <option value="work">💼 Work</option>
              <option value="shopping">🛒 Shopping</option>
              <option value="other">📌 Other</option>
            </select>
          </div>

          {/* Due Date */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">
              Due Date
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
            />
          </div>

          <div className="flex items-end">
            <button
              type="button"
              onClick={() => setIsExpanded(false)}
              className="px-3 py-2 text-sm text-slate-400 hover:text-slate-600 transition-colors"
            >
              Collapse
            </button>
          </div>

          {/* Notes */}
          <div className="w-full flex flex-col gap-1">
            <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">
              Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any extra context..."
              rows={2}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-400 bg-white resize-none"
            />
          </div>
        </div>
      )}
    </form>
  );
}
