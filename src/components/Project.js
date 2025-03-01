export const Project = (project) => {
  const projectContainer = document.createElement("div")
  const projectTasksContainer = document.createElement("div")
  const projectHeader = document.createElement("div")
  projectHeader.className = "flex justify-between items-center"
  const titleContainer = document.createElement("div")
  const title = document.createElement("h2")
  title.textContent = project.name
  title.className = "text-2xl font-bold"
  const desc = document.createElement("p")
  desc.textContent = project.description
  const createTaskBtn = document.createElement("button")
  createTaskBtn.className = "bg-theme-primary h-fit text-theme-surface-0 font-bold py-2 px-4 rounded"
  createTaskBtn.id = "create-project-btn"
  createTaskBtn.textContent = "Create Task"

  titleContainer.append(title)
  titleContainer.append(desc)
  projectHeader.append(titleContainer)
  projectHeader.append(createTaskBtn)

  projectContainer.append(projectHeader)
  projectContainer.append(projectTasksContainer)

  return projectContainer
}
