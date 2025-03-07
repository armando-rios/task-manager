import { Modal } from "../components/Modal.js"
import { renderTasks } from "../views/renderTasks.js"
import { editTask } from "./storage.js"

export const showEditTaskModal = (id) => {

  console.log(id)
  const tasks = JSON.parse(localStorage.getItem("tasks")) || []
  const [task] = tasks.filter(task => task.id === id)
  console.log(task)

  Modal("Edit Task", `
    <input required placeholder="Task Title" type="text" name="task-title" id="task-title" class="border p-2 rounded" value="${task.title || ''}">
    <textarea placeholder="Task Description" name="task-description" id="task-description" class="border p-2 rounded">${task.description || ''}</textarea>
    <select name="task-priority" id="task-priority" class="border p-2 rounded">
      <option value="low" ${task.priority === 'low' ? 'selected' : ''}>Baja</option>
      <option value="medium" ${task.priority === 'medium' ? 'selected' : ''}>Media</option>
      <option value="high" ${task.priority === 'high' ? 'selected' : ''}>Alta</option>
    </select>
    <input type="date" name="task-due-date" id="task-due-date" class="border p-2 rounded" value="${task.dueDate || ''}">
    <button type="submit" class="bg-theme-primary w-full text-theme-surface-0 font-bold py-2 px-4 rounded">Actualizar</button>
  `)

  document.querySelector("#edit-task-form").addEventListener("submit", (e) => {
    e.preventDefault()

    const updatedData = {
      title: document.getElementById("task-title").value,
      description: document.getElementById("task-description").value,
      priority: document.getElementById("task-priority").value,
      dueDate: document.getElementById("task-due-date").value
    }

    const modal = document.querySelector("#modal")
    modal.remove()

    editTask(id, updatedData)
    renderTasks(task.projectId)
  })
}
