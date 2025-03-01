import { Modal } from "../components/Modal.js"
import { createTask } from "./storage.js"

export const showCreateTaskModal = (projectId) => {
  // this have title, description priority, due date
  Modal("Create Task", `
    <input required placeholder="Task Title" type="text" name="task-title" id="task-title" class="border p-2 rounded">
    <textarea placeholder="Task Description" name="task-description" id="task-description" class="border p-2 rounded"></textarea>
    <select name="task-priority" id="task-priority" class="border p-2 rounded">
      <option value="low">Baja</option>
      <option value="medium">Media</option>
      <option value="high">Alta</option>
    </select>
    <input type="date" name="task-due-date" id="task-due-date" class="border p-2 rounded">
    <button type="submit" class="bg-theme-primary w-full text-theme-surface-0 font-bold py-2 px-4 rounded">Crear</button>
  `)

  const form = document.querySelector("#create-task-form")
  form.addEventListener("submit", (e) => { handleCreateTask(e, projectId) })
}

function handleCreateTask (e, projectId) {
  e.preventDefault()

  const title = document.querySelector("#task-title").value
  const description = document.querySelector("#task-description").value
  const priority = document.querySelector("#task-priority").value
  const dueDate = document.querySelector("#task-due-date").value

  createTask({ title, description, projectId, priority, dueDate })

  const modal = document.querySelector("#modal")
  modal.remove()
}
