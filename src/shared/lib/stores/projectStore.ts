/**
 * Project Store
 * Manages project state and operations
 * @module stores/projectStore
 */

import { atom } from "nanostores";
import type { Project } from "../../../features/projects/types";

// === ENTITY STORES ===

/** All projects */
export const $projects = atom<Project[]>([]);

/** Currently active/selected project ID */
export const $activeProjectId = atom<string | null>(null);

// === STORE SETTERS ===

/** Initialize projects store with fetched data */
export function setProjects(projects: Project[]): void {
  $projects.set(projects);
}

/** Update a single project in the store */
export function updateProjectInStore(
  updatedProject: Partial<Project> & { id: string },
): void {
  const current = $projects.get();
  const index = current.findIndex((p) => p.id === updatedProject.id);

  if (index !== -1) {
    const newProjects = [...current];
    newProjects[index] = { ...current[index], ...updatedProject };
    $projects.set(newProjects);
  }
}

/** Add a new project to the store */
export function addProjectToStore(project: Project): void {
  const current = $projects.get();
  $projects.set([project, ...current]);
}

/** Remove a project from the store */
export function removeProjectFromStore(projectId: string): void {
  const current = $projects.get();
  $projects.set(current.filter((p) => p.id !== projectId));
}

/** Set the active project ID */
export function setActiveProjectId(id: string | null): void {
  $activeProjectId.set(id);
}
