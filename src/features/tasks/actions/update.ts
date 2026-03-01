import { defineAction } from "astro:actions";
import { updateTaskSchema } from "../schemas";

export const updateTask = defineAction({
  accept: "json",
  input: updateTaskSchema,
  handler: async (input, context) => {
    const { supabase, user } = context.locals;
    const { id, ...updates } = input;

    const { data, error } = await supabase
      .from("tasks")
      .update(updates)
      .eq("id", id)
      .eq("user_id", user?.id)
      .select();

    if (error) throw new Error(error.message);
    return { success: true, task: data[0] };
  },
});
