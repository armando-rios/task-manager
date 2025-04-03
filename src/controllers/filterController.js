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
  }

  filtersContainer.addEventListener('click', handleFilterClick)
}
