import { showEditTaskModal } from "./editModalController.js"
import { deleteTask } from "./storage.js"

export const initTasksController = (e) => {
  const deleteButton = e.target.closest("button.delete-button")
  if (deleteButton) {
    const taskElement = deleteButton.closest('.task')
    const id = taskElement.id
    deleteTask(id)
    taskElement.remove()
  }

  const editButton = e.target.closest("button.edit-button")
  if (editButton) {
    const taskElement = editButton.closest('.task')
    const id = taskElement.id
    showEditTaskModal(id)
  }
}
