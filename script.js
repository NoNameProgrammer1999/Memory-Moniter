// *** เปลี่ยนลิงก์ Apps Script ของคุณที่นี่ ***
const APPSSCRIPT_URL = "https://script.google.com/macros/s/AKfycbxP4jjd0vbBHVJsOjjDA7uf5LjlaiWasopIeMZW5DNHK2fpVLSVFz2SvkAki_-_hkS9Qw/exec";

// ------------------------------------
// 1. ฟังก์ชันดึงข้อมูลรูปภาพและแสดงผล
// ------------------------------------

async function fetchAndDisplayPhotos() {
    const gallery = document.getElementById('photo-gallery');
    gallery.innerHTML = 'กำลังโหลดรูปภาพ...';

    try {
        const response = await fetch(`${APPSSCRIPT_URL}?action=getPhotos`);
        const data = await response.json();
        const photos = data.photos;

        gallery.innerHTML = ''; 

        // เรียงลำดับตาม 'Order' (น้อยไปมาก)
        photos.sort((a, b) => (a.Order || 999) - (b.Order || 999)); 

        photos.forEach(photo => {
            const card = document.createElement('div');
            card.className = 'photo-card';

            // รูปภาพ
            const img = document.createElement('img');
            img.src = photo.ImageURL;
            img.alt = photo.Caption;
            img.className = 'photo-img';
            img.onclick = () => openModal(photo.ImageURL, photo.Caption); // ฟังก์ชันขยายรูป

            // วันที่
            const date = document.createElement('p');
            date.className = 'date';
            date.textContent = `วันที่: ${photo.Date || 'ไม่ระบุ'}`; 

            // คำอธิบาย
            const caption = document.createElement('p');
            caption.className = 'caption';
            caption.textContent = photo.Caption;

            // ปุ่มลบ
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-btn';
            deleteBtn.textContent = 'ลบรูปภาพ ❌';
            deleteBtn.onclick = () => deletePhoto(photo.rowIndex, card); // ฟังก์ชันลบรูป

            card.appendChild(img);
            card.appendChild(date);
            card.appendChild(caption);
            card.appendChild(deleteBtn);
            
            gallery.appendChild(card);
        });

    } catch (error) {
        console.error("Error fetching photos:", error);
        gallery.innerHTML = 'พบข้อผิดพลาดในการโหลดรูปภาพ';
    }
}

// ------------------------------------
// 2. ฟังก์ชันนับเวลาครบรอบ
// ------------------------------------

async function fetchAndDisplayAnniversary() {
    try {
        const response = await fetch(`${APPSSCRIPT_URL}?action=getAnniversary`);
        const data = await response.json();

        document.getElementById('days-since').textContent = data.daysSince;
        document.getElementById('countdown-days').textContent = data.countdownDays;
    } catch (error) {
        console.error("Error fetching anniversary data:", error);
    }
}

// ------------------------------------
// 3. ฟังก์ชันขยายรูป (Modal)
// ------------------------------------

const modal = document.getElementById("image-modal");
const modalImg = document.getElementById("expanded-img");
const captionText = document.getElementById("caption-text");
const closeBtn = document.getElementsByClassName("close-btn")[0];

function openModal(imgSrc, caption) {
    modal.style.display = "block";
    modalImg.src = imgSrc;
    captionText.innerHTML = caption;
}

closeBtn.onclick = function() {
    modal.style.display = "none";
}

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

// ------------------------------------
// 4. ฟังก์ชันลบรูปภาพ
// ------------------------------------

async function deletePhoto(rowIndex, cardElement) {
    if (!confirm('คุณแน่ใจหรือไม่ว่าต้องการลบรูปภาพนี้?')) return;

    try {
        const response = await fetch(APPSSCRIPT_URL, {
            method: 'POST',
            body: JSON.stringify({ action: 'deletePhoto', rowIndex: rowIndex }),
            headers: { 'Content-Type': 'text/plain' }
        });
        const result = await response.json();

        if (result.success) {
            alert(result.message);
            cardElement.remove(); // ลบ card ออกจากหน้าจอทันที
            // หรือเรียก fetchAndDisplayPhotos() ซ้ำ เพื่อโหลดข้อมูลใหม่
        } else {
            alert("ล้มเหลว: " + result.message);
        }
    } catch (error) {
        alert('เกิดข้อผิดพลาดในการติดต่อฐานข้อมูล');
        console.error("Error deleting photo:", error);
    }
}

// ------------------------------------
// 5. ฟังก์ชันเพิ่มรูปภาพ
// ------------------------------------

document.getElementById('add-photo-form').addEventListener('submit', async function(e) {
    e.preventDefault();

    const imageUrl = document.getElementById('add-image-url').value;
    const caption = document.getElementById('add-caption').value;
    const date = document.getElementById('add-date').value; 
    
    // แปลงวันที่ให้อยู่ในรูปแบบ DD/MM/YYYY
    let formattedDate = '';
    if (date) {
        const d = new Date(date);
        formattedDate = `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
    }

    try {
        const response = await fetch(APPSSCRIPT_URL, {
            method: 'POST',
            body: JSON.stringify({ 
                action: 'addPhoto', 
                ImageURL: imageUrl,
                Caption: caption,
                Date: formattedDate 
            }),
            headers: { 'Content-Type': 'text/plain' }
        });
        const result = await response.json();

        if (result.success) {
            alert(result.message);
            document.getElementById('add-photo-form').reset(); // เคลียร์ฟอร์ม
            fetchAndDisplayPhotos(); // โหลดข้อมูลใหม่
        } else {
            alert("ล้มเหลว: " + result.message);
        }
    } catch (error) {
        alert('เกิดข้อผิดพลาดในการติดต่อฐานข้อมูล');
        console.error("Error adding photo:", error);
    }
});


// ------------------------------------
// 6. เริ่มต้นการทำงาน
// ------------------------------------

document.addEventListener('DOMContentLoaded', () => {
    fetchAndDisplayAnniversary();
    fetchAndDisplayPhotos();
});

