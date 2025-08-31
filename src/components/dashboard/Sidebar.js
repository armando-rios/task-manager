import cD from '../../utils/createDocument.js'
import { UserSection } from './UserSection.js'
import { ProjectsList } from './ProjectsList.js'
import { PriorityFilters } from './PriorityFilters.js'
import { projectsController } from '../../controllers/projectsController.js'
import { Modal } from '../../components/common/Modal.js'

export function Sidebar() {
  const sidebarContainer = cD({
    tagName: 'div',
    styles:
      'w-76 bg-theme-surface-0 px-4 border-r border-theme-surface-3 flex flex-col max-sm:fixed top-16 bottom-0 max-sm:z-10 max-sm:-translate-x-full gap-4 transition-transform',
  })

  // Create Project Button
  const createProjectButton = cD({
    tagName: 'button',
    styles:
      'w-full bg-theme-primary hover:bg-opacity-90 text-theme-surface-0 font-semibold py-2 rounded-lg transition-all mt-4 flex items-center justify-center gap-2',
    textContent: '+ Crear Proyecto',
  })

  createProjectButton.addEventListener('click', () => {
    Modal({
      title: 'Create Project',
      submitText: 'Create',
      cancelText: 'Cancel',
      inputs: [
        {
          label: 'Project Name',
          type: 'text',
          name: 'name',
          placeholder: 'Enter project name',
          required: true,
        },
        {
          label: 'Description',
          type: 'textarea',
          name: 'description',
          placeholder: 'Enter project description (optional)',
          required: false,
        },
      ],
      onSubmit: async (data) => {
        try {
          await projectsController.createProject(data)
          // Success feedback (puedes agregar un toast/notification)
        } catch (error) {
          console.error('Error creating project:', error)
          alert('Error creating project')
        }
      },
    })
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
