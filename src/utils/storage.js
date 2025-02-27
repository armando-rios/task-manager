import { renderProjects } from "../views/renderProjects.js"

export const createProject = (name, description) => {
  const projects = JSON.parse(localStorage.getItem("projects")) || []
  projects.push({ name, description, id: Date.now() })
  localStorage.setItem("projects", JSON.stringify(projects))
  renderProjects(projects)
}
