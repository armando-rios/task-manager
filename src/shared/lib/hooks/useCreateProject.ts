/**
 * Optimistic Project Creation Hook
 * Creates a project immediately in the UI while the server request is in-flight
 * @module hooks/useCreateProject
 */

import { useCallback } from "react";
import { nanoid } from "nanoid";
import { actions } from "astro:actions";
import {
  addPendingOperation,
  removePendingOperation,
  executeRollback,
  addProjectToStore,
  removeProjectFromStore,
} from "../stores/appStore";
import {
  registerOptimisticId,
  clearOptimisticId,
} from "../stores/optimisticStore";
import { showToast } from "../toast";
import { broadcastSync } from "../sync/broadcastSync";
import type { Project } from "../../../features/projects/types";

interface CreateProjectData {
  title: string;
  description?: string;
}

interface CreateProjectResult {
  success: boolean;
  project?: Project;
  error?: string;
}

// Extended Project type for optimistic updates
interface OptimisticProject extends Project {
  _optimistic?: boolean;
}

/**
 * Hook for optimistically creating a new project
 * @returns Function to create a project with optimistic UI updates
 */
export function useCreateProject() {
  return useCallback(
    async (data: CreateProjectData): Promise<CreateProjectResult> => {
      // 1. Generate optimistic ID with nanoid
      const optimisticId = `temp_${nanoid(10)}`;
      const timestamp = new Date().toISOString();

      // 2. Create temp project with _optimistic: true flag
      const tempProject: OptimisticProject = {
        id: optimisticId,
        title: data.title,
        description: data.description || null,
        taskCount: 0,
        completedCount: 0,
        progress: 0,
        created_at: timestamp,
        updated_at: timestamp,
        _optimistic: true,
      };

      // 3. Save current state for rollback and add to store immediately
      addProjectToStore(tempProject as Project);

      // 4. Register rollback operation
      const operationId = nanoid();
      addPendingOperation({
        id: operationId,
        action: "create",
        entity: "project",
        previousState: tempProject,
      });

      try {
        // 5. Call actions.projects.create() - actions accept FormData
        const formData = new FormData();
        formData.append("title", data.title);
        if (data.description) {
          formData.append("description", data.description);
        }

        const result = await actions.projects.create(formData);
        const resultData = result.data as
          | { success: boolean; project: OptimisticProject }
          | undefined;

        if (resultData?.success && resultData?.project) {
          // 6. On success: Replace optimistic with real, register ID mapping
          removePendingOperation(operationId);
          registerOptimisticId(optimisticId, resultData.project.id);

          // Replace temp project with real project
          removeProjectFromStore(optimisticId);
          addProjectToStore(resultData.project as Project);

          // Broadcast to other tabs
          broadcastSync("PROJECT_CREATED", resultData.project as Project);

          // Clear the optimistic ID mapping after a delay
          setTimeout(() => clearOptimisticId(optimisticId), 5000);

          showToast.success("Project created");
          return { success: true, project: resultData.project as Project };
        } else {
          // Handle error case
          throw new Error("Failed to create project");
        }
      } catch (error) {
        // 7. On error: Execute rollback, show toast
        executeRollback(operationId);
        showToast.error(
          error instanceof Error ? error.message : "Failed to create project",
        );
        return {
          success: false,
          error:
            error instanceof Error ? error.message : "Failed to create project",
        };
      }
    },
    [],
  );
}
