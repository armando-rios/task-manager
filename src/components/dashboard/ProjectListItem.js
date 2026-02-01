import cD from '../../utils/createDocument.js';
import { Modal } from '../common/Modal.js';

/**
 * Creates a project list item component.
 * @param {object} project - The project data object.
 * @param {boolean} isActive - Whether the project is currently active.
 * @param {function} onDelete - Callback function to execute when delete is clicked.
 * @param {function} onSelect - Callback function to execute when the item is selected.
 * @returns {HTMLElement} The project list item element.
 */
export function createProjectListItem(project, activeProject, onDelete, onSelect) {
  let isActive = activeProject === project._id;

  const projectElement = cD({
    tagName: 'button',
    styles: `px-3 py-2 rounded-lg flex justify-between items-center cursor-pointer transition-colors text-start
w-full ${isActive ? 'bg-theme-surface-2 text-theme-primary' : 'text-theme-text-2 hover:bg-theme-surface-2'}`,
    textContent: project.name,
  });

  const deleteButton = cD({
    tagName: 'button',
    styles: 'hover:scale-110 text-transparent hover:text-red-500 duration-200 p-1 rounded-md',
    innerHTML: `
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"><path fill="currentColor" d="M9 3v1H4v2h1v13a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V6h1V4h-5V3zm0
5h2v9H9zm4 0h2v9h-2z"/></svg>
  `,
  });

  deleteButton.addEventListener('click', async event => {
    event.stopPropagation(); // Prevent triggering project selection

    Modal({
      title: '¿Eliminar Proyecto?',
      message: `¿Estás seguro de que quieres eliminar?`,
      submitText: 'Eliminar',
      cancelText: 'Cancelar',
      onSubmit: async () => {
        await onDelete(project._id);
      },
    });
  });

  projectElement.appendChild(deleteButton);

  // Add data attribute
  projectElement.dataset.projectId = project._id;

  projectElement.addEventListener('click', () => {
    onSelect(project);
  });

  return projectElement;
}
