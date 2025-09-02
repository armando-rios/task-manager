import cD from '../utils/createDocument.js'
import { Sidebar } from '../components/dashboard/Sidebar.js'
import { Header } from '../components/dashboard/Header.js'
import { getCurrentUser } from '../services/authService.js'
import { projectsController } from '../controllers/projectsController.js'

/**
 * Creates the dashboard page
 * @returns {Promise<HTMLElement>} Dashboard page element
 */
export default async function dashboard() {
  const user = await getCurrentUser()

  const container = cD({
    tagName: 'div',
    styles: 'h-screen bg-theme-surface-1 flex flex-col',
  })

  // Main content
  const main = cD({
    tagName: 'main',
    styles: 'flex-1 flex h-full',
  })

  const tasksSection = cD({
    tagName: 'div',
    styles: 'flex-1 h-full bg-theme-surface-1',
    id: 'tasks-section',
  })

  const header = Header(user)

  const sidebar = Sidebar()

  main.append(sidebar, tasksSection)
  container.append(header, main)

  // ═══════════════════════════════════════════════════
  // 🚀 Initialize Projects List
  // ═══════════════════════════════════════════════════

  setTimeout(async () => {
    await projectsController.renderList()
  }, 0)

  document.addEventListener('projectSelected', (e) => {
    const { projectId } = e.detail
    console.log('Proyecto seleccionado:', projectId)
  })

  return container
}
