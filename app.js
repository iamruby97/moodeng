import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { 
    getAuth, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged,
    updateProfile 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyB7nVG0DU8vI_yby6kWZ_4N0tKYBJI0pQw",
  authDomain: "moodeng-aa11a.firebaseapp.com",
  projectId: "moodeng-aa11a",
  storageBucket: "moodeng-aa11a.firebasestorage.app",
  messagingSenderId: "904537755630",
  appId: "1:904537755630:web:0fe3885e0c5e4b66e788ff",
  measurementId: "G-0MHRE3Z9G5"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const defaultAvatar = "https://api.dicebear.com/7.x/bottts/svg?seed=Pikachu";
const profileMsg = document.getElementById('profileMsg');

// --- ตรวจสอบสถานะล็อกอินอัตโนมัติ (Auto Redirect) ---
onAuthStateChanged(auth, (user) => {
    const currentPath = window.location.pathname.toLowerCase();
    const isMainPage = currentPath.includes("main.html");

    if (user) {
        if (!isMainPage) {
            window.location.href = "./main.html";
        } else {
            const displayName = user.displayName || user.email.split('@')[0];
            const avatarUrl = user.photoURL || defaultAvatar;

            const userDisplayNameEl = document.getElementById('userDisplayName');
            const welcomeNameEl = document.getElementById('welcomeName');
            const userEmailEl = document.getElementById('userEmail');
            const navAvatar = document.getElementById('navAvatar');
            const userAvatar = document.getElementById('userAvatar');
            const displayNameInput = document.getElementById('displayNameInput');

            if (userDisplayNameEl) userDisplayNameEl.textContent = displayName;
            if (welcomeNameEl) welcomeNameEl.textContent = displayName;
            if (userEmailEl) userEmailEl.textContent = user.email;
            if (navAvatar) navAvatar.src = avatarUrl;
            if (userAvatar) userAvatar.src = avatarUrl;

            if (displayNameInput && !displayNameInput.value && user.displayName) {
                displayNameInput.value = user.displayName;
            }
        }
    } else {
        if (isMainPage) {
            window.location.href = "./index.html";
        }
    }
});

// --- 1. สมัครสมาชิก ---
const signupForm = document.getElementById('signupForm');
const message = document.getElementById('message');

if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // ป้องกันหน้าเว็บเด้งรีเฟรช
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            await createUserWithEmailAndPassword(auth, email, password);
            if (message) {
                message.style.color = "#10b981"; // สีเขียว
                message.textContent = "สมัครสมาชิกสำเร็จ! 🎉 กำลังไปหน้าหลัก...";
            }
            setTimeout(() => { window.location.href = "./main.html"; }, 800);
        } catch (error) {
            if (message) {
                message.style.color = "#ef4444"; // สีแดง
                message.textContent = "เกิดข้อผิดพลาด: อีเมลนี้อาจถูกใช้ไปแล้ว หรือรหัสผ่านสั้นเกินไป";
            }
        }
    });
}

// --- 2. เข้าสู่ระบบ ---
const loginForm = document.getElementById('loginForm');
const loginMessage = document.getElementById('loginMessage');

if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // ป้องกันหน้าเว็บเด้งรีเฟรช
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        
        try {
            await signInWithEmailAndPassword(auth, email, password);
            if (loginMessage) {
                loginMessage.style.color = "#10b981"; // สีเขียว
                loginMessage.textContent = "เข้าสู่ระบบสำเร็จ! 🎉 กำลังย้ายหน้า...";
            }
            setTimeout(() => { window.location.href = "./main.html"; }, 800);
        } catch (error) {
            if (loginMessage) {
                loginMessage.style.color = "#ef4444"; // สีแดง
                loginMessage.textContent = "อีเมลหรือรหัสผ่านไม่ถูกต้อง โปรดลองอีกครั้ง";
            }
        }
    });
}

// --- 3. ออกจากระบบ ---
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
        try {
            await signOut(auth);
            window.location.href = "./index.html";
        } catch (error) {
            alert("เกิดข้อผิดพลาดในการออกจากระบบ");
        }
    });
}

// --- 4. บันทึกชื่อโปรไฟล์ ---
const saveProfileBtn = document.getElementById('saveProfileBtn');
if (saveProfileBtn) {
    saveProfileBtn.addEventListener('click', async () => {
        const newName = document.getElementById('displayNameInput').value.trim();
        const currentUser = auth.currentUser;

        if (!newName) {
            if (profileMsg) {
                profileMsg.style.color = "#ef4444";
                profileMsg.textContent = "กรุณากรอกชื่อโปรไฟล์";
            }
            return;
        }

        if (currentUser) {
            try {
                saveProfileBtn.disabled = true;
                saveProfileBtn.textContent = "กำลังบันทึก...";

                await updateProfile(currentUser, { displayName: newName });

                if (profileMsg) {
                    profileMsg.style.color = "#10b981";
                    profileMsg.textContent = "อัปเดตชื่อโปรไฟล์สำเร็จ! ✨";
                }

                const userDisplayNameEl = document.getElementById('userDisplayName');
                const welcomeNameEl = document.getElementById('welcomeName');
                if (userDisplayNameEl) userDisplayNameEl.textContent = newName;
                if (welcomeNameEl) welcomeNameEl.textContent = newName;

            } catch (error) {
                if (profileMsg) {
                    profileMsg.style.color = "#ef4444";
                    profileMsg.textContent = "เกิดข้อผิดพลาด: " + error.message;
                }
            } finally {
                saveProfileBtn.disabled = false;
                saveProfileBtn.textContent = "บันทึกชื่อ";
            }
        }
    });
}

// --- 5. เลือก Preset Avatar (การ์ตูน) ---
window.selectPreset = async (avatarUrl) => {
    const currentUser = auth.currentUser;
    if (!currentUser) return;

    try {
        if (profileMsg) {
            profileMsg.style.color = "#315efb";
            profileMsg.textContent = "กำลังอัปเดตรูปโปรไฟล์...";
        }

        await updateProfile(currentUser, { photoURL: avatarUrl });

        const navAvatar = document.getElementById('navAvatar');
        const userAvatar = document.getElementById('userAvatar');
        if (navAvatar) navAvatar.src = avatarUrl;
        if (userAvatar) userAvatar.src = avatarUrl;

        if (profileMsg) {
            profileMsg.style.color = "#10b981";
            profileMsg.textContent = "เปลี่ยนรูปโปรไฟล์สำเร็จ! ✨";
        }
    } catch (error) {
        if (profileMsg) {
            profileMsg.style.color = "#ef4444";
            profileMsg.textContent = "เกิดข้อผิดพลาด: " + error.message;
        }
    }
};

// --- 6. อัปโหลดรูปภาพขึ้น Cloud (ImgBB) ---
const fileInput = document.getElementById('fileInput');
if (fileInput) {
    fileInput.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        const currentUser = auth.currentUser;

        if (!file || !currentUser) return;

        try {
            if (profileMsg) {
                profileMsg.style.color = "#315efb";
                profileMsg.textContent = "กำลังอัปโหลดรูปภาพขึ้นระบบ... (รอสักครู่)";
            }

            const formData = new FormData();
            formData.append("image", file);

            const response = await fetch("https://api.imgbb.com/1/upload?key=32ca0479e70e60368ab74b33621561c4", {
                method: "POST",
                body: formData
            });

            const result = await response.json();

            if (result.success) {
                const imageUrl = result.data.url; 
                await updateProfile(currentUser, { photoURL: imageUrl });

                const navAvatar = document.getElementById('navAvatar');
                const userAvatar = document.getElementById('userAvatar');
                if (navAvatar) navAvatar.src = imageUrl;
                if (userAvatar) userAvatar.src = imageUrl;

                if (profileMsg) {
                    profileMsg.style.color = "#10b981";
                    profileMsg.textContent = "อัปเดตรูปโปรไฟล์สำเร็จ! 📸";
                }
            } else {
                throw new Error("ไม่สามารถอัปโหลดรูปภาพได้");
            }

        } catch (error) {
            if (profileMsg) {
                profileMsg.style.color = "#ef4444";
                profileMsg.textContent = "เกิดข้อผิดพลาด: " + error.message;
            }
        } finally {
            e.target.value = '';
        }
    });
}
// =========================================
// 1. ฟังก์ชันสร้างพื้นหลัง 3D (Floating Cubes)
// =========================================
const create3DBackground = () => {
    const oldBg = document.querySelector('.bg-3d-area');
    if (oldBg) oldBg.remove();

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
// 2. ฟังก์ชันสร้าง IG เครดิตลอยช้าๆ ขนาดเล็ก (กดลิงก์ได้)
// =========================================
const createFloatingCredits = () => {
    const oldCredits = document.getElementById('floating-credits');
    if (oldCredits) oldCredits.remove();

    // ✏️ 1. เปลี่ยนเป็นชื่อ IG ของคุณ (ไม่ต้องใส่ @)
    const igUsername = "instagram"; 
    
    // ✏️ 2. เปลี่ยนเป็น URL รูปโปรไฟล์ของคุณ
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
    credits.style.zIndex = '999';
    credits.style.pointerEvents = 'none'; // รอบๆ ไม่บังการกด UI
    credits.style.userSelect = 'none';
    document.body.appendChild(credits);

    let rect = credits.getBoundingClientRect();
    let x = (window.innerWidth - rect.width) / 2;
    let y = (window.innerHeight - rect.height) / 2;
    
    // ความเร็วในการลอย (0.8 = ช้านุ่มนวล)
    let dx = 0.8; 
    let dy = 0.8; 

    const animateCredits = () => {
        rect = credits.getBoundingClientRect();
