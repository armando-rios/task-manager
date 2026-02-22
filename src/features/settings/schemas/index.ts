import { z } from "astro:schema";

export const updateThemeSchema = z.object({
  theme: z.enum(['catppuccin', 'kanagawa', 'kanagawa-dragon', 'tokyo-night', 'nord']),
});
