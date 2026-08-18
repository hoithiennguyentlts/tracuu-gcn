import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
// Đã thay đổi: Import thư viện hỗ trợ truy vấn (query, where, getDocs)
import { getFirestore, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

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
const db = getFirestore(app);

document.getElementById('searchBtn').addEventListener('click', async () => {
    const phone = document.getElementById('phoneInput').value.trim();
    if(!phone) { alert("Vui lòng nhập số điện thoại!"); return; }

    const btn = document.getElementById('searchBtn');
    btn.innerText = "Đang tìm..."; btn.disabled = true;

    const resultsContainer = document.getElementById('resultsContainer');
    const instructionBox = document.getElementById('instructionBox');
    
    // Xóa sạch kết quả của lần tìm kiếm trước đó
    resultsContainer.innerHTML = '';

    try {
        // Đã thay đổi: Tạo câu truy vấn tìm tất cả GCN có trường 'phone' bằng với số đã nhập
        const q = query(collection(db, "certificates"), where("phone", "==", phone));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            // Nếu có kết quả, ẩn hộp hướng dẫn đi
            instructionBox.style.display = 'none';

            // Chạy vòng lặp qua từng giấy chứng nhận tìm được
            querySnapshot.forEach((docSnap) => {
                const data = docSnap.data();
                
                // Tạo mã HTML cho từng thẻ GCN
                const card = document.createElement('div');
                card.className = 'result-card';
                card.innerHTML = `
                    <img src="${data.fileUrl}" alt="Giấy chứng nhận" class="cert-image">
                    <div class="info-group"><strong>ID (Số ĐT):</strong> <span>${data.phone || phone}</span></div>
                    <div class="info-group"><strong>Họ và tên:</strong> <span>${data.hoTen || ''}</span></div>
                    <div class="info-group"><strong>Mã hội viên:</strong> <span>${data.maHoiVien || ''}</span></div>
                    <div class="info-group"><strong>Nội dung:</strong> <span>${data.noiDung || ''}</span></div>
                    <div class="info-group"><strong>Số sổ:</strong> <span>${data.soSo || ''}</span></div>
                    <div class="info-group"><strong>Số Quyết định:</strong> <span>${data.soQD || ''}</span></div>
                    <div class="info-group"><strong>Ngày cấp:</strong> <span>${data.ngayCap || ''}</span></div>
                    <div class="info-group"><strong>Người ký:</strong> <span>${data.nguoiKy || ''}</span></div>
                    <a href="${data.fileUrl}" class="download-btn" target="_blank" download>Tải về Giấy chứng nhận</a>
                `;
                // Đưa thẻ vừa tạo vào vùng chứa
                resultsContainer.appendChild(card);
            });
        } else {
            // Nếu không có kết quả
            alert("Không tìm thấy dữ liệu cho số điện thoại này!");
            instructionBox.style.display = 'block';
        }
    } catch (error) {
        console.error(error);
        alert("Lỗi kết nối cơ sở dữ liệu!");
    } finally {
        btn.innerText = "Tìm kiếm"; btn.disabled = false;
    }
});