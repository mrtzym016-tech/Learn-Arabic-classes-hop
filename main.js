let currentCategory = "All";
let currentVideo = null;

function getCompleted(){
return JSON.parse(localStorage.getItem("completed") || "[]");
}

function getThumbnail(videoUrl){

const id = videoUrl.split("/embed/")[1];

return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;

}

function toggleComplete(){

let completed = getCompleted();

if(completed.includes(currentVideo)){
completed = completed.filter(v => v !== currentVideo);
}else{
completed.push(currentVideo);
}

localStorage.setItem(
"completed",
JSON.stringify(completed)
);

renderLessons();
updateCompleteBtn();

}

function updateCompleteBtn(){

const completed = getCompleted();

const btn =
document.getElementById("completeBtn");

if(completed.includes(currentVideo)){

btn.innerText = "✓ Completed";

btn.classList.add("done");

}else{

btn.innerText = "Mark as Completed";

btn.classList.remove("done");

}

}

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

function renderLessons(){

const container =
document.getElementById("lessonContainer");

const search =
document.getElementById("searchInput")
.value
.toLowerCase();

const completed = getCompleted();

container.innerHTML = "";

lessons
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
src="${getThumbnail(item.video)}"
alt="${item.title}"
onclick="openVideo('${item.video}')"
>

<h3>${item.title}</h3>

<p>${item.category}</p>

<button onclick="openVideo('${item.video}')">
▶ Watch Lesson
</button>

<a href="${item.pdf}" target="_blank">
📄 Download PDF
</a>

</div>

`;

});

}

function filterLessons(cat){

currentCategory = cat;

renderLessons();

}

document
.getElementById("searchInput")
.addEventListener("input", renderLessons);

renderLessons();
