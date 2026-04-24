import { useState, useEffect, useRef } from "react";
import { useStore } from "@nanostores/react";
import { ViewToggle } from "./ViewToggle";
import { CreateTaskModal } from "./CreateTaskModal";
import { ConfirmModal } from "@shared/components/ui/ConfirmModal";
import { useInlineEdit, useDeleteProject } from "@shared/lib/hooks";
import { $projects, $tasks } from "@shared/lib/stores/appStore";
import { navigate } from "astro:transitions/client";

interface Project {
  id: string;
  title: string;
  description?: string | null;
}

interface Props {
  project: Project;
  view: "list" | "kanban";
  initialTodoCount: number;
  initialInProgressCount: number;
  initialDoneCount: number;
}

// Hook for counting animation - only runs once on mount
function useCountAnimation(endValue: number, duration: number = 800) {
  const [displayValue, setDisplayValue] = useState(0);
  const hasAnimatedRef = useRef(false);

  useEffect(() => {
    // After first animation, just update directly
    if (hasAnimatedRef.current) {
      setDisplayValue(endValue);
      return;
    }

    if (endValue === 0) {
      setDisplayValue(0);
      return;
    }

    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentValue = Math.round(endValue * easeOut);

      setDisplayValue(currentValue);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        hasAnimatedRef.current = true;
      }
    };

    requestAnimationFrame(animate);
  }, [endValue, duration]);

  return displayValue;
}

export function ProjectHeader({
  project,
  view,
  initialTodoCount,
  initialInProgressCount,
  initialDoneCount,
}: Props) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const projects = useStore($projects);

  // Get current project from store (updated) or fall back to props (initial)
  const currentProject = projects.find((p) => p.id === project.id) || project;

  // Inline edit hook for optimistic updates
  const { edit, cancel } = useInlineEdit();

  // Delete project hook
  const deleteProject = useDeleteProject();

  // Subscribe to tasks store for dynamic counts
  const tasksFromStore = useStore($tasks);

  // Get tasks for current project
  const projectTasks = tasksFromStore.get(project.id) || [];

  // Calculate counts dynamically from store
  const todoCount = projectTasks.filter((t) => t.status === "todo").length;
  const inProgressCount = projectTasks.filter(
    (t) => t.status === "in-progress",
  ).length;
  const doneCount = projectTasks.filter((t) => t.status === "done").length;

  // Use store counts if available, fall back to initial props
  const displayTodo = projectTasks.length > 0 ? todoCount : initialTodoCount;
  const displayInProgress =
    projectTasks.length > 0 ? inProgressCount : initialInProgressCount;
  const displayDone = projectTasks.length > 0 ? doneCount : initialDoneCount;

  // Animated counts
  const animatedTodo = useCountAnimation(displayTodo);
  const animatedInProgress = useCountAnimation(displayInProgress);
  const animatedDone = useCountAnimation(displayDone);

  const handleViewChange = (newView: "list" | "kanban") => {
    const url = new URL(window.location.href);
    url.searchParams.set("view", newView);
    window.location.href = url.toString();
  };

  const handleBlur = (el: HTMLElement, field: "title" | "description") => {
    const newValue = el.innerText.trim();
    if (newValue !== currentProject[field]) {
      edit(
        currentProject.id,
        field,
        newValue,
        currentProject as unknown as Record<string, unknown>,
      );
    }
  };

  const handleDeleteProject = async () => {
    setIsDeleting(true);
    const result = await deleteProject(currentProject.id);
    setIsDeleting(false);

    if (result.success) {
      navigate("/dashboard");
    }
    setIsDeleteModalOpen(false);
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h1
            contentEditable
            suppressContentEditableWarning
            spellCheck={false}
            onBlur={(e) => handleBlur(e.currentTarget, "title")}
            onKeyDown={(e) => {
              if (e.key === "Enter") e.currentTarget.blur();
              if (e.key === "Escape") {
                e.currentTarget.innerText = currentProject.title;
                cancel();
              }
            }}
            className="text-2xl md:text-3xl font-bold text-theme-text cursor-default focus:cursor-text no-focus-style"
          >
            {currentProject.title}
          </h1>

          <p
            contentEditable
            suppressContentEditableWarning
            spellCheck={false}
            onBlur={(e) => handleBlur(e.currentTarget, "description")}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                e.currentTarget.blur();
              }
              if (e.key === "Escape") {
                e.currentTarget.innerText = currentProject.description || "";
                cancel();
              }
            }}
            className={`text-sm md:text-base mt-1 cursor-default focus:cursor-text no-focus-style ${
              currentProject.description
                ? "text-theme-subtext"
                : "text-theme-muted italic"
            }`}
          >
            {currentProject.description || "Add a description..."}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsDeleteModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-theme-priority-high hover:bg-theme-priority-high/10 transition-all"
            title="Delete project"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
              />
            </svg>
            <span className="hidden sm:inline">Delete</span>
          </button>
          <ViewToggle view={view} onViewChange={handleViewChange} />
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-theme-primary text-theme-surface-0 font-medium text-sm hover:bg-theme-primary/90 transition-all glow-hover"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={2}
            >
              <path
                d="M12 4v16m-8-8h16"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="hidden sm:inline">New Task</span>
          </button>
        </div>
      </div>

      {/* Task Stats */}
      <section className="grid grid-cols-3 gap-3 md:gap-4 mt-6">
        <div className="glass-panel rounded-xl p-4 text-center">
          <div className="text-2xl md:text-3xl font-bold text-theme-text">
            {animatedTodo}
          </div>
          <div className="text-xs md:text-sm text-theme-subtext">To Do</div>
        </div>
        <div className="glass-panel rounded-xl p-4 text-center border-theme-primary/30">
          <div className="text-2xl md:text-3xl font-bold text-theme-primary">
            {animatedInProgress}
          </div>
          <div className="text-xs md:text-sm text-theme-primary">
            In Progress
          </div>
        </div>
        <div className="glass-panel rounded-xl p-4 text-center">
          <div className="text-2xl md:text-3xl font-bold text-theme-green">
            {animatedDone}
          </div>
          <div className="text-xs md:text-sm text-theme-green">Done</div>
        </div>
      </section>

      <CreateTaskModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        projectId={currentProject.id}
      />

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteProject}
        title="Delete Project"
        message={`Are you sure you want to delete "${currentProject.title}"? This will also delete all tasks within the project. This action cannot be undone.`}
        variant="danger"
        confirmText="Delete Project"
        isLoading={isDeleting}
      />
    </>
  );
}
