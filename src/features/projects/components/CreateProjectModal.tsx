import React, { useState, useEffect, useCallback } from "react";
import { Modal } from "@shared/components/ui/Modal";
import { showToast } from "@shared/lib/toast";
import { navigate } from "astro:transitions/client";
import { useCreateProject } from "@shared/lib/hooks";

interface CreateProjectResult {
  success: boolean;
  project?: {
    id: string;
    title: string;
    description?: string | null;
    created_at: string;
    updated_at: string;
  };
}

interface CreateProjectModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  onSuccess?: (project: CreateProjectResult["project"]) => void;
}

const ACCENT_COLORS = [
  { name: "Pink", value: "pink", hex: "#f5c2e7" },
  { name: "Red", value: "red", hex: "#f38ba8" },
  { name: "Mauve", value: "mauve", hex: "#cba6f7" },
  { name: "Blue", value: "blue", hex: "#89b4fa" },
  { name: "Teal", value: "teal", hex: "#94e2d5" },
  { name: "Green", value: "green", hex: "#a6e3a1" },
  { name: "Yellow", value: "yellow", hex: "#f9e2af" },
  { name: "Peach", value: "peach", hex: "#fab387" },
];

export function CreateProjectModal({
  isOpen: initialIsOpen = false,
  onClose: externalOnClose,
  onSuccess,
}: CreateProjectModalProps) {
  const [isOpen, setIsOpen] = useState(initialIsOpen);
  const [errors, setErrors] = useState<{
    title?: string;
    description?: string;
  }>({});

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [accentColor, setAccentColor] = useState("pink");

  // Optimistic project creation hook
  const createProject = useCreateProject();

  // Listen for custom event to open modal
  useEffect(() => {
    const handleOpenModal = () => setIsOpen(true);
    document.addEventListener("open-create-project-modal", handleOpenModal);
    return () =>
      document.removeEventListener(
        "open-create-project-modal",
        handleOpenModal,
      );
  }, []);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setTitle("");
      setDescription("");
      setAccentColor("pink");
      setErrors({});
    }
  }, [isOpen]);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    externalOnClose?.();
  }, [externalOnClose]);

  const validateForm = (): boolean => {
    const newErrors: { title?: string; description?: string } = {};

    if (!title.trim()) {
      newErrors.title = "Project name is required";
    } else if (title.trim().length > 50) {
      newErrors.title = "Project name must be less than 50 characters";
    }

    if (description && description.length > 200) {
      newErrors.description = "Description must be less than 200 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    // Close modal immediately for optimistic UX
    handleClose();

    // Optimistic creation
    const result = await createProject({
      title: title.trim(),
      description: description.trim() || undefined,
    });

    if (result.success && result.project) {
      // Call success callback if provided
      onSuccess?.(result.project);
      // Navigate to the new project
      navigate(`/dashboard/projects/${result.project.id}`);
    }
  };

  // Handle keyboard submit
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (
      e.key === "Enter" &&
      !e.shiftKey &&
      (e.target as HTMLElement).tagName !== "TEXTAREA"
    ) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Create New Project"
      size="md"
    >
      <form
        onSubmit={handleSubmit}
        onKeyDown={handleKeyDown}
        className="space-y-6"
      >
        {/* Project Name */}
        <div className="space-y-2">
          <label
            htmlFor="project-title"
            className="block text-sm font-medium text-theme-text"
          >
            Project Name <span className="text-theme-error">*</span>
          </label>
          <input
            id="project-title"
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (errors.title) setErrors({ ...errors, title: undefined });
            }}
            placeholder="Enter project name"
            className={`
              w-full px-4 py-3 bg-theme-mantle border rounded-xl text-theme-text
              placeholder:text-theme-muted transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-theme-base
              ${
                errors.title
                  ? "border-theme-error focus:border-theme-error focus:ring-theme-error/30"
                  : "border-theme-surface-1 focus:border-theme-primary focus:ring-theme-primary/30"
              }
            `}
            autoFocus
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
            {title.length}/50 characters
          </p>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label
            htmlFor="project-description"
            className="block text-sm font-medium text-theme-text"
          >
            Description{" "}
            <span className="text-theme-muted text-xs">(optional)</span>
          </label>
          <textarea
            id="project-description"
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              if (errors.description)
                setErrors({ ...errors, description: undefined });
            }}
            placeholder="Brief description of your project"
            rows={3}
            className={`
              w-full px-4 py-3 bg-theme-mantle border rounded-xl text-theme-text
              placeholder:text-theme-muted transition-all duration-200 resize-none
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-theme-base
              ${
                errors.description
                  ? "border-theme-error focus:border-theme-error focus:ring-theme-error/30"
                  : "border-theme-surface-1 focus:border-theme-primary focus:ring-theme-primary/30"
              }
            `}
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
            {description.length}/200 characters
          </p>
        </div>

        {/* Accent Color */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-theme-text">
            Accent Color
          </label>
          <div className="flex flex-wrap gap-2">
            {ACCENT_COLORS.map((color) => (
              <button
                key={color.value}
                type="button"
                onClick={() => setAccentColor(color.value)}
                className={`
                  w-10 h-10 rounded-lg border-2 transition-all duration-200
                  flex items-center justify-center
                  ${
                    accentColor === color.value
                      ? "border-theme-text scale-110 shadow-lg"
                      : "border-theme-surface-1 hover:border-theme-surface-2 hover:scale-105"
                  }
                `}
                style={{
                  backgroundColor: color.hex,
                  opacity: accentColor === color.value ? 1 : 0.7,
                }}
                title={color.name}
              >
                {accentColor === color.value && (
                  <svg
                    className="w-5 h-5 text-theme-crust"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </button>
            ))}
          </div>
          <p className="text-[10px] text-theme-muted">
            Selected:{" "}
            <span className="text-theme-primary capitalize">{accentColor}</span>
          </p>
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-theme-surface-1/50">
          <button
            type="button"
            onClick={handleClose}
            className="px-5 py-2.5 text-sm font-medium text-theme-subtext hover:text-theme-text transition-colors rounded-lg hover:bg-theme-surface-0"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-theme-primary text-theme-crust font-semibold text-sm rounded-xl hover:brightness-110 active:scale-[0.98] transition-all shadow-lg shadow-theme-primary/20 min-h-[44px]"
          >
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
            Create Project
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default CreateProjectModal;
