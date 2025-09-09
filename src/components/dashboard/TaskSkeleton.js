/**
 * TaskSkeleton component - Loading placeholder for tasks
 * @returns {HTMLElement} Skeleton loader element
 */
export const TaskSkeleton = () => {
  const taskItem = document.createElement('div')
  taskItem.className =
    'py-2 px-4 rounded shadow-md flex flex-col gap-2 border-l-4 border-theme-surface-3 bg-theme-surface-2 animate-pulse'

  // Header skeleton
  const header = document.createElement('div')
  header.className = 'flex justify-between items-center'

  const titleSkeleton = document.createElement('div')
  titleSkeleton.className = 'h-6 bg-theme-surface-3 rounded w-1/2'

  const prioritySkeleton = document.createElement('div')
  prioritySkeleton.className = 'h-6 bg-theme-surface-3 rounded w-16'

  header.appendChild(titleSkeleton)
  header.appendChild(prioritySkeleton)

  // Description skeleton
  const descriptionSkeleton = document.createElement('div')
  descriptionSkeleton.className = 'h-4 bg-theme-surface-3 rounded w-3/4'

  // Footer skeleton
  const footer = document.createElement('div')
  footer.className = 'flex justify-between items-center'

  const dateSkeleton = document.createElement('div')
  dateSkeleton.className = 'h-4 bg-theme-surface-3 rounded w-20'

  const buttonsSkeleton = document.createElement('div')
  buttonsSkeleton.className = 'flex gap-2'

  const editBtnSkeleton = document.createElement('div')
  editBtnSkeleton.className = 'h-6 w-6 bg-theme-surface-3 rounded'

  const trashBtnSkeleton = document.createElement('div')
  trashBtnSkeleton.className = 'h-6 w-6 bg-theme-surface-3 rounded'

  buttonsSkeleton.appendChild(editBtnSkeleton)
  buttonsSkeleton.appendChild(trashBtnSkeleton)

  footer.appendChild(dateSkeleton)
  footer.appendChild(buttonsSkeleton)

  // Append all sections
  taskItem.appendChild(header)
  taskItem.appendChild(descriptionSkeleton)
  taskItem.appendChild(footer)

  return taskItem
}
