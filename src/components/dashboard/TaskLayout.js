import cD from '../../utils/createDocument.js'
import { Task } from '../dashboard/Task.js'

export function TaskLayout(
  project,
  tasks,
  onAddTaskClick,
  onDeleteTask,
  onEditTask
) {
  const header = cD({
    tagName: 'div',
    styles:
      'flex justify-between items-center p-6 border-b border-theme-surface-3',
  })

  const title = cD({
    tagName: 'h2',
    styles: 'text-theme-text-0 text-xl font-semibold',
    textContent: project.name,
  })

  const btn = cD({
    tagName: 'button',
    styles:
      'px-3 py-2 bg-theme-primary text-theme-surface-0 rounded hover:opacity-90',
    textContent: 'Agregar Tarea',
  })

  btn.addEventListener('click', onAddTaskClick)

  header.append(title, btn)

  const listContainer = cD({
    tagName: 'div',
    styles: 'p-6 flex-1 h-full flex flex-col gap-4 overflow-y-auto',
    id: 'tasks-list',
  })

  tasks.forEach((task) => {
    const taskElement = Task(
      task,
      () => onDeleteTask(task),
      () => onEditTask(task)
    )
    listContainer.appendChild(taskElement)
  })

  return { header, listContainer }
}
