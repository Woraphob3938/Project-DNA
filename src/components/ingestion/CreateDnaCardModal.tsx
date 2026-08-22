'use client';

import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Check, 
  Loader2,
  ImageIcon,
  AlertCircle
} from 'lucide-react';
import { Project, Department, Faculty } from '@/types/dna';
import { extractDnaWithGemini } from '@/lib/geminiService';
import { Logo } from '@/components/layout/Logo';
import { supabase } from '@/lib/supabaseClient';

const FALLBACK_COVER_URL = 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=60';
const MAX_COVER_BYTES = 5 * 1024 * 1024; // 5MB — matches the storage bucket limit
const ALLOWED_COVER_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

interface CreateDnaCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  departments: Department[];
  faculties: Faculty[];
  onSuccessCreate: (newProject: Partial<Project>) => void;
}

export const CreateDnaCardModal: React.FC<CreateDnaCardModalProps> = ({
  isOpen,
  onClose,
  departments,
  faculties,
  onSuccessCreate
}) => {
  const [inputText, setInputText] = useState('');
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractError, setExtractError] = useState('');
  const [extractedData, setExtractedData] = useState<any>(null);

  // Cover image state
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreviewUrl, setCoverPreviewUrl] = useState('');
  const [coverError, setCoverError] = useState('');
  const [coverNotice, setCoverNotice] = useState('');

  // Save state
  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen) return null;

  const sampleAbstracts = [
    {
      title: 'ตัวอย่าง (เกษตร/วิศวะ): ระบบตรวจจับแมลงศัตรูพืชในสวนผลไม้ด้วย IoT & Edge AI',
      text: 'โครงงานนี้นำเสนอการพัฒนาระบบกับดักแมลงอัจฉริยะพลังงานแสงอาทิตย์ โดยใช้กล้องถ่ายภาพความละเอียด 8MP และไมโครคอนโทรลเลอร์ ESP32-CAM ประมวลผลโมเดล MobileNetV2 เพื่อจำแนกชนิดแมลงศัตรูพืชและแมลงตัวห้ำตัวเบียน พร้อมส่งข้อมูลพิกัดและจำนวนแมลงผ่านเครือข่าย NB-IoT ไปยังคลาวด์แดชบอร์ด เพื่อเตือนภัยเกษตรกรฉีดพ่นสารชีวภัณฑ์ตรงเวลา ลดการสูญเสียผลผลิตลง 30%'
    },
    {
      title: 'ตัวอย่าง (สัตวศาสตร์/คอมฯ): ระบบวิเคราะห์สุขภาพและพฤติกรรมโคขุนโพนยางคำ',
      text: 'พัฒนาระบบประมวลผลภาพ 3D Vision เพื่อประเมินน้ำหนักและตรวจจับความเครียดของโคขุนโพนยางคำขณะเดินผ่านคอกตรวจสุขภาพ เพื่อลดการบาดเจ็บจากการชั่งน้ำหนักแบบเดิม และส่งออกข้อมูลประวัติสุขภาพผ่านเว็บแอปพลิเคชัน'
    }
  ];

  const handleRemoveCover = () => {
    if (coverPreviewUrl) URL.revokeObjectURL(coverPreviewUrl);
    setCoverFile(null);
    setCoverPreviewUrl('');
  };

  const handleCoverSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = ''; // allow re-picking the same file after removal
    if (!file) return;

    if (!ALLOWED_COVER_TYPES.includes(file.type)) {
      setCoverError('รองรับเฉพาะไฟล์ JPG, PNG หรือ WebP เท่านั้น');
      return;
    }
    if (file.size > MAX_COVER_BYTES) {
      setCoverError(`ขนาดไฟล์ต้องไม่เกิน 5MB (ไฟล์นี้ ${(file.size / 1024 / 1024).toFixed(1)}MB)`);
      return;
    }

    setCoverError('');
    setCoverFile(file);
    setCoverPreviewUrl(URL.createObjectURL(file));
  };

  const handleExtractWithAI = async () => {
    if (!inputText.trim()) return;
    setIsExtracting(true);
    setExtractError('');
    try {
      const data = await extractDnaWithGemini(inputText);
      setExtractedData(data);
    } catch (e) {
      console.error(e);
      setExtractError('AI วิเคราะห์ไม่สำเร็จ กรุณาตรวจสอบอินเทอร์เน็ตแล้วลองอีกครั้ง');
    } finally {
      setIsExtracting(false);
    }
  };

  /**
   * Upload the selected cover to Supabase Storage under the signed-in
   * user's own folder. Resolves with the public URL; rejects when the
   * upload fails so the caller can fall back to a standard cover.
   */
  const uploadCoverIfNeeded = async (): Promise<string> => {
    if (!coverFile) return '';
    if (!supabase) throw new Error('ระบบฐานข้อมูลยังไม่พร้อมใช้งาน');

    const { data: { user } } = await supabase.auth.getUser();
    const ext = coverFile.name.split('.').pop()?.toLowerCase().replace(/[^a-z0-9]/g, '') || 'jpg';
    const path = `${user?.id ?? 'guest'}/${Date.now()}.${ext}`;

    const { error } = await supabase.storage
      .from('project-covers')
      .upload(path, coverFile, { cacheControl: '3600', upsert: false });
    if (error) throw error;

    const { data } = supabase.storage.from('project-covers').getPublicUrl(path);
    return data.publicUrl;
  };

  const handleSave = async () => {
    if (!extractedData || isSaving) return;
    setIsSaving(true);
    setCoverNotice('');

    let coverUrl = '';
    try {
      coverUrl = await uploadCoverIfNeeded();
    } catch (e) {
      console.warn('Cover upload failed, using standard cover instead:', e);
      setCoverNotice('อัปโหลดรูปหน้าปกไม่สำเร็จ — ระบบจะใช้รูปมาตรฐานแทน');
    }

    try {
      const matchedDept = departments.find(d => d.code === extractedData.department_code) || departments[0];

      const newProj: Partial<Project> = {
        title_th: extractedData.title_th || 'โครงงานนิสิต มก.ฉกส.',
        title_en: extractedData.title_en || 'KUSE Student Project',
        abstract_th: inputText,
        academic_year: extractedData.academic_year || 2568,
        status: 'in_progress',
        department_id: matchedDept?.id || 'dept-cs',
        rating_score: 5.0,
        cover_image_url: coverUrl || FALLBACK_COVER_URL,
        dna_card: {
          id: 'dna-user-' + Date.now(),
          project_id: '',
          problem_statement: extractedData.dna_card?.problem_statement || '',
          target_users: extractedData.dna_card?.target_users || [],
          tech_stack: extractedData.dna_card?.tech_stack || ['AI', 'IoT', 'Next.js'],
          key_outcomes: extractedData.dna_card?.key_outcomes || [],
          limitations: extractedData.dna_card?.limitations || [],
          hardware_specs: extractedData.dna_card?.hardware_specs,
          advisor_name: extractedData.dna_card?.advisor_name,
          student_authors: [
            { name: 'นิสิตผู้สร้างโครงงาน', student_id: '6740xxxxxx', role: 'Project Creator' }
          ]
        },
        gaps: extractedData.gaps || []
      };

      onSuccessCreate(newProj);
      onClose();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-hidden shadow-2xl border border-slate-200 flex flex-col justify-between">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-white border border-slate-200 flex items-center justify-center shadow-md overflow-hidden">
              <Logo className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-black uppercase px-2 py-0.5 bg-amber-500 text-slate-950 rounded-md">
                  AI INGESTION ENGINE
                </span>
              </div>
              <h3 className="text-lg font-black text-slate-900 mt-1">
                เพิ่มโครงงานใหม่ — สร้าง DNA Card จากบทคัดย่อ
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-700 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* Paste Abstract Input */}
          <div className="space-y-2">
            <label htmlFor="abstract-input" className="text-xs font-bold text-slate-700 block">
              1. วางบทคัดย่อหรือรายละเอียดโครงงาน{' '}
              <span className="font-normal text-slate-400">(ไทยหรืออังกฤษก็ได้ — AI จะสกัดข้อมูลให้อัตโนมัติ)</span>
            </label>
            <textarea
              id="abstract-input"
              rows={5}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="เช่น วางบทคัดย่อโครงงานของคุณ หรือพิมพ์รายละเอียดสั้นๆ ที่นี่..."
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-900 focus:ring-2 focus:ring-amber-500 focus:bg-white focus:outline-none transition-all leading-relaxed"
            />
          </div>

          {/* Quick Preset Buttons */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-semibold text-slate-400">ยังไม่มีข้อมูล? ลองด้วยตัวอย่าง:</span>
            <div className="flex flex-wrap gap-2">
              {sampleAbstracts.map((sample, idx) => (
                <button
                  key={idx}
                  onClick={() => setInputText(sample.text)}
                  className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-medium rounded-xl border border-amber-200 text-left transition-colors truncate max-w-md"
                >
                  ⚡ {sample.title}
                </button>
              ))}
            </div>
          </div>

          {/* Extract Trigger Button */}
          <button
            onClick={handleExtractWithAI}
            disabled={isExtracting || !inputText.trim()}
            className="w-full py-3 px-4 bg-slate-900 hover:bg-black text-amber-400 font-black text-xs md:text-sm rounded-2xl shadow-md flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
          >
            {isExtracting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                <span>AI กำลังวิเคราะห์และสกัดข้อมูล DNA...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>✨ สกัด DNA Card และวิเคราะห์ Gap ด้วย AI</span>
              </>
            )}
          </button>

          {/* Extraction error banner */}
          {extractError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-medium flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
              <span>{extractError}</span>
            </div>
          )}

          {/* Cover Image Upload */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 block">
              2. รูปหน้าปกโครงงาน{' '}
              <span className="font-normal text-slate-400">(แสดงเป็นภาพพื้นหลังบนการ์ด DNA)</span>
            </label>

            {coverPreviewUrl ? (
              <div className="flex items-center space-x-3 p-3 bg-slate-50 border border-slate-200 rounded-2xl">
                {/* Blob preview via background-image keeps layout stable without an <img> tag */}
                <div
                  className="w-24 h-16 rounded-xl bg-slate-200 bg-cover bg-center shrink-0"
                  style={{ backgroundImage: `url(${coverPreviewUrl})` }}
                  role="img"
                  aria-label="ตัวอย่างรูปหน้าปกที่เลือก"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-slate-800 truncate">{coverFile?.name}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {((coverFile?.size ?? 0) / 1024 / 1024).toFixed(2)} MB — จะอัปโหลดเมื่อกดบันทึก
                  </p>
                </div>
                <button
                  onClick={handleRemoveCover}
                  className="px-2.5 py-1.5 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition-colors flex items-center space-x-1 shrink-0"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>ลบรูป</span>
                </button>
              </div>
            ) : (
              <label className="flex items-center justify-center space-x-2 p-4 border-2 border-dashed border-slate-300 hover:border-amber-400 hover:bg-amber-50/50 rounded-2xl cursor-pointer transition-colors">
                <ImageIcon className="w-4 h-4 text-slate-400" />
                <span className="text-xs font-medium text-slate-500">
                  คลิกเพื่อเลือกรูป — JPG/PNG/WebP · ไม่เกิน 5MB{' '}
                  <span className="text-slate-400">(ไม่ใส่ได้ ระบบใช้รูปมาตรฐานให้)</span>
                </span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={handleCoverSelect}
                />
              </label>
            )}

            {coverError && (
              <p className="text-[11px] text-red-600 font-medium flex items-center space-x-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{coverError}</span>
              </p>
            )}
          </div>

          {/* Extracted Preview Area */}
          {extractedData && (
            <div className="p-5 bg-gradient-to-br from-amber-500/10 via-amber-50 to-white rounded-2xl border border-amber-300 space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between border-b border-amber-200 pb-2">
                <span className="text-xs font-black text-amber-900 flex items-center space-x-1.5">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>3. ตรวจสอบผลลัพธ์ก่อนบันทึก</span>
                </span>
                <span className="text-xs font-bold px-2 py-0.5 bg-slate-900 text-amber-400 rounded">
                  สาขา {extractedData.department_code} • ปี {extractedData.academic_year}
                </span>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-sm">{extractedData.title_th}</h4>
                <p className="text-xs text-slate-500">{extractedData.title_en}</p>
              </div>

              <div className="text-xs space-y-1.5">
                <div>
                  <strong>โจทย์ปัญหา:</strong> {extractedData.dna_card?.problem_statement}
                </div>
                <div>
                  <strong>Tech Stack:</strong> {extractedData.dna_card?.tech_stack?.join(', ')}
                </div>
              </div>

              {extractedData.gaps && extractedData.gaps.length > 0 && (
                <div className="pt-2 border-t border-amber-200">
                  <span className="text-xs font-bold text-amber-900">ช่องว่างการต่อยอดที่ AI แนะนำ:</span>
                  <div className="space-y-1.5 mt-1">
                    {extractedData.gaps.map((g: any, i: number) => (
                      <div key={i} className="text-xs bg-white p-2 rounded-lg border border-amber-200">
                        <strong>{g.gap_title}:</strong> {g.gap_description}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-5 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-3">
          <div className="min-w-0 flex-1">
            {coverNotice && (
              <p className="text-[11px] text-amber-700 bg-amber-100 border border-amber-300 rounded-lg px-2.5 py-1.5 truncate">
                ⚠️ {coverNotice}
              </p>
            )}
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={onClose}
              disabled={isSaving}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 disabled:opacity-40"
            >
              ยกเลิก
            </button>

            <button
              onClick={handleSave}
              disabled={!extractedData || isSaving}
              className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs rounded-xl shadow-md transition-all disabled:opacity-40 flex items-center space-x-2"
            >
              {isSaving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>{isSaving ? 'กำลังอัปโหลดและบันทึก...' : 'บันทึกเข้าสู่คลังโครงงาน DNA'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
