import cD from '../../utils/createDocument.js'

/**
 * Creates a reusable input component with label
 * @param {Object} params - Input parameters
 * @param {string} params.label - Label text
 * @param {string} [params.type='text'] - Input type
 * @param {string} [params.placeholder=''] - Placeholder text
 * @param {boolean} [params.required=false] - Whether the input is required
 * @param {string} [params.name=''] - Input name attribute
 * @returns {Object} Object containing container element and input element
 */
export function Input({
  label,
  type = 'text',
  placeholder = '',
  required = false,
  name = '',
}) {
  const container = cD({
    tagName: 'div',
    styles: 'flex flex-col gap-2',
  })

  const labelElement = cD({
    tagName: 'label',
    textContent: label,
    styles: 'text-sm font-medium',
  })

  const inputStyles =
    'w-full px-4 py-2 bg-theme-surface-2 border border-theme-surface-3 rounded-md focus:outline-none focus:ring-2 focus:ring-theme-primary'

  const input = cD({
    tagName: 'input',
    styles: inputStyles,
    placeholder,
    type,
    required,
    name,
  })

  container.append(labelElement, input)

  return { container, input }
}
