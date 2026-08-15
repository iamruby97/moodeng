import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { 
    getAuth, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged 
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

// --- ตรวจสอบสถานะการล็อกอินอัตโนมัติ ---
onAuthStateChanged(auth, (user) => {
    const isMainPage = window.location.pathname.includes("main.html");

    if (user) {
        // ถ้าล็อกอินแล้ว แต่ไม่ได้อยู่หน้า main.html ให้ส่งไปหน้า main.html ทันที
        if (!isMainPage) {
            window.location.href = "main.html";
        } else {
            // แสดงอีเมลในหน้า main.html
            const userEmailEl = document.getElementById('userEmail');
            if (userEmailEl) {
                userEmailEl.textContent = user.email;
            }
        }
    } else {
        // ถ้ายังไม่ได้ล็อกอิน แต่อยู่หน้า main.html ให้ส่งกลับหน้าแรก
        if (isMainPage) {
            window.location.href = "index.html";
        }
    }
});

// --- 1. ระบบสมัครสมาชิก ---
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

// --- 2. ระบบเข้าสู่ระบบ ---
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

// --- 3. ระบบออกจากระบบ ---
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
