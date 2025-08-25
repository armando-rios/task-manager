import cD from '../../utils/createDocument.js'
import { UserSection } from './UserSection.js'
import { ProjectsList } from './ProjectsList.js'
import { PriorityFilters } from './PriorityFilters.js'

export function Sidebar() {
  const sidebarContainer = cD({
    tagName: 'div',
    styles:
      'w-76 bg-theme-surface-0 px-4 border-r border-theme-surface-3 flex flex-col max-sm:fixed top-16 bottom-0 max-sm:z-10 max-sm:-translate-x-full gap-4',
  })

  // Create Project Button
  const createProjectButton = cD({
    tagName: 'button',
    styles:
      'w-full bg-theme-primary hover:bg-opacity-90 text-theme-surface-0 font-semibold py-2 rounded-lg transition-all mt-4 flex items-center justify-center gap-2',
    textContent: '+ Crear Proyecto',
  })

  // Create sub-components
  const projectsList = ProjectsList()
  const priorityFilters = PriorityFilters()
  const userSection = UserSection()

  sidebarContainer.append(
    createProjectButton,
    projectsList.element,
    priorityFilters.element,
    userSection.element
  )

  return sidebarContainer
}
