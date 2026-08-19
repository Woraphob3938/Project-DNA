'use client';

import React, { useState } from 'react';
import { 
  X, 
  Download, 
  Github, 
  Mail, 
  Copy, 
  Check, 
  FileCode, 
  Database, 
  Cpu, 
  Award,
  BookOpen,
  UserCheck
} from 'lucide-react';
import { Project } from '@/types/dna';

interface QuickResourceModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

export const QuickResourceModal: React.FC<QuickResourceModalProps> = ({
  project,
  isOpen,
  onClose
}) => {
  const [copiedText, setCopiedText] = useState<string | null>(null);

  if (!isOpen || !project) return null;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(key);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const citationText = `${project.dna_card?.student_authors?.[0]?.name || 'คณะผู้จัดทำ'}. (${project.academic_year}). ${project.title_th} (${project.title_en}). โครงงานนิสิตปริญญาตรี คณะวิทยาศาสตร์และวิศวกรรมศาสตร์ มหาวิทยาลัยเกษตรศาสตร์ วิทยาเขตเฉลิมพระเกียรติ จังหวัดสกลนคร.`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-slate-200 flex flex-col justify-between">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div>
            <span className="text-xs font-black px-2.5 py-1 bg-amber-500 text-slate-950 rounded-lg">
              QUICK RESOURCES & HANDOFF
            </span>
            <h3 className="text-lg font-bold text-slate-900 mt-1.5 line-clamp-1">
              {project.title_th}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-700 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* 1. Downloadable Project Assets */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center space-x-1.5">
              <Download className="w-4 h-4 text-amber-500" />
              <span>ไฟล์ทรัพยากรที่เปิดให้ดาวน์โหลด (Reusable Assets)</span>
            </h4>

            <div className="space-y-2">
              {project.assets && project.assets.length > 0 ? (
                project.assets.map((asset) => (
                  <div
                    key={asset.id}
                    className="p-3.5 bg-slate-50 hover:bg-amber-50/50 rounded-2xl border border-slate-200 flex items-center justify-between transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-amber-600 shadow-2xs">
                        {asset.asset_type === 'code_repo' && <FileCode className="w-5 h-5" />}
                        {asset.asset_type === 'dataset' && <Database className="w-5 h-5 text-emerald-600" />}
                        {asset.asset_type === 'circuit_schematic' && <Cpu className="w-5 h-5 text-blue-600" />}
                        {asset.asset_type === 'trained_model' && <Award className="w-5 h-5 text-purple-600" />}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900">{asset.title}</div>
                        <div className="text-[11px] text-slate-500 line-clamp-1">{asset.description}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">{asset.file_size} • สัญญาอนุญาต: {asset.license}</div>
                      </div>
                    </div>

                    <a
                      href={asset.resource_url}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold rounded-xl flex items-center space-x-1 shadow-xs transition-colors shrink-0"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>ดาวน์โหลด</span>
                    </a>
                  </div>
                ))
              ) : (
                <div className="p-4 bg-slate-50 rounded-2xl text-center text-xs text-slate-500">
                  ไม่มีไฟล์แนบเฉพาะ แต่สามารถเข้าถึงโค้ดได้จาก Repository
                </div>
              )}
            </div>
          </div>

          {/* 2. GitHub Clone Command */}
          {project.dna_card?.repository_url && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center space-x-1.5">
                <Github className="w-4 h-4 text-slate-800" />
                <span>Git Clone Repository</span>
              </h4>
              <div className="flex items-center justify-between p-3 bg-slate-900 text-slate-100 rounded-xl font-mono text-xs">
                <span className="truncate mr-2">git clone {project.dna_card.repository_url}.git</span>
                <button
                  onClick={() => handleCopy(`git clone ${project.dna_card?.repository_url}.git`, 'git')}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-amber-400 rounded-lg flex items-center space-x-1 text-xs transition-colors shrink-0"
                >
                  {copiedText === 'git' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedText === 'git' ? 'คัดลอกแล้ว' : 'คัดลอก'}</span>
                </button>
              </div>
            </div>
          )}

          {/* 3. Authors & Contact */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center space-x-1.5">
              <UserCheck className="w-4 h-4 text-emerald-600" />
              <span>ติดต่อรุ่นพี่เจ้าของโครงงาน & อาจารย์ที่ปรึกษา</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="font-bold text-slate-900">{project.dna_card?.advisor_name || 'อาจารย์ประจำสาขาวิชา'}</div>
                <div className="text-slate-500 text-[11px]">อาจารย์ที่ปรึกษาโครงงาน</div>
                <a href={`mailto:kuse.advisor@ku.th`} className="text-amber-600 font-medium text-[11px] mt-1 inline-flex items-center space-x-1 hover:underline">
                  <Mail className="w-3 h-3" />
                  <span>ติดต่อผ่านอีเมลคณะ</span>
                </a>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="font-bold text-slate-900">
                  {project.dna_card?.student_authors?.[0]?.name || 'นิสิตรุ่นพี่ผู้จัดทำ'}
                </div>
                <div className="text-slate-500 text-[11px]">
                  รหัสนิสิต {project.dna_card?.student_authors?.[0]?.student_id || '-'}
                </div>
                <span className="text-emerald-600 font-medium text-[11px] mt-1 inline-block">
                  ✓ ยินดีให้คำปรึกษาและส่งต่อองค์ความรู้
                </span>
              </div>
            </div>
          </div>

          {/* 4. Academic Citation */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center space-x-1.5">
              <BookOpen className="w-4 h-4 text-blue-600" />
              <span>รูปแบบการอ้างอิงเอกสาร (Citation Format)</span>
            </h4>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-start justify-between">
              <p className="text-[11px] text-slate-600 leading-relaxed mr-2">
                {citationText}
              </p>
              <button
                onClick={() => handleCopy(citationText, 'cite')}
                className="p-2 bg-white hover:bg-slate-100 text-slate-700 rounded-lg border border-slate-200 transition-colors shrink-0"
                title="คัดลอกข้อความอ้างอิง"
              >
                {copiedText === 'cite' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-colors"
          >
            ปิดหน้าต่าง
          </button>
        </div>

      </div>
    </div>
  );
};
