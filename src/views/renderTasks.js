import { Task } from "../components/Task.js"
import { initTasksController } from "../controllers/tasksController.js"

export const renderTasks = (projectId) => {
  const tasksDB = JSON.parse(localStorage.getItem("tasks")) || []
  const filterdTasks = tasksDB.filter((task) => task.projectId === projectId)
  const tasksList = document.querySelector("#tasks-container")
  tasksList.innerHTML = ""
  tasksList.addEventListener("click", initTasksController)

  if (filterdTasks.length === 0) {
    const noTasks = document.createElement("p")
    noTasks.textContent = "No hay tareas en este proyecto"
    tasksList.appendChild(noTasks)
    return
  }

  tasksList.className = "flex flex-col gap-4 overflow-y-auto flex-1 min-h-0"

  filterdTasks.forEach((task) => {
    tasksList.append(Task(task))
  })
}
