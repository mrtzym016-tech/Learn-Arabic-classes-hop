let currentCategory = "All";
let currentVideo = null;
let editIndex = null;

/* =========================
ADMIN CHECK
========================= */

const urlParams = new URLSearchParams(window.location.search);
const isAdmin = urlParams.get("admin") === "1234";

window.onload = function () {
  if (isAdmin) {
    const panel = document.getElementById("adminPanel");
    if (panel) panel.style.display = "block";
  }

  renderLessons();
  updateProgress();
  updateStats();
};

/* =========================
DATA
========================= */

function getLessons() {
  return JSON.parse(localStorage.getItem("lessons")) || lessons;
}

function saveLessons(data) {
  localStorage.setItem("lessons", JSON.stringify(data));
}

/* =========================
COMPLETED
========================= */

function getCompleted() {
  return JSON.parse(localStorage.getItem("completed") || "[]");
}

function saveCompleted(data) {
  localStorage.setItem("completed", JSON.stringify(data));
}

/* =========================
FAVORITES
========================= */

function getFavorites() {
  return JSON.parse(localStorage.getItem("favorites") || "[]");
}

function saveFavorites(data) {
  localStorage.setItem("favorites", JSON.stringify(data));
}

function toggleFavorite(video) {
  let fav = getFavorites();

  if (fav.includes(video)) {
    fav = fav.filter(v => v !== video);
  } else {
    fav.push(video);
  }

  saveFavorites(fav);
  renderLessons();
  updateStats();
}

/* =========================
YOUTUBE HELPERS
========================= */

function getYoutubeId(url) {
  if (!url) return null;

  if (url.includes("youtu.be/")) {
    return url.split("youtu.be/")[1].split("?")[0];
  }

  if (url.includes("watch?v=")) {
    return url.split("watch?v=")[1].split("&")[0];
  }

  if (url.includes("/embed/")) {
    return url.split("/embed/")[1].split("?")[0];
  }

  return null;
}

function getThumbnail(url) {
  const id = getYoutubeId(url);
  if (id) return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
  return "https://via.placeholder.com/300x180?text=Video";
}

/* =========================
ADD LESSON
========================= */

function openAddModal() {
  document.getElementById("addModal").style.display = "flex";
}

function closeAddModal() {
  document.getElementById("addModal").style.display = "none";
}

function addLesson() {
  const title = document.getElementById("titleInput").value.trim();
  const category = document.getElementById("categoryInput").value;
  const video = document.getElementById("videoInput").value.trim();
  const pdf = document.getElementById("pdfInput").value.trim();
  const thumb = document.getElementById("thumbInput").value.trim();

  if (!title || !video) {
    alert("Fill required fields");
    return;
  }

  const data = getLessons();

  data.push({
    title,
    category,
    video,
    pdf: pdf || "#",
    thumb: thumb || null
  });

  saveLessons(data);

  closeAddModal();
  renderLessons();
  updateProgress();
  updateStats();
}

/* =========================
DELETE
========================= */

function deleteLesson(index) {
  let data = getLessons();
  data.splice(index, 1);
  saveLessons(data);
  renderLessons();
  updateProgress();
  updateStats();
}

/* =========================
EDIT
========================= */

function openEditModal(index) {
  const lesson = getLessons()[index];
  editIndex = index;

  document.getElementById("editTitle").value = lesson.title;
  document.getElementById("editCategory").value = lesson.category;
  document.getElementById("editVideo").value = lesson.video;
  document.getElementById("editPdf").value = lesson.pdf;
  document.getElementById("editThumb").value = lesson.thumb || "";

  document.getElementById("editModal").style.display = "flex";
}

function closeEditModal() {
  document.getElementById("editModal").style.display = "none";
}

function saveEditLesson() {
  let data = getLessons();

  data[editIndex] = {
    title: document.getElementById("editTitle").value,
    category: document.getElementById("editCategory").value,
    video: document.getElementById("editVideo").value,
    pdf: document.getElementById("editPdf").value,
    thumb: document.getElementById("editThumb").value || null
  };

  saveLessons(data);

  closeEditModal();
  renderLessons();
  updateProgress();
  updateStats();
}

/* =========================
PROGRESS
========================= */

function updateProgress() {
  const completed = getCompleted();
  const data = getLessons();

  document.getElementById("progressText").innerText =
    `Completed: ${completed.length} / ${data.length}`;

  document.getElementById("progressFill").style.width =
    ((completed.length / Math.max(data.length, 1)) * 100) + "%";
}

function resetProgress() {
  localStorage.removeItem("completed");
  renderLessons();
  updateProgress();
}

/* =========================
VIDEO
========================= */

function openVideo(url) {
  currentVideo = url;

  const id = getYoutubeId(url);
  let playUrl = url;

  if (id) playUrl = `https://www.youtube.com/embed/${id}`;

  document.getElementById("videoFrame").src = playUrl;
  document.getElementById("videoModal").style.display = "flex";

  updateCompleteBtn();
}

function closeVideo() {
  document.getElementById("videoModal").style.display = "none";
  document.getElementById("videoFrame").src = "";
}

function toggleComplete() {
  let completed = getCompleted();

  if (completed.includes(currentVideo)) {
    completed = completed.filter(v => v !== currentVideo);
  } else {
    completed.push(currentVideo);
  }

  saveCompleted(completed);
  renderLessons();
  updateProgress();
  updateStats();
}

function updateCompleteBtn() {
  const btn = document.getElementById("completeBtn");
  const completed = getCompleted();

  if (!btn) return;

  btn.innerText = completed.includes(currentVideo)
    ? "✓ Completed"
    : "Mark as Completed";
}

/* =========================
STATS
========================= */

function updateStats() {
  const data = getLessons();
  const completed = getCompleted();
  const fav = getFavorites();

  const total = document.getElementById("totalLessons");
  const comp = document.getElementById("completedLessons");
  const favEl = document.getElementById("favoriteLessons");

  if (total) total.innerText = data.length;
  if (comp) comp.innerText = completed.length;
  if (favEl) favEl.innerText = fav.length;
}

/* =========================
RENDER
========================= */

function renderLessons() {
  const container = document.getElementById("lessonContainer");
  const search = document.getElementById("searchInput").value.toLowerCase();

  const data = getLessons();
  const completed = getCompleted();
  const fav = getFavorites();

  container.innerHTML = "";

  data
    .filter(item =>
      (currentCategory === "All" || item.category === currentCategory) &&
      item.title.toLowerCase().includes(search)
    )
    .forEach((item, index) => {

      const isDone = completed.includes(item.video);
      const isFav = fav.includes(item.video);

      container.innerHTML += `
<div class="card ${isDone ? "doneCard" : ""}">

<img class="thumbnail"
src="${item.thumb || getThumbnail(item.video)}"
onclick="openVideo('${item.video}')">

<h3>${item.title}</h3>
<p>${item.category}</p>

<button onclick="openVideo('${item.video}')">▶ Watch</button>

<a href="${item.pdf}" target="_blank">📄 PDF</a>

<button onclick="toggleFavorite('${item.video}')">
${isFav ? "❤️ Remove Fav" : "🤍 Favorite"}
</button>

${
  isAdmin
    ? `
<button onclick="openEditModal(${index})">✏ Edit</button>
<button onclick="deleteLesson(${index})">🗑 Delete</button>
`
    : ""
}

</div>
`;
    });
}

/* =========================
FILTER
========================= */

function filterLessons(cat) {
  currentCategory = cat;
  renderLessons();
}

/* =========================
SEARCH
========================= */

document.getElementById("searchInput")
  .addEventListener("input", renderLessons);
