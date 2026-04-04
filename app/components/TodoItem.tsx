"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Todo, Priority, Category } from "../types";

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, updates: Partial<Todo>) => void;
}

const priorityConfig: Record<Priority, { label: string; color: string; dot: string; border: string }> = {
  low: { label: "Low", color: "text-emerald-600 bg-emerald-50", dot: "bg-emerald-400", border: "border-l-emerald-400" },
  medium: { label: "Medium", color: "text-amber-600 bg-amber-50", dot: "bg-amber-400", border: "border-l-amber-400" },
  high: { label: "High", color: "text-rose-600 bg-rose-50", dot: "bg-rose-400", border: "border-l-rose-400" },
};

const categoryConfig: Record<Category, { emoji: string; label: string; color: string }> = {
  personal: { emoji: "👤", label: "Personal", color: "text-violet-600 bg-violet-50" },
  work: { emoji: "💼", label: "Work", color: "text-blue-600 bg-blue-50" },
  shopping: { emoji: "🛒", label: "Shopping", color: "text-pink-600 bg-pink-50" },
  other: { emoji: "📌", label: "Other", color: "text-slate-500 bg-slate-100" },
};

export default function TodoItem({ todo, onToggle, onDelete, onEdit }: TodoItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [editText, setEditText] = useState(todo.text);
  const [editPriority, setEditPriority] = useState<Priority>(todo.priority);
  const [editCategory, setEditCategory] = useState<Category>(todo.category);
  const [editDueDate, setEditDueDate] = useState(todo.dueDate ?? "");
  const [editNotes, setEditNotes] = useState(todo.notes ?? "");
  const [isCompleting, setIsCompleting] = useState(false);

  const priority = priorityConfig[todo.priority];
  const category = categoryConfig[todo.category];

  const today = new Date().toDateString();
  const tomorrow = new Date(Date.now() + 86400000).toDateString();

  const isOverdue =
    todo.dueDate &&
    !todo.completed &&
    new Date(todo.dueDate + "T00:00:00") < new Date(today);

  function formatDueDate(dueDate: string): string {
    const d = new Date(dueDate + "T00:00:00");
    if (d.toDateString() === today) return "Today";
    if (d.toDateString() === tomorrow) return "Tomorrow";
    const isThisYear = d.getFullYear() === new Date().getFullYear();
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      ...(isThisYear ? {} : { year: "numeric" }),
    });
  }

  function handleToggle() {
    setIsCompleting(true);
    setTimeout(() => {
      onToggle(todo.id);
      setIsCompleting(false);
    }, 300);
  }

  function handleSave() {
    if (editText.trim()) {
      onEdit(todo.id, {
        text: editText.trim(),
        priority: editPriority,
        category: editCategory,
        dueDate: editDueDate || undefined,
        notes: editNotes.trim() || undefined,
      });
    }
    setIsExpanded(false);
  }

  function handleCancel() {
    setEditText(todo.text);
    setEditPriority(todo.priority);
    setEditCategory(todo.category);
    setEditDueDate(todo.dueDate ?? "");
    setEditNotes(todo.notes ?? "");
    setIsExpanded(false);
  }

  return (
    <motion.div
      layout
      draggable
      onDragStart={(e: any) => {
        e.dataTransfer?.setData("todoId", todo.id);
        if (e.dataTransfer) e.dataTransfer.effectAllowed = "move";
      }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -40, transition: { duration: 0.2 } }}
      className={`rounded-xl border-l-4 border border-slate-100 transition-colors duration-150 overflow-hidden cursor-grab active:cursor-grabbing
        ${todo.completed
          ? "bg-white/40 border-l-slate-200 opacity-60"
          : `bg-white/70 backdrop-blur-sm hover:bg-white/90 ${priority.border}`
        }`}
    >
      {/* Main row */}
      <div
        className="flex items-start gap-3 p-4 cursor-pointer"
        onClick={() => !todo.completed && setIsExpanded((v) => !v)}
      >
        {/* Checkbox */}
        <motion.button
          onClick={(e) => { e.stopPropagation(); handleToggle(); }}
          animate={isCompleting ? { scale: [1, 1.4, 1] } : {}}
          transition={{ duration: 0.3 }}
          className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-150
            ${todo.completed
              ? "bg-indigo-500 border-indigo-500"
              : "border-slate-300 hover:border-indigo-400"
            }`}
        >
          {todo.completed && (
            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </motion.button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-medium ${todo.completed ? "line-through text-slate-400" : "text-slate-700"}`}>
            {todo.text}
          </p>
          {todo.notes && !isExpanded && (
            <p className="text-xs text-slate-400 mt-1 line-clamp-1">{todo.notes}</p>
          )}
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${priority.color}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${priority.dot}`} />
              {priority.label}
            </span>
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${category.color}`}>
              {category.emoji} {category.label}
            </span>
            {todo.dueDate && (
              <span className={`text-xs ${isOverdue ? "text-rose-500 font-medium" : "text-slate-400"}`}>
                {isOverdue ? "⚠️ " : "📅 "}{formatDueDate(todo.dueDate)}
              </span>
            )}
            {(todo.createdByName || todo.createdByEmail) && (
              <span className="inline-flex items-center gap-1 text-xs text-slate-400">
                <span className="w-4 h-4 rounded-full bg-gradient-to-br from-violet-400 to-indigo-400 flex items-center justify-center text-white font-bold" style={{ fontSize: "9px" }}>
                  {(todo.createdByName || todo.createdByEmail!.split("@")[0])[0].toUpperCase()}
                </span>
                {todo.createdByName || todo.createdByEmail!.split("@")[0]}
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => onDelete(todo.id)}
            className="p-1.5 rounded-lg text-slate-300 hover:text-rose-500 hover:bg-rose-50 transition-colors"
            title="Delete"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Expanded edit panel */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-1 border-t border-slate-100 space-y-3">
              <input
                type="text"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                onClick={(e) => e.stopPropagation()}
                onKeyDown={(e) => { if (e.key === "Enter") handleSave(); if (e.key === "Escape") handleCancel(); }}
                className="w-full px-3 py-2 text-sm rounded-lg border border-indigo-200 focus:outline-none focus:ring-2 focus:ring-violet-400 text-slate-700 bg-white"
                autoFocus
              />
              <div className="flex flex-wrap gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-slate-400 uppercase tracking-wide">Priority</label>
                  <select
                    value={editPriority}
                    onChange={(e) => setEditPriority(e.target.value as Priority)}
                    onClick={(e) => e.stopPropagation()}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-400 bg-white"
                  >
                    <option value="low">🟢 Low</option>
                    <option value="medium">🟡 Medium</option>
                    <option value="high">🔴 High</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-slate-400 uppercase tracking-wide">Category</label>
                  <select
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value as Category)}
                    onClick={(e) => e.stopPropagation()}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-400 bg-white"
                  >
                    <option value="personal">👤 Personal</option>
                    <option value="work">💼 Work</option>
                    <option value="shopping">🛒 Shopping</option>
                    <option value="other">📌 Other</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-slate-400 uppercase tracking-wide">Due Date</label>
                  <input
                    type="date"
                    value={editDueDate}
                    onChange={(e) => setEditDueDate(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-400 bg-white"
                  />
                </div>
              </div>
              <textarea
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  placeholder="Add notes..."
                  rows={2}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-400 text-slate-600 bg-white resize-none"
                />
              <div className="flex gap-2 pt-1">
                <button
                  onClick={(e) => { e.stopPropagation(); handleSave(); }}
                  className="px-4 py-1.5 bg-gradient-to-r from-violet-500 to-indigo-500 text-white text-xs font-medium rounded-lg hover:from-violet-600 hover:to-indigo-600 transition-all"
                >
                  Save
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); handleCancel(); }}
                  className="px-4 py-1.5 text-slate-400 hover:text-slate-600 text-xs font-medium rounded-lg hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
