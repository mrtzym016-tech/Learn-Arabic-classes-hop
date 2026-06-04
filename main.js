let currentCategory = "All";

function renderLessons(){

const container = document.getElementById("lessonContainer");

const search = document.getElementById("searchInput").value.toLowerCase();

container.innerHTML = "";

lessons
.filter(item =>
(currentCategory === "All" || item.category === currentCategory)
&& item.title.toLowerCase().includes(search)
)

.forEach(item => {

container.innerHTML += `
<div class="card">

<h3>${item.title}</h3>
<p>${item.category}</p>

<a href="${item.video}" target="_blank">▶ Watch Lesson</a>
<a href="${item.pdf}" target="_blank">📄 Download PDF</a>

${item.quiz ? `<a href="${item.quiz}" target="_blank">📝 Take Quiz</a>` : ""}

</div>
`;

});

}

function filterLessons(cat){
currentCategory = cat;
renderLessons();
}

// 🔴 FIXED LINE (كان مكسور)
document.getElementById("searchInput")
.addEventListener("input", renderLessons);

// أول تحميل
renderLessons();
