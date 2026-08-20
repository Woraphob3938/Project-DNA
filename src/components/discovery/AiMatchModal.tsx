'use client';

import React, { useState } from 'react';
import { 
  Sparkles, 
  X, 
  Check, 
  Search, 
  GraduationCap, 
  Layers, 
  Code, 
  Database, 
  Compass, 
  ArrowRight,
  CheckCircle2,
  Cpu,
  Target
} from 'lucide-react';
import { UserMatchProfile, AiMatchResult } from '@/types/dna';

interface AiMatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyMatch: (profile: UserMatchProfile, results: AiMatchResult[]) => void;
  onClearMatch: () => void;
  isMatchActive: boolean;
}

const INTEREST_PRESETS = [
  { id: 'indigo', label: '🧵 สิ่งทอผ้าย้อมครามสกลนคร' },
  { id: 'agritech', label: '🌾 เกษตรแม่นยำ & โดรนสำรวจ' },
  { id: 'cattle', label: '🐂 ปศุสัตว์ & โคขุนโพนยางคำ' },
  { id: 'health', label: '🏥 นวัตกรรมสุขภาพ & ชุมชน' },
  { id: 'water', label: '💧 ระบบน้ำ & IoT ภัยแล้ง' },
  { id: 'smartcity', label: '🏙️ Smart City & Big Data' }
];

const SKILL_PRESETS = [
  'Python', 'PyTorch / YOLO', 'IoT / ESP32', 'React / Next.js', 'Flutter / Mobile', 'Database / SQL', 'CAD / 3D Print', 'Data Analysis', 'Business Model'
];

export const AiMatchModal: React.FC<AiMatchModalProps> = ({
  isOpen,
  onClose,
  onApplyMatch,
  onClearMatch,
  isMatchActive
}) => {
  const [query, setQuery] = useState('');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [targetGoal, setTargetGoal] = useState<'extend_code' | 'use_dataset' | 'solve_community' | 'general_inspiration'>('extend_code');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const toggleInterest = (label: string) => {
    if (selectedInterests.includes(label)) {
      setSelectedInterests(selectedInterests.filter(i => i !== label));
    } else {
      setSelectedInterests([...selectedInterests, label]);
    }
  };

  const toggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter(s => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const handleRunMatch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    const profile: UserMatchProfile = {
      query: query.trim(),
      interest_areas: selectedInterests,
      current_skills: selectedSkills,
      target_goal: targetGoal
    };

    try {
      const res = await fetch('/api/ai/match-filter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile })
      });

      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        onApplyMatch(profile, data.data);
        onClose();
      } else {
        throw new Error(data.error || 'Matching failed');
      }
    } catch (err: any) {
      console.warn('AI Match error:', err);
      // Fallback: apply empty profile matching
      onApplyMatch(profile, []);
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setQuery('');
    setSelectedInterests([]);
    setSelectedSkills([]);
    setTargetGoal('extend_code');
    onClearMatch();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-display text-base font-bold text-slate-900 flex items-center space-x-1.5">
                <span>⚡ AI Matchmaker · ผู้ช่วยจับคู่โครงงาน</span>
              </h2>
              <p className="text-xs text-slate-500">
                บอกโจทย์ ทักษะ และเป้าหมาย เพื่อให้ Gemini AI คำนวณความเหมาะสมและแนะนำโครงงานที่ตรงที่สุด
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleRunMatch} className="p-6 overflow-y-auto space-y-6 flex-1 font-sans">
          
          {/* Natural Language Prompt */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-800 flex items-center space-x-1.5">
              <Search className="w-3.5 h-3.5 text-amber-600" />
              <span>โจทย์หรือสิ่งที่คุณกำลังมองหา (ค้นหาด้วยภาษาธรรมชาติ)</span>
            </label>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="เช่น อยากทำโปรเจกต์ผ้าครามที่มี IoT หรือหาโครงงาน AI เกษตรที่มีชุดข้อมูลให้โหลด..."
              className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-500 focus:bg-white text-slate-900 placeholder-slate-400"
            />
          </div>

          {/* Interest Areas Chips */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-800 flex items-center space-x-1.5">
              <Target className="w-3.5 h-3.5 text-amber-600" />
              <span>หัวข้อและความสนใจหลัก (เลือกได้หลายข้อ)</span>
            </label>
            <div className="flex flex-wrap gap-1.5">
              {INTEREST_PRESETS.map((item) => {
                const isSelected = selectedInterests.includes(item.label);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => toggleInterest(item.label)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all flex items-center space-x-1.5 ${
                      isSelected
                        ? 'bg-slate-900 text-amber-400 border-slate-900 shadow-xs'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 text-amber-400 stroke-[3]" />}
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Current Skills Chips */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-800 flex items-center space-x-1.5">
              <Cpu className="w-3.5 h-3.5 text-amber-600" />
              <span>ทักษะที่คุณมี หรือเทคโนโลยีที่อยากใช้ (Tech Stack)</span>
            </label>
            <div className="flex flex-wrap gap-1.5">
              {SKILL_PRESETS.map((skill) => {
                const isSelected = selectedSkills.includes(skill);
                return (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => toggleSkill(skill)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all flex items-center space-x-1.5 ${
                      isSelected
                        ? 'bg-amber-500 text-slate-950 border-amber-600 shadow-xs'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 text-slate-950 stroke-[3]" />}
                    <span>{skill}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Target Goal */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-800 flex items-center space-x-1.5">
              <Compass className="w-3.5 h-3.5 text-amber-600" />
              <span>เป้าหมายหลักในการค้นหาโครงงาน</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              
              <button
                type="button"
                onClick={() => setTargetGoal('extend_code')}
                className={`p-3 rounded-xl border text-left transition-all flex items-start space-x-2.5 ${
                  targetGoal === 'extend_code'
                    ? 'border-amber-500 bg-amber-50/60 ring-1 ring-amber-400'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <Code className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-slate-900">นำ Source Code ไปต่อยอด</div>
                  <div className="text-[11px] text-slate-500">เน้นโครงงานที่มี GitHub Repo และพิมพ์เขียว</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setTargetGoal('use_dataset')}
                className={`p-3 rounded-xl border text-left transition-all flex items-start space-x-2.5 ${
                  targetGoal === 'use_dataset'
                    ? 'border-amber-500 bg-amber-50/60 ring-1 ring-amber-400'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <Database className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-slate-900">ต้องการชุดข้อมูล (Dataset)</div>
                  <div className="text-[11px] text-slate-500">เน้นโครงงานที่มีภาพถ่าย/CSV สำหรับเทรน AI</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setTargetGoal('solve_community')}
                className={`p-3 rounded-xl border text-left transition-all flex items-start space-x-2.5 ${
                  targetGoal === 'solve_community'
                    ? 'border-amber-500 bg-amber-50/60 ring-1 ring-amber-400'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <GraduationCap className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-slate-900">แก้โจทย์ชุมชน / สกลนคร</div>
                  <div className="text-[11px] text-slate-500">เน้นโครงงานที่เชื่อมโยงกับผู้ประกอบการและพื้นที่</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setTargetGoal('general_inspiration')}
                className={`p-3 rounded-xl border text-left transition-all flex items-start space-x-2.5 ${
                  targetGoal === 'general_inspiration'
                    ? 'border-amber-500 bg-amber-50/60 ring-1 ring-amber-400'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <Layers className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-slate-900">หาแรงบันดาลใจและช่องว่างวิจัย</div>
                  <div className="text-[11px] text-slate-500">ดูภาพรวมไอเดียเพื่อเลือกทำหัวข้อใหม่</div>
                </div>
              </button>

            </div>
          </div>

          {errorMessage && (
            <div className="text-xs text-red-600 font-medium">{errorMessage}</div>
          )}

          {/* Footer Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            {isMatchActive ? (
              <button
                type="button"
                onClick={handleReset}
                className="text-xs text-red-600 hover:text-red-700 font-semibold"
              >
                ล้างการจับคู่ AI
              </button>
            ) : (
              <span className="text-[11px] text-slate-400">Gemini 2.0 / 1.5 Semantic Engine</span>
            )}

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                ยกเลิก
              </button>

              <button
                type="submit"
                disabled={isLoading}
                className="px-5 py-2.5 bg-slate-950 hover:bg-black text-amber-400 font-bold text-xs rounded-xl shadow-sm flex items-center space-x-2 transition-colors disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
                    <span>กำลังประมวลผล AI...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>วิเคราะห์และจับคู่โครงงาน</span>
                  </>
                )}
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
};
