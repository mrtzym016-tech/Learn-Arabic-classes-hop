let currentCategory = "All";
let currentVideo = null;

/* =========================
ADMIN SYSTEM
========================= */

const urlParams = new URLSearchParams(window.location.search);
const isAdmin = urlParams.get("admin") === "1234";

window.onload = function () {
  if (isAdmin) {
    const adminPanel = document.getElementById("adminPanel");
    if (adminPanel) {
      adminPanel.style.display = "block";
    }
  }

  renderLessons();
  updateProgress();
};

/* =========================
DATA SYSTEM
========================= */

function getLessons() {
  return JSON.parse(localStorage.getItem("lessons")) || lessons;
}

function saveLessons(data) {
  localStorage.setItem("lessons", JSON.stringify(data));
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

  if (id) {
    return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
  }

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
    category:
      currentCategory === "All"
        ? "Custom"
        : currentCategory,
    video,
    pdf: pdf || "#",
    thumb: thumb || null
  });

  saveLessons(data);

  document.getElementById("titleInput").value = "";
  document.getElementById("videoInput").value = "";
  document.getElementById("pdfInput").value = "";
  document.getElementById("thumbInput").value = "";

  closeAddModal();
  renderLessons();
  updateProgress();
}

/* =========================
PROGRESS
========================= */

function getCompleted() {
  return JSON.parse(localStorage.getItem("completed") || "[]");
}

function saveCompleted(data) {
  localStorage.setItem("completed", JSON.stringify(data));
}

function updateProgress() {
  const completed = getCompleted();
  const data = getLessons();

  document.getElementById("progressText").innerText =
    `Completed: ${completed.length} / ${data.length}`;

  document.getElementById("progressFill").style.width =
    ((completed.length / Math.max(data.length, 1)) * 100) + "%";

  const msg = document.getElementById("completeMessage");

  if (completed.length === data.length && data.length > 0) {
    msg.innerText = "🎉 Course Completed!";
  } else {
    msg.innerText = "";
  }
}

function resetProgress() {
  localStorage.removeItem("completed");
  renderLessons();
  updateProgress();
}

/* =========================
VIDEO SYSTEM
========================= */

function openVideo(url) {

  currentVideo = url;

  const id = getYoutubeId(url);

  let playUrl = url;

  if (id) {
    playUrl = `https://www.youtube.com/embed/${id}`;
  }

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
  updateCompleteBtn();
  updateProgress();
}

function updateCompleteBtn() {

  const completed = getCompleted();
  const btn = document.getElementById("completeBtn");

  if (!btn) return;

  btn.innerText = completed.includes(currentVideo)
    ? "✓ Completed"
    : "Mark as Completed";
}

/* =========================
RENDER
========================= */

function renderLessons() {

  const container =
    document.getElementById("lessonContainer");

  const search =
    document.getElementById("searchInput")
      .value
      .toLowerCase();

  const data = getLessons();
  const completed = getCompleted();

  container.innerHTML = "";

  data
    .filter(item =>
      (currentCategory === "All" ||
        item.category === currentCategory)
      &&
      item.title
        .toLowerCase()
        .includes(search)
    )
    .forEach(item => {

      const isDone =
        completed.includes(item.video);

      container.innerHTML += `

<div class="card ${isDone ? "doneCard" : ""}">

<img
class="thumbnail"
src="${item.thumb || getThumbnail(item.video)}"
alt="${item.title}"
onclick="openVideo('${item.video}')"
>

<h3>${item.title}</h3>

<p>${item.category}</p>

<button onclick="openVideo('${item.video}')">
▶ Watch
</button>

<a href="${item.pdf}" target="_blank">
📄 PDF
</a>

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
INIT
========================= */

document
  .getElementById("searchInput")
  .addEventListener("input", renderLessons);
