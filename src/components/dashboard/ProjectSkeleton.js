/**
 * ProjectSkeleton component - Loading placeholder for projects
 * @returns {HTMLElement} Skeleton loader element
 */
export const ProjectSkeleton = () => {
  const projectElement = document.createElement('div')
  projectElement.className =
    'px-3 py-2 rounded-lg w-full animate-pulse'

  const textSkeleton = document.createElement('div')
  textSkeleton.className = 'h-5 bg-theme-surface-3 rounded w-3/4'

  projectElement.appendChild(textSkeleton)

  return projectElement
}
