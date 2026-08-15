document.addEventListener('DOMContentLoaded', () => {
    const profileBtn = document.getElementById('profile-btn');
    const profileDropdown = document.getElementById('profile-dropdown');
    
    const profileImg = document.getElementById('profile-img');
    const dropdownImg = document.getElementById('dropdown-img');
    const imageInput = document.getElementById('image-input');
    
    const usernameText = document.getElementById('username-text');
    const nameInput = document.getElementById('name-input');
    const saveNameBtn = document.getElementById('save-name-btn');

    // กดรูปโปรไฟล์แล้วสลับแสดง/ซ่อน Dropdown UI
    if (profileBtn && profileDropdown) {
        profileBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            profileDropdown.classList.toggle('hidden');
        });

        // คลิกพื้นที่อื่นนอก Dropdown ให้ซ่อนอัตโนมัติ
        document.addEventListener('click', (e) => {
            if (!profileDropdown.contains(e.target) && !profileBtn.contains(e.target)) {
                profileDropdown.classList.add('hidden');
            }
        });
    }

    // เปลี่ยนรูปโปรไฟล์ (อัปเดตทั้ง 2 จุด)
    if (imageInput) {
        imageInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    const newImgSrc = event.target.result;
                    if (profileImg) profileImg.src = newImgSrc;
                    if (dropdownImg) dropdownImg.src = newImgSrc;
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // บันทึกเปลี่ยนชื่อโปรไฟล์
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
