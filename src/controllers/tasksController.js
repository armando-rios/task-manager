import cD from '../utils/createDocument.js'
import { taskService } from '../services/taskService.js'

export const tasksController = {
  activeProjectId: null,
  renderTasks(project) {
    this.activeProjectId = project._id
    const container = document.querySelector('#tasks-section')
    if (!container) return

    const tasksContainer = cD({
      tagName: 'div',
      styles: 'bg-theme-surface-1 p-8 flex-1 h-full flex flex-col',
      id: 'tasks-list',
    })

    container.innerHTML = ''
    const heading = cD({
      tagName: 'h2',
      styles: 'text-2xl font-bold mb-4',
      textContent: project.name,
    })

    container.append(heading, tasksContainer)

    this.renderList()
  },

  async renderList() {
    const container = document.querySelector('#tasks-list')
    if (!container) return

    container.innerHTML = ''

    try {
      const tasks = await taskService.getAll()

      const projectTasks = tasks.filter(
        (task) => task.projectId === this.activeProjectId
      )

      if (projectTasks.length === 0) {
        const emptyState = cD({
          tagName: 'p',
          styles: 'text-theme-text-2',
          textContent: 'No tasks found for this project.',
        })
        container.appendChild(emptyState)
        return
      }

      projectTasks.forEach((task) => {
        const taskElement = cD({
          tagName: 'div',
          styles: 'p-4 mb-2 bg-theme-surface-2 rounded-lg',
          textContent: task.title,
        })
        container.appendChild(taskElement)
      })
    } catch (error) {
      console.error('Error loading tasks:', error)
      this._renderErrorState(container)
    }
  },

  _renderErrorState(container) {
    const errorState = cD({
      tagName: 'p',
      styles: 'text-theme-error',
      textContent: 'An error occurred while loading tasks.',
    })
    container.appendChild(errorState)
  },
}
