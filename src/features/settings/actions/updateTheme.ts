import { defineAction } from "astro:actions";
import { updateThemeSchema } from "../schemas";

export const updateTheme = defineAction({
  accept: "form",
  input: updateThemeSchema,
  handler: async (input, context) => {
    const { cookies } = context;
    
    // Guardar el tema en una cookie persistente (1 año)
    cookies.set("theme", input.theme, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      httpOnly: true,
      secure: true,
      sameSite: "lax",
    });

    return { success: true, theme: input.theme };
  },
});
