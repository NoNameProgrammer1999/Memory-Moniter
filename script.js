const API = "https://script.google.com/macros/s/AKfycbz44wxO2IImpFOxM9D_kRYnGr8eKZjxejBz2w_1Q-bwcFu0LHnyoIvUGzH2scHmAcANQA/exec";
const START_DATE = new Date("2022-11-18");


function updateTime() {
const now = new Date();
const diff = now - START_DATE;
const days = Math.floor(diff / (1000 * 60 * 60 * 24));
document.getElementById("together").innerText = `คบกันมา ${days} วัน ❤️`;


const year = now.getFullYear();
const anniv = new Date(year, 10, 18);
if (anniv < now) anniv.setFullYear(year + 1);


const left = anniv - now;
const d = Math.floor(left / (1000 * 60 * 60 * 24));
document.getElementById("countdown").innerText = `ครบรอบอีก ${d} วัน ⏳`;
}
setInterval(updateTime, 1000);
updateTime();


function upload() {
  const file = document.getElementById("image").files[0];
  const text = document.getElementById("text").value;

  const reader = new FileReader();
  reader.onloadend = () => {
    const url =
      API +
      "?image=" + encodeURIComponent(reader.result) +
      "&text=" + encodeURIComponent(text);

    fetch(url)
      .then(r => r.json())
      .then(() => load());
  };
  reader.readAsDataURL(file);
}



function load() {
fetch(API)
.then(r => r.json())
.then(data => {
const g = document.getElementById("gallery");
g.innerHTML = "";
data.forEach((row, i) => {
g.innerHTML += `
<div class="card">
<img src="${row.img}" onclick="openModal('${row.img}')" />
<p>${row.text}</p>
<button onclick="remove(${i})">ลบ</button>
</div>`;
});
});
}


function remove(i) {
fetch(API + "?delete=" + i).then(() => load());
}


function openModal(src) {
document.getElementById("modal").style.display = "block";
document.getElementById("modalImg").src = src;
}
function closeModal() {
document.getElementById("modal").style.display = "none";
}



load();
