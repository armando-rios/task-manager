export const Task = (task) => {
  const taskItem = document.createElement("div")
  taskItem.className = "p-4 bg-theme-surface-0 rounded-md shadow-sm flex flex-col gap-2"
  taskItem.setAttribute("data-task-id", task.id)

  const header = document.createElement("div")
  header.className = "flex justify-between items-center"

  const title = document.createElement("h3")
  title.textContent = task.title
  title.className = "font-bold"

  const statusBadge = document.createElement("span")
  statusBadge.className = "px-2 py-1 text-xs rounded-full"

  // Estilo según el estado
  if (task.status === "pending") {
    statusBadge.className += " bg-yellow-200 text-yellow-800"
    statusBadge.textContent = "Pendiente"
  } else if (task.status === "in-progress") {
    statusBadge.className += " bg-blue-200 text-blue-800"
    statusBadge.textContent = "En progreso"
  } else if (task.status === "completed") {
    statusBadge.className += " bg-green-200 text-green-800"
    statusBadge.textContent = "Completada"
  }

  header.appendChild(title)
  header.appendChild(statusBadge)

  const description = document.createElement("p")
  description.textContent = task.description
  description.className = "text-sm"

  const actions = document.createElement("div")
  actions.className = "flex gap-2 mt-2"

  const editButton = document.createElement("button")
  editButton.className = "text-sm px-2 py-1 bg-theme-surface-2 rounded"
  editButton.textContent = "Editar"
  editButton.setAttribute("data-action", "edit")

  const deleteButton = document.createElement("button")
  deleteButton.className = "text-sm px-2 py-1 bg-theme-surface-2 rounded"
  deleteButton.textContent = "Eliminar"
  deleteButton.setAttribute("data-action", "delete")

  actions.appendChild(editButton)
  actions.appendChild(deleteButton)

  taskItem.appendChild(header)
  taskItem.appendChild(description)
  taskItem.appendChild(actions)

  return taskItem
}
