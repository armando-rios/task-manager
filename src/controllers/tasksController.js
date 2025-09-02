import cD from '../utils/createDocument.js'
import { taskService } from '../services/taskService.js'
import { Modal } from '../components/common/Modal.js'
import { Task } from '../components/dashboard/Task.js'

export const tasksController = {
  activeProjectId: null,
  renderTasks(project) {
    this.activeProjectId = project._id
    const container = document.querySelector('#tasks-section')
    if (!container) return

    const tasksContainer = cD({
      tagName: 'div',
      styles: 'p-6 flex-1 h-full flex flex-col',
      id: 'tasks-list',
    })

    container.innerHTML = ''
    const heading = cD({
      tagName: 'div',
      styles:
        'flex justify-between items-center p-6 border-b border-theme-surface-1',
    })

    const projectName = cD({
      tagName: 'h2',
      styles: 'text-theme-text-0 text-xl font-semibold',
      textContent: project.name,
    })

    const addTaskButton = cD({
      tagName: 'button',
      styles:
        'px-3 py-2 bg-theme-primary text-theme-surface-0 rounded hover:bg-theme-primary',
      textContent: 'Agregar Tarea',
    })

    addTaskButton.addEventListener('click', () => {
      Modal({
        title: 'Add New Task',
        submitText: 'Create Task',
        cancelText: 'Cancel',
        inputs: [
          {
            label: 'Task Title',
            type: 'text',
            name: 'title',
            required: true,
          },
          {
            label: 'Description',
            type: 'textarea',
            name: 'description',
          },
          {
            label: 'Priority',
            type: 'select',
            name: 'priority',
            options: [
              { value: 'low', text: 'Low' },
              { value: 'medium', text: 'Medium' },
              { value: 'high', text: 'High' },
            ],
          },
          {
            label: 'Due Date',
            type: 'date',
            name: 'dueDate',
          },
        ],
        async onSubmit(data) {
          try {
            await taskService.create({
              title: data.title,
              description: data.description,
              projectId: project._id,
              priority: data.priority,
              dueDate: data.dueDate,
            })
            tasksController.renderList()
          } catch (error) {
            console.error('Error creating task:', error)
            alert('Failed to create task. Please try again.')
          }
        },
      })
    })

    heading.append(projectName, addTaskButton)

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
        const taskElement = Task(task)
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
