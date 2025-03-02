export const Task = (task) => {
  const priorityClass = {
    low: "bg-theme-priority-low/15 border-theme-priority-low",
    medium: "bg-theme-priority-medium/15 border-theme-priority-medium",
    high: "bg-theme-priority-high/15 border-theme-priority-high"
  }[task.priority] || "bg-gray-500"

  const priorityTextClass = {
    low: "text-theme-priority-low",
    medium: "text-theme-priority-medium",
    high: "text-theme-priority-high"
  }[task.priority] || "text-gray-500"

  const taskItem = document.createElement("div")
  taskItem.className = `${priorityClass} py-2 px-4 rounded shadow-md flex flex-col gap-2 border-l-4 hover:bg-theme-surface-2 hover:scale-y-105 duration-200 justify-between`

  const header = document.createElement("div")
  header.className = "flex justify-between items-center"

  const title = document.createElement("h3")
  title.textContent = task.title
  title.className = "text-lg font-bold text-theme-text-0"

  const priority = document.createElement("span")
  priority.textContent = task.priority
  priority.className = `${priorityClass} border ${priorityTextClass} text-sm font-bold rounded-xl px-2`

  header.appendChild(title)
  header.appendChild(priority)

  const description = document.createElement("p")
  description.className = "text-sm font-medium truncate whitespace-nowrap overflow-hidden text-ellipsis w-full text-theme-text-1"
  description.textContent = task.description
  description.title = task.description

  const footer = document.createElement("div")
  footer.className = "flex justify-between items-center"

  const date = document.createElement("span")
  date.textContent = task.dueDate || "-/-/-"
  date.className = "text-sm text-theme-text-1"
  footer.appendChild(date)

  taskItem.appendChild(header)
  taskItem.appendChild(description)
  taskItem.appendChild(footer)

  return taskItem
}
