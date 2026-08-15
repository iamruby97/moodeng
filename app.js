document.addEventListener('DOMContentLoaded', () => {
    const settingsBtn = document.getElementById('settings-btn');
    const settingsMenu = document.getElementById('settings-menu');
    const profileImg = document.getElementById('profile-img');
    const imageInput = document.getElementById('image-input');
    const usernameText = document.getElementById('username-text');
    const nameInput = document.getElementById('name-input');
    const saveNameBtn = document.getElementById('save-name-btn');

    // เปิด-ปิดเมนูตั้งค่าเมื่อกดปุ่ม ⚙️
    if (settingsBtn && settingsMenu) {
        settingsBtn.addEventListener('click', () => {
            settingsMenu.classList.toggle('hidden');
        });
    }

    // เปลี่ยนรูปโปรไฟล์
    if (imageInput && profileImg) {
        imageInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    profileImg.src = event.target.result;
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // เปลี่ยนชื่อโปรไฟล์
    if (saveNameBtn && nameInput && usernameText) {
        saveNameBtn.addEventListener('click', () => {
            const newName = nameInput.value.trim();
            if (newName !== '') {
                usernameText.textContent = newName;
                nameInput.value = '';
                settingsMenu.classList.add('hidden'); // บันทึกเสร็จปิดเมนู
            }
        });
    }
});
