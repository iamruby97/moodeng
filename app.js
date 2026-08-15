import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { 
    getAuth, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged,
    updateProfile 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

// คอนฟิก Firebase
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

// --- ฟังก์ชันเลือก Preset Avatar (คลิกเดียวเปลี่ยนรูปทันที) ---
window.selectPreset = async (avatarUrl) => {
    const currentUser = auth.currentUser;
    const profileMsg = document.getElementById('profileMsg');
    
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
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            await createUserWithEmailAndPassword(auth, email, password);
            if (message) {
                message.style.color = "green";
                message.textContent = "สมัครสมาชิกสำเร็จ! 🎉 กำลังไปหน้าหลัก...";
            }
            setTimeout(() => { window.location.href = "./main.html"; }, 800);
        } catch (error) {
            if (message) {
                message.style.color = "red";
                message.textContent = "เกิดข้อผิดพลาด: " + error.message;
            }
        }
    });
}

// --- 2. เข้าสู่ระบบ ---
const loginForm = document.getElementById('loginForm');
const loginMessage = document.getElementById('loginMessage');

if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        try {
            await signInWithEmailAndPassword(auth, email, password);
            if (loginMessage) {
                loginMessage.style.color = "green";
                loginMessage.textContent = "เข้าสู่ระบบสำเร็จ! 🎉 กำลังย้ายหน้า...";
            }
            setTimeout(() => { window.location.href = "./main.html"; }, 800);
        } catch (error) {
            if (loginMessage) {
                loginMessage.style.color = "red";
                loginMessage.textContent = "อีเมลหรือรหัสผ่านไม่ถูกต้อง";
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
const profileMsg = document.getElementById('profileMsg');

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

// --- 5. เลือกอัปโหลดไฟล์รูปภาพจากเครื่อง (ย่อขนาดอัตโนมัติ) ---
const fileInput = document.getElementById('fileInput');

if (fileInput) {
    fileInput.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        const currentUser = auth.currentUser;

        if (!file || !currentUser) return;

        try {
            if (profileMsg) {
                profileMsg.style.color = "#315efb";
                profileMsg.textContent = "กำลังย่อขนาดและอัปเดตรูปภาพ...";
            }

            const reader = new FileReader();
            reader.onload = (event) => {
                const img = new Image();
                img.onload = async () => {
                    // สร้าง Canvas ย่อขนาดรูปเป็น 96x96 px ให้ไฟล์ขนาดเล็กบันทึกลง Firebase ได้ชัวร์
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    
                    canvas.width = 96;
                    canvas.height = 96;
                    ctx.drawImage(img, 0, 0, 96, 96);
                    
                    const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);

                    try {
                        await updateProfile(currentUser, { photoURL: compressedBase64 });

                        const navAvatar = document.getElementById('navAvatar');
                        const userAvatar = document.getElementById('userAvatar');
                        if (navAvatar) navAvatar.src = compressedBase64;
                        if (userAvatar) userAvatar.src = compressedBase64;

                        if (profileMsg) {
                            profileMsg.style.color = "#10b981";
                            profileMsg.textContent = "อัปเดตรูปโปรไฟล์สำเร็จ! 📸";
                        }
                    } catch (err) {
                        if (profileMsg) {
                            profileMsg.style.color = "#ef4444";
                            profileMsg.textContent = "บันทึกรูปภาพไม่สำเร็จ: " + err.message;
                        }
                    }
                };
                img.src = event.target.result;
            };
            reader.readAsDataURL(file);

        } catch (error) {
            if (profileMsg) {
                profileMsg.style.color = "#ef4444";
                profileMsg.textContent = "เกิดข้อผิดพลาด: " + error.message;
            }
        }
    });
}
