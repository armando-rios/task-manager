import cD from '../../utils/createDocument.js'

/**
 * Create a single input field with label
 * @param {Object} props - The properties for the input component
 * @param {string} props.label - The label text for the input
 * @param {string} [props.type='text'] - The type of the input (e.g., 'text', 'email', 'password', 'textarea')
 * @param {string} props.name - The name and id for the input element
 * @param {string} [props.placeholder=''] - The placeholder text for the input
 * @param {boolean} [props.required=false] - Whether the input is required
 * @param {string} [props.value=''] - The default value for the input
 * @returns {HTMLElement} The input group element containing the label and input
 */
export const Input = ({
  label,
  type = 'text',
  name,
  placeholder = '',
  required = false,
  value = '',
}) => {
  const inputGroup = cD({
    tagName: 'div',
    styles: 'flex flex-col gap-1',
  })

  const labelElement = cD({
    tagName: 'label',
    styles: 'text-theme-text-1 text-sm font-medium',
    textContent: label,
  })
  labelElement.htmlFor = name

  let inputElement

  if (type === 'textarea') {
    inputElement = cD({
      tagName: 'textarea',
      id: name,
      name: name,
      styles:
        'px-3 py-2 bg-theme-surface-1 text-theme-text-0 rounded-md border border-theme-surface-3 focus:outline-none focus:ring-2 focus:ring-theme-primary resize-none',
      placeholder: placeholder,
    })
    inputElement.rows = 3
    inputElement.value = value
  } else {
    inputElement = cD({
      tagName: 'input',
      type: type,
      id: name,
      name: name,
      styles:
        'px-3 py-2 bg-theme-surface-1 text-theme-text-0 rounded-md border border-theme-surface-3 focus:outline-none focus:ring-2 focus:ring-theme-primary',
      placeholder: placeholder,
    })
    inputElement.value = value
  }

  if (required) {
    inputElement.required = true
  }

  inputGroup.append(labelElement, inputElement)

  return inputGroup
}
