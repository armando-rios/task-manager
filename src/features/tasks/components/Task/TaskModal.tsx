import { useState, useEffect } from "react";
import { Modal } from "@shared/components/ui/Modal";
import { ConfirmModal } from "@shared/components/ui/ConfirmModal";
import { marked } from "marked";
import type { Task, TaskStatus, TaskPriority } from "../../types";
import { updateTask, deleteTask } from "../../lib/taskOperations";
import { statusOptions } from "../../lib/taskConstants.tsx";

interface Props {
  task: Task;
  isOpen: boolean;
  onClose: () => void;
  onUpdate?: (updates: Partial<Task>) => Promise<void>;
  onDelete?: () => Promise<void>;
}

export function TaskModal({
  task,
  isOpen,
  onClose,
  onUpdate,
  onDelete,
}: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDesc, setEditDesc] = useState(task.description || "");
  const [editStatus, setEditStatus] = useState<TaskStatus>(task.status);
  const [editPriority, setEditPriority] = useState<TaskPriority>(task.priority);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [descriptionHtml, setDescriptionHtml] = useState("");

  useEffect(() => {
    const parseMarkdown = async () => {
      const html = await marked.parse(
        task.description || "_No description provided._",
      );
      setDescriptionHtml(html as string);
    };
    parseMarkdown();
  }, [task.description]);

  const handleSave = async () => {
    setIsLoading(true);
    const success = await updateTask({
      taskId: task.id,
      updates: {
        title: editTitle,
        description: editDesc,
        status: editStatus,
        priority: editPriority,
      },
      onSuccess: () => {
        onUpdate?.({
          ...task,
          title: editTitle,
          description: editDesc,
          status: editStatus,
          priority: editPriority,
        });
        onClose();
      },
    });
    setIsLoading(false);
    if (success) {
      setIsEditing(false);
    }
  };

  const handleDelete = async () => {
    await deleteTask({
      taskId: task.id,
      onSuccess: () => {
        onDelete?.();
        onClose();
      },
    });
  };

  const priorityOptions: {
    value: TaskPriority;
    label: string;
    color: string;
  }[] = [
    { value: "low", label: "Low", color: "text-theme-subtext" },
    { value: "medium", label: "Medium", color: "text-theme-primary" },
    { value: "high", label: "High", color: "text-theme-priority-high" },
  ];

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={isEditing ? "Edit Task" : "Task Details"}
        size="lg"
      >
        <div className="space-y-6">
          {isEditing ? (
            /* Edit Mode */
            <div
              className="space-y-6"
              onKeyDown={(e) => {
                e.stopPropagation();
              }}
              onBlur={(e) => {
                e.stopPropagation();
              }}
            >
              {/* Title */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-theme-text">
                  Title
                </label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  onKeyDown={(e) => {
                    e.stopPropagation();
                  }}
                  onBlur={(e) => {
                    e.stopPropagation();
                  }}
                  className="w-full px-4 py-3 rounded-xl bg-theme-surface-0/50 border border-theme-surface-2 text-theme-text outline-none focus:border-theme-primary focus:glow-hover transition-all"
                  autoFocus
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-theme-text">
                  Description
                </label>
                <textarea
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  onKeyDown={(e) => e.stopPropagation()}
                  onBlur={(e) => e.stopPropagation()}
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl bg-theme-surface-0/50 border border-theme-surface-2 text-theme-text outline-none focus:border-theme-primary focus:glow-hover transition-all resize-none"
                />
              </div>

              {/* Status */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-theme-text">
                  Status
                </label>
                <div className="flex gap-2">
                  {statusOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setEditStatus(option.value)}
                      className={`flex-1 px-3 py-2.5 rounded-xl text-sm font-medium border transition-all ${
                        editStatus === option.value
                          ? `${option.color} bg-current/10 border-current`
                          : "text-theme-subtext border-theme-surface-2 hover:border-theme-surface-1"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Priority */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-theme-text">
                  Priority
                </label>
                <div className="flex gap-2">
                  {priorityOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setEditPriority(option.value)}
                      className={`flex-1 px-3 py-2.5 rounded-xl text-sm font-medium border transition-all ${
                        editPriority === option.value
                          ? `${option.color} bg-current/10 border-current`
                          : "text-theme-subtext border-theme-surface-2 hover:border-theme-surface-1"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t border-theme-surface-2">
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-6 py-3 rounded-xl text-sm font-medium text-theme-subtext hover:text-theme-text hover:bg-theme-surface-1 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={isLoading || !editTitle.trim()}
                  className="px-6 py-3 rounded-xl text-sm font-medium bg-theme-primary text-theme-surface-0 hover:bg-theme-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {isLoading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          ) : (
            /* View Mode */
            <div className="space-y-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-theme-text mb-4">
                    {task.title}
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {statusOptions.map((option) => (
                      <span
                        key={option.value}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium ${
                          task.status === option.value
                            ? `${option.color} bg-current/10 border border-current`
                            : "text-theme-subtext/50"
                        }`}
                      >
                        {option.label}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex-1 sm:flex-none px-4 py-2 rounded-xl text-sm font-medium bg-theme-surface-1 text-theme-text border border-theme-surface-2 hover:border-theme-primary hover:glow-hover transition-all"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setIsConfirmDeleteOpen(true)}
                    className="flex-1 sm:flex-none px-4 py-2 rounded-xl text-sm font-medium text-theme-priority-high hover:bg-theme-priority-high/10 transition-all"
                  >
                    Delete
                  </button>
                </div>
              </div>

              {/* Priority Badge */}
              <div className="flex items-center gap-3">
                <span className="text-sm text-theme-subtext">Priority:</span>
                <span
                  className={`px-3 py-1 rounded-lg text-sm font-medium ${
                    task.priority === "high"
                      ? "bg-theme-priority-high/20 text-theme-priority-high"
                      : task.priority === "medium"
                        ? "bg-theme-primary/20 text-theme-primary"
                        : "bg-theme-surface-2/50 text-theme-subtext"
                  }`}
                >
                  {task.priority.charAt(0).toUpperCase() +
                    task.priority.slice(1)}
                </span>
              </div>

              {/* Description */}
              {task.description && (
                <div className="border-t border-theme-surface-2/50 pt-6">
                  <h3 className="text-sm font-medium text-theme-text mb-3">
                    Description
                  </h3>
                  <div
                    className="prose prose-invert prose-sm max-w-none text-theme-subtext"
                    dangerouslySetInnerHTML={{ __html: descriptionHtml }}
                  />
                </div>
              )}

              {/* Metadata */}
              <div className="border-t border-theme-surface-2/50 pt-4 flex flex-wrap gap-4 text-xs text-theme-subtext/60">
                <span>
                  Created: {new Date(task.created_at).toLocaleDateString()}
                </span>
                <span>Sort Order: {task.sort_order}</span>
              </div>
            </div>
          )}
        </div>
      </Modal>

      <ConfirmModal
        isOpen={isConfirmDeleteOpen}
        onClose={() => setIsConfirmDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Delete Task"
        message={`Are you sure you want to delete "${task.title}"? This action cannot be undone.`}
        variant="danger"
        confirmText="Delete"
      />
    </>
  );
}
