"use client";

import { useState, useEffect, useMemo } from "react";
import { Todo, FilterType, Category } from "./types";
import { getTodos, createTodo, updateTodo, deleteTodo, getToken, signOut } from "@/lib/api";
import { AnimatePresence } from "framer-motion";
import AddTodoForm from "./components/AddTodoForm";
import TodoItem from "./components/TodoItem";
import FilterBar from "./components/FilterBar";
import StatCards from "./components/StatCards";
import AuthForm from "./components/AuthForm";
import Calendar from "./components/Calendar";

export default function Home() {
  const [token, setToken] = useState<string | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<FilterType>("all");
  const [categoryFilter, setCategoryFilter] = useState<Category | "all">("all");
  const [sortBy, setSortBy] = useState<"created" | "priority" | "dueDate">("created");
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragOverZone, setDragOverZone] = useState<"active" | "completed" | null>(null);

  // Check for existing token on mount
  useEffect(() => {
    const existing = getToken();
    setToken(existing);
    setAuthChecked(true);
  }, []);

  // Load todos whenever we have a valid token
  useEffect(() => {
    if (!token) return;
    setIsLoaded(false);
    setTodos([]);
    getTodos()
      .then((data) => setTodos(data))
      .catch((err) => setError(err.message))
      .finally(() => setIsLoaded(true));
  }, [token]);

  const handleAuth = (newToken: string) => {
    setToken(newToken);
    setError(null);
  };

  const handleSignOut = () => {
    signOut();
    setToken(null);
    setTodos([]);
    setIsLoaded(false);
    setError(null);
  };

  const addTodo = async (data: Omit<Todo, "id" | "createdAt" | "completed">) => {
    try {
      const newTodo = await createTodo(data);
      setTodos((prev) => [newTodo, ...prev]);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const toggleTodo = async (id: string) => {
    const todo = todos.find((t) => t.id === id);
    if (!todo) return;
    try {
      const updated = await updateTodo(id, { completed: !todo.completed });
      setTodos((prev) => prev.map((t) => (t.id === id ? updated : t)));
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteTodo(id);
      setTodos((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const editTodo = async (id: string, updates: Partial<Todo>) => {
    try {
      const updated = await updateTodo(id, updates);
      setTodos((prev) => prev.map((t) => (t.id === id ? updated : t)));
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const clearCompleted = async () => {
    const completed = todos.filter((t) => t.completed);
    try {
      await Promise.all(completed.map((t) => deleteTodo(t.id)));
      setTodos((prev) => prev.filter((t) => !t.completed));
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const priorityWeight = { high: 0, medium: 1, low: 2 };

  const filteredTodos = useMemo(() => {
    let result = todos;

    if (filter === "active") result = result.filter((t) => !t.completed);
    if (filter === "completed") result = result.filter((t) => t.completed);

    if (categoryFilter !== "all") {
      result = result.filter((t) => t.category === categoryFilter);
    }

    if (selectedDate) {
      result = result.filter((t) => t.dueDate === selectedDate);
    }

    result = [...result].sort((a, b) => {
      if (sortBy === "priority") {
        return priorityWeight[a.priority] - priorityWeight[b.priority];
      }
      if (sortBy === "dueDate") {
        if (!a.dueDate && !b.dueDate) return 0;
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return a.dueDate.localeCompare(b.dueDate);
      }
      return b.createdAt.getTime() - a.createdAt.getTime();
    });

    return result;
  }, [todos, filter, categoryFilter, sortBy]);

  const completedCount = todos.filter((t) => t.completed).length;
  const activeCount = todos.filter((t) => !t.completed).length;
  const overdueCount = todos.filter(
    (t) => t.dueDate && !t.completed && new Date(t.dueDate + "T00:00:00") < new Date(new Date().toDateString())
  ).length;

  // Wait until we've checked localStorage before rendering anything
  if (!authChecked) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-violet-100 via-indigo-50 to-cyan-100 flex items-center justify-center">
        <div className="text-slate-400 text-sm">Loading…</div>
      </main>
    );
  }

  // Show auth form if not logged in
  if (!token) {
    return <AuthForm onAuth={handleAuth} />;
  }

  // Loading todos
  if (!isLoaded) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-violet-100 via-indigo-50 to-cyan-100 flex items-center justify-center">
        <div className="text-slate-400 text-sm">Loading tasks…</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-violet-100 via-indigo-50 to-cyan-100 py-10 px-4">
      <div className="max-w-5xl mx-auto">

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-violet-600 to-indigo-500 bg-clip-text text-transparent">Task Tracker</h1>
          <p className="text-slate-500 mt-1 text-sm">Manidhar's command center ⚡</p>
        </div>
        <button
          onClick={handleSignOut}
          className="text-xs text-slate-500 hover:text-violet-600 border border-slate-200 hover:border-violet-300 px-3 py-1.5 rounded-lg transition-colors bg-white/60"
        >
          Sign out
        </button>
      </div>

      <div className="flex gap-6 items-start">
        {/* Left — main content */}
        <div className="flex-1 space-y-5">
        {/* Error banner */}
        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-600 text-sm rounded-xl px-4 py-3 flex items-center justify-between">
            <span>⚠️ {error}</span>
            <button
              onClick={() => setError(null)}
              className="ml-4 text-rose-400 hover:text-rose-600 font-medium"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Stats */}
        {todos.length > 0 && (
          <StatCards total={todos.length} active={activeCount} completed={completedCount} overdue={overdueCount} />
        )}

        {/* Add Todo */}
        <AddTodoForm onAdd={addTodo} />

        {/* Filter & Sort Bar */}
        {todos.length > 0 && (
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white shadow-sm p-4 space-y-3">
            <FilterBar
              filter={filter}
              onFilterChange={setFilter}
              categoryFilter={categoryFilter}
              onCategoryChange={setCategoryFilter}
              totalCount={todos.length}
              activeCount={activeCount}
              completedCount={completedCount}
              onClearCompleted={clearCompleted}
            />

            {/* Sort */}
            <div className="flex items-center gap-2 pt-1 border-t border-slate-50">
              <span className="text-xs text-slate-400 font-medium">Sort by:</span>
              {(["created", "priority", "dueDate"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setSortBy(s)}
                  className={`text-xs px-2.5 py-1 rounded-lg transition-colors ${
                    sortBy === s
                      ? "bg-indigo-100 text-indigo-600 font-medium"
                      : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  {s === "created" ? "Newest" : s === "priority" ? "Priority" : "Due Date"}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Active tasks drop zone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOverZone("active"); }}
          onDragLeave={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setDragOverZone(null); }}
          onDrop={(e) => {
            e.preventDefault();
            const id = e.dataTransfer.getData("todoId");
            const todo = todos.find((t) => t.id === id);
            if (todo && todo.completed) toggleTodo(id);
            setDragOverZone(null);
          }}
          className={`space-y-2 min-h-[64px] rounded-xl p-2 transition-all duration-150 ${
            dragOverZone === "active"
              ? "bg-violet-50/80 ring-2 ring-violet-300 ring-dashed"
              : ""
          }`}
        >
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide px-1 mb-2">
            Active · {filteredTodos.filter((t) => !t.completed).length}
          </p>
          {filteredTodos.filter((t) => !t.completed).length === 0 ? (
            <div className="text-center py-10 text-slate-400">
              {todos.length === 0 ? (
                <div>
                  <div className="text-4xl mb-2">✅</div>
                  <p className="font-medium text-slate-500 text-sm">No tasks yet</p>
                  <p className="text-xs mt-1">Add your first task above!</p>
                </div>
              ) : (
                <p className="text-xs">Drop a completed task here to reopen it</p>
              )}
            </div>
          ) : (
            <AnimatePresence>
              {filteredTodos.filter((t) => !t.completed).map((todo) => (
                <TodoItem key={todo.id} todo={todo} onToggle={toggleTodo} onDelete={handleDelete} onEdit={editTodo} />
              ))}
            </AnimatePresence>
          )}
        </div>

        </div>{/* end left column */}

        {/* Middle — completed tasks drop zone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOverZone("completed"); }}
          onDragLeave={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setDragOverZone(null); }}
          onDrop={(e) => {
            e.preventDefault();
            const id = e.dataTransfer.getData("todoId");
            const todo = todos.find((t) => t.id === id);
            if (todo && !todo.completed) toggleTodo(id);
            setDragOverZone(null);
          }}
          className={`flex-1 space-y-2 min-h-[100px] rounded-xl p-3 transition-all duration-150 bg-white/50 backdrop-blur-sm border border-white ${
            dragOverZone === "completed"
              ? "bg-emerald-50/80 ring-2 ring-emerald-300 ring-dashed"
              : ""
          }`}
        >
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide px-1 mb-2">
            Completed · {filteredTodos.filter((t) => t.completed).length}
          </p>
          {filteredTodos.filter((t) => t.completed).length === 0 ? (
            <div className="text-center py-10 text-slate-300 text-xs">
              Drag a task here to mark it done
            </div>
          ) : (
            <AnimatePresence>
              {filteredTodos.filter((t) => t.completed).map((todo) => (
                <TodoItem key={todo.id} todo={todo} onToggle={toggleTodo} onDelete={handleDelete} onEdit={editTodo} />
              ))}
            </AnimatePresence>
          )}
        </div>

        {/* Right — calendar */}
        <div className="w-64 flex-shrink-0">
          <Calendar
            todos={todos}
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
          />
        </div>
      </div>
      </div>
    </main>
  );
}
