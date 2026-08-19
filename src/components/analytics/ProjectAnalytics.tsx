'use client';

import React from 'react';
import { 
  BarChart3, 
  GitFork, 
  Layers, 
  Download,
  GraduationCap,
  Building,
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

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="bg-slate-900 text-white p-6 md:p-8 rounded-2xl border border-slate-800 shadow-sm">
        <div className="max-w-3xl space-y-2">
          <div className="flex items-center space-x-2 text-amber-400 font-mono text-xs font-bold uppercase tracking-wider">
            <BarChart3 className="w-4 h-4" />
            <span>PROJECT & KNOWLEDGE REUSE ANALYTICS</span>
          </div>
          <h2 className="font-display text-2xl md:text-3xl font-bold tracking-tight text-white">
            สถิติคลังโครงงานและองค์ความรู้ มก.ฉกส.
          </h2>
          <p className="text-xs md:text-sm text-slate-300 leading-relaxed font-sans">
            ภาพรวมการสร้างนวัตกรรม การหมุนเวียนโค้ด ชุดข้อมูล และฮาร์ดแวร์เพื่อต่อยอด รวมถึงสัดส่วนผลงานจำแนกตามคณะ มหาวิทยาลัยเกษตรศาสตร์ สกลนคร
          </p>
        </div>
      </div>

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
              ครอบคลุม 4 คณะในวิทยาเขต
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
              โครงงานเกิดสายวิวัฒนาการสืบทอด
            </div>
          </div>
        </div>

        {/* Metric 3: Resource Downloads */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-soft flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">ดาวน์โหลดทรัพยากรซ้ำ</span>
            <div className="p-1.5 bg-slate-100 rounded-lg text-emerald-700">
              <Download className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="font-display text-3xl font-bold text-slate-900 tabular-nums">
              {totalDownloads.toLocaleString()}
            </div>
            <div className="text-xs text-slate-500 mt-1 font-medium">
              นำซอร์สโค้ดและชุดข้อมูลไปใช้ต่อ
            </div>
          </div>
        </div>

        {/* Metric 4: Real-world Challenges */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-soft flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">โจทย์จริงที่เชื่อมโยง</span>
            <div className="p-1.5 bg-slate-100 rounded-lg text-purple-700">
              <Target className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="font-display text-3xl font-bold text-slate-900 tabular-nums">
              {challenges.length}
            </div>
            <div className="text-xs text-slate-500 mt-1 font-medium">
              จากชุมชน อุตสาหกรรม และ มก.ฉกส.
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
          <span className="text-xs font-mono text-slate-400">4 คณะวิชา</span>
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

                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${Math.max(percentage, 5)}%`, backgroundColor: fac.color_hex }}
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
