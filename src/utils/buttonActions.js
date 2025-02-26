import { showModal } from "../components/Modal.js"
import { createProject } from "./storage.js"
const sidebar = document.querySelector("#sidebar")
const sidebarButton = document.querySelector("#sidebar-button")
const closeSidebar = document.querySelector("#close-sidebar")

const handleClickOutside = (e) => {
  console.log("hola")
  if (!sidebar.contains(e.target) && !sidebarButton.contains(e.target)) {
    sidebar.classList.add("hidden")
    document.removeEventListener("click", handleClickOutside) // Removemos el listener cuando se oculta el sidebar
  }
}

sidebarButton.addEventListener("click", (e) => {
  e.stopPropagation()
  const isHidden = sidebar.classList.toggle("hidden")

  if (!isHidden) {
    document.addEventListener("click", handleClickOutside)
  }
})

closeSidebar.addEventListener("click", () => {
  sidebar.classList.add("hidden")
  document.removeEventListener("click", handleClickOutside)
})

// Create Project Modal
const createProjectButton = document.querySelector("#create-project-btn")

createProjectButton.addEventListener("click", () => {
  showModal("Create Project", `
      <input placeholder="Project Name" type="text" name="project-name" id="project-name" class="border p-2 rounded">
      <input placeholder="Project Description" type="text" name="project-description" id="project-description" class="border p-2 rounded">
      <button type="submit" class="bg-theme-primary w-full text-theme-surface-0 font-bold py-2 px-4 rounded">Create</button>
  `)
  const form = document.querySelector("#create-project-form")
  form.addEventListener("submit", (e) => {
    e.preventDefault()
    const projectName = document.querySelector("#project-name").value
    const projectDescription = document.querySelector("#project-description").value
    createProject(projectName, projectDescription)

    const modal = document.querySelector("#modal")
    modal.remove()
  })
})
