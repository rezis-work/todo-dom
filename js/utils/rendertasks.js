export function renderTasksToDom(taskListEl, tasks, onComplate, onDelete) {
  if (tasks.length === 0) {
    taskListEl.innerHTML =
      "<p class='text-gray-500 text-center'>No tasks found</p>";
    return;
  }

  taskListEl.innerHTML = tasks
    .map((task) => {
      return `
      <div class="p-4 bg-white border rounded shadow-sm">
         <h3 class="font-semibold text-lg">${task.task}</h3>
         <p class="font-semibold text-lg">Priority:${task.priority}</p>
         <p class="text-sm">Completed: ${task.completed ? "✅" : "🚫"}</p>
         <p class="text-xs text-gray-500">Created: ${new Date(
           task.createdAt
         ).toLocaleString()}</p>


         <div class="flex gap-2">
          <button data-id="${
            task._id
          }" class="complete-btn text-sm text-white bg-green-500 px-3 py-1 rounded hover:bg-green-600">
            ${task.completed ? "Undo" : "Complete"}
          </button>
          <button data-id="${
            task._id
          }" class="delete-btn text-sm text-white bg-red-500 px-3 py-1 rounded hover:bg-red-600">Delete</button>
         </div>
      </div>
      `;
    })
    .join("");

  taskListEl.querySelectorAll(".complete-btn").forEach((btn) => {
    btn.addEventListener("click", async () => onComplate(btn.dataset.id));
  });

  taskListEl.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.addEventListener("click", async () => onDelete(btn.dataset.id));
  });
}
