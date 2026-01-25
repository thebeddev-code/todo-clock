export type Todo = {
  id: number,
  title: string;
  description: string;
  tags: string[];
  color: string | null;
  status: "pending" | "in-progress" | "completed" | "overdue";
  priority: "low" | "medium" | "high";
  startsAt?: string | null;
  due?: string | null;
  updatedAt: string;
  createdAt?: string;
  completedAt?: string | null;
  isRecurring: boolean;
  // e.g "RRULE:FREQ=WEEKLY;BYDAY=MO,WE,FR"
  recurrenceRule?: string | null;
};


