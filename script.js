const container = document.getElementById('container');
const toolbar = document.getElementById('toolbar');

const stage = document.getElementById('stage');
stage.addEventListener('mousedown', mouseDown);



let startX, startY, initialX, initialY;
let isConfirmed = false; // ตัวแปรเก็บสถานะว่าการ์ดถูกบันทึกหรือไม่


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

toolbar.addEventListener('mousedown', (e) => {
    if (isConfirmed) {
        alert('ไม่สามารถสร้างการ์ดใหม่ได้หลังจากบันทึกการ์ดแล้ว');
        return; // หากบันทึกไปแล้ว จะไม่สามารถลากการ์ดใหม่ออกมาได้
    }

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


confirmButton.addEventListener('click', () => {
    const cards = document.querySelectorAll('.card');

    // บันทึกตำแหน่งของการ์ดทั้งหมด
    cards.forEach(card => {
        const cardPosition = {
            left: card.style.left,
            top: card.style.top
        };

        console.log('ตำแหน่งของการ์ด:', cardPosition); // สามารถเปลี่ยนเป็นการบันทึกในเซิร์ฟเวอร์หรือฐานข้อมูล

        // ลบ event ที่ใช้ในการลากการ์ด
        card.removeEventListener('mousedown', mouseDown);

        // ปรับเคอร์เซอร์เพื่อให้ชัดเจนว่าการ์ดไม่สามารถลากได้แล้ว
        card.style.cursor = 'not-allowed';
    });

    // ล็อคตำแหน่งของเวที
    const stagePosition = {
        left: stage.style.left,
        top: stage.style.top
    };
    console.log('ตำแหน่งของเวที:', stagePosition); // บันทึกตำแหน่งของเวที
    stage.removeEventListener('mousedown', mouseDown); // ลบ event ของการลากเวที
    stage.style.cursor = 'not-allowed'; // เปลี่ยนเคอร์เซอร์ของเวทีเช่นกัน

    // ตั้งค่าสถานะว่าการ์ดถูกบันทึกแล้ว
    isConfirmed = true;

    alert('ตำแหน่งของการ์ดและเวทีถูกบันทึกเรียบร้อยแล้ว และไม่สามารถลากการ์ดหรือเวทีใหม่ได้');
});
