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

const defaultAvatar = "https://api.dicebear.com/7.x/bottts/svg?seed=Pikachu";

// เปลี่ยนรูปผ่าน Preset อัตโนมัติ
window.selectPreset = async (avatarUrl) => {
    const currentUser = auth.currentUser;
    const profileMsg = document.getElementById('profileMsg');
    
    if (!currentUser) return;

    try {
        if (profileMsg) {
            profileMsg.style.color = "#315efb";
            profileMsg.textContent = "กำลังเปลี่ยนรูปโปรไฟล์...";
        }

        await updateProfile(currentUser, { photoURL: avatarUrl });

        document.getElementById('navAvatar').src = avatarUrl;
        document.getElementById('userAvatar').src = avatarUrl;
        document.getElementById('photoUrlInput').value = avatarUrl;

        if (profileMsg) {
            profileMsg.style.color = "#10b981";
            profileMsg.textContent = "อัปเดตรูปโปรไฟล์เรียบร้อย! ✨";
        }
    } catch (error) {
        if (profileMsg) {
            profileMsg.style.color = "#ef4444";
            profileMsg.textContent = "เกิดข้อผิดพลาด: " + error.message;
        }
    }
};

// ตรวจสอบล็อกอิน
onAuthStateChanged(auth, (user) => {
    const isMainPage = window.location.pathname.includes("main.html");

    if (user) {
        if (!isMainPage) {
            window.location.href = "main.html";
        } else {
            const displayName = user.displayName || user.email.split('@')[0];
            const avatarUrl = user.photoURL || defaultAvatar;

            document.getElementById('userDisplayName').textContent = displayName;
            document.getElementById('welcomeName').textContent = displayName;
            document.getElementById('userEmail').textContent = user.email;
            document.getElementById('navAvatar').src = avatarUrl;
            document.getElementById('userAvatar').src = avatarUrl;

            if (!document.getElementById('displayNameInput').value && user.displayName) {
                document.getElementById('displayNameInput').value = user.displayName;
            }
            if (!document.getElementById('photoUrlInput').value && user.photoURL) {
                document.getElementById('photoUrlInput').value = user.photoURL;
            }
        }
    } else {
        if (isMainPage) {
            window.location.href = "index.html";
        }
    }
});

// บันทึกชื่อ
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

                document.getElementById('userDisplayName').textContent = newName;
                document.getElementById('welcomeName').textContent = newName;

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

// บันทึกรูปผ่าน Direct URL
const savePhotoBtn = document.getElementById('savePhotoBtn');

if (savePhotoBtn) {
    savePhotoBtn.addEventListener('click', async () => {
        const currentUser = auth.currentUser;
        const photoUrlInput = document.getElementById('photoUrlInput');
        const urlInputVal = photoUrlInput ? photoUrlInput.value.trim() : '';

        if (!urlInputVal) {
            profileMsg.style.color = "#ef4444";
            profileMsg.textContent = "กรุณากรอก URL ลิงก์รูปภาพ";
            return;
        }

        if (currentUser) {
            try {
                savePhotoBtn.disabled = true;
                profileMsg.style.color = "#315efb";
                profileMsg.textContent = "กำลังตรวจสอบรูปภาพ...";

                // ตรวจสอบว่าเป็นไฟล์ภาพที่เปิดได้จริงหรือไม่
                const testImg = new Image();
                testImg.src = urlInputVal;

                testImg.onload = async () => {
                    await updateProfile(currentUser, { photoURL: urlInputVal });

                    profileMsg.style.color = "#10b981";
                    profileMsg.textContent = "เปลี่ยนรูปโปรไฟล์สำเร็จ! 🖼️";

                    document.getElementById('navAvatar').src = urlInputVal;
                    document.getElementById('userAvatar').src = urlInputVal;
                    savePhotoBtn.disabled = false;
                };

                testImg.onerror = () => {
                    profileMsg.style.color = "#ef4444";
                    profileMsg.textContent = "ลิงก์รูปนี้ไม่สามารถดึงรูปได้ (โดนล็อก CORS หรือไม่ใช่ไฟล์รูปตรงๆ)";
                    savePhotoBtn.disabled = false;
                };

            } catch (error) {
                profileMsg.style.color = "#ef4444";
                profileMsg.textContent = "เกิดข้อผิดพลาด: " + error.message;
                savePhotoBtn.disabled = false;
            }
        }
    });
}

// ออกจากระบบ
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
