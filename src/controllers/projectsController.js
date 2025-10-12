import { projectService } from '../services/projectService.js'
import { tasksController } from './tasksController.js'
import { ProjectSkeleton } from '../components/dashboard/ProjectSkeleton.js'
import { createProjectListItem } from '../components/dashboard/ProjectListItem.js'
import { ErrorState } from '../components/dashboard/ErrorState.js'
import { EmptyState } from '../components/dashboard/ErrorState.js'

/**
 * Controller for managing projects
 */
export const projectsController = {
  activeProjectId: null,
  projects: [],

  /**
   * Render the list of projects
   */
  async renderList() {
    const container = document.querySelector('#projects-list')
    if (!container) return

    container.innerHTML = ''
    this._renderSkeletons(container, 3)

    try {
      const projects = await projectService.getAll()
      this.projects = projects
      container.innerHTML = ''

      if (projects.length === 0) {
        this._renderEmptyState(container)
        return
      }

      // Renderizamos usando el nuevo método centralizado
      projects.forEach((project) => {
        const projectElement = this._createProjectElement(project)
        container.appendChild(projectElement)
      })

      // AUTO-SELECCIÓN: Si no hay activo, seleccionamos el primero formalmente
      if (!this.activeProjectId && projects.length > 0) {
        this.selectProject(projects[0])
      }
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

  /**
   * Select a project
   * @param {string} projectId - ID of the project to select
   */
  selectProject(project) {
    if (!project || !project._id) return
    if (this.activeProjectId === project._id) return

    const previousProjectId = this.activeProjectId
    this.activeProjectId = project._id

    const activeStyles = ['bg-theme-surface-2', 'text-theme-primary']
    const inactiveStyles = ['text-theme-text-2', 'hover:bg-theme-surface-2']

    // 2. Limpiar el anterior (si existe)
    if (previousProjectId) {
      const prevElement = document.querySelector(
        `[data-project-id="${previousProjectId}"]`
      )
      if (prevElement) {
        prevElement.classList.remove(...activeStyles)
        prevElement.classList.add(...inactiveStyles) // Devolvemos el estilo gris y el hover
      }
    }

    // 3. Activar el nuevo
    const currentElement = document.querySelector(
      `[data-project-id="${project._id}"]`
    )
    if (currentElement) {
      currentElement.classList.add(...activeStyles)
      currentElement.classList.remove(...inactiveStyles) // Quitamos el hover porque ya está activo
    }

    // 4. Lógica de negocio
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
  _createProjectElement(project) {
    return createProjectListItem(
      project,
      this.activeProjectId,
      (id) => this.deleteProject(id),
      (p) => this.selectProject(p)
    )
  },

  async createProject(projectData) {
    try {
      const newProject = await projectService.create(projectData)
      this.projects.push(newProject)

      const container = document.querySelector('#projects-list')

      // Si era el primero, limpiamos el "Empty State"
      if (this.projects.length === 1) container.innerHTML = ''

      // Usamos el método centralizado aquí también
      const projectElement = this._createProjectElement(newProject)
      container.appendChild(projectElement)

      this.selectProject(newProject)
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

      const elementToRemove = document.querySelector(
        `[data-project-id="${projectId}"]`
      )
      if (elementToRemove) elementToRemove.remove()

      // Actualizar la lista local quitando el borrado
      this.projects = this.projects.filter((p) => p._id !== projectId)

      if (this.activeProjectId === projectId) {
        this.activeProjectId = null
        document.dispatchEvent(new CustomEvent('projectDeselected'))

        const firstProjectElement = document.querySelector('[data-project-id]')

        if (firstProjectElement) {
          const nextId = firstProjectElement.dataset.projectId
          // Buscamos el objeto completo para que selectProject no falle
          const nextProject = this.projects.find((p) => p._id === nextId)

          if (nextProject) {
            this.selectProject(nextProject)
          }
        }
      }

      // 3. Verificar si la lista quedó vacía para mostrar el Empty State
      const container = document.querySelector('#projects-list')
      if (container && container.children.length === 0) {
        this._renderEmptyState(container)
      }
    } catch (error) {
      console.error('Error deleting project:', error)
    }
  },

  /**
   * Empty state rendering
   * @param {HTMLElement} container
   */
  _renderEmptyState(container) {
    EmptyState(container)
  },

  /**
   * Error state rendering
   * @param {HTMLElement} container
   */
  _renderErrorState(container) {
    ErrorState(container)
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
