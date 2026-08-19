'use client';

import React from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  GitFork, 
  Sparkles, 
  Users, 
  Recycle, 
  Cpu, 
  Building2, 
  GraduationCap, 
  Handshake,
  Download
} from 'lucide-react';
import { Project, SdgGoal, Challenge } from '@/types/dna';

interface SdgAnalyticsProps {
  projects: Project[];
  sdgs: SdgGoal[];
  challenges: Challenge[];
}

export const SdgAnalytics: React.FC<SdgAnalyticsProps> = ({
  projects,
  sdgs,
  challenges
}) => {
  // Compute analytics
  const totalReusableAssets = projects.reduce((acc, p) => acc + (p.assets?.length || 0), 0);
  const totalDownloads = projects.reduce((acc, p) => acc + (p.assets?.reduce((a, as) => a + (as.download_count || 0), 0) || 0), 0);
  const totalGapsIdentified = projects.reduce((acc, p) => acc + (p.gaps?.length || 0), 0);
  const totalLineages = projects.filter(p => (p.parent_lineages?.length || 0) > 0 || (p.child_lineages?.length || 0) > 0).length;

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8 animate-in fade-in">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-amber-950 text-white p-6 md:p-8 rounded-3xl shadow-xl">
        <div className="flex items-center space-x-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
          <BarChart3 className="w-4 h-4" />
          <span>SDGS & KNOWLEDGE REUSE ANALYTICS</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-black tracking-tight">
          แดชบอร์ดความคุ้มค่าและผลกระทบ SDGs
        </h2>
        <p className="text-xs md:text-sm text-slate-300 mt-2 leading-relaxed">
          สรุปการประหยัดทรัพยากร การหมุนเวียนโค้ด/ชุดข้อมูล และการเชื่อมโยงเป้าหมายการพัฒนาที่ยั่งยืน (SDGs 4, 9, 11, 12, 17)
        </p>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Metric 1 */}
        <div className="p-5 bg-white rounded-3xl border border-slate-200 shadow-soft">
          <div className="flex items-center justify-between text-amber-600">
            <span className="text-xs font-bold text-slate-500">โครงงานทั้งหมด</span>
            <div className="p-2 bg-amber-50 rounded-xl"><Sparkles className="w-5 h-5" /></div>
          </div>
          <div className="text-3xl font-black text-slate-900 mt-2">{projects.length}</div>
          <div className="text-[11px] text-emerald-600 font-bold mt-1">✓ รวบรวมองค์ความรู้ 5 สาขาวิชา</div>
        </div>

        {/* Metric 2 */}
        <div className="p-5 bg-white rounded-3xl border border-slate-200 shadow-soft">
          <div className="flex items-center justify-between text-blue-600">
            <span className="text-xs font-bold text-slate-500">สัดส่วนการต่อยอด (Lineage)</span>
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
            <span className="text-xs font-bold text-slate-500">ยอดดาวน์โหลดทรัพยากรซ้ำ</span>
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
          <div className="text-[11px] text-slate-500 mt-1">ครอบคลุมชุมชนและอุตสาหกรรม</div>
        </div>

      </div>

      {/* SDG Impact Breakdown */}
      <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-soft space-y-6">
        <h3 className="text-lg font-black text-slate-900">
          การจัดสรรโครงงานตามเป้าหมายการพัฒนาที่ยั่งยืน (SDG Impact Distribution)
        </h3>

        <div className="space-y-4">
          {sdgs.map((sdg) => {
            const count = projects.filter(p => p.sdg_ids.includes(sdg.id)).length;
            const percentage = Math.round((count / (projects.length || 1)) * 100);

            return (
              <div key={sdg.id} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2">
                    <span
                      style={{ backgroundColor: sdg.color_hex }}
                      className="text-white text-[10px] font-black px-2 py-0.5 rounded shadow-2xs"
                    >
                      {sdg.code}
                    </span>
                    <span className="font-bold text-slate-800">{sdg.name_th}</span>
                  </div>
                  <span className="font-bold text-slate-600">{count} โครงงาน ({percentage}%)</span>
                </div>

                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${percentage}%`, backgroundColor: sdg.color_hex }}
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
