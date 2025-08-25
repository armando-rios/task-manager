import cD from '../../utils/createDocument.js'

export function UserSection() {
  const userSection = cD({
    tagName: 'div',
    styles: 'sm:hidden pb-4',
  })

  const userInfo = cD({
    tagName: 'div',
    styles: 'flex items-center justify-between',
  })

  const userDetails = cD({
    tagName: 'div',
    styles: 'flex items-center gap-3',
  })

  const userAvatar = cD({
    tagName: 'div',
    styles:
      'w-10 h-10 rounded-full bg-theme-primary flex items-center justify-center text-theme-surface-0 font-semibold text-lg',
  })

  const userName = cD({
    tagName: 'div',
    styles: 'text-theme-text-0 font-medium',
  })

  const logoutButton = cD({
    tagName: 'button',
    styles:
      'px-3 py-1.5 bg-theme-surface-2 hover:bg-theme-surface-3 text-theme-text-0 rounded-lg transition-colors text-sm font-medium',
    textContent: 'Cerrar sesión',
  })

  userDetails.append(userAvatar, userName)
  userInfo.append(userDetails, logoutButton)
  userSection.append(userInfo)

  return {
    element: userSection,
    userAvatar,
    userName,
    logoutButton,
  }
}
