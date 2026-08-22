'use client';

import React, { useState, useEffect } from 'react';
import { 
  DnaCard 
} from '@/components/projects/DnaCard';
import { ProjectDetailDrawer } from '@/components/projects/ProjectDetailDrawer';
import { LineageVisualizer } from '@/components/lineage/LineageVisualizer';
import { ProjectAnalytics } from '@/components/analytics/ProjectAnalytics';
import { InceptionStudioModal } from '@/components/projects/InceptionStudioModal';
import { QuickResourceModal } from '@/components/projects/QuickResourceModal';
import { CreateDnaCardModal } from '@/components/ingestion/CreateDnaCardModal';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';

import { Project, Faculty, Department, Challenge, ProjectLineageEdge, ActiveTab, UserMatchProfile, AiMatchResult } from '@/types/dna';
import { dnaService } from '@/lib/dnaService';
import { isSupabaseConfigured } from '@/lib/supabaseClient';
import { useAuthGate } from '@/hooks/useAuthGate';
import { useFavorites } from '@/hooks/useFavorites';
import { useMyProjectIds, removeMyProjectId } from '@/hooks/useMyProjects';
import { Pagination } from '@/components/projects/Pagination';
import { HomeSkeleton } from '@/components/projects/HomeSkeleton';
import { 
  Sparkles, 
  RefreshCw, 
  Search, 
  Layers, 
  BookmarkCheck,
  FolderOpen,
  Trash2,
  Loader2,
  X
} from 'lucide-react';

export default function Home() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<ActiveTab>('explore');

  // Master Data State
  const [projects, setProjects] = useState<Project[]>([]);
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [lineages, setLineages] = useState<ProjectLineageEdge[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);

  // True when the DB is configured but unreachable — UI shows a fallback notice
  const [isFallbackData, setIsFallbackData] = useState(false);

  // Gated actions (bookmark) bounce signed-out visitors to /login
  const { requireLogin } = useAuthGate();

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFaculty, setSelectedFaculty] = useState<string | null>(null);
  const [selectedDept, setSelectedDept] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [resourceFilter, setResourceFilter] = useState<string | null>(null);

  // Favorites persisted in localStorage via an external store (SSR-safe)
  const [favorites, toggleFavorite] = useFavorites();

  // Ownership registry for the "โครงงานของฉัน" tab
  const { myIds, reload: reloadMyIds } = useMyProjectIds();
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [deletingProjectId, setDeletingProjectId] = useState<string | null>(null);

  // AI Search State
  const [aiMatchResults, setAiMatchResults] = useState<AiMatchResult[] | null>(null);
  const [aiCuratedSummary, setAiCuratedSummary] = useState<string | null>(null);
  const [isAiSearching, setIsAiSearching] = useState(false);
  const [activeUserProfile, setActiveUserProfile] = useState<UserMatchProfile | null>(null);

  // Selected Project for Drawer & Modals
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [inceptionProject, setInceptionProject] = useState<Project | null>(null);
  const [quickModalProject, setQuickModalProject] = useState<Project | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Load Initial Data
  useEffect(() => {
    async function loadInitialData() {
      try {
        setLoading(true);
        const [
          projsData,
          facsData,
          deptsData,
          lineagesData,
          challengesData
        ] = await Promise.all([
          dnaService.getProjects(),
          dnaService.getFaculties(),
          dnaService.getDepartments(),
          dnaService.getLineages(),
          dnaService.getChallenges()
        ]);

        setProjects(projsData);
        setFaculties(facsData);
        setDepartments(deptsData);
        setLineages(lineagesData);
        setChallenges(challengesData);

        // Surface fallback mode when Supabase is configured but unreachable
        setIsFallbackData(isSupabaseConfigured && dnaService.getDataSource() === 'seed');
      } catch (err) {
        console.error('Failed to load initial data:', err);
      } finally {
        setLoading(false);
      }
    }

    loadInitialData();
  }, []);

  // Direct AI Search Handler
  const handleTriggerAiSearch = async (queryText: string) => {
    const q = queryText.trim();
    if (!q) return;

    setIsAiSearching(true);

    const profile: UserMatchProfile = {
      query: q,
      interest_areas: [],
      current_skills: [],
      target_goal: 'general_inspiration'
    };

    try {
      const res = await fetch('/api/ai/match-filter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile })
      });

      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setAiMatchResults(data.data);
        setAiCuratedSummary(data.summary || `AI คัดกรองและจับคู่โครงงานที่สอดคล้องกับ "${q}" พบโครงงานที่มีความเหมาะสมสูงพร้อมพิมพ์เขียวให้ศึกษา`);
        setActiveUserProfile(profile);
      }
    } catch (err) {
      console.warn('AI search trigger error:', err);
    } finally {
      setIsAiSearching(false);
    }
  };

  // Filter and Rank projects based on Search, Faculty, Dept, Year, Resources, and AI Match Results
  const filteredProjects = projects.filter((p) => {
    // Favorites tab filter
    if (activeTab === 'favorites' && !favorites.includes(p.id)) {
      return false;
    }

    // Faculty filter
    if (selectedFaculty && p.department?.faculty_id !== selectedFaculty) {
      return false;
    }

    // Department filter
    if (selectedDept && p.department?.code !== selectedDept) {
      return false;
    }

    // Academic Year filter
    if (selectedYear && p.academic_year !== selectedYear) {
      return false;
    }

    // Resource availability filter
    if (resourceFilter === 'code') {
      const hasCode = p.assets?.some(a => a.asset_type === 'code_repo') || Boolean(p.dna_card?.repository_url);
      if (!hasCode) return false;
    }
    if (resourceFilter === 'dataset') {
      const hasDataset = p.assets?.some(a => a.asset_type === 'dataset');
      if (!hasDataset) return false;
    }
    if (resourceFilter === 'model') {
      const hasModel = p.assets?.some(a => a.asset_type === 'trained_model');
      if (!hasModel) return false;
    }
    if (resourceFilter === 'lineage') {
      const hasLineage = Boolean(p.parent_lineages?.length || p.child_lineages?.length);
      if (!hasLineage) return false;
    }

    // Search query filter (Only applies manual substring search when AI match is NOT active)
    if (!aiMatchResults && searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitleTh = p.title_th?.toLowerCase().includes(q);
      const matchTitleEn = p.title_en?.toLowerCase().includes(q);
      const matchAbstract = p.abstract_th?.toLowerCase().includes(q);
      const matchProblem = p.dna_card?.problem_statement?.toLowerCase().includes(q);
      const matchTech = p.dna_card?.tech_stack?.some(t => t.toLowerCase().includes(q));
      const matchDept = p.department?.name_th?.toLowerCase().includes(q) || p.department?.code?.toLowerCase().includes(q);

      if (!matchTitleTh && !matchTitleEn && !matchAbstract && !matchProblem && !matchTech && !matchDept) {
        return false;
      }
    }

    return true;
  }).sort((a, b) => {
    // If AI Match results exist, sort by match_score descending
    if (aiMatchResults && aiMatchResults.length > 0) {
      const scoreA = aiMatchResults.find(r => r.project_id === a.id)?.match_score || 0;
      const scoreB = aiMatchResults.find(r => r.project_id === b.id)?.match_score || 0;
      return scoreB - scoreA;
    }
    return 0;
  });

  // ── Pagination: 12 projects per page ─────────────────────────────────
  // The page resets to 1 automatically whenever filters change: we derive
  // the effective page from a signature of the active filters instead of
  // syncing it with an effect.
  const PROJECTS_PER_PAGE = 12;
  const filterSignature = [
    activeTab,
    searchQuery,
    selectedFaculty,
    selectedDept,
    selectedYear,
    resourceFilter,
    aiMatchResults ? aiMatchResults.length : -1
  ].join('|');

  const [pageState, setPageState] = useState<{ sig: string; page: number }>({
    sig: filterSignature,
    page: 1
  });
  const requestedPage = pageState.sig === filterSignature ? pageState.page : 1;

  const totalProjectPages = Math.max(1, Math.ceil(filteredProjects.length / PROJECTS_PER_PAGE));
  const currentPage = Math.min(requestedPage, totalProjectPages);
  const goToPage = (page: number) => setPageState({ sig: filterSignature, page });
  const paginatedProjects = filteredProjects.slice(
    (currentPage - 1) * PROJECTS_PER_PAGE,
    currentPage * PROJECTS_PER_PAGE
  );
  const rangeStart = filteredProjects.length === 0 ? 0 : (currentPage - 1) * PROJECTS_PER_PAGE + 1;
  const rangeEnd = Math.min(currentPage * PROJECTS_PER_PAGE, filteredProjects.length);

  // Favorite toggle handler — requires login
  const handleToggleFavorite = (projectId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!requireLogin('/')) return;
    toggleFavorite(projectId);
  };

  // Owner-only delete: remove from DB, local ownership registry and UI state
  const handleDeleteProject = async (project: Project) => {
    if (deletingProjectId) return;
    setDeletingProjectId(project.id);
    try {
      await dnaService.deleteProject(project.id);
      removeMyProjectId(project.id);
      setProjects(prev => prev.filter(p => p.id !== project.id));
      setSelectedProject(null);
      reloadMyIds();
    } finally {
      setDeletingProjectId(null);
      setConfirmDeleteId(null);
    }
  };

  // Projects owned by the signed-in visitor (โครงงานของฉัน tab)
  const ownedProjects = myIds ? projects.filter(p => myIds.includes(p.id)) : [];

  // Add new project handler
  const handleSuccessCreate = async (newProjData: Partial<Project>) => {
    const created = await dnaService.createProject(newProjData);
    setProjects(prev => [created, ...prev]);
    setSelectedProject(created);
    setActiveTab('explore');
  };

  return (
    <div className="flex min-h-screen bg-[#F4F5F7] text-slate-900 font-sans">
      
      {/* 1. Left Yellow Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenCreateModal={() => setIsCreateModalOpen(true)}
        favoriteCount={favorites.length}
        myProjectCount={myIds?.length ?? 0}
      />

      {/* 2. Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Sticky Header with Unified Search Bar & Dropdown Filters */}
        <Header
          activeTab={activeTab}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onTriggerAiSearch={handleTriggerAiSearch}
          isAiSearching={isAiSearching}
          faculties={faculties}
          selectedFaculty={selectedFaculty}
          setSelectedFaculty={setSelectedFaculty}
          departments={departments}
          selectedDept={selectedDept}
          setSelectedDept={setSelectedDept}
          availableYears={Array.from(new Set(projects.map(p => p.academic_year))).filter(Boolean).sort((a, b) => b - a)}
          selectedYear={selectedYear}
          setSelectedYear={setSelectedYear}
          resourceFilter={resourceFilter}
          setResourceFilter={setResourceFilter}
          isAiMatchActive={Boolean(aiMatchResults && aiMatchResults.length > 0)}
          onClearAiMatch={() => {
            setAiMatchResults(null);
            setAiCuratedSummary(null);
            setActiveUserProfile(null);
          }}
          onOpenCreateModal={() => setIsCreateModalOpen(true)}
          totalProjects={projects.length}
        />

        {/* Fallback-data notice — the DB is configured but unreachable */}
        {isFallbackData && (
          <div className="px-6 md:px-8 pt-4">
            <div className="max-w-7xl mx-auto flex items-center space-x-2.5 text-xs font-medium text-amber-900 bg-amber-50 border border-amber-300 rounded-xl px-4 py-2.5">
              <span aria-hidden="true">⚠️</span>
              <span>
                ไม่สามารถเชื่อมต่อฐานข้อมูลได้ — กำลังแสดงข้อมูลตัวอย่าง (Seed Data)
                โครงงานที่บันทึกเพิ่มอาจไม่ถูกเก็บถาวร
              </span>
            </div>
          </div>
        )}

        {/* Tab View Switching */}
        <main className="flex-1 overflow-x-hidden p-6 md:p-8">
          
          {/* TAB 1: Explore / Catalog Grid & Detail Panel */}
          {(activeTab === 'explore' || activeTab === 'favorites') && (
            <div className="max-w-7xl mx-auto space-y-6">

              {loading ? (
                <HomeSkeleton />
              ) : (
                <>
              {/* AI Curated Knowledge & Blueprint Summary Card (When AI Match/Search is Active) */}
              {aiMatchResults && aiMatchResults.length > 0 && (
                <div className="p-5 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 text-white rounded-2xl border border-amber-500/40 shadow-soft space-y-3 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-amber-400 text-xs font-bold font-mono">
                      <Sparkles className="w-4 h-4 fill-current" />
                      <span>AI CURATED RESEARCH DNA INSIGHT</span>
                    </div>
                    <button
                      onClick={() => {
                        setAiMatchResults(null);
                        setAiCuratedSummary(null);
                        setActiveUserProfile(null);
                      }}
                      className="text-xs text-slate-400 hover:text-white flex items-center space-x-1 transition-colors px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>ล้างผลการวิเคราะห์</span>
                    </button>
                  </div>

                  <p className="text-xs md:text-sm text-slate-200 leading-relaxed font-sans">
                    {aiCuratedSummary || `AI ได้ทำการวิเคราะห์และคัดกรองพิมพ์เขียวโครงงานที่เกี่ยวข้องกับโจทย์ที่คุณต้องการ เรียงลำดับตามความสอดคล้องของเทคโนโลยีและผลลัพธ์:`}
                  </p>

                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between flex-wrap gap-2 text-xs">
                    <div className="flex items-center space-x-1.5 text-[11px] text-amber-300 font-mono">
                      <span>🎯 อันดับ 1 ความเหมาะสมสูงสุด:</span>
                      <strong className="text-white">
                        {projects.find(p => p.id === aiMatchResults[0]?.project_id)?.title_th || `โครงงาน ID: ${aiMatchResults[0]?.project_id}`}
                      </strong>
                      <span className="px-1.5 py-0.5 bg-amber-500 text-slate-950 rounded font-bold">
                        {aiMatchResults[0]?.match_score}% Match
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-400">
                      💡 คลิกที่การ์ดโครงงานเพื่อดูพิมพ์เขียว DNA และดาวน์โหลดทรัพยากร
                    </div>
                  </div>
                </div>
              )}

              {/* Section Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-display text-xl font-bold text-slate-900 flex items-center space-x-2.5">
                    {activeTab === 'favorites' ? (
                      <>
                        <BookmarkCheck className="w-5 h-5 text-amber-600" />
                        <span>โครงงานที่บันทึกไว้</span>
                      </>
                    ) : (
                      <>
                        <Layers className="w-5 h-5 text-amber-600" />
                        <span>คลัง DNA โครงงานนิสิต มก.ฉกส.</span>
                      </>
                    )}
                    <span className="text-xs font-mono font-medium text-slate-600 bg-white px-2.5 py-0.5 rounded-md border border-slate-200 shadow-2xs">
                      {filteredProjects.length} โครงงาน
                    </span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    สำรวจพิมพ์เขียว DNA, ช่องว่างต่อยอดองค์ความรู้ และดาวน์โหลดทรัพยากร
                  </p>
                </div>

                {/* Clear Filter Button */}
                {(selectedFaculty !== null || selectedDept !== null || selectedYear !== null || resourceFilter !== null || searchQuery || aiMatchResults) && (
                  <button
                    onClick={() => {
                      setSelectedFaculty(null);
                      setSelectedDept(null);
                      setSelectedYear(null);
                      setResourceFilter(null);
                      setSearchQuery('');
                      setAiMatchResults(null);
                      setAiCuratedSummary(null);
                      setActiveUserProfile(null);
                    }}
                    className="text-xs font-bold text-amber-900 bg-amber-100 hover:bg-amber-200 px-3 py-1.5 rounded-lg transition-colors flex items-center space-x-1.5 shadow-2xs"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>ล้างตัวกรองทั้งหมด</span>
                  </button>
                )}
              </div>

              {/* Grid of Compact DNA Cards */}
              {filteredProjects.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {paginatedProjects.map((project) => (
                    <DnaCard
                      key={project.id}
                      project={project}
                      isSelected={selectedProject?.id === project.id}
                      onSelect={(p) => setSelectedProject(prev => prev?.id === p.id ? null : p)}
                      isFavorite={favorites.includes(project.id)}
                      onToggleFavorite={handleToggleFavorite}
                      aiMatchResult={aiMatchResults?.find(r => r.project_id === project.id)}
                    />
                  ))}
                </div>
              ) : (
                <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 shadow-soft space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center mx-auto">
                    <Search className="w-5 h-5" />
                  </div>
                  <h3 className="font-display text-base font-bold text-slate-900">ไม่พบโครงงานที่ตรงกับเงื่อนไขการค้นหา</h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    ลองปรับเปลี่ยนคำค้นหา หรือกดล้างตัวกรองเพื่อสำรวจโครงงานทั้งหมดในระบบ
                  </p>
                  <button
                    onClick={() => {
                      setSelectedFaculty(null);
                      setSelectedDept(null);
                      setSelectedYear(null);
                      setSearchQuery('');
                      setAiMatchResults(null);
                      setAiCuratedSummary(null);
                    }}
                    className="px-4 py-2 bg-slate-900 text-amber-400 text-xs font-bold rounded-lg transition-colors hover:bg-slate-800"
                  >
                    รีเซ็ตการค้นหา
                  </button>
                </div>
              )}

              {/* Pagination — 12 projects/page, numbered buttons + jump input */}
              {totalProjectPages > 1 && (
                <div className="space-y-2">
                  <p className="text-[11px] text-slate-500 font-medium">
                    แสดง {rangeStart}–{rangeEnd} จาก {filteredProjects.length} โครงงาน
                  </p>
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalProjectPages}
                    onPageChange={goToPage}
                  />
                </div>
              )}
                </>
              )}
            </div>
          )}

          {/* TAB 5: My Projects — owned catalog with inline delete */}
          {activeTab === 'my-projects' && (
            <div className="max-w-7xl mx-auto space-y-6">
              {loading ? (
                <HomeSkeleton />
              ) : (
                <>
                  {/* Section Header */}
                  <div>
                    <h2 className="font-display text-xl font-bold text-slate-900 flex items-center space-x-2.5">
                      <FolderOpen className="w-5 h-5 text-amber-600" />
                      <span>โครงงานของฉัน</span>
                      <span className="text-xs font-mono font-medium text-slate-600 bg-white px-2.5 py-0.5 rounded-md border border-slate-200 shadow-2xs">
                        {ownedProjects.length} โครงงาน
                      </span>
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">
                      โครงงานที่คุณสร้างและเผยแพร่เข้าคลัง — กดปุ่ม &quot;ลบ&quot; บนการ์ดเพื่อนำออกถาวร
                    </p>
                  </div>

                  {ownedProjects.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                      {ownedProjects.map((project) => (
                        <div key={project.id} className="relative group/my">
                          <DnaCard
                            project={project}
                            isSelected={selectedProject?.id === project.id}
                            onSelect={(p) => setSelectedProject(prev => prev?.id === p.id ? null : p)}
                            isFavorite={favorites.includes(project.id)}
                            onToggleFavorite={handleToggleFavorite}
                            aiMatchResult={aiMatchResults?.find(r => r.project_id === project.id)}
                          />

                          {/* Inline delete — appears on hover, two-step confirm */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (deletingProjectId) return;
                              if (confirmDeleteId !== project.id) {
                                setConfirmDeleteId(project.id);
                                return;
                              }
                              void handleDeleteProject(project);
                            }}
                            disabled={deletingProjectId === project.id}
                            aria-label={`ลบ ${project.title_th}`}
                            title={confirmDeleteId === project.id ? 'กดอีกครั้งเพื่อยืนยันการลบถาวร' : 'ลบโครงงานนี้'}
                            className={`absolute top-2 right-2 z-30 flex items-center space-x-1 px-2 py-1 text-[11px] font-bold rounded-lg border shadow-md transition-all ${
                              confirmDeleteId === project.id
                                ? 'bg-red-600 hover:bg-red-500 text-white border-red-400 opacity-100'
                                : 'bg-slate-950/80 hover:bg-red-600 text-white/90 hover:text-white border-white/20 opacity-0 group-hover/my:opacity-100 focus:opacity-100'
                            }`}
                          >
                            {deletingProjectId === project.id ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                              <Trash2 className="w-3 h-3" />
                            )}
                            <span>{confirmDeleteId === project.id ? 'ยืนยันลบ?' : 'ลบ'}</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 shadow-soft space-y-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center mx-auto">
                        <FolderOpen className="w-5 h-5" />
                      </div>
                      <h3 className="font-display text-base font-bold text-slate-900">ยังไม่มีโครงงานของคุณ</h3>
                      <p className="text-xs text-slate-500 max-w-sm mx-auto">
                        เริ่มสร้าง DNA Card แรกของคุณ — วางบทคัดย่อแล้วให้ AI จัดการที่เหลือ
                      </p>
                      <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="px-4 py-2 bg-slate-900 text-amber-400 text-xs font-bold rounded-lg transition-colors hover:bg-slate-800"
                      >
                        + เพิ่มโครงงานใหม่
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* TAB 2: Visual Lineage Graph Tree */}
          {activeTab === 'lineage' && (
            <div className="max-w-7xl mx-auto space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-display text-xl font-bold text-slate-900">สายวิวัฒนาการและการต่อยอด (Project Lineage)</h2>
                  <p className="text-xs text-slate-500 mt-1">
                    สำรวจความเชื่อมโยงของงานวิจัยจากรุ่นสู่รุ่น เห็นทิศทางการต่อยอดข้ามสาขาวิชาใน มก.ฉกส.
                  </p>
                </div>
              </div>

              <LineageVisualizer
                projects={projects}
                lineages={lineages}
                onSelectProject={(project) => setSelectedProject(project)}
                onOpenInceptionStudio={(project) => setInceptionProject(project)}
              />
            </div>
          )}

          {/* TAB 4: Analytics Dashboard */}
          {activeTab === 'analytics' && (
            <div className="max-w-7xl mx-auto space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-display text-xl font-bold text-slate-900">สถิติและผลกระทบของคลังโครงงาน (Analytics)</h2>
                  <p className="text-xs text-slate-500 mt-1">
                    ภาพรวมความก้าวหน้า ทรัพยากรที่เปิดให้ดาวน์โหลด และอัตราการต่อยอดงานวิจัย
                  </p>
                </div>
              </div>

              <ProjectAnalytics 
                projects={projects} 
                faculties={faculties}
                challenges={challenges}
              />
            </div>
          )}

        </main>
      </div>

      {/* 3. Detail Drawer Component */}
      {selectedProject && (
        <ProjectDetailDrawer
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
          isFavorite={favorites.includes(selectedProject.id)}
          onToggleFavorite={(id) => handleToggleFavorite(id)}
          onOpenInceptionStudio={(project) => setInceptionProject(project)}
          onOpenQuickModal={(project) => setQuickModalProject(project)}
          onDelete={handleDeleteProject}
          onViewLineage={(project) => {
            setSelectedProject(project);
            setActiveTab('lineage');
          }}
        />
      )}

      {/* 4. Inception Studio Modal (ต่อยอดโครงงาน) */}
      <InceptionStudioModal
        parentProject={inceptionProject}
        challenges={challenges}
        isOpen={Boolean(inceptionProject)}
        onClose={() => setInceptionProject(null)}
        onSuccessCreate={handleSuccessCreate}
      />

      {/* 5. Quick Resource Modal */}
      <QuickResourceModal
        project={quickModalProject}
        isOpen={Boolean(quickModalProject)}
        onClose={() => setQuickModalProject(null)}
      />

      {/* 6. Create Project Modal — mounted only while open so each session starts with a fresh form */}
      {isCreateModalOpen && (
        <CreateDnaCardModal
          isOpen
          onClose={() => setIsCreateModalOpen(false)}
          departments={departments}
          faculties={faculties}
          onSuccessCreate={handleSuccessCreate}
        />
      )}

    </div>
  );
}
