import { useCallback } from "react";
import { actions } from "astro:actions";
import {
  $projects,
  $tasks,
  removeProjectFromStore,
  addProjectToStore,
} from "../stores/appStore";
import { $taskCounts, setTaskCounts } from "../taskStore";
import { showToast } from "../toast";
import type { Project } from "../../../features/projects/types";

interface DeleteProjectResult {
  success: boolean;
  error?: Error;
}

export function useDeleteProject() {
  return useCallback(
    async (projectId: string): Promise<DeleteProjectResult> => {
      // Get project before deletion
      const currentProjects = $projects.get();
      const projectToDelete = currentProjects.find((p) => p.id === projectId);

      if (!projectToDelete) {
        showToast.error("Project not found");
        return { success: false, error: new Error("Project not found") };
      }

      // Calculate counts from project data
      const deletedCounts = {
        todo: Math.max(
          0,
          projectToDelete.taskCount - projectToDelete.completedCount,
        ),
        inProgress: 0,
        done: projectToDelete.completedCount || 0,
      };

      // Store current task counts for potential rollback
      const currentTaskCounts = $taskCounts.get();

      // Optimistic: Remove project from store
      removeProjectFromStore(projectId);

      // Optimistic: Remove tasks from store
      const tasksMap = $tasks.get() as Map<string, any>;
      const newTasksMap = new Map(tasksMap);
      newTasksMap.delete(projectId);
      $tasks.set(newTasksMap);

      // Optimistic: Update task counts
      setTaskCounts({
        todo: Math.max(0, currentTaskCounts.todo - deletedCounts.todo),
        inProgress: Math.max(
          0,
          currentTaskCounts.inProgress - deletedCounts.inProgress,
        ),
        done: Math.max(0, currentTaskCounts.done - deletedCounts.done),
      });

      try {
        // Call API
        const formData = new FormData();
        formData.append("id", projectId);
        const result = await actions.projects.delete(formData);

        if (result.error) {
          throw new Error(result.error.message);
        }

        showToast.success("Project deleted");
        return { success: true };
      } catch (error) {
        // Restore project on error
        addProjectToStore(projectToDelete);

        // Restore tasks on error
        const currentMap = $tasks.get();
        const restoredMap = new Map(currentMap);
        restoredMap.set(projectId, []);
        $tasks.set(restoredMap);

        // Restore task counts on error
        if (currentTaskCounts) {
          setTaskCounts(currentTaskCounts);
        }

        const message =
          error instanceof Error ? error.message : "Failed to delete project";
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
