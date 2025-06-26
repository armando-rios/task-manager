import { projectService } from '../services/projectService.js'

/**
 * Render projects list
 * @param {Array|null} projects - Optional projects array. If null, fetches from API
 * @param {string|null} activeProjectId - ID of currently active project
 */
export const renderProjects = async (
  projects = null,
  activeProjectId = null
) => {
  const projectsList = document.querySelector('#projects')
  projectsList.innerHTML = ''

  try {
    // If no projects provided, fetch from API
    const projectsToRender = projects || (await projectService.getAll())

    projectsToRender.forEach((project) => {
      const projectItem = document.createElement('button')

      projectItem.className =
        'px-4 py-1.5 text-theme-primary rounded hover:bg-theme-surface-2 cursor-pointer text-start'

      if (activeProjectId && project._id === activeProjectId) {
        projectItem.classList.add('bg-theme-surface-2')
      } else {
        projectItem.classList.add('bg-transparent')
      }

      // MongoDB usa _id en lugar de id
      projectItem.id = project._id || project.id
      projectItem.setAttribute('data-task-id', project._id || project.id)
      projectItem.textContent = project.name
      projectsList.appendChild(projectItem)
    })
  } catch (error) {
    console.error('Error rendering projects:', error)
    projectsList.innerHTML =
      "<p class='px-4 py-2 text-red-500'>Error loading projects</p>"
  }
}
