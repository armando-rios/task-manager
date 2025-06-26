import { Task } from '../components/Task.js'
import { initDragDropController } from '../controllers/dragDropController.js'
import { initTasksController } from '../controllers/tasksController.js'
import { taskService } from '../services/taskService.js'

const activeFilters = {
  currentProjectId: null,
  currentFilter: 'all',
}

export const renderTasks = async (projectId) => {
  activeFilters.currentProjectId = projectId
  activeFilters.currentFilter = 'all'

  document.querySelectorAll('#filters [data-filter]').forEach((btn) => {
    btn.classList.remove('bg-theme-surface-2')
  })

  const allFilterBtn = document.querySelector("#filters [data-filter='all']")
  if (allFilterBtn) allFilterBtn.classList.add('bg-theme-surface-2')

  await renderFilteredTasks(projectId, 'all')
}

export const renderFilteredTasks = async (projectId, filterType = 'all') => {
  const tasksList = document.querySelector('#tasks-container')
  if (!tasksList) return

  try {
    // Fetch tasks from API
    const allTasks = await taskService.getAll()

    // Filter by project - MongoDB usa _id
    let filteredTasks = allTasks.filter(
      (task) =>
        task.projectId === projectId || task.projectId?._id === projectId
    )

    // Filter by priority if needed
    if (filterType !== 'all') {
      filteredTasks = filteredTasks.filter(
        (task) => task.priority.toLowerCase() === filterType.toLowerCase()
      )
    }

    activeFilters.currentProjectId = projectId
    activeFilters.currentFilter = filterType

    tasksList.innerHTML = ''
    tasksList.addEventListener('click', initTasksController)

    if (filteredTasks.length === 0) {
      const noTasks = document.createElement('p')
      if (filterType === 'all') {
        noTasks.textContent = 'There are no tasks in this project.'
      } else {
        noTasks.textContent = `There are no tasks with priority ${filterType} in this project`
      }
      tasksList.appendChild(noTasks)
      return
    }

    tasksList.className = 'flex flex-col gap-4 overflow-y-auto flex-1 min-h-0'

    filteredTasks.forEach((task) => {
      // Normalizar el objeto task para compatibilidad
      const normalizedTask = {
        ...task,
        id: task._id || task.id,
      }
      tasksList.append(Task(normalizedTask))
    })

    initDragDropController()
  } catch (error) {
    console.error('Error rendering tasks:', error)
    tasksList.innerHTML = "<p class='text-red-500'>Error loading tasks</p>"
  }
}
