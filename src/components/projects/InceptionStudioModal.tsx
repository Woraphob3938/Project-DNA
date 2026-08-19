'use client';

import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  ArrowRight, 
  Check, 
  GitFork, 
  Target, 
  Layers, 
  CheckCircle2, 
  ChevronLeft,
  Rocket
} from 'lucide-react';
import { Project, ExtensionGap, Challenge } from '@/types/dna';

interface InceptionStudioModalProps {
  parentProject: Project | null;
  challenges: Challenge[];
  isOpen: boolean;
  onClose: () => void;
  onSuccessCreate: (newProject: Partial<Project>) => void;
}

export const InceptionStudioModal: React.FC<InceptionStudioModalProps> = ({
  parentProject,
  challenges,
  isOpen,
  onClose,
  onSuccessCreate
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [selectedGap, setSelectedGap] = useState<ExtensionGap | null>(null);
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  const [newTitleTh, setNewTitleTh] = useState('');
  const [newTitleEn, setNewTitleEn] = useState('');
  const [teamMembers, setTeamMembers] = useState('');

  if (!isOpen || !parentProject) return null;

  // Initialize defaults on gap selection
  const handleSelectGap = (gap: ExtensionGap) => {
    setSelectedGap(gap);
    setNewTitleTh(`โครงการต่อยอด: ${gap.gap_title}`);
    setNewTitleEn(`Continuation: ${gap.gap_title}`);
  };

  const handleFinish = () => {
    const newProj: Partial<Project> = {
      title_th: newTitleTh || `โครงการต่อยอดจาก ${parentProject.title_th}`,
      title_en: newTitleEn || `Continuation of ${parentProject.title_en}`,
      academic_year: 2568,
      status: 'in_progress',
      department_id: parentProject.department_id,
      abstract_th: `โครงการต่อยอดจาก ${parentProject.title_th} มุ่งเน้นการแก้ปัญหา ${selectedGap?.gap_title || 'การขยายผล'} เพื่อตอบโจทย์ ${selectedChallenge?.title || 'ความต้องการในพื้นที่'}`,
      dna_card: {
        id: 'dna-new-' + Date.now(),
        project_id: '',
        problem_statement: selectedGap?.gap_description || parentProject.dna_card?.problem_statement || '',
        target_users: parentProject.dna_card?.target_users || [],
        tech_stack: [...(parentProject.dna_card?.tech_stack || []), ...(selectedGap?.recommended_tech || [])],
        key_outcomes: [`คาดว่าจะพัฒนา ${selectedGap?.gap_title || 'ระบบ'} ได้สำเร็จ`],
        limitations: ['อยู่ในช่วงวิจัยและพัฒนาภาคสนาม'],
        student_authors: [
          { name: teamMembers || 'นิสิตรุ่นปัจจุบัน (ทีมต่อยอด)', student_id: '6740xxxxxx', role: 'Team Lead' }
        ]
      },
      assets: parentProject.assets,
      gaps: [],
      parent_lineages: [
        {
          id: 'edge-new-' + Date.now(),
          parent_project_id: parentProject.id,
          child_project_id: '',
          extension_type: 'feature_enhancement',
          evolution_summary: `ต่อยอดจาก ${parentProject.title_th} สู่ ${newTitleTh}`
        }
      ]
    };

    onSuccessCreate(newProj);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-hidden shadow-2xl border border-amber-300/60 flex flex-col justify-between">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-amber-500/10 via-amber-50 to-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-black shadow-md">
              <Rocket className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-black uppercase px-2 py-0.5 bg-amber-500 text-slate-950 rounded-md">
                  DNA INCEPTION STUDIO
                </span>
                <span className="text-xs text-slate-500">ขั้นตอนที่ {step} จาก 4</span>
              </div>
              <h3 className="text-lg font-black text-slate-900 mt-1">
                สร้างโครงการต่อยอดจากรุ่นพี่ (Project Continuation Wizard)
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Wizard Step Progress Bar */}
        <div className="grid grid-cols-4 border-b border-slate-100 text-xs font-bold text-slate-500 text-center">
          <div className={`py-2.5 border-b-2 transition-all ${step >= 1 ? 'border-amber-500 text-slate-900 bg-amber-50/50' : 'border-transparent'}`}>
            1. ตรวจสอบ Baseline
          </div>
          <div className={`py-2.5 border-b-2 transition-all ${step >= 2 ? 'border-amber-500 text-slate-900 bg-amber-50/50' : 'border-transparent'}`}>
            2. เลือกช่องว่าง AI Gap
          </div>
          <div className={`py-2.5 border-b-2 transition-all ${step >= 3 ? 'border-amber-500 text-slate-900 bg-amber-50/50' : 'border-transparent'}`}>
            3. จับคู่โจทย์จริง
          </div>
          <div className={`py-2.5 border-b-2 transition-all ${step >= 4 ? 'border-amber-500 text-slate-900 bg-amber-50/50' : 'border-transparent'}`}>
            4. สร้าง DNA ฉบับใหม่
          </div>
        </div>

        {/* Wizard Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* STEP 1: Predecessor Baseline */}
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center space-x-2 text-xs font-bold text-amber-700">
                  <Layers className="w-4 h-4" />
                  <span>โครงงานตั้งต้น (Predecessor Baseline DNA)</span>
                </div>
                <h4 className="text-base font-black text-slate-900">{parentProject.title_th}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{parentProject.dna_card?.problem_statement || parentProject.abstract_th}</p>
                
                <div className="pt-2 border-t border-slate-200 flex flex-wrap gap-1.5">
                  {parentProject.dna_card?.tech_stack?.map((t, idx) => (
                    <span key={idx} className="px-2 py-0.5 bg-slate-200 text-slate-800 text-xs font-mono rounded">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-800 space-y-1">
                <div className="font-bold flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>สิ่งที่คุณจะได้รับสืบทอดโดยไม่ต้องเริ่มจาก 0:</span>
                </div>
                <p>• ซอร์สโค้ดและไลบรารีสถาปัตยกรรมเดิม (ประหยัดเวลาเริ่มต้นไปกว่า 60%)</p>
                <p>• ชุดข้อมูล Dataset ที่ผ่านการ Clean และ Label เรียบร้อยแล้ว</p>
                <p>• ประวัติการทดลองและข้อจำกัดที่รุ่นพี่บันทึกไว้</p>
              </div>
            </div>
          )}

          {/* STEP 2: Pick AI Extension Gap */}
          {step === 2 && (
            <div className="space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-slate-900">
                  เลือกช่องว่างการพัฒนาที่ AI แนะนำ หรือกำหนดเอง:
                </h4>
                <span className="text-xs text-amber-600 font-bold flex items-center space-x-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>AI Gap Opportunities</span>
                </span>
              </div>

              <div className="space-y-3">
                {parentProject.gaps && parentProject.gaps.length > 0 ? (
                  parentProject.gaps.map((gap, idx) => {
                    const isSelected = selectedGap?.id === gap.id;
                    return (
                      <div
                        key={idx}
                        onClick={() => handleSelectGap(gap)}
                        className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-amber-50 border-amber-500 ring-2 ring-amber-400/50 shadow-md'
                            : 'bg-white border-slate-200 hover:border-amber-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <h5 className="font-bold text-slate-900 text-sm">{gap.gap_title}</h5>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            gap.difficulty_level === 'Easy' ? 'bg-emerald-100 text-emerald-800' :
                            gap.difficulty_level === 'Medium' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                          }`}>
                            ความยาก: {gap.difficulty_level}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">{gap.gap_description}</p>
                        <div className="mt-2.5 flex items-center justify-between text-xs">
                          <span className="text-slate-500 text-[11px]">
                            เทคโนโลยีที่ต้องศึกษาเพิ่ม: <strong className="text-amber-700">{gap.recommended_tech.join(', ')}</strong>
                          </span>
                          {isSelected && <span className="text-amber-600 font-black text-xs flex items-center"><Check className="w-4 h-4 mr-0.5" /> เลือกแล้ว</span>}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="p-4 bg-slate-50 rounded-2xl text-xs text-slate-500 text-center">
                    ไม่มี Gap สำเร็จรูป กำหนดหัวข้อต่อยอดได้ในขั้นตอนถัดไป
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 3: Match Real Challenge */}
          {step === 3 && (
            <div className="space-y-4 animate-in fade-in">
              <h4 className="text-sm font-bold text-slate-900">
                เลือกโจทย์จริง (Challenge) จากชุมชน องค์กร หรือมหาวิทยาลัยที่ต้องการนำไปใช้แก้ปัญหา:
              </h4>

              <div className="space-y-3">
                {challenges.map((chal) => {
                  const isSelected = selectedChallenge?.id === chal.id;
                  return (
                    <div
                      key={chal.id}
                      onClick={() => setSelectedChallenge(chal)}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-amber-50 border-amber-500 ring-2 ring-amber-400/50 shadow-md'
                          : 'bg-white border-slate-200 hover:border-amber-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                            chal.category === 'industry' ? 'bg-purple-100 text-purple-800' :
                            chal.category === 'university' ? 'bg-blue-100 text-blue-800' : 'bg-emerald-100 text-emerald-800'
                          }`}>
                            {chal.category}
                          </span>
                          <span className="text-xs font-bold text-slate-500">{chal.organization_name}</span>
                        </div>
                        <span className="text-xs text-slate-400">{chal.location}</span>
                      </div>

                      <h5 className="font-bold text-slate-900 text-sm mt-1.5">{chal.title}</h5>
                      <p className="text-xs text-slate-600 mt-1 line-clamp-2">{chal.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 4: Review & Generate New DNA Card */}
          {step === 4 && (
            <div className="space-y-4 animate-in fade-in">
              <div className="p-4 bg-gradient-to-br from-amber-500/10 via-amber-50 to-white rounded-2xl border border-amber-300 space-y-4">
                <div className="flex items-center space-x-2 text-xs font-black text-amber-900">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>สรุปร่างโครงการใหม่ (New Successor Project DNA)</span>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">ชื่อโครงการภาษาไทย:</label>
                  <input
                    type="text"
                    value={newTitleTh}
                    onChange={(e) => setNewTitleTh(e.target.value)}
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">ชื่อสมาชิกในทีม / รหัสนิสิต:</label>
                  <input
                    type="text"
                    value={teamMembers}
                    onChange={(e) => setTeamMembers(e.target.value)}
                    placeholder="เช่น: นิสิตทีมต่อยอด (6740xxxxxx)"
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs space-y-1">
                  <div><strong>สืบทอดสายวิวัฒนาการจาก:</strong> {parentProject.title_th}</div>
                  <div><strong>สาขาวิชา:</strong> {parentProject.department?.name_th}</div>
                  <div><strong>โจทย์ที่เลือก:</strong> {selectedChallenge?.title || 'โจทย์ความต้องการทั่วไป'}</div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer Controls */}
        <div className="p-5 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          {step > 1 ? (
            <button
              onClick={() => setStep((step - 1) as any)}
              className="px-4 py-2.5 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 flex items-center space-x-1 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>ย้อนกลับ</span>
            </button>
          ) : <div />}

          {step < 4 ? (
            <button
              onClick={() => setStep((step + 1) as any)}
              className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs rounded-xl flex items-center space-x-1.5 shadow-md transition-all active:scale-95"
            >
              <span>ถัดไป</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleFinish}
              className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-xs rounded-xl flex items-center space-x-2 shadow-lg transition-all active:scale-95"
            >
              <Rocket className="w-4 h-4" />
              <span>ยืนยันสร้าง DNA โครงการต่อยอด</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
