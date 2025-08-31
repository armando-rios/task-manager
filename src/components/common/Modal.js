import cD from '../../utils/createDocument.js'
import { Form } from './Form.js'

/**
 * Create a modal overlay
 * @param {Object} options - Modal configuration
 * @param {string} options.title - Modal title
 * @param {Array} options.inputs - Array of input configurations for the form
 * @param {Function} options.onSubmit - Callback for form submission
 * @param {string} options.submitText - Text for the submit button
 * @param {string} options.cancelText - Text for the cancel button
 * @returns {Object} - Modal element and close function
 */
export const Modal = ({
  title,
  inputs = [],
  onSubmit,
  submitText = 'Submit',
  cancelText = 'Cancel',
}) => {
  // Modal overlay
  const modal = cD({
    tagName: 'div',
    id: 'modal',
    styles:
      'fixed inset-0 bg-theme-surface-1/50 flex justify-center items-center z-50',
  })

  // Modal content
  const content = cD({
    tagName: 'div',
    styles:
      'bg-theme-surface-0 p-6 rounded-lg shadow-xl flex flex-col gap-4 min-w-96',
  })

  // Title
  const titleElement = cD({
    tagName: 'h2',
    styles: 'text-xl text-theme-primary font-bold',
    textContent: title,
  })

  // Close modal function
  function closeModal() {
    modal.remove()
    document.removeEventListener('keydown', handleEscape)
  }

  // Form with auto-close on submit
  const form = Form({
    id: `${title.toLowerCase().replace(/\s+/g, '-')}-form`,
    inputs,
    submitText,
    cancelText,
    onSubmit: (data) => {
      if (onSubmit) {
        onSubmit(data)
      }
      closeModal()
    },
    onCancel: closeModal,
  })

  // Close on overlay click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal()
    }
  })

  // Close on Escape
  const handleEscape = (e) => {
    if (e.key === 'Escape') {
      closeModal()
    }
  }
  document.addEventListener('keydown', handleEscape)

  // Assemble
  content.append(titleElement, form)
  modal.appendChild(content)
  document.body.appendChild(modal)

  // Focus first input
  setTimeout(() => {
    const firstInput = form.querySelector('input, textarea')
    if (firstInput) firstInput.focus()
  }, 0)

  return {
    element: modal,
    close: closeModal,
  }
}
