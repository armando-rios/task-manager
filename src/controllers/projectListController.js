import { Project } from '../components/Project.js'
import { renderTasks } from '../views/renderTasks.js'
import { renderProjects } from '../views/renderProjects.js'
import { showCreateTaskModal } from './taskModalController.js'
import { deleteProject } from './storage.js'
import { projectService } from '../services/projectService.js'

export function initProjectListController() {
  const projectList = document.querySelector('#projects')

  projectList.addEventListener('click', handleProjectSelection)

  async function handleProjectSelection(e) {
    const taskElement = e.target.closest('[data-task-id]')

    if (!taskElement) return

    const id = taskElement.getAttribute('id')
    if (!id) return

    try {
      const projects = await projectService.getAll()
      // MongoDB usa _id
      const project = projects.find(
        (project) => project._id === id || project.id === id
      )

      if (project) {
        document.getElementById('project-tasks').innerHTML = ''
        document.getElementById('project-tasks').append(...Project(project))
        await renderProjects(projects, id)
        await renderTasks(id)

        const createTaskButton = document.querySelector('#create-task-btn')
        createTaskButton.addEventListener('click', () => {
          showCreateTaskModal(id)
        })

        const deleteProjectButton = document.querySelector(
          '#delete-project-btn'
        )
        deleteProjectButton.addEventListener('click', async () => {
          if (
            confirm(
              `Are you sure you want to delete project "${project.name}"? This will also delete all tasks in this project.`
            )
          ) {
            await deleteProject(id)
          }
        })
      }
    } catch (error) {
      console.error('Error al procesar el proyecto:', error)
    }
  }
}
