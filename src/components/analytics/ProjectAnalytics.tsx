'use client';

import React from 'react';
import { 
  BarChart3, 
  GitFork, 
  Layers, 
  Download,
  GraduationCap,
  Target,
  TrendingUp,
  Eye,
  FileDown
} from 'lucide-react';
import { Project, Faculty, Challenge, ReusableAsset } from '@/types/dna';

interface ProjectAnalyticsProps {
  projects: Project[];
  faculties: Faculty[];
  challenges: Challenge[];
  /** Opens the detail drawer when an insight row is clicked */
  onViewProject?: (project: Project) => void;
}

export const ProjectAnalytics: React.FC<ProjectAnalyticsProps> = ({
  projects,
  faculties,
  challenges,
  onViewProject
}) => {
  // Compute analytics
  const totalReusableAssets = projects.reduce((acc, p) => acc + (p.assets?.length || 0), 0);
  const totalDownloads = projects.reduce((acc, p) => acc + (p.assets?.reduce((a, as) => a + (as.download_count || 0), 0) || 0), 0);
  const totalLineages = projects.filter(p => (p.parent_lineages?.length || 0) > 0 || (p.child_lineages?.length || 0) > 0).length;
  // Challenges actually engaged with (has matched projects or progressed past 'open'),
  // not just the raw catalogue size.
  const linkedChallenges = challenges.filter(
    c => c.status !== 'open' || (c.matched_project_ids?.length ?? 0) > 0
  ).length;

  // --- Insight panels (master-prompt T9): derived purely from props ---
  // Publications per academic year, ascending timeline order
  const yearBuckets = Array.from(
    projects.reduce((map, p) => {
      if (p.academic_year != null) map.set(p.academic_year, (map.get(p.academic_year) || 0) + 1);
      return map;
    }, new Map<number, number>())
  ).sort((a, b) => a[0] - b[0]);
  const maxYearCount = Math.max(1, ...yearBuckets.map(([, n]) => n));

  // Top 3 most-viewed projects
  const topProjects = [...projects]
    .sort((a, b) => (b.view_count || 0) - (a.view_count || 0))
    .slice(0, 3);

  // Top 3 downloaded reusable assets across the whole repository
  const topAssets = projects
    .flatMap(p => (p.assets || []).map(asset => ({ ...asset, projectTitle: p.title_th })))
    .sort((a, b) => b.download_count - a.download_count)
    .slice(0, 3);

  const ASSET_TYPE_LABEL: Record<ReusableAsset['asset_type'], string> = {
    code_repo: 'ซอร์สโค้ด',
    dataset: 'ชุดข้อมูล',
    cad_blueprint: 'แบบ CAD',
    circuit_schematic: 'วงจรอิเล็กทรอนิกส์',
    api: 'API',
    trained_model: 'โมเดล AI',
    document: 'เอกสาร'
  };

  // Empty state: guide newcomers instead of showing a wall of zeros
  if (projects.length === 0) {
    return (
      <div className="bg-white p-10 rounded-2xl border border-slate-200 shadow-soft flex flex-col items-center justify-center text-center space-y-3">
        <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600">
          <BarChart3 className="w-6 h-6" />
        </div>
        <h3 className="font-display text-lg font-bold text-slate-900">ยังไม่มีข้อมูลสำหรับแสดงสถิติ</h3>
        <p className="text-xs md:text-sm text-slate-500 max-w-md leading-relaxed">
          เมื่อคลังโครงงานเริ่มมีผลงาน ตัวเลขการใช้ทรัพยากรซ้ำ อัตราการต่อยอด และสัดส่วนรายคณะจะปรากฏที่นี่
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">

      {/* Metric Cards Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Metric 1: Total Projects */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-soft flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">โครงงานทั้งหมด</span>
            <div className="p-1.5 bg-slate-100 rounded-lg text-slate-700">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="font-display text-3xl font-bold text-slate-900 tabular-nums">
              {projects.length}
            </div>
            <div className="text-xs text-slate-500 mt-1 font-medium">
              ครอบคลุม {faculties.length} คณะในวิทยาเขต
            </div>
          </div>
        </div>

        {/* Metric 2: Lineage Rate */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-soft flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">อัตราการต่อยอด (Lineage)</span>
            <div className="p-1.5 bg-slate-100 rounded-lg text-amber-700">
              <GitFork className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="font-display text-3xl font-bold text-slate-900 tabular-nums">
              {Math.round((totalLineages / (projects.length || 1)) * 100)}%
            </div>
            <div className="text-xs text-slate-500 mt-1 font-medium">
              {totalLineages}/{projects.length} โครงงานมีสายวิวัฒนาการสืบทอด
            </div>
          </div>
        </div>

        {/* Metric 3: Resource Downloads */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-soft flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">การใช้ทรัพยากรซ้ำ (Reuse)</span>
            <div className="p-1.5 bg-slate-100 rounded-lg text-emerald-700">
              <Download className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="font-display text-3xl font-bold text-slate-900 tabular-nums">
              {totalDownloads.toLocaleString()}
            </div>
            <div className="text-xs text-slate-500 mt-1 font-medium">
              ดาวน์โหลดจาก {totalReusableAssets.toLocaleString()} ทรัพยากรที่เปิดให้ใช้ซ้ำ
            </div>
          </div>
        </div>

        {/* Metric 4: Real-world Challenges */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-soft flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">โจทย์จริงที่จับคู่แล้ว</span>
            <div className="p-1.5 bg-slate-100 rounded-lg text-purple-700">
              <Target className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="font-display text-3xl font-bold text-slate-900 tabular-nums">
              {linkedChallenges}
            </div>
            <div className="text-xs text-slate-500 mt-1 font-medium">
              จากทั้งหมด {challenges.length} โจทย์ · ชุมชน อุตสาหกรรม และ มก.ฉกส.
            </div>
          </div>
        </div>

      </div>

      {/* Insight Panels (master-prompt T9) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Panel A: Publication trend by academic year */}
        <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-soft flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-sm font-bold text-slate-900 flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-sky-600" />
              <span>แนวโน้มการเผยแพร่รายปี</span>
            </h3>
            <span className="text-xs font-mono text-slate-400">{yearBuckets.length} ปีการศึกษา</span>
          </div>
          {yearBuckets.length === 0 ? (
            <p className="text-xs text-slate-400 my-auto">ยังไม่มีข้อมูลรายปีการศึกษา</p>
          ) : (
            <div className="mt-auto flex items-end justify-between gap-2 h-28 pt-2">
              {yearBuckets.map(([year, count]) => (
                <div key={year} className="flex-1 flex flex-col items-center justify-end h-full gap-1.5 min-w-0">
                  <span className="text-[10px] font-mono font-bold text-slate-600 tabular-nums">{count}</span>
                  <div
                    style={{ height: `${Math.max((count / maxYearCount) * 100, 4)}%` }}
                    className="w-full max-w-[42px] bg-gradient-to-t from-amber-500 to-amber-300 rounded-t-md transition-all duration-300"
                  />
                  <span className="text-[10px] font-medium text-slate-500 tabular-nums">{year}</span>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Panel B: Most viewed projects */}
        <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-soft">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-display text-sm font-bold text-slate-900 flex items-center space-x-2">
              <Eye className="w-4 h-4 text-purple-700" />
              <span>โครงงานได้รับความสนใจสูงสุด</span>
            </h3>
            <span className="text-xs font-mono text-slate-400">TOP 3</span>
          </div>
          <div>
            {topProjects.map((p, index) => (
              <button
                key={p.id}
                type="button"
                onClick={() => onViewProject?.(p)}
                title={p.title_th}
                className="w-full flex items-center gap-3 py-2.5 border-b border-slate-50 last:border-b-0 text-left hover:bg-amber-50/60 transition-colors rounded-lg px-1 -mx-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
              >
                <span className="w-6 h-6 shrink-0 rounded-md bg-slate-900 text-amber-400 font-mono text-xs font-bold flex items-center justify-center">
                  {index + 1}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-xs font-bold text-slate-800 truncate">{p.title_th}</span>
                  <span className="block text-[10px] text-slate-400 truncate">
                    {p.department?.name_th || 'ไม่ระบุภาควิชา'} · ปี {p.academic_year}
                  </span>
                </span>
                <span className="shrink-0 flex items-center gap-2 text-[10px] font-mono text-slate-500 tabular-nums">
                  <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{(p.view_count || 0).toLocaleString()}</span>
                  <span className="flex items-center gap-1" title="จำนวนครั้งที่ถูกต่อยอด"><GitFork className="w-3 h-3" />{p.fork_count || 0}</span>
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* Panel C: Most downloaded reusable assets */}
        <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-soft">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-display text-sm font-bold text-slate-900 flex items-center space-x-2">
              <FileDown className="w-4 h-4 text-emerald-700" />
              <span>ทรัพยากรยอดนิยม</span>
            </h3>
            <span className="text-xs font-mono text-slate-400">TOP 3</span>
          </div>
          {topAssets.length === 0 ? (
            <p className="text-xs text-slate-400 mt-4">ยังไม่มีทรัพยากรที่ถูกดาวน์โหลด</p>
          ) : (
            <div>
              {topAssets.map((asset) => (
                <div key={asset.id} className="py-2.5 border-b border-slate-50 last:border-b-0 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-slate-800 truncate" title={asset.title}>{asset.title}</span>
                    <span className="shrink-0 flex items-center gap-1 text-[10px] font-mono text-slate-500 tabular-nums">
                      <FileDown className="w-3 h-3" />{asset.download_count.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="shrink-0 px-1.5 py-px bg-emerald-50 text-emerald-700 border border-emerald-100 rounded text-[10px] font-semibold">
                      {ASSET_TYPE_LABEL[asset.asset_type]}
                    </span>
                    <span className="text-[10px] text-slate-400 truncate">{asset.projectTitle}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

      </div>

      {/* Faculty Distribution */}
      <section className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-soft space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <h3 className="font-display text-base font-bold text-slate-900 flex items-center space-x-2">
            <GraduationCap className="w-5 h-5 text-amber-600" />
            <span>สัดส่วนโครงงานจำแนกตามคณะ (Faculty Distribution)</span>
          </h3>
          <span className="text-xs font-mono text-slate-400">{faculties.length} คณะวิชา</span>
        </div>

        <div className="space-y-4">
          {faculties.map((fac) => {
            const count = projects.filter(p => p.department?.faculty_id === fac.id).length;
            const percentage = Math.round((count / (projects.length || 1)) * 100);

            return (
              <div key={fac.id} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2">
                    <span
                      style={{ backgroundColor: fac.color_hex }}
                      className="text-white font-mono text-[10px] font-bold px-2 py-0.5 rounded shadow-2xs"
                    >
                      {fac.short_name}
                    </span>
                    <span className="font-semibold text-slate-800">{fac.name_th}</span>
                  </div>
                  <span className="font-mono text-slate-600 tabular-nums">{count} โครงงาน ({percentage}%)</span>
                </div>

                <div
                  className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden"
                  role="meter"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={percentage}
                  aria-label={`${fac.name_th}: ${count} โครงงาน (${percentage}%)`}
                >
                  <div
                    style={{
                      width: percentage > 0 ? `${Math.max(percentage, 3)}%` : '0%',
                      backgroundColor: fac.color_hex
                    }}
                    className="h-full rounded-full transition-all duration-300"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
};
