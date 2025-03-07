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
