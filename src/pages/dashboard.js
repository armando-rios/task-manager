import cD from '../utils/createDocument.js'
import { Sidebar } from '../components/dashboard/Sidebar.js'
import { Header } from '../components/dashboard/Header.js'
import { getCurrentUser } from '../services/authService.js'

/**
 * Creates the dashboard page
 * @returns {Promise<HTMLElement>} Dashboard page element
 */
export default async function dashboard() {
  // Get current user
  const user = getCurrentUser()

  const container = cD({
    tagName: 'div',
    styles: 'min-h-screen bg-theme-surface-1 flex flex-col ',
  })

  // Main content
  const main = cD({
    tagName: 'main',
    styles: 'flex-1 flex h-full',
  })

  const mainSection = cD({
    tagName: 'div',
    styles: 'bg-theme-surface-0 p-8 w-full max-sm:hidden',
  })

  const welcomeTitle = cD({
    tagName: 'h2',
    styles: 'text-3xl font-bold mb-4 text-theme-primary',
    textContent: 'Dashboard',
  })

  const welcomeText = cD({
    tagName: 'p',
    styles: 'text-theme-text-1 mb-4',
    textContent:
      'Welcome to your task manager dashboard. This is where you will manage all your tasks and projects.',
  })

  const infoText = cD({
    tagName: 'p',
    styles: 'text-theme-text-1 text-sm',
    textContent:
      'This is a placeholder dashboard. The full task management functionality will be integrated here.',
  })

  const header = Header(user)

  const sidebar = Sidebar()

  mainSection.append(welcomeTitle, welcomeText, infoText)
  main.append(sidebar, mainSection)

  container.append(header, main)

  return container
}
