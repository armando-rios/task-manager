import './style.css'
import { Router } from './router/Router.js'
import { routes } from './router/routes.js'
import { initDevTools } from './utils/devTools.js'

document.addEventListener('DOMContentLoaded', async () => {
  // Initialize development tools
  initDevTools()

  // Initialize router as a global variable
  window.router = new Router(routes)

  // Navigate to current path
  await window.router.navigate(window.location.pathname, false)
})
