import { defineAction } from "astro:actions";
import { z } from "astro:schema";

export const deleteTask = defineAction({
  accept: "json",
  input: z.object({ id: z.uuid() }),
  handler: async (input, context) => {
    const { supabase, user } = context.locals;

    const { error } = await supabase
      .from("tasks")
      .delete()
      .eq("id", input.id)
      .eq("user_id", user?.id);

    if (error) throw new Error(error.message);
    return { success: true };
  },
});
