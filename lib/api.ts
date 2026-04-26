import { Todo } from "@/app/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

// ── Token Management ──────────────────────────────────────────────────────────

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("auth_token");
}

export function setToken(token: string): void {
  localStorage.setItem("auth_token", token);
}

export function clearToken(): void {
  localStorage.removeItem("auth_token");
  localStorage.removeItem("login_time");
}

export function setLoginTime(): void {
  localStorage.setItem("login_time", Date.now().toString());
}

export function getLoginTime(): number | null {
  const t = localStorage.getItem("login_time");
  return t ? parseInt(t, 10) : null;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function authHeaders(): Record<string, string> {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const text = await res.text();
    let message = `Request failed with status ${res.status}`;
    try {
      const json = JSON.parse(text);
      message = json.detail || json.message || message;
    } catch {
      message = text || message;
    }
    throw new Error(message);
  }
  return res.json();
}

// Map backend snake_case fields → frontend camelCase
function mapTodo(raw: Record<string, unknown>): Todo {
  return {
    id: raw.id as string,
    text: raw.text as string,
    completed: raw.completed as boolean,
    priority: raw.priority as Todo["priority"],
    category: raw.category as Todo["category"],
    createdAt: new Date(raw.created_at as string),
    dueDate: (raw.due_date as string | null) ?? undefined,
    notes: (raw.notes as string | null) ?? undefined,
    createdByEmail: (raw.created_by_email as string | null) ?? undefined,
    createdByName: (raw.created_by_name as string | null) ?? undefined,
  };
}

// ── Auth ──────────────────────────────────────────────────────────────────────

export async function signIn(email: string, password: string): Promise<string> {
  const res = await fetch(`${API_URL}/auth/signin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await handleResponse<{ access_token: string }>(res);
  setToken(data.access_token);
  setLoginTime();
  return data.access_token;
}

export async function signUp(email: string, password: string, displayName: string): Promise<void> {
  const res = await fetch(`${API_URL}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, display_name: displayName }),
  });
  await handleResponse<{ message: string }>(res);
}

export function signOut(): void {
  clearToken();
}

// ── Todos ─────────────────────────────────────────────────────────────────────

export async function getTodos(): Promise<Todo[]> {
  const res = await fetch(`${API_URL}/todos/`, {
    headers: { ...authHeaders() },
  });
  const data = await handleResponse<{ data: Record<string, unknown>[] }>(res);
  return data.data.map(mapTodo);
}

export async function createTodo(
  data: Omit<Todo, "id" | "createdAt" | "completed">
): Promise<Todo> {
  const res = await fetch(`${API_URL}/todos/`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({
      text: data.text,
      priority: data.priority,
      category: data.category,
      due_date: data.dueDate ?? null,
      notes: data.notes ?? null,
    }),
  });
  const raw = await handleResponse<Record<string, unknown>>(res);
  return mapTodo(raw);
}

export async function updateTodo(
  id: string,
  updates: Partial<Todo>
): Promise<Todo> {
  // Map camelCase fields → snake_case for the backend
  const payload: Record<string, unknown> = {};
  if (updates.text !== undefined) payload.text = updates.text;
  if (updates.completed !== undefined) payload.completed = updates.completed;
  if (updates.priority !== undefined) payload.priority = updates.priority;
  if (updates.category !== undefined) payload.category = updates.category;
  if (updates.dueDate !== undefined) payload.due_date = updates.dueDate;
  if (updates.notes !== undefined) payload.notes = updates.notes;

  const res = await fetch(`${API_URL}/todos/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(payload),
  });
  const raw = await handleResponse<Record<string, unknown>>(res);
  return mapTodo(raw);
}

export async function deleteTodo(id: string): Promise<void> {
  const res = await fetch(`${API_URL}/todos/${id}`, {
    method: "DELETE",
    headers: { ...authHeaders() },
  });
  if (!res.ok) await handleResponse(res);
}
