import cD from '../../utils/createDocument.js'

export function PriorityFilters() {
  const filtersSection = cD({
    tagName: 'div',
    styles:
      'border-theme-surface-3 border-y sm:border-b-0 border-theme-surface-3 py-4 flex-shrink-0',
  })

  const filtersHeader = cD({
    tagName: 'div',
    styles:
      'text-theme-text-1 text-sm font-semibold uppercase tracking-wider mb-3 px-1',
    textContent: 'Filtrar por prioridad',
  })

  const filtersContainer = cD({
    tagName: 'div',
    styles: 'flex flex-col gap-1',
  })

  // Low priority filter
  const filterLow = cD({
    tagName: 'button',
    styles:
      'px-3 py-2 rounded-lg text-left flex items-center gap-2 hover:bg-theme-surface-2 transition-colors',
  })

  const filterLowDot = cD({
    tagName: 'div',
    styles: 'w-3 h-3 rounded-full bg-theme-priority-low',
  })

  const filterLowText = cD({
    tagName: 'span',
    styles: 'text-theme-text-0 text-sm',
    textContent: 'Baja',
  })

  filterLow.append(filterLowDot, filterLowText)

  // Medium priority filter
  const filterMedium = cD({
    tagName: 'button',
    styles:
      'px-3 py-2 rounded-lg text-left flex items-center gap-2 hover:bg-theme-surface-2 transition-colors',
  })

  const filterMediumDot = cD({
    tagName: 'div',
    styles: 'w-3 h-3 rounded-full bg-theme-priority-medium',
  })

  const filterMediumText = cD({
    tagName: 'span',
    styles: 'text-theme-text-0 text-sm',
    textContent: 'Media',
  })

  filterMedium.append(filterMediumDot, filterMediumText)

  // High priority filter
  const filterHigh = cD({
    tagName: 'button',
    styles:
      'px-3 py-2 rounded-lg text-left flex items-center gap-2 hover:bg-theme-surface-2 transition-colors',
  })

  const filterHighDot = cD({
    tagName: 'div',
    styles: 'w-3 h-3 rounded-full bg-theme-priority-high',
  })

  const filterHighText = cD({
    tagName: 'span',
    styles: 'text-theme-text-0 text-sm',
    textContent: 'Alta',
  })

  filterHigh.append(filterHighDot, filterHighText)

  // All tasks filter
  const filterAll = cD({
    tagName: 'button',
    styles:
      'px-3 py-2 rounded-lg text-left flex items-center gap-2 hover:bg-theme-surface-2 transition-colors border border-theme-surface-3 mt-2',
  })

  const filterAllText = cD({
    tagName: 'span',
    styles: 'text-theme-text-0 text-sm font-medium',
    textContent: 'Todas las tareas',
  })

  filterAll.append(filterAllText)

  filtersContainer.append(filterLow, filterMedium, filterHigh, filterAll)
  filtersSection.append(filtersHeader, filtersContainer)

  return {
    element: filtersSection,
    filterLow,
    filterMedium,
    filterHigh,
    filterAll,
  }
}
