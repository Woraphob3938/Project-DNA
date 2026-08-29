'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft, CheckCircle2, AlertCircle, Loader2, PencilLine,
  FolderOpen, Save, GraduationCap, Layers, FileCode
} from 'lucide-react';
import { Logo } from '@/components/layout/Logo';
import { dnaService } from '@/lib/dnaService';
import { useAuthGate } from '@/hooks/useAuthGate';
import { useMyProjectIds } from '@/hooks/useMyProjects';
import { Project } from '@/types/dna';

const inputClass =
  'w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-500 focus:bg-white text-slate-900 placeholder-slate-400 transition-all';
const labelClass = 'block text-xs font-bold text-slate-800 mb-1.5';

const STATUS_OPTIONS: { value: Project['status']; label: string }[] = [
  { value: 'completed', label: 'เสร็จสมบูรณ์' },
  { value: 'in_progress', label: 'กำลังพัฒนา' },
  { value: 'incubating', label: 'ระหว่างฟักไข่' }
];

export default function EditProjectPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthGate();
  const { myIds } = useMyProjectIds();

  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Editable form fields
  const [titleTh, setTitleTh] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [abstractTh, setAbstractTh] = useState('');
  const [problemStatement, setProblemStatement] = useState('');
  const [techStackInput, setTechStackInput] = useState('');
  const [keyResults, setKeyResults] = useState('');
  const [limitations, setLimitations] = useState('');
  const [advisorName, setAdvisorName] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [demoUrl, setDemoUrl] = useState('');
  const [status, setStatus] = useState<Project['status']>('completed');
  const [academicYear, setAcademicYear] = useState<number>(2568);

  // Save state
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Signed-out visitors are bounced to /login
  useEffect(() => {
    if (isAuthenticated === false) router.push('/login?next=/edit');
  }, [isAuthenticated, router]);

  const loadFormFrom = useCallback((p: Project) => {
    setTitleTh(p.title_th || '');
    setTitleEn(p.title_en || '');
    setAbstractTh(p.abstract_th || '');
    setProblemStatement(p.dna_card?.problem_statement || '');
    setTechStackInput((p.dna_card?.tech_stack || []).join(', '));
    setKeyResults((p.dna_card?.key_outcomes || []).join(' | '));
    setLimitations((p.dna_card?.limitations || []).join(' | '));
    setAdvisorName(p.dna_card?.advisor_name || '');
    setGithubUrl(p.dna_card?.repository_url || p.assets?.find(a => a.asset_type === 'code_repo')?.resource_url || '');
    setDemoUrl(p.dna_card?.demo_url || '');
    setStatus(p.status ?? 'completed');
    setAcademicYear(p.academic_year || 2568);
    setSaveSuccess(false);
    setErrorMessage('');
  }, []);

  // Load all projects once signed in
  useEffect(() => {
    if (isAuthenticated !== true) return;
    let active = true;
    (async () => {
      try {
        const all = await dnaService.getProjects();
        if (active) setProjects(all);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [isAuthenticated]);

  // Only projects this visitor created
  const myProjects = useMemo(() => {
    if (!myIds) return [];
    return myIds
      .map(id => projects.find(p => p.id === id))
      .filter((p): p is Project => Boolean(p));
  }, [myIds, projects]);

  // Auto-select: honor ?id=<projectId>, otherwise the first owned project.
  // Uses React's documented "adjust state during render" pattern instead of
  // a syncing effect — the update is applied before commit with no cascade.
  // Safe on the server too: myProjects is empty until data loads client-side.
  const [autoSelectedFor, setAutoSelectedFor] = useState<Project[] | null>(null);
  if (myProjects.length > 0 && autoSelectedFor !== myProjects) {
    setAutoSelectedFor(myProjects);
    if (!(selectedId && myProjects.some(p => p.id === selectedId))) {
      const wanted = typeof window !== 'undefined'
        ? new URLSearchParams(window.location.search).get('id')
        : null;
      setSelectedId(
        wanted && myProjects.some(p => p.id === wanted) ? wanted : myProjects[0].id
      );
    }
  }

  // Populate the form whenever the selection or project data changes.
  // Same render-phase adjustment pattern as above.
  const current = myProjects.find(p => p.id === selectedId);
  const [formLoadedFrom, setFormLoadedFrom] = useState<{ id: string | null; source: Project[] } | null>(null);
  if (current && (
    formLoadedFrom?.id !== selectedId || formLoadedFrom.source !== myProjects
  )) {
    setFormLoadedFrom({ id: selectedId, source: myProjects });
    loadFormFrom(current);
  }

  const handleSave = async () => {
    if (!selectedId) return;
    if (!titleTh.trim()) {
      setErrorMessage('กรุณากรอกชื่อโครงงานภาษาไทย');
      return;
    }

    setIsSaving(true);
    setSaveSuccess(false);
    setErrorMessage('');

    const updated = await dnaService.updateProject(selectedId, {
      title_th: titleTh,
      title_en: titleEn,
      abstract_th: abstractTh,
      academic_year: academicYear,
      status,
      dna_card: {
        problem_statement: problemStatement,
        tech_stack: techStackInput.split(',').map(t => t.trim()).filter(Boolean),
        key_outcomes: keyResults.split('|').map(s => s.trim()).filter(Boolean),
        limitations: limitations.split('|').map(s => s.trim()).filter(Boolean),
        advisor_name: advisorName,
        repository_url: githubUrl,
        demo_url: demoUrl
      }
    });

    setIsSaving(false);

    if (!updated) {
      setErrorMessage('ไม่พบโครงงานนี้ในระบบ อาจถูกลบหรือเปิดจากเครื่องอื่น');
      return;
    }

    setProjects(prev => prev.map(p => (p.id === updated.id ? updated : p)));

    const syncWarning = dnaService.getLastSyncWarning();
    if (syncWarning) {
      setErrorMessage(`บันทึกสำเร็จในเครื่อง แต่ซิงก์ขึ้นฐานข้อมูลไม่สำเร็จ (${syncWarning})`);
    } else {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  };

  // ── Auth check in flight ──
  if (isAuthenticated !== true) {
    return (
      <div className="min-h-screen bg-[#F4F5F7] flex items-center justify-center font-sans">
        <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" aria-label="กำลังโหลด" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F5F7] text-slate-900 font-sans flex flex-col">

      {/* Top Header */}
      <header className="px-6 py-4 border-b border-slate-200/80 bg-white flex items-center justify-between sticky top-0 z-30">
        <Link href="/" className="flex items-center space-x-2 text-xs font-bold text-slate-700 hover:text-amber-800 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>กลับสู่หน้าหลักคลังโครงงาน</span>
        </Link>

        <div className="flex items-center space-x-2">
          <Logo className="w-8 h-8" />
          <span className="font-display font-bold text-sm text-slate-900">Project DNA</span>
          <span className="text-[11px] font-mono text-slate-400">· จัดการโครงงานของฉัน</span>
        </div>
      </header>

      <main className="max-w-6xl w-full mx-auto p-4 md:p-8 space-y-6 flex-1">

        {/* Page Banner */}
        <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-card flex items-start space-x-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center shrink-0">
            <PencilLine className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h1 className="font-display text-xl md:text-2xl font-bold tracking-tight">แก้ไขโครงงานของฉัน</h1>
            <p className="text-xs md:text-sm text-slate-300 leading-relaxed mt-1">
              เลือกโครงงานที่คุณเคยเพิ่มไว้ ปรับปรุงพิมพ์เขียว DNA ให้เป็นปัจจุบัน แล้วบันทึกให้รุ่นน้องใช้ข้อมูลที่ถูกต้องที่สุด
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" aria-label="กำลังโหลดข้อมูล" />
          </div>
        ) : myProjects.length === 0 ? (
          /* Empty state */
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-slate-100 flex items-center justify-center">
              <FolderOpen className="w-7 h-7 text-slate-400" />
            </div>
            <h2 className="font-display text-lg font-bold text-slate-900">ยังไม่มีโครงงานที่คุณเพิ่มไว้</h2>
            <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
              โครงงานที่คุณเพิ่มจากหน้า &ldquo;เพิ่มโปรเจกต์&rdquo; จะปรากฏที่นี่เพื่อให้แก้ไขได้ภายหลัง
            </p>
            <Link
              href="/submit"
              className="inline-flex items-center space-x-1.5 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow-xs transition-colors mt-2"
            >
              <GraduationCap className="w-4 h-4" />
              <span>เพิ่มโปรเจกต์แรกของคุณ</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-5 items-start">

            {/* ── Mobile Project Selector (< lg) ── */}
            <div className="lg:hidden bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">
                เลือกโครงงานที่ต้องการแก้ไข:
              </label>
              <select
                value={selectedId || ''}
                onChange={(e) => setSelectedId(e.target.value)}
                className="w-full px-3 py-2 text-xs font-bold text-slate-900 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                {myProjects.map((p) => (
                  <option key={p.id} value={p.id}>
                    [{p.department?.code || 'KU CSC'} {p.academic_year}] {p.title_th}
                  </option>
                ))}
              </select>
            </div>

            {/* ── Desktop Project List (lg+) ── */}
            <aside className="hidden lg:block space-y-2 lg:sticky lg:top-24">
              <h2 className="text-xs font-bold uppercase tracking-wide text-slate-500 px-1">
                โครงงานของฉัน ({myProjects.length})
              </h2>
              {myProjects.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelectedId(p.id)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all ${
                    selectedId === p.id
                      ? 'bg-white border-amber-400 ring-1 ring-amber-400/40 shadow-sm'
                      : 'bg-white/70 border-slate-200 hover:border-slate-300 hover:bg-white'
                  }`}
                >
                  <div className="flex items-center space-x-1.5 mb-1">
                    <span className="px-1.5 py-0.5 bg-slate-950 text-amber-300 font-mono text-[10px] font-bold rounded">
                      {p.department?.code || 'KU'}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">{p.academic_year}</span>
                  </div>
                  <div className={`text-xs font-bold leading-snug line-clamp-2 ${selectedId === p.id ? 'text-amber-900' : 'text-slate-800'}`}>
                    {p.title_th}
                  </div>
                </button>
              ))}
            </aside>

            {/* ── Edit Form ── */}
            <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-5 md:p-7 space-y-5">

              {/* Basic Info */}
              <div className="space-y-4">
                <h2 className="font-display text-base font-bold text-slate-900 flex items-center space-x-2">
                  <Layers className="w-4 h-4 text-amber-600" />
                  <span>ข้อมูลพื้นฐาน</span>
                </h2>

                <div>
                  <label className={labelClass}>ชื่อโครงงาน (ภาษาไทย) *</label>
                  <input type="text" value={titleTh} onChange={(e) => setTitleTh(e.target.value)} className={inputClass} />
                </div>

                <div>
                  <label className={labelClass}>ชื่อโครงงาน (ภาษาอังกฤษ)</label>
                  <input type="text" value={titleEn} onChange={(e) => setTitleEn(e.target.value)} className={inputClass} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>สถานะโครงงาน</label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value as Project['status'])}
                      className="w-full px-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-500 text-slate-900 font-semibold"
                    >
                      {STATUS_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>ปีการศึกษา (พ.ศ.)</label>
                    <select
                      value={academicYear}
                      onChange={(e) => setAcademicYear(Number(e.target.value))}
                      className="w-full px-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-500 text-slate-900 font-semibold"
                    >
                      {[2568, 2567, 2566, 2565].map((yr) => (
                        <option key={yr} value={yr}>{yr}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* DNA Content */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <h2 className="font-display text-base font-bold text-slate-900 flex items-center space-x-2">
                  <PencilLine className="w-4 h-4 text-amber-600" />
                  <span>พิมพ์เขียว DNA</span>
                </h2>

                <div>
                  <label className={labelClass}>บทคัดย่อโครงงาน</label>
                  <textarea rows={4} value={abstractTh} onChange={(e) => setAbstractTh(e.target.value)} className={`${inputClass} leading-relaxed`} />
                </div>

                <div>
                  <label className={labelClass}>โจทย์ปัญหาหลัก</label>
                  <input type="text" value={problemStatement} onChange={(e) => setProblemStatement(e.target.value)} className={inputClass} />
                </div>

                <div>
                  <label className={labelClass}>เทคโนโลยีที่ใช้ (คั่นด้วย , )</label>
                  <input type="text" value={techStackInput} onChange={(e) => setTechStackInput(e.target.value)} className={`${inputClass} font-mono`} />
                </div>

                <div>
                  <label className={labelClass}>ผลการทดสอบสำคัญ (คั่นหลายรายการด้วย | )</label>
                  <input type="text" value={keyResults} onChange={(e) => setKeyResults(e.target.value)} className={inputClass} />
                </div>

                <div>
                  <label className={labelClass}>ข้อจำกัดของโครงงาน (คั่นหลายรายการด้วย | )</label>
                  <input type="text" value={limitations} onChange={(e) => setLimitations(e.target.value)} className={inputClass} />
                </div>

                <div>
                  <label className={labelClass}>อาจารย์ที่ปรึกษา</label>
                  <input type="text" value={advisorName} onChange={(e) => setAdvisorName(e.target.value)} className={inputClass} />
                </div>
              </div>

              {/* Resource Links */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <h2 className="font-display text-base font-bold text-slate-900 flex items-center space-x-2">
                  <FileCode className="w-4 h-4 text-amber-600" />
                  <span>ลิงก์ทรัพยากร</span>
                </h2>

                <div>
                  <label className={labelClass}>GitHub Repository URL</label>
                  <input type="url" value={githubUrl} onChange={(e) => setGithubUrl(e.target.value)} placeholder="https://github.com/..." className={`${inputClass} font-mono`} />
                </div>

                <div>
                  <label className={labelClass}>Demo / เว็บไซต์ตัวอย่าง</label>
                  <input type="url" value={demoUrl} onChange={(e) => setDemoUrl(e.target.value)} placeholder="https://..." className={`${inputClass} font-mono`} />
                </div>
              </div>

              {/* Feedback */}
              {saveSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center space-x-2 text-xs text-emerald-800 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>บันทึกการแก้ไขเรียบร้อยแล้ว</span>
                </div>
              )}
              {errorMessage && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center space-x-2 text-xs text-red-800 font-medium">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Save Bar */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => router.push('/')}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors"
                >
                  ย้อนกลับ
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={isSaving}
                  className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-slate-950 font-bold text-xs rounded-xl shadow-xs flex items-center space-x-2 transition-colors disabled:opacity-50"
                >
                  {isSaving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  <span>{isSaving ? 'กำลังบันทึก...' : 'บันทึกการแก้ไข'}</span>
                </button>
              </div>
            </section>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="px-6 py-4 border-t border-slate-200/70 bg-white flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Logo className="w-6 h-6" />
          <span className="text-[11px] text-slate-400 font-medium">Project DNA · มก.ฉกส.</span>
        </div>
      </footer>
    </div>
  );
}