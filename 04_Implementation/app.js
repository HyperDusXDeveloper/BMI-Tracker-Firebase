// app.js - ฉบับเชื่อมต่อ Firebase สมบูรณ์

// -------------------------------------------------
// 1. การตั้งค่า Firebase (เอา Config ของคุณมาใส่ตรงนี้!)
// -------------------------------------------------
const firebaseConfig = {
  apiKey: "AIzaSyD-jMhbBNhKhW6WviwLFF0zsA9Myp2SYiI",
  authDomain: "bmi-tracker-firebase.firebaseapp.com",
  projectId: "bmi-tracker-firebase",
  storageBucket: "bmi-tracker-firebase.firebasestorage.app",
  messagingSenderId: "917628551810",
  appId: "1:917628551810:web:ccf8296c9d0da08defea9b",
  measurementId: "G-F1Y7RV1GT7"
};

// เริ่มต้นทำงาน Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

console.log("Firebase เชื่อมต่อแล้ว!");

// -------------------------------------------------
// 2. ระบบตรวจสอบสถานะล็อกอิน (Auth State Observer)
// -------------------------------------------------
auth.onAuthStateChanged((user) => {
    const path = window.location.pathname;
    const page = path.split("/").pop(); // ชื่อไฟล์ปัจจุบัน (index.html หรือ dashboard.html)

    if (user) {
        console.log("ผู้ใช้ล็อกอินอยู่:", user.email);
        
        // ถ้าล็อกอินแล้ว แต่อยู่หน้า Login -> ดีดไปหน้า Dashboard
        if (page === "index.html" || page === "") {
            window.location.href = "dashboard.html";
        }

        // ถ้าอยู่หน้า Dashboard -> โหลดข้อมูลผู้ใช้และประวัติ
        if (page === "dashboard.html") {
            setupUserProfile(user);
            loadHistory(user.uid);
        }

    } else {
        console.log("ยังไม่ได้ล็อกอิน");
        // ถ้ายังไม่ล็อกอิน แต่อยู่หน้า Dashboard -> ดีดกลับไปหน้า Login
        if (page === "dashboard.html") {
            window.location.href = "index.html";
        }
    }
});

// -------------------------------------------------
// 3. ฟังก์ชันสำหรับหน้า Login (index.html)
// -------------------------------------------------
const loginBtn = document.getElementById('google-login-btn');
if (loginBtn) {
    loginBtn.addEventListener('click', () => {
        const provider = new firebase.auth.GoogleAuthProvider();
        auth.signInWithPopup(provider)
            .then((result) => {
                console.log("Login สำเร็จ!", result.user);
                // ไม่ต้องสั่ง Redirect เพราะ onAuthStateChanged จะทำงานเอง
            })
            .catch((error) => {
                console.error("Login ผิดพลาด:", error);
                alert("เข้าสู่ระบบไม่สำเร็จ: " + error.message);
            });
    });
}

// -------------------------------------------------
// 4. ฟังก์ชันสำหรับหน้า Dashboard
// -------------------------------------------------

// ตั้งค่ารูปและชื่อโปรไฟล์
function setupUserProfile(user) {
    const profilePic = document.getElementById('user-profile-pic');
    if (profilePic) {
        // ถ้า user มีรูป ให้ใช้รูป Google ถ้าไม่มีให้ใช้รูป default
        profilePic.src = user.photoURL || "assets/profile.png";
    }
    
    // ปุ่ม Logout
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            auth.signOut().then(() => {
                console.log("Logout เรียบร้อย");
            });
        });
    }
}

// ฟังก์ชันเลือกเพศ (เหมือนเดิม)
function selectGender(gender) {
    document.getElementById('gender-male').classList.remove('active');
    document.getElementById('gender-female').classList.remove('active');
    const btn = document.getElementById('gender-' + gender);
    if(btn) btn.classList.add('active');
}

// ฟังก์ชันคำนวณและบันทึก (หัวใจสำคัญ!)
function calculateBMI() {
    // 1. ดึงค่า
    const weight = document.getElementById('weight').value;
    const height = document.getElementById('height').value;
    const genderBtn = document.querySelector('.gender-card.active');

    // Validation
    if(!weight || !height) { alert("กรุณากรอกข้อมูลให้ครบ!"); return; }
    if(!genderBtn) { alert("กรุณาเลือกเพศ!"); return; }

    // 2. คำนวณ
    const h_meter = height / 100;
    const bmi = (weight / (h_meter * h_meter)).toFixed(1);
    const gender = genderBtn.id.replace("gender-", ""); // 'male' หรือ 'female'

    // 3. แปลผล
    let status = "", advice = "", color = "";
    if (bmi < 18.5) {
        status = "Underweight"; advice = "น้ำหนักน้อยเกินไป ควรทานอาหารเพิ่มโปรตีนและแป้ง"; color = "#FFC107";
    } else if (bmi < 24.9) {
        status = "Normal"; advice = "สุขภาพดีมาก! ควรรักษาหุ่นด้วยการออกกำลังกายสม่ำเสมอ"; color = "#28A745";
    } else if (bmi < 29.9) {
        status = "Overweight"; advice = "เริ่มอ้วนแล้ว ควรลดของหวาน/ของทอด และเดินเร็ววันละ 30 นาที"; color = "#FD7E14";
    } else {
        status = "Obese"; advice = "อ้วนอันตราย ควรปรึกษาแพทย์และควบคุมอาหารอย่างจริงจัง"; color = "#DC3545";
    }

    // 4. แสดงผลหน้าจอ
    document.getElementById('bmi-value').innerText = bmi;
    document.getElementById('bmi-status').innerText = status;
    document.getElementById('bmi-status').style.color = color;
    document.getElementById('bmi-advice').innerText = advice;

    // 5. บันทึกลง Firebase Firestore ☁️
    const user = auth.currentUser;
    if (user) {
        db.collection("bmi_records").add({
            uid: user.uid,         // บันทึกว่าเป็นของใคร
            weight: Number(weight),
            height: Number(height),
            age: Number(document.getElementById('age').value) || 0,
            gender: gender,
            bmi: Number(bmi),
            status: status,
            advice: advice,
            timestamp: firebase.firestore.FieldValue.serverTimestamp() // เวลาปัจจุบันจาก Server
        }).then(() => {
            console.log("บันทึกข้อมูลสำเร็จ!");
            // โหลดตารางใหม่ทันที (เพื่อให้เห็นข้อมูลล่าสุด)
            loadHistory(user.uid);
        }).catch((error) => {
            console.error("บันทึกไม่สำเร็จ:", error);
        });
    }
}

// ฟังก์ชันดึงประวัติ (Load History)
function loadHistory(uid) {
    const historyList = document.getElementById('history-list');
    if (!historyList) return;

    // สั่งดึงข้อมูลจาก collection 'bmi_records' ที่ uid ตรงกับเรา เรียงตามเวลาล่าสุด
    db.collection("bmi_records")
        .where("uid", "==", uid)
        .orderBy("timestamp", "desc")
        .limit(10) // เอาแค่ 10 รายการล่าสุด
        .get()
        .then((querySnapshot) => {
            let html = "";
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                // แปลง timestamp เป็นวันที่สวยๆ
                const date = data.timestamp ? data.timestamp.toDate().toLocaleDateString('th-TH') : "-";
                
                // กำหนดสีปุ่ม Badge
                let badgeClass = "normal";
                if(data.status.includes("Under")) badgeClass = "under"; // คุณต้องไปเพิ่ม css class .under เอาเองนะ (เช่น สีเหลือง)
                else if(data.status.includes("Over")) badgeClass = "over";
                else if(data.status.includes("Obese")) badgeClass = "obese";

                // สร้างแถวตาราง
                html += `
                <tr>
                    <td>${date}</td>
                    <td>${data.age}</td>
                    <td>${data.height}</td>
                    <td>${data.weight}</td>
                    <td style="text-transform: capitalize;">${data.gender}</td>
                    <td>${data.bmi}</td>
                    <td><span class="status-badge ${badgeClass}">${data.status}</span></td>
                    <td><button class="view-btn" onclick="openModal('${data.advice}')">VIEW</button></td>
                    <td><button class="delete-btn" onclick="deleteRecord('${doc.id}')">🗑️</button></td>
                </tr>
                `;
            });
            historyList.innerHTML = html;
        })
        .catch((error) => {
            console.error("โหลดประวัติไม่สำเร็จ:", error);
        });
}

// ฟังก์ชันลบข้อมูล (Delete)
function deleteRecord(docId) {
    if(confirm("ต้องการลบรายการนี้ใช่ไหม?")) {
        db.collection("bmi_records").doc(docId).delete().then(() => {
            console.log("ลบสำเร็จ!");
            // รีโหลดตาราง
            loadHistory(auth.currentUser.uid);
        }).catch((error) => {
            console.error("ลบไม่สำเร็จ:", error);
        });
    }
}

// ฟังก์ชัน Modal (เหมือนเดิม)
function openModal(text) {
    document.getElementById('modal-text').innerText = text;
    document.getElementById('advice-modal').style.display = 'flex';
}
function closeModal() {
    document.getElementById('advice-modal').style.display = 'none';
}
window.onclick = function(e) {
    if(e.target == document.getElementById('advice-modal')) closeModal();
}