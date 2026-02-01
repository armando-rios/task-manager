export const Task = (task, onDelete, onEdit) => {
  const priorityClass =
    {
      low: 'bg-theme-priority-low/15 border-theme-priority-low',
      medium: 'bg-theme-priority-medium/15 border-theme-priority-medium',
      high: 'bg-theme-priority-high/15 border-theme-priority-high',
    }[task.priority] || 'bg-gray-500';

  const priorityTextClass =
    {
      low: 'text-theme-priority-low',
      medium: 'text-theme-priority-medium',
      high: 'text-theme-priority-high',
    }[task.priority] || 'text-gray-500';

  const taskItem = document.createElement('div');
  taskItem.id = task._id;
  taskItem.draggable = true;
  taskItem.className = `${priorityClass} py-2 px-4 rounded shadow-md flex flex-col gap-2 border-l-4 hover:bg-theme-surface-2 duration-200 justify-between`;

  const header = document.createElement('div');
  header.className = 'flex justify-between items-center';

  const title = document.createElement('h3');
  title.textContent = task.title;
  title.className = 'text-lg font-bold text-theme-text-0';

  const priority = document.createElement('span');
  priority.textContent = task.priority;
  priority.className = `${priorityClass} border ${priorityTextClass} text-sm font-bold rounded-xl px-2`;

  header.appendChild(title);
  header.appendChild(priority);

  const description = document.createElement('p');
  description.className =
    'text-sm font-medium truncate whitespace-nowrap overflow-hidden text-ellipsis w-full text-theme-text-1';
  description.textContent = task.description;
  description.title = task.description;

  const footer = document.createElement('div');
  footer.className = 'flex justify-between items-center';

  const date = document.createElement('span');
  date.textContent = task.dueDate || '-/-/-';
  date.className = 'text-sm text-theme-text-1';

  const buttonsContainer = document.createElement('div');
  const editBtn = document.createElement('button');
  editBtn.innerHTML = `
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"><path fill="currentColor" d="M6 2c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h4v-1.9l10-10V8l-6-6zm7 1.
5L18.5 9H13zm7.1 9.5c-.1 0-.3.1-.4.2l-1 1l2.1 2.1l1-1c.2-.2.2-.6 0-.8l-1.3-1.3c-.1-.1-.2-.2-.4-.2m-2 1.8L12 20.9V23h2.1l6.1-6.1z"/></svg>
  `;
  editBtn.className = 'edit-button hover:scale-120 hover:rotate-15 duration-200';

  editBtn.addEventListener('click', () => {
    onEdit(task);
  });

  const trashBtn = document.createElement('button');
  trashBtn.innerHTML = `
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"><path fill="currentColor" d="M9 3v1H4v2h1v13a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V6h1V4h-5V3zm0
5h2v9H9zm4 0h2v9h-2z"/></svg>
  `;
  trashBtn.className = 'delete-button hover:scale-120 hover:rotate-15 duration-200';

  trashBtn.addEventListener('click', async e => {
    e.stopPropagation();
    onDelete(task);
  });

  buttonsContainer.className = 'flex gap-2 text-theme-text-1';
  buttonsContainer.append(...[editBtn, trashBtn]);

  footer.append(...[date, buttonsContainer]);

  taskItem.append(...[header, description, footer]);

  return taskItem;
};
