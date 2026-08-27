'use client';

import React from 'react';
import { 
  BarChart3, 
  GitFork, 
  Layers, 
  Download,
  GraduationCap,
  Target
} from 'lucide-react';
import { Project, Faculty, Challenge } from '@/types/dna';

interface ProjectAnalyticsProps {
  projects: Project[];
  faculties: Faculty[];
  challenges: Challenge[];
}

export const ProjectAnalytics: React.FC<ProjectAnalyticsProps> = ({
  projects,
  faculties,
  challenges
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
