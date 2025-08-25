import cD from '../../utils/createDocument.js'
import { Logout } from '../common/LogoutButton.js'

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

  const logout = Logout()

  userDetails.append(userAvatar, userName)
  userInfo.append(userDetails, logout)
  userSection.append(userInfo)

  return {
    element: userSection,
    userAvatar,
    userName,
    logout,
  }
}
