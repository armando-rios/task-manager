import { createProject } from "./create";
import { updateProject } from "./update";
import { deleteProject } from "./delete";

export const projectActions = {
  create: createProject,
  update: updateProject,
  delete: deleteProject,
};
