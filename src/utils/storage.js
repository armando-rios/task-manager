import { renderProjects } from "../views/renderProjects.js"

export const createProject = (name, description) => {
  const projects = JSON.parse(localStorage.getItem("projects")) || []
  projects.push({ name, description })
  localStorage.setItem("projects", JSON.stringify(projects))
  renderProjects(projects)
}
