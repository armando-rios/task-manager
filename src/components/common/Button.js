import cD from '../../utils/createDocument.js';

/**
 * Creates a reusable button component
 * @param {Object} params - Button parameters
 * @param {string} params.text - Button text
 * @param {string} [params.type='button'] - Button type
 * @param {string} [params.variant='primary'] - Button variant (primary, secondary)
 * @param {Function} [params.onClick] - Click handler
 * @returns {HTMLButtonElement} Button element
 */
export function Button({ text, type = 'button', variant = 'primary', onClick }) {
  const baseStyles =
    'p-3 rounded-md transition-colors font-bold focus:outline-none focus:ring-2 focus:ring-theme-primary';

  const variantStyles = {
    primary: 'bg-theme-primary text-white hover:bg-theme-primary-dark',
    secondary:
      'bg-theme-surface-2 text-theme-text-0 hover:bg-theme-surface-3 border border-theme-surface-3',
  };

  const button = cD({
    tagName: 'button',
    styles: `${baseStyles} ${variantStyles[variant]}`,
    textContent: text,
    type,
  });

  if (onClick) {
    button.addEventListener('click', onClick);
  }

  return button;
}
