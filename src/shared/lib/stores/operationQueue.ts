/**
 * Operation Queue
 * Manages optimistic update tracking and rollback support
 * @module stores/operationQueue
 */

import { atom } from "nanostores";
import type { Project } from "../../../features/projects/types";
import type { Task } from "../../../features/tasks/types";
import { $projects } from "./projectStore";
import { $tasks } from "./taskStore";

// === TYPES ===

/** Pending operation for optimistic updates and rollback support */
export interface PendingOperation {
  id: string;
  action: "create" | "update" | "delete";
  entity: "project" | "task";
  previousState: unknown;
  timestamp: number;
}

// === INTERNAL STORE ===

const $operationQueue = atom<PendingOperation[]>([]);

// === OPERATION HELPERS ===

/** Add a pending operation to the queue for potential rollback */
export function addPendingOperation(
  operation: Omit<PendingOperation, "timestamp">,
): void {
  const current = $operationQueue.get();
  $operationQueue.set([...current, { ...operation, timestamp: Date.now() }]);
}

/** Remove a pending operation from the queue after successful sync */
export function removePendingOperation(operationId: string): void {
  const current = $operationQueue.get();
  $operationQueue.set(current.filter((op) => op.id !== operationId));
}

/** Execute rollback for a specific operation */
export function executeRollback(operationId: string): void {
  const current = $operationQueue.get();
  const operation = current.find((op) => op.id === operationId);

  if (!operation) return;

  switch (operation.entity) {
    case "project":
      rollbackProjectOperation(operation);
      break;
    case "task":
      rollbackTaskOperation(operation);
      break;
  }

  removePendingOperation(operationId);
}

// === INTERNAL ROLLBACK FUNCTIONS ===

function rollbackProjectOperation(operation: PendingOperation): void {
  const previousState = operation.previousState as Project[] | Project | null;

  switch (operation.action) {
    case "create":
      if (previousState && "id" in previousState) {
        removeProjectFromStoreLocal((previousState as Project).id);
      }
      break;
    case "update":
      if (Array.isArray(previousState)) {
        $projects.set(previousState);
      }
      break;
    case "delete":
      if (previousState && "id" in previousState) {
        addProjectToStoreLocal(previousState as Project);
      }
      break;
  }
}

function rollbackTaskOperation(operation: PendingOperation): void {
  const previousState = operation.previousState as
    | Map<string, Task[]>
    | Task[]
    | null;

  switch (operation.action) {
    case "create":
      if (
        previousState &&
        !Array.isArray(previousState) &&
        !(previousState instanceof Map)
      ) {
        const task = previousState as Task;
        if ("id" in task && "project_id" in task) {
          removeTaskFromStoreLocal(task.id, task.project_id);
        }
      }
      break;
    case "update":
      if (previousState instanceof Map) {
        $tasks.set(previousState);
      }
      break;
    case "delete":
      if (previousState instanceof Map) {
        const current = $tasks.get();
        const newTasks = new Map(current);
        previousState.forEach((tasks, projectId) => {
          const existing = newTasks.get(projectId) || [];
          newTasks.set(projectId, [...tasks, ...existing]);
        });
        $tasks.set(newTasks);
      }
      break;
  }
}

// Local helpers that replicate store operations to avoid circular deps
function removeProjectFromStoreLocal(projectId: string): void {
  const current = $projects.get();
  $projects.set(current.filter((p) => p.id !== projectId));
}

function addProjectToStoreLocal(project: Project): void {
  const current = $projects.get();
  $projects.set([project, ...current]);
}

function removeTaskFromStoreLocal(taskId: string, projectId: string): void {
  const current = $tasks.get();
  const projectTasks = current.get(projectId) || [];
  const newMap = new Map(current);
  newMap.set(
    projectId,
    projectTasks.filter((t) => t.id !== taskId),
  );
  $tasks.set(newMap);
}
