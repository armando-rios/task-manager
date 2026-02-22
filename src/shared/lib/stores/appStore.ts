/**
 * App Store - Barrel Re-export
 * Re-exports from domain-specific stores for backward compatibility.
 * New code should import directly from the specific store module.
 * @module stores/appStore
 */

// Project store
export {
  $projects,
  $activeProjectId,
  setProjects,
  setActiveProjectId,
  updateProjectInStore,
  addProjectToStore,
  removeProjectFromStore,
} from "./projectStore";

// Task store
export {
  $tasks,
  setTasks,
  updateTaskInStore,
  addTaskToStore,
  removeTaskFromStore,
} from "./taskStore";

// UI store
export { $isSyncing, $lastSyncError, $offlineMode } from "./uiStore";

// Operation queue
export {
  type PendingOperation,
  addPendingOperation,
  removePendingOperation,
  executeRollback,
} from "./operationQueue";
