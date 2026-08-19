'use client';

import React, { useState } from 'react';
import { 
  GitFork, 
  Sparkles, 
  ArrowRight, 
  Layers, 
  Cpu, 
  Eye, 
  FileCode, 
  Database,
  Calendar,
  CheckCircle2,
  Share2
} from 'lucide-react';
import { Project, ProjectLineageEdge } from '@/types/dna';

interface LineageVisualizerProps {
  projects: Project[];
  lineages: ProjectLineageEdge[];
  onSelectProject: (project: Project) => void;
  onOpenInceptionStudio: (project: Project) => void;
}

export const LineageVisualizer: React.FC<LineageVisualizerProps> = ({
  projects,
  lineages,
  onSelectProject,
  onOpenInceptionStudio
}) => {
  const [selectedEdge, setSelectedEdge] = useState<ProjectLineageEdge | null>(null);

  // Group projects by lineage families
  // Family 1: Smart Indigo Evolution (Proj 1 -> Proj 2 -> Proj 6)
  // Family 2: Smart Water & Climate (Proj 3 -> Proj 4)
  // Standalone: Cattle & Biogas

  const projMap = new Map<string, Project>();
  projects.forEach(p => projMap.set(p.id, p));

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8 animate-in fade-in">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-amber-950 text-white p-6 md:p-8 rounded-3xl shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center space-x-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
            <GitFork className="w-4 h-4" />
            <span>PROJECT DNA LINEAGE VISUALIZER</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-black tracking-tight">
            สายวิวัฒนาการและการต่อยอดโครงงานนิสิต
          </h2>
          <p className="text-xs md:text-sm text-slate-300 mt-2 leading-relaxed">
            แสดงแผนภูมิความสัมพันธ์และวิวัฒนาการของโครงงานจากรุ่นพี่สู่รุ่นน้อง ป้องกันการทำซ้ำจากศูนย์ และช่วยให้อาจารย์ที่ปรึกษาตรวจพบความซ้ำซ้อนได้อย่างรวดเร็ว
          </p>
        </div>

        {/* Decorative DNA Icon Background */}
        <div className="absolute right-4 -bottom-6 opacity-10 text-amber-400">
          <GitFork className="w-64 h-64" />
        </div>
      </div>

      {/* Lineage Tree Families */}
      <div className="space-y-10">
        
        {/* FAMILY 1: Indigo Innovation Lineage */}
        <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-soft space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <span className="px-3 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-lg">
                สายวิวัฒนาการที่ 1
              </span>
              <h3 className="text-lg font-black text-slate-900 mt-1">
                การยกระดับอุตสาหกรรมผ้าย้อมครามสกลนคร (IoT ➡️ Computer Vision ➡️ Edge AI)
              </h3>
            </div>
            <span className="text-xs font-bold text-slate-400">3 รุ่นการพัฒนา (Gen 1 - Gen 3)</span>
          </div>

          {/* Visual Interactive Flow Nodes */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            
            {/* Gen 1: Proj 1 */}
            {projMap.get('proj-1') && (
              <div className="bg-slate-50 hover:bg-amber-50/40 p-5 rounded-2xl border-2 border-slate-200 hover:border-amber-400 transition-all flex flex-col justify-between shadow-2xs group">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2 py-0.5 bg-slate-900 text-amber-400 text-[10px] font-black rounded">
                      GEN 1 (ปี 2566)
                    </span>
                    <span className="text-xs font-bold text-slate-500">ME & EE</span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm group-hover:text-amber-600 transition-colors">
                    {projMap.get('proj-1')?.title_th}
                  </h4>
                  <p className="text-xs text-slate-500 mt-2 line-clamp-2">
                    {projMap.get('proj-1')?.dna_card?.problem_statement}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200/70 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-emerald-700">✓ ผลลัพธ์: กล่อง IoT + Dataset</span>
                  <button
                    onClick={() => onSelectProject(projMap.get('proj-1')!)}
                    className="text-xs font-bold text-slate-700 hover:text-amber-600"
                  >
                    ดู DNA ➔
                  </button>
                </div>
              </div>
            )}

            {/* Gen 2: Proj 2 */}
            {projMap.get('proj-2') && (
              <div className="bg-amber-50/70 hover:bg-amber-100/50 p-5 rounded-2xl border-2 border-amber-400 transition-all flex flex-col justify-between shadow-soft group relative">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-2.5 py-0.5 bg-amber-500 text-slate-950 text-[10px] font-black rounded-full shadow-xs">
                  สืบทอด Dataset & IoT
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2 mt-1">
                    <span className="px-2 py-0.5 bg-slate-900 text-amber-400 text-[10px] font-black rounded">
                      GEN 2 (ปี 2567)
                    </span>
                    <span className="text-xs font-bold text-slate-500">CS & CPE</span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm group-hover:text-amber-600 transition-colors">
                    {projMap.get('proj-2')?.title_th}
                  </h4>
                  <p className="text-xs text-slate-600 mt-2 line-clamp-2">
                    {projMap.get('proj-2')?.dna_card?.problem_statement}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-amber-200 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-amber-800">✓ ผลลัพธ์: YOLOv8 AI Model</span>
                  <button
                    onClick={() => onSelectProject(projMap.get('proj-2')!)}
                    className="text-xs font-bold text-slate-900 hover:text-amber-600"
                  >
                    ดู DNA ➔
                  </button>
                </div>
              </div>
            )}

            {/* Gen 3: Proj 6 */}
            {projMap.get('proj-6') && (
              <div className="bg-slate-50 hover:bg-amber-50/40 p-5 rounded-2xl border-2 border-dashed border-amber-400/80 transition-all flex flex-col justify-between shadow-2xs group">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2 py-0.5 bg-amber-500 text-slate-950 text-[10px] font-black rounded">
                      GEN 3 (ปี 2568 - กำลังพัฒนา)
                    </span>
                    <span className="text-xs font-bold text-slate-500">ME & CPE</span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm group-hover:text-amber-600 transition-colors">
                    {projMap.get('proj-6')?.title_th}
                  </h4>
                  <p className="text-xs text-slate-500 mt-2 line-clamp-2">
                    {projMap.get('proj-6')?.abstract_th}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200/70 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-purple-700">🚀 Edge AI Drone Drone</span>
                  <button
                    onClick={() => onSelectProject(projMap.get('proj-6')!)}
                    className="text-xs font-bold text-slate-700 hover:text-amber-600"
                  >
                    ดู DNA ➔
                  </button>
                </div>
              </div>
            )}

          </div>

          {/* Lineage Synergy Callout */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-start space-x-3 text-xs text-slate-700">
            <Sparkles className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-900 font-bold">ผลกระทบจากการต่อยอด (Lineage Impact):</strong>
              <p className="mt-0.5">
                จากการเริ่มต้นพัฒนากล่องเซ็นเซอร์หมักคราม (ME 2566) รุ่นน้องสาขาวิทยาการคอมฯ (2567) นำ Dataset มาพัฒนาโมเดล AI ตรวจเฉดสี และส่งต่อให้นิสิตปี 2568 ติดตั้ง AI บนโดรนแปลงเกษตรอินทรีย์ ทำให้เกิดการใช้ทรัพยากรซ้ำ 100% ประหยัดเวลาวิจัยของคณะรวมกว่า 18 เดือน
              </p>
            </div>
          </div>
        </div>

        {/* FAMILY 2: Water & Drought AI Lineage */}
        <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-soft space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded-lg">
                สายวิวัฒนาการที่ 2
              </span>
              <h3 className="text-lg font-black text-slate-900 mt-1">
                การจัดการน้ำและพยากรณ์ภัยแล้งลุ่มน้ำก่ำ-หนองหาร (LoRaWAN ➡️ Deep Learning LSTM)
              </h3>
            </div>
            <span className="text-xs font-bold text-slate-400">2 รุ่นการพัฒนา (Gen 1 - Gen 2)</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Gen 1: Proj 3 */}
            {projMap.get('proj-3') && (
              <div className="bg-slate-50 p-5 rounded-2xl border-2 border-slate-200 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2 py-0.5 bg-slate-900 text-amber-400 text-[10px] font-black rounded">
                      GEN 1 (ปี 2566)
                    </span>
                    <span className="text-xs font-bold text-slate-500">EE (วิศวกรรมไฟฟ้า)</span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm">{projMap.get('proj-3')?.title_th}</h4>
                  <p className="text-xs text-slate-500 mt-2 line-clamp-2">{projMap.get('proj-3')?.abstract_th}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-blue-700">✓ ฮาร์ดแวร์ LoRa 10km</span>
                  <button onClick={() => onSelectProject(projMap.get('proj-3')!)} className="text-xs font-bold text-slate-700 hover:text-amber-600">
                    ดู DNA ➔
                  </button>
                </div>
              </div>
            )}

            {/* Gen 2: Proj 4 */}
            {projMap.get('proj-4') && (
              <div className="bg-blue-50/50 p-5 rounded-2xl border-2 border-blue-300 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2 py-0.5 bg-slate-900 text-amber-400 text-[10px] font-black rounded">
                      GEN 2 (ปี 2567)
                    </span>
                    <span className="text-xs font-bold text-slate-500">CPE (วิศวกรรมคอมพิวเตอร์)</span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm">{projMap.get('proj-4')?.title_th}</h4>
                  <p className="text-xs text-slate-600 mt-2 line-clamp-2">{projMap.get('proj-4')?.abstract_th}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-blue-200 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-emerald-700">✓ โมเดล AI LSTM ทำนายล่วงหน้า 14 วัน</span>
                  <button onClick={() => onSelectProject(projMap.get('proj-4')!)} className="text-xs font-bold text-slate-900 hover:text-amber-600">
                    ดู DNA ➔
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
