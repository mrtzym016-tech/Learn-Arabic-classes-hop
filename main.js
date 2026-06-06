let currentCategory = "All";
let currentVideo = null;

/* =========================
ADMIN SYSTEM
========================= */

const urlParams = new URLSearchParams(window.location.search);
const isAdmin = urlParams.get("admin") === "1234";

window.onload = function(){
if(isAdmin){
document.getElementById("adminPanel").style.display = "block";
}
renderLessons();
updateProgress();
};

/* =========================
DATA SYSTEM
========================= */

function getLessons(){
return JSON.parse(localStorage.getItem("lessons")) || lessons;
}

function saveLessons(data){
localStorage.setItem("lessons", JSON.stringify(data));
}

/* =========================
THUMBNAIL
========================= */

function getThumbnail(url){

if(url.includes("youtube")){
let id = url.split("/embed/")[1];
return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
}

return "https://via.placeholder.com/300x180";

}

/* =========================
ADD LESSON
========================= */

function openAddModal(){
document.getElementById("addModal").style.display = "flex";
}

function closeAddModal(){
document.getElementById("addModal").style.display = "none";
}

function addLesson(){

const title = document.getElementById("titleInput").value;
const video = document.getElementById("videoInput").value;
const pdf = document.getElementById("pdfInput").value;
const thumb = document.getElementById("thumbInput").value;

if(!title || !video){
alert("Fill required fields");
return;
}

const data = getLessons();

data.push({
title,
category: currentCategory === "All" ? "Custom" : currentCategory,
video,
pdf: pdf || "#",
thumb: thumb || null
});

saveLessons(data);

closeAddModal();
renderLessons();
updateProgress();
}

/* =========================
PROGRESS
========================= */

function getCompleted(){
return JSON.parse(localStorage.getItem("completed") || "[]");
}

function saveCompleted(data){
localStorage.setItem("completed", JSON.stringify(data));
}

function updateProgress(){

const completed = getCompleted();
const data = getLessons();

document.getElementById("progressText").innerText =
`Completed: ${completed.length} / ${data.length}`;

document.getElementById("progressFill").style.width =
(completed.length / data.length) * 100 + "%";

if(completed.length === data.length && data.length > 0){
document.getElementById("completeMessage").innerText =
"🎉 Course Completed!";
}
}

/* =========================
VIDEO SYSTEM
========================= */

function openVideo(url){
currentVideo = url;
document.getElementById("videoFrame").src = url;
document.getElementById("videoModal").style.display = "flex";
updateCompleteBtn();
}

function closeVideo(){
document.getElementById("videoModal").style.display = "none";
document.getElementById("videoFrame").src = "";
}

function toggleComplete(){

let completed = getCompleted();

if(completed.includes(currentVideo)){
completed = completed.filter(v => v !== currentVideo);
}else{
completed.push(currentVideo);
}

saveCompleted(completed);

renderLessons();
updateCompleteBtn();
updateProgress();
}

function updateCompleteBtn(){

const completed = getCompleted();
const btn = document.getElementById("completeBtn");

btn.innerText = completed.includes(currentVideo)
? "✓ Completed"
: "Mark as Completed";
}

/* =========================
RENDER
========================= */

function renderLessons(){

const container = document.getElementById("lessonContainer");

const search = document.getElementById("searchInput").value.toLowerCase();

const data = getLessons();
const completed = getCompleted();

container.innerHTML = "";

data.filter(item =>
(currentCategory === "All" || item.category === currentCategory)
&& item.title.toLowerCase().includes(search)
)
.forEach(item => {

const isDone = completed.includes(item.video);

container.innerHTML += `
<div class="card ${isDone ? "doneCard" : ""}">

<img class="thumbnail"
src="${item.thumb || getThumbnail(item.video)}"
onclick="openVideo('${item.video}')">

<h3>${item.title}</h3>
<p>${item.category}</p>

<button onclick="openVideo('${item.video}')">▶ Watch</button>

<a href="${item.pdf}" target="_blank">📄 PDF</a>

</div>
`;

});

}

/* =========================
FILTER
========================= */

function filterLessons(cat){
currentCategory = cat;
renderLessons();
}

/* =========================
INIT
========================= */

document.getElementById("searchInput")
.addEventListener("input", renderLessons);
