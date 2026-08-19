'use client';

import React from 'react';
import { 
  BarChart3, 
  GitFork, 
  Sparkles, 
  Handshake,
  Download,
  GraduationCap,
  Layers,
  FileCode
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
    <div className="max-w-7xl mx-auto p-6 space-y-8 animate-in fade-in">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-amber-950 text-white p-6 md:p-8 rounded-3xl shadow-xl">
        <div className="flex items-center space-x-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
          <BarChart3 className="w-4 h-4" />
          <span>PROJECT & KNOWLEDGE REUSE ANALYTICS</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-black tracking-tight">
          สถิติคลังโครงงานและองค์ความรู้ มก.ฉกส.
        </h2>
        <p className="text-xs md:text-sm text-slate-300 mt-2 leading-relaxed">
          สรุปภาพรวมการสร้างนวัตกรรม การหมุนเวียนโค้ด/ชุดข้อมูลเพื่อต่อยอด และสัดส่วนผลงานจำแนกตามคณะและสาขาวิชา มหาวิทยาลัยเกษตรศาสตร์ สกลนคร
        </p>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Metric 1 */}
        <div className="p-5 bg-white rounded-3xl border border-slate-200 shadow-soft">
          <div className="flex items-center justify-between text-amber-600">
            <span className="text-xs font-bold text-slate-500">โครงงานในระบบ</span>
            <div className="p-2 bg-amber-50 rounded-xl"><Sparkles className="w-5 h-5" /></div>
          </div>
          <div className="text-3xl font-black text-slate-900 mt-2">{projects.length}</div>
          <div className="text-[11px] text-emerald-600 font-bold mt-1">✓ ครอบคลุม 4 คณะในวิทยาเขต</div>
        </div>

        {/* Metric 2 */}
        <div className="p-5 bg-white rounded-3xl border border-slate-200 shadow-soft">
          <div className="flex items-center justify-between text-blue-600">
            <span className="text-xs font-bold text-slate-500">อัตราการต่อยอด (Lineage)</span>
            <div className="p-2 bg-blue-50 rounded-xl"><GitFork className="w-5 h-5" /></div>
          </div>
          <div className="text-3xl font-black text-slate-900 mt-2">
            {Math.round((totalLineages / (projects.length || 1)) * 100)}%
          </div>
          <div className="text-[11px] text-slate-500 mt-1">โครงงานเกิดสายวิวัฒนาการต่อเนื่อง</div>
        </div>

        {/* Metric 3 */}
        <div className="p-5 bg-white rounded-3xl border border-slate-200 shadow-soft">
          <div className="flex items-center justify-between text-emerald-600">
            <span className="text-xs font-bold text-slate-500">ดาวน์โหลดทรัพยากรซ้ำ</span>
            <div className="p-2 bg-emerald-50 rounded-xl"><Download className="w-5 h-5" /></div>
          </div>
          <div className="text-3xl font-black text-slate-900 mt-2">{totalDownloads.toLocaleString()}</div>
          <div className="text-[11px] text-emerald-600 font-bold mt-1">ประหยัดเวลารวมกว่า 2,400 ชม.</div>
        </div>

        {/* Metric 4 */}
        <div className="p-5 bg-white rounded-3xl border border-slate-200 shadow-soft">
          <div className="flex items-center justify-between text-purple-600">
            <span className="text-xs font-bold text-slate-500">โจทย์จริงที่เชื่อมโยง</span>
            <div className="p-2 bg-purple-50 rounded-xl"><Handshake className="w-5 h-5" /></div>
          </div>
          <div className="text-3xl font-black text-slate-900 mt-2">{challenges.length}</div>
          <div className="text-[11px] text-slate-500 mt-1">จากชุมชนและอุตสาหกรรม</div>
        </div>

      </div>

      {/* Faculty Breakdown */}
      <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-soft space-y-6">
        <h3 className="text-lg font-black text-slate-900 flex items-center space-x-2">
          <GraduationCap className="w-5 h-5 text-amber-500" />
          <span>สัดส่วนโครงงานจำแนกตามคณะ (Faculty Distribution)</span>
        </h3>

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
                      className="text-white text-[10px] font-black px-2 py-0.5 rounded shadow-2xs"
                    >
                      {fac.short_name}
                    </span>
                    <span className="font-bold text-slate-800">{fac.name_th}</span>
                  </div>
                  <span className="font-bold text-slate-600">{count} โครงงาน ({percentage}%)</span>
                </div>

                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${Math.max(percentage, 5)}%`, backgroundColor: fac.color_hex }}
                    className="h-full rounded-full transition-all duration-500"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
