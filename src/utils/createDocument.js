// add jsdocs
/**
 * Creates a new HTML element with specified type, styles, and text content.
 * @param {Object} params - The parameters for creating the element.
 * @param {string} params.tagName - The type of the HTML element to create (e.g., 'div', 'h1').
 * @param {string} [params.styles] - Optional CSS class names to apply to the element.
 * @param {object} [props] - Other properties to set on the element (e.g., textContent, id).
 * @returns {HTMLElement} The newly created HTML element.
 */
export default function createElement({ tagName, styles, ...props }) {
  const element = document.createElement(tagName)

  if (styles) {
    element.className = styles
  }

  Object.assign(element, props)

  return element
}
