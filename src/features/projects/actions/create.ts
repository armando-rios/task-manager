import { defineAction } from "astro:actions";
import { createProjectSchema } from "../schemas";

export const createProject = defineAction({
  accept: "form",
  input: createProjectSchema,
  handler: async (input, context) => {
    const { supabase, user } = context.locals;

    // User always comes from middleware (Locals)
    const { data, error } = await supabase
      .from("projects")
      .insert([
        {
          title: input.title,
          description: input.description,
          user_id: user?.id,
        },
      ])
      .select();

    if (error) throw new Error(error.message);
    return { success: true, project: data[0] };
  },
});
