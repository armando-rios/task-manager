import { renderProjects } from "../views/renderProjects.js"
import { renderTasks } from "../views/renderTasks.js"
import Project from "../models/Project.js"
import Task from "../models/Task.js"

export const createProject = (name, description) => {
  const projects = JSON.parse(localStorage.getItem("projects")) || []
  const project = new Project(name, description)
  projects.push(project)
  localStorage.setItem("projects", JSON.stringify(projects))
  renderProjects(projects)
}

export const createTask = ({ projectId, title, description, priority, dueDate }) => {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || []
  const task = new Task({ title, description, projectId, priority, dueDate })
  tasks.push(task)
  localStorage.setItem("tasks", JSON.stringify(tasks))
  renderTasks(projectId)
}

export const deleteTask = (id) => {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || []
  const updatedTasks = tasks.filter(task => task.id !== id)
  localStorage.setItem("tasks", JSON.stringify(updatedTasks))
}

export const editTask = (id, updataData) => {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || []
  const updatedTasks = tasks.map(task => {
    if (task.id === id) {
      return {
        ...task,
        ...updataData,
        updataAt: new Date().toISOString()
      }
    }
    return task
  })

  localStorage.setItem("tasks", JSON.stringify(updatedTasks))
}

export const deleteProject = (id) => {
  // Remove the project from localStorage
  const projects = JSON.parse(localStorage.getItem("projects")) || []
  const updatedProjects = projects.filter(project => project.id !== id)
  localStorage.setItem("projects", JSON.stringify(updatedProjects))

  // Also remove all tasks associated with this project
  const tasks = JSON.parse(localStorage.getItem("tasks")) || []
  const updatedTasks = tasks.filter(task => task.projectId !== id)
  localStorage.setItem("tasks", JSON.stringify(updatedTasks))

  // Re-render the projects list
  renderProjects(updatedProjects)

  // Clear the project-tasks area
  document.getElementById("project-tasks").innerHTML = ""
}
