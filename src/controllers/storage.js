import { renderProjects } from '../views/renderProjects.js'
import { renderTasks } from '../views/renderTasks.js'
import { projectService } from '../services/projectService.js'
import { taskService } from '../services/taskService.js'

/**
 * Create a new project via API
 */
export const createProject = async (name, description) => {
  try {
    await projectService.create({ name, description })

    // Reload all projects after creation
    const projects = await projectService.getAll()
    renderProjects(projects)
  } catch (error) {
    console.error('Error creating project:', error)
    alert('Error creating project. Please try again.')
  }
}

/**
 * Create a new task via API
 */
export const createTask = async ({
  projectId,
  title,
  description,
  priority,
  dueDate,
}) => {
  try {
    await taskService.create({
      projectId,
      title,
      description,
      priority: priority.toLowerCase(), // API expects lowercase
      dueDate,
    })

    // Re-render tasks for this project
    await renderTasks(projectId)
  } catch (error) {
    console.error('Error creating task:', error)
    alert('Error creating task. Please try again.')
  }
}

/**
 * Delete a task (localStorage fallback - hasta crear el endpoint)
 */
export const deleteTask = (id) => {
  const tasks = JSON.parse(localStorage.getItem('tasks')) || []
  const updatedTasks = tasks.filter((task) => task.id !== id)
  localStorage.setItem('tasks', JSON.stringify(updatedTasks))
}

/**
 * Edit a task (localStorage fallback - hasta crear el endpoint)
 */
export const editTask = (id, updataData) => {
  const tasks = JSON.parse(localStorage.getItem('tasks')) || []
  const updatedTasks = tasks.map((task) => {
    if (task.id === id) {
      return {
        ...task,
        ...updataData,
        updataAt: new Date().toISOString(),
      }
    }
    return task
  })

  localStorage.setItem('tasks', JSON.stringify(updatedTasks))
}

/**
 * Delete a project via API
 */
export const deleteProject = async (id) => {
  try {
    await projectService.delete(id)

    // Reload all projects
    const projects = await projectService.getAll()
    renderProjects(projects)

    // Clear the project-tasks area
    document.getElementById('project-tasks').innerHTML = ''
  } catch (error) {
    console.error('Error deleting project:', error)
    alert('Error deleting project. Please try again.')
  }
}
