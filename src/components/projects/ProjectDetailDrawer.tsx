'use client';

import React from 'react';
import { 
  X, 
  Bookmark, 
  GitFork, 
  FileCode, 
  Database, 
  Cpu, 
  Download, 
  CheckCircle2, 
  GitBranch,
  Building,
  Award,
  Layers,
  ArrowRight
} from 'lucide-react';
import { Project } from '@/types/dna';

interface ProjectDetailDrawerProps {
  project: Project;
  onClose: () => void;
  onOpenQuickModal: (project: Project) => void;
  onOpenInceptionStudio: (project: Project) => void;
  onViewLineage: (project: Project) => void;
  isFavorite: boolean;
  onToggleFavorite: (projectId: string) => void;
}

export const ProjectDetailDrawer: React.FC<ProjectDetailDrawerProps> = ({
  project,
  onClose,
  onOpenQuickModal,
  onOpenInceptionStudio,
  onViewLineage,
  isFavorite,
  onToggleFavorite
}) => {
  return (
    <div className="fixed inset-y-0 right-0 w-full max-w-xl bg-white shadow-2xl z-50 flex flex-col border-l border-slate-200 transition-colors">
      
      {/* Top Header */}
      <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-900 text-white">
        <div className="flex items-center space-x-2">
          <span className="px-2.5 py-1 bg-amber-500 text-slate-950 font-mono text-xs font-bold rounded-md">
            {project.department?.code || 'KU CSC'}
          </span>
          <span className="text-xs text-slate-300 font-medium">
            ปีการศึกษา {project.academic_year}
          </span>
        </div>

        <div className="flex items-center space-x-1.5">
          <button
            onClick={() => onToggleFavorite(project.id)}
            className={`p-2 rounded-lg transition-colors ${
              isFavorite
                ? 'bg-amber-500 text-slate-950'
                : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700'
            }`}
            title={isFavorite ? 'นำออกจากรายการโปรด' : 'บันทึกเป็นรายการโปรด'}
            aria-label="Toggle favorite"
          >
            <Bookmark className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
          
          <button
            onClick={onClose}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition-colors"
            title="ปิดหน้าต่าง"
            aria-label="Close drawer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Scrollable Body */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        
        {/* Cover Photo */}
        <div className="relative h-48 w-full rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
          {project.cover_image_url ? (
            <img
              src={project.cover_image_url}
              alt={project.title_th}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400">
              <Layers className="w-12 h-12 opacity-30" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
          <div className="absolute bottom-3 left-4 right-4 text-white">
            <span className="text-xs font-semibold px-2 py-0.5 bg-black/60 rounded-md border border-white/20">
              {project.department?.faculty?.name_th}
            </span>
          </div>
        </div>

        {/* Title Section */}
        <div>
          <h2 className="font-display text-xl font-bold text-slate-900 leading-snug">
            {project.title_th}
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-1">
            {project.title_en}
          </p>
        </div>

        {/* Abstract */}
        <div className="space-y-1.5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            บทคัดย่อ (Abstract)
          </h3>
          <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            {project.abstract_th}
          </p>
        </div>

        {/* DNA Problem Statement */}
        {project.dna_card?.problem_statement && (
          <div className="space-y-1.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              โจทย์ปัญหาหลัก (Core Problem Statement)
            </h3>
            <p className="text-xs text-slate-800 leading-relaxed border-l-3 border-amber-500 pl-3.5 py-1 bg-amber-50/50 rounded-r-lg">
              {project.dna_card.problem_statement}
            </p>
          </div>
        )}

        {/* Tech Stack */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            สแต็กเทคโนโลยี (Tech Stack & Architecture)
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {project.dna_card?.tech_stack?.map((tech, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 text-xs font-mono font-medium bg-slate-100 text-slate-800 rounded-md border border-slate-200"
              >
                {tech}
              </span>
            ))}
          </div>
          {project.dna_card?.hardware_specs && (
            <p className="text-xs text-slate-600 mt-1">
              <span className="font-semibold text-slate-700">สเปกฮาร์ดแวร์:</span> {project.dna_card.hardware_specs}
            </p>
          )}
        </div>

        {/* Key Outcomes */}
        {project.dna_card?.key_outcomes && project.dna_card.key_outcomes.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              ผลสัมฤทธิ์และผลการทดสอบ (Key Outcomes)
            </h3>
            <ul className="space-y-2">
              {project.dna_card.key_outcomes.map((out, i) => (
                <li key={i} className="flex items-start space-x-2 text-xs text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{out}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Extension Gaps */}
        <div className="bg-amber-50/70 p-4 rounded-xl border border-amber-200 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1.5 text-xs font-bold text-amber-950">
              <GitBranch className="w-4 h-4 text-amber-700" />
              <span>ช่องว่างสำหรับต่อยอด (Extension Gaps)</span>
            </div>
            <span className="text-[10px] bg-amber-200 text-amber-900 font-bold px-2 py-0.5 rounded">
              {project.gaps?.length || 0} ช่องว่าง
            </span>
          </div>

          {project.gaps && project.gaps.length > 0 ? (
            <div className="space-y-2.5">
              {project.gaps.map((gap, idx) => (
                <div key={idx} className="bg-white p-3 rounded-lg border border-amber-200">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-900">{gap.gap_title}</h4>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                      gap.difficulty_level === 'Easy' ? 'bg-emerald-100 text-emerald-800' :
                      gap.difficulty_level === 'Medium' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {gap.difficulty_level}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                    {gap.gap_description}
                  </p>
                  <div className="mt-2 text-[10px] text-amber-800 font-medium">
                    แนะนำ: {gap.recommended_tech.join(', ')}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500 italic">
              พร้อมให้ใช้ AI สกัดข้อเสนอแนะในการต่อยอดแบบสด
            </p>
          )}
        </div>

        {/* Reusable Assets */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            ทรัพยากรที่นำมาใช้ซ้ำได้ (Reusable Assets)
          </h3>
          <div className="grid grid-cols-1 gap-2">
            {project.assets && project.assets.length > 0 ? (
              project.assets.map((asset) => (
                <div
                  key={asset.id}
                  className="flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors"
                >
                  <div className="flex items-center space-x-2.5">
                    {asset.asset_type === 'code_repo' && <FileCode className="w-4 h-4 text-amber-600" />}
                    {asset.asset_type === 'dataset' && <Database className="w-4 h-4 text-emerald-600" />}
                    {asset.asset_type === 'circuit_schematic' && <Cpu className="w-4 h-4 text-blue-600" />}
                    {asset.asset_type === 'trained_model' && <Award className="w-4 h-4 text-purple-600" />}
                    <div>
                      <div className="text-xs font-bold text-slate-900">{asset.title}</div>
                      <div className="text-[10px] text-slate-400">{asset.file_size || 'Open Source'} • {asset.license || 'Academic'}</div>
                    </div>
                  </div>

                  <a
                    href={asset.resource_url}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 bg-white hover:bg-amber-500 hover:text-slate-950 text-slate-600 rounded-lg border border-slate-200 transition-colors"
                    title="ดาวน์โหลด / เปิดลิงก์"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </a>
                </div>
              ))
            ) : (
              <div className="text-xs text-slate-400 italic p-3 bg-slate-50 rounded-xl text-center">
                มีลิงก์ซอร์สโค้ดและรายงานฉบับสมบูรณ์
              </div>
            )}
          </div>
        </div>

        {/* Authors & Faculty */}
        <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <div>
            <span className="font-semibold text-slate-700">ที่ปรึกษา:</span> {project.dna_card?.advisor_name || project.department?.faculty?.name_th}
          </div>
          {project.dna_card?.student_authors && project.dna_card.student_authors.length > 0 && (
            <div className="text-right">
              <span className="font-semibold text-slate-700">ผู้จัดทำ:</span> {project.dna_card.student_authors[0].name}
            </div>
          )}
        </div>

      </div>

      {/* Sticky Bottom Actions */}
      <div className="p-4 bg-slate-900 border-t border-slate-800 space-y-2 sticky bottom-0 z-20">
        <button
          onClick={() => onOpenInceptionStudio(project)}
          className="w-full py-2.5 px-4 bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-slate-950 font-bold text-sm rounded-xl shadow-sm flex items-center justify-center space-x-2 transition-colors"
        >
          <GitFork className="w-4 h-4" />
          <span>เริ่มต้นต่อยอดโครงงานนี้ (Inception Studio)</span>
          <ArrowRight className="w-4 h-4 ml-1" />
        </button>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => onOpenQuickModal(project)}
            className="py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 flex items-center justify-center space-x-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-amber-400" />
            <span>โหลดทรัพยากร</span>
          </button>

          <button
            onClick={() => onViewLineage(project)}
            className="py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 flex items-center justify-center space-x-1.5 transition-colors"
          >
            <GitFork className="w-3.5 h-3.5 text-amber-400" />
            <span>ดูสายวิวัฒนาการ</span>
          </button>
        </div>
      </div>

    </div>
  );
};
