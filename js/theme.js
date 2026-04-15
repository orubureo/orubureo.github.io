const toggle = document.getElementById("darkToggle");
const savedTheme = localStorage.getItem("theme");

if (savedTheme) {
  document.documentElement.setAttribute("data-theme", savedTheme);
  if (toggle && savedTheme === "dark") toggle.checked = true;
}

if (toggle) {
  toggle.addEventListener("change", () => {
    const newTheme = toggle.checked ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  });
}
