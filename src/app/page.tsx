'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { DnaCard } from '@/components/projects/DnaCard';
import { ProjectDetailDrawer } from '@/components/projects/ProjectDetailDrawer';
import { LineageVisualizer } from '@/components/lineage/LineageVisualizer';
import { ChallengesHub } from '@/components/challenges/ChallengesHub';
import { ProjectAnalytics } from '@/components/analytics/ProjectAnalytics';
import { InceptionStudioModal } from '@/components/projects/InceptionStudioModal';
import { QuickResourceModal } from '@/components/projects/QuickResourceModal';
import { CreateDnaCardModal } from '@/components/ingestion/CreateDnaCardModal';

import { dnaService } from '@/lib/dnaService';
import { 
  Project, 
  Faculty, 
  Department, 
  ProjectLineageEdge, 
  Challenge, 
  ActiveTab 
} from '@/types/dna';
import { RefreshCw, Search, BookmarkCheck, Layers } from 'lucide-react';

export default function HomePage() {
  // State management
  const [activeTab, setActiveTab] = useState<ActiveTab>('explore');
  const [projects, setProjects] = useState<Project[]>([]);
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [lineages, setLineages] = useState<ProjectLineageEdge[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFaculty, setSelectedFaculty] = useState<string | null>(null);
  const [selectedDept, setSelectedDept] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);

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
      } catch (err) {
        console.error('Failed to load initial data:', err);
      } finally {
        setLoading(false);
      }
    }

    loadInitialData();

    // Load saved favorites from localStorage
    try {
      const savedFavs = localStorage.getItem('project_dna_favs');
      if (savedFavs) {
        setFavorites(JSON.parse(savedFavs));
      }
    } catch {
      // ignore
    }
  }, []);

  // Save favorites to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('project_dna_favs', JSON.stringify(favorites));
    } catch {
      // ignore
    }
  }, [favorites]);

  // Filter projects based on Search, Faculty, Dept, and Favorites tab
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

    // Search query filter
    if (searchQuery.trim()) {
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
  });

  // Favorite toggle handler
  const handleToggleFavorite = (projectId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setFavorites(prev =>
      prev.includes(projectId) ? prev.filter(id => id !== projectId) : [...prev, projectId]
    );
  };

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
      />

      {/* 2. Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Sticky Header */}
        <Header
          activeTab={activeTab}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          faculties={faculties}
          selectedFaculty={selectedFaculty}
          setSelectedFaculty={setSelectedFaculty}
          departments={departments}
          selectedDept={selectedDept}
          setSelectedDept={setSelectedDept}
          availableYears={Array.from(new Set(projects.map(p => p.academic_year))).filter(Boolean).sort((a, b) => b - a)}
          selectedYear={selectedYear}
          setSelectedYear={setSelectedYear}
          onOpenCreateModal={() => setIsCreateModalOpen(true)}
          totalProjects={projects.length}
        />

        {/* Tab View Switching */}
        <main className="flex-1 overflow-x-hidden p-6 md:p-8">
          
          {/* TAB 1: Explore / Catalog Grid & Detail Panel */}
          {(activeTab === 'explore' || activeTab === 'favorites') && (
            <div className="max-w-7xl mx-auto space-y-6">
              
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
                {(selectedFaculty !== null || selectedDept !== null || selectedYear !== null || searchQuery) && (
                  <button
                    onClick={() => {
                      setSelectedFaculty(null);
                      setSelectedDept(null);
                      setSelectedYear(null);
                      setSearchQuery('');
                    }}
                    className="text-xs font-bold text-amber-900 bg-amber-100 hover:bg-amber-200 px-3 py-1.5 rounded-lg transition-colors flex items-center space-x-1.5"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>ล้างตัวกรอง</span>
                  </button>
                )}
              </div>

              {/* Grid of DNA Cards (Fixed columns so card widths never jump) */}
              {filteredProjects.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredProjects.map((project) => (
                    <DnaCard
                      key={project.id}
                      project={project}
                      isSelected={selectedProject?.id === project.id}
                      onSelect={(p) => setSelectedProject(prev => prev?.id === p.id ? null : p)}
                      isFavorite={favorites.includes(project.id)}
                      onToggleFavorite={handleToggleFavorite}
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
                    }}
                    className="px-4 py-2 bg-slate-900 text-amber-400 text-xs font-bold rounded-lg transition-colors hover:bg-slate-800"
                  >
                    รีเซ็ตการค้นหา
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Project Lineage Visualizer */}
          {activeTab === 'lineage' && (
            <LineageVisualizer
              projects={projects}
              lineages={lineages}
              onSelectProject={(p) => {
                setSelectedProject(p);
                setActiveTab('explore');
              }}
              onOpenInceptionStudio={(p) => setInceptionProject(p)}
            />
          )}

          {/* TAB 3: Real-World Challenges & Matching */}
          {activeTab === 'challenges' && (
            <ChallengesHub
              challenges={challenges}
              projects={projects}
              onSelectProject={(p) => {
                setSelectedProject(p);
                setActiveTab('explore');
              }}
            />
          )}

          {/* TAB 4: Project & Knowledge Analytics */}
          {activeTab === 'analytics' && (
            <ProjectAnalytics
              projects={projects}
              faculties={faculties}
              challenges={challenges}
            />
          )}

        </main>
      </div>

      {/* 3. Right-Side Detail Drawer */}
      {selectedProject && (
        <ProjectDetailDrawer
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
          onOpenQuickModal={(p) => setQuickModalProject(p)}
          onOpenInceptionStudio={(p) => setInceptionProject(p)}
          onViewLineage={(p) => setActiveTab('lineage')}
          isFavorite={favorites.includes(selectedProject.id)}
          onToggleFavorite={(id) => handleToggleFavorite(id)}
        />
      )}

      {/* 4. Modals */}
      <QuickResourceModal
        project={quickModalProject}
        isOpen={Boolean(quickModalProject)}
        onClose={() => setQuickModalProject(null)}
      />

      <InceptionStudioModal
        parentProject={inceptionProject}
        challenges={challenges}
        isOpen={Boolean(inceptionProject)}
        onClose={() => setInceptionProject(null)}
        onSuccessCreate={handleSuccessCreate}
      />

      <CreateDnaCardModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        departments={departments}
        faculties={faculties}
        onSuccessCreate={handleSuccessCreate}
      />

    </div>
  );
}
