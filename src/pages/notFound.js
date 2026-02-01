import cD from '../utils/createDocument.js';

/**
 * Creates the 404 Not Found page
 * @returns {HTMLElement} 404 page element
 */
export default function notFound() {
  const container = cD({
    tagName: 'div',
    styles: 'min-h-screen bg-theme-surface-1 flex items-center justify-center',
  });

  const content = cD({
    tagName: 'div',
    styles:
      'max-w-md w-full mx-auto p-8 bg-theme-surface-0 rounded-lg shadow-md border border-theme-surface-3 text-center',
  });

  const errorCode = cD({
    tagName: 'h1',
    styles: 'text-6xl font-bold text-theme-primary mb-4',
    textContent: '404',
  });

  const errorTitle = cD({
    tagName: 'h2',
    styles: 'text-2xl font-semibold mb-4 text-theme-text-0',
    textContent: 'Page Not Found',
  });

  const errorText = cD({
    tagName: 'p',
    styles: 'text-theme-text-1 mb-8',
    textContent: "Sorry, the page you're looking for doesn't exist or has been moved.",
  });

  const homeLink = cD({
    tagName: 'a',
    styles:
      'inline-block px-6 py-3 bg-theme-primary text-white rounded-md hover:bg-theme-primary-dark transition-colors font-bold',
    textContent: 'Go to Dashboard',
    href: '/',
  });
  homeLink.setAttribute('data-link', '');

  content.append(errorCode, errorTitle, errorText, homeLink);
  container.appendChild(content);

  return container;
}
