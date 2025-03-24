import { getUserProfile } from "../api/profileApi.js";

document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const userInfo = document.getElementById("userInfo");
  const logoutBtn = document.getElementById("logoutBtn");

  if (!token) {
    window.location.href = "index.html";
  }

  try {
    const profile = await getUserProfile(token);
    userInfo.innerHTML = `
      <p><strong>Username:</strong> ${profile.username}</p>
      <p><strong>Email:</strong> ${profile.email}</p>
      <p><strong>Role:</strong> ${role}</p>
    `;
  } catch (err) {
    userInfo.textContent = `Error: ${err.message}`;
  }

  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.location.href = "index.html";
  });
});
