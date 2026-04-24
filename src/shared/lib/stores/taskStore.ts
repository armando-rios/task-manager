/**
 * Task Store
 * Manages task state, operations, and counts
 * @module stores/taskStore
 */

import { atom } from "nanostores";
import type { Task, TaskStatus } from "../../../features/tasks/types";

// === ENTITY STORES ===

/** Tasks indexed by project ID */
export const $tasks = atom<Map<string, Task[]>>(new Map());

// === TASK COUNTS ===

export interface TaskCounts {
  todo: number;
  inProgress: number;
  done: number;
}

export const $taskCounts = atom<TaskCounts>({
  todo: 0,
  inProgress: 0,
  done: 0,
});

// === STORE SETTERS ===

/** Initialize tasks store with fetched data */
export function setTasks(tasksMap: Map<string, Task[]>): void {
  $tasks.set(tasksMap);
}

/** Update a single task in the store */
export function updateTaskInStore(
  updatedTask: Partial<Task> & { id: string },
  projectId: string,
): void {
  const current = $tasks.get();
  const projectTasks = current.get(projectId) || [];
  const index = projectTasks.findIndex((t) => t.id === updatedTask.id);

  if (index !== -1) {
    const newTasks = [...projectTasks];
    newTasks[index] = { ...projectTasks[index], ...updatedTask };
    const newMap = new Map(current);
    newMap.set(projectId, newTasks);
    $tasks.set(newMap);
  }
}

/** Add a new task to the store */
export function addTaskToStore(task: Task): void {
  const current = $tasks.get();
  const projectTasks = current.get(task.project_id) || [];
  const newMap = new Map(current);
  newMap.set(task.project_id, [task, ...projectTasks]);
  $tasks.set(newMap);
}

/** Remove a task from the store */
export function removeTaskFromStore(taskId: string, projectId: string): void {
  const current = $tasks.get();
  const projectTasks = current.get(projectId) || [];
  const newMap = new Map(current);
  newMap.set(
    projectId,
    projectTasks.filter((t) => t.id !== taskId),
  );
  $tasks.set(newMap);
}

// === TASK COUNT HELPERS ===

/** Set all task counts at once */
export function setTaskCounts(counts: Partial<TaskCounts>): void {
  const current = $taskCounts.get();
  $taskCounts.set({
    todo: counts.todo ?? current.todo,
    inProgress: counts.inProgress ?? current.inProgress,
    done: counts.done ?? current.done,
  });
}

/** Update a single task count by status */
export function updateTaskCount(status: TaskStatus, delta: number): void {
  const current = $taskCounts.get();
  const key = status === "in-progress" ? "inProgress" : status;
  $taskCounts.set({
    ...current,
    [key]: Math.max(0, current[key] + delta),
  });
}
