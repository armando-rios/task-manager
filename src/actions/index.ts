import { authActions } from "@features/auth";
import { projectActions } from "@features/projects/actions";
import { taskActions } from "@features/tasks/actions";
import { settingsActions } from "@features/settings/actions";

export const server = {
  auth: authActions,
  projects: projectActions,
  tasks: taskActions,
  settings: settingsActions,
};
