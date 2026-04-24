/**
 * Optimistic Task Status Update Hook
 * Updates task status immediately in the UI while the server request is in-flight
 * @module hooks/useUpdateTaskStatus
 */

import { useCallback } from "react";
import { actions } from "astro:actions";
import { $tasks, updateTaskInStore } from "../stores/appStore";
import { showToast } from "../toast";
import { updateTaskCount } from "../taskStore";
import type { Task, TaskStatus } from "../../../features/tasks/types";

interface UpdateTaskStatusOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

/**
 * Hook for optimistically updating task status
 * @returns Function to update task status with optimistic UI updates
 */
export function useUpdateTaskStatus() {
  return useCallback(
    async (
      task: Task,
      newStatus: TaskStatus,
      options?: UpdateTaskStatusOptions,
    ): Promise<boolean> => {
      const originalStatus = task.status;
      const projectId = task.project_id;

      // 1. Save original status (already have it from task)

      // 2. Update task in $tasks store immediately
      updateTaskInStore({ id: task.id, status: newStatus }, projectId);

      // 3. Update counts (old -1, new +1)
      updateTaskCount(originalStatus, -1);
      updateTaskCount(newStatus, 1);

      try {
        // 4. Call actions.tasks.update()
        const result = await actions.tasks.update({
          id: task.id,
          status: newStatus,
        });
        const resultData = result.data as
          | { success: boolean; task: Task }
          | undefined;

        if (!resultData?.success) {
          throw new Error("Failed to update task status");
        }

        // 5. On success: Show toast
        showToast.success(`Status updated to ${newStatus.replace("-", " ")}`);
        options?.onSuccess?.();
        return true;
      } catch (error) {
        // 6. On error: Rollback task status, rollback counts, show error toast
        updateTaskInStore({ id: task.id, status: originalStatus }, projectId);
        updateTaskCount(newStatus, -1);
        updateTaskCount(originalStatus, 1);

        showToast.error(
          error instanceof Error
            ? error.message
            : "Failed to update task status",
        );
        options?.onError?.(
          error instanceof Error
            ? error
            : new Error("Failed to update task status"),
        );
        return false;
      }
    },
    [],
  );
}
