import { projectService } from '../services/projectService.js'
import cD from '../utils/createDocument.js'
import { tasksController } from './tasksController.js'
import { ProjectSkeleton } from '../components/dashboard/ProjectSkeleton.js'

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
    if (!container) return

    // Show skeleton loaders while loading
    container.innerHTML = ''
    this._renderSkeletons(container, 3)

    try {
      const projects = await projectService.getAll()

      // Clear skeletons before rendering actual content
      container.innerHTML = ''

      if (projects.length === 0) {
        this._renderEmptyState(container)
        return
      }

      // ✅If no active project, select the first one by default
      if (!this.activeProjectId && projects.length > 0) {
        this.activeProjectId = projects[0]._id
        tasksController.renderTasks(projects[0])
      }

      // Renderizar todos los proyectos (el activo se marcará visualmente)
      projects.forEach((project) => {
        const projectElement = this._createProjectElement(project)
        container.appendChild(projectElement)
      })
    } catch (error) {
      console.error('Error loading projects:', error)
      container.innerHTML = ''
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
      this.selectProject(project)
    })

    return projectElement
  },

  /**
   * Select a project
   * @param {string} projectId - ID of the project to select
   */
  async selectProject(project) {
    const previousProjectId = this.activeProjectId
    this.activeProjectId = project._id

    // Remove active state from previous project
    if (previousProjectId) {
      const prevElement = document.querySelector(
        `[data-project-id="${previousProjectId}"]`
      )
      if (prevElement) {
        // Remove active classes
        prevElement.classList.remove('bg-theme-surface-2', 'text-theme-primary')
      }
    }

    // Add active state to new project
    const currentElement = document.querySelector(
      `[data-project-id="${project._id}"]`
    )
    if (currentElement) {
      currentElement.classList.add('bg-theme-surface-2', 'text-theme-primary')
    }

    tasksController.renderTasks(project)

    document.dispatchEvent(
      new CustomEvent('projectSelected', {
        detail: { projectId: project._id },
      })
    )
  },

  /**
   * Create a new project
   */
  async createProject(projectData) {
    // TODO: change re-render to just append the new project
    try {
      const newProject = await projectService.create(projectData)

      // Re-render the projects list
      await this.renderList()

      // Select the newly created project
      await this.selectProject(newProject)

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

  /**
   * Render skeleton loaders
   * @param {HTMLElement} container
   * @param {number} count - Number of skeletons to render
   */
  _renderSkeletons(container, count = 3) {
    for (let i = 0; i < count; i++) {
      const skeleton = ProjectSkeleton()
      container.appendChild(skeleton)
    }
  },
}
