// นำเข้าฟังก์ชันที่จำเป็นจาก Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { 
    getFirestore, 
    collection, 
    addDoc, 
    getDocs, 
    serverTimestamp, 
    query, 
    orderBy 
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

// Config ของคุณ
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

// อ้างอิงถึง Element ต่างๆ ใน HTML
const submitBtn = document.getElementById('submitBtn');
const studentIdInput = document.getElementById('studentId');
const studentNameInput = document.getElementById('studentName');
const attendanceList = document.getElementById('attendanceList');

// ฟังก์ชันสำหรับดึงข้อมูลการเช็คชื่อมาแสดง
async function loadAttendance() {
    attendanceList.innerHTML = '<p style="text-align:center;">กำลังโหลดข้อมูล...</p>';
    
    try {
        // ดึงข้อมูลจากคอลเล็กชัน "attendance" เรียงตามเวลาล่าสุด
        const q = query(collection(db, "attendance"), orderBy("timestamp", "desc"));
        const querySnapshot = await getDocs(q);
        
        attendanceList.innerHTML = ''; // ล้างข้อความกำลังโหลด
        
        if (querySnapshot.empty) {
            attendanceList.innerHTML = '<p style="text-align:center; color:#888;">ยังไม่มีข้อมูลการเข้าเรียน</p>';
            return;
        }

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const li = document.createElement('li');
            
            // จัดการรูปแบบเวลา
            let timeString = '';
            if (data.timestamp) {
                const date = data.timestamp.toDate();
                timeString = date.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }) + ' น.';
            }

            li.innerHTML = `
                <div>
                    <strong>${data.studentId}</strong><br>
                    <span>${data.studentName}</span>
                </div>
                <div class="time-stamp">${timeString}</div>
            `;
            attendanceList.appendChild(li);
        });
    } catch (error) {
        console.error("Error loading data: ", error);
        attendanceList.innerHTML = '<p style="text-align:center; color:red;">เกิดข้อผิดพลาดในการโหลดข้อมูล</p>';
    }
}

// เหตุการณ์เมื่อกดปุ่มเช็คชื่อ
submitBtn.addEventListener('click', async () => {
    const studentId = studentIdInput.value.trim();
    const studentName = studentNameInput.value.trim();

    if (studentId === '' || studentName === '') {
        alert('กรุณากรอกข้อมูลรหัสและชื่อนักเรียนให้ครบถ้วน');
        return;
    }

    // เปลี่ยนปุ่มเป็นสถานะกำลังโหลด
    const originalBtnText = submitBtn.innerText;
    submitBtn.innerText = 'กำลังบันทึก...';
    submitBtn.disabled = true;

    try {
        // บันทึกข้อมูลลง Cloud Firestore
        await addDoc(collection(db, "attendance"), {
            studentId: studentId,
            studentName: studentName,
            timestamp: serverTimestamp()
        });
        
        // ล้างช่องกรอกข้อมูล
        studentIdInput.value = '';
        studentNameInput.value = '';
        studentIdInput.focus();
        
        // โหลดข้อมูลใหม่เพื่อแสดงผล
        loadAttendance(); 
    } catch (error) {
        console.error("Error adding document: ", error);
        alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล กรุณาลองใหม่อีกครั้ง');
    } finally {
        // นำปุ่มกลับสู่สถานะปกติ
        submitBtn.innerText = originalBtnText;
        submitBtn.disabled = false;
    }
});

// โหลดข้อมูลทันทีเมื่อเปิดหน้าเว็บ
loadAttendance();
