import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
// Đã thay đổi: Import collection và addDoc thay vì doc và setDoc
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyDOmL3VtekDeE5updKHnQWuGT5QTLG1a6k",
    authDomain: "tracuugcn-htn.firebaseapp.com",
    projectId: "tracuugcn-htn",
    storageBucket: "tracuugcn-htn.firebasestorage.app",
    messagingSenderId: "741478999735",
    appId: "1:741478999735:web:278ea21fb7aad943a74f32",
    measurementId: "G-QXRX5N85JC"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Quản lý trạng thái đăng nhập
onAuthStateChanged(auth, (user) => {
    if (user) {
        document.getElementById('loginSection').style.display = 'none';
        document.getElementById('uploadSection').style.display = 'block';
    } else {
        document.getElementById('loginSection').style.display = 'block';
        document.getElementById('uploadSection').style.display = 'none';
    }
});

document.getElementById('loginBtn').addEventListener('click', () => {
    const email = document.getElementById('adminEmail').value;
    const password = document.getElementById('adminPassword').value;
    signInWithEmailAndPassword(auth, email, password)
        .catch((error) => alert("Sai email hoặc mật khẩu!"));
});

document.getElementById('logoutBtn').addEventListener('click', () => {
    signOut(auth);
});

document.getElementById('uploadBtn').addEventListener('click', async () => {
    const phone = document.getElementById('upPhone').value.trim();
    const fileUrl = document.getElementById('upFileUrl').value.trim(); 
    
    if (!phone || !fileUrl) {
        alert("Vui lòng nhập Số điện thoại và Link ảnh!"); return;
    }

    const btn = document.getElementById('uploadBtn');
    btn.innerText = "Đang xử lý..."; btn.disabled = true;

    try {
        const docData = {
            phone: phone, // Đã thêm: Lưu số điện thoại làm 1 trường dữ liệu
            hoTen: document.getElementById('upName').value.trim(),
            maHoiVien: document.getElementById('upId').value.trim(),
            noiDung: document.getElementById('upContent').value.trim(),
            soSo: document.getElementById('upBookNo').value.trim(),
            soQD: document.getElementById('upDecisionNo').value.trim(),
            ngayCap: document.getElementById('upDate').value.trim(),
            nguoiKy: document.getElementById('upSigner').value.trim(),
            fileUrl: fileUrl 
        };

        // Đã thay đổi: Dùng addDoc để lưu vào collection "certificates" (tự tạo ID riêng cho mỗi GCN)
        await addDoc(collection(db, "certificates"), docData);

        alert("Tải lên thành công!");
        document.querySelectorAll('#uploadSection input').forEach(input => input.value = '');
        document.getElementById('upContent').value = '';
    } catch (error) {
        console.error(error);
        alert("Lỗi: Không thể lưu dữ liệu.");
    } finally {
        btn.innerText = "Lưu Dữ Liệu"; btn.disabled = false;
    }
});