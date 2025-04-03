const API_URL = "http://localhost:5000";

document.addEventListener("DOMContentLoaded", () => {
  const registerForm = document.getElementById("registerForm");
  const registerMessage = document.getElementById("registerMessage");

  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;
    const password = document.getElementById("password").value;

    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, phone, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      registerMessage.textContent = data.message;
      registerMessage.classList.add("text-green-500");
      setTimeout(() => {
        registerMessage.textContent = "";
        registerMessage.classList.remove("text-green-500");
        window.location.href = "index.html";
      }, 1500);
    } catch (error) {
      registerMessage.textContent = error.message;
      registerMessage.classList.add("text-red-500");
    }
  });
});
