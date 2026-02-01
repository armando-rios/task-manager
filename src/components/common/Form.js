import cD from '../../utils/createDocument.js';
import { Input } from './Input.js';

/**
 * Create a dynamic form with inputs
 * @param {Object} config - Configuration object for the form
 * @param {string} config.id - The ID of the form
 * @param {Array} config.inputs - Array of input configuration objects
 * @param {Function} config.onSubmit - Callback function to handle form submission
 * @param {string} [config.submitText='Submit'] - Text for the submit button
 * @param {string} [config.cancelText='Cancel'] - Text for the cancel button
 * @param {Function} [config.onCancel] - Callback function to handle cancel action
 * @returns {HTMLElement} The generated form element
 */
export const Form = ({
  id,
  inputs = [],
  onSubmit,
  submitText = 'Submit',
  cancelText = 'Cancel',
  onCancel,
}) => {
  const form = cD({
    tagName: 'form',
    id: id,
    styles: 'flex flex-col gap-4',
  });

  // Generate inputs
  inputs.forEach(inputConfig => {
    const input = Input(inputConfig);
    form.appendChild(input);
  });

  // Buttons container
  const buttonsContainer = cD({
    tagName: 'div',
    styles: 'flex gap-2 justify-end mt-2',
  });

  // Cancel button
  if (onCancel) {
    const cancelButton = cD({
      tagName: 'button',
      type: 'button',
      styles:
        'px-4 py-2 bg-theme-surface-2 text-theme-text-0 rounded-md hover:bg-theme-surface-3 transition-colors',
      textContent: cancelText,
    });

    cancelButton.addEventListener('click', onCancel);
    buttonsContainer.appendChild(cancelButton);
  }

  // Submit button
  const submitButton = cD({
    tagName: 'button',
    type: 'submit',
    styles:
      'px-4 py-2 bg-theme-primary text-theme-surface-0 font-semibold rounded-md hover:bg-opacity-90 transition-colors',
    textContent: submitText,
  });

  buttonsContainer.appendChild(submitButton);
  form.appendChild(buttonsContainer);

  // Handle submit
  form.addEventListener('submit', e => {
    e.preventDefault();

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    if (onSubmit) {
      onSubmit(data);
    }
  });

  return form;
};
