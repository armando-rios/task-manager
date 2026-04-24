import { actions } from "astro:actions";
import { showToast } from "@shared/lib/toast";
import type { Task, TaskStatus } from "../types";

interface DeleteOptions {
  taskId: string;
  onSuccess?: () => void;
  onError?: (error: { message: string }) => void;
}

export async function deleteTask({
  taskId,
  onSuccess,
  onError,
}: DeleteOptions): Promise<boolean> {
  const { error } = await actions.tasks.delete({ id: taskId });
  if (error) {
    showToast.error(error.message);
    onError?.(error);
    return false;
  }
  showToast.success("Task deleted");
  onSuccess?.();
  return true;
}

interface UpdateOptions {
  taskId: string;
  updates: {
    title?: string;
    description?: string;
    status?: TaskStatus;
    priority?: Task["priority"];
    sort_order?: number;
  };
  onSuccess?: () => void;
  onError?: (error: { message: string }) => void;
}

export async function updateTask({
  taskId,
  updates,
  onSuccess,
  onError,
}: UpdateOptions): Promise<boolean> {
  const { error } = await actions.tasks.update({
    id: taskId,
    ...updates,
  });
  if (error) {
    showToast.error(error.message);
    onError?.(error);
    return false;
  }
  showToast.success("Task updated");
  onSuccess?.();
  return true;
}

interface ChangeTaskStatusOptions {
  task: Task;
  newStatus: TaskStatus;
  setTasks?: (updater: (prev: Task[]) => Task[]) => void;
  originalTask?: Task;
  onCountUpdate?: (status: TaskStatus, delta: number) => void;
  onSuccess?: () => void;
  onError?: (error: { message: string }) => void;
}

async function changeTaskStatus({
  task,
  newStatus,
  setTasks,
  originalTask,
  onCountUpdate,
  onSuccess,
  onError,
}: ChangeTaskStatusOptions): Promise<boolean> {
  // Optimistic update via setTasks if provided
  if (setTasks) {
    setTasks((prev) =>
      prev.map((t) => (t.id === task.id ? { ...t, status: newStatus } : t)),
    );
    // Update store counts
    onCountUpdate?.(task.status, -1);
    onCountUpdate?.(newStatus, 1);
  }

  const { error } = await actions.tasks.update({
    id: task.id,
    status: newStatus,
  });

  if (error) {
    showToast.error(error.message);
    // Revert optimistic update
    if (setTasks && originalTask) {
      setTasks((prev) =>
        prev.map((t) => (t.id === task.id ? originalTask : t)),
      );
      // Revert store counts
      onCountUpdate?.(newStatus, -1);
      onCountUpdate?.(task.status, 1);
    }
    onError?.(error);
    return false;
  }

  showToast.success(`Status updated to ${newStatus.replace("-", " ")}`);
  onSuccess?.();
  return true;
}
