import {
  createTask,
  getUsertasks,
  updateTask,
  deleteTask,
} from "../api/tasksApi.js";
import { renderTasksToDom } from "../utils/rendertasks.js";

document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token");
  const taskList = document.getElementById("taskList");
  const taskForm = document.getElementById("taskForm");
  const taskInput = document.getElementById("taskInput");
  const prioritySelect = document.getElementById("priorityInput");

  const editModal = document.getElementById("editModal");
  const editForm = document.getElementById("editForm");
  const editTaskName = document.getElementById("editTaskName");
  const editPriority = document.getElementById("editPriority");
  const cancelEdit = document.getElementById("cancelEdit");

  const completedFilter = document.getElementById("completedFilter");
  const sortOrder = document.getElementById("sortOrder");
  const searchInput = document.getElementById("searchInput");

  let editingTaskId = null;

  async function handleComplete(tasks, taskId) {
    const task = tasks.find((t) => t._id === taskId);
    if (!task) return;
    await updateTask(token, taskId, { completed: !task.completed });
    await fetchAndRenderTasks();
  }

  async function handleDelete(tasks, taskId) {
    const task = tasks.find((t) => t._id === taskId);
    if (!task) return;
    await deleteTask(token, taskId);
    await fetchAndRenderTasks();
  }

  async function handleEdit(tasks, taskId) {
    const task = tasks.find((t) => t._id === taskId);
    if (!task) return;
    editingTaskId = taskId;
    editTaskName.value = task.task;
    editPriority.value = task.priority;
    editModal.classList.remove("hidden");
  }

  if (!token) return;

  async function fetchAndRenderTasks() {
    try {
      const filters = {
        completed: completedFilter.value,
        sort: sortOrder.value,
      };
      const tasks = await getUsertasks(token, filters);

      let filteredTasks = [...tasks];
      const searchTerm = searchInput.value.trim().toLowerCase();
      if (searchTerm) {
        filteredTasks = filteredTasks.filter((task) =>
          task.task.toLowerCase().includes(searchTerm)
        );
      }

      renderTasksToDom(
        taskList,
        filteredTasks,
        async (taskId) => handleComplete(tasks, taskId),
        async (taskId) => handleDelete(tasks, taskId),
        async (taskId) => handleEdit(tasks, taskId)
      );
    } catch (err) {
      taskList.innerHTML = `<p class='text-red-500 text-center'>${err.message}</p>`;
    }
  }

  taskForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const tasktext = taskInput.value.trim();
    const priority = parseInt(prioritySelect.value);

    if (!tasktext) return;

    try {
      await createTask(token, { task: tasktext, priority });
      taskInput.value = "";
      prioritySelect.value = "1";
      await fetchAndRenderTasks();
    } catch (err) {
      alert(err.message);
    }
  });

  editForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    console.log("editForm submitted");
    if (!editingTaskId) return;

    try {
      const updateName = editTaskName.value.trim();
      const updatePriority = parseInt(editPriority.value);
      await updateTask(token, editingTaskId, {
        task: updateName,
        priority: updatePriority,
      });

      editingTaskId = null;
      editModal.classList.add("hidden");
      await fetchAndRenderTasks();
    } catch (error) {
      alert(error.message);
    }
  });

  cancelEdit.addEventListener("click", () => {
    editingTaskId = null;
    editModal.classList.add("hidden");
  });

  searchInput.addEventListener("input", () => {
    fetchAndRenderTasks();
  });

  completedFilter.addEventListener("change", () => {
    fetchAndRenderTasks();
  });

  sortOrder.addEventListener("change", () => {
    fetchAndRenderTasks();
  });

  fetchAndRenderTasks();
});
