'use client';

import React from 'react';
import { 
  X, 
  Sparkles, 
  Download, 
  GitFork, 
  ExternalLink, 
  Github, 
  Cpu, 
  Database, 
  FileCode, 
  Users, 
  Award, 
  AlertCircle, 
  ChevronRight,
  Share2,
  CheckCircle2,
  Bookmark
} from 'lucide-react';
import { Project } from '@/types/dna';

interface ProjectDetailDrawerProps {
  project: Project | null;
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
  if (!project) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-full md:w-[480px] lg:w-[540px] bg-white shadow-2xl z-40 border-l border-slate-200 flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-300">
      
      {/* Top Header */}
      <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-white/95 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center space-x-2">
          <span className="px-2.5 py-1 bg-amber-500 text-slate-950 text-xs font-extrabold rounded-lg">
            DNA CARD
          </span>
          <span className="text-xs text-slate-500 font-medium">
            {project.department?.code} • ปี {project.academic_year}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => onToggleFavorite(project.id)}
            className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all ${
              isFavorite
                ? 'bg-amber-100 border-amber-300 text-amber-700'
                : 'border-slate-200 text-slate-400 hover:text-slate-700'
            }`}
            title="บันทึกรายการโปรด"
          >
            <Bookmark className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
          </button>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Scrollable Content Body */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        
        {/* Cover Image & Titles */}
        <div>
          {project.cover_image_url && (
            <div className="w-full h-48 rounded-2xl overflow-hidden mb-4 border border-slate-200 shadow-xs">
              <img
                src={project.cover_image_url}
                alt={project.title_th}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <h2 className="text-xl font-black text-slate-900 leading-snug">
            {project.title_th}
          </h2>
          <p className="text-xs font-medium text-slate-400 mt-1">
            {project.title_en}
          </p>

          {/* SDG Badges */}
          <div className="flex flex-wrap gap-1.5 mt-3">
            {project.sdgs?.map((sdg) => (
              <span
                key={sdg.id}
                style={{ backgroundColor: sdg.color_hex }}
                className="text-white text-xs font-bold px-2.5 py-1 rounded-md shadow-xs"
              >
                {sdg.code}: {sdg.name_th}
              </span>
            ))}
          </div>
        </div>

        {/* Problem Statement Card */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2">
          <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-700">
            <AlertCircle className="w-4 h-4 text-amber-600" />
            <span>โจทย์ปัญหาที่ต้องการแก้ไข (Problem Statement)</span>
          </div>
          <p className="text-xs text-slate-700 leading-relaxed">
            {project.dna_card?.problem_statement || project.abstract_th}
          </p>
          
          {/* Target Users */}
          {project.dna_card?.target_users && project.dna_card.target_users.length > 0 && (
            <div className="pt-2 border-t border-slate-200/60 mt-2">
              <span className="text-[11px] font-bold text-slate-500">กลุ่มเป้าหมายผู้ใช้งาน:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {project.dna_card.target_users.map((u, i) => (
                  <span key={i} className="text-[11px] bg-white text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                    {u}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Tech Stack & Architecture */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            เทคโนโลยีและสถาปัตยกรรม (Tech Stack)
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {project.dna_card?.tech_stack?.map((tech, i) => (
              <span
                key={i}
                className="px-2.5 py-1 bg-slate-900 text-amber-400 font-mono text-xs font-semibold rounded-lg shadow-2xs"
              >
                {tech}
              </span>
            ))}
          </div>

          {project.dna_card?.hardware_specs && (
            <div className="mt-2 text-xs bg-amber-50 text-amber-900 p-2.5 rounded-xl border border-amber-200/70">
              <span className="font-bold">ฮาร์ดแวร์ / อุปกรณ์:</span> {project.dna_card.hardware_specs}
            </div>
          )}
        </div>

        {/* Key Outcomes */}
        {project.dna_card?.key_outcomes && project.dna_card.key_outcomes.length > 0 && (
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              ผลสัมฤทธิ์และผลการทดสอบ (Key Outcomes)
            </h3>
            <ul className="space-y-1.5">
              {project.dna_card.key_outcomes.map((out, i) => (
                <li key={i} className="flex items-start space-x-2 text-xs text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{out}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* AI Extension Opportunities (Gaps) */}
        <div className="bg-gradient-to-br from-amber-500/10 via-amber-50 to-white p-4 rounded-2xl border border-amber-300 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-1.5 text-xs font-bold text-amber-900">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>AI วิเคราะห์ช่องว่างสำหรับต่อยอด (Extension Gaps)</span>
            </div>
            <span className="text-[10px] bg-amber-200 text-amber-900 font-bold px-2 py-0.5 rounded-full">
              {project.gaps?.length || 0} ช่องว่าง
            </span>
          </div>

          {project.gaps && project.gaps.length > 0 ? (
            <div className="space-y-3 mt-2">
              {project.gaps.map((gap, idx) => (
                <div key={idx} className="bg-white p-3 rounded-xl border border-amber-200 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-900">{gap.gap_title}</h4>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      gap.difficulty_level === 'Easy' ? 'bg-emerald-100 text-emerald-800' :
                      gap.difficulty_level === 'Medium' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {gap.difficulty_level}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                    {gap.gap_description}
                  </p>
                  <div className="mt-2 flex items-center justify-between text-[10px]">
                    <span className="text-amber-700 font-medium">แนะนำ: {gap.recommended_tech.join(', ')}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500 italic mt-1">
              พร้อมให้ใช้ AI สกัดข้อเสนอแนะในการต่อยอดแบบสด
            </p>
          )}
        </div>

        {/* Reusable Assets Box */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
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
                      <div className="text-xs font-bold text-slate-800">{asset.title}</div>
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

        {/* Authors & Advisor */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div>
            <span className="font-bold text-slate-700">อาจารย์ที่ปรึกษา:</span> {project.dna_card?.advisor_name || 'คณะวิทยาศาสตร์และวิศวกรรมศาสตร์'}
          </div>
          {project.dna_card?.student_authors && project.dna_card.student_authors.length > 0 && (
            <div className="text-right">
              <span className="font-bold text-slate-700">ผู้จัดทำ:</span> {project.dna_card.student_authors[0].name}
            </div>
          )}
        </div>

      </div>

      {/* Bottom Sticky Action Footer */}
      <div className="p-4 bg-slate-900 border-t border-slate-800 space-y-2 sticky bottom-0 z-20">
        
        {/* Primary Action Button: Inception Studio */}
        <button
          onClick={() => onOpenInceptionStudio(project)}
          className="w-full py-3 px-4 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-black text-sm rounded-xl shadow-lg flex items-center justify-center space-x-2 transition-all active:scale-98"
        >
          <Sparkles className="w-4 h-4" />
          <span>🚀 เริ่มต้นต่อยอดโครงงานนี้ (Inception Studio)</span>
        </button>

        {/* Secondary Quick Action Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => onOpenQuickModal(project)}
            className="py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 flex items-center justify-center space-x-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-amber-400" />
            <span>โหลดทรัพยากร / ติดต่อ</span>
          </button>

          <button
            onClick={() => onViewLineage(project)}
            className="py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 flex items-center justify-center space-x-1.5 transition-colors"
          >
            <GitFork className="w-3.5 h-3.5 text-amber-400" />
            <span>ดูสายวิวัฒนาการ</span>
          </button>
        </div>
      </div>

    </div>
  );
};
