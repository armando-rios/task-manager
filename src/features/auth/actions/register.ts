import { defineAction } from "astro:actions";
import { registerSchema } from "../schemas";

export const register = defineAction({
  accept: "form",
  input: registerSchema,
  handler: async (input, context) => {
    const { supabase } = context.locals;
    
    const { data, error } = await supabase.auth.signUp({
      email: input.email,
      password: input.password,
      options: {
        // Redirigir de vuelta al sistema tras verificar
        emailRedirectTo: `${context.url.origin}/auth/login`,
      }
    });

    if (error) throw new Error(error.message);

    // Si no hay sesión inmediata, es porque requiere verificación de email
    if (data.user && !data.session) {
      return { 
        success: true, 
        verificationRequired: true,
        email: data.user.email 
      };
    }

    return { success: true, user: data.user };
  },
});
