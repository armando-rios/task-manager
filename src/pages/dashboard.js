import cD from '../utils/createDocument.js'
import { getCurrentUser } from '../services/authService.js'
import { handleLogout } from '../controllers/authController.js'

/**
 * Creates the dashboard page
 * @returns {Promise<HTMLElement>} Dashboard page element
 */
export default async function dashboard() {
  // Get current user
  const user = await getCurrentUser()

  const container = cD({
    tagName: 'div',
    styles: 'min-h-screen bg-theme-surface-1 flex flex-col',
  })

  // Header
  const header = cD({
    tagName: 'header',
    styles:
      'bg-theme-surface-0 border-b border-theme-surface-3 px-8 py-4 flex justify-between items-center',
  })

  const title = cD({
    tagName: 'h1',
    styles: 'text-2xl font-bold text-theme-primary',
    textContent: 'Task Manager',
  })

  const userSection = cD({
    tagName: 'div',
    styles: 'flex items-center gap-4',
  })

  const userName = cD({
    tagName: 'span',
    styles: 'text-theme-text-0',
    textContent: user ? `Welcome, ${user.name}` : 'Welcome',
  })

  const logoutButton = cD({
    tagName: 'button',
    styles:
      'px-4 py-2 bg-theme-surface-2 text-theme-text-0 rounded-md hover:bg-theme-surface-3 transition-colors',
    textContent: 'Logout',
  })

  logoutButton.addEventListener('click', handleLogout)

  userSection.append(userName, logoutButton)
  header.append(title, userSection)

  // Main content
  const main = cD({
    tagName: 'main',
    styles: 'flex-1 p-8',
  })

  const welcomeCard = cD({
    tagName: 'div',
    styles:
      'max-w-4xl mx-auto bg-theme-surface-0 rounded-lg shadow-md border border-theme-surface-3 p-8',
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

  welcomeCard.append(welcomeTitle, welcomeText, infoText)
  main.appendChild(welcomeCard)

  container.append(header, main)

  return container
}
