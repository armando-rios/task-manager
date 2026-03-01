import { createTask } from "./create";
import { updateTask } from "./update";
import { deleteTask } from "./delete";

export const taskActions = {
  create: createTask,
  update: updateTask,
  delete: deleteTask,
};
