import { z } from "zod";

const colorSchema = z
  .string({
    error: "Color must be a string.",
  })
  .regex(
    /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$|^rgb\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*\)$|^hsl\(\s*\d{1,3}\s*,\s*\d{1,3}%\s*,\s*\d{1,3}%\s*\)$/,
    { message: "Color must be in hex, rgb(), or hsl() format." },
  )
  .optional()
  .nullable();

const isoDateTime = z.iso.datetime({
  offset: true,
  message: "Date must ISO 8601 formatted (e.g., 2026-01-04).",
});

// Define the Todo schema
export const todoPayloadSchema = z.object({
  title: z
    .string({
      error: "Title must be a string.",
    })
    .nonempty({ message: "Title can't be empty." })
    .max(255, { message: "Title can't exceed 255 characters." }),
  description: z
    .string({
      error: "Description must be a string.",
    })
    .max(500, { message: "Description can't exceed 500 characters." }),
  tags: z.array(
    z
      .string({ error: "Each tag must be a string" })
      .max(50, { message: "Each tag must be 50 characters or fewer." })
      .nonempty({ message: "Tags cannot be empty strings." }),
    { error: "Tags is expected to be an array" },
  ),
  color: colorSchema,
  status: z
    .enum(["pending", "in-progress", "completed"], {
      error: "Status must be one of 'pending', 'in-progress', or 'completed'.",
    })
    .default("pending"),

  priority: z
    .enum(["low", "medium", "high"], {
      error: "Priority must be one of 'low', 'medium', or 'high'.",
    })
    .default("medium"),
  startsAt: isoDateTime.optional().nullable(),
  due: isoDateTime.optional().nullable(),
  createdAt: isoDateTime.default(() => new Date().toISOString()),
  updatedAt: isoDateTime.default(() => new Date().toISOString()),
  completedAt: isoDateTime.nullable().optional(),
  isRecurring: z.boolean({
    error: "isRecurring must be a boolean.",
  }),
  recurrenceRule: z
    .string({
      error: "Recurrence rule must be a string.",
    })
    .optional(),
});

export type CreateTodoPayload = z.infer<typeof todoPayloadSchema>;
