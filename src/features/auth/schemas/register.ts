import { z } from "astro:schema";

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});
