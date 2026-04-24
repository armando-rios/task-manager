import { z } from "astro:schema";

export const createProjectSchema = z.object({
  title: z.string().min(1, "El título es obligatorio"),
  description: z.string().optional(),
});

export const editProjectSchema = z.object({
  id: z.uuid(),
  title: z.string().min(1, "El título no puede estar vacío").optional(),
  description: z.string().optional(),
});
