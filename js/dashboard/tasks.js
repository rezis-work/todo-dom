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

  if (!token) return;

  async function fetchAndRenderTasks() {
    try {
      const tasks = await getUsertasks(token);
      renderTasksToDom(
        taskList,
        tasks,
        async (taskId) => {
          const task = tasks.find((t) => t._id === taskId);
          if (!task) return;
          await updateTask(token, taskId, { completed: !task.completed });
          await fetchAndRenderTasks();
        },
        async (taskid) => {
          await deleteTask(token, taskid);
          await fetchAndRenderTasks();
        }
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
      prioritySelect.value = "0";
      await fetchAndRenderTasks();
    } catch (err) {
      alert(err.message);
    }
  });

  fetchAndRenderTasks();
});
