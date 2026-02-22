import { z } from "astro:schema";

export const createTaskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  project_id: z.uuid(),
  description: z.string().optional(),
  status: z.enum(["todo", "in-progress", "done"]).default("todo"),
  priority: z.enum(["low", "medium", "high"]).default("medium"),
  due_date: z.string().optional().nullable(),
});

export const updateTaskSchema = z.object({
  id: z.uuid(),
  title: z.string().min(1).optional(),
  description: z.string().optional().nullable(),
  status: z.enum(["todo", "in-progress", "done"]).optional(),
  priority: z.enum(["low", "medium", "high"]).optional(),
  due_date: z.string().optional().nullable(),
  sort_order: z.number().optional(),
});
