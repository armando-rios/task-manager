import cD from '../../utils/createDocument.js'
import { handleLogout } from '../../controllers/authController.js'
import { BurgerMenu } from './BurgerMenu.js'

export const Header = (user) => {
  const header = cD({
    tagName: 'header',
    styles:
      'bg-theme-surface-0 border-b border-theme-surface-3 px-8 h-16 flex justify-between items-center',
  })

  const title = cD({
    tagName: 'h1',
    styles: 'text-2xl font-bold text-theme-primary',
    textContent: 'Task Manager',
  })

  const userSection = cD({
    tagName: 'div',
    styles: 'flex items-center gap-4 max-sm:hidden',
  })

  const userName = cD({
    tagName: 'span',
    styles: 'text-theme-text-0',
    textContent: user ? `Welcome, ${user.name}` : 'Welcome',
  })

  const logoutButton = cD({
    tagName: 'button',
    styles:
      'px-4 py-1 bg-theme-surface-2 text-sm text-theme-text-0 rounded-md hover:bg-theme-surface-3 transition-colors',
    textContent: 'Logout',
  })

  logoutButton.addEventListener('click', handleLogout)

  const burgerMenu = BurgerMenu()

  userSection.append(userName, logoutButton)
  header.append(title, burgerMenu, userSection)

  return header
}
