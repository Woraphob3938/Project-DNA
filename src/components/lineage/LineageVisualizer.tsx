'use client';

import React, { useMemo, useState } from 'react';
import {
  GitFork,
  ArrowUpRight,
  Plus,
  GitBranch,
  Split,
  Table,
  Eye,
  Sparkles,
  Dna,
  Link2Off
} from 'lucide-react';
import { Project, ProjectLineageEdge } from '@/types/dna';

interface LineageVisualizerProps {
  projects: Project[];
  lineages: ProjectLineageEdge[];
  onSelectProject: (project: Project) => void;
  onOpenInceptionStudio: (project: Project) => void;
}

type ViewMode = 'pipeline' | 'tree' | 'diff';

const EXTENSION_TYPE_LABEL: Record<ProjectLineageEdge['extension_type'], string> = {
  feature_enhancement: 'เสริมความสามารถ',
  hardware_upgrade: 'อัปเกรดฮาร์ดแวร์',
  algorithm_optimization: 'ปรับปรุงอัลกอริทึม',
  domain_adaptation: 'ประยุกต์ข้ามโดเมน'
};

/** Chip accent per extension type */
const EXTENSION_TYPE_STYLE: Record<ProjectLineageEdge['extension_type'], string> = {
  feature_enhancement: 'bg-amber-50 text-amber-900 border-amber-300',
  hardware_upgrade: 'bg-slate-100 text-slate-800 border-slate-300',
  algorithm_optimization: 'bg-sky-50 text-sky-900 border-sky-300',
  domain_adaptation: 'bg-emerald-50 text-emerald-900 border-emerald-300'
};

const STATUS_LABEL: Record<Project['status'], string> = {
  completed: 'สำเร็จ · เผยแพร่แล้ว',
  in_progress: 'กำลังพัฒนา',
  incubating: 'บ่มเพาะต่อยอด',
  pending_approval: 'รอการอนุมัติ',
  needs_revision: 'ต้องปรับปรุง'
};

/* Alternate accent per family index */
const FAMILY_ACCENTS = [
  { chip: 'bg-amber-100 text-amber-900', a: '#d97706', b: '#0284c7' },
  { chip: 'bg-sky-100 text-sky-900', a: '#0369a1', b: '#d97706' },
  { chip: 'bg-emerald-100 text-emerald-900', a: '#059669', b: '#6366f1' },
  { chip: 'bg-purple-100 text-purple-900', a: '#7c3aed', b: '#f59e0b' }
];

/**
 * One lineage family = one connected component of the project_lineages DAG.
 * levels[i] = projects exactly i extension-steps from a root (longest-path
 * depth so fan-in diamonds keep their true generation).
 */
interface FamilyGraph {
  index: number;
  roots: Project[];
  levels: Project[][];
  edges: ProjectLineageEdge[];
  members: Set<string>;
  /** deterministic spine for Diff columns & impact summary */
  mainChain: Project[];
}
const byYearThenTitle = (a: Project, b: Project) =>
  a.academic_year - b.academic_year || a.title_th.localeCompare(b.title_th, 'th');

function deriveFamilies(projects: Project[], lineages: ProjectLineageEdge[]): FamilyGraph[] {
  const projMap = new Map(projects.map(p => [p.id, p]));

  // Keep only edges whose both ends resolve to known projects.
  const edges = lineages.filter(
    e => projMap.has(e.parent_project_id) && projMap.has(e.child_project_id)
  );

  const childrenOf = new Map<string, string[]>();
  const parentsOf = new Map<string, string[]>();
  const push = (m: Map<string, string[]>, k: string, v: string) =>
    void m.set(k, [...(m.get(k) ?? []), v]);

  for (const e of edges) {
    push(childrenOf, e.parent_project_id, e.child_project_id);
    push(parentsOf, e.child_project_id, e.parent_project_id);
  }
  const nodeIds = new Set(edges.flatMap(e => [e.parent_project_id, e.child_project_id]));
  if (nodeIds.size === 0) return [];

  // ── Connected components (undirected walk) ─────────────────────────
  const undirected = new Map<string, string[]>();
  for (const e of edges) {
    push(undirected, e.parent_project_id, e.child_project_id);
    push(undirected, e.child_project_id, e.parent_project_id);
  }

  const seen = new Set<string>();
  const components: string[][] = [];
  for (const startId of nodeIds) {
    if (seen.has(startId)) continue;
    const comp: string[] = [];
    const queue = [startId];
    seen.add(startId);
    while (queue.length) {
      const cur = queue.shift()!;
      comp.push(cur);
      for (const nb of undirected.get(cur) ?? []) {
        if (!seen.has(nb)) { seen.add(nb); queue.push(nb); }
      }
    }
    components.push(comp);
  }

  return components.map((compIds, index) => {
    const memberSet = new Set(compIds);

    // Root = component node without an in-component parent.
    const rootIds = compIds.filter(
      id => !(parentsOf.get(id) ?? []).some(p => memberSet.has(p))
    );
    const roots = (rootIds.length ? rootIds : [compIds[0]])
      .map(id => projMap.get(id)!)
      .sort(byYearThenTitle);

    // Longest-path depth inside the component.
    const depth = new Map<string, number>();
    const depthOf = (id: string): number => {
      const cached = depth.get(id);
      if (cached !== undefined) return cached;
      depth.set(id, 0); // cycle guard for dirty data
      const ps = (parentsOf.get(id) ?? []).filter(p => memberSet.has(p));
      const d = ps.length === 0 ? 0 : Math.max(...ps.map(depthOf)) + 1;
      depth.set(id, d);
      return d;
    };
    compIds.forEach(depthOf);

    const levelMap = new Map<number, Project[]>();
    for (const id of compIds) {
      const p = projMap.get(id)!;
      const d = depth.get(id) ?? 0;
      levelMap.set(d, [...(levelMap.get(d) ?? []), p]);
    }
    const levels = [...levelMap.entries()]
      .sort((x, y) => x[0] - y[0])
      .map(([, arr]) => arr.sort(byYearThenTitle));

    // Main chain: from the earliest root, always step to the first
    // connected child on each following level.
    const chainFrom = (root: Project): Project[] => {
      const chain = [root];
      let cur = root;
      for (let lvl = depth.get(root.id)! + 1; lvl < levels.length; lvl++) {
        const childIds = childrenOf.get(cur.id) ?? [];
        const next = levels[lvl].find(p => childIds.includes(p.id));
        if (!next) break;
        cur = next;
        chain.push(cur);
      }
      return chain;
    };

    return {
      index,
      roots,
      levels,
      edges: edges.filter(e => memberSet.has(e.parent_project_id)),
      members: memberSet,
      mainChain: chainFrom(roots[0])
    };
  });
}
/* ════════════════════════════════════════════════════════════════════
 * DNA double-helix connector.
 *
 * Geometry (viewBox 0 0 72 132, centre x = 36):
 *   strand A : M 36,0  C 84,33   -12,99   36,132
 *   strand B : M 36,0  C -12,33   84,99   36,132      (exact x-mirror)
 * For this mirror pairing xA(u) + xB(u) ≡ 72, so base-pair rungs drawn
 * between A(u)→B(u) are always centred and breathe in/out along the twist,
 * narrowing to a point where the strands cross at u = .5. The running dash
 * animates opposite directions on each strand (see globals.css).
 * ════════════════════════════════════════════════════════════════════ */

const HELIX_RUNG_US = [0.12, 0.26, 0.4, 0.6, 0.74, 0.88];

const helixPoint = (u: number, mirror: boolean) => {
  const v = 1 - u;
  // Cubic-bézier blends over control points [36, ±48 relative, 36].
  const w = 48;
  const x = 36 * v * v * v + (mirror ? -w : w) * 3 * v * v * u + (mirror ? w : -w) * 3 * v * u * u + 36 * u * u * u;
  const y = 0 * v * v * v + 33 * 3 * v * v * u + 99 * 3 * v * u * u + 132 * u * u * u;
  return { x, y };
};

const DnaHelixSegment: React.FC<{ uid: string; colorA: string; colorB: string }> = ({
  uid,
  colorA,
  colorB
}) => (
  <div aria-hidden="true" className="relative z-[1] flex justify-center">
    <svg
      width="72"
      height="132"
      viewBox="0 0 72 132"
      fill="none"
      className="drop-shadow-[0_2px_8px_rgba(15,23,42,0.12)]"
    >
      <defs>
        <linearGradient id={`dna-ga-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={colorA} stopOpacity="0.35" />
          <stop offset="50%" stopColor={colorA} />
          <stop offset="100%" stopColor={colorA} stopOpacity="0.35" />
        </linearGradient>
        <linearGradient id={`dna-gb-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={colorB} stopOpacity="0.35" />
          <stop offset="50%" stopColor={colorB} />
          <stop offset="100%" stopColor={colorB} stopOpacity="0.35" />
        </linearGradient>
      </defs>

      {/* base pairs */}
      {HELIX_RUNG_US.map((u, i) => {
        const l = helixPoint(u, false);
        const r = helixPoint(u, true);
        return (
          <line
            key={i}
            x1={l.x} y1={l.y} x2={r.x} y2={r.y}
            stroke={i % 2 === 0 ? colorA : colorB}
            strokeWidth="1.75"
            strokeLinecap="round"
            opacity="0.55"
            className="dna-rung"
            style={{ animationDelay: `${i * 0.22}s` }}
          />
        );
      })}

      {/* backbone strands — flowing dashes, mirrored directions */}
      <path
        d="M 36 0 C 84 33, -12 99, 36 132"
        stroke={`url(#dna-ga-${uid})`}
        strokeWidth="2.5"
        strokeLinecap="round"
        className="dna-strand"
      />
      <path
        d="M 36 0 C -12 33, 84 99, 36 132"
        stroke={`url(#dna-gb-${uid})`}
        strokeWidth="2.5"
        strokeLinecap="round"
        className="dna-strand dna-strand--rev"
      />

      {/* crossover highlights */}
      {[0, 66, 132].map((cy, i) => (
        <circle key={i} cx="36" cy={cy} r="2.5" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1" />
      ))}
    </svg>
  </div>
);
/* ── Shared atoms ──────────────────────────────────────────────────── */

const GenBadge: React.FC<{ level: number; year: number }> = ({ level, year }) => (
  <span className="px-2.5 py-0.5 bg-slate-900 text-amber-300 font-mono text-xs font-bold rounded-md shadow-xs">
    GEN {level + 1} · {year}
  </span>
);

/** Evolution note rendered from the incoming edge — real data, never literals. */
const HeritageChip: React.FC<{ edge?: ProjectLineageEdge; isRoot: boolean; assetCount: number }> = ({
  edge,
  isRoot,
  assetCount
}) => {
  if (!edge) {
    return (
      <div className="p-2 bg-white rounded-lg border border-slate-200 text-[11px] text-slate-700 font-medium flex items-center space-x-1.5">
        <Dna className="w-3.5 h-3.5 shrink-0 text-slate-500" />
        <span className="truncate">
          จุดเริ่มต้นสาย · เปิดคลัง <strong>{assetCount}</strong> ทรัพยากร
        </span>
      </div>
    );
  }
  return (
    <div className={`p-2 rounded-lg border text-[11px] font-medium flex items-start space-x-1.5 ${EXTENSION_TYPE_STYLE[edge.extension_type]}`}>
      <Sparkles className="w-3.5 h-3.5 shrink-0 mt-0.5" />
      <span className="min-w-0">
        <span className="block font-bold mb-0.5">{EXTENSION_TYPE_LABEL[edge.extension_type]}</span>
        <span className="line-clamp-2 leading-snug opacity-90">{edge.evolution_summary}</span>
      </span>
    </div>
  );
};

interface GenCardProps {
  project: Project;
  level: number;
  edgeFromParent?: ProjectLineageEdge;
  onOpen: () => void;
  onExtend: () => void;
}

const GenCard: React.FC<GenCardProps> = ({ project, level, edgeFromParent, onOpen, onExtend }) => (
  <div className="bg-white p-5 rounded-xl border border-slate-200 card-elevation flex flex-col justify-between space-y-4 h-full">
    <div className="space-y-1.5">
      <div className="flex items-center justify-between gap-2 mb-1 flex-wrap">
        <GenBadge level={level} year={project.academic_year} />
        <span className="text-[11px] font-semibold text-slate-600 truncate">
          {project.department?.name_th ?? project.department?.code ?? 'ไม่ระบุภาควิชา'}
        </span>
      </div>

      <button
        onClick={onOpen}
        className="block text-left font-display font-bold text-slate-900 text-sm leading-snug hover:text-amber-800 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-500 rounded-sm"
      >
        {project.title_th}
      </button>

      {(project.dna_card?.problem_statement || project.abstract_th) && (
        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed border-l-2 border-slate-300 pl-2.5">
          {project.dna_card?.problem_statement ?? project.abstract_th}
        </p>
      )}
    </div>

    <div className="space-y-3">
      <HeritageChip
        edge={edgeFromParent}
        isRoot={!edgeFromParent}
        assetCount={project.assets?.length ?? 0}
      />

      <div className="pt-2 border-t border-slate-200 flex items-center justify-between gap-2 text-xs flex-wrap">
        <span className="inline-flex items-center space-x-1 font-semibold text-slate-500">
          <Eye className="w-3.5 h-3.5" />
          <span>{STATUS_LABEL[project.status]}</span>
        </span>
        <span className="flex items-center gap-3">
          <button
            onClick={onExtend}
            className="font-bold text-emerald-700 hover:text-emerald-900 inline-flex items-center space-x-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-500 rounded-sm"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
            <span>ต่อยอด</span>
          </button>
          <button
            onClick={onOpen}
            className="font-bold text-slate-900 hover:text-amber-700 inline-flex items-center space-x-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-500 rounded-sm"
          >
            <span>ดู DNA</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </span>
      </div>
    </div>
  </div>
);
/* ════════════════════════════════════════════════════════════════════
 * LineageVisualizer — fully data-driven.
 * Families are derived from `lineages` at runtime; no project id is ever
 * hardcoded. Renders three views over the same derived graph:
 *   pipeline · DNA-helix spine timeline
 *   tree     · SVG genealogy with bézier connectors
 *   diff     · generation matrix from real fields
 * ════════════════════════════════════════════════════════════════════ */

export const LineageVisualizer: React.FC<LineageVisualizerProps> = ({
  projects,
  lineages,
  onSelectProject,
  onOpenInceptionStudio
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>('pipeline');
  const [diffFamilyIdx, setDiffFamilyIdx] = useState(0);

  const families = useMemo(() => deriveFamilies(projects, lineages), [projects, lineages]);

  /** Incoming edge per child id (first wins) for heritage chips. */
  const parentEdgeOf = useMemo(() => {
    const m = new Map<string, ProjectLineageEdge>();
    for (const f of families) {
      for (const e of f.edges) {
        if (!m.has(e.child_project_id)) m.set(e.child_project_id, e);
      }
    }
    return m;
  }, [families]);

  /** Projects not attached to any lineage — surfaced so nothing silently disappears. */
  const unlinked = useMemo(() => {
    const linkedIds = new Set(families.flatMap(f => [...f.members]));
    return projects.filter(p => !linkedIds.has(p.id));
  }, [projects, families]);

  return (
    <div className="max-w-7xl mx-auto space-y-8">

      {/* ── Header Banner ─────────────────────────────────────────── */}
      <div className="bg-slate-900 text-white p-6 md:p-8 rounded-2xl border border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="max-w-3xl space-y-2">
          <div className="flex items-center space-x-2 text-amber-400 font-mono text-xs font-bold uppercase tracking-wider">
            <Dna className="w-4 h-4" />
            <span>PROJECT DNA LINEAGE &amp; EVOLUTION ENGINE</span>
          </div>
          <h2 className="font-display text-2xl md:text-3xl font-bold tracking-tight text-white">
            สายวิวัฒนาการและการต่อยอดโครงงานนิสิต
          </h2>
          <p className="text-xs md:text-sm text-slate-300 leading-relaxed font-sans">
            เส้นดีเอ็นเอแห่งนวัตกรรม — การส่งต่อพิมพ์เขียว โค้ด โมเดล AI และฮาร์ดแวร์ข้ามรุ่น
            ป้องกันวิจัยซ้ำซ้อน พร้อมประเมินความแปลกใหม่ได้อย่างโปร่งใส
          </p>
        </div>

        {/* View Mode Switcher */}
        <div className="flex p-1 bg-slate-800/90 rounded-xl border border-slate-700/80 text-xs font-semibold shrink-0 self-start md:self-auto" role="tablist" aria-label="โหมดการแสดงผล">
          {([
            ['pipeline', GitFork, 'ลำดับขั้น (Pipeline)'],
            ['tree', Split, 'ผังโครงข่าย (Tree)'],
            ['diff', Table, 'เปรียบเทียบ (Diff)']
          ] as const).map(([mode, Icon, label]) => (
            <button
              key={mode}
              role="tab"
              aria-selected={viewMode === mode}
              onClick={() => setViewMode(mode)}
              className={`px-3 py-2 rounded-lg flex items-center space-x-1.5 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-400 ${
                viewMode === mode
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Empty state: no lineages at all ──────────────────────────── */}
      {families.length === 0 && (
        <div className="bg-white p-10 rounded-2xl border border-dashed border-slate-300 text-center space-y-3">
          <Link2Off className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="font-display font-bold text-slate-800">ยังไม่มีสายการต่อยอดในระบบ</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
            เมื่อโครงงานถูก "ต่อยอด" จะเกิดเส้นเชื่อม DNA จากรุ่นพี่สู่รุ่นน้อง
            แผนภูมิวิวัฒนาการจะปรากฏขึ้นที่นี่โดยอัตโนมัติ
          </p>
        </div>
      )}

      {/* ── Unlinked notice (non-blocking info strip) ───────────────── */}
      {families.length > 0 && unlinked.length > 0 && (
        <div className="bg-amber-50/70 border border-amber-200 rounded-xl px-4 py-3 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-amber-900">
          <Link2Off className="w-4 h-4 shrink-0" />
          <span><strong>{unlinked.length}</strong> โครงงานรอเชื่อมสาย:</span>
          {unlinked.slice(0, 4).map(p => (
            <button
              key={p.id}
              onClick={() => onSelectProject(p)}
              className="font-semibold underline decoration-amber-300 underline-offset-2 hover:text-amber-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-500 rounded-sm"
            >
              {p.title_th}
            </button>
          ))}
          {unlinked.length > 4 && <span>+{unlinked.length - 4} รายการ</span>}
        </div>
      )}

      {/* ═══ VIEW 1 · PIPELINE with DNA helix spine ═══ */}
      {viewMode === 'pipeline' && (
        <div className="space-y-8">
          {families.map(family => {
            const acc = FAMILY_ACCENTS[family.index % FAMILY_ACCENTS.length];
            const root = family.mainChain[0];
            const chainAssets = family.mainChain.reduce((n, p) => n + (p.assets?.length ?? 0), 0);

            return (
              <section
                key={family.index}
                className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-soft space-y-6"
              >
                {/* Family header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-100 pb-4 gap-3">
                  <div className="min-w-0">
                    <div className={`inline-flex items-center space-x-1.5 px-2.5 py-0.5 text-xs font-bold rounded-md mb-1.5 ${acc.chip}`}>
                      <GitBranch className="w-3.5 h-3.5" />
                      <span>สายวิวัฒนาการที่ {family.index + 1}</span>
                    </div>
                    <h3 className="font-display text-lg font-bold text-slate-900 leading-snug">
                      {family.mainChain.length <= 3
                        ? family.mainChain.map(p => p.title_th).join('  ➡️  ')
                        : `${family.mainChain[0].title_th}  ➡️ … ➡️  ${family.mainChain[family.mainChain.length - 1].title_th}`}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => { setDiffFamilyIdx(family.index); setViewMode('diff'); }}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg transition-colors"
                    >
                      ดู Diff Matrix
                    </button>
                    <button
                      onClick={() => onOpenInceptionStudio(family.mainChain[family.mainChain.length - 1])}
                      className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold rounded-lg shadow-xs flex items-center space-x-1.5 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5 stroke-[3]" />
                      <span>ต่อยอด Gen {family.levels.length + 1}</span>
                    </button>
                  </div>
                </div>

                {/* Generations along the DNA spine */}
                <div>
                  {family.levels.map((levelProjects, lvl) => (
                    <React.Fragment key={lvl}>
                      <div className={`md:grid md:grid-cols-[1fr_72px_1fr] items-stretch`}>
                        <div className={lvl % 2 === 1 ? 'md:col-start-1 order-2 md:order-none' : 'md:col-start-3'}>
                          <div
                            className={
                              levelProjects.length > 1
                                ? 'grid sm:grid-cols-2 gap-4'
                                : ''
                            }
                          >
                            {levelProjects.map(p => (
                              <GenCard
                                key={p.id}
                                project={p}
                                level={lvl}
                                edgeFromParent={parentEdgeOf.get(p.id)}
                                onOpen={() => onSelectProject(p)}
                                onExtend={() => onOpenInceptionStudio(p)}
                              />
                            ))}
                          </div>
                        </div>
                        <div className="hidden md:block" /> {/* spacer cell */}
                      </div>

                      {/* Helix connector to the next generation */}
                      {lvl < family.levels.length - 1 && (
                        <DnaHelixSegment
                          uid={`p${family.index}-${lvl}`}
                          colorA={acc.a}
                          colorB={acc.b}
                        />
                      )}
                    </React.Fragment>
                  ))}
                </div>

                {/* Impact summary — computed, not written */}
                <div className="flex items-start space-x-2.5 bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-slate-700 leading-relaxed">
                  <Dna className="w-4 h-4 mt-0.5 shrink-0 text-slate-500" />
                  <p>
                    <strong className="text-slate-900">ผลกระทบสายต่อยอด:</strong>{' '}
                    ออกเดินทางจาก «{root?.title_th ?? 'ไม่มีข้อมูล'}» ({root?.academic_year ?? '—'})
                    ต่อยอดแล้ว <strong>{Math.max(0, family.members.size - 1)}</strong> โครงงานใน{' '}
                    <strong>{family.levels.length}</strong> รุ่น · ทรัพยากรบนสายหลักหมุนเวียนใช้ซ้ำ{' '}
                    <strong>{chainAssets}</strong> รายการ
                  </p>
                </div>
              </section>
            );
          })}
        </div>
      )}

      {/* ═══ VIEW 2 · TREE with bézier genealogy ═══ */}
      {viewMode === 'tree' && families.length > 0 && (
        <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-soft space-y-6">
          <div>
            <h3 className="font-display text-lg font-bold text-slate-900">
              ผังโครงข่ายสายสัมพันธ์ข้ามรุ่น (Evolution Tree)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              เส้น DNA เชื่อมจากรุ่นแม่สู่รุ่นต่อยอด · คลิกโหนดเพื่อเปิด DNA Card
            </p>
          </div>

          {families.map(family => {
            const acc = FAMILY_ACCENTS[family.index % FAMILY_ACCENTS.length];
            const pById = new Map(projects.map(p => [p.id, p]));

            /* Deterministic layout: DFS-preorder gives each node a row,
               depth gives a column → zero DOM measuring needed. */
            const ROW = 112;
            const COL = 304;
            const PADX = 20;
            const NODE_W = 240;
            const NODE_HALF_H = 44;

            const layout: { id: string; depth: number; row: number }[] = [];
            const placed = new Set<string>();
            let rowCursor = 0;

            const dfs = (id: string, depth: number) => {
              if (placed.has(id)) return;
              placed.add(id);
              layout.push({ id, depth, row: rowCursor++ });
              const kids = family.edges
                .filter(e => e.parent_project_id === id && family.members.has(e.child_project_id))
                .map(e => e.child_project_id)
                .sort((a, b) =>
                  (pById.get(a)?.academic_year ?? 0) - (pById.get(b)?.academic_year ?? 0)
                );
              kids.forEach(k => dfs(k, depth + 1));
            };
            family.roots.forEach(r => dfs(r.id, 0));

            const maxDepth = Math.max(...layout.map(n => n.depth), 0);
            const width = PADX * 2 + (maxDepth + 1) * COL;
            const height = Math.max(1, layout.length) * ROW;

            return (
              <div key={family.index} className="overflow-x-auto rounded-xl border border-slate-200 bg-slate-50/70">
                <div className="relative" style={{ width, height }}>
                  {/* connector layer */}
                  <svg aria-hidden="true" className="absolute inset-0 pointer-events-none" width={width} height={height}>
                    <defs>
                      <linearGradient id={`tree-grad-${family.index}`} x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor={acc.a} stopOpacity="0.9" />
                        <stop offset="100%" stopColor={acc.b} stopOpacity="0.9" />
                      </linearGradient>
                    </defs>

                    {family.edges.map(edge => {
                      const a = layout.find(n => n.id === edge.parent_project_id);
                      const b = layout.find(n => n.id === edge.child_project_id);
                      if (!a || !b) return null;
                      const x1 = PADX + a.depth * COL + NODE_W;
                      const y1 = a.row * ROW + NODE_HALF_H;
                      const x2 = PADX + b.depth * COL;
                      const y2 = b.row * ROW + NODE_HALF_H;
                      const bend = Math.max(42, Math.abs(y2 - y1));
                      return (
                        <g key={edge.id} className="motion-reduce:hidden">
                          <path
                            d={`M ${x1} ${y1} C ${x1 + bend} ${y1}, ${x2 - bend} ${y2}, ${x2} ${y2}`}
                            stroke={`url(#tree-grad-${family.index})`}
                            strokeWidth="2.5"
                            fill="none"
                            strokeLinecap="round"
                            className="dna-strand"
                          />
                          <circle cx={x2} cy={y2} r="4" fill="#fff" stroke={acc.a} strokeWidth="2" />
                        </g>
                      );
                    })}
                  </svg>

                  {/* node layer */}
                  {layout.map(n => {
                    const p = pById.get(n.id);
                    if (!p) return null;
                    return (
                      <button
                        key={n.id}
                        onClick={() => onSelectProject(p)}
                        style={{
                          left: PADX + n.depth * COL,
                          top: n.row * ROW + NODE_HALF_H - 40
                        }}
                        className="absolute w-[240px] text-left bg-white hover:bg-amber-50/60 rounded-xl border-2 border-slate-200 hover:border-amber-500 shadow-xs p-3 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-600"
                      >
                        <span className="text-[10px] font-mono font-bold text-slate-500 flex items-center justify-between">
                          <span>GEN {n.depth + 1}</span>
                          <span>{p.academic_year}</span>
                        </span>
                        <span className="block text-[11px] font-bold text-slate-900 mt-1 leading-snug line-clamp-2">
                          {p.title_th}
                        </span>
                        <span className="mt-1 inline-block px-1.5 py-px bg-slate-100 text-slate-600 rounded font-semibold text-[9px]">
                          {STATUS_LABEL[p.status]}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ═══ VIEW 3 · DIFF MATRIX ═══ */}
      {viewMode === 'diff' && families.length > 0 && (
        <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-soft space-y-5">
          {/* Family switcher pills */}
          <div className="flex items-center justify-between flex-wrap gap-3 border-b border-slate-100 pb-4">
            <h3 className="font-display text-lg font-bold text-slate-900">
              ตารางเปรียบเทียบพัฒนาการรายรุ่น (Diff Matrix)
            </h3>
            <div className="flex p-1 bg-slate-100 rounded-xl text-xs font-semibold">
              {families.map(f => (
                <button
                  key={f.index}
                  onClick={() => setDiffFamilyIdx(f.index)}
                  aria-pressed={diffFamilyIdx === f.index}
                  className={`px-3 py-1.5 rounded-lg transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-500 ${
                    diffFamilyIdx === f.index
                      ? 'bg-white shadow-xs font-bold text-slate-900 ring-1 ring-slate-200'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  สายที่ {f.index + 1}
                </button>
              ))}
            </div>
          </div>

          {(() => {
            const family = families[Math.min(diffFamilyIdx, families.length - 1)];
            const chain = family.mainChain;

            if (!family || chain.length < 2) {
              return (
                <p className="text-xs text-slate-500 bg-slate-50 border border-slate-200 rounded-xl p-4 leading-relaxed">
                  สายนี้มีเพียงรุ่นเดียว — ตาราง Diff จะเปิดใช้เมื่อมีการต่อยอดอย่างน้อยหนึ่งรุ่น
                  (กดปุ่ม “ต่อยอด” เพื่อสร้าง Gen ถัดไป)
                </p>
              );
            }

            type Cell = React.ReactNode;
            const rows: { label: string; cells: Cell[]; highlight?: boolean }[] = [
              {
                label: 'ภาควิชา & คณะ',
                cells: chain.map(p =>
                  [p.department?.name_th, p.department?.faculty?.short_name].filter(Boolean).join(' · ') || 'ไม่ระบุ'
                )
              },
              { label: 'ปีการศึกษา', cells: chain.map(p => `พ.ศ. ${p.academic_year}`) },
              { label: 'สถานะงานวิจัย', cells: chain.map(p => STATUS_LABEL[p.status]) },
              {
                label: 'คะแนนคุณภาพ (DNA Score)',
                cells: chain.map((p, i) => (
                  <span key={i} className={i === chain.length - 1 ? 'font-bold text-emerald-700' : ''}>
                    {p.rating_score.toFixed(1)} / 5.0
                  </span>
                ))
              },
              { label: 'ผู้เข้าชม', cells: chain.map(p => `${p.view_count.toLocaleString('th-TH')} ครั้ง`) },
              { label: 'ถูกนำไปต่อยอด', cells: chain.map(p => `${p.fork_count} โครงงาน`) },
              {
                label: 'ทรัพยากรเปิดให้ใช้ซ้ำ',
                cells: chain.map(p => `${(p.assets ?? []).length} รายการ`)
              },
              {
                label: 'เทคโนโลยีหลัก',
                cells: chain.map(p =>
                  (p.dna_card?.tech_stack ?? []).slice(0, 3).join(', ') || '—'
                )
              },
              {
                label: 'สิ่งที่ได้รับจากรุ่นก่อน',
                highlight: true,
                cells: chain.map((p, i) => {
                  const edge = parentEdgeOf.get(p.id);
                  if (i === 0 || !edge)
                    return <span key={i} className="text-slate-400">— (สารตั้งต้น)</span>;
                  return (
                    <span key={i} className="text-emerald-800 font-medium bg-emerald-50/60 rounded px-1 py-0.5 inline-block">
                      {EXTENSION_TYPE_LABEL[edge.extension_type]}: {edge.evolution_summary}
                    </span>
                  );
                })
              }
            ];

            return (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700">
                      <th className="p-3.5 font-bold whitespace-nowrap">หัวข้อการเปรียบเทียบ</th>
                      {chain.map((p, i) => (
                        <th key={p.id} className={`p-3.5 font-bold whitespace-nowrap ${i === chain.length - 1 ? 'bg-amber-50/80' : ''}`}>
                          GEN {i + 1}
                          <span className="block text-[10px] font-medium text-slate-500 normal-case">{p.title_th}</span>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {rows.map(row => (
                      <tr key={row.label}>
                        <td className="p-3.5 font-bold text-slate-900 bg-slate-50/70 whitespace-nowrap align-top">
                          {row.label}
                        </td>
                        {row.cells.map((cell, ci) => (
                          <td
                            key={ci}
                            className={`p-3.5 align-top ${row.highlight ? 'bg-emerald-50/30' : ''}`}
                          >
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
};
