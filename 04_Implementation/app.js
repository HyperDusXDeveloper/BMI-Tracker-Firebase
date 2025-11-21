// app.js

// 1. ฟังก์ชันเลือกเพศ (เปลี่ยนสีปุ่ม)
function selectGender(gender) {
    // ลบสีออกจากทุกปุ่มก่อน
    document.getElementById('gender-male').classList.remove('active');
    document.getElementById('gender-female').classList.remove('active');

    // เติมสีให้ปุ่มที่เลือก
    const selectedBtn = document.getElementById('gender-' + gender);
    selectedBtn.classList.add('active');
    
    console.log("เลือกเพศ:", gender);
}

// 2. ฟังก์ชันคำนวณ BMI (เตรียมไว้ก่อน)
// app.js (อัปเกรดฟังก์ชันคำนวณ)

function calculateBMI() {
    // 1. ดึงค่าจากช่องกรอก
    let weight = document.getElementById('weight').value;
    let height = document.getElementById('height').value;

    if(weight == "" || height == "") {
        alert("กรุณากรอกน้ำหนักและส่วนสูง!");
        return;
    }

    // 2. คำนวณ BMI
    let heightInMeters = height / 100;
    let bmi = weight / (heightInMeters * heightInMeters);
    bmi = bmi.toFixed(1); // ทศนิยม 1 ตำแหน่ง

    // 3. แสดงตัวเลข BMI
    document.getElementById('bmi-value').innerText = bmi;

    // 4. แปลผล (Logic: If-Else)
    let status = "";
    let advice = "";
    let color = "";

    if (bmi < 18.5) {
        status = "Underweight (ผอมเกินไป)";
        advice = "คุณควรรับประทานอาหารที่มีประโยชน์และเพิ่มปริมาณโปรตีน เพื่อเสริมสร้างกล้ามเนื้อและน้ำหนักตัวอย่างเหมาะสม";
        color = "#FFC107"; // สีเหลือง
    } else if (bmi >= 18.5 && bmi < 24.9) {
        status = "Normal (สมส่วน)";
        advice = "ยอดเยี่ยม! คุณมีสุขภาพที่ดี ควรออกกำลังกายแบบคาร์ดิโอ (Cardio) วันละ 30 นาที เพื่อรักษาระดับความฟิต";
        color = "#28A745"; // สีเขียว
    } else if (bmi >= 25 && bmi < 29.9) {
        status = "Overweight (น้ำหนักเกิน)";
        advice = "ควรเริ่มควบคุมอาหาร ลดของทอด/ของหวาน และเน้นการเดินเร็วหรือว่ายน้ำเพื่อเผาผลาญไขมัน";
        color = "#FD7E14"; // สีส้ม
    } else {
        status = "Obese (โรคอ้วน)";
        advice = "มีความเสี่ยงต่อสุขภาพสูง ควรปรึกษาแพทย์ และเริ่มออกกำลังกายเบาๆ เพื่อลดแรงกระแทกที่ข้อเข่า";
        color = "#DC3545"; // สีแดง
    }

    // 5. อัปเดตหน้าจอ (DOM Manipulation)
    let statusElement = document.getElementById('bmi-status');
    statusElement.innerText = status;
    statusElement.style.color = color; // เปลี่ยนสีตัวหนังสือตามเกณฑ์

    document.getElementById('bmi-advice').innerText = advice;
}