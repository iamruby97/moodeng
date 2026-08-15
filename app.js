// =========================================
// ฟังก์ชันสร้างป้าย IG เครดิตลอยช้าๆ
// =========================================
const createFloatingCredits = () => {
    if (document.getElementById('floating-credits')) return;

    // ✏️ ใส่ชื่อ IG และ รูปโปรไฟล์ของคุณตรงนี้
    const igUsername = "iamruby97"; 
    const profileImgUrl = "https://cdn-icons-png.flaticon.com/512/2111/2111463.png"; 

    const credits = document.createElement('div');
    credits.id = 'floating-credits';
    credits.innerHTML = `
        <a href="https://www.instagram.com/${igUsername}" target="_blank" rel="noopener noreferrer" class="ig-floating-card">
            <img src="${profileImgUrl}" alt="IG Profile">
            <span>@${igUsername}</span>
        </a>
    `;

    credits.style.position = 'fixed';
    credits.style.zIndex = '9999';
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

// เรียกใช้งานเมื่อโหลดหน้าเว็บ
document.addEventListener('DOMContentLoaded', createFloatingCredits);
createFloatingCredits();
// ล้างระบบให้กลับมาเป็นปกติ
console.log("App ready");
