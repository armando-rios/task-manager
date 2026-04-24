import { useCallback } from "react";
import { actions } from "astro:actions";
import {
  $tasks,
  removeTaskFromStore,
  addTaskToStore,
} from "../stores/appStore";
import { showToast } from "../toast";
import { updateTaskCount } from "../taskStore";
import type { Task } from "../../../features/tasks/types";

interface DeleteTaskResult {
  success: boolean;
  error?: Error;
}

export function useDeleteTask() {
  return useCallback(
    async (taskId: string, projectId: string): Promise<DeleteTaskResult> => {
      // Get task before deletion for potential restore
      const currentTasks = $tasks.get();
      const projectTasks = currentTasks.get(projectId) || [];
      const taskToDelete = projectTasks.find((t) => t.id === taskId);

      if (!taskToDelete) {
        showToast.error("Task not found");
        return { success: false, error: new Error("Task not found") };
      }

      // Optimistic: Remove from store immediately
      removeTaskFromStore(taskId, projectId);

      // Update counts
      updateTaskCount(taskToDelete.status, -1);

      try {
        // Call API
        const result = await actions.tasks.delete({ id: taskId });

        if (result.error) {
          throw new Error(result.error.message);
        }

        showToast.success("Task deleted");
        return { success: true };
      } catch (error) {
        // Restore on error
        addTaskToStore(taskToDelete);
        updateTaskCount(taskToDelete.status, 1);

        const message =
          error instanceof Error ? error.message : "Failed to delete task";
        showToast.error(message);
        return {
          success: false,
          error: error instanceof Error ? error : new Error(message),
        };
      }
    },
    [],
  );
}
