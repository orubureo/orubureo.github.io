const toggle = document.getElementById("darkToggle");
const root = document.documentElement;

// load saved theme
const savedTheme = localStorage.getItem("theme") || "dark";

// apply theme on load
root.setAttribute("data-theme", savedTheme);

// sync toggle state
if (toggle) {
  toggle.checked = savedTheme === "dark";

  toggle.addEventListener("change", () => {
    const newTheme = toggle.checked ? "dark" : "light";

    root.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  });
}
