import { defineAction } from "astro:actions";
import { createTaskSchema } from "../schemas";

export const createTask = defineAction({
  accept: "json",
  input: createTaskSchema,
  handler: async (input, context) => {
    const { supabase, user } = context.locals;
    
    const { data, error } = await supabase
      .from("tasks")
      .insert([{ 
        ...input,
        user_id: user?.id 
      }])
      .select();

    if (error) throw new Error(error.message);
    return { success: true, task: data[0] };
  },
});
