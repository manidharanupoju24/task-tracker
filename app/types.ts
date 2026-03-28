export type Priority = "low" | "medium" | "high";

export type Category = "personal" | "work" | "shopping" | "other";

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  priority: Priority;
  category: Category;
  createdAt: Date;
  dueDate?: string;
  notes?: string;
  createdByEmail?: string;
  createdByName?: string;
}

export type FilterType = "all" | "active" | "completed";
