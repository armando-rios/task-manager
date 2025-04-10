let draggedItem = null;
let draggedItemIndex = null;

export function initDragDropController() {
  const tasksContainer = document.querySelector("#tasks-container");
  if (!tasksContainer) return;

  const tasks = tasksContainer.querySelectorAll('.task');

  tasks.forEach((task) => {
    task.addEventListener('dragstart', handleDragStart);

    task.addEventListener('dragover', handleDragOver);

    task.addEventListener('drop', handleDrop);

    task.addEventListener('dragenter', handleDragEnter);

    task.addEventListener('dragleave', handleDragLeave);

    task.addEventListener('dragend', handleDragEnd);
  });

  tasksContainer.addEventListener('dragover', function(e) {
    e.preventDefault();
  });

  tasksContainer.addEventListener('drop', function(e) {
    e.preventDefault();
    if (tasksContainer.children.length === 0 ||
      e.clientY > tasksContainer.lastElementChild.getBoundingClientRect().bottom) {
      tasksContainer.appendChild(draggedItem);
      saveTasksOrder();
    }
  });
}

function handleDragStart(e) {
  draggedItem = this;
  const tasksContainer = document.querySelector("#tasks-container");
  draggedItemIndex = Array.from(tasksContainer.children).indexOf(this);

  setTimeout(() => {
    this.classList.add('dragging');
  }, 0);

  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/html', this.innerHTML);
}

function handleDragOver(e) {
  e.preventDefault();
  e.dataTransfer.dropEffect = 'move';
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

  if (draggedItem !== this) {
    const tasksContainer = document.querySelector("#tasks-container");
    // const targetIndex = Array.from(tasksContainer.children).indexOf(this);

    const rect = this.getBoundingClientRect();
    const middleY = rect.top + rect.height / 2;

    if (e.clientY < middleY) {
      tasksContainer.insertBefore(draggedItem, this);
    } else {
      tasksContainer.insertBefore(draggedItem, this.nextSibling);
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
}

function saveTasksOrder() {
  const tasksContainer = document.querySelector("#tasks-container");
  const taskIds = Array.from(tasksContainer.children)
    .filter(el => el.classList.contains('task')) // Solo consideramos elementos que son tareas
    .map(task => task.id);

  const tasksDB = JSON.parse(localStorage.getItem("tasks")) || [];

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

  localStorage.setItem("tasks", JSON.stringify(orderedTasks));

  console.log('Orden de tareas guardado');
}
