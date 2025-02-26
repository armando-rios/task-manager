const projectsDB = JSON.parse(localStorage.getItem("projects")) || []

export const renderProjects = (projects = projectsDB) => {
  const projectsList = document.querySelector("#projects")
  projectsList.innerHTML = ""
  projects.forEach((project) => {
    const projectItem = document.createElement("li")
    projectItem.classList.add("px-4", "py-1.5", "bg-theme-surface-2", "text-theme-primary", "rounded")
    projectItem.textContent = project.name
    projectsList.appendChild(projectItem)
  })
}
