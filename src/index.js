import './style.css';
import { Router } from './router/Router.js';
import { routes } from './router/routes.js';

document.addEventListener('DOMContentLoaded', async () => {
  // Initialize router as a global variable
  window.router = new Router(routes);

  // Navigate to current path
  await window.router.navigate(window.location.pathname, false);
});
