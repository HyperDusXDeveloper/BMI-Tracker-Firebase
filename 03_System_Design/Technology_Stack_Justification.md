# การเลือกใช้เทคโนโลยี (Technology Stack Justification)

## 1. Frontend: HTML / CSS / JavaScript (Vanilla)
* **เทคโนโลยีที่เลือก:** HTML5, CSS3, และ JavaScript (ES6+) แบบไม่ใช้ Framework
* **เหตุผล:**
    * **ความเรียบง่าย (Simplicity):** เหมาะสำหรับโปรเจกต์ที่เน้นการเรียนรู้ Logic พื้นฐานและการจัดการ DOM โดยไม่ต้องเสียเวลาตั้งค่า Environment ที่ซับซ้อน
    * **ประสิทธิภาพ (Performance):** เว็บโหลดเร็วเพราะไม่มี Overhead จาก Library ขนาดใหญ่
    * **ความยืดหยุ่น:** สามารถควบคุมโครงสร้างหน้าเว็บได้อิสระ ตรงตาม Design ที่ออกแบบไว้ใน Figma

## 2. Backend & Database: Google Firebase
* **เทคโนโลยีที่เลือก:** Firebase Authentication และ Cloud Firestore
* **เหตุผล:**
    * **Serverless Architecture:** ไม่ต้องเสียเวลาตั้งค่า Server เอง ทำให้โฟกัสที่การพัฒนาฟังก์ชันได้เต็มที่
    * **Authentication:** ระบบจัดการผู้ใช้ (Google Sign-In) มีความปลอดภัยสูงและติดตั้งง่ายกว่าการทำระบบ Login เอง
    * **Real-time Database:** Cloud Firestore ช่วยให้การบันทึกและเรียกดูข้อมูลประวัติย้อนหลังทำได้รวดเร็ว และรองรับโครงสร้างข้อมูลแบบ NoSQL ที่ยืดหยุ่น

## 3. Design & Prototyping: Figma
* **เทคโนโลยีที่เลือก:** Figma
* **เหตุผล:**
    * เป็นเครื่องมือมาตรฐานอุตสาหกรรม (Industry Standard)
    * ช่วยให้เห็นภาพหน้าจอ (UI) และการไหลของโปรแกรม (User Flow) ชัดเจนก่อนลงมือเขียนโค้ด ลดโอกาสการแก้โค้ดซ้ำซ้อน
