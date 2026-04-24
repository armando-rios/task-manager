import { defineAction } from "astro:actions";
import { loginSchema } from "../schemas";

export const login = defineAction({
  accept: "form",
  input: loginSchema,
  handler: async (input, context) => {
    const { supabase } = context.locals;

    const { data, error } = await supabase.auth.signInWithPassword({
      email: input.email,
      password: input.password,
    });

    if (error) {
      // Detección ultra-robusta del estado de confirmación
      const isUnconfirmed =
        error.message.toLowerCase().includes("confirmed") ||
        error.message.toLowerCase().includes("confirmation") ||
        (error.status === 400 && error.message.includes("Email"));

      if (isUnconfirmed) {
        return {
          success: false,
          needsVerification: true,
          email: input.email,
        };
      }

      // Para cualquier otro error (contraseña mal, etc), lanzamos error normal
      throw new Error(error.message);
    }

    return { success: true, user: data.user };
  },
});
