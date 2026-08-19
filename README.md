# 🧬 Project DNA: แพลตฟอร์มอัจฉริยะเพื่อค้นหา เชื่อมโยง และต่อยอดโครงงานนิสิต
### DNA: An Intelligent Platform for Discovering, Connecting, and Extending Student Projects
> **SDGs-KUSE NONTRI E-SAN HACKATHON 2026**  
> มหาวิทยาลัยเกษตรศาสตร์ วิทยาเขตเฉลิมพระเกียรติ จังหวัดสกลนคร  
> **ทีมผู้พัฒนา**: Ambatukam

---

## 🌟 ที่มาและความสำคัญ (Problem & Vision)
ในแต่ละปีนิสิตคณะวิทยาศาสตร์และวิศวกรรมศาสตร์ มก.ฉกส. ได้สร้างโครงงานที่มีองค์ความรู้ เทคโนโลยี ชุดข้อมูล และซอร์สโค้ดจำนวนมาก แต่เมื่อสำเร็จการศึกษา ผลงานกลับกระจัดกระจาย ค้นหาได้ยาก และขาดข้อมูลสำหรับการนำไปใช้ต่อ ทำให้นิสิตรุ่นใหม่อาจต้องเริ่มทำหัวข้อเดิมซ้ำจากศูนย์

**Project DNA** ถูกพัฒนาขึ้นเพื่อเป็นแพลตฟอร์มรวบรวม สืบค้น เชื่อมโยงสายวิวัฒนาการ (Lineage) และต่อยอดโครงงานของรุ่นพี่อย่างเป็นระบบ โดยใช้ **AI (Google Gemini / Supabase pgvector)** วิเคราะห์ช่องว่างการพัฒนา (Gap Analysis) และจับคู่เข้ากับ **โจทย์จริงของชุมชน มหาวิทยาลัย และภาคอุตสาหกรรม** เพื่อขับเคลื่อนเป้าหมายการพัฒนาที่ยั่งยืน (**SDGs 4, 9, 11, 12, 17**)

---

## 🚀 ฟีเจอร์หลัก (Key Features)

1. **🎨 Interactive Dashboard & Catalog View (ตามแบบ Wireframe)**
   - แถบเมนูด้านซ้ายสีเหลืองโมเดิร์น (Yellow Accent Sidebar)
   - แถบค้นหาภาษาธรรมชาติ (Natural Language Search)
   - ตัวกรองสาขาวิชา (CS, CPE, ME, EE, CE) และเป้าหมาย SDGs
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

5. **🎯 Real-World Challenges & SDG Hub**
   - รวบรวมโจทย์จริงจากพื้นที่ จ.สกลนคร, Smart Green Campus มก.ฉกส., และคลัสเตอร์อุตสาหกรรม
   - จับคู่โจทย์กับโครงงานนิสิตที่มีเทคโนโลยีพร้อมใช้งาน

6. **🤖 AI Ingestion Engine (สกัด DNA Card อัตโนมัติ)**
   - วางข้อความบทคัดย่อ/โครงงาน แล้วให้ AI (Google Gemini) สกัดเป็น DNA Card พร้อมระบุ SDGs และช่องว่างต่อยอดในคลิกเดียว

7. **📊 SDG Impact & Knowledge Reuse Analytics**
   - รายงานสถิติการหมุนเวียนโค้ด/ชุดข้อมูล เวลาที่ประหยัดได้ และการกระจายตัวของ SDGs

---

## 🛠️ สถาปัตยกรรมและเทคโนโลยี (Tech Stack)

- **Frontend & Fullstack**: Next.js 15 (App Router), React 19, TypeScript 5.8+, Tailwind CSS, Lucide Icons
- **Database & Backend**: Supabase (PostgreSQL with relational schema for Projects, DNA Cards, Lineages, Reusable Assets, Challenges & SDGs)
- **AI Engine**: Google Gemini API (`gemini-1.5-flash` / `gemini-2.0-flash`) พร้อม Fallback Smart Extractor
- **Architecture Decisions**: บันทึกใน [docs/adr/](file:///d:/SDG%20project/Project%20DNA/docs/adr/) และนิยามคำศัพท์ใน [`CONTEXT.md`](file:///d:/SDG%20project/Project%20DNA/CONTEXT.md)

---

## 💻 วิธีการติดตั้งและรันในเครื่อง (Getting Started)

### 1. ติดตั้ง Dependencies
```bash
npm install
```

### 2. กำหนด Environment Variables
คัดลอกไฟล์ `.env.example` เป็น `.env.local`:
```bash
cp .env.example .env.local
```
*(ระบบถูกออกแบบให้มี Offline-First Mock Data & Smart Fallback ทำให้สามารถรันเดโมได้ทันทีแม้ยังไม่ได้ใส่ Key)*

### 3. เริ่มต้นรันเซิร์ฟเวอร์
```bash
npm run dev
```
เปิดเบราว์เซอร์ที่ [http://localhost:3000](http://localhost:3000)

---

## 🗄️ การติดตั้งฐานข้อมูล Supabase (Database Setup)

1. เข้าไปที่ [Supabase Dashboard](https://supabase.com) และสร้างโปรเจกต์ใหม่
2. ไปที่เมนู **SQL Editor**
3. คัดลอกและรันสคริปต์ตามลำดับ:
   - [supabase/schema.sql](file:///d:/SDG%20project/Project%20DNA/supabase/schema.sql) *(สร้างโครงสร้างตาราง)*
   - [supabase/seed.sql](file:///d:/SDG%20project/Project%20DNA/supabase/seed.sql) *(นำเข้าข้อมูลโครงงาน มก.ฉกส. และโจทย์จริง)*
4. นำ `Project URL` และ `anon key` จาก Supabase Project Settings ➡️ API มาใส่ในไฟล์ `.env.local`

---

## 👥 สมาชิกทีม Ambatukam
1. **นางสาวชัชนัน บุญเหลือง** (หัวหน้าทีม) - 6740205106 ชั้นปีที่ 3 วิศวกรรมเครื่องกลและการผลิต
2. **นายวรภพ ไชยวงศ์คต** - 6640203938 ชั้นปีที่ 4 วิทยาการคอมพิวเตอร์
3. **นายพัชรพล วงค์คำ** - 6840209388 ชั้นปีที่ 2 วิศวกรรมไฟฟ้า
4. **นายพิพัฒน์ โพธิ์ศรีสุข** - 6640207426 ชั้นปีที่ 4 วิศวกรรมคอมพิวเตอร์
