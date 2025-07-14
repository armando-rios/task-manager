import cD from '../../utils/createDocument.js'

export function Sidebar() {
  const sidebarContainer = cD({
    tagName: 'div',
    styles:
      'w-76 bg-theme-surface-0 p-4 border-r border-theme-surface-3 sm:flex flex flex-col',
  })

  return sidebarContainer
}
