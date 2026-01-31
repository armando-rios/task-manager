import { showToast } from '../utils/toastConfig.js';
import { taskService } from '../services/taskService.js';
import { TaskLayout } from '../components/dashboard/TaskLayout.js';
import { TaskSkeleton } from '../components/dashboard/TaskSkeleton.js';
import { Modal } from '../components/common/Modal.js';
import { Task } from '../components/dashboard/Task.js';

export const tasksController = {
  activeProjectId: null,
  taskCache: {},

  async renderTasks(project) {
    this.activeProjectId = project._id;
    const container = document.querySelector('#tasks-section');
    if (!container) return;

    let tasks = this.taskCache[project._id];

    container.innerHTML = '';
    const { header, listContainer } = TaskLayout(
      project,
      tasks || [],
      () => this._openCreateTaskModal(),
      t => this._handleDeleteTask(t),
      t => this._handleEditTask(t)
    );
    container.append(header, listContainer);

    if (!tasks) {
      listContainer.innerHTML = '';
      this._renderSkeletons(listContainer, 4);

      try {
        tasks = await taskService.getByProject(project._id);
        this.taskCache[project._id] = tasks;

        listContainer.innerHTML = '';
        if (tasks.length === 0) {
          listContainer.innerHTML = '<p class="text-theme-text-2">No hay tareas pendientes.</p>';
        } else {
          tasks.forEach(task => {
            const el = this._createTaskElement(task);
            listContainer.appendChild(el);
          });
        }
      } catch {
        listContainer.innerHTML = '<p class="text-theme-error">Error al cargar tareas.</p>';
      }
    }
  },

  _renderSkeletons(container, count) {
    for (let i = 0; i < count; i++) {
      container.appendChild(TaskSkeleton());
    }
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
      onSubmit: data => this._handleCreateTask(data),
    });
  },

  _createTaskElement(task) {
    return Task(
      task,
      () => this._handleDeleteTask(task),
      () => this._handleEditTask(task)
    );
  },

  async _handleCreateTask(data) {
    try {
      const newTask = await taskService.create({
        ...data,
        projectId: this.activeProjectId,
      });

      showToast.success('Task Created');

      if (this.taskCache[this.activeProjectId]) {
        this.taskCache[this.activeProjectId].push(newTask);
      }

      const listContainer = document.querySelector('#tasks-list');
      if (listContainer) {
        if (this.taskCache[this.activeProjectId].length === 1) {
          listContainer.innerHTML = '';
        }
        const taskElement = this._createTaskElement(newTask);
        taskElement.classList.add('fade-in-up');
        listContainer.appendChild(taskElement);
      }
    } catch (error) {
      showToast.error('Error creating task');
      console.error('Error creating task:', error);
    }
  },

  async _handleDeleteTask(task) {
    Modal({
      title: '¿Eliminar tarea?',
      message: `¿Estás seguro de que quieres eliminar "${task.title}"?`,
      submitText: 'Eliminar',
      cancelText: 'Cancelar',
      onSubmit: async () => {
        try {
          await taskService.delete(task._id);

          showToast.warning('Task Deleted');

          this.taskCache[this.activeProjectId] = this.taskCache[this.activeProjectId].filter(
            t => t._id !== task._id
          );

          const taskElement = document.getElementById(task._id);

          if (taskElement) {
            taskElement.classList.add('fade-out');

            await new Promise(resolve => setTimeout(resolve, 300));
            taskElement.remove();
          }

          const listContainer = document.querySelector('#tasks-list');
          if (listContainer && listContainer.children.length === 0) {
            listContainer.innerHTML = '<p class="text-theme-text-2">No hay tareas pendientes.</p>';
          }
        } catch (error) {
          console.error('Error al borrar tarea:', error);
          showToast.error('The task could not be deleted');
        }
      },
    });
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
      onSubmit: async formData => {
        try {
          const updatedTask = await taskService.update(task._id, {
            ...formData,
            projectId: this.activeProjectId,
          });

          this.taskCache[this.activeProjectId] = this.taskCache[this.activeProjectId].map(t =>
            t._id === task._id ? updatedTask : t
          );

          const oldElement = document.getElementById(task._id);
          if (oldElement) {
            const newElement = Task(
              updatedTask,
              () => this._handleDeleteTask(updatedTask),
              () => this._handleEditTask(updatedTask)
            );

            oldElement.replaceWith(newElement);

            newElement.classList.add('highlight-flash');
            showToast.success('Task Updated');
          }
        } catch (error) {
          console.error('Error updating task:', error);
          showToast.error('The task could not be updated');
        }
      },
    });
  },
};
