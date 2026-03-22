import { useStore } from "@nanostores/react";
import { useEffect } from "react";
import {
  $projects,
  $activeProjectId,
  setProjects,
  setActiveProjectId,
} from "@shared/lib/stores/appStore";
import type { Project } from "../types";

interface SidebarProjectsProps {
  initialProjects: Project[];
  currentProjectId?: string;
}

export function SidebarProjects({
  initialProjects,
  currentProjectId,
}: SidebarProjectsProps) {
  const projects = useStore($projects);
  const activeId = useStore($activeProjectId);

  // Initialize store once with SSR data
  useEffect(() => {
    setProjects(initialProjects);
    if (currentProjectId) {
      setActiveProjectId(currentProjectId);
    }
  }, [initialProjects, currentProjectId]);

  // Always use store data after initialization
  const displayProjects = projects;

  return (
    <ul className="space-y-0.5">
      {displayProjects.map((project) => {
        const isActive = project.id === (activeId || currentProjectId);
        return (
          <li key={project.id} className="list-none">
            <a
              href={`/dashboard/projects/${project.id}`}
              className={`
                group flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300
                ${
                  isActive
                    ? "bg-theme-surface-0/70 text-theme-primary"
                    : "text-theme-subtext hover:text-theme-text hover:bg-theme-surface-0/50"
                }
              `}
            >
              <span
                className={`
                  text-[10px] font-black transition-colors duration-300 shrink-0
                  ${isActive ? "text-theme-primary" : "text-theme-primary/30 group-hover:text-theme-primary"}
                `}
              >
                ./
              </span>
              <span className="truncate uppercase tracking-wider text-[10px] md:text-xs font-medium">
                {project.title}
              </span>
            </a>
          </li>
        );
      })}
    </ul>
  );
}
