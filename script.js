// ตั้งวันครบรอบ
const anniversary = new Date("2022-11-18");

// ฟังก์ชันนับวันตั้งแต่วันครบรอบ
function updateCount() {
    const now = new Date();
    const diff = now - anniversary;
    const days = Math.floor(diff / (1000*60*60*24));
    document.getElementById('days-count').innerText = days;

    // ถอยหลังวันครบรอบปีนี้
    let nextAnniversary = new Date(now.getFullYear(), anniversary.getMonth(), anniversary.getDate());
    if (now > nextAnniversary) nextAnniversary.setFullYear(nextAnniversary.getFullYear() + 1);
    const left = Math.ceil((nextAnniversary - now)/(1000*60*60*24));
    document.getElementById('days-left').innerText = left;
}

setInterval(updateCount, 1000);
updateCount();

// gallery จาก Google Sheets
let gallery = [];

async function loadGallery() {
    const url = "LINK_GOOGLE_SHEET_JSON"; // ใส่ลิงก์ Google Sheet JSON
    const res = await fetch(url);
    const data = await res.json();
    gallery = data.map(row => ({
        url: row.url,
        desc: row.desc
    }));
    renderGallery();
}

function renderGallery() {
    const galleryDiv = document.getElementById('gallery');
    galleryDiv.innerHTML = "";
    gallery.forEach((item, index) => {
        const div = document.createElement('div');
        div.className = "gallery-item";
        div.innerHTML = `
            <img src="${item.url}" onclick="window.open('${item.url}','_blank')">
            <div class="desc">${item.desc}</div>
            <button onclick="deleteImage(${index})">ลบ</button>
        `;
        galleryDiv.appendChild(div);
    });
}

function deleteImage(index) {
    gallery.splice(index,1);
    renderGallery();
    saveGallery();
}

function addImage() {
    const fileInput = document.getElementById('imageInput');
    const descInput = document.getElementById('descInput');
    const file = fileInput.files[0];
    if (!file) return alert("กรุณาเลือกไฟล์");

    const reader = new FileReader();
    reader.onload = function(e){
        gallery.push({url: e.target.result, desc: descInput.value});
        renderGallery();
        saveGallery();
    }
    reader.readAsDataURL(file);
}

// บันทึกลง Google Sheet ผ่าน Google Apps Script
function saveGallery() {
    fetch('LINK_GOOGLE_APPS_SCRIPT', {
        method: 'POST',
        body: JSON.stringify(gallery)
    });
}

loadGallery();
