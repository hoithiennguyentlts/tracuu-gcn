import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

// --- DÁN MÃ CONFIG CỦA BẠN VÀO ĐÂY ---
const firebaseConfig = {
    apiKey: "AIzaSyDOmL3VtekDeE5updKHnQWuGT5QTLG1a6k",
    authDomain: "tracuugcn-htn.firebaseapp.com",
    projectId: "tracuugcn-htn",
    storageBucket: "tracuugcn-htn.firebasestorage.app",
    messagingSenderId: "741478999735",
    appId: "1:741478999735:web:278ea21fb7aad943a74f32",
    measurementId: "G-QXRX5N85JC"
  };
// -------------------------------------

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

document.getElementById('searchBtn').addEventListener('click', async () => {
    const phone = document.getElementById('phoneInput').value.trim();
    if(!phone) { alert("Vui lòng nhập số điện thoại!"); return; }

    const btn = document.getElementById('searchBtn');
    btn.innerText = "Đang tìm..."; btn.disabled = true;

    try {
        const docRef = doc(db, "certificates", phone);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data();
            document.getElementById('instructionBox').style.display = 'none';
            document.getElementById('resultCard').style.display = 'flex';

            document.getElementById('resPhone').innerText = phone;
            document.getElementById('resName').innerText = data.hoTen;
            document.getElementById('resId').innerText = data.maHoiVien;
            document.getElementById('resContent').innerText = data.noiDung;
            document.getElementById('resBookNo').innerText = data.soSo;
            document.getElementById('resDecisionNo').innerText = data.soQD;
            document.getElementById('resDate').innerText = data.ngayCap;
            document.getElementById('resSigner').innerText = data.nguoiKy;
            
            document.getElementById('certImg').src = data.fileUrl;
            document.getElementById('downloadLink').href = data.fileUrl;
        } else {
            alert("Không tìm thấy dữ liệu cho số điện thoại này!");
            document.getElementById('resultCard').style.display = 'none';
            document.getElementById('instructionBox').style.display = 'block';
        }
    } catch (error) {
        console.error(error);
        alert("Lỗi kết nối cơ sở dữ liệu!");
    } finally {
        btn.innerText = "Tìm kiếm"; btn.disabled = false;
    }
});