'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
  ArrowRight,
  PencilLine,
  Trash2,
  Loader2
} from 'lucide-react';
import { Project } from '@/types/dna';
import { useAuthGate } from '@/hooks/useAuthGate';
import { getMyProjectIds } from '@/hooks/useMyProjects';

// Small row used in the resource availability summary card
const ResourceRow: React.FC<{ icon: React.ReactNode; label: string; available: boolean | undefined }> = ({ icon, label, available }) => (
  <div className={`flex items-center justify-between text-sm ${available ? 'text-slate-100' : 'text-slate-500'}`}>
    <span className="flex items-center space-x-2 min-w-0">
      <span className={available ? '' : 'opacity-40'}>{icon}</span>
      <span className="truncate">{label}</span>
    </span>
    <span
      className={`text-xs font-bold px-2 py-0.5 rounded-full shrink-0 ${
        available ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-500'
      }`}
    >
      {available ? 'มี' : '—'}
    </span>
  </div>
);

interface ProjectDetailDrawerProps {
  project: Project;
  onClose: () => void;
  onOpenQuickModal: (project: Project) => void;
  onOpenInceptionStudio: (project: Project) => void;
  onViewLineage: (project: Project) => void;
  isFavorite: boolean;
  onToggleFavorite: (projectId: string) => void;
  /** Owner-only: permanently delete this project (called after confirmation). */
  onDelete?: (project: Project) => Promise<void> | void;
}

export const ProjectDetailDrawer: React.FC<ProjectDetailDrawerProps> = ({
  project,
  onClose,
  onOpenQuickModal,
  onOpenInceptionStudio,
  onViewLineage,
  isFavorite,
  onToggleFavorite,
  onDelete
}) => {
  // Two-step delete confirmation so a single stray click can't destroy data
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  // Resource availability flags for the sidebar summary
  const hasCode = project.assets?.some(a => a.asset_type === 'code_repo') || Boolean(project.dna_card?.repository_url);
  const hasDataset = project.assets?.some(a => a.asset_type === 'dataset');
  const hasHardware = project.assets?.some(a => a.asset_type === 'cad_blueprint' || a.asset_type === 'circuit_schematic') || Boolean(project.dna_card?.hardware_specs);
  const hasModel = project.assets?.some(a => a.asset_type === 'trained_model');

  // Bookmark & downloads require login
  const { requireLogin } = useAuthGate();

  // Show the edit shortcut only for projects this visitor created.
  // Derived at render time instead of an effect: the drawer mounts only
  // from user interaction (never server-rendered), so reading localStorage
  // here is safe and skips a cascading re-render.
  const isOwner = getMyProjectIds().includes(project.id);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <>
      {/* Full-Screen Detail Page */}
      <div
        className="fixed inset-0 w-full h-full bg-slate-100 z-50 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-3 duration-200"
        role="dialog"
        aria-modal="true"
      >

      {/* Top Header */}
      <div className="px-4 sm:px-6 py-3 flex items-center justify-between bg-slate-950 text-white shrink-0 border-b border-slate-800">
        <div className="flex items-center space-x-2 min-w-0">
          <span className="px-2.5 py-1 bg-amber-500 text-slate-950 font-mono text-xs font-bold rounded-md shrink-0">
            {project.department?.code || 'KU CSC'}
          </span>
          <span className="text-xs text-slate-400 font-medium hidden md:inline truncate">
            พิมพ์เขียวโครงงาน (DNA Blueprint) • มก.ฉกส.
          </span>
        </div>

        <div className="flex items-center space-x-1.5">
          <button
            onClick={() => {
              if (requireLogin('/')) onToggleFavorite(project.id);
            }}
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
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition-colors flex items-center space-x-1.5"
            title="กลับไปหน้ารวมโครงการ"
            aria-label="Close detail page"
          >
            <X className="w-4 h-4" />
            <span className="text-xs font-semibold hidden sm:inline">ปิด</span>
          </button>
        </div>
      </div>

      {/* Main Scrollable Body */}
      <div className="flex-1 overflow-y-auto">

        {/* Hero Banner: full-width cover with title overlay */}
        <div className="relative h-64 sm:h-80 md:h-96 w-full bg-slate-900">
          {project.cover_image_url ? (
            <Image
              src={project.cover_image_url}
              alt={project.title_th}
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-950 text-slate-600">
              <Layers className="w-16 h-16 opacity-30" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent pointer-events-none" />

          {/* Title block pinned to bottom of hero */}
          <div className="absolute inset-x-0 bottom-0 p-5 sm:p-8 lg:p-10">
            <div className="max-w-6xl mx-auto w-full">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="px-2.5 py-1 bg-amber-500 text-slate-950 font-mono text-xs font-bold rounded-md">
                  {project.department?.code || 'KU CSC'}
                </span>
                <span className="px-2 py-1 text-xs font-semibold text-white bg-white/10 backdrop-blur-sm border border-white/20 rounded-md">
                  ปีการศึกษา {project.academic_year}
                </span>
                <span className="hidden sm:inline px-2 py-1 text-xs font-medium text-slate-200 bg-black/40 backdrop-blur-sm border border-white/10 rounded-md">
                  {project.department?.faculty?.name_th}
                </span>
              </div>
              <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight">
                {project.title_th}
              </h1>
              <p className="mt-2 text-sm sm:text-base text-slate-300 font-medium max-w-3xl">
                {project.title_en}
              </p>
            </div>
          </div>
        </div>

        {/* Two-column content area */}
        <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-8 grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-start">

        {/* ── Main Column ── */}
        <div className="lg:col-span-2 min-w-0 space-y-5 sm:space-y-6">

        {/* Abstract */}
        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6">
          <h2 className="text-sm font-bold uppercase tracking-wide text-amber-700">
            บทคัดย่อ (Abstract)
          </h2>
          <p className="mt-3 text-[15px] sm:text-base leading-relaxed text-slate-700">
            {project.abstract_th}
          </p>
        </section>

        {/* DNA Problem Statement */}
        {project.dna_card?.problem_statement && (
          <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6">
            <h2 className="text-sm font-bold uppercase tracking-wide text-amber-700">
              โจทย์ปัญหาหลัก (Core Problem Statement)
            </h2>
            <p className="mt-3 text-[15px] leading-relaxed text-slate-800 border-l-4 border-amber-500 pl-4 py-1.5 bg-amber-50/60 rounded-r-lg">
              {project.dna_card.problem_statement}
            </p>
          </section>
        )}

        {/* Tech Stack */}
        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6">
          <h2 className="text-sm font-bold uppercase tracking-wide text-amber-700">
            สแต็กเทคโนโลยี (Tech Stack & Architecture)
          </h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {project.dna_card?.tech_stack?.map((tech, idx) => (
              <span
                key={idx}
                className="px-3 py-1.5 text-sm font-mono font-medium bg-slate-100 text-slate-800 rounded-lg border border-slate-200"
              >
                {tech}
              </span>
            ))}
          </div>
          {project.dna_card?.hardware_specs && (
            <p className="text-sm text-slate-600 mt-4 leading-relaxed pt-4 border-t border-slate-100">
              <span className="font-bold text-slate-800">สเปกฮาร์ดแวร์:</span> {project.dna_card.hardware_specs}
            </p>
          )}
        </section>

        {/* Key Outcomes */}
        {project.dna_card?.key_outcomes && project.dna_card.key_outcomes.length > 0 && (
          <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6">
            <h2 className="text-sm font-bold uppercase tracking-wide text-amber-700">
              ผลสัมฤทธิ์และผลการทดสอบ (Key Outcomes)
            </h2>
            <ul className="mt-3 space-y-2.5">
              {project.dna_card.key_outcomes.map((out, i) => (
                <li key={i} className="flex items-start space-x-2.5 text-[15px] leading-relaxed text-slate-700">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{out}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Extension Gaps */}
        <section className="bg-amber-50 p-5 sm:p-6 rounded-2xl border border-amber-300 space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center space-x-2 text-base sm:text-lg font-bold text-amber-950">
              <GitBranch className="w-5 h-5 text-amber-700 shrink-0" />
              <span>ช่องว่างสำหรับต่อยอด (Extension Gaps)</span>
            </div>
            <span className="text-xs bg-amber-500 text-slate-950 font-bold px-2.5 py-1 rounded-full shrink-0">
              {project.gaps?.length || 0} ช่องว่าง
            </span>
          </div>

          {project.gaps && project.gaps.length > 0 ? (
            <div className="space-y-3">
              {project.gaps.map((gap, idx) => (
                <div key={idx} className="bg-white p-4 rounded-xl border border-amber-200">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-sm sm:text-[15px] font-bold text-slate-900">{gap.gap_title}</h3>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full shrink-0 ${
                      gap.difficulty_level === 'Easy' ? 'bg-emerald-100 text-emerald-800' :
                      gap.difficulty_level === 'Medium' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {gap.difficulty_level}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">
                    {gap.gap_description}
                  </p>
                  <div className="mt-2.5 text-xs font-semibold text-amber-800">
                    แนะนำ: {gap.recommended_tech.join(', ')}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500 italic">
              พร้อมให้ใช้ AI สกัดข้อเสนอแนะในการต่อยอดแบบสด
            </p>
          )}
        </section>

        {/* Reusable Assets */}
        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6">
          <h2 className="text-sm font-bold uppercase tracking-wide text-amber-700">
            ทรัพยากรที่นำมาใช้ซ้ำได้ (Reusable Assets)
          </h2>
          <div className="mt-3 grid grid-cols-1 gap-2.5">
            {project.assets && project.assets.length > 0 ? (
              project.assets.map((asset) => (
                <div
                  key={asset.id}
                  className="flex items-center justify-between gap-3 p-3.5 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors"
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    {asset.asset_type === 'code_repo' && <FileCode className="w-5 h-5 text-amber-600 shrink-0" />}
                    {asset.asset_type === 'dataset' && <Database className="w-5 h-5 text-emerald-600 shrink-0" />}
                    {asset.asset_type === 'circuit_schematic' && <Cpu className="w-5 h-5 text-blue-600 shrink-0" />}
                    {asset.asset_type === 'trained_model' && <Award className="w-5 h-5 text-purple-600 shrink-0" />}
                    <div className="min-w-0">
                      <div className="text-sm font-bold text-slate-900 truncate">{asset.title}</div>
                      <div className="text-xs text-slate-400">{asset.file_size || 'Open Source'} • {asset.license || 'Academic'}</div>
                    </div>
                  </div>

                  <a
                    href={asset.resource_url}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => {
                      if (!requireLogin('/')) e.preventDefault();
                    }}
                    className="p-2 bg-white hover:bg-amber-500 hover:text-slate-950 text-slate-600 rounded-lg border border-slate-200 transition-colors shrink-0"
                    title="ดาวน์โหลด / เปิดลิงก์"
                  >
                    <Download className="w-4 h-4" />
                  </a>
                </div>
              ))
            ) : (
              <div className="text-sm text-slate-400 italic p-4 bg-slate-50 rounded-xl text-center">
                มีลิงก์ซอร์สโค้ดและรายงานฉบับสมบูรณ์
              </div>
            )}
          </div>
        </section>

        </div>

        {/* ── Sidebar ── */}
        <aside className="min-w-0 space-y-5 lg:sticky lg:top-0">

          {/* Project Info Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-100">
              <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500">ข้อมูลโครงการ</h2>
            </div>
            <dl className="px-5 py-3 divide-y divide-slate-100 text-sm">
              <div className="py-2.5 flex items-start justify-between gap-3">
                <dt className="text-slate-500 shrink-0">คณะ</dt>
                <dd className="font-semibold text-slate-800 text-right leading-snug">{project.department?.faculty?.name_th || '—'}</dd>
              </div>
              <div className="py-2.5 flex items-start justify-between gap-3">
                <dt className="text-slate-500 shrink-0">สาขาวิชา</dt>
                <dd className="font-semibold text-slate-800 text-right leading-snug">{project.department?.name_th || '—'}</dd>
              </div>
              <div className="py-2.5 flex items-start justify-between gap-3">
                <dt className="text-slate-500 shrink-0">ที่ปรึกษา</dt>
                <dd className="font-semibold text-slate-800 text-right leading-snug">{project.dna_card?.advisor_name || '—'}</dd>
              </div>
              {project.dna_card?.student_authors && project.dna_card.student_authors.length > 0 && (
                <div className="py-2.5 flex items-start justify-between gap-3">
                  <dt className="text-slate-500 shrink-0">ผู้จัดทำ</dt>
                  <dd className="font-semibold text-slate-800 text-right leading-snug">
                    {project.dna_card.student_authors.map(a => a.name).join(', ')}
                  </dd>
                </div>
              )}
              <div className="py-2.5 flex items-start justify-between gap-3">
                <dt className="text-slate-500 shrink-0">ปีการศึกษา</dt>
                <dd className="font-semibold text-slate-800 text-right">{project.academic_year}</dd>
              </div>
            </dl>
          </div>

          {/* Resource Availability Card */}
          <div className="bg-slate-900 rounded-2xl shadow-sm p-5 space-y-3">
            <h2 className="text-sm font-bold uppercase tracking-wide text-slate-400">ทรัพยากรที่มีให้ใช้</h2>
            <ResourceRow icon={<FileCode className="w-4 h-4 text-amber-400" />} label="ซอร์สโค้ด / GitHub" available={hasCode} />
            <ResourceRow icon={<Database className="w-4 h-4 text-emerald-400" />} label="ชุดข้อมูล Dataset" available={hasDataset} />
            <ResourceRow icon={<Cpu className="w-4 h-4 text-blue-400" />} label="แบบวงจร / ฮาร์ดแวร์" available={hasHardware} />
            <ResourceRow icon={<Award className="w-4 h-4 text-purple-400" />} label="โมเดล AI พร้อมใช้" available={hasModel} />
          </div>
        </aside>

        </div>
      </div>

      {/* Sticky Bottom Actions */}
      <div className="p-4 bg-slate-900 border-t border-slate-800 space-y-2 shrink-0">
        <button
          onClick={() => onOpenInceptionStudio(project)}
          className="w-full py-2.5 px-4 bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-slate-950 font-bold text-sm rounded-xl shadow-sm flex items-center justify-center space-x-2 transition-colors"
        >
          <GitFork className="w-4 h-4" />
          <span>เริ่มต้นต่อยอดโครงงานนี้ (Inception Studio)</span>
          <ArrowRight className="w-4 h-4 ml-1" />
        </button>

        {/* Owner-only: edit / delete this project */}
        {isOwner && (
          <div className="grid grid-cols-2 gap-2">
            <Link
              href={`/edit?id=${project.id}`}
              className="py-2 px-3 bg-transparent hover:bg-slate-800 text-amber-300 text-xs font-semibold rounded-lg border border-slate-700 flex items-center justify-center space-x-1.5 transition-colors"
            >
              <PencilLine className="w-3.5 h-3.5" />
              <span>แก้ไขโครงงาน</span>
            </Link>

            <button
              onClick={async () => {
                if (!onDelete) return;
                if (!confirmingDelete) {
                  setConfirmingDelete(true);
                  return;
                }
                setIsDeleting(true);
                try {
                  await onDelete(project);
                } finally {
                  setIsDeleting(false);
                  setConfirmingDelete(false);
                }
              }}
              onBlur={() => setConfirmingDelete(false)}
              disabled={isDeleting}
              aria-label="ลบโครงงานถาวร"
              className={`py-2 px-3 text-xs font-semibold rounded-lg border flex items-center justify-center space-x-1.5 transition-colors disabled:opacity-50 ${
                confirmingDelete
                  ? 'bg-red-600 hover:bg-red-500 text-white border-red-500'
                  : 'bg-transparent hover:bg-red-950/40 text-red-400 border-slate-700 hover:border-red-800'
              }`}
            >
              {isDeleting ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : confirmingDelete ? (
                <>
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>แน่ใจนะ — ลบเลย</span>
                </>
              ) : (
                <>
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>ลบโครงงาน</span>
                </>
              )}
            </button>
          </div>
        )}

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
    </>
  );
};
