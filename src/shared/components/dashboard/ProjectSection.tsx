import { useEffect } from "react";
import { useStore } from "@nanostores/react";
import { $projects, setProjects } from "@shared/lib/stores/appStore";
import type { Project } from "@features/projects/types";
import { DeleteProjectButton } from "./DeleteProjectButton";

interface Props {
  initialProjects: Project[];
}

function timeAgo(dateStr?: string): string {
  if (!dateStr) return "Just now";
  const date = new Date(dateStr);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (seconds < 60) return "Just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function ProjectSection({ initialProjects }: Props) {
  const projects = useStore($projects);

  // Initialize store once with SSR data
  useEffect(() => {
    setProjects(initialProjects);
  }, [initialProjects]);

  // Always use store data after initialization
  // If store is empty, show empty state (not initialProjects)
  const displayProjects = projects;

  return (
    <section className="flex-1 min-h-0 flex flex-col overflow-hidden">
      <div className="flex items-center justify-between mb-4 shrink-0">
        <h2 className="text-lg font-semibold text-theme-text">Projects</h2>
        <span className="text-sm text-theme-subtext">
          {displayProjects.length} projects
        </span>
      </div>

      {displayProjects.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="glass-panel rounded-xl p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-theme-surface-1/50 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-theme-subtext/40"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
              </svg>
            </div>
            <p className="text-theme-subtext/60 text-sm mb-2">
              No projects yet
            </p>
            <p className="text-theme-subtext/40 text-xs">
              Create your first project to get started
            </p>
          </div>
        </div>
      ) : (
        <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar pr-2">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

interface ProjectCardProps {
  project: Project;
}

function ProjectCard({ project }: ProjectCardProps) {
  const {
    id,
    title,
    taskCount,
    completedCount = 0,
    progress = 0,
    created_at,
  } = project;

  const displayProgress = Math.min(Math.max(progress, 0), 100);

  return (
    <div className="relative group">
      <a
        href={`/dashboard/projects/${id}`}
        className="block glass-panel rounded-lg p-3 hover:glow-border transition-all duration-300 overflow-hidden"
      >
        {/* Background Glow Effect */}
        <div className="absolute -top-16 -right-16 w-32 h-32 bg-theme-primary/5 rounded-full blur-2xl group-hover:bg-theme-primary/10 transition-all duration-500 pointer-events-none" />

        {/* Header */}
        <header className="flex items-start justify-between mb-2 relative z-10">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-theme-primary/20 to-theme-secondary/20 flex items-center justify-center border border-theme-primary/20">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-3.5 h-3.5 text-theme-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-base font-semibold text-theme-text group-hover:text-theme-primary transition-colors leading-tight line-clamp-1">
                {title}
              </h3>
              <span className="text-[9px] text-theme-muted uppercase tracking-wider font-medium">
                ID: {id.slice(0, 6)}
              </span>
            </div>
          </div>
        </header>

        {/* Progress Bar */}
        <div className="mb-3 relative z-10">
          <div className="flex justify-between text-[10px] text-theme-subtext mb-1.5">
            <span className="flex items-center gap-1 font-medium">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-3 h-3 text-theme-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {completedCount}/{taskCount}
            </span>
            <span className="text-theme-primary font-semibold">
              {displayProgress}%
            </span>
          </div>
          <div className="h-1.5 bg-theme-surface-1 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-theme-primary to-theme-secondary transition-all duration-500 ease-out relative"
              style={{ width: `${displayProgress}%` }}
            >
              {/* Glow effect on progress bar */}
              <div className="absolute inset-0 bg-gradient-to-r from-theme-primary to-theme-secondary rounded-full animate-glow-pulse opacity-50" />
            </div>
          </div>
        </div>

        {/* Footer Stats */}
        <footer className="flex items-center justify-between text-[10px] text-theme-subtext relative z-10 pt-2 border-t border-theme-surface-1/50">
          <span className="flex items-center gap-1 font-medium">
            {timeAgo(created_at)}
          </span>
        </footer>
      </a>

      {/* Action buttons - positioned absolutely OUTSIDE the link */}
      <div className="absolute top-3 right-3 flex gap-0.5 opacity-0 group-hover:opacity-100 md:opacity-0 transition-opacity duration-200 z-20">
        <button
          className="p-1.5 rounded-lg hover:bg-theme-surface-1 text-theme-subtext hover:text-theme-primary transition-all min-w-[28px] min-h-[28px] flex items-center justify-center"
          title="Edit Project"
          data-action="edit"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-3.5 h-3.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
        </button>
        <DeleteProjectButton projectId={id} projectTitle={title} />
      </div>
    </div>
  );
}
