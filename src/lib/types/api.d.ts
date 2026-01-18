
export type BaseEntity = {
  id: number;
  createdAt: string;
};

export type Entity<T> = {
  [K in keyof T]: T[K];
} & BaseEntity;

export type Meta = {
  page: number;
  total: number;
  totalPages: number;
};

export type User = Entity<{
  firstName: string;
  lastName: string;
  email: string;
}>;

export type AuthResponse = {
  jwt: string;
  user: User;
};

export type TodoTime = {
  hour: number;
  minutes: number;
};

export type Todo = Entity<{
  title: string;
  description: string;
  tags: string[];
  color: string | null;
  status: "pending" | "in-progress" | "completed" | "overdue";
  priority: "low" | "medium" | "high";
  startsAt?: string | null;
  due?: string | null;
  updatedAt: string;
  completedAt?: string | null;
  isRecurring: boolean;
  // e.g "RRULE:FREQ=WEEKLY;BYDAY=MO,WE,FR"
  recurrenceRule?: string | null;
}>;
