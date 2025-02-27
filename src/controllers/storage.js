import { renderProjects } from "../views/renderProjects.js"
import Project from "../models/Project.js"

export const createProject = (name, description) => {
  const projects = JSON.parse(localStorage.getItem("projects")) || []
  const project = new Project(name, description)
  projects.push(project)
  localStorage.setItem("projects", JSON.stringify(projects))
  renderProjects(projects)
}
