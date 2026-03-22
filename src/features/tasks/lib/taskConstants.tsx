import type { Task, TaskStatus } from "../types";
import type { ReactNode } from "react";

/**
 * Status configuration object containing UI styling and behavior for each task status.
 * Centralized here to avoid duplication across components.
 */
export const statusConfig: Record<
  TaskStatus,
  {
    border: string;
    bg: string;
    icon: ReactNode;
    nextStatus: TaskStatus;
    label: string;
    color: string;
  }
> = {
  todo: {
    border: "border-theme-surface-2",
    bg: "bg-theme-surface-1/50",
    icon: null,
    nextStatus: "in-progress",
    label: "To Do",
    color: "text-theme-subtext",
  },
  "in-progress": {
    border: "border-theme-primary",
    bg: "bg-theme-primary/10",
    icon: (
      <svg
        className="w-3 h-3 animate-spin"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        strokeWidth={3}
      >
        <path
          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    nextStatus: "done",
    label: "In Progress",
    color: "text-theme-primary",
  },
  done: {
    border: "border-theme-green",
    bg: "bg-theme-green/10",
    icon: (
      <svg
        className="w-3 h-3"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        strokeWidth={3}
      >
        <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    nextStatus: "todo",
    label: "Done",
    color: "text-theme-green",
  },
};

/**
 * Status options array for dropdowns and selectors.
 * Derived from statusConfig for consistency.
 */
export const statusOptions: {
  value: TaskStatus;
  label: string;
  color: string;
  bg: string;
}[] = Object.entries(statusConfig).map(([value, config]) => ({
  value: value as TaskStatus,
  label: config.label,
  color: config.color,
  bg: config.bg,
}));
