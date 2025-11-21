// app.js

// 1. ฟังก์ชันเลือกเพศ
function selectGender(gender) {
    document.getElementById('gender-male').classList.remove('active');
    document.getElementById('gender-female').classList.remove('active');

    const selectedBtn = document.getElementById('gender-' + gender);
    if(selectedBtn) {
        selectedBtn.classList.add('active');
    }
    console.log("เลือกเพศ:", gender);
}

// 2. ฟังก์ชันคำนวณ BMI
function calculateBMI() {
    let weight = document.getElementById('weight').value;
    let height = document.getElementById('height').value;

    if(weight == "" || height == "") {
        alert("กรุณากรอกน้ำหนักและส่วนสูง!");
        return;
    }

    let heightInMeters = height / 100;
    let bmi = weight / (heightInMeters * heightInMeters);
    bmi = bmi.toFixed(1);

    document.getElementById('bmi-value').innerText = bmi;

    let status = "";
    let advice = "";
    let color = "";

    if (bmi < 18.5) {
        status = "Underweight (ผอมเกินไป)";
        advice = "คุณควรรับประทานอาหารที่มีประโยชน์และเพิ่มปริมาณโปรตีน";
        color = "#FFC107";
    } else if (bmi >= 18.5 && bmi < 24.9) {
        status = "Normal (สมส่วน)";
        advice = "ยอดเยี่ยม! คุณมีสุขภาพที่ดี ควรออกกำลังกายสม่ำเสมอ";
        color = "#28A745";
    } else if (bmi >= 25 && bmi < 29.9) {
        status = "Overweight (น้ำหนักเกิน)";
        advice = "ควรเริ่มควบคุมอาหาร ลดของทอด/ของหวาน";
        color = "#FD7E14";
    } else {
        status = "Obese (โรคอ้วน)";
        advice = "มีความเสี่ยงต่อสุขภาพสูง ควรปรึกษาแพทย์";
        color = "#DC3545";
    }

    let statusElement = document.getElementById('bmi-status');
    statusElement.innerText = status;
    statusElement.style.color = color;
    document.getElementById('bmi-advice').innerText = advice;
}

// 3. ฟังก์ชันจัดการ Modal (เพิ่มใหม่)
function openModal(adviceText) {
    const modal = document.getElementById('advice-modal');
    const modalText = document.getElementById('modal-text');
    
    if(modal && modalText) {
        modalText.innerText = adviceText;
        modal.style.display = 'flex';
    }
}

function closeModal() {
    const modal = document.getElementById('advice-modal');
    if(modal) {
        modal.style.display = 'none';
    }
}

// ปิด Modal เมื่อคลิกพื้นที่ว่าง
window.onclick = function(event) {
    const modal = document.getElementById('advice-modal');
    if (event.target == modal) {
        modal.style.display = "none";
    }
}