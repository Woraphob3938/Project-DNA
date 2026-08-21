'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Search, 
  Plus, 
  GraduationCap, 
  Building, 
  Calendar, 
  LogIn, 
  Sparkles, 
  Code, 
  Database, 
  Cpu, 
  GitFork, 
  X,
  Filter,
  RotateCcw,
  SlidersHorizontal,
  ChevronDown
} from 'lucide-react';
import { Faculty, Department, ActiveTab } from '@/types/dna';

interface HeaderProps {
  activeTab?: ActiveTab;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  faculties: Faculty[];
  selectedFaculty: string | null;
  setSelectedFaculty: (id: string | null) => void;
  departments: Department[];
  selectedDept: string | null;
  setSelectedDept: (code: string | null) => void;
  availableYears?: number[];
  selectedYear?: number | null;
  setSelectedYear?: (year: number | null) => void;
  resourceFilter?: string | null;
  setResourceFilter?: (res: string | null) => void;
  onOpenAiMatchModal?: () => void;
  isAiMatchActive?: boolean;
  onClearAiMatch?: () => void;
  onOpenCreateModal: () => void;
  totalProjects: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab = 'explore',
  searchQuery,
  setSearchQuery,
  faculties,
  selectedFaculty,
  setSelectedFaculty,
  departments,
  selectedDept,
  setSelectedDept,
  availableYears = [],
  selectedYear = null,
  setSelectedYear,
  resourceFilter = null,
  setResourceFilter,
  onOpenAiMatchModal,
  isAiMatchActive = false,
  onClearAiMatch,
  onOpenCreateModal,
  totalProjects
}) => {
  const showSearchAndFilters = activeTab === 'explore' || activeTab === 'favorites';

  const availableDepartments = selectedFaculty
    ? departments.filter(d => d.faculty_id === selectedFaculty)
    : departments;

  const hasActiveFilters = Boolean(
    searchQuery || 
    selectedFaculty || 
    selectedDept || 
    selectedYear || 
    resourceFilter || 
    isAiMatchActive
  );

  const handleResetAllFilters = () => {
    setSearchQuery('');
    setSelectedFaculty(null);
    setSelectedDept(null);
    if (setSelectedYear) setSelectedYear(null);
    if (setResourceFilter) setResourceFilter(null);
    if (onClearAiMatch) onClearAiMatch();
  };

  const selectedFacultyObj = faculties.find(f => f.id === selectedFaculty);
  const selectedDeptObj = departments.find(d => d.code === selectedDept || d.id === selectedDept);

  return (
    <header className="bg-white border-b border-slate-200/90 sticky top-0 z-20 transition-all font-sans">
      
      {/* 1. Main Top Brand & Action Bar */}
      <div className="px-6 py-3.5 max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* Title & Campus Branding */}
        <div>
          <h1 className="font-display text-lg md:text-xl font-bold text-slate-900 tracking-tight flex items-center space-x-2">
            <span>DNA : คลังองค์ความรู้ & ต่อยอดโครงงานนิสิต</span>
          </h1>
          <p className="text-[11px] text-slate-500 font-sans">
            มหาวิทยาลัยเกษตรศาสตร์ วิทยาเขตเฉลิมพระเกียรติ จังหวัดสกลนคร (KU CSC)
          </p>
        </div>

        {/* Global Navigation Actions */}
        <div className="flex items-center space-x-2 shrink-0">
          
          {/* Submit Project Button */}
          <Link
            href="/submit"
            className="flex items-center space-x-1.5 px-3.5 py-2 bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-slate-950 font-bold text-xs rounded-xl shadow-xs transition-all shrink-0"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span className="hidden sm:inline">เพิ่มโปรเจกต์</span>
          </Link>

          {/* Login Button */}
          <Link
            href="/login"
            className="flex items-center space-x-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-800 font-semibold text-xs rounded-xl transition-all shrink-0 border border-slate-200/80"
          >
            <LogIn className="w-3.5 h-3.5 text-slate-600" />
            <span className="hidden sm:inline">เข้าสู่ระบบ</span>
          </Link>
        </div>
      </div>

      {/* 2. Compact Unified Search & Filter Command Bar (Only on Explore/Favorites) */}
      {showSearchAndFilters && (
        <div className="px-6 py-2.5 bg-slate-50/80 border-t border-slate-200/70">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2.5">
            
            {/* Left: Sleek Search Input */}
            <div className="relative flex-1 min-w-[240px] max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ค้นหาชื่อโครงงาน, ปัญหา, Tech Stack, หรือคำสำคัญ..."
                className="w-full pl-9.5 pr-8 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-900 placeholder-slate-400 shadow-2xs transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-full w-4.5 h-4.5 flex items-center justify-center text-[10px] transition-colors"
                  aria-label="Clear search"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Right: Compact Filter Dropdowns & AI Matcher Button */}
            <div className="flex items-center flex-wrap gap-2">
              
              {/* Faculty Dropdown */}
              <div className="relative">
                <select
                  value={selectedFaculty || ''}
                  onChange={(e) => {
                    setSelectedFaculty(e.target.value || null);
                    setSelectedDept(null);
                  }}
                  className={`text-xs pl-3 pr-7 py-2 rounded-xl border font-medium bg-white appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-2xs transition-all ${
                    selectedFaculty
                      ? 'border-amber-500 text-slate-950 bg-amber-50/50 font-bold ring-1 ring-amber-400/50'
                      : 'border-slate-200 text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <option value="">🏫 ทุกคณะ</option>
                  {faculties.map((fac) => (
                    <option key={fac.id} value={fac.id}>
                      {fac.short_name} - {fac.name_th}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* Department Dropdown */}
              <div className="relative">
                <select
                  value={selectedDept || ''}
                  onChange={(e) => setSelectedDept(e.target.value || null)}
                  className={`text-xs pl-3 pr-7 py-2 rounded-xl border font-medium bg-white appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-2xs transition-all ${
                    selectedDept
                      ? 'border-amber-500 text-slate-950 bg-amber-50/50 font-bold ring-1 ring-amber-400/50'
                      : 'border-slate-200 text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <option value="">🎓 ทุกสาขาวิชา</option>
                  {availableDepartments.map((dept) => (
                    <option key={dept.id} value={dept.code}>
                      {dept.code} - {dept.name_th}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* Year Dropdown */}
              {availableYears && availableYears.length > 0 && setSelectedYear && (
                <div className="relative">
                  <select
                    value={selectedYear ? String(selectedYear) : ''}
                    onChange={(e) => setSelectedYear(e.target.value ? Number(e.target.value) : null)}
                    className={`text-xs pl-3 pr-7 py-2 rounded-xl border font-medium bg-white appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-2xs transition-all ${
                      selectedYear
                        ? 'border-amber-500 text-slate-950 bg-amber-50/50 font-bold ring-1 ring-amber-400/50'
                        : 'border-slate-200 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <option value="">📅 ทุกปีการศึกษา</option>
                    {availableYears.map((yr) => (
                      <option key={yr} value={yr}>
                        ปี พ.ศ. {yr}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              )}

              {/* Resource Filter Dropdown */}
              {setResourceFilter && (
                <div className="relative">
                  <select
                    value={resourceFilter || ''}
                    onChange={(e) => setResourceFilter(e.target.value || null)}
                    className={`text-xs pl-3 pr-7 py-2 rounded-xl border font-medium bg-white appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-2xs transition-all ${
                      resourceFilter
                        ? 'border-amber-500 text-slate-950 bg-amber-50/50 font-bold ring-1 ring-amber-400/50'
                        : 'border-slate-200 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <option value="">💾 ทรัพยากรทั้งหมด</option>
                    <option value="code">💻 มี Source Code</option>
                    <option value="dataset">📊 มี Dataset</option>
                    <option value="model">🤖 มี AI Model</option>
                    <option value="lineage">🌿 มีสายต่อยอด</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              )}

              {/* AI Matchmaker Trigger Button */}
              {onOpenAiMatchModal && (
                <button
                  onClick={onOpenAiMatchModal}
                  className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl font-bold text-xs shadow-2xs transition-all shrink-0 ${
                    isAiMatchActive
                      ? 'bg-amber-500 text-slate-950 ring-2 ring-amber-400'
                      : 'bg-slate-950 hover:bg-black text-amber-400 active:scale-98'
                  }`}
                  title="เปิดหน้าต่างค้นหาและจับคู่ด้วย AI"
                >
                  <Sparkles className="w-3.5 h-3.5 fill-current" />
                  <span>{isAiMatchActive ? 'AI Match เปิดอยู่' : '⚡ AI ช่วยค้นหา'}</span>
                </button>
              )}

              {/* Reset All Filters Button (Only shown when filters are active) */}
              {hasActiveFilters && (
                <button
                  onClick={handleResetAllFilters}
                  className="px-2.5 py-2 bg-slate-200/80 hover:bg-red-50 hover:text-red-700 text-slate-600 rounded-xl text-xs font-semibold flex items-center space-x-1 transition-colors shadow-2xs"
                  title="ล้างตัวกรองทั้งหมด"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span className="hidden xl:inline">ล้างตัวกรอง</span>
                </button>
              )}

            </div>
          </div>

          {/* 3. Active Filter Badges Bar (Appears dynamically only when filters are active) */}
          {hasActiveFilters && (
            <div className="max-w-7xl mx-auto mt-2 pt-2 border-t border-slate-200/60 flex items-center flex-wrap gap-1.5 text-[11px] animate-in fade-in duration-150">
              <span className="text-slate-400 font-medium mr-1 flex items-center">
                <Filter className="w-3 h-3 mr-1 text-slate-500" /> ตัวกรองที่เปิดอยู่:
              </span>

              {selectedFacultyObj && (
                <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-lg bg-amber-100 text-amber-950 font-medium border border-amber-300">
                  <span>คณะ: {selectedFacultyObj.short_name}</span>
                  <button 
                    onClick={() => { setSelectedFaculty(null); setSelectedDept(null); }}
                    className="hover:text-red-600 font-bold ml-1"
                  >
                    ×
                  </button>
                </span>
              )}

              {selectedDeptObj && (
                <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-lg bg-amber-100 text-amber-950 font-medium border border-amber-300">
                  <span>สาขา: {selectedDeptObj.code}</span>
                  <button 
                    onClick={() => setSelectedDept(null)}
                    className="hover:text-red-600 font-bold ml-1"
                  >
                    ×
                  </button>
                </span>
              )}

              {selectedYear && setSelectedYear && (
                <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-lg bg-slate-200 text-slate-800 font-medium border border-slate-300">
                  <span>ปี {selectedYear}</span>
                  <button 
                    onClick={() => setSelectedYear(null)}
                    className="hover:text-red-600 font-bold ml-1"
                  >
                    ×
                  </button>
                </span>
              )}

              {resourceFilter && setResourceFilter && (
                <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-lg bg-slate-200 text-slate-800 font-medium border border-slate-300">
                  <span>ทรัพยากร: {
                    resourceFilter === 'code' ? 'Code' :
                    resourceFilter === 'dataset' ? 'Dataset' :
                    resourceFilter === 'model' ? 'AI Model' : 'Lineage'
                  }</span>
                  <button 
                    onClick={() => setResourceFilter(null)}
                    className="hover:text-red-600 font-bold ml-1"
                  >
                    ×
                  </button>
                </span>
              )}

              {isAiMatchActive && (
                <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-lg bg-slate-900 text-amber-400 font-bold border border-slate-900">
                  <Sparkles className="w-3 h-3 fill-current" />
                  <span>AI Semantic Match</span>
                  {onClearAiMatch && (
                    <button 
                      onClick={onClearAiMatch}
                      className="hover:text-red-400 font-bold ml-1"
                    >
                      ×
                    </button>
                  )}
                </span>
              )}

              {searchQuery && (
                <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-lg bg-white text-slate-700 font-medium border border-slate-200 shadow-2xs">
                  <span>ค้นหา: &quot;{searchQuery}&quot;</span>
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="hover:text-red-600 font-bold ml-1"
                  >
                    ×
                  </button>
                </span>
              )}

              <button
                onClick={handleResetAllFilters}
                className="text-[11px] text-red-600 hover:text-red-700 font-semibold ml-auto hover:underline"
              >
                ล้างทั้งหมด
              </button>
            </div>
          )}

        </div>
      )}

    </header>
  );
};
