// =========================================
// 1. สร้างระบบพื้นหลัง 3D
// =========================================
const create3DBackground = () => {
    if (document.querySelector('.bg-3d-area')) return;

    const bgArea = document.createElement('div');
    bgArea.className = 'bg-3d-area';

    const ul = document.createElement('ul');
    ul.className = 'bg-3d-cubes';
    for (let i = 0; i < 10; i++) {
        const li = document.createElement('li');
        ul.appendChild(li);
    }

    bgArea.appendChild(ul);
    document.body.insertBefore(bgArea, document.body.firstChild);
};

// =========================================
// 2. สร้างป้าย IG เครดิตลอย
// =========================================
const createFloatingCredits = () => {
    if (document.getElementById('floating-credits')) return;

    // ✏️ ใส่ชื่อ IG และ ลิงก์รูปโปรไฟล์ของคุณได้เลย
    const igUsername = "iamruby97"; 
    const profileImgUrl = "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"; 

    const credits = document.createElement('div');
    credits.id = 'floating-credits';
    credits.innerHTML = `
        <a href="https://www.instagram.com/${igUsername}" target="_blank" rel="noopener noreferrer" class="ig-floating-card">
            <img src="${profileImgUrl}" alt="IG Profile">
            <span>@${igUsername}</span>
        </a>
    `;

    credits.style.position = 'fixed';
    credits.style.zIndex = '999';
    credits.style.pointerEvents = 'none';
    credits.style.userSelect = 'none';
    document.body.appendChild(credits);

    let rect = credits.getBoundingClientRect();
    let x = (window.innerWidth - rect.width) / 2;
    let y = (window.innerHeight - rect.height) / 2;
    let dx = 0.8; 
    let dy = 0.8; 

    const animateCredits = () => {
        rect = credits.getBoundingClientRect();

        if (x + rect.width >= window.innerWidth || x <= 0) dx = -dx;
        if (y + rect.height >= window.innerHeight || y <= 0) dy = -dy;

        x += dx;
        y += dy;
        credits.style.left = x + 'px';
        credits.style.top = y + 'px';

        requestAnimationFrame(animateCredits);
    };

    animateCredits();
};

// =========================================
// 3. ทำงานเมื่อเปิดหน้าเว็บ
// =========================================
document.addEventListener('DOMContentLoaded', () => {
    create3DBackground();
    createFloatingCredits();
});
create3DBackground();
createFloatingCredits();
