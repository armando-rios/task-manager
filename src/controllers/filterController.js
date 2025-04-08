import { renderFilteredTasks } from "../views/renderTasks.js";

export const initFilterController = () => {
  const filtersContainer = document.querySelector('#filters')

  const handleFilterClick = (e) => {
    const filterButton = e.target.closest('[data-filter]')
    console.log(filterButton)
    if (!filterButton) return

    const activeProject = document.querySelector(
      '#projects .bg-theme-surface-2'
    )
    if (!activeProject) {
      alert('Please select a project first')
      return
    }

    const projectId = activeProject.id;
    const filterType = filterButton.getAttribute("data-filter");

    document.querySelectorAll('#filters [data-filter]').forEach((btn) => {
      btn.classList.remove('bg-theme-surface-2')
    })
    filterButton.classList.add('bg-theme-surface-2')

    renderFilteredTasks(projectId, filterType)
  }

  filtersContainer.addEventListener('click', handleFilterClick)

}
