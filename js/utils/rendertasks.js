export function renderTasksToDom(taskListEl, tasks) {
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
       <p class="text-sm>Completed: ${task.completed ? "✅" : "🚫"}</p>
       <p class="yexy-xs text-gray-500>Created: ${new Date(
         task.createdAt
       ).toLocaleString()}</p>
      </div>
      `;
    })
    .join("");
}
