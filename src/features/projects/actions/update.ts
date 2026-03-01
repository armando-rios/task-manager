import { defineAction } from "astro:actions";
import { editProjectSchema } from "../schemas";

export const updateProject = defineAction({
  accept: "json", // Islands prefer JSON for in-place editing
  input: editProjectSchema,
  handler: async (input, context) => {
    const { supabase, user } = context.locals;

    // Build update object with only provided fields
    const updateData: Record<string, unknown> = {};
    if (input.title !== undefined) updateData.title = input.title;
    if (input.description !== undefined)
      updateData.description = input.description ?? null;

    const { data, error } = await supabase
      .from("projects")
      .update(updateData)
      .eq("id", input.id)
      .eq("user_id", user?.id)
      .select();
    if (error) throw new Error(error.message);
    return { success: true, project: data[0] };
  },
});
