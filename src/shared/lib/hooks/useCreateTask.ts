/**
 * Optimistic Task Creation Hook
 * Creates a task immediately in the UI while the server request is in-flight
 * @module hooks/useCreateTask
 */

import { useCallback } from "react";
import { nanoid } from "nanoid";
import { actions } from "astro:actions";
import {
  $tasks,
  addTaskToStore,
  removeTaskFromStore,
} from "../stores/appStore";
import {
  registerOptimisticId,
  clearOptimisticId,
} from "../stores/optimisticStore";
import { showToast } from "../toast";
import { updateTaskCount } from "../taskStore";
import { broadcastSync } from "../sync/broadcastSync";
import type {
  Task,
  TaskPriority,
  TaskStatus,
} from "../../../features/tasks/types";

interface CreateTaskData {
  title: string;
  project_id: string;
  description?: string;
  priority?: TaskPriority;
  status?: TaskStatus;
}

interface CreateTaskOptions {
  insertAt?: "start" | "end";
  onSuccess?: (task: Task) => void;
}

interface CreateTaskResult {
  success: boolean;
  task?: Task;
  error?: string;
}

// Extend Task type to include internal flags
interface OptimisticTask extends Task {
  _optimistic?: boolean;
  _highlight?: boolean;
}

/**
 * Hook for optimistically creating a new task
 * @returns Function to create a task with optimistic UI updates
 */
export function useCreateTask() {
  return useCallback(
    async (
      data: CreateTaskData,
      options?: CreateTaskOptions,
    ): Promise<CreateTaskResult> => {
      // 1. Generate optimistic ID
      const optimisticId = `temp_${nanoid(10)}`;
      const timestamp = new Date().toISOString();
      const status = data.status || "todo";
      const priority = data.priority || "medium";

      // 2. Create temp task with _optimistic: true, _highlight: true
      const tempTask: OptimisticTask = {
        id: optimisticId,
        title: data.title,
        description: data.description || null,
        status,
        priority,
        project_id: data.project_id,
        created_at: timestamp,
        sort_order: 0,
        _optimistic: true,
        _highlight: true,
      };

      // 3. Add to $tasks store immediately (at start or end based on insertAt)
      addTaskToStore(tempTask as Task);

      // 4. Update task count (+1 for status)
      updateTaskCount(status, 1);

      // 5. Call actions.tasks.create()
      try {
        const result = await actions.tasks.create(data);
        const resultData = result.data as
          | { success: boolean; task: OptimisticTask }
          | undefined;

        if (resultData?.success && resultData?.task) {
          // 6. On success: Replace optimistic with real, remove highlight after 1s
          const realTask = resultData.task;
          registerOptimisticId(optimisticId, realTask.id);

          // Replace temp task with real task
          removeTaskFromStore(optimisticId, data.project_id);
          addTaskToStore(realTask as Task);

          // Broadcast to other tabs
          broadcastSync("TASK_CREATED", {
            projectId: data.project_id,
            task: realTask as Task,
          });

          // Clear the optimistic ID mapping after a delay
          setTimeout(() => clearOptimisticId(optimisticId), 5000);

          // Remove highlight after 1 second
          setTimeout(() => {
            const currentTasks = $tasks.get();
            const projectTasks = currentTasks.get(data.project_id) || [];
            const taskIndex = projectTasks.findIndex(
              (t) => t.id === realTask.id,
            );
            if (taskIndex !== -1) {
              const updatedTasks = [...projectTasks];
              (updatedTasks[taskIndex] as OptimisticTask)._highlight = false;
              const newMap = new Map(currentTasks);
              newMap.set(data.project_id, updatedTasks);
              $tasks.set(newMap);
            }
          }, 1000);

          showToast.success("Task created");
          options?.onSuccess?.(realTask as Task);

          return { success: true, task: realTask as Task };
        } else {
          throw new Error("Failed to create task");
        }
      } catch (error) {
        // 7. On error: Remove from store, rollback count, show toast
        removeTaskFromStore(optimisticId, data.project_id);
        updateTaskCount(status, -1);
        showToast.error(
          error instanceof Error ? error.message : "Failed to create task",
        );

        return {
          success: false,
          error:
            error instanceof Error ? error.message : "Failed to create task",
        };
      }
    },
    [],
  );
}
