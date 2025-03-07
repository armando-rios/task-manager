import { deleteTask } from "./storage.js"

export const initTasksController = (e) => {
  const deleteButton = e.target.closest("button.delete-button")
  if (deleteButton) {
    const taskElement = deleteButton.closest('.task')
    const id = taskElement.id
    deleteTask(id)
    taskElement.remove()
  }
}
