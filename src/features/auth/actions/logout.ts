import { defineAction } from "astro:actions";

export const logout = defineAction({
  handler: async (_, context) => {
    const { supabase } = context.locals;
    const { error } = await supabase.auth.signOut();
    if (error) throw new Error(error.message);
    return { success: true };
  },
});
