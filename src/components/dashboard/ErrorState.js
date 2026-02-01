import cD from '../../utils/createDocument.js';

export function ErrorState(container) {
  const errorState = cD({
    tagName: 'p',
    styles: 'px-3 py-4 text-center text-red-500 text-sm',
    textContent: 'Error al cargar proyectos',
  });

  container.appendChild(errorState);
}

export function EmptyState(container) {
  const emptyState = cD({
    tagName: 'p',
    styles: 'px-3 py-4 text-center text-theme-text-1 text-sm',
    textContent: 'No hay proyectos aún. ¡Crea tu primer proyecto!',
  });
  container.appendChild(emptyState);
}
