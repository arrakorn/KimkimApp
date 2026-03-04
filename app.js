// นำเข้าฟังก์ชันที่จำเป็นจาก Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, doc, setDoc, increment } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// ตั้งค่า Firebase ตามข้อมูลที่คุณให้มา
const firebaseConfig = {
  apiKey: "AIzaSyBALBRccsCoSgadd26glq8kjCVzYVjpRjQ",
  authDomain: "arakonapp.firebaseapp.com",
  projectId: "arakonapp",
  storageBucket: "arakonapp.firebasestorage.app",
  messagingSenderId: "377162906533",
  appId: "1:377162906533:web:dcc6197b28cf961431464c",
  measurementId: "G-WYRJZD0ZMG"
};

// เริ่มต้นใช้งาน Firebase และ Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// สร้างฟังก์ชัน vote และทำให้เรียกใช้ได้จากหน้า HTML
window.vote = async function(candidateId) {
    try {
        // อ้างอิงไปยัง Collection ชื่อ 'votes' และ Document ตามเบอร์ที่โหวต
        const candidateRef = doc(db, "votes", candidateId);
        
        // บวกคะแนนเพิ่ม 1 (ถ้าไม่มี Document นี้ ระบบจะสร้างให้ใหม่โดยอัตโนมัติ)
        await setDoc(candidateRef, {
            score: increment(1)
        }, { merge: true });

        // แสดงข้อความความสำเร็จ
        const successMsg = document.getElementById('success-message');
        successMsg.classList.remove('hidden');
        successMsg.style.opacity = '1';

        // ปิดปุ่มโหวตทั้งหมดเพื่อป้องกันการกดเบิ้ล
        const buttons = document.querySelectorAll('button');
        buttons.forEach(btn => {
            btn.disabled = true;
            btn.innerText = 'โหวตแล้ว';
        });

    } catch (error) {
        console.error("Error writing document: ", error);
        alert("เกิดข้อผิดพลาดในการโหวต กรุณาลองใหม่อีกครั้งครับ");
    }
};
