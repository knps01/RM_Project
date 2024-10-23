const container = document.getElementById('container');
const toolbar = document.getElementById('toolbar');

let startX, startY, initialX, initialY;

function mouseDown(e) {
    const card = e.target; // ใช้ e.target เพื่อระบุตัว card ที่ถูกลาก
    startX = e.clientX;
    startY = e.clientY;
    initialX = card.offsetLeft;
    initialY = card.offsetTop;

    card.classList.add('dragging'); // กำหนดว่า card นี้ถูกลาก

    document.addEventListener('mousemove', mouseMove);
    document.addEventListener('mouseup', mouseUp.bind(null, card));
}

function mouseMove(e) {
    const card = document.querySelector('.dragging'); // หา card ที่กำลังถูกลาก
    if (!card) return;

    const dx = e.clientX - startX;
    const dy = e.clientY - startY;

    card.style.left = `${initialX + dx}px`;
    card.style.top = `${initialY + dy}px`;
}

function mouseUp(card) {
    document.removeEventListener('mousemove', mouseMove);
    document.removeEventListener('mouseup', mouseUp);

    card.classList.remove('dragging'); // ลบ class dragging เมื่อปล่อยการลาก

    // ตรวจสอบให้แน่ใจว่า card อยู่ภายใน #container
    const cardRect = card.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();

    if (cardRect.left < containerRect.left) {
        card.style.left = '0px';
    }
    if (cardRect.top < containerRect.top) {
        card.style.top = '0px';
    }
    if (cardRect.right > containerRect.right) {
        card.style.left = `${containerRect.width - cardRect.width}px`;
    }
    if (cardRect.bottom > containerRect.bottom) {
        card.style.top = `${containerRect.height - cardRect.height}px`;
    }
}

// เพิ่ม event listener ให้กับทุก card ที่อยู่ใน toolbar
const cards = document.querySelectorAll('.card');
cards.forEach(card => {
    card.addEventListener('mousedown', mouseDown);
});

// เพิ่มฟังก์ชันสร้างสำเนาใหม่ใน toolbar
toolbar.addEventListener('mousedown', (e) => {
    const originalCard = e.target.closest('.card');
    if (!originalCard) return;

    // สร้างสำเนาของ card
    const newCard = originalCard.cloneNode(true);
    newCard.classList.add('card'); // เพิ่มคลาส 'card' ให้สำเนาใหม่
    newCard.style.left = '0px';
    newCard.style.top = '0px';
    newCard.addEventListener('mousedown', mouseDown); // เพิ่ม event ให้ลาก card ใหม่
    
    toolbar.appendChild(newCard);

    // ลาก card ใหม่แทน original card
    newCard.classList.add('dragging');
    document.addEventListener('mousemove', mouseMove);
    document.addEventListener('mouseup', mouseUp.bind(null, newCard)); // ผูก mouseUp กับ card ใหม่
});
