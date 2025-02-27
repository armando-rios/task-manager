const projectsDB = JSON.parse(localStorage.getItem("projects")) || []

export const renderProjects = (
  projects = projectsDB,
  activeProjectId = null
) => {
  const projectsList = document.querySelector("#projects")
  projectsList.innerHTML = ""

  projects.forEach((project) => {
    const projectItem = document.createElement("button")

    projectItem.className =
      "px-4 py-1.5 text-theme-primary rounded hover:bg-theme-surface-2 cursor-pointer text-start"

    if (activeProjectId && project.id === activeProjectId) {
      projectItem.classList.add("bg-theme-surface-2")
    } else {
      projectItem.classList.add("bg-transparent")
    }

    projectItem.id = project.id
    projectItem.setAttribute("data-task-id", project.id)
    projectItem.textContent = project.name
    projectsList.appendChild(projectItem)
  })
}
