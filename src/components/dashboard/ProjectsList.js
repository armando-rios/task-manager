import cD from '../../utils/createDocument.js'

export function ProjectsList() {
  const projectsSection = cD({
    tagName: 'div',
    styles: 'flex-1 overflow-hidden flex flex-col gap-2',
  })

  const projectsHeader = cD({
    tagName: 'h2',
    styles: 'text-theme-text-1 text-sm font-semibold uppercase tracking-wider',
    textContent: 'Proyectos',
  })

  const projectsContainer = cD({
    tagName: 'div',
    styles: 'flex flex-col gap-1 overflow-y-auto flex-1 h-full',
  })

  projectsSection.append(projectsHeader, projectsContainer)

  return {
    element: projectsSection,
    projectsContainer,
  }
}
