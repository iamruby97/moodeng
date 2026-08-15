document.addEventListener('DOMContentLoaded', () => {
    const profileImg = document.getElementById('profile-img');
    const imageInput = document.getElementById('image-input');
    const usernameText = document.getElementById('username-text');
    const nameInput = document.getElementById('name-input');
    const saveNameBtn = document.getElementById('save-name-btn');

    // ระบบอัปโหลดเปลี่ยนรูปโปรไฟล์
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

    // ระบบเปลี่ยนชื่อโปรไฟล์
    if (saveNameBtn && nameInput && usernameText) {
        saveNameBtn.addEventListener('click', () => {
            const newName = nameInput.value.trim();
            if (newName !== '') {
                usernameText.textContent = newName;
                nameInput.value = '';
            }
        });
    }
});
