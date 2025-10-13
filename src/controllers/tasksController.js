import { taskService } from '../services/taskService.js'
import { TaskLayout } from '../components/dashboard/TaskLayout.js'
import { Modal } from '../components/common/Modal.js'
import { Task } from '../components/dashboard/Task.js'

export const tasksController = {
  activeProjectId: null,

  async renderTasks(project) {
    this.activeProjectId = project._id
    const tasks = await taskService.getByProject(project._id)

    const container = document.querySelector('#tasks-section')
    container.innerHTML = ''

    // Le pasamos la función que abre el modal
    const { header, listContainer } = TaskLayout(
      project,
      tasks,
      () => this._openCreateTaskModal(),
      (task) => this._handleDeleteTask(task),
      (task) => this._handleEditTask(task)
    )

    container.append(header, listContainer)
  },

  _openCreateTaskModal() {
    Modal({
      title: 'Add New Task',
      submitText: 'Create Task',
      cancelText: 'Cancel',
      inputs: [
        { label: 'Task Title', type: 'text', name: 'title', required: true },
        { label: 'Description', type: 'textarea', name: 'description' },
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
        { label: 'Due Date', type: 'date', name: 'dueDate' },
      ],
      onSubmit: (data) => this._handleCreateTask(data),
    })
  },

  async _handleCreateTask(data) {
    try {
      const newTask = await taskService.create({
        ...data,
        projectId: this.activeProjectId,
      })

      const listContainer = document.querySelector('#tasks-list')
      if (listContainer) {
        const taskElement = Task(
          newTask,
          () => this._handleDeleteTask(newTask),
          () => this._handleEditTask(newTask)
        )
        taskElement.classList.add('fade-in-up')
        listContainer.appendChild(taskElement)
      }
    } catch (error) {
      console.error('Error creating task:', error)
    }
  },
  async _handleDeleteTask(task) {
    Modal({
      title: '¿Eliminar tarea?',
      message: `¿Estás seguro de que quieres eliminar "${task.title}"?`,
      submitText: 'Eliminar',
      cancelText: 'Cancelar',
      async onSubmit() {
        try {
          await taskService.delete(task._id)

          const taskElement = document.getElementById(task._id)

          if (taskElement) {
            taskElement.classList.add('fade-out')

            await new Promise((resolve) => setTimeout(resolve, 300))
            taskElement.remove()
          }

          const listContainer = document.querySelector('#tasks-list')
          if (listContainer && listContainer.children.length === 0) {
            listContainer.innerHTML =
              '<p class="text-theme-text-2">No hay tareas pendientes.</p>'
          }
        } catch (error) {
          console.error('Error al borrar tarea:', error)
          alert('No se pudo eliminar la tarea.')
        }
      },
    })
  },
  async _handleEditTask(task) {
    Modal({
      title: 'Editar Tarea',
      submitText: 'Guardar Cambios',
      cancelText: 'Cancelar',
      inputs: [
        {
          label: 'Task Title',
          type: 'text',
          name: 'title',
          value: task.title,
          required: true,
        },
        {
          label: 'Description',
          type: 'textarea',
          name: 'description',
          value: task.description || '',
        },
        {
          label: 'Priority',
          type: 'select',
          name: 'priority',
          value: task.priority,
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
          value: task.dueDate ? task.dueDate.split('T')[0] : '',
        },
      ],
      onSubmit: async (formData) => {
        try {
          const updatedTask = await taskService.update(task._id, {
            ...formData,
            projectId: this.activeProjectId,
          })

          const oldElement = document.getElementById(task._id)
          if (oldElement) {
            const newElement = Task(
              updatedTask,
              () => this._handleDeleteTask(updatedTask),
              () => this._handleEditTask(updatedTask)
            )

            oldElement.replaceWith(newElement)

            newElement.classList.add('highlight-flash')
          }
        } catch (error) {
          console.error('Error updating task:', error)
          alert('No se pudo actualizar la tarea.')
        }
      },
    })
  },
}
