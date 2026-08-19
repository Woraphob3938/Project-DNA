'use client';

import React, { useState } from 'react';
import { 
  GitFork, 
  ArrowRight, 
  Layers, 
  CheckCircle2, 
  FileCode, 
  Database, 
  Cpu, 
  ArrowUpRight,
  Plus,
  GitBranch,
  Split,
  Table,
  Eye,
  Award,
  Sparkles,
  SlidersHorizontal,
  ChevronRight
} from 'lucide-react';
import { Project, ProjectLineageEdge } from '@/types/dna';

interface LineageVisualizerProps {
  projects: Project[];
  lineages: ProjectLineageEdge[];
  onSelectProject: (project: Project) => void;
  onOpenInceptionStudio: (project: Project) => void;
}

type ViewMode = 'pipeline' | 'tree' | 'diff';
type LineageCategory = 'all' | 'indigo' | 'water' | 'agri';

export const LineageVisualizer: React.FC<LineageVisualizerProps> = ({
  projects,
  lineages,
  onSelectProject,
  onOpenInceptionStudio
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>('pipeline');
  const [selectedCategory, setSelectedCategory] = useState<LineageCategory>('all');
  const [diffFamily, setDiffFamily] = useState<'indigo' | 'water' | null>(null);

  const projMap = new Map<string, Project>();
  projects.forEach(p => projMap.set(p.id, p));

  // Family 1 projects
  const indigoProjects = [
    projMap.get('proj-1'),
    projMap.get('proj-2'),
    projMap.get('proj-6')
  ].filter(Boolean) as Project[];

  // Family 2 projects
  const waterProjects = [
    projMap.get('proj-3'),
    projMap.get('proj-4')
  ].filter(Boolean) as Project[];

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      
      {/* Header Banner */}
      <div className="bg-slate-900 text-white p-6 md:p-8 rounded-2xl border border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="max-w-3xl space-y-2">
          <div className="flex items-center space-x-2 text-amber-400 font-mono text-xs font-bold uppercase tracking-wider">
            <GitFork className="w-4 h-4" />
            <span>PROJECT DNA LINEAGE & EVOLUTION ENGINE</span>
          </div>
          <h2 className="font-display text-2xl md:text-3xl font-bold tracking-tight text-white">
            สายวิวัฒนาการและการต่อยอดโครงงานนิสิต
          </h2>
          <p className="text-xs md:text-sm text-slate-300 leading-relaxed font-sans">
            แผนภูมิแสดงการส่งต่อพิมพ์เขียว DNA โค้ด โมเดล AI และฮาร์ดแวร์ข้ามรุ่น ป้องกันการวิจัยซ้ำซ้อน และประเมินความแปลกใหม่ (Novelty) ได้อย่างโปร่งใส
          </p>
        </div>

        {/* View Mode Switcher Pills */}
        <div className="flex p-1 bg-slate-800/90 rounded-xl border border-slate-700/80 text-xs font-semibold shrink-0">
          <button
            onClick={() => setViewMode('pipeline')}
            className={`px-3 py-2 rounded-lg flex items-center space-x-1.5 transition-colors ${
              viewMode === 'pipeline'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <GitFork className="w-3.5 h-3.5" />
            <span>ลำดับขั้น (Pipeline)</span>
          </button>

          <button
            onClick={() => setViewMode('tree')}
            className={`px-3 py-2 rounded-lg flex items-center space-x-1.5 transition-colors ${
              viewMode === 'tree'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Split className="w-3.5 h-3.5" />
            <span>ผังโครงข่าย (Tree Map)</span>
          </button>

          <button
            onClick={() => setViewMode('diff')}
            className={`px-3 py-2 rounded-lg flex items-center space-x-1.5 transition-colors ${
              viewMode === 'diff'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Table className="w-3.5 h-3.5" />
            <span>เปรียบเทียบ (Diff Matrix)</span>
          </button>
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 text-xs">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-3.5 py-1.5 rounded-lg font-bold transition-colors ${
            selectedCategory === 'all'
              ? 'bg-slate-900 text-white'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
          }`}
        >
          สายวิวัฒนาการทั้งหมด
        </button>
        <button
          onClick={() => setSelectedCategory('indigo')}
          className={`px-3.5 py-1.5 rounded-lg font-medium transition-colors flex items-center space-x-1.5 ${
            selectedCategory === 'indigo'
              ? 'bg-amber-500 text-slate-950 font-bold ring-1 ring-amber-400'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
          }`}
        >
          <Layers className="w-3.5 h-3.5 text-amber-700" />
          <span>ภูมิปัญญาย้อมครามสกลนคร (Indigo Tech)</span>
        </button>
        <button
          onClick={() => setSelectedCategory('water')}
          className={`px-3.5 py-1.5 rounded-lg font-medium transition-colors flex items-center space-x-1.5 ${
            selectedCategory === 'water'
              ? 'bg-blue-900 text-white font-bold'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
          }`}
        >
          <Database className="w-3.5 h-3.5 text-blue-600" />
          <span>การจัดการน้ำ & ภัยแล้งลุ่มน้ำก่ำ (Water AI)</span>
        </button>
      </div>

      {/* VIEW MODE 1: SEQUENTIAL PIPELINE VIEW */}
      {viewMode === 'pipeline' && (
        <div className="space-y-8">
          
          {/* FAMILY 1: Indigo Innovation */}
          {(selectedCategory === 'all' || selectedCategory === 'indigo') && (
            <section className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-soft space-y-6">
              
              {/* Family Header */}
              <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-100 pb-4 gap-2">
                <div>
                  <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 bg-amber-100 text-amber-900 text-xs font-bold rounded-md mb-1">
                    <span>สายวิวัฒนาการที่ 1 · ภูมิปัญญาครามสกลนคร</span>
                  </div>
                  <h3 className="font-display text-lg font-bold text-slate-900">
                    ยกระดับหัตถกรรมครามด้วย IoT ➡️ Computer Vision AI ➡️ Autonomous Drone
                  </h3>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      setViewMode('diff');
                      setDiffFamily('indigo');
                    }}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg transition-colors flex items-center space-x-1"
                  >
                    <Table className="w-3.5 h-3.5 text-slate-600" />
                    <span>ดู Diff Matrix</span>
                  </button>

                  <button
                    onClick={() => onOpenInceptionStudio(projMap.get('proj-6') || projMap.get('proj-2')!)}
                    className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold rounded-lg shadow-xs flex items-center space-x-1.5 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5 stroke-[3]" />
                    <span>ต่อยอดเป็น Gen 4</span>
                  </button>
                </div>
              </div>

              {/* Generation Pipeline Nodes with Visual Direction Connectors */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 relative items-stretch">
                
                {/* Gen 1: Proj 1 */}
                {projMap.get('proj-1') && (
                  <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="px-2.5 py-0.5 bg-slate-900 text-amber-300 font-mono text-xs font-bold rounded-md">
                          GEN 1 · 2566
                        </span>
                        <span className="text-xs font-semibold text-slate-600">ME & EE (มก.ฉกส.)</span>
                      </div>
                      <h4 className="font-display font-bold text-slate-900 text-sm leading-snug">
                        {projMap.get('proj-1')?.title_th}
                      </h4>
                      <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed border-l-2 border-slate-300 pl-2.5">
                        {projMap.get('proj-1')?.dna_card?.problem_statement}
                      </p>
                    </div>

                    <div className="space-y-3">
                      {/* Heritage Tag */}
                      <div className="p-2 bg-white rounded-lg border border-slate-200 text-[11px] text-slate-700 font-medium flex items-center space-x-1.5">
                        <Database className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="truncate">ผลิต: วงจรเซ็นเซอร์ pH/Temp + Dataset สีคราม</span>
                      </div>

                      <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
                        <span className="text-slate-400 font-medium">สถานะ: สำเร็จ (ส่งมอบ)</span>
                        <button
                          onClick={() => onSelectProject(projMap.get('proj-1')!)}
                          className="font-bold text-slate-900 hover:text-amber-700 flex items-center space-x-0.5"
                        >
                          <span>ดู DNA</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Gen 2: Proj 2 */}
                {projMap.get('proj-2') && (
                  <div className="bg-amber-50/40 p-5 rounded-xl border border-amber-300 flex flex-col justify-between space-y-4 relative">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="px-2.5 py-0.5 bg-amber-500 text-slate-950 font-mono text-xs font-bold rounded-md">
                          GEN 2 · 2567
                        </span>
                        <span className="text-xs font-semibold text-slate-700">CS & CPE (มก.ฉกส.)</span>
                      </div>
                      <h4 className="font-display font-bold text-slate-900 text-sm leading-snug">
                        {projMap.get('proj-2')?.title_th}
                      </h4>
                      <p className="text-xs text-slate-700 mt-2 line-clamp-2 leading-relaxed border-l-2 border-amber-400 pl-2.5">
                        {projMap.get('proj-2')?.dna_card?.problem_statement}
                      </p>
                    </div>

                    <div className="space-y-3">
                      {/* Heritage Tag */}
                      <div className="p-2 bg-white rounded-lg border border-amber-200 text-[11px] text-amber-950 font-medium flex items-center space-x-1.5">
                        <Cpu className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                        <span className="truncate">สืบทอด: Dataset 2566 ➡️ โมเดล YOLOv8 AI</span>
                      </div>

                      <div className="pt-2 border-t border-amber-200 flex items-center justify-between text-xs">
                        <span className="text-amber-800 font-medium">ความแม่นยำ 94.2%</span>
                        <button
                          onClick={() => onSelectProject(projMap.get('proj-2')!)}
                          className="font-bold text-slate-900 hover:text-amber-700 flex items-center space-x-0.5"
                        >
                          <span>ดู DNA</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Gen 3: Proj 6 */}
                {projMap.get('proj-6') && (
                  <div className="bg-slate-50 p-5 rounded-xl border border-dashed border-amber-400 flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="px-2.5 py-0.5 bg-slate-900 text-amber-300 font-mono text-xs font-bold rounded-md">
                          GEN 3 · 2568 (กำลังพัฒนา)
                        </span>
                        <span className="text-xs font-semibold text-slate-600">ME & CPE (มก.ฉกส.)</span>
                      </div>
                      <h4 className="font-display font-bold text-slate-900 text-sm leading-snug">
                        {projMap.get('proj-6')?.title_th}
                      </h4>
                      <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed border-l-2 border-slate-300 pl-2.5">
                        {projMap.get('proj-6')?.abstract_th}
                      </p>
                    </div>

                    <div className="space-y-3">
                      {/* Heritage Tag */}
                      <div className="p-2 bg-white rounded-lg border border-slate-200 text-[11px] text-slate-800 font-medium flex items-center space-x-1.5">
                        <Layers className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                        <span className="truncate">สืบทอด: โมเดล AI 2567 ➡️ โดรน Edge AI บินสำรวจ</span>
                      </div>

                      <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
                        <button
                          onClick={() => onOpenInceptionStudio(projMap.get('proj-6')!)}
                          className="font-bold text-amber-700 hover:text-amber-800 flex items-center space-x-1"
                        >
                          <Plus className="w-3.5 h-3.5 stroke-[3]" />
                          <span>ต่อยอดโครงงานนี้</span>
                        </button>
                        <button
                          onClick={() => onSelectProject(projMap.get('proj-6')!)}
                          className="font-bold text-slate-900 hover:text-amber-700 flex items-center space-x-0.5"
                        >
                          <span>ดู DNA</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}

              </div>

              {/* Lineage Summary Callout */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-start space-x-3 text-xs text-slate-700">
                <GitFork className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 font-bold">ผลกระทบเชิงโครงสร้าง (Lineage Impact):</strong>
                  <p className="mt-0.5 leading-relaxed">
                    การส่งต่อข้อมูลเซ็นเซอร์หมักครามจากรุ่นพี่ (ME 2566) ช่วยให้นิสิตสาขาวิทยาการคอมฯ (CS 2567) พัฒนา AI ตรวจเฉดสีได้ทันทีโดยไม่ต้องเริ่มต้นเก็บตัวอย่างสีใหม่ และส่งต่อโมเดลไปติดตั้งบนโดรนสำรวจแปลงคราม (2568) ได้อย่างไร้รอยต่อ
                  </p>
                </div>
              </div>
            </section>
          )}

          {/* FAMILY 2: Water & Drought AI */}
          {(selectedCategory === 'all' || selectedCategory === 'water') && (
            <section className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-soft space-y-6">
              
              {/* Family Header */}
              <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-100 pb-4 gap-2">
                <div>
                  <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 bg-blue-100 text-blue-900 text-xs font-bold rounded-md mb-1">
                    <span>สายวิวัฒนาการที่ 2 · การจัดการน้ำและภัยแล้ง</span>
                  </div>
                  <h3 className="font-display text-lg font-bold text-slate-900">
                    ระบบตรวจวัดน้ำอัจฉริยะลุ่มน้ำก่ำ (LoRaWAN IoT ➡️ Deep Learning LSTM AI)
                  </h3>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      setViewMode('diff');
                      setDiffFamily('water');
                    }}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg transition-colors flex items-center space-x-1"
                  >
                    <Table className="w-3.5 h-3.5 text-slate-600" />
                    <span>ดู Diff Matrix</span>
                  </button>

                  <button
                    onClick={() => onOpenInceptionStudio(projMap.get('proj-4')!)}
                    className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold rounded-lg shadow-xs flex items-center space-x-1.5 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5 stroke-[3]" />
                    <span>ต่อยอดเป็น Gen 3</span>
                  </button>
                </div>
              </div>

              {/* Generation Pipeline Nodes */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                
                {/* Gen 1: Proj 3 */}
                {projMap.get('proj-3') && (
                  <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="px-2.5 py-0.5 bg-slate-900 text-amber-300 font-mono text-xs font-bold rounded-md">
                          GEN 1 · 2566
                        </span>
                        <span className="text-xs font-semibold text-slate-600">EE (วิศวกรรมไฟฟ้า)</span>
                      </div>
                      <h4 className="font-display font-bold text-slate-900 text-sm">
                        {projMap.get('proj-3')?.title_th}
                      </h4>
                      <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed border-l-2 border-slate-300 pl-2.5">
                        {projMap.get('proj-3')?.abstract_th}
                      </p>
                    </div>

                    <div className="space-y-3">
                      <div className="p-2 bg-white rounded-lg border border-slate-200 text-[11px] text-slate-700 font-medium flex items-center space-x-1.5">
                        <Cpu className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        <span className="truncate">ผลิต: โครงข่ายทุ่นเซ็นเซอร์ LoRaWAN ส่งไกล 10 กม.</span>
                      </div>

                      <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
                        <span className="text-slate-400 font-medium">สถานะ: สำเร็จ (ติดตั้งจริง)</span>
                        <button
                          onClick={() => onSelectProject(projMap.get('proj-3')!)}
                          className="font-bold text-slate-900 hover:text-amber-700 flex items-center space-x-0.5"
                        >
                          <span>ดู DNA</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Gen 2: Proj 4 */}
                {projMap.get('proj-4') && (
                  <div className="bg-blue-50/40 p-5 rounded-xl border border-blue-200 flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="px-2.5 py-0.5 bg-blue-900 text-white font-mono text-xs font-bold rounded-md">
                          GEN 2 · 2567
                        </span>
                        <span className="text-xs font-semibold text-slate-700">CPE (วิศวกรรมคอมพิวเตอร์)</span>
                      </div>
                      <h4 className="font-display font-bold text-slate-900 text-sm">
                        {projMap.get('proj-4')?.title_th}
                      </h4>
                      <p className="text-xs text-slate-700 mt-2 line-clamp-2 leading-relaxed border-l-2 border-blue-400 pl-2.5">
                        {projMap.get('proj-4')?.abstract_th}
                      </p>
                    </div>

                    <div className="space-y-3">
                      <div className="p-2 bg-white rounded-lg border border-blue-200 text-[11px] text-blue-950 font-medium flex items-center space-x-1.5">
                        <Database className="w-3.5 h-3.5 text-blue-700 shrink-0" />
                        <span className="truncate">สืบทอด: ข้อมูล LoRa ➡️ AI LSTM ทำนายน้ำแล้งล่วงหน้า 14 วัน</span>
                      </div>

                      <div className="pt-2 border-t border-blue-200 flex items-center justify-between text-xs">
                        <button
                          onClick={() => onOpenInceptionStudio(projMap.get('proj-4')!)}
                          className="font-bold text-blue-800 hover:text-blue-950 flex items-center space-x-1"
                        >
                          <Plus className="w-3.5 h-3.5 stroke-[3]" />
                          <span>ต่อยอดโครงงานนี้</span>
                        </button>
                        <button
                          onClick={() => onSelectProject(projMap.get('proj-4')!)}
                          className="font-bold text-slate-900 hover:text-amber-700 flex items-center space-x-0.5"
                        >
                          <span>ดู DNA</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            </section>
          )}

        </div>
      )}

      {/* VIEW MODE 2: INTERACTIVE TREE MAP VIEW */}
      {viewMode === 'tree' && (
        <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-soft space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="font-display text-lg font-bold text-slate-900">
                ผังโครงข่ายสายสัมพันธ์ข้ามรุ่น (Evolution Tree Map)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                คลิกที่โหนดโครงงานเพื่อเปิดดูพิมพ์เขียว หรือกดปุ่มต่อยอดเพื่อเริ่มโครงงานใหม่
              </p>
            </div>
          </div>

          {/* Interactive Visual Graph Canvas */}
          <div className="p-8 bg-slate-50 rounded-xl border border-slate-200 overflow-x-auto">
            <div className="min-w-[700px] space-y-8">
              
              {/* Tree Branch 1: Indigo Innovation */}
              <div className="space-y-3">
                <div className="text-xs font-mono font-bold text-amber-800 uppercase tracking-wider">
                  Branch A: หัตถกรรมคราม (IoT ➡️ Vision AI ➡️ Drone)
                </div>
                <div className="flex items-center space-x-4">
                  {/* Node 1 */}
                  <div 
                    onClick={() => onSelectProject(projMap.get('proj-1')!)}
                    className="p-4 bg-white hover:bg-amber-50 rounded-xl border-2 border-slate-300 hover:border-amber-500 cursor-pointer w-64 shadow-xs transition-colors"
                  >
                    <div className="text-[10px] font-mono font-bold text-slate-500">GEN 1 · 2566 (ME)</div>
                    <div className="text-xs font-bold text-slate-900 mt-1 line-clamp-1">{projMap.get('proj-1')?.title_th}</div>
                    <div className="text-[10px] text-emerald-700 mt-1">✓ พิมพ์เขียววงจร IoT</div>
                  </div>

                  <ArrowRight className="w-5 h-5 text-amber-500 shrink-0" />

                  {/* Node 2 */}
                  <div 
                    onClick={() => onSelectProject(projMap.get('proj-2')!)}
                    className="p-4 bg-amber-50 hover:bg-amber-100/70 rounded-xl border-2 border-amber-400 hover:border-amber-600 cursor-pointer w-64 shadow-xs transition-colors"
                  >
                    <div className="text-[10px] font-mono font-bold text-amber-800">GEN 2 · 2567 (CS)</div>
                    <div className="text-xs font-bold text-slate-900 mt-1 line-clamp-1">{projMap.get('proj-2')?.title_th}</div>
                    <div className="text-[10px] text-amber-800 mt-1">✓ AI Model YOLOv8</div>
                  </div>

                  <ArrowRight className="w-5 h-5 text-amber-500 shrink-0" />

                  {/* Node 3 */}
                  <div 
                    onClick={() => onSelectProject(projMap.get('proj-6')!)}
                    className="p-4 bg-white hover:bg-amber-50 rounded-xl border-2 border-dashed border-amber-400 cursor-pointer w-64 shadow-xs transition-colors"
                  >
                    <div className="text-[10px] font-mono font-bold text-slate-500">GEN 3 · 2568 (ME/CPE)</div>
                    <div className="text-xs font-bold text-slate-900 mt-1 line-clamp-1">{projMap.get('proj-6')?.title_th}</div>
                    <div className="text-[10px] text-purple-700 mt-1">🚀 Autonomous Drone</div>
                  </div>

                  <button
                    onClick={() => onOpenInceptionStudio(projMap.get('proj-6')!)}
                    className="p-3 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl font-bold text-xs flex items-center space-x-1 shadow-xs shrink-0"
                    title="ต่อยอดเป็น Gen 4"
                  >
                    <Plus className="w-4 h-4 stroke-[3]" />
                    <span>Gen 4</span>
                  </button>
                </div>
              </div>

              {/* Tree Branch 2: Water & Climate */}
              <div className="space-y-3 pt-6 border-t border-slate-200">
                <div className="text-xs font-mono font-bold text-blue-800 uppercase tracking-wider">
                  Branch B: การจัดการน้ำ (LoRaWAN ➡️ Deep Learning)
                </div>
                <div className="flex items-center space-x-4">
                  {/* Node 1 */}
                  <div 
                    onClick={() => onSelectProject(projMap.get('proj-3')!)}
                    className="p-4 bg-white hover:bg-blue-50 rounded-xl border-2 border-slate-300 hover:border-blue-500 cursor-pointer w-64 shadow-xs transition-colors"
                  >
                    <div className="text-[10px] font-mono font-bold text-slate-500">GEN 1 · 2566 (EE)</div>
                    <div className="text-xs font-bold text-slate-900 mt-1 line-clamp-1">{projMap.get('proj-3')?.title_th}</div>
                    <div className="text-[10px] text-blue-700 mt-1">✓ เครือข่ายทุ่น LoRa 10km</div>
                  </div>

                  <ArrowRight className="w-5 h-5 text-blue-500 shrink-0" />

                  {/* Node 2 */}
                  <div 
                    onClick={() => onSelectProject(projMap.get('proj-4')!)}
                    className="p-4 bg-blue-50 hover:bg-blue-100 rounded-xl border-2 border-blue-400 hover:border-blue-600 cursor-pointer w-64 shadow-xs transition-colors"
                  >
                    <div className="text-[10px] font-mono font-bold text-blue-800">GEN 2 · 2567 (CPE)</div>
                    <div className="text-xs font-bold text-slate-900 mt-1 line-clamp-1">{projMap.get('proj-4')?.title_th}</div>
                    <div className="text-[10px] text-emerald-700 mt-1">✓ AI LSTM พยากรณ์ภัยแล้ง</div>
                  </div>

                  <button
                    onClick={() => onOpenInceptionStudio(projMap.get('proj-4')!)}
                    className="p-3 bg-blue-900 hover:bg-blue-950 text-white rounded-xl font-bold text-xs flex items-center space-x-1 shadow-xs shrink-0"
                    title="ต่อยอดเป็น Gen 3"
                  >
                    <Plus className="w-4 h-4 stroke-[3]" />
                    <span>Gen 3</span>
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* VIEW MODE 3: EVOLUTION DIFF MATRIX */}
      {viewMode === 'diff' && (
        <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-soft space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="font-display text-lg font-bold text-slate-900">
                ตารางเปรียบเทียบการสืบทอดและนวัตกรรมใหม่ (Evolution Diff Matrix)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                ตรวจสอบความแปลกใหม่ (Novelty Score) และการนำทรัพยากรกลับมาใช้ซ้ำข้ามรุ่น
              </p>
            </div>

            <div className="flex space-x-2 text-xs">
              <button
                onClick={() => setDiffFamily('indigo')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
                  diffFamily !== 'water' ? 'bg-amber-500 text-slate-950' : 'bg-slate-100 text-slate-700'
                }`}
              >
                สายคราม (Indigo)
              </button>
              <button
                onClick={() => setDiffFamily('water')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
                  diffFamily === 'water' ? 'bg-blue-900 text-white' : 'bg-slate-100 text-slate-700'
                }`}
              >
                สายน้ำ (Water)
              </button>
            </div>
          </div>

          {/* Diff Matrix Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 border-b border-slate-200">
                  <th className="p-3.5 font-bold">หัวข้อการเปรียบเทียบ</th>
                  <th className="p-3.5 font-bold">GEN 1 (รุ่นตั้งต้น 2566)</th>
                  <th className="p-3.5 font-bold">GEN 2 (รุ่นขยายผล 2567)</th>
                  <th className="p-3.5 font-bold">GEN 3 / แผนพัฒนา (2568)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="p-3.5 font-bold text-slate-900 bg-slate-50/70">คณะ & สาขาวิชา</td>
                  <td className="p-3.5 text-slate-700">วิศวกรรมเครื่องกล & ไฟฟ้า (ME/EE)</td>
                  <td className="p-3.5 text-slate-700">วิทยาการคอมพิวเตอร์ (CS)</td>
                  <td className="p-3.5 text-slate-700">วิศวกรรมคอมพิวเตอร์ & เครื่องกล (CPE/ME)</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-bold text-slate-900 bg-slate-50/70">สถาปัตยกรรมหลัก</td>
                  <td className="p-3.5 text-slate-700">Embedded IoT + เซ็นเซอร์ pH/Temp</td>
                  <td className="p-3.5 text-slate-700">Web App + YOLOv8 Deep Learning</td>
                  <td className="p-3.5 text-slate-700">Edge AI + Autonomous Drone Hardware</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-bold text-slate-900 bg-slate-50/70">ทรัพยากรที่สืบทอด (Reused Assets)</td>
                  <td className="p-3.5 text-slate-500 font-mono">- (สารตั้งต้น)</td>
                  <td className="p-3.5 text-emerald-800 font-medium bg-emerald-50/40">✓ Dataset ค่าสีคราม 1,200 ตัวอย่างจาก Gen 1</td>
                  <td className="p-3.5 text-emerald-800 font-medium bg-emerald-50/40">✓ โมเดล AI และ API จาก Gen 2</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-bold text-slate-900 bg-slate-50/70">นวัตกรรมใหม่ (New Inventions)</td>
                  <td className="p-3.5 text-slate-800">กล่องหมักครามควบคุมอุณหภูมิอัตโนมัติ</td>
                  <td className="p-3.5 text-slate-800">ระบบจำแนกเฉดสีครามตามมาตรฐาน มอก.</td>
                  <td className="p-3.5 text-slate-800">โดรนบินตรวจความสมบูรณ์ต้นครามรายแปลง</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-bold text-slate-900 bg-slate-50/70">คะแนนความแปลกใหม่ (Novelty Score)</td>
                  <td className="p-3.5 font-bold text-slate-800">4.5 / 5.0</td>
                  <td className="p-3.5 font-bold text-amber-700">4.8 / 5.0</td>
                  <td className="p-3.5 font-bold text-purple-700">4.9 / 5.0</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
