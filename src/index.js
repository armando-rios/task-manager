import "./style.css"
import { renderProjects } from "./views/renderProjects.js"
import { initSidebarController } from "./controllers/sidebarController.js"
import { initProjectModalController } from "./controllers/projectModalController.js"
import { initProjectListController } from "./controllers/projectListController.js"

document.addEventListener("DOMContentLoaded", () => {
  renderProjects()
  initSidebarController()
  initProjectModalController()
  initProjectListController()
})
