/**
 * Simple SPA Router with guard support
 */
export class Router {
  constructor(routes) {
    this.routes = routes;
    this.currentRoute = null;

    // Listen to browser back/forward buttons
    window.addEventListener('popstate', () => {
      this.navigate(window.location.pathname, false);
    });

    // Intercept clicks on links with data-link attribute
    document.addEventListener('click', e => {
      if (e.target.matches('[data-link]') || e.target.closest('[data-link]')) {
        e.preventDefault();
        const link = e.target.matches('[data-link]') ? e.target : e.target.closest('[data-link]');
        this.navigate(link.getAttribute('href'));
      }
    });
  }

  /**
   * Navigate to a path
   * @param {string} path - Path to navigate to
   * @param {boolean} pushState - Whether to push to history
   */
  async navigate(path, pushState = true) {
    // Mostrar loading
    const loading = document.getElementById('loading');
    loading?.classList.remove('hidden');
    try {
      // Find matching route
      const route = this.matchRoute(path);
      if (!route) {
        console.error('No route found for path:', path);
        return;
      }
      // Execute guard if exists
      if (route.guard) {
        const canActivate = await route.guard();
        if (!canActivate) {
          const redirectPath = route.redirectOnFail || '/auth';
          if (path !== redirectPath) {
            return this.navigate(redirectPath, true);
          }
          return;
        }
      }
      // Update browser URL
      if (pushState && window.location.pathname !== path) {
        window.history.pushState({}, '', path);
      }
      // Render page
      const page = await route.component();
      const app = document.getElementById('app');
      app.innerHTML = '';
      app.appendChild(page);
      this.currentRoute = route;
      // Call afterEnter hook if exists
      if (route.afterEnter) {
        route.afterEnter();
      }
    } catch (error) {
      console.error('Navigation error:', error);
    } finally {
      // Ocultar loading siempre (éxito o error)
      loading?.classList.add('hidden');
    }
  }

  /**
   * Match route by path
   * @param {string} path - Path to match
   * @returns {Object} Matched route
   */
  matchRoute(path) {
    // Try exact match first
    const exactMatch = this.routes.find(r => r.path === path);
    if (exactMatch) return exactMatch;

    // Try wildcard match
    return this.routes.find(r => r.path === '*');
  }

  /**
   * Get current path
   * @returns {string} Current path
   */
  getCurrentPath() {
    return window.location.pathname;
  }
}
