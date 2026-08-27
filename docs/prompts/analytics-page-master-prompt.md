# 🎯 Master Prompt — ยกระดับหน้า "สถิติและผลกระทบของคลังโครงงาน" (ProjectAnalytics)

> เอกสารนี้คือ prompt แม่แบบสำหรับส่งงานให้ AI agent (Cline / Codex / Copilot) ทำทีละ Task
> ทุกครั้งที่มอบงาน ให้แนบ **Section 0 (GLOBAL CONTEXT)** + **Task ที่ต้องการ** + **Section 2 (DoD)**
> อัปเดตช่อง Status ของแต่ละ Task เมื่อทำเสร็จ

---

## 0) GLOBAL CONTEXT — แนบให้ agent ทุกครั้ง

```
PROJECT: "Project DNA" — Next.js 16 App Router + TypeScript + Tailwind v4 + Supabase
         คลังโครงงานนิสิต มก.ฉกส. (UI ภาษาไทยทั้งหมด, theme amber/slate,
         cards = bg-white rounded-2xl border-slate-200 shadow-soft)

FILES หลักของงานนี้:
- src/components/analytics/ProjectAnalytics.tsx   ← component หน้าสถิติ (props: projects, faculties, challenges)
- src/app/page.tsx                                ← mount ผ่าน Sidebar tab 'analytics' (max-w-7xl wrapper + h2 heading อยู่ที่นี่)
- src/types/dna.ts                                ← ชนิดข้อมูล
- src/lib/dnaService.ts                           ← data layer (seed fallback เมื่อ Supabase unreachable)
- tests/regressions.test.ts                       ← regression suite (node test runner + tsx)

DATA SHAPE ที่เกี่ยวข้อง (จาก dna.ts):
- Project: id, title_th, academic_year:number, status, department?:{faculty_id,name_th,code},
           view_count:number, fork_count:number, assets?:ReusableAsset[],
           parent_lineages?:ProjectLineageEdge[], child_lineages?:ProjectLineageEdge[]
- ReusableAsset: title, asset_type('code_repo'|'dataset'|'cad_blueprint'|'circuit_schematic'
                 |'api'|'trained_model'|'document'), download_count:number, resource_url
- Challenge: status:'open'|'matched'|'in_progress'|'resolved', matched_project_ids?:string[]
- ⚠️ page.tsx enrich parent_lineages/child_lineages ให้ project แล้วหลัง fetch (commit d204ca1)

CONVENTIONS:
- Shell command prefix `rtk` ทุกครั้ง (ดู RTK.md) เช่น `rtk npm test`
- Conventional Commits ภาษาอังกฤษ เช่น `fix(analytics): ...`
- ห้ามแตะ schema/schema.sql ยกเว้น Task ระบุชัด — ใช้ field ที่มีอยู่เท่านั้น
- ภาษาไทยเป็นภาษา UI; ห้าม hardcoded ตัวเลขที่ derive ได้จาก data
```

---

## 1) TASKS

### ✅ T1 — Merge lineage edges เข้า projects ตอนโหลด [Status: DONE · commit `d204ca1]
Supabase select ไม่ embed lineage relations → ทุก feature ที่อ่าน `p.parent_lineages/child_lineages`
เจอ 0 เสมอ ให้ map/filter จาก `getLineages()` หลัง Promise.all ใน `loadInitialData()`
**Accept:** filter "มีสายต่อยอด" + badge DnaCard + กราฟต่อยอดใน analytics ไม่เป็น 0 บน DB จริง

### ✅ T2 — แสดง totalReusableAssets [Status: DONE · commit `b8e5b0d]
ตัวแปรคำนวณแล้วแต่ไม่เคย render → โชว์ใน caption การ์ด Reuse ("ดาวน์โหลดจาก N ทรัพยากร")

### ✅ T3 — Metric "โจทย์" ต้องนับที่จับคู่จริง [Status: DONE · commit `b8e5b0d]
นับเฉพาะ `status !== 'open'` หรือ `matched_project_ids.length > 0`
caption ระบุ "จากทั้งหมด N โจทย์"

### ✅ T4 — Faculty bar ต้อง honest กับศูนย์ [Status: DONE · commit `b8e5b0d]
0% = track เปล่า / ค่า >0 ต่ำใช้ min 3% / เพิ่ม role="meter" + aria-valuenow/label

### ✅ T5 — เลิก hardcode "4 คณะ" [Status: DONE · commit `b8e5b0d]
ใช้ `faculties.length` ทุกจุด (caption การ์ด 1 + header section)

### ✅ T6 — Wordring การ์ด 3 [Status: DONE · commit `b8e5b0d]
"ดาวน์โหลดทรัพยากรซ้ำ" → "การใช้ทรัพยากรซ้ำ (Reuse)"

### ✅ T7 — Heading เดียว [Status: DONE · commit `b8e5b0d]
ลบ dark hero ใน component — tab header ใน page.tsx เป็น heading เดียว (สไตล์เดียวกับ Lineage tab)

### ✅ T8 — Empty state [Status: DONE · commit `b8e5b0d]
projects.length === 0 → card แนะนำภาษาไทย แทนกำแพงเลข 0

### ✅ T9 — Insight panels ใช้ field ที่มีอยู่ (view/fork/year/assets) [Status: DONE · commit `c05a019`]
เพิ่มแถว "Insight Panels" ระหว่าง bento grid กับ faculty distribution, `grid lg:grid-cols-3 gap-5`:
1) **แนวโน้มรายปี**: bucket ด้วย `academic_year`, vertical bars สูงตามสัดส่วน max, ปี ASC
2) **โครงงานได้รับความสนใจสูงสุด**: top 3 ตาม `view_count`, badge `fork_count`
3) **ทรัพยากรยอดนิยม**: top 3 `assets` ตาม `download_count` + label ประเภท asset
Spec เพิ่มเติม: ทุก panel ต้องมี fallback ข้อความเมื่อข้อมูลว่าง · เลข `.toLocaleString()` ·
คลิกโครงงานเปิด drawer ผ่าน prop ใหม่ `onViewProject?: (p: Project) => void`
(page.tsx ส่ง `(p) => setSelectedProject(p)`) · ห้าม query เพิ่ม — compute จาก props เท่านั้น
**Accept:** `rtk npx tsc --noEmit` ผ่าน · `rtk npm test` 3/3 · seed mode เห็น 3 panel, DB ว่างเห็น fallback

### ✅ T10 — A11y ของกราฟ [Status: DONE · commit `b8e5b0d] (รวมใน T4)

---

## 2) DEFINITION OF DONE — เช็คทุกครั้งก่อนจบ Task

```
rtk npx tsc --noEmit        # 0 errors
rtk npm test                # 3/3 pass
rtk graphify update .       # graph current
git status                  # clean หลัง commit
```
- Manual smoke: `rtk npm run dev` → tab Analytics → ตัวเลขสอดคล้อง seed data
- ไม่มี console error/warning ใหม่
- ไม่มี hardcoded ค่าที่ derive จาก data ได้

## 3) COMMIT FORMAT

```
feat(analytics): <summary>      # feature ใหม่
fix(analytics): <summary>       # แก้ behavior ผิด
refactor(analytics): <summary>  # ไม่เปลี่ยน behavior
chore(docs): <summary>          # เอกสาร master prompt นี้
```
Body bullet สั้น ๆ อธิบาย *ทำไม* ไม่ใช่แค่ *ทำอะไร* · 1 Task : 1 commit ·
ห้าม mix งาน uncommitted ของ session อื่นเข้า commit
