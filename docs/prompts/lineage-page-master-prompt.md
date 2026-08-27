# 🎯 Master Prompt — ปฏิรูปหน้า "สายการต่อยอด" (LineageVisualizer)

> ใช้ร่วมกับ Section 0 (GLOBAL CONTEXT) ของ `analytics-page-master-prompt.md`
> เพิ่มเติมเฉพาะงานนี้: `ProjectLineageEdge = { id, parent_project_id, child_project_id,
> extension_type, evolution_summary }` · seed edges: proj-1→2→6, proj-3→4
> Component: `src/components/lineage/LineageVisualizer.tsx` (props signature ห้ามเปลี่ยน:
> projects, lineages, onSelectProject, onOpenInceptionStudio)

---

## TASKS

### ✅ L1 — Kill hardcoded IDs, derive families จาก edges [DONE · 827-line rewrite]
Connected-components + longest-path depth + mainChain walk — ตรวจแล้ว `proj-` count = 0

### ✅ L2 — field จริงทุก chip [DONE] GEN badge = depth+academic_year, dept, heritage =
`evolution_summary`+`extension_type` label map, status map ไทยครบ 5 states

### ✅ L3 — Diff Matrix dynamic [DONE]
pills สลับ N สาย · 9 rows: dept·ปี·status·rating_score·view/fork·assets·
tech_stack(3)·สิ่งที่รับจากรุ่นก่อน (edge) · Novelty fake ถูกลบ · chain<2 → hint

### 🎨 L4 — DNA Helix spine [DONE]
`DnaHelixSegment`: strands xA+xB≡72 mirror-proof → rungs breathe & narrow at crossover;
dash-flow reverse direction; zigzag md:[1fr_72px_1fr]

### 🎨 L5 — Tree SVG genealogy [DONE] DFS-preorder rows×depth cols, gradient amber↔sky,
motion-reduce:hidden on animated group; node = <button> keyboard-accessible

### 🎨 L6 — Empty/unlinked [DONE] Link2Off panel + info strip unlinked ≤4 titles clickable

### ⚙️ L7/L8/L9 [DONE] accents rotate 4 palettes · focus-visible rings · props unchanged
(page.tsx zero-diff)

## Verification (เสร็จสิ้น)
`tsc --noEmit`=0 · tests 3/3 · `Select-String "proj-"`=0 hits


### 🎨 L4 — DNA Double-Helix connector (Pipeline) ← พระเอกของงาน
เส้นกระดูกสันหลังแนวตั้งระหว่าง generation cards: SVG 2 strands = mirrored cubic
beziers ไขว้กลาง + base-pair rungs คำนวณจาก bezier(t) จริง ·
`.dna-strand` dash-flow animation (globals.css) + reduced-motion guard ·
การ์ดสลับซ้าย/ขวา (zigzag) บน md+

### 🎨 L5 — Tree view ด้วย SVG genealogy จริง
Layout คำนวณเอง (DFS preorder rows × depth columns, ไม่ต้อง measure DOM) →
underlay `<svg>` cubic-bezier connectors + gradient amber↔sky + endpoint dots +
dash flow · โหนดเป็น `<button>` ครบ keyboard access · overflow-x-auto

### 🎨 L6 — Empty/unlinked states
`lineages` ว่าง → panel อธิบาย + ไอคอน · โครงงานไม่มีสาย → info strip
"N โครงงานรอเชื่อมสาย" + คลิกชื่อเปิด drawer ได้

### ⚙️ L7 — Family pills/headers generate จาก N ตระกูล + alternating accent colors

### ⚙️ L8 — Motion/a11y
prefers-reduced-motion ปิดทุก animation · svg ตกแต่ง `aria-hidden` ·
ปุ่มทุกตัว focus-visible ring

### ⚙️ L9 — คง public API เดิม หน้า page.tsx ไม่ต้องแก้

## DoD
`tsc --noEmit` clean · `npm test` 3/3 · smoke 2 สายบน seed · ไม่มี console warning ·
commit `feat(lineage): ...` / docs `chore(docs): ...`
