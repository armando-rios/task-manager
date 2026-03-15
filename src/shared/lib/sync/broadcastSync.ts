import { $projects, $tasks, setProjects, setTasks } from "../stores/appStore";
import type { Project } from "../../../features/projects/types";
import type { Task } from "../../../features/tasks/types";

// Message types
type SyncMessageType =
  | "PROJECT_CREATED"
  | "PROJECT_UPDATED"
  | "PROJECT_DELETED"
  | "TASK_CREATED"
  | "TASK_UPDATED"
  | "TASK_DELETED"
  | "TASK_STATUS_CHANGED"
  | "SYNC_REQUEST"
  | "SYNC_RESPONSE";

interface SyncMessage {
  type: SyncMessageType;
  payload: unknown;
  timestamp: number;
}

// BroadcastChannel for cross-tab sync
const CHANNEL_NAME = "task-manager-sync";
let channel: BroadcastChannel | null = null;

/**
 * Initialize the broadcast channel for cross-tab synchronization.
 * Call this once when the app loads.
 */
export function initBroadcastSync(): void {
  if (typeof window === "undefined" || channel) return;

  channel = new BroadcastChannel(CHANNEL_NAME);

  channel.onmessage = (event: MessageEvent<SyncMessage>) => {
    const { type, payload } = event.data;

    switch (type) {
      case "PROJECT_CREATED":
        handleProjectCreated(payload as Project);
        break;
      case "PROJECT_UPDATED":
        handleProjectUpdated(payload as Project);
        break;
      case "PROJECT_DELETED":
        handleProjectDeleted(payload as string);
        break;
      case "TASK_CREATED":
        handleTaskCreated(payload as { projectId: string; task: Task });
        break;
      case "TASK_UPDATED":
        handleTaskUpdated(payload as { projectId: string; task: Task });
        break;
      case "TASK_DELETED":
        handleTaskDeleted(payload as { projectId: string; taskId: string });
        break;
      case "TASK_STATUS_CHANGED":
        handleTaskStatusChanged(
          payload as {
            projectId: string;
            taskId: string;
            oldStatus: string;
            newStatus: string;
          },
        );
        break;
      case "SYNC_REQUEST":
        handleSyncRequest();
        break;
      case "SYNC_RESPONSE":
        handleSyncResponse(
          payload as { projects: Project[]; tasks: Record<string, Task[]> },
        );
        break;
    }
  };

  // Request sync from other tabs on load
  broadcastSync("SYNC_REQUEST", null);
}

/**
 * Broadcast a change to other tabs.
 */
export function broadcastSync(type: SyncMessageType, payload: unknown): void {
  if (!channel) return;

  channel.postMessage({
    type,
    payload,
    timestamp: Date.now(),
  });
}

// === HANDLERS ===

function handleProjectCreated(project: Project): void {
  const current = $projects.get();
  // Don't add if already exists (optimistic update)
  if (current.find((p) => p.id === project.id)) return;
  setProjects([project, ...current]);
}

function handleProjectUpdated(project: Project): void {
  const current = $projects.get();
  const updated = current.map((p) =>
    p.id === project.id ? { ...p, ...project } : p,
  );
  setProjects(updated);
}

function handleProjectDeleted(projectId: string): void {
  const current = $projects.get();
  setProjects(current.filter((p) => p.id !== projectId));
}

function handleTaskCreated({
  projectId,
  task,
}: {
  projectId: string;
  task: Task;
}): void {
  const current = $tasks.get();
  const projectTasks = current.get(projectId) || [];
  // Don't add if already exists
  if (projectTasks.find((t) => t.id === task.id)) return;

  const newMap = new Map(current);
  newMap.set(projectId, [task, ...projectTasks]);
  setTasks(newMap);
}

function handleTaskUpdated({
  projectId,
  task,
}: {
  projectId: string;
  task: Task;
}): void {
  const current = $tasks.get();
  const projectTasks = current.get(projectId) || [];
  const updated = projectTasks.map((t) =>
    t.id === task.id ? { ...t, ...task } : t,
  );

  const newMap = new Map(current);
  newMap.set(projectId, updated);
  setTasks(newMap);
}

function handleTaskDeleted({
  projectId,
  taskId,
}: {
  projectId: string;
  taskId: string;
}): void {
  const current = $tasks.get();
  const projectTasks = current.get(projectId) || [];
  const filtered = projectTasks.filter((t) => t.id !== taskId);

  const newMap = new Map(current);
  newMap.set(projectId, filtered);
  setTasks(newMap);
}

function handleTaskStatusChanged({
  projectId,
  taskId,
  oldStatus,
  newStatus,
}: {
  projectId: string;
  taskId: string;
  oldStatus: string;
  newStatus: string;
}): void {
  const current = $tasks.get();
  const projectTasks = current.get(projectId) || [];
  const updated = projectTasks.map((t) =>
    t.id === taskId ? { ...t, status: newStatus as Task["status"] } : t,
  );

  const newMap = new Map(current);
  newMap.set(projectId, updated);
  setTasks(newMap);

  // Update counts would be handled by the store
}

function handleSyncRequest(): void {
  if (!channel) return;

  // Send current state to requesting tab
  const projects = $projects.get();
  const tasksMap = $tasks.get();
  const tasks = Object.fromEntries(tasksMap);

  channel.postMessage({
    type: "SYNC_RESPONSE",
    payload: { projects, tasks },
    timestamp: Date.now(),
  });
}

function handleSyncResponse(data: {
  projects: Project[];
  tasks: Record<string, Task[]>;
}): void {
  // Only sync if we have no data (new tab)
  if ($projects.get().length === 0) {
    setProjects(data.projects);
    setTasks(new Map(Object.entries(data.tasks)));
  }
}

/**
 * Clean up the broadcast channel.
 */
export function cleanupBroadcastSync(): void {
  if (channel) {
    channel.close();
    channel = null;
  }
}
