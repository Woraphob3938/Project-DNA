# 🧬 Project DNA: แพลตฟอร์มอัจฉริยะเพื่อค้นหา เชื่อมโยง และต่อยอดโครงงานนิสิต
### DNA: An Intelligent Platform for Discovering, Connecting, and Extending Student Projects
> **มหาวิทยาลัยเกษตรศาสตร์ วิทยาเขตเฉลิมพระเกียรติ จังหวัดสกลนคร (KU CSC)**

---

## 🌟 ที่มาและความสำคัญ (Problem & Vision)
ในแต่ละปีนิสิตทุกคณะในมหาวิทยาลัยเกษตรศาสตร์ วิทยาเขตเฉลิมพระเกียรติ จังหวัดสกลนคร (มก.ฉกส.) ได้สร้างโครงงานที่มีองค์ความรู้ เทคโนโลยี ชุดข้อมูล และซอร์สโค้ดจำนวนมาก แต่เมื่อสำเร็จการศึกษา ผลงานกลับกระจัดกระจาย ค้นหาได้ยาก และขาดข้อมูลสำหรับการนำไปใช้ต่อ ทำให้นิสิตรุ่นใหม่อาจต้องเริ่มทำหัวข้อเดิมซ้ำจากศูนย์

**Project DNA** ถูกพัฒนาขึ้นเพื่อเป็นแพลตฟอร์มรวบรวม สืบค้น เชื่อมโยงสายวิวัฒนาการ (Lineage) และต่อยอดโครงงานของรุ่นพี่อย่างเป็นระบบ โดยใช้ **AI (Google Gemini / Supabase pgvector)** วิเคราะห์ช่องว่างการพัฒนา (Gap Analysis) และจับคู่เข้ากับ **โจทย์จริงของชุมชน มหาวิทยาลัย และภาคอุตสาหกรรม** ครอบคลุมทั้ง **4 คณะในวิทยาเขต**:
1. **คณะวิทยาศาสตร์และวิศวกรรมศาสตร์ (KUSE)** (CPE, CS, IT, ME, EE, CE, IE, AC)
2. **คณะศิลปศาสตร์และวิทยาการจัดการ (FAM)** (MGT, MKT, FIN, ACC, HTM, EBC, PA)
3. **คณะทรัพยากรธรรมชาติและอุตสาหกรรมเกษตร (FNRA)** (AS, PS, FISH, FST, ARM)
4. **คณะสาธารณสุขศาสตร์ (FPH)** (PH, EH, OHS)

---

## 🚀 ฟีเจอร์หลัก (Key Features)

1. **🎨 Interactive Dashboard & Catalog View (ตามแบบ Wireframe)**
   - แถบเมนูด้านซ้ายสีเหลืองโมเดิร์น (Sticky Locked Sidebar)
   - แถบค้นหาภาษาธรรมชาติ (Natural Language Search)
   - ตัวกรองตามคณะทั้ง 4 คณะ และสาขาวิชาทั้งหมดใน มก.ฉกส.
   - แสดง **DNA Cards** สรุปปัญหา เทคโนโลยี ทรัพยากรที่นำมาใช้ซ้ำได้ (Code, Dataset, Hardware Blueprint, AI Weights)

2. **📋 แผงข้อมูลเชิงลึก DNA Card & Quick Resource Modal**
   - แสดงรายละเอียดพิมพ์เขียวของโครงงาน ผลสัมฤทธิ์ และข้อจำกัด
   - ปุ่มดาวน์โหลดทรัพยากร (Dataset, PCB Gerber, Trained Model Weights)
   - คำสั่ง `git clone` พร้อมฟังก์ชันคัดลอกทันที
   - ช่องทางติดต่อรุ่นพี่เจ้าของโครงงานและอาจารย์ที่ปรึกษา พร้อมรูปแบบการอ้างอิงเอกสาร (APA Citation)

3. **🌿 Project Lineage Visualizer (สายวิวัฒนาการโครงงาน)**
   - แผนภาพแสดงสายการต่อยอดจากรุ่นพี่สู่รุ่นน้องแบบ Interactive (Gen 1 ➡️ Gen 2 ➡️ Gen 3)
   - ช่วยให้อาจารย์ที่ปรึกษาและนิสิตตรวจพบความคล้ายคลึงและต่อยอดงานเดิมได้ทันที

4. **🚀 Project Inception Studio (วิซาร์ดสร้างโครงการต่อยอด)**
   - ดึงพิมพ์เขียวจากโครงงานรุ่นพี่มาเป็น Baseline อัตโนมัติ (ไม่ต้องเริ่มจาก 0)
   - ให้เลือกช่องว่างการพัฒนาที่ AI แนะนำ (AI Extension Gaps)
   - จับคู่กับโจทย์จริง (Community / University / Industry Challenges)
   - สร้างร่าง DNA Card ฉบับใหม่ของทีมพร้อม Roadmap

5. **🎯 Real-World Challenges Matching Hub**
   - รวบรวมโจทย์จริงจากพื้นที่ จ.สกลนคร, Smart Green Campus มก.ฉกส., และคลัสเตอร์อุตสาหกรรม
   - จับคู่โจทย์กับโครงงานนิสิตที่มีเทคโนโลยีพร้อมใช้งาน

6. **🤖 AI Ingestion Engine (สกัด DNA Card อัตโนมัติ)**
   - วางข้อความบทคัดย่อ/โครงงาน แล้วให้ AI (Google Gemini) สกัดเป็น DNA Card พร้อมระบุสาขาวิชาและช่องว่างต่อยอดในคลิกเดียว

7. **📊 Project & Knowledge Reuse Analytics**
   - รายงานสถิติการหมุนเวียนโค้ด/ชุดข้อมูล เวลาที่ประหยัดได้ และสัดส่วนผลงานแยกตามคณะและสาขาวิชา

---

## 🛠️ สถาปัตยกรรมและเทคโนโลยี (Tech Stack)

- **Frontend & Fullstack**: Next.js 15 (App Router), React 19, TypeScript 5.8+, Tailwind CSS, Lucide Icons
- **Database & Backend**: Supabase (PostgreSQL with relational schema for Faculties, Departments, Projects, DNA Cards, Lineages, Reusable Assets, Challenges)
- **AI Engine**: Google Gemini API (`gemini-1.5-flash` / `gemini-2.0-flash`) พร้อม Fallback Smart Extractor

---

## 💻 วิธีการติดตั้งและรันในเครื่อง (Getting Started)

### 1. ติดตั้ง Dependencies
```bash
npm install
```

### 2. กำหนด Environment Variables
```bash
cp .env.example .env.local
```

### 3. เริ่มต้นรันเซิร์ฟเวอร์
```bash
npm run dev
```
เปิดเบราว์เซอร์ที่ [http://localhost:3000](http://localhost:3000)
