'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { DnaCard } from '@/components/projects/DnaCard';
import { ProjectDetailDrawer } from '@/components/projects/ProjectDetailDrawer';
import { QuickResourceModal } from '@/components/projects/QuickResourceModal';
import { InceptionStudioModal } from '@/components/projects/InceptionStudioModal';
import { LineageVisualizer } from '@/components/lineage/LineageVisualizer';
import { ChallengesHub } from '@/components/challenges/ChallengesHub';
import { ProjectAnalytics } from '@/components/analytics/ProjectAnalytics';
import { CreateDnaCardModal } from '@/components/ingestion/CreateDnaCardModal';
import { dnaService } from '@/lib/dnaService';
import { Project, Faculty, Department, Challenge, ProjectLineageEdge, ActiveTab } from '@/types/dna';
import { Search, RefreshCw } from 'lucide-react';

export default function Home() {
  // Navigation & View State
  const [activeTab, setActiveTab] = useState<ActiveTab>('explore');
  
  // Data State
  const [projects, setProjects] = useState<Project[]>([]);
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [lineages, setLineages] = useState<ProjectLineageEdge[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFaculty, setSelectedFaculty] = useState<string | null>(null);
  const [selectedDept, setSelectedDept] = useState<string | null>(null);

  // Selection & Modals
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [quickModalProject, setQuickModalProject] = useState<Project | null>(null);
  const [inceptionProject, setInceptionProject] = useState<Project | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Favorites
  const [favorites, setFavorites] = useState<string[]>(['proj-2']);

  // Load initial data
  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const [p, f, d, c, l] = await Promise.all([
          dnaService.getProjects(),
          dnaService.getFaculties(),
          dnaService.getDepartments(),
          dnaService.getChallenges(),
          dnaService.getLineages()
        ]);
        setProjects(p);
        setFaculties(f);
        setDepartments(d);
        setChallenges(c);
        setLineages(l);
        // Default select first project for wireframe fidelity
        if (p.length > 0) {
          setSelectedProject(p[1] || p[0]);
        }
      } catch (err) {
        console.error('Error loading data:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  // Filtered projects
  const filteredProjects = useMemo(() => {
    let result = [...projects];

    // Favorites tab
    if (activeTab === 'favorites') {
      result = result.filter(p => favorites.includes(p.id));
    }

    // Faculty Filter
    if (selectedFaculty !== null) {
      result = result.filter(p => p.department?.faculty_id === selectedFaculty);
    }

    // Department Filter
    if (selectedDept !== null) {
      result = result.filter(p => p.department?.code === selectedDept || p.department_id === selectedDept);
    }

    // Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(p => {
        const titleTh = p.title_th.toLowerCase();
        const titleEn = p.title_en.toLowerCase();
        const abstract = p.abstract_th.toLowerCase();
        const tech = p.dna_card?.tech_stack?.join(' ').toLowerCase() || '';
        const problem = p.dna_card?.problem_statement?.toLowerCase() || '';
        const author = p.dna_card?.student_authors?.map(a => a.name.toLowerCase()).join(' ') || '';
        return (
          titleTh.includes(q) ||
          titleEn.includes(q) ||
          abstract.includes(q) ||
          tech.includes(q) ||
          problem.includes(q) ||
          author.includes(q)
        );
      });
    }

    return result;
  }, [projects, activeTab, favorites, selectedFaculty, selectedDept, searchQuery]);

  // Toggle Favorite
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
      
      {/* 1. Left Yellow Sidebar (Sticky & Floating) */}
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
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          faculties={faculties}
          selectedFaculty={selectedFaculty}
          setSelectedFaculty={setSelectedFaculty}
          departments={departments}
          selectedDept={selectedDept}
          setSelectedDept={setSelectedDept}
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
                  <h2 className="text-xl font-black text-slate-900 flex items-center space-x-2">
                    <span>{activeTab === 'favorites' ? '⭐ โครงงานที่บันทึกไว้' : '📦 คลัง DNA โครงงานนิสิต มก.ฉกส.'}</span>
                    <span className="text-xs font-bold text-slate-400 bg-white px-2.5 py-1 rounded-full border border-slate-200 shadow-2xs">
                      {filteredProjects.length} รายการ
                    </span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    คลิกการ์ดเพื่อเปิดดูพิมพ์เขียว DNA, ช่องว่างต่อยอด AI และลิงก์ดาวน์โหลดซอร์สโค้ด
                  </p>
                </div>

                {/* Clear Filter Button */}
                {(selectedFaculty !== null || selectedDept !== null || searchQuery) && (
                  <button
                    onClick={() => {
                      setSelectedFaculty(null);
                      setSelectedDept(null);
                      setSearchQuery('');
                    }}
                    className="text-xs font-bold text-amber-700 bg-amber-100/70 hover:bg-amber-100 px-3 py-1.5 rounded-xl transition-colors flex items-center space-x-1"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>ล้างตัวกรอง</span>
                  </button>
                )}
              </div>

              {/* Grid of DNA Cards */}
              {filteredProjects.length > 0 ? (
                <div className={`grid grid-cols-1 sm:grid-cols-2 ${selectedProject ? 'xl:grid-cols-3' : 'lg:grid-cols-3 xl:grid-cols-4'} gap-6 transition-all`}>
                  {filteredProjects.map((project) => (
                    <DnaCard
                      key={project.id}
                      project={project}
                      isSelected={selectedProject?.id === project.id}
                      onSelect={(p) => setSelectedProject(p)}
                      isFavorite={favorites.includes(project.id)}
                      onToggleFavorite={handleToggleFavorite}
                    />
                  ))}
                </div>
              ) : (
                <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 shadow-soft space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto">
                    <Search className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-slate-800">ไม่พบโครงงานที่ตรงกับเงื่อนไขการค้นหา</h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    ลองปรับเปลี่ยนคำค้นหา หรือกดล้างตัวกรองเพื่อสำรวจโครงงานทั้งหมดในระบบ
                  </p>
                  <button
                    onClick={() => {
                      setSelectedFaculty(null);
                      setSelectedDept(null);
                      setSearchQuery('');
                    }}
                    className="px-4 py-2 bg-slate-900 text-amber-400 text-xs font-bold rounded-xl"
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

      {/* 3. Right-Side Detail Drawer (Matches wireframe layout) */}
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
      {/* Quick Resource & Download Modal */}
      <QuickResourceModal
        project={quickModalProject}
        isOpen={Boolean(quickModalProject)}
        onClose={() => setQuickModalProject(null)}
      />

      {/* Project Inception Studio Wizard */}
      <InceptionStudioModal
        parentProject={inceptionProject}
        challenges={challenges}
        isOpen={Boolean(inceptionProject)}
        onClose={() => setInceptionProject(null)}
        onSuccessCreate={handleSuccessCreate}
      />

      {/* AI Ingestion / Abstract Parser Modal */}
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
