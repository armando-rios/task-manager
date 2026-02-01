import cD from '../../utils/createDocument.js';

export function ProjectsList() {
  const projectsSection = cD({
    tagName: 'div',
    styles: 'flex flex-col gap-2 min-h-0 flex-1 overflow-hidden',
  });

  const projectsHeader = cD({
    tagName: 'h2',
    styles: 'text-theme-text-1 text-sm font-semibold uppercase tracking-wider flex-shrink-0',
    textContent: 'Proyectos',
  });

  const projectsContainer = cD({
    tagName: 'div',
    id: 'projects-list',
    styles: 'flex flex-col gap-1 overflow-y-auto flex-1 min-h-0',
  });

  projectsSection.append(projectsHeader, projectsContainer);

  return {
    element: projectsSection,
    container: projectsContainer,
  };
}
