const input = document.getElementById("taskInput");
const list = document.getElementById("taskList");
const addBtn = document.getElementById("addBtn");
const clearBtn = document.getElementById("clearBtn");
const categorySelect = document.getElementById("categorySelect");
const searchInput = document.getElementById("searchInput");
const themeBtn = document.getElementById("themeBtn");
const fontBtn = document.getElementById("fontBtn");
const fontPanel = document.getElementById("fontPanel");
const fontSelect = document.getElementById("fontSelect");
const fontSizeSelect = document.getElementById("fontSizeSelect");
const categoryBtns = document.querySelectorAll(".category-btn");
const filterIncompleteBtn = document.getElementById("filterIncompleteBtn");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentThemeIndex = 0;
const themes = ["", "theme-dark"];
let currentCategoryFilter = "Все";
let showOnlyIncomplete = false;

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function addTask() {
  const text = input.value.trim();
  if (!text) return;

  const now = new Date();
  const dateStr = now.toLocaleString();

  tasks.unshift({
    id: Date.now(),
    text: text,
    completed: false,
    category: categorySelect.value,
    date: dateStr
  });

  input.value = "";
  saveTasks();
  render();
}

input.addEventListener("keypress", e => {
  if (e.key === "Enter") addTask();
});
addBtn.addEventListener("click", addTask);

clearBtn.addEventListener("click", () => {
  tasks = [];
  saveTasks();
  render();
});

themeBtn.addEventListener("click", () => {
  currentThemeIndex = (currentThemeIndex + 1) % themes.length;
  document.body.className = themes[currentThemeIndex];
  localStorage.setItem("theme", themes[currentThemeIndex]);
});
document.body.className = localStorage.getItem("theme") || "";

fontBtn.addEventListener("click", () => {
  fontPanel.style.display = fontPanel.style.display === "block" ? "none" : "block";
});

fontSelect.addEventListener("change", () => {
  document.body.style.setProperty("--font", fontSelect.value);
  localStorage.setItem("font", fontSelect.value);
});
fontSizeSelect.addEventListener("change", () => {
  document.body.style.fontSize = fontSizeSelect.value;
  localStorage.setItem("fontSize", fontSizeSelect.value);
});

const savedFont = localStorage.getItem("font");
if (savedFont) document.body.style.setProperty("--font", savedFont);
const savedFontSize = localStorage.getItem("fontSize");
if (savedFontSize) document.body.style.fontSize = savedFontSize;

categoryBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    currentCategoryFilter = btn.dataset.category;
    categoryBtns.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    render();
  });
});

filterIncompleteBtn.addEventListener("click", () => {
  showOnlyIncomplete = !showOnlyIncomplete;
  filterIncompleteBtn.textContent = showOnlyIncomplete ? "Все задачи" : "Невыполненные";
  render();
});

searchInput.addEventListener("input", render);

function render() {
  list.innerHTML = "";
  const query = searchInput.value.toLowerCase();

  tasks
    .filter(task =>
      (currentCategoryFilter === "Все" || task.category === currentCategoryFilter) &&
      task.text.toLowerCase().includes(query) &&
      (!showOnlyIncomplete || !task.completed)
    )
    .forEach(task => {
      const li = document.createElement("li");

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = task.completed;
      checkbox.addEventListener("change", () => {
        task.completed = checkbox.checked;
        saveTasks();
        render();
      });

      const span = document.createElement("span");
      span.textContent = task.text;
      if (task.completed) span.classList.add("completed");

      const category = document.createElement("small");
      category.textContent = task.category;

      const dateSpan = document.createElement("span");
      dateSpan.textContent = task.date;
      dateSpan.className = "task-date";

      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "Удалить";
      deleteBtn.addEventListener("click", () => {
        tasks = tasks.filter(t => t.id !== task.id);
        saveTasks();
        render();
      });

      li.append(checkbox, span, category, dateSpan, deleteBtn);
      list.appendChild(li);
    });
}

render();
