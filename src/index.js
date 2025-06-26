import './style.css'
import { renderProjects } from './views/renderProjects.js'
import { initSidebarController } from './controllers/sidebarController.js'
import { initProjectModalController } from './controllers/projectModalController.js'
import { initProjectListController } from './controllers/projectListController.js'
import { initThemeSwitcher } from './controllers/themeSwitcher.js'
import { initFilterController } from './controllers/filterController.js'

document.addEventListener('DOMContentLoaded', async () => {
  await renderProjects()
  initSidebarController()
  initProjectModalController()
  initProjectListController()
  initThemeSwitcher()
  initFilterController()
})
