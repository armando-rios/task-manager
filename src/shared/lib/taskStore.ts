/**
 * Task Store - Re-export
 * Re-exports from the domain-specific task store for backward compatibility.
 * @module taskStore
 */

export {
  $tasks,
  setTasks,
  $taskCounts,
  setTaskCounts,
  updateTaskCount,
} from "./stores/taskStore";

export type { TaskStatus, Task } from "../../features/tasks/types";
export type { TaskCounts } from "./stores/taskStore";
