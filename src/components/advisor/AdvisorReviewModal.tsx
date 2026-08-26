'use client';

import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  ExternalLink, 
  FileCode, 
  Database, 
  Cpu, 
  Layers, 
  Send, 
  RotateCcw, 
  Users, 
  Building, 
  Calendar,
  Check,
  ShieldCheck,
  AlertTriangle,
  GitFork
} from 'lucide-react';
import { Project } from '@/types/dna';

interface AdvisorReviewModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
  onApprove: (projectId: string, advisorNote: string) => Promise<void>;
  onRequestRevision: (projectId: string, advisorNote: string) => Promise<void>;
}

const QUICK_FEEDBACK_TAGS = [
  '✓ พิมพ์เขียว DNA มีความสมบูรณ์ตรงตามมาตรฐานหลักสูตร',
  '✓ อนุญาตให้เปิดเผยแพร่ Source Code และพิมพ์เขียวสู่วงวิชาการ',
  '⚠️ กรุณาเปิดสิทธิ์ Public ใน GitHub Repository ก่อนการเผยแพร่',
  '⚠️ กรุณาอธิบายข้อจำกัดของฮาร์ดแวร์ (Limitations) ให้ชัดเจนยิ่งขึ้น',
  '⚠️ ขอให้เพิ่มคำอธิบายชุดข้อมูล (Dataset Metadata) และขนาดตัวอย่าง'
];

export const AdvisorReviewModal: React.FC<AdvisorReviewModalProps> = ({
  project,
  isOpen,
  onClose,
  onApprove,
  onRequestRevision
}) => {
  const [advisorNote, setAdvisorNote] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<'approved' | 'revision' | null>(null);

  if (!isOpen || !project) return null;

  const dna = project.dna_card;
  const hasCode = Boolean(dna?.repository_url || project.assets?.some(a => a.asset_type === 'code_repo'));
  const hasDataset = Boolean(dna?.dataset_description || project.assets?.some(a => a.asset_type === 'dataset'));
  const hasHardware = Boolean(dna?.hardware_specs || project.assets?.some(a => a.asset_type === 'circuit_schematic'));
  const hasGaps = Boolean((project.gaps?.length || 0) > 0);

  // Compute AI Pre-Audit Health Score
  let auditScore = 60;
  if (dna?.problem_statement && dna.problem_statement.length > 30) auditScore += 10;
  if (dna?.tech_stack && dna.tech_stack.length >= 3) auditScore += 10;
  if (hasCode) auditScore += 10;
  if (hasDataset || hasHardware) auditScore += 5;
  if (hasGaps) auditScore += 5;
  auditScore = Math.min(100, auditScore);

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => {
      const next = prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag];
      setAdvisorNote(next.join('\n\n'));
      return next;
    });
  };

  const handleApproveAction = async () => {
    try {
      setIsProcessing(true);
      await onApprove(project.id, advisorNote);
      setActionSuccess('approved');
      setTimeout(() => {
        setActionSuccess(null);
        onClose();
      }, 1400);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRevisionAction = async () => {
    if (!advisorNote.trim()) {
      alert('กรุณากรอกข้อเสนอแนะหรือเลือกแท็กคำแนะนำก่อนส่งกลับให้นิสิตแก้ไข');
      return;
    }
    try {
      setIsProcessing(true);
      await onRequestRevision(project.id, advisorNote);
      setActionSuccess('revision');
      setTimeout(() => {
        setActionSuccess(null);
        onClose();
      }, 1400);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-2xl border border-slate-200/90 shadow-2xl flex flex-col overflow-hidden text-slate-900 font-sans"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* 1. Header with Status & Close */}
        <div className="px-6 py-4 border-b border-slate-200/80 bg-slate-50/80 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-bold shadow-xs">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="font-display text-base font-bold text-slate-900">
                  ตรวจสอบและอนุมัติพิมพ์เขียว DNA โครงงาน
                </h2>
                <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-amber-100 text-amber-950 border border-amber-300 rounded-md">
                  รออาจารย์อนุมัติ (Pending Triage)
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                มหาวิทยาลัยเกษตรศาสตร์ วิทยาเขตเฉลิมพระเกียรติ จ.สกลนคร
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 flex items-center justify-center transition-colors"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 2. Scrollable Body: Split DNA Inspector & AI Pre-Audit */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Top Banner: Project Title & Student Group */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center space-x-2 text-xs font-mono text-slate-600">
                <span className="px-2 py-0.5 bg-slate-900 text-amber-300 rounded font-bold">
                  {project.department?.code || 'KU CSC'}
                </span>
                <span>{project.department?.name_th}</span>
                <span>·</span>
                <span>ปีการศึกษา {project.academic_year}</span>
              </div>
              {project.submitted_at && (
                <span className="text-[11px] text-slate-400 font-mono">
                  ยื่นเสนอเมื่อ: {new Date(project.submitted_at).toLocaleDateString('th-TH', { dateStyle: 'medium' })}
                </span>
              )}
            </div>

            <div>
              <h3 className="font-display text-lg font-bold text-slate-900 leading-snug">
                {project.title_th}
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                {project.title_en}
              </p>
            </div>

            {/* Authors */}
            <div className="pt-2 border-t border-slate-200 flex flex-wrap items-center gap-3 text-xs">
              <span className="text-slate-400 font-medium flex items-center">
                <Users className="w-3.5 h-3.5 mr-1" /> คณะผู้จัดทำ (นิสิต):
              </span>
              {dna?.student_authors && dna.student_authors.length > 0 ? (
                dna.student_authors.map((student, i) => (
                  <span key={i} className="inline-flex items-center space-x-1 px-2.5 py-1 bg-white rounded-lg border border-slate-200 text-slate-800 font-medium shadow-2xs">
                    <span>{student.name}</span>
                    <span className="text-slate-400 font-mono text-[11px]">({student.student_id})</span>
                    {student.role && (
                      <span className="text-[10px] text-amber-700 bg-amber-50 px-1 rounded ml-1 font-mono">{student.role}</span>
                    )}
                  </span>
                ))
              ) : (
                <span className="text-slate-500">กลุ่มนิสิตผู้พัฒนา</span>
              )}
            </div>
          </div>

          {/* AI Pre-Audit Integrity Banner */}
          <div className="p-4 bg-gradient-to-r from-amber-50/80 via-white to-amber-50/40 border border-amber-300/80 rounded-xl space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-xs font-bold text-amber-950 font-mono">
                <Sparkles className="w-4 h-4 text-amber-600 fill-current" />
                <span>AI AUTOMATED PRE-AUDIT INTEGRITY CHECK</span>
              </div>
              <div className="flex items-center space-x-1.5 px-2.5 py-0.5 bg-amber-500 text-slate-950 rounded-full text-xs font-bold font-mono">
                <span>ความสมบูรณ์ของ DNA: {auditScore}%</span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-xs">
              <div className={`p-2 rounded-lg border flex items-center space-x-1.5 ${hasCode ? 'bg-emerald-50 text-emerald-900 border-emerald-200' : 'bg-slate-50 text-slate-500 border-slate-200'}`}>
                <FileCode className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate text-[11px] font-medium">{hasCode ? '✓ ซอร์สโค้ดครบ' : '✗ ยังไม่มี Repo'}</span>
              </div>

              <div className={`p-2 rounded-lg border flex items-center space-x-1.5 ${hasDataset ? 'bg-emerald-50 text-emerald-900 border-emerald-200' : 'bg-slate-50 text-slate-500 border-slate-200'}`}>
                <Database className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate text-[11px] font-medium">{hasDataset ? '✓ มีชุดข้อมูล' : '✗ ไม่มี Dataset'}</span>
              </div>

              <div className={`p-2 rounded-lg border flex items-center space-x-1.5 ${hasHardware ? 'bg-emerald-50 text-emerald-900 border-emerald-200' : 'bg-slate-50 text-slate-500 border-slate-200'}`}>
                <Cpu className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate text-[11px] font-medium">{hasHardware ? '✓ มีแบบวงจร' : '— โครงงานซอฟต์แวร์'}</span>
              </div>

              <div className={`p-2 rounded-lg border flex items-center space-x-1.5 ${hasGaps ? 'bg-emerald-50 text-emerald-900 border-emerald-200' : 'bg-slate-50 text-slate-500 border-slate-200'}`}>
                <GitFork className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate text-[11px] font-medium">{hasGaps ? '✓ ระบุช่องว่างวิจัย' : '✗ ไม่มี Gaps'}</span>
              </div>
            </div>
          </div>

          {/* DNA Details Inspection Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            
            {/* Problem Statement */}
            <div className="p-3.5 bg-white border border-slate-200 rounded-xl space-y-1.5">
              <span className="font-bold text-slate-900 flex items-center">
                🎯 โจทย์และปัญหาหลักที่แก้ไข (Problem Statement):
              </span>
              <p className="text-slate-700 leading-relaxed font-sans">
                {dna?.problem_statement || project.abstract_th}
              </p>
            </div>

            {/* Tech Stack */}
            <div className="p-3.5 bg-white border border-slate-200 rounded-xl space-y-1.5">
              <span className="font-bold text-slate-900 flex items-center">
                ⚡ สแตกเทคโนโลยี (Tech Stack):
              </span>
              <div className="flex flex-wrap gap-1 pt-1">
                {dna?.tech_stack?.map((tech, i) => (
                  <span key={i} className="px-2.5 py-1 bg-slate-100 text-slate-800 rounded-md font-mono text-[11px] border border-slate-200">
                    {tech}
                  </span>
                )) || <span className="text-slate-400">ไม่ได้ระบุ</span>}
              </div>
            </div>

            {/* Key Outcomes */}
            <div className="p-3.5 bg-white border border-slate-200 rounded-xl space-y-1.5">
              <span className="font-bold text-slate-900 flex items-center">
                📊 ผลลัพธ์และตัวชี้วัดความสำเร็จ (Key Outcomes):
              </span>
              <ul className="list-disc list-inside space-y-1 text-slate-700">
                {dna?.key_outcomes?.map((out, i) => (
                  <li key={i}>{out}</li>
                )) || <li>{project.abstract_th}</li>}
              </ul>
            </div>

            {/* Limitations */}
            <div className="p-3.5 bg-white border border-slate-200 rounded-xl space-y-1.5">
              <span className="font-bold text-slate-900 flex items-center text-amber-900">
                ⚠️ ข้อจำกัดที่ต้องพัฒนาต่อ (Known Limitations):
              </span>
              <ul className="list-disc list-inside space-y-1 text-slate-700">
                {dna?.limitations && dna.limitations.length > 0 ? (
                  dna.limitations.map((lim, i) => <li key={i}>{lim}</li>)
                ) : (
                  <li className="text-slate-400 italic">นิสิตยังไม่ได้ระบุข้อจำกัดอย่างละเอียด</li>
                )}
              </ul>
            </div>

          </div>

          {/* Links & Repository Verification */}
          {dna?.repository_url && (
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2 truncate">
                <FileCode className="w-4 h-4 text-slate-600 shrink-0" />
                <span className="font-medium text-slate-600">ซอร์สโค้ดโครงงาน:</span>
                <span className="font-mono text-slate-800 truncate">{dna.repository_url}</span>
              </div>
              <a
                href={dna.repository_url}
                target="_blank"
                rel="noreferrer"
                className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-800 font-semibold rounded-lg border border-slate-200 flex items-center space-x-1 shrink-0 transition-colors shadow-2xs"
              >
                <span>เปิดดู GitHub</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </a>
            </div>
          )}

          {/* 3. Advisor Feedback & Decision Section */}
          <div className="pt-4 border-t border-slate-200 space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-900 mb-1">
                💬 ความเห็นและคำแนะนำจากอาจารย์ที่ปรึกษา (Advisor Review Note):
              </label>
              <p className="text-[11px] text-slate-500 mb-2">
                ข้อความนี้จะถูกบันทึกเป็นประวัติทางวิชาการ และส่งแจ้งเตือนไปยังกลุ่มนิสิต
              </p>
            </div>

            {/* Quick Feedback Tags */}
            <div className="flex flex-wrap gap-1.5">
              {QUICK_FEEDBACK_TAGS.map((tag, idx) => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleTagToggle(tag)}
                    className={`text-[11px] px-2.5 py-1 rounded-lg border text-left transition-all ${
                      isSelected
                        ? 'bg-amber-100 text-amber-950 border-amber-300 font-semibold'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>

            {/* Custom Notes Textarea */}
            <textarea
              value={advisorNote}
              onChange={(e) => setAdvisorNote(e.target.value)}
              placeholder="พิมพ์ข้อเสนอแนะเพิ่มเติม หรือระบุจุดที่ต้องการให้นิสิตแก้ไขก่อนการอนุมัติ..."
              rows={3}
              className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white text-slate-900 placeholder-slate-400 font-sans"
            />
          </div>

        </div>

        {/* 4. Footer Actions Bar */}
        <div className="px-6 py-4 border-t border-slate-200/90 bg-slate-50 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors shadow-2xs"
          >
            ปิดหน้าต่าง
          </button>

          <div className="flex items-center space-x-2.5">
            {/* Request Revision Button */}
            <button
              onClick={handleRevisionAction}
              disabled={isProcessing}
              className="px-4 py-2 text-xs font-bold text-rose-700 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl flex items-center space-x-1.5 transition-all shadow-2xs active:scale-98 disabled:opacity-50"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>↩ ส่งกลับให้นิสิตแก้ไข</span>
            </button>

            {/* Approve & Publish Button */}
            <button
              onClick={handleApproveAction}
              disabled={isProcessing}
              className="px-5 py-2 text-xs font-bold text-slate-950 bg-amber-500 hover:bg-amber-600 active:bg-amber-700 rounded-xl flex items-center space-x-1.5 shadow-sm transition-all active:scale-98 disabled:opacity-50"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>✓ อนุมัติและเผยแพร่สู่คลัง DNA</span>
            </button>
          </div>
        </div>

        {/* Success Alert Overlay */}
        {actionSuccess && (
          <div className="absolute inset-0 bg-white/95 flex flex-col items-center justify-center space-y-2 animate-in fade-in">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-sm">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h3 className="font-display text-base font-bold text-slate-900">
              {actionSuccess === 'approved' 
                ? 'อนุมัติและเผยแพร่โครงงานสำเร็จ!' 
                : 'ส่งข้อเสนอแนะกลับให้นิสิตเรียบร้อยแล้ว'}
            </h3>
            <p className="text-xs text-slate-500">
              {actionSuccess === 'approved' 
                ? 'โครงงานถูกบรรจุลงในคลัง DNA กลางของมหาวิทยาลัยแล้ว' 
                : 'ระบบได้แจ้งเตือนนิสิตผู้จัดทำเพื่อดำเนินการแก้ไข'}
            </p>
          </div>
        )}

      </div>
    </div>
  );
};
