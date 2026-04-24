import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Task } from "../../types";
import { statusConfig } from "../../lib/taskConstants.tsx";
import { useUpdateTaskStatus, useDeleteTask } from "@shared/lib/hooks";
import { ConfirmModal } from "@shared/components/ui";

interface Props {
  task: Task;
  onDelete?: (id: string) => void;
  onOpenModal?: () => void;
}

const priorityColors = {
  high: "bg-theme-priority-high",
  medium: "bg-theme-primary",
  low: "bg-theme-surface-2",
};

export function TaskItem({ task, onDelete, onOpenModal }: Props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  // Optimistic status update hook
  const updateStatus = useUpdateTaskStatus();
  const deleteTaskHook = useDeleteTask();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 100 : "auto",
    opacity: isDragging ? 0.5 : 1,
  };

  const priorityColor = priorityColors[task.priority];
  const status = statusConfig[task.status];

  const handleToggleStatus = async () => {
    const newStatus = status.nextStatus;
    await updateStatus(task, newStatus);
  };

  const handleDeleteClick = () => {
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    await deleteTaskHook(task.id, task.project_id);
    setIsDeleteModalOpen(false);
    onDelete?.(task.id);
  };

  return (
    <>
      <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
        <div
          onClick={() => onOpenModal?.()}
          className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all duration-200 group ${status.bg} ${status.border} ${
            isDragging ? "shadow-none" : "hover:shadow-lg"
          } ${task.status === "done" ? "opacity-60" : ""}`}
        >
          {/* Drag Handle */}
          <div className="cursor-grab text-theme-subtext opacity-0 group-hover:opacity-100 transition-opacity touch-manipulation">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={2}
            >
              <path d="M4 8h16M4 16h16" strokeLinecap="round" />
            </svg>
          </div>

          {/* Status Toggle */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleToggleStatus();
            }}
            className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all shrink-0 ${
              task.status === "done"
                ? "bg-theme-green border-theme-green text-theme-surface-0"
                : task.status === "in-progress"
                  ? "border-theme-primary text-theme-primary"
                  : "border-theme-surface-2 text-transparent hover:border-theme-primary hover:text-theme-primary"
            }`}
          >
            {status.icon}
          </button>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h4
              className={`font-medium text-theme-text truncate ${task.status === "done" ? "line-through" : ""}`}
            >
              {task.title}
            </h4>
            {task.description && (
              <p className="text-xs text-theme-subtext truncate mt-0.5">
                {task.description.replace(/[#*`]/g, "")}
              </p>
            )}
          </div>

          {/* Priority Indicator */}
          <div className={`w-3 h-3 rounded-full ${priorityColor} shrink-0`} />

          {/* Status Badge (mobile) */}
          <span
            className={`sm:hidden inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${
              task.status === "todo"
                ? "bg-theme-surface-2/50 text-theme-subtext"
                : task.status === "in-progress"
                  ? "bg-theme-primary/20 text-theme-primary"
                  : "bg-theme-green/20 text-theme-green"
            }`}
          >
            {task.status === "todo"
              ? "To Do"
              : task.status === "in-progress"
                ? "In Progress"
                : "Done"}
          </span>

          {/* Actions */}
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteClick();
              }}
              className="p-2 rounded-lg text-theme-subtext hover:text-theme-priority-high hover:bg-theme-priority-high/10 transition-all"
              aria-label="Delete task"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={2}
              >
                <path
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Task"
        message="Are you sure you want to delete this task? This action cannot be undone."
        confirmText="Delete"
        variant="danger"
      />
    </>
  );
}
