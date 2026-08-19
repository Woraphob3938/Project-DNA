'use client';

import React from 'react';
import { 
  GitFork, 
  ArrowRight, 
  Layers, 
  CheckCircle2,
  FileCode,
  Database,
  Cpu,
  ArrowUpRight
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
  const projMap = new Map<string, Project>();
  projects.forEach(p => projMap.set(p.id, p));

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      
      {/* Header Banner */}
      <div className="bg-slate-900 text-white p-6 md:p-8 rounded-2xl border border-slate-800 shadow-sm">
        <div className="max-w-3xl space-y-2">
          <div className="flex items-center space-x-2 text-amber-400 font-mono text-xs font-bold uppercase tracking-wider">
            <GitFork className="w-4 h-4" />
            <span>PROJECT DNA LINEAGE VISUALIZER</span>
          </div>
          <h2 className="font-display text-2xl md:text-3xl font-bold tracking-tight text-white">
            สายวิวัฒนาการและการต่อยอดโครงงานนิสิต
          </h2>
          <p className="text-xs md:text-sm text-slate-300 leading-relaxed font-sans">
            แผนภูมิแสดงการส่งต่อองค์ความรู้ โค้ด โมเดล และฮาร์ดแวร์จากรุ่นพี่สู่รุ่นน้อง ป้องกันการทำซ้ำจากศูนย์ และส่งเสริมนวัตกรรมที่ก้าวกระโดด
          </p>
        </div>
      </div>

      {/* Lineage Tree Families */}
      <div className="space-y-8">
        
        {/* FAMILY 1: Indigo Innovation Lineage */}
        <section className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-soft space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-100 pb-4 gap-2">
            <div>
              <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 bg-amber-100 text-amber-900 text-xs font-bold rounded-md mb-1">
                <span>สายวิวัฒนาการที่ 1</span>
              </div>
              <h3 className="font-display text-lg font-bold text-slate-900">
                การยกระดับอุตสาหกรรมผ้าย้อมครามสกลนคร (IoT ➡️ Computer Vision ➡️ Edge AI)
              </h3>
            </div>
            <span className="text-xs font-mono font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">
              3 รุ่นการพัฒนา (Gen 1 - Gen 3)
            </span>
          </div>

          {/* Sequential Pipeline with Connectors */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 relative">
            
            {/* Gen 1: Proj 1 */}
            {projMap.get('proj-1') && (
              <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2 py-0.5 bg-slate-900 text-amber-300 font-mono text-[10px] font-bold rounded">
                      GEN 1 · 2566
                    </span>
                    <span className="text-xs font-medium text-slate-600">ME & EE (มก.ฉกส.)</span>
                  </div>
                  <h4 className="font-display font-bold text-slate-900 text-sm leading-snug">
                    {projMap.get('proj-1')?.title_th}
                  </h4>
                  <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed border-l-2 border-slate-300 pl-2.5">
                    {projMap.get('proj-1')?.dna_card?.problem_statement}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-xs">
                  <span className="font-medium text-emerald-800 flex items-center space-x-1">
                    <Database className="w-3.5 h-3.5 text-emerald-600" />
                    <span>กล่อง IoT + Dataset</span>
                  </span>
                  <button
                    onClick={() => onSelectProject(projMap.get('proj-1')!)}
                    className="font-bold text-slate-900 hover:text-amber-700 flex items-center space-x-0.5 transition-colors"
                  >
                    <span>ดู DNA</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* Gen 2: Proj 2 */}
            {projMap.get('proj-2') && (
              <div className="bg-amber-50/50 p-5 rounded-xl border border-amber-300 flex flex-col justify-between space-y-4 relative">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2 py-0.5 bg-amber-500 text-slate-950 font-mono text-[10px] font-bold rounded">
                      GEN 2 · 2567
                    </span>
                    <span className="text-xs font-medium text-slate-700">CS & CPE (มก.ฉกส.)</span>
                  </div>
                  <h4 className="font-display font-bold text-slate-900 text-sm leading-snug">
                    {projMap.get('proj-2')?.title_th}
                  </h4>
                  <p className="text-xs text-slate-700 mt-2 line-clamp-2 leading-relaxed border-l-2 border-amber-400 pl-2.5">
                    {projMap.get('proj-2')?.dna_card?.problem_statement}
                  </p>
                </div>

                <div className="pt-3 border-t border-amber-200 flex items-center justify-between text-xs">
                  <span className="font-medium text-amber-900 flex items-center space-x-1">
                    <Cpu className="w-3.5 h-3.5 text-amber-700" />
                    <span>YOLOv8 AI Model</span>
                  </span>
                  <button
                    onClick={() => onSelectProject(projMap.get('proj-2')!)}
                    className="font-bold text-slate-900 hover:text-amber-700 flex items-center space-x-0.5 transition-colors"
                  >
                    <span>ดู DNA</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* Gen 3: Proj 6 */}
            {projMap.get('proj-6') && (
              <div className="bg-slate-50 p-5 rounded-xl border border-dashed border-amber-400 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2 py-0.5 bg-slate-800 text-amber-400 font-mono text-[10px] font-bold rounded">
                      GEN 3 · 2568 (กำลังพัฒนา)
                    </span>
                    <span className="text-xs font-medium text-slate-600">ME & CPE (มก.ฉกส.)</span>
                  </div>
                  <h4 className="font-display font-bold text-slate-900 text-sm leading-snug">
                    {projMap.get('proj-6')?.title_th}
                  </h4>
                  <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed border-l-2 border-slate-300 pl-2.5">
                    {projMap.get('proj-6')?.abstract_th}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-800 flex items-center space-x-1">
                    <Layers className="w-3.5 h-3.5 text-slate-600" />
                    <span>Edge AI Drone Drone</span>
                  </span>
                  <button
                    onClick={() => onSelectProject(projMap.get('proj-6')!)}
                    className="font-bold text-slate-900 hover:text-amber-700 flex items-center space-x-0.5 transition-colors"
                  >
                    <span>ดู DNA</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

          </div>

          {/* Lineage Synergy Callout (Honest, factual) */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-start space-x-3 text-xs text-slate-700">
            <GitFork className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-900 font-bold">ผลกระทบเชิงโครงสร้าง (Lineage Impact):</strong>
              <p className="mt-0.5 leading-relaxed">
                การส่งต่อข้อมูลเซ็นเซอร์หมักครามจากรุ่นพี่ (ME 2566) ช่วยให้นิสิตสาขาวิทยาการคอมฯ (CS 2567) ฝึกฝน AI Model ได้ทันทีโดยไม่ต้องเริ่มต้นเก็บตัวอย่างสีใหม่ และส่งต่อโมเดลไปติดตั้งบนโดรนสำรวจแปลงคราม (2568) ได้อย่างไร้รอยต่อ
              </p>
            </div>
          </div>
        </section>

        {/* FAMILY 2: Water & Drought AI Lineage */}
        <section className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-soft space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-100 pb-4 gap-2">
            <div>
              <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 bg-blue-100 text-blue-900 text-xs font-bold rounded-md mb-1">
                <span>สายวิวัฒนาการที่ 2</span>
              </div>
              <h3 className="font-display text-lg font-bold text-slate-900">
                การจัดการน้ำและพยากรณ์ภัยแล้งลุ่มน้ำก่ำ-หนองหาร (LoRaWAN ➡️ Deep Learning LSTM)
              </h3>
            </div>
            <span className="text-xs font-mono font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">
              2 รุ่นการพัฒนา (Gen 1 - Gen 2)
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Gen 1: Proj 3 */}
            {projMap.get('proj-3') && (
              <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2 py-0.5 bg-slate-900 text-amber-300 font-mono text-[10px] font-bold rounded">
                      GEN 1 · 2566
                    </span>
                    <span className="text-xs font-medium text-slate-600">EE (วิศวกรรมไฟฟ้า)</span>
                  </div>
                  <h4 className="font-display font-bold text-slate-900 text-sm">{projMap.get('proj-3')?.title_th}</h4>
                  <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed border-l-2 border-slate-300 pl-2.5">
                    {projMap.get('proj-3')?.abstract_th}
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-xs">
                  <span className="font-medium text-blue-800">✓ ฮาร์ดแวร์ LoRa 10km</span>
                  <button onClick={() => onSelectProject(projMap.get('proj-3')!)} className="font-bold text-slate-900 hover:text-amber-700 flex items-center space-x-0.5">
                    <span>ดู DNA</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* Gen 2: Proj 4 */}
            {projMap.get('proj-4') && (
              <div className="bg-blue-50/40 p-5 rounded-xl border border-blue-200 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2 py-0.5 bg-slate-900 text-amber-300 font-mono text-[10px] font-bold rounded">
                      GEN 2 · 2567
                    </span>
                    <span className="text-xs font-medium text-slate-700">CPE (วิศวกรรมคอมพิวเตอร์)</span>
                  </div>
                  <h4 className="font-display font-bold text-slate-900 text-sm">{projMap.get('proj-4')?.title_th}</h4>
                  <p className="text-xs text-slate-700 mt-2 line-clamp-2 leading-relaxed border-l-2 border-blue-400 pl-2.5">
                    {projMap.get('proj-4')?.abstract_th}
                  </p>
                </div>
                <div className="pt-3 border-t border-blue-200 flex items-center justify-between text-xs">
                  <span className="font-medium text-emerald-800">✓ AI LSTM ทำนายล่วงหน้า 14 วัน</span>
                  <button onClick={() => onSelectProject(projMap.get('proj-4')!)} className="font-bold text-slate-900 hover:text-amber-700 flex items-center space-x-0.5">
                    <span>ดู DNA</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>

      </div>

    </div>
  );
};
