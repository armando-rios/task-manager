import { projectService } from '../services/projectService.js'
import cD from '../utils/createDocument.js'

/**
 * Controller for managing projects
 */
export const projectsController = {
  activeProjectId: null,

  /**
   * Render the list of projects
   */
  async renderList() {
    const container = document.querySelector('#projects-list')
    if (!container) {
      console.error('Projects container not found')
      return
    }

    container.innerHTML = ''

    try {
      const projects = await projectService.getAll()

      if (projects.length === 0) {
        this._renderEmptyState(container)
        return
      }

      projects.forEach((project) => {
        const projectElement = this._createProjectElement(project)
        container.appendChild(projectElement)
      })
    } catch (error) {
      console.error('Error loading projects:', error)
      this._renderErrorState(container)
    }
  },

  /**
   * Create a project DOM element
   * @param {Object} project - Project data
   * @returns {HTMLElement} Project DOM element
   */
  _createProjectElement(project) {
    const isActive = this.activeProjectId === project._id

    const projectElement = cD({
      tagName: 'button',
      styles: `px-3 py-2 rounded-lg cursor-pointer transition-colors text-start
w-full
        ${isActive ? 'bg-theme-surface-2 text-theme-primary' : 'text-theme-text-2 hover:bg-theme-surface-2'}`,
      textContent: project.name,
    })

    // Add data attribute
    projectElement.dataset.projectId = project._id

    projectElement.addEventListener('click', () => {
      this.selectProject(project._id)
    })

    return projectElement
  },

  /**
   * Select a project
   * @param {string} projectId - ID of the project to select
   */
  async selectProject(projectId) {
    this.activeProjectId = projectId

    // Re-render the projects list
    await this.renderList()

    // Here we emit an event to notify other parts of the app about the selected project
    // Example: to load tasks for the selected project

    // Emit event with projectId detail
    document.dispatchEvent(
      new CustomEvent('projectSelected', {
        detail: { projectId },
      })
    )
  },

  /**
   * Create a new project
   */
  async createProject(projectData) {
    try {
      const newProject = await projectService.create(projectData)

      // Re-render the projects list
      await this.renderList()

      // Select the newly created project
      await this.selectProject(newProject._id)

      return newProject
    } catch (error) {
      console.error('Error creating project:', error)
      throw error
    }
  },

  /**
   * Delete a project
   * @param {string} projectId - ID of the project to delete
   */
  async deleteProject(projectId) {
    try {
      await projectService.delete(projectId)

      // if the deleted project was active, clear selection
      if (this.activeProjectId === projectId) {
        this.activeProjectId = null
        // Emitir evento para limpiar tareas
        document.dispatchEvent(new CustomEvent('projectDeselected'))
      }

      await this.renderList()
    } catch (error) {
      console.error('Error deleting project:', error)
      throw error
    }
  },

  /**
   * Empty state rendering
   * @param {HTMLElement} container
   */
  _renderEmptyState(container) {
    const emptyState = cD({
      tagName: 'p',
      styles: 'px-3 py-4 text-center text-theme-text-1 text-sm',
      textContent: 'No hay proyectos aún. ¡Crea tu primer proyecto!',
    })
    container.appendChild(emptyState)
  },

  /**
   * Error state rendering
   * @param {HTMLElement} container
   */
  _renderErrorState(container) {
    const errorState = cD({
      tagName: 'p',
      styles: 'px-3 py-4 text-center text-red-500 text-sm',
      textContent: 'Error al cargar proyectos',
    })
    container.appendChild(errorState)
  },
}
