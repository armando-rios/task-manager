import { Modal } from "../components/Modal.js"
import { createProject } from "./storage.js"

export function initProjectModalController () {
  const createProjectButton = document.querySelector("#create-project-btn")

  createProjectButton.addEventListener("click", showCreateProjectModal)

  function showCreateProjectModal () {
    Modal("Create Project", `
      <input required placeholder="Project Name" type="text" name="project-name" id="project-name" class="border p-2 rounded">
      <input placeholder="Project Description" type="text" name="project-description" id="project-description" class="border p-2 rounded">
      <button type="submit" class="bg-theme-primary w-full text-theme-surface-0 font-bold py-2 px-4 rounded">Create</button>
    `)

    const form = document.querySelector("#create-project-form")
    form.addEventListener("submit", handleCreateProject)
  }

  function handleCreateProject (e) {
    e.preventDefault()
    const projectName = document.querySelector("#project-name").value
    const projectDescription = document.querySelector("#project-description").value

    createProject(projectName, projectDescription)

    const modal = document.querySelector("#modal")
    modal.remove()
  }
}
