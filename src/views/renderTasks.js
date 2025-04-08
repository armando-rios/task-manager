import { Task } from "../components/Task.js"
import { initTasksController } from "../controllers/tasksController.js"

const activeFilters = {
  currentProjectId: null,
  currentFilter: 'all'
};

export const renderTasks = (projectId) => {
  activeFilters.currentProjectId = projectId;
  activeFilters.currentFilter = 'all';

  document.querySelectorAll("#filters [data-filter]").forEach(btn => {
    btn.classList.remove("bg-theme-surface-2");
  });

  const allFilterBtn = document.querySelector("#filters [data-filter='all']");
  if (allFilterBtn) allFilterBtn.classList.add("bg-theme-surface-2");

  renderFilteredTasks(projectId, 'all');
}

export const renderFilteredTasks = (projectId, filterType = 'all') => {
  const tasksDB = JSON.parse(localStorage.getItem("tasks")) || [];

  let filteredTasks = tasksDB.filter((task) => task.projectId === projectId);

  if (filterType !== 'all') {
    filteredTasks = filteredTasks.filter((task) => task.priority === filterType);
  }

  activeFilters.currentProjectId = projectId;
  activeFilters.currentFilter = filterType;

  const tasksList = document.querySelector("#tasks-container");
  if (!tasksList) return;

  tasksList.innerHTML = "";
  tasksList.addEventListener("click", initTasksController);

  if (filteredTasks.length === 0) {
    const noTasks = document.createElement("p");
    if (filterType === 'all') {
      noTasks.textContent = "There are no tasks in this project.";
    } else {
      noTasks.textContent = `There are no tasks with priority ${filterType} in this project`;
    }
    tasksList.appendChild(noTasks);
    return;
  }

  tasksList.className = "flex flex-col gap-4 overflow-y-auto flex-1 min-h-0";

  filteredTasks.forEach((task) => {
    tasksList.append(Task(task));
  });
}
