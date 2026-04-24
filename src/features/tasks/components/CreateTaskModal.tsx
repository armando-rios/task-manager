import { useState, useEffect, useRef } from "react";
import { Modal } from "@shared/components/ui/Modal";
import { showToast } from "@shared/lib/toast";
import { useCreateTask } from "@shared/lib/hooks";
import type { TaskStatus, TaskPriority } from "../types";
import { statusOptions } from "../lib/taskConstants.tsx";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
}

export function CreateTaskModal({ isOpen, onClose, projectId }: Props) {
  const createTask = useCreateTask();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<TaskPriority>("medium");
  const [status, setStatus] = useState<TaskStatus>("todo");
  const [dueDate, setDueDate] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{
    title?: string;
    description?: string;
  }>({});
  const titleInputRef = useRef<HTMLInputElement>(null);

  // Focus on title input when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => titleInputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      resetForm();
    }
  }, [isOpen]);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setPriority("medium");
    setStatus("todo");
    setDueDate("");
    setErrors({});
  };

  const validateForm = (): boolean => {
    const newErrors: { title?: string; description?: string } = {};

    if (!title.trim()) {
      newErrors.title = "Task title is required";
    } else if (title.trim().length > 100) {
      newErrors.title = "Title must be less than 100 characters";
    }

    if (description && description.length > 10000) {
      newErrors.description = "Description must be less than 10000 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || isLoading) return;

    setIsLoading(true);

    try {
      const result = await createTask({
        title: title.trim(),
        project_id: projectId,
        description: description.trim() || undefined,
        priority,
        status,
      });

      if (result.success) {
        onClose();
        resetForm();
      }
    } catch (err) {
      showToast.error("Failed to create task");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Enter key to submit (quick add mode)
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (
      e.key === "Enter" &&
      !e.shiftKey &&
      (e.target as HTMLElement).tagName !== "TEXTAREA"
    ) {
      e.preventDefault();
      handleSubmit(e);
    }
    // Clear title error on change
    if (errors.title) {
      setErrors({ ...errors, title: undefined });
    }
  };

  const priorityOptions: {
    value: TaskPriority;
    label: string;
    color: string;
    bgColor: string;
    borderColor: string;
    icon: string;
  }[] = [
    {
      value: "low",
      label: "Low",
      color: "text-theme-priority-low",
      bgColor: "bg-theme-priority-low/10",
      borderColor: "border-theme-priority-low",
      icon: "↓",
    },
    {
      value: "medium",
      label: "Medium",
      color: "text-theme-priority-medium",
      bgColor: "bg-theme-priority-medium/10",
      borderColor: "border-theme-priority-medium",
      icon: "→",
    },
    {
      value: "high",
      label: "High",
      color: "text-theme-priority-high",
      bgColor: "bg-theme-priority-high/10",
      borderColor: "border-theme-priority-high",
      icon: "↑",
    },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Task"
      size="lg"
      closeOnBackdrop={!isLoading}
      closeOnEsc={!isLoading}
    >
      <form
        onSubmit={handleSubmit}
        onKeyDown={handleKeyDown}
        className="space-y-6"
      >
        {/* Title */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-theme-text">
            Task Title <span className="text-theme-priority-high">*</span>
          </label>
          <input
            ref={titleInputRef}
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (errors.title) setErrors({ ...errors, title: undefined });
            }}
            placeholder="Enter task title..."
            className={`
              w-full px-4 py-3 rounded-xl bg-theme-surface-0/50 border text-theme-text 
              placeholder:text-theme-subtext/50 outline-none transition-all
              min-h-[48px] text-base
              ${
                errors.title
                  ? "border-theme-error focus:border-theme-error focus:ring-2 focus:ring-theme-error/30"
                  : "border-theme-surface-2 focus:border-theme-primary focus:ring-2 focus:ring-theme-primary/30"
              }
              disabled:opacity-50
            `}
            disabled={isLoading}
            autoComplete="off"
          />
          {errors.title && (
            <p className="text-xs text-theme-error flex items-center gap-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              {errors.title}
            </p>
          )}
          <p className="text-[10px] text-theme-muted">
            {title.length}/100 characters • Press Enter to quick add
          </p>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-theme-text">
            Description{" "}
            <span className="text-theme-muted text-xs">(optional)</span>
          </label>
          <textarea
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              if (errors.description)
                setErrors({ ...errors, description: undefined });
            }}
            placeholder="Add task details..."
            rows={3}
            className={`
              w-full px-4 py-3 rounded-xl bg-theme-surface-0/50 border text-theme-text 
              placeholder:text-theme-subtext/50 outline-none transition-all resize-none
              ${
                errors.description
                  ? "border-theme-error focus:border-theme-error focus:ring-2 focus:ring-theme-error/30"
                  : "border-theme-surface-2 focus:border-theme-primary focus:ring-2 focus:ring-theme-primary/30"
              }
              disabled:opacity-50
            `}
            disabled={isLoading}
          />
          {errors.description && (
            <p className="text-xs text-theme-error flex items-center gap-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              {errors.description}
            </p>
          )}
          <p className="text-[10px] text-theme-muted">
            {description.length}/500 characters
          </p>
        </div>

        {/* Priority & Status */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
                  onClick={() => setPriority(option.value)}
                  disabled={isLoading}
                  className={`
                    flex-1 px-3 py-2.5 rounded-xl text-sm font-medium border transition-all
                    min-h-[44px] flex items-center justify-center gap-1.5
                    ${
                      priority === option.value
                        ? `${option.color} ${option.bgColor} border-current`
                        : "text-theme-subtext border-theme-surface-2 hover:border-theme-surface-1 hover:bg-theme-surface-0/50"
                    }
                    disabled:opacity-50 disabled:cursor-not-allowed
                  `}
                >
                  <span className="text-base leading-none">{option.icon}</span>
                  <span>{option.label}</span>
                </button>
              ))}
            </div>
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
                  onClick={() => setStatus(option.value)}
                  disabled={isLoading}
                  className={`
                    flex-1 px-3 py-2.5 rounded-xl text-xs font-semibold border transition-all
                    min-h-[44px] flex items-center justify-center
                    ${
                      status === option.value
                        ? `${option.color} ${option.bg} border-current`
                        : "text-theme-subtext border-theme-surface-2 hover:border-theme-surface-1 hover:bg-theme-surface-0/50"
                    }
                    disabled:opacity-50 disabled:cursor-not-allowed
                  `}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Due Date */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-theme-text">
            Due Date{" "}
            <span className="text-theme-muted text-xs">(optional)</span>
          </label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            disabled={isLoading}
            className={`
              w-full px-4 py-3 rounded-xl bg-theme-surface-0/50 border border-theme-surface-2 
              text-theme-text outline-none transition-all
              focus:border-theme-primary focus:ring-2 focus:ring-theme-primary/30
              disabled:opacity-50 cursor-pointer
              min-h-[48px]
            `}
            style={{
              colorScheme: "dark",
            }}
          />
          {dueDate && (
            <button
              type="button"
              onClick={() => setDueDate("")}
              className="text-[10px] text-theme-muted hover:text-theme-text transition-colors"
            >
              Clear due date
            </button>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4 border-t border-theme-surface-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-6 py-3 rounded-xl text-sm font-medium text-theme-subtext hover:text-theme-text hover:bg-theme-surface-1 transition-all min-h-[48px]"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading || !title.trim()}
            className="px-6 py-3 rounded-xl text-sm font-semibold bg-theme-primary text-theme-crust hover:bg-theme-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-theme-primary/20 min-h-[48px] flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <svg
                  className="w-4 h-4 animate-spin"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Creating...
              </>
            ) : (
              <>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Create Task
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}
