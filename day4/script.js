const noteText = document.getElementById("note-text");
const charCount = document.getElementById("char-count");
const wordCount= document.getElementById("word-count");
const clearBtn = document.getElementById("clear-btn");
const themeToggle = document.getElementById("theme-toggle");

const MAX_CHARS = 200;
const  WARNING_AT = 180;

function updateCounts() {
  const text = noteText.value;
  const chars = text.length;
  const trimmedText = text.trim();
  const words = trimmedText === "" ? 0 : trimmedText.split(/\s+/).length;

  charCount.textContent = chars + "/" + MAX_CHARS + " characters";
  wordCount.textContent = words + (words === 1 ? " word" : " words");

  charCount.classList.toggle("warning", chars >= WARNING_AT);
  charCount.classList.toggle("over", chars > MAX_CHARS);
}

function clearNote() {
  noteText.value = "";
  localStorage.removeItem("draft");
  updateCounts();
}

noteText.addEventListener("input", function () {
  localStorage.setItem("draft", noteText.value);
  updateCounts();
});

clearBtn.addEventListener("click", clearNote);

function setTheme(isDark) {
  document.body.classList.toggle("dark", isDark);
  themeToggle.textContent = isDark ? "Light Mode" : "Dark Mode";
  localStorage.setItem("theme", isDark ? "dark" : "light");
}

themeToggle.addEventListener("click", function () {
  setTheme(!document.body.classList.contains("dark"));
});

noteText.value = localStorage.getItem("draft") || "";
setTheme(localStorage.getItem("theme") === "dark");
updateCounts();

render();