import React, { useState, useEffect, useRef } from "react";
import * as dndCore from "@dnd-kit/core";
import * as dndSortable from "@dnd-kit/sortable";
import { actions } from "astro:actions";
import { showToast } from "@shared/lib/toast";
import { useStore } from "@nanostores/react";
import { useCreateTask } from "@shared/lib/hooks";
import { $tasks } from "@shared/lib/stores/appStore";
import type { Task } from "../types";
import { TaskItem } from "./Task/TaskItem";
import { TaskModal } from "./Task/TaskModal";
import type { TaskStatus } from "../types";

const {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  defaultDropAnimationSideEffects,
} = dndCore;

const {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} = dndSortable;

interface Props {
  initialTasks: Task[];
  projectId: string;
}

export function ListView({ initialTasks, projectId }: Props) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [quickAddTitle, setQuickAddTitle] = useState("");
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const quickAddRef = useRef<HTMLInputElement>(null);

  // Subscribe to tasks store
  const tasksFromStore = useStore($tasks);

  // Optimistic task creation hook
  const createTask = useCreateTask();

  useEffect(() => {
    const currentMap = $tasks.get();
    const storeTasks = currentMap.get(projectId);

    // CRITICAL: Initialize store with initial tasks if not already present
    if (!currentMap.has(projectId) && initialTasks.length > 0) {
      const newMap = new Map(currentMap);
      newMap.set(projectId, initialTasks);
      $tasks.set(newMap);

      // Update counts for initial tasks
      const sorted = [...initialTasks].sort(
        (a, b) => (a.sort_order || 0) - (b.sort_order || 0),
      );
      setTasks(sorted);
      return; // Exit - effect will re-run with updated store
    }

    // Use store data (now includes initial tasks after initialization)
    if (storeTasks) {
      const sorted = [...storeTasks].sort(
        (a, b) => (a.sort_order || 0) - (b.sort_order || 0),
      );
      setTasks(sorted);
    }
  }, [tasksFromStore, projectId, initialTasks]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleQuickAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickAddTitle.trim()) return;

    const title = quickAddTitle;
    setQuickAddTitle(""); // Clear immediately

    await createTask(
      {
        title,
        project_id: projectId,
      },
      { insertAt: "end" },
    );
  };

  const handleDragStart = (event: any) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = async (event: any) => {
    const { active, over } = event;
    setActiveId(null);

    if (over && active.id !== over.id) {
      const oldIndex = tasks.findIndex((t) => t.id === active.id);
      const newIndex = tasks.findIndex((t) => t.id === over.id);

      const newTasks = arrayMove(tasks, oldIndex, newIndex);
      setTasks(newTasks);

      const { error } = await actions.tasks.update({
        id: active.id as string,
        sort_order: newIndex,
      });

      if (error) {
        showToast.error("Failed to update task order");
        setTasks(tasks);
      } else {
        showToast.success("Task order updated");
      }
    }
  };

  const handleDelete = (taskId: string) => {
    // TaskItem already calls deleteTask, just update local state
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  };

  const activeTask = activeId ? tasks.find((t) => t.id === activeId) : null;

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="glass-panel rounded-xl p-4 h-full flex flex-col gap-4 w-full">
          {/* Quick Add */}
          <form onSubmit={handleQuickAdd} className="flex gap-3 shrink-0">
            <input
              ref={quickAddRef}
              type="text"
              value={quickAddTitle}
              onChange={(e) => setQuickAddTitle(e.target.value)}
              placeholder="Quick add a task..."
              className="flex-1 px-4 py-3 bg-theme-surface-0/50 border border-theme-surface-2/50 rounded-xl text-sm text-theme-text placeholder:text-theme-muted/50 outline-none focus:border-theme-primary/50 transition-all min-h-[48px]"
            />
            <button
              type="submit"
              disabled={!quickAddTitle.trim()}
              className="px-5 py-3 bg-theme-primary text-theme-crust rounded-xl text-sm font-bold transition-all disabled:opacity-30 disabled:cursor-not-allowed min-h-[48px] flex items-center justify-center gap-2"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path d="M12 4v16m-8-8h16" strokeLinecap="round" />
              </svg>
              Add
            </button>
          </form>

          {/* Task List */}
          {tasks.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="py-12 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-theme-surface-1/50 flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-theme-subtext/40"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                  >
                    <path
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <p className="text-theme-subtext/60 text-sm">No tasks yet</p>
                <p className="text-theme-muted text-xs mt-1">
                  Add your first task above
                </p>
              </div>
            </div>
          ) : (
            <SortableContext
              items={tasks.map((t) => t.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="flex-1 min-h-0 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                {tasks.map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onDelete={handleDelete}
                    onOpenModal={() => setSelectedTask(task)}
                  />
                ))}
              </div>
            </SortableContext>
          )}
        </div>

        <DragOverlay
          dropAnimation={{
            sideEffects: defaultDropAnimationSideEffects({
              styles: {
                active: { opacity: "0.5" },
              },
            }),
          }}
        >
          {activeTask ? (
            <div className="glass-panel rounded-xl p-4 shadow-2xl opacity-90 cursor-grabbing w-full glow-border">
              <h4 className="font-semibold text-theme-text">
                {activeTask.title}
              </h4>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {selectedTask && (
        <TaskModal
          task={selectedTask}
          isOpen={true}
          onClose={() => setSelectedTask(null)}
          onUpdate={async (updates) => {
            setTasks((prev) =>
              prev.map((t) => (t.id === updates.id ? { ...t, ...updates } : t)),
            );
          }}
          onDelete={async () => {
            setTasks((prev) => prev.filter((t) => t.id !== selectedTask.id));
          }}
        />
      )}
    </>
  );
}
