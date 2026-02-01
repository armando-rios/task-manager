let draggedItem = null;
let draggedItemIndex = null;
let placeholder = null;

export function initDragDropController() {
  const tasksContainer = document.querySelector('#tasks-container');
  if (!tasksContainer) return;

  const tasks = tasksContainer.querySelectorAll('.task');

  tasks.forEach(task => {
    task.addEventListener('dragstart', handleDragStart);

    task.addEventListener('dragover', handleDragOver);

    task.addEventListener('drop', handleDrop);

    task.addEventListener('dragenter', handleDragEnter);

    task.addEventListener('dragleave', handleDragLeave);

    task.addEventListener('dragend', handleDragEnd);
  });

  tasksContainer.addEventListener('dragover', function (e) {
    e.preventDefault();
    if (!placeholder) return;
    // Si el mouse está debajo de la última tarea, mueve el placeholder al final
    if (
      tasksContainer.children.length > 0 &&
      e.clientY > tasksContainer.lastElementChild.getBoundingClientRect().bottom
    ) {
      tasksContainer.appendChild(placeholder);
    }
  });

  tasksContainer.addEventListener('drop', function (e) {
    e.preventDefault();
    if (placeholder && draggedItem) {
      tasksContainer.insertBefore(draggedItem, placeholder);
      placeholder.remove();
      placeholder = null;
      saveTasksOrder();
    } else if (
      tasksContainer.children.length === 0 ||
      e.clientY > tasksContainer.lastElementChild.getBoundingClientRect().bottom
    ) {
      tasksContainer.appendChild(draggedItem);
      saveTasksOrder();
    }
  });
}

function handleDragStart(e) {
  draggedItem = this;
  const tasksContainer = document.querySelector('#tasks-container');
  draggedItemIndex = Array.from(tasksContainer.children).indexOf(this);

  // Crear el placeholder visual
  placeholder = document.createElement('div');
  placeholder.className = 'task-placeholder';
  placeholder.style.height = `${this.offsetHeight}px`;
  placeholder.style.background = 'var(--color-theme-primary, #CBA6F7)';
  placeholder.style.opacity = '0.18';
  placeholder.style.border = '2.5px dashed var(--color-theme-primary, #CBA6F7)';
  placeholder.style.borderRadius = '0.5rem';
  placeholder.style.margin = '0.25rem 0';

  setTimeout(() => {
    this.classList.add('dragging');
    // Insertar el placeholder en la posición original
    tasksContainer.insertBefore(placeholder, this.nextSibling);
  }, 0);

  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/html', this.innerHTML);
}

function handleDragOver(e) {
  e.preventDefault();
  e.dataTransfer.dropEffect = 'move';

  const tasksContainer = document.querySelector('#tasks-container');
  if (!placeholder) return false;

  // Encuentra la tarea sobre la que está el mouse
  const tasks = Array.from(tasksContainer.querySelectorAll('.task:not(.dragging)'));
  let insertBeforeNode = null;
  for (const task of tasks) {
    const rect = task.getBoundingClientRect();
    const middleY = rect.top + rect.height / 2;
    if (e.clientY < middleY) {
      insertBeforeNode = task;
      break;
    }
  }

  if (insertBeforeNode) {
    if (insertBeforeNode !== placeholder.nextSibling) {
      tasksContainer.insertBefore(placeholder, insertBeforeNode);
    }
  } else {
    // Si no hay tarea debajo, mueve el placeholder al final
    if (tasksContainer.lastElementChild !== placeholder) {
      tasksContainer.appendChild(placeholder);
    }
  }

  return false;
}

function handleDragEnter(e) {
  this.classList.add('drag-over');
}

function handleDragLeave(e) {
  this.classList.remove('drag-over');
}

function handleDrop(e) {
  e.stopPropagation(); // Detener propagación del evento

  const tasksContainer = document.querySelector('#tasks-container');
  if (draggedItem !== this) {
    // Inserta el draggedItem en la posición del placeholder
    if (placeholder) {
      tasksContainer.insertBefore(draggedItem, placeholder);
      placeholder.remove();
      placeholder = null;
    } else {
      // Fallback clásico
      const rect = this.getBoundingClientRect();
      const middleY = rect.top + rect.height / 2;

      if (e.clientY < middleY) {
        tasksContainer.insertBefore(draggedItem, this);
      } else {
        tasksContainer.insertBefore(draggedItem, this.nextSibling);
      }
    }
    saveTasksOrder();
  }

  return false;
}

function handleDragEnd(e) {
  this.classList.remove('dragging');

  const tasks = document.querySelectorAll('.task');
  tasks.forEach(task => {
    task.classList.remove('drag-over');
  });

  // Elimina el placeholder si existe
  if (placeholder && placeholder.parentNode) {
    placeholder.remove();
    placeholder = null;
  }
}

function saveTasksOrder() {
  const tasksContainer = document.querySelector('#tasks-container');
  const taskIds = Array.from(tasksContainer.children)
    .filter(el => el.classList.contains('task')) // Solo consideramos elementos que son tareas
    .map(task => task.id);

  const tasksDB = JSON.parse(localStorage.getItem('tasks')) || [];

  const orderedTasks = [];

  taskIds.forEach(id => {
    const task = tasksDB.find(t => t.id === id);
    if (task) {
      orderedTasks.push(task);
    }
  });

  tasksDB.forEach(task => {
    if (!taskIds.includes(task.id)) {
      orderedTasks.push(task);
    }
  });

  localStorage.setItem('tasks', JSON.stringify(orderedTasks));

  console.log('Orden de tareas guardado');
}
