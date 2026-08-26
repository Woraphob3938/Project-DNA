'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  RotateCcw, 
  ExternalLink, 
  GitFork, 
  FileCode, 
  Database, 
  Cpu, 
  Layers, 
  ChevronRight, 
  Filter, 
  Search, 
  GraduationCap, 
  Building, 
  Users, 
  ArrowLeft,
  Check,
  AlertTriangle,
  Plus,
  BarChart3,
  Calendar,
  FolderCheck
} from 'lucide-react';

import { Project, Faculty, Department } from '@/types/dna';
import { dnaService } from '@/lib/dnaService';
import { AdvisorReviewModal } from '@/components/advisor/AdvisorReviewModal';

export default function AdvisorDashboardPage() {
  // Master Data
  const [projects, setProjects] = useState<Project[]>([]);
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);

  // Scope Toggle: 'my_advised' | 'department_all'
  const [scope, setScope] = useState<'my_advised' | 'department_all'>('my_advised');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedYear, setSelectedYear] = useState<number | null>(null);

  // Selected Project for Review Modal
  const [reviewingProject, setReviewingProject] = useState<Project | null>(null);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' } | null>(null);

  // Current Teacher Profile
  const currentAdvisor = {
    name: 'ผศ.ดร. นคร พัฒนา',
    title: 'ผู้ช่วยศาสตราจารย์',
    departmentCode: 'CPE',
    departmentName: 'สาขาวิชาวิศวกรรมคอมพิวเตอร์',
    facultyName: 'คณะวิทยาศาสตร์และวิศวกรรมศาสตร์ (KUSE)',
    campus: 'มหาวิทยาลัยเกษตรศาสตร์ วิทยาเขตเฉลิมพระเกียรติ จ.สกลนคร'
  };

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [projs, facs, depts] = await Promise.all([
          dnaService.getProjects(),
          dnaService.getFaculties(),
          dnaService.getDepartments()
        ]);
        setProjects(projs);
        setFaculties(facs);
        setDepartments(depts);
      } catch (err) {
        console.error('Failed to load advisor dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const showToast = (text: string, type: 'success' | 'info' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Filter projects by Advisor scope & status
  const pendingProjects = projects.filter(p => {
    const isPending = p.status === 'pending_approval' || p.approval_status === 'pending';
    if (scope === 'my_advised') {
      const isMyProject = p.dna_card?.advisor_name?.includes('นคร') || p.dna_card?.advisor_name?.includes('ที่ปรึกษา') || p.department_id === 'dept-cpe';
      return isPending && isMyProject;
    }
    return isPending;
  });

  const approvedProjects = projects.filter(p => {
    const isApproved = p.status !== 'pending_approval' && p.approval_status !== 'pending';
    if (scope === 'my_advised') {
      const isMyProject = p.dna_card?.advisor_name?.includes('นคร') || p.department_id === 'dept-cpe';
      return isApproved && isMyProject;
    }
    return isApproved;
  });

  // KPI Calculations
  const totalForks = approvedProjects.reduce((acc, p) => acc + (p.fork_count || 0), 0);
  const totalOpenAssets = approvedProjects.reduce((acc, p) => acc + (p.assets?.length || 0), 0);

  // Approve Action Handler
  const handleApproveProject = async (projectId: string, advisorNote: string) => {
    await dnaService.updateProjectApprovalStatus(projectId, 'approved', advisorNote);
    
    // Update local state
    setProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        return {
          ...p,
          status: 'completed',
          approval_status: 'approved',
          advisor_feedback: advisorNote,
          reviewed_at: new Date().toISOString()
        };
      }
      return p;
    }));

    showToast('✓ อนุมัติและเผยแพร่โครงงานสู่คลัง DNA เรียบร้อยแล้ว!');
  };

  // Quick Approve Handler (One-Click)
  const handleQuickApprove = async (project: Project, e: React.MouseEvent) => {
    e.stopPropagation();
    const defaultNote = '✓ พิมพ์เขียว DNA ผ่านการตรวจสอบและตรงตามมาตรฐานวิชาการของ มก.ฉกส. อนุญาตให้เผยแพร่สู่สาธารณะ';
    await handleApproveProject(project.id, defaultNote);
  };

  // Request Revision Action Handler
  const handleRequestRevision = async (projectId: string, advisorNote: string) => {
    await dnaService.updateProjectApprovalStatus(projectId, 'needs_revision', advisorNote);
    
    setProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        return {
          ...p,
          status: 'needs_revision',
          approval_status: 'needs_revision',
          advisor_feedback: advisorNote,
          reviewed_at: new Date().toISOString()
        };
      }
      return p;
    }));

    showToast('↩ ส่งข้อเสนอแนะกลับให้นิสิตปรับปรุงแก้ไขเรียบร้อยแล้ว', 'info');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans pb-16">
      
      {/* 1. Top Global Navigation Bar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 px-6 py-3.5 shadow-2xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          
          <div className="flex items-center space-x-3">
            <Link
              href="/"
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center space-x-1.5 transition-colors"
              title="กลับสู่หน้าคลังโครงงานหลัก"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">คลังโครงงาน DNA</span>
            </Link>

            <div className="h-4 w-px bg-slate-200" />

            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-xs shadow-xs">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h1 className="font-display text-base md:text-lg font-bold text-slate-900 tracking-tight">
                ศูนย์ควบคุมอาจารย์ที่ปรึกษา (Advisor Control Center)
              </h1>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center space-x-2.5">
            <Link
              href="/submit"
              className="px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 flex items-center space-x-1.5 transition-colors shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5 text-amber-600" />
              <span>ส่งโครงงานใหม่</span>
            </Link>

            <div className="px-3 py-1.5 bg-amber-50 border border-amber-300/80 rounded-xl text-xs font-bold text-amber-950 flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>โหมดอาจารย์</span>
            </div>
          </div>

        </div>
      </header>

      {/* 2. Advisor Profile & Scope Switcher Banner */}
      <section className="bg-white border-b border-slate-200/80 px-6 py-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          
          {/* Identity Block */}
          <div className="flex items-start space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-amber-400 flex items-center justify-center font-display text-xl font-bold shadow-md shrink-0 border border-slate-700">
              นพ
            </div>
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <h2 className="font-display text-xl font-bold text-slate-900">
                  {currentAdvisor.name}
                </h2>
                <span className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[11px] font-mono font-medium rounded-md border border-slate-200">
                  {currentAdvisor.departmentCode}
                </span>
              </div>
              <p className="text-xs text-slate-600 font-medium">
                {currentAdvisor.departmentName} · {currentAdvisor.facultyName}
              </p>
              <p className="text-[11px] text-slate-400">
                {currentAdvisor.campus}
              </p>
            </div>
          </div>

          {/* Scope Segmented Switcher */}
          <div className="bg-slate-100/90 p-1 rounded-xl border border-slate-200/90 flex items-center space-x-1 self-start md:self-auto">
            <button
              onClick={() => setScope('my_advised')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 ${
                scope === 'my_advised'
                  ? 'bg-white text-slate-950 shadow-xs ring-1 ring-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5 text-amber-600" />
              <span>โครงงานในความดูแลของฉัน ({pendingProjects.length + approvedProjects.length})</span>
            </button>

            <button
              onClick={() => setScope('department_all')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 ${
                scope === 'department_all'
                  ? 'bg-white text-slate-950 shadow-xs ring-1 ring-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Building className="w-3.5 h-3.5 text-slate-500" />
              <span>โครงงานทั้งหมดในภาควิชา ({projects.length})</span>
            </button>
          </div>

        </div>
      </section>

      {/* 3. Main Dashboard Body */}
      <main className="max-w-7xl mx-auto px-6 pt-8 space-y-8">
        
        {/* Metric Ribbon (High-Density KPIs) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          
          {/* Card 1: Pending */}
          <div className="p-4 bg-white rounded-2xl border border-amber-200 shadow-2xs space-y-1">
            <div className="flex items-center justify-between text-slate-500 text-xs">
              <span className="font-medium">รอการอนุมัติ (Pending Triage)</span>
              <Clock className="w-4 h-4 text-amber-500" />
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="font-display text-2xl md:text-3xl font-bold text-amber-600">
                {pendingProjects.length}
              </span>
              <span className="text-xs text-slate-500">โครงงาน</span>
            </div>
            <p className="text-[11px] text-amber-800/80 font-medium">
              ต้องการการตรวจสอบพิมพ์เขียว DNA
            </p>
          </div>

          {/* Card 2: Approved / Published */}
          <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-1">
            <div className="flex items-center justify-between text-slate-500 text-xs">
              <span className="font-medium">อนุมัติและเผยแพร่แล้ว</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="font-display text-2xl md:text-3xl font-bold text-slate-900">
                {approvedProjects.length}
              </span>
              <span className="text-xs text-slate-500">โครงงาน</span>
            </div>
            <p className="text-[11px] text-slate-500">
              อยู่ในคลังกลาง มก.ฉกส.
            </p>
          </div>

          {/* Card 3: Lineage Forks */}
          <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-1">
            <div className="flex items-center justify-between text-slate-500 text-xs">
              <span className="font-medium">การถูกนำไปต่อยอด</span>
              <GitFork className="w-4 h-4 text-slate-700" />
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="font-display text-2xl md:text-3xl font-bold text-slate-900">
                {totalForks}
              </span>
              <span className="text-xs text-slate-500">ครั้ง</span>
            </div>
            <p className="text-[11px] text-slate-500">
              รุ่นน้องนำพิมพ์เขียวไปขยายผล
            </p>
          </div>

          {/* Card 4: Open Assets */}
          <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-1">
            <div className="flex items-center justify-between text-slate-500 text-xs">
              <span className="font-medium">ทรัพยากร Open Academic</span>
              <Database className="w-4 h-4 text-blue-600" />
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="font-display text-2xl md:text-3xl font-bold text-slate-900">
                {totalOpenAssets}
              </span>
              <span className="text-xs text-slate-500">รายการ</span>
            </div>
            <p className="text-[11px] text-slate-500">
              Code, Dataset & Schematics
            </p>
          </div>

        </div>

        {/* 4. Actionable Triage Queue (กล่องงานรออนุมัติ - โฟกัสสูงสุด) */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <h2 className="font-display text-lg font-bold text-slate-900">
                กล่องงานรอการอนุมัติ (Actionable Triage Queue)
              </h2>
              <span className="px-2 py-0.5 bg-amber-100 text-amber-950 font-mono text-xs font-bold rounded-md">
                {pendingProjects.length} รายการ
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block">
              ตรวจสอบความถูกต้องและกดอนุมัติเพื่อนำขึ้นสู่คลังสาธารณะ
            </p>
          </div>

          {pendingProjects.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {pendingProjects.map((project) => {
                const dna = project.dna_card;
                const hasCode = Boolean(dna?.repository_url || project.assets?.some(a => a.asset_type === 'code_repo'));
                const hasDataset = Boolean(dna?.dataset_description || project.assets?.some(a => a.asset_type === 'dataset'));
                const hasHardware = Boolean(dna?.hardware_specs || project.assets?.some(a => a.asset_type === 'circuit_schematic'));

                return (
                  <div
                    key={project.id}
                    onClick={() => setReviewingProject(project)}
                    className="group bg-white rounded-2xl border border-amber-300/80 hover:border-amber-500 p-5 shadow-2xs hover:shadow-md transition-all cursor-pointer space-y-4"
                  >
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
                      
                      {/* Left: Info */}
                      <div className="space-y-1.5 flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 text-xs">
                          <span className="px-2 py-0.5 bg-slate-900 text-amber-300 font-mono text-[10px] font-bold rounded">
                            {project.department?.code || 'KU CSC'}
                          </span>
                          <span className="text-slate-500 font-medium">{project.department?.name_th}</span>
                          <span className="text-slate-300">·</span>
                          <span className="text-slate-500">ปี {project.academic_year}</span>
                          <span className="px-2 py-0.5 bg-amber-50 text-amber-900 border border-amber-300 rounded font-bold text-[10px] flex items-center space-x-1">
                            <Clock className="w-3 h-3 text-amber-600" />
                            <span>รอตรวจสอบ</span>
                          </span>
                        </div>

                        <h3 className="font-display text-base font-bold text-slate-900 group-hover:text-amber-700 transition-colors">
                          {project.title_th}
                        </h3>
                        <p className="text-xs text-slate-500 font-medium">
                          {project.title_en}
                        </p>

                        {/* Student Authors */}
                        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-slate-600">
                          <span className="text-slate-400 flex items-center font-medium">
                            <Users className="w-3 h-3 mr-1" /> นิสิต:
                          </span>
                          {dna?.student_authors?.map((author, i) => (
                            <span key={i} className="font-medium bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                              {author.name} <span className="text-slate-400 font-mono text-[11px]">({author.student_id})</span>
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Right: AI Pre-Audit Health & Actions */}
                      <div className="flex flex-col sm:flex-row md:flex-col items-end justify-between gap-3 shrink-0">
                        
                        {/* AI Pre-Check Pill */}
                        <div className="px-2.5 py-1 bg-amber-50 border border-amber-200 rounded-lg text-xs font-mono font-bold text-amber-950 flex items-center space-x-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-amber-600 fill-current" />
                          <span>AI DNA Score: 95%</span>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={(e) => handleQuickApprove(project, e)}
                            className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold rounded-xl border border-emerald-200 transition-colors shadow-2xs flex items-center space-x-1"
                            title="อนุมัติและเผยแพร่ทันทีด้วยคำรับรองมาตรฐาน"
                          >
                            <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                            <span>อนุมัติทันที</span>
                          </button>

                          <button
                            onClick={() => setReviewingProject(project)}
                            className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-amber-300 text-xs font-bold rounded-xl transition-colors shadow-2xs flex items-center space-x-1"
                          >
                            <span>ตรวจสอบ DNA</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </div>

                      </div>

                    </div>

                    {/* Bottom Mini Checklist */}
                    <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-500">
                      <div className="flex items-center space-x-3">
                        <span className={`flex items-center space-x-1 ${hasCode ? 'text-emerald-700' : 'text-slate-400'}`}>
                          <FileCode className="w-3.5 h-3.5" />
                          <span>{hasCode ? 'ซอร์สโค้ดครบ' : 'ไม่มีโค้ด'}</span>
                        </span>
                        <span className={`flex items-center space-x-1 ${hasDataset ? 'text-emerald-700' : 'text-slate-400'}`}>
                          <Database className="w-3.5 h-3.5" />
                          <span>{hasDataset ? 'มีชุดข้อมูล' : 'ไม่มี Dataset'}</span>
                        </span>
                        <span className={`flex items-center space-x-1 ${hasHardware ? 'text-emerald-700' : 'text-slate-400'}`}>
                          <Cpu className="w-3.5 h-3.5" />
                          <span>{hasHardware ? 'มีแบบวงจร' : '—'}</span>
                        </span>
                      </div>

                      <span className="text-[11px] text-slate-400 font-mono">
                        คลิกที่การ์ดเพื่อเปิดดูรายละเอียดทั้งหมด
                      </span>
                    </div>

                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 space-y-2 shadow-2xs">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="font-display text-sm font-bold text-slate-900">
                ไม่มีโครงงานค้างรอการตรวจสอบ
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                โครงงานทุกชิ้นในความดูแลของท่านได้รับการอนุมัติและเผยแพร่ลงสู่คลัง DNA เรียบร้อยแล้ว
              </p>
            </div>
          )}
        </section>

        {/* 5. Advised Projects Archive (โครงงานที่อนุมัติแล้วในคลัง) */}
        <section className="space-y-4 pt-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center space-x-2">
              <FolderCheck className="w-5 h-5 text-emerald-600" />
              <h2 className="font-display text-lg font-bold text-slate-900">
                โครงงานที่อนุมัติและเผยแพร่แล้ว (Published Archives)
              </h2>
              <span className="px-2 py-0.5 bg-slate-100 text-slate-700 font-mono text-xs font-bold rounded-md">
                {approvedProjects.length} โครงงาน
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ค้นหาโครงงานที่อนุมัติแล้ว..."
                  className="pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 w-48 sm:w-60 shadow-2xs"
                />
              </div>
            </div>
          </div>

          {/* Table / Dense Grid */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="divide-y divide-slate-100">
              {approvedProjects
                .filter(p => !searchQuery || p.title_th.toLowerCase().includes(searchQuery.toLowerCase()))
                .map((project) => (
                  <div key={project.id} className="p-4 hover:bg-slate-50/80 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    
                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex items-center space-x-2 text-xs">
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-700 font-mono font-semibold rounded text-[10px]">
                          {project.department?.code || 'KU CSC'}
                        </span>
                        <span className="text-slate-400">·</span>
                        <span className="text-slate-500 font-medium">ปี {project.academic_year}</span>
                        <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded font-bold text-[10px]">
                          ✓ เผยแพร่แล้ว
                        </span>
                      </div>

                      <h4 className="font-display text-sm font-bold text-slate-900 truncate">
                        {project.title_th}
                      </h4>
                      <p className="text-xs text-slate-500 truncate">
                        {project.dna_card?.problem_statement || project.abstract_th}
                      </p>
                    </div>

                    {/* Metrics & Action Link */}
                    <div className="flex items-center space-x-4 shrink-0 text-xs">
                      
                      <div className="text-right hidden md:block">
                        <div className="flex items-center space-x-1 text-slate-700 font-mono font-semibold">
                          <GitFork className="w-3.5 h-3.5 text-slate-400" />
                          <span>{project.fork_count || 0} ต่อกิ่ง</span>
                        </div>
                        <span className="text-[10px] text-slate-400">Lineage citations</span>
                      </div>

                      <Link
                        href="/"
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded-xl transition-colors flex items-center space-x-1 shadow-2xs"
                      >
                        <span>ดูในคลัง</span>
                        <ExternalLink className="w-3 h-3 text-slate-500" />
                      </Link>

                    </div>

                  </div>
                ))}
            </div>
          </div>
        </section>

      </main>

      {/* 6. Advisor Inspection & Approval Modal Drawer */}
      <AdvisorReviewModal
        project={reviewingProject}
        isOpen={Boolean(reviewingProject)}
        onClose={() => setReviewingProject(null)}
        onApprove={handleApproveProject}
        onRequestRevision={handleRequestRevision}
      />

      {/* 7. Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 bg-slate-950 text-white text-xs font-semibold rounded-2xl shadow-xl border border-slate-700 flex items-center space-x-2 animate-in slide-in-from-bottom-5">
          <Sparkles className="w-4 h-4 text-amber-400 fill-current" />
          <span>{toastMessage.text}</span>
        </div>
      )}

    </div>
  );
}
