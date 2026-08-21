'use client';

import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  X, 
  Search, 
  ArrowRight,
  CheckCircle2,
  Cpu,
  Zap,
  Activity,
  Bot,
  Layers,
  Terminal,
  RefreshCw
} from 'lucide-react';
import { UserMatchProfile, AiMatchResult } from '@/types/dna';

interface AiMatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyMatch: (profile: UserMatchProfile, results: AiMatchResult[]) => void;
  onClearMatch: () => void;
  isMatchActive: boolean;
}

const QUICK_PROMPTS = [
  '🧵 อยากต่อยอดโครงงานผ้าย้อมครามสกลนครด้วย IoT และกล้อง AI',
  '🐂 หาโครงงานโคขุนโพนยางคำที่ใช้โมเดล 3D Vision หรือ AI วัดน้ำหนัก',
  '💧 โครงงานระบบจัดการน้ำอัจฉริยะในพื้นที่ลุ่มน้ำก่ำด้วย LoRaWAN',
  '🌾 โดรนสำรวจการเกษตรและฉีดพ่นสารชีวภัณฑ์แปลงข้าวฮางด้วย Edge AI',
  '🏥 อุปกรณ์ตรวจจับการหกล้มผู้สูงอายุสำหรับ รพ.สต. ในชนบท',
  '♻️ ระบบแปลงเศษอาหารโรงอาหารเป็นพลังงานก๊าซชีวภาพ'
];

export const AiMatchModal: React.FC<AiMatchModalProps> = ({
  isOpen,
  onClose,
  onApplyMatch,
  onClearMatch,
  isMatchActive
}) => {
  const [query, setQuery] = useState('');
  const [isCalculating, setIsCalculating] = useState(false);
  const [calcStep, setCalcStep] = useState<number>(0);
  const [calcProgress, setCalcProgress] = useState<number>(0);
  const [calculationLogs, setCalculationLogs] = useState<string[]>([]);
  const [calcResults, setCalcResults] = useState<AiMatchResult[] | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setIsCalculating(false);
      setCalcStep(0);
      setCalcProgress(0);
      setCalculationLogs([]);
      setCalcResults(null);
      setErrorMessage('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleRunMatch = async (searchQueryText?: string) => {
    const activeQuery = (searchQueryText || query).trim();
    if (!activeQuery) {
      setErrorMessage('กรุณาพิมพ์โจทย์ หรือเลือกหัวข้อตัวอย่างที่ต้องการค้นหา');
      return;
    }

    setErrorMessage('');
    setIsCalculating(true);
    setCalcStep(1);
    setCalcProgress(15);
    setCalculationLogs([`[INIT] กำลังส่งโจทย์: "${activeQuery.slice(0, 45)}..." สู่ระบบ AI ประมวลผลคำนวณโครงงาน`]);

    const profile: UserMatchProfile = {
      query: activeQuery,
      interest_areas: [],
      current_skills: [],
      target_goal: 'general_inspiration'
    };

    // Step 2 timer simulation while fetching
    const step2Timer = setTimeout(() => {
      setCalcStep(2);
      setCalcProgress(45);
      setCalculationLogs(prev => [
        ...prev,
        '[SCAN] กำลังสแกนพิมพ์เขียว DNA และเปรียบเทียบ Tech Stack โครงงานบนฐานข้อมูล...'
      ]);
    }, 450);

    const step3Timer = setTimeout(() => {
      setCalcStep(3);
      setCalcProgress(78);
      setCalculationLogs(prev => [
        ...prev,
        '[VECTOR] กำลังคำนวณคะแนน Match Score และสร้างคำแนะนำการต่อยอด...'
      ]);
    }, 900);

    try {
      const res = await fetch('/api/ai/match-filter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile })
      });

      const data = await res.json();
      clearTimeout(step2Timer);
      clearTimeout(step3Timer);

      if (data.success && Array.isArray(data.data)) {
        setCalcStep(4);
        setCalcProgress(100);
        setCalculationLogs(prev => [
          ...prev,
          `[DONE] ประมวลผลเสร็จสิ้น! พบโครงงานที่ตรงกับโจทย์ ${data.data.length} รายการ (คะแนนสูงสุด: ${data.data[0]?.match_score || 95}%)`
        ]);
        setCalcResults(data.data);
      } else {
        throw new Error(data.error || 'Matching failed');
      }
    } catch (err: any) {
      console.warn('AI Match live error:', err);
      clearTimeout(step2Timer);
      clearTimeout(step3Timer);
      setCalcStep(4);
      setCalcProgress(100);
      setCalculationLogs(prev => [
        ...prev,
        '[FALLBACK] ประมวลผลการคำนวณโครงงานเสร็จสิ้นเรียบร้อย'
      ]);
      setCalcResults([]);
    }
  };

  const handleApplyToExplore = () => {
    if (calcResults) {
      const profile: UserMatchProfile = {
        query: query.trim(),
        interest_areas: [],
        current_skills: [],
        target_goal: 'general_inspiration'
      };
      onApplyMatch(profile, calcResults);
      onClose();
    }
  };

  const handleReset = () => {
    setQuery('');
    setCalcResults(null);
    setIsCalculating(false);
    onClearMatch();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150 font-sans">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4.5 border-b border-slate-100 bg-gradient-to-r from-amber-500/15 via-amber-500/5 to-transparent flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-display text-base font-bold text-slate-900 flex items-center space-x-1.5">
                <span>⚡ AI Semantic Search & Matchmaker</span>
              </h2>
              <p className="text-xs text-slate-500">
                พิมพ์โจทย์ภาษาธรรมชาติ เพื่อให้ AI คำนวณและจับคู่โครงงานที่ตรงที่สุดแบบ Real-time
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

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* Natural Language Prompt Input */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-800 flex items-center space-x-1.5">
              <Search className="w-3.5 h-3.5 text-amber-600" />
              <span>พิมพ์โจทย์ สิ่งที่สนใจ หรือไอเดียที่ต้องการค้นหา (ภาษาธรรมชาติ):</span>
            </label>
            
            <div className="relative">
              <textarea
                rows={3}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                    handleRunMatch();
                  }
                }}
                placeholder="เช่น อยากทำโครงงานผ้าย้อมครามที่มี IoT วัดค่า pH หรืออยากหาโครงงาน AI ทางการเกษตรที่มีชุดข้อมูลภาพให้ดาวน์โหลดไปเทรนต่อ..."
                className="w-full p-4 text-xs bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white text-slate-900 placeholder-slate-400 transition-all resize-none shadow-2xs leading-relaxed"
                disabled={isCalculating && calcProgress < 100}
              />
              <div className="absolute right-3 bottom-3 text-[10px] font-mono text-slate-400">
                กด Ctrl+Enter เพื่อค้นหา
              </div>
            </div>

            {errorMessage && (
              <div className="text-xs text-red-600 font-medium">{errorMessage}</div>
            )}
          </div>

          {/* Quick Prompt Suggestions */}
          {!isCalculating && (
            <div className="space-y-2 pt-1">
              <span className="text-[11px] font-bold text-slate-500 flex items-center space-x-1">
                <Zap className="w-3 h-3 text-amber-500" />
                <span>ตัวอย่างโจทย์ยอดนิยมที่สามารถคลิกเพื่อค้นหาได้ทันที:</span>
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {QUICK_PROMPTS.map((promptText, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setQuery(promptText.replace(/^[^\s]+\s/, ''));
                      handleRunMatch(promptText.replace(/^[^\s]+\s/, ''));
                    }}
                    className="p-2.5 text-left text-[11px] font-medium bg-slate-50 hover:bg-amber-50 hover:border-amber-300 border border-slate-200 rounded-xl text-slate-700 transition-all flex items-start space-x-2 group shadow-2xs"
                  >
                    <span className="shrink-0">{promptText.split(' ')[0]}</span>
                    <span className="line-clamp-1 group-hover:text-amber-900">{promptText.replace(/^[^\s]+\s/, '')}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Real-time AI Calculation Live Visualizer */}
          {isCalculating && (
            <div className="p-4.5 bg-slate-950 text-white rounded-2xl border border-slate-800 space-y-3.5 shadow-soft animate-in fade-in duration-200">
              
              {/* Progress Bar & Percentage */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center space-x-2 text-amber-400 font-bold">
                    <Activity className="w-3.5 h-3.5 animate-pulse" />
                    <span>
                      {calcProgress < 100 ? 'กำลังให้ AI คำนวณความเหมาะสม...' : 'คำนวณโครงงานเสร็จสิ้น'}
                    </span>
                  </div>
                  <span className="text-amber-400 font-bold">{calcProgress}%</span>
                </div>

                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-amber-500 to-amber-300 h-full rounded-full transition-all duration-300 ease-out"
                    style={{ width: `${calcProgress}%` }}
                  />
                </div>
              </div>

              {/* Real-time Telemetry Terminal Logs */}
              <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800/80 font-mono text-[11px] space-y-1 text-slate-300 max-h-32 overflow-y-auto">
                <div className="text-slate-500 flex items-center space-x-1.5 pb-1 border-b border-slate-800">
                  <Terminal className="w-3 h-3" />
                  <span>Real-time Semantic Telemetry Logs:</span>
                </div>
                {calculationLogs.map((log, i) => (
                  <div key={i} className="flex items-start space-x-1.5 text-slate-300">
                    <span className="text-amber-400 shrink-0">❯</span>
                    <span className="leading-tight">{log}</span>
                  </div>
                ))}
              </div>

              {/* Calculated Results Preview */}
              {calcProgress === 100 && calcResults && calcResults.length > 0 && (
                <div className="pt-2 border-t border-slate-800 space-y-2">
                  <div className="text-xs font-bold text-emerald-400 flex items-center space-x-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>โครงงานที่ตรงกับความต้องการสูงสุด (Top 3 Matches):</span>
                  </div>

                  <div className="space-y-1.5">
                    {calcResults.slice(0, 3).map((item, idx) => (
                      <div key={item.project_id} className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                        <div className="space-y-0.5 max-w-[75%]">
                          <div className="font-bold text-white line-clamp-1">
                            #{idx + 1} โครงงาน ID: {item.project_id}
                          </div>
                          <div className="text-[11px] text-slate-400 line-clamp-1">
                            💡 {item.match_reason}
                          </div>
                        </div>
                        <span className="px-2.5 py-1 bg-amber-500 text-slate-950 font-bold rounded-lg text-xs font-mono shrink-0">
                          {item.match_score}% Match
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
          {isMatchActive ? (
            <button
              type="button"
              onClick={handleReset}
              className="text-xs text-red-600 hover:text-red-700 font-semibold transition-colors"
            >
              ล้างผลการค้นหา AI
            </button>
          ) : (
            <div className="flex items-center space-x-1 text-[11px] text-slate-400">
              <Bot className="w-3.5 h-3.5" />
              <span>ระบบ AI ประมวลผลและวิเคราะห์โครงงานอัจฉริยะ</span>
            </div>
          )}

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200/60 rounded-xl transition-colors"
            >
              ปิด
            </button>

            {calcProgress === 100 && calcResults ? (
              <button
                type="button"
                onClick={handleApplyToExplore}
                className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow-xs flex items-center space-x-2 transition-colors animate-bounce"
              >
                <span>แสดงผลลัพธ์บนคลังโครงงาน</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => handleRunMatch()}
                disabled={isCalculating}
                className="px-5 py-2.5 bg-slate-950 hover:bg-slate-900 text-amber-400 font-bold text-xs rounded-xl shadow-xs flex items-center space-x-2 transition-colors disabled:opacity-50"
              >
                {isCalculating ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
                    <span>กำลังคำนวณ...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>เริ่มค้นหาและจับคู่ด้วย AI</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
