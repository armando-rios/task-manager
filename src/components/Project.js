export const Project = (project) => {
  const projectTasksContainer = document.createElement("div")
  projectTasksContainer.id = "tasks-container"
  projectTasksContainer.className = "flex flex-col gap-4 overflow-y-auto flex-1 min-h-0"

  const projectHeader = document.createElement("div")
  projectHeader.className = "flex justify-between items-center mb-4 flex-shrink-0"

  const titleContainer = document.createElement("div")
  const title = document.createElement("h2")
  title.textContent = project.name
  title.className = "text-2xl font-bold"

  const desc = document.createElement("p")
  desc.textContent = project.description

  const buttonsContainer = document.createElement("div")
  buttonsContainer.className = "flex gap-2"

  const createTaskBtn = document.createElement("button")
  createTaskBtn.className = "bg-theme-primary h-fit text-theme-surface-0 font-bold py-2 px-4 rounded"
  createTaskBtn.id = "create-task-btn"
  createTaskBtn.textContent = "Create Task"

  const deleteProjectBtn = document.createElement("button")
  deleteProjectBtn.className = "bg-theme-priority-high h-fit text-theme-surface-0 font-bold py-2 px-4 rounded"
  deleteProjectBtn.id = "delete-project-btn"
  deleteProjectBtn.textContent = "Delete Project"

  titleContainer.append(title)
  titleContainer.append(desc)

  buttonsContainer.append(createTaskBtn)
  buttonsContainer.append(deleteProjectBtn)

  projectHeader.append(titleContainer)
  projectHeader.append(buttonsContainer)

  // Return the project header and tasks container
  return [projectHeader, projectTasksContainer]
}
