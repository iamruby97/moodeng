import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { 
    getAuth, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged,
    updateProfile 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

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

const defaultAvatar = "https://api.dicebear.com/7.x/bottts/svg?seed=Moodeng";

// ฟังก์ชันเลือกรูป Preset
window.selectPreset = (url) => {
    const photoUrlInput = document.getElementById('photoUrlInput');
    if (photoUrlInput) {
        photoUrlInput.value = url;
    }
};

// --- ตรวจสอบสถานะการล็อกอินอัตโนมัติ ---
onAuthStateChanged(auth, (user) => {
    const isMainPage = window.location.pathname.includes("main.html");

    if (user) {
        if (!isMainPage) {
            window.location.href = "main.html";
        } else {
            const displayName = user.displayName || user.email.split('@')[0];
            const avatarUrl = user.photoURL || defaultAvatar;

            const userDisplayNameEl = document.getElementById('userDisplayName');
            const welcomeNameEl = document.getElementById('welcomeName');
            const userEmailEl = document.getElementById('userEmail');
            const displayNameInput = document.getElementById('displayNameInput');
            const photoUrlInput = document.getElementById('photoUrlInput');
            const navAvatar = document.getElementById('navAvatar');
            const userAvatar = document.getElementById('userAvatar');

            if (userDisplayNameEl) userDisplayNameEl.textContent = displayName;
            if (welcomeNameEl) welcomeNameEl.textContent = displayName;
            if (userEmailEl) userEmailEl.textContent = user.email;
            if (navAvatar) navAvatar.src = avatarUrl;
            if (userAvatar) userAvatar.src = avatarUrl;

            if (displayNameInput && !displayNameInput.value && user.displayName) {
                displayNameInput.value = user.displayName;
            }
            if (photoUrlInput && !photoUrlInput.value && user.photoURL && !user.photoURL.startsWith('data:')) {
                photoUrlInput.value = user.photoURL;
            }
        }
    } else {
        if (isMainPage) {
            window.location.href = "index.html";
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
            message.style.color = "green";
            message.textContent = "สมัครสมาชิกสำเร็จ! 🎉 กำลังพาไปหน้าหลัก...";
            setTimeout(() => { window.location.href = "main.html"; }, 1000);
        } catch (error) {
            message.style.color = "red";
            message.textContent = "เกิดข้อผิดพลาด: " + error.message;
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
            loginMessage.style.color = "green";
            loginMessage.textContent = "เข้าสู่ระบบสำเร็จ! 🎉";
            setTimeout(() => { window.location.href = "main.html"; }, 1000);
        } catch (error) {
            loginMessage.style.color = "red";
            loginMessage.textContent = "อีเมลหรือรหัสผ่านไม่ถูกต้อง";
        }
    });
}

// --- 3. ออกจากระบบ ---
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
        try {
            await signOut(auth);
            window.location.href = "index.html";
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
            profileMsg.style.color = "#ef4444";
            profileMsg.textContent = "กรุณากรอกชื่อโปรไฟล์";
            return;
        }

        if (currentUser) {
            try {
                saveProfileBtn.disabled = true;
                saveProfileBtn.textContent = "กำลังบันทึก...";

                await updateProfile(currentUser, { displayName: newName });

                profileMsg.style.color = "#10b981";
                profileMsg.textContent = "อัปเดตชื่อโปรไฟล์สำเร็จ! ✨";

                const userDisplayNameEl = document.getElementById('userDisplayName');
                const welcomeNameEl = document.getElementById('welcomeName');
                if (userDisplayNameEl) userDisplayNameEl.textContent = newName;
                if (welcomeNameEl) welcomeNameEl.textContent = newName;

            } catch (error) {
                profileMsg.style.color = "#ef4444";
                profileMsg.textContent = "เกิดข้อผิดพลาด: " + error.message;
            } finally {
                saveProfileBtn.disabled = false;
                saveProfileBtn.textContent = "บันทึกชื่อ";
            }
        }
    });
}

// --- 5. บันทึกรูปโปรไฟล์ (รองรับทั้งไฟล์จากเครื่อง และ URL) ---
const savePhotoBtn = document.getElementById('savePhotoBtn');
const fileInput = document.getElementById('fileInput');

if (savePhotoBtn) {
    savePhotoBtn.addEventListener('click', async () => {
        const currentUser = auth.currentUser;
        if (!currentUser) return;

        const urlInputVal = document.getElementById('photoUrlInput').value.trim();
        const selectedFile = fileInput && fileInput.files[0];

        if (!selectedFile && !urlInputVal) {
            profileMsg.style.color = "#ef4444";
            profileMsg.textContent = "กรุณเลือกไฟล์รูป หรือกรอก URL รูปภาพ";
            return;
        }

        profileMsg.style.color = "#315efb";
        profileMsg.textContent = "กำลังประมวลผลรูปภาพ...";
        savePhotoBtn.disabled = true;

        // กรณีอัปโหลดไฟล์จากเครื่อง (ย่อขนาดรูปเป็น Base64)
        if (selectedFile) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = async () => {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    canvas.width = 100;
                    canvas.height = 100;
                    ctx.drawImage(img, 0, 0, 100, 100);
                    
                    const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);

                    try {
                        await updateProfile(currentUser, { photoURL: compressedBase64 });
                        profileMsg.style.color = "#10b981";
                        profileMsg.textContent = "เปลี่ยนรูปโปรไฟล์จากไฟล์สำเร็จ! 🖼️";

                        document.getElementById('navAvatar').src = compressedBase64;
                        document.getElementById('userAvatar').src = compressedBase64;
                        fileInput.value = ""; // เคลียร์ไฟล์
                    } catch (err) {
                        profileMsg.style.color = "#ef4444";
                        profileMsg.textContent = "เกิดข้อผิดพลาดในการบันทึกรูปภาพ";
                    } finally {
                        savePhotoBtn.disabled = false;
                    }
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(selectedFile);
        } 
        // กรณีใส่ URL ลิงก์รูปภาพ
        else if (urlInputVal) {
            try {
                await updateProfile(currentUser, { photoURL: urlInputVal });
                profileMsg.style.color = "#10b981";
                profileMsg.textContent = "เปลี่ยนรูปโปรไฟล์จาก URL สำเร็จ! 🖼️";

                document.getElementById('navAvatar').src = urlInputVal;
                document.getElementById('userAvatar').src = urlInputVal;
            } catch (error) {
                profileMsg.style.color = "#ef4444";
                profileMsg.textContent = "ลิงก์รูปภาพไม่ถูกต้อง หรือเกิดข้อผิดพลาด";
            } finally {
                savePhotoBtn.disabled = false;
            }
        }
    });
}
