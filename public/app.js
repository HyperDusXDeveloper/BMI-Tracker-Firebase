// app.js - ฉบับเชื่อมต่อ Firebase สมบูรณ์ + เนื้อหาละเอียด + แก้ไขเวลา

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
    const page = path.split("/").pop();

    if (user) {
        console.log("ผู้ใช้ล็อกอินอยู่:", user.email);
        if (page === "index.html" || page === "") {
            window.location.href = "dashboard.html";
        }
        if (page === "dashboard.html") {
            setupUserProfile(user);
            loadHistory(user.uid);
        }
    } else {
        console.log("ยังไม่ได้ล็อกอิน");
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

function setupUserProfile(user) {
    const profilePic = document.getElementById('user-profile-pic');
    if (profilePic) {
        profilePic.src = user.photoURL || "assets/profile.png";
    }
    
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            auth.signOut().then(() => {
                console.log("Logout เรียบร้อย");
            });
        });
    }
}

function selectGender(gender) {
    document.getElementById('gender-male').classList.remove('active');
    document.getElementById('gender-female').classList.remove('active');
    const btn = document.getElementById('gender-' + gender);
    if(btn) btn.classList.add('active');
}

function calculateBMI() {
    // 1. ดึงค่าและตรวจสอบ
    const weight = document.getElementById('weight').value;
    const height = document.getElementById('height').value;
    const genderBtn = document.querySelector('.gender-card.active');

    if(!weight || !height) { alert("กรุณากรอกข้อมูลให้ครบ!"); return; }
    if(!genderBtn) { alert("กรุณาระบุเพศก่อนคำนวณ!"); return; }

    // 2. คำนวณ BMI
    const h_meter = height / 100;
    const bmi = (weight / (h_meter * h_meter)).toFixed(1);
    const gender = genderBtn.id.replace("gender-", "");

    // 3. แปลผล (5 ระดับ ตามข้อมูลใหม่)
    let status = "", advice = "", color = "";

    if (bmi < 18.5) {
        // --- 1) ผอมมาก ---
        status = "Very Underweight";
        color = "#1976D2"; // สีน้ำเงินเข้ม
        advice = `
            <strong style="color:#1976D2;">✔ เป้าหมาย:</strong>
            <ul><li>เพิ่มน้ำหนักแบบสุขภาพดี เน้นเพิ่ม "กล้ามเนื้อ" ไม่ใช่ไขมันล้วน</li></ul>
            <strong style="color:#1976D2;">✔ อาหาร:</strong>
            <ul>
                <li>เพิ่มพลังงานจากปกติ 300–500 kcal/วัน</li>
                <li>เน้นโปรตีน: ไก่, ไข่, ปลา, เต้าหู้, นม</li>
                <li>เพิ่มคาร์บดีๆ: ข้าวกล้อง, ขนมปังโฮลวีต, มันหวาน</li>
                <li>ของว่างที่ดี: กล้วย 1–2 ลูก, นม, ถั่ว</li>
                <li>กินให้ครบ 3 มื้อ + เสริมอีก 1–2 มื้อ</li>
            </ul>
            <strong style="color:#1976D2;">✔ ออกกำลังกาย:</strong>
            <ul>
                <li>เวทเทรนนิ่ง 3–4 วัน/สัปดาห์ (น้ำหนักเบา–กลาง)</li>
                <li>คาร์ดิโอเบาๆ 10–15 นาที (เพื่อกระตุ้นระบบ ไม่เผาผลาญเกิน)</li>
                <li>ฝึกพื้นฐาน: Squat, Push-up, Rowing, Hip hinge</li>
            </ul>
        `;
    } 
    else if (bmi >= 18.5 && bmi < 20) {
        // --- 2) ผอม (ช่วงต้น) ---
        status = "Underweight";
        color = "#42A5F5"; // สีฟ้าอ่อน
        advice = `
            <strong style="color:#42A5F5;">✔ เป้าหมาย:</strong>
            <ul><li>ปรับร่างกายให้สมดุล + เพิ่มมวลกล้ามเนื้อเล็กน้อย</li></ul>
            <strong style="color:#42A5F5;">✔ อาหาร:</strong>
            <ul>
                <li>เพิ่มพลังงาน 200–300 kcal/วัน</li>
                <li>โปรตีน 1–1.2 g/กก. น้ำหนักตัว</li>
                <li>เพิ่มคาร์บเชิงซ้อนเพื่อเก็บพลังงาน</li>
                <li>แบ่งมื้ออาหารให้สม่ำเสมอ</li>
            </ul>
            <strong style="color:#42A5F5;">✔ ออกกำลังกาย:</strong>
            <ul>
                <li>เวทเทรนนิ่ง 2–3 วัน/สัปดาห์</li>
                <li>คาร์ดิโอปานกลาง 20–25 นาที (2–3 วัน)</li>
                <li>เน้นฟื้นฟูกล้ามเนื้อ และเพิ่มความแข็งแรงแกนกลางลำตัว</li>
            </ul>
        `;
    } 
    else if (bmi >= 20 && bmi < 23) {
        // --- 3) ปกติ ---
        status = "Normal";
        color = "#28A745"; // สีเขียว
        advice = `
            <strong style="color:#28A745;">✔ เป้าหมาย:</strong>
            <ul><li>รักษาน้ำหนัก + พัฒนาคุณภาพร่างกาย</li></ul>
            <strong style="color:#28A745;">✔ อาหาร:</strong>
            <ul>
                <li>โปรตีน 1–1.2 g/กก. น้ำหนักตัว</li>
                <li>เน้นอาหารจริง ลดของหวาน น้ำตาล ไขมันทรานส์</li>
                <li>ควบคุมสัดส่วน: ½ ผัก, ¼ โปรตีน, ¼ คาร์บดี</li>
            </ul>
            <strong style="color:#28A745;">✔ ออกกำลังกาย:</strong>
            <ul>
                <li>เวทเทรนนิ่ง 2–3 วัน</li>
                <li>คาร์ดิโอ 150 นาที/สัปดาห์</li>
                <li>โยคะหรือยืดเหยียดเพิ่มความคล่องตัว 1–2 วัน</li>
            </ul>
        `;
    } 
    else if (bmi >= 23 && bmi < 25) {
        // --- 4) น้ำหนักเกิน ---
        status = "Overweight";
        color = "#FFC107"; // สีเหลือง (ใช้สีเข้มหน่อยให้อ่านง่าย)
        advice = `
            <strong style="color:#F57F17;">✔ เป้าหมาย:</strong>
            <ul><li>ลดไขมัน + เพิ่มกล้ามเนื้อเบื้องต้น</li></ul>
            <strong style="color:#F57F17;">✔ อาหาร:</strong>
            <ul>
                <li>ลดพลังงาน 250–300 kcal/วัน</li>
                <li>เน้นโปรตีนเยอะขึ้นเพื่อความอิ่มนาน</li>
                <li>ผักมากขึ้น ลดน้ำหวาน ของทอด ขนม</li>
                <li>เน้นคาร์บเชิงซ้อน เช่น ข้าวกล้อง ฟักทอง มันม่วง</li>
            </ul>
            <strong style="color:#F57F17;">✔ ออกกำลังกาย:</strong>
            <ul>
                <li>เดินเร็ว 30–45 นาที</li>
                <li>เวทเทรนนิ่งเบา–กลาง 2–3 วัน/สัปดาห์</li>
                <li>หากร่างกายไหว: HIIT แบบเบา 1–2 วัน</li>
            </ul>
        `;
    } 
    else {
        // --- 5) อ้วน (>= 25) ---
        status = "Obese";
        color = "#DC3545"; // สีแดง
        advice = `
            <strong style="color:#DC3545;">✔ เป้าหมาย:</strong>
            <ul><li>ลดไขมันอย่างปลอดภัย + ปรับพฤติกรรมระยะยาว</li></ul>
            <strong style="color:#DC3545;">✔ อาหาร:</strong>
            <ul>
                <li>ลดพลังงาน 400–600 kcal/วัน</li>
                <li>โปรตีนสูง 1.2–1.5 g/กก. เพื่อคงกล้ามเนื้อ</li>
                <li>ลดน้ำตาล ของทอด เบเกอรี่ ชาไข่มุก</li>
                <li>ดื่มน้ำ 1.5–2 ลิตร/วัน</li>
                <li>แบ่งอาหารเป็นมื้อเล็กๆ 4–5 มื้อเพื่อลดหิว</li>
            </ul>
            <strong style="color:#DC3545;">✔ ออกกำลังกาย:</strong>
            <ul>
                <li>เลือกแรงกระแทกต่ำ (Low Impact): เดินเร็ว, ปั่นจักรยาน, ว่ายน้ำ</li>
                <li>เวทเทรนนิ่ง 2–3 วัน/สัปดาห์ (เพิ่มมวลกล้ามเนื้อ)</li>
                <li>ค่อยๆ เพิ่มคาร์ดิโอเป็น 200–250 นาที/สัปดาห์</li>
            </ul>
        `;
    }

    // 4. แสดงผลหน้าจอ
    document.getElementById('bmi-value').innerText = bmi;
    
    const statusElement = document.getElementById('bmi-status');
    statusElement.innerText = status;
    statusElement.style.color = color;

    // ใช้ innerHTML เพื่อให้แสดง HTML Tags ได้
    document.getElementById('bmi-advice').innerHTML = advice;

    // 5. บันทึกลง Firebase
    const user = auth.currentUser;
    if (user) {
        db.collection("bmi_records").add({
            uid: user.uid,
            weight: Number(weight),
            height: Number(height),
            age: Number(document.getElementById('age').value) || 0,
            gender: gender,
            bmi: Number(bmi),
            status: status,
            advice: advice,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        }).then(() => {
            console.log("บันทึกสำเร็จ!");
            loadHistory(user.uid);
        }).catch((err) => console.error("Error:", err));
    }
}

// ฟังก์ชันดึงประวัติ (Load History)
function loadHistory(uid) {
    const historyList = document.getElementById('history-list');
    if (!historyList) return;

    historyList.innerHTML = "";

    db.collection("bmi_records")
        .where("uid", "==", uid)
        .orderBy("timestamp", "desc")
        .limit(10)
        .get()
        .then((querySnapshot) => {
            if (querySnapshot.empty) {
                historyList.innerHTML = "<tr><td colspan='9'>ไม่พบประวัติการบันทึก</td></tr>";
                return;
            }

            let html = "";
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                
                // 1. แปลงวันที่และเวลา (แก้ไขตรงนี้)
                let date = "-";
                if (data.timestamp) {
                    date = new Date(data.timestamp.seconds * 1000).toLocaleString('th-TH'); 
                }
                
                // 2. สี Badge
                let badgeClass = "normal";
                if (data.status.includes("Under") || data.status.includes("ผอม")) badgeClass = "under";
                else if (data.status.includes("Over") || data.status.includes("เกิน")) badgeClass = "over";
                else if (data.status.includes("Obese") || data.status.includes("อ้วน")) badgeClass = "obese";

                // 3. ล้าง "บรรทัดใหม่" และ "เครื่องหมายคำพูด" ออกก่อนใส่ปุ่ม
                let safeAdvice = "";
                if (data.advice) {
                    safeAdvice = data.advice
                        .replace(/(\r\n|\n|\r)/gm, "") 
                        .replace(/"/g, "&quot;");      
                }

                // 4. สร้างแถวตาราง
                html += `
                <tr>
                    <td>${date}</td>
                    <td>${data.age}</td>
                    <td>${data.height}</td>
                    <td>${data.weight}</td>
                    <td style="text-transform: capitalize;">${data.gender}</td>
                    <td>${data.bmi}</td>
                    <td><span class="status-badge ${badgeClass}">${data.status}</span></td>
                    <td><button class="view-btn" onclick="openModal('${safeAdvice}')">VIEW</button></td>
                    <td><button class="delete-btn" onclick="deleteRecord('${doc.id}')">🗑️</button></td>
                </tr>
                `;
            });
            historyList.innerHTML = html;
        })
        .catch((error) => {
            console.error("Error:", error);
        });
}

// ฟังก์ชันลบข้อมูล (Delete)
function deleteRecord(docId) {
    if(confirm("ต้องการลบรายการนี้ใช่ไหม?")) {
        db.collection("bmi_records").doc(docId).delete().then(() => {
            console.log("ลบสำเร็จ!");
            loadHistory(auth.currentUser.uid);
        }).catch((error) => {
            console.error("ลบไม่สำเร็จ:", error);
        });
    }
}

// ฟังก์ชัน Modal (แก้ไขให้ใช้ innerHTML)
function openModal(adviceText) {
    const modal = document.getElementById('advice-modal');
    const modalText = document.getElementById('modal-text');
    
    if(modal && modalText) {
        modalText.innerHTML = adviceText; // ใช้ innerHTML เพื่อแสดงผล HTML Tag
        modal.style.display = 'flex';
    }
}

function closeModal() {
    document.getElementById('advice-modal').style.display = 'none';
}

window.onclick = function(e) {
    if(e.target == document.getElementById('advice-modal')) closeModal();
}// ส่วนหัวข้อ (สีแดง ตัวใหญ่ มีเงา)
console.log(
  "%cBMI Tracker Firebase!", 
  "color: yellow; font-size: 60px; font-weight: bold; text-shadow: 2px 2px 0px #000;"
);

// ส่วนเนื้อหา (ตัวหนังสือปกติ)
console.log(
  "%cCS436 Final Project BMI Tracker", 
  "font-size: 18px; color: #e0e0e0; font-family: sans-serif;"
);
console.log(
  "%cGithub Source Code https://github.com/HyperDusXDeveloper/BMI-Tracker-Firebase", 
  "font-size: 18px; color: #e0e0e0; font-family: sans-serif;"
);
console.log(
  "%cCanva Present https://www.canva.com/design/DAG5cEdoDwc/4-oSXpOxOdqkDlHNJJNlOQ/edit?utm_content=DAG5cEdoDwc&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton", 
  "font-size: 18px; color: #e0e0e0; font-family: sans-serif;"
);