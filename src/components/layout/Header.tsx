'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Search,
  Plus,
  Sparkles,
  RotateCcw,
  ChevronDown,
  Filter,
  Loader2,
  PencilLine,
  ShieldCheck
} from 'lucide-react';
import { Faculty, Department, ActiveTab } from '@/types/dna';
import { UserMenu } from '@/components/layout/UserMenu';
import { FilterModal } from '@/components/layout/FilterModal';
import { useAuthGate } from '@/hooks/useAuthGate';
interface HeaderProps {
  activeTab?: ActiveTab;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onTriggerAiSearch?: (query: string) => void;
  isAiSearching?: boolean;
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
  isAiMatchActive?: boolean;
  onClearAiMatch?: () => void;
  totalProjects: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab = 'explore',
  searchQuery,
  setSearchQuery,
  onTriggerAiSearch,
  isAiSearching = false,
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
  isAiMatchActive = false,
  onClearAiMatch,
  totalProjects
}) => {
  const showSearchAndFilters = activeTab === 'explore' || activeTab === 'favorites';

  // Gated actions bounce signed-out visitors to /login
  const { requireLogin } = useAuthGate();

  // Unified filter popup state
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSearchHintVisible, setIsSearchHintVisible] = useState(true);

  const activeFilterCount = [
    selectedFaculty,
    selectedDept,
    selectedYear,
    resourceFilter,
    isAiMatchActive ? 'ai' : null
  ].filter(Boolean).length;

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

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      if (onTriggerAiSearch) {
        onTriggerAiSearch(searchQuery);
      }
    }
  };

  const selectedFacultyObj = faculties.find(f => f.id === selectedFaculty);
  const selectedDeptObj = departments.find(d => d.code === selectedDept || d.id === selectedDept);

  return (
    <header className="bg-white border-b border-slate-200/90 sticky top-0 z-20 transition-all font-sans">
      
      {/* 1. Main Top Brand & Action Bar */}
      <div className="px-4 sm:px-6 py-3 max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
        
        {/* Title & Campus Branding */}
        <div className="min-w-0">
          <h1 className="font-display text-sm sm:text-base md:text-xl font-bold text-slate-900 tracking-tight flex items-center space-x-1.5 truncate">
            <span>DNA : คลังต่อยอดโครงงาน</span>
          </h1>
          <p className="text-[10px] sm:text-[11px] text-slate-500 font-sans truncate max-w-[200px] sm:max-w-none">
            มหาวิทยาลัยเกษตรศาสตร์ วิทยาเขตเฉลิมพระเกียรติ จังหวัดสกลนคร (KU CSC)
          </p>
        </div>

        {/* Global Navigation Actions */}
        <div className="flex items-center space-x-1.5 sm:space-x-2 shrink-0">
          
          {/* My Projects — requires login */}
          <Link
            href="/edit"
            onClick={(e) => {
              if (!requireLogin('/edit')) e.preventDefault();
            }}
            className="flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-xl border border-slate-200 transition-all shrink-0"
            title="จัดการโครงงานที่คุณเพิ่มไว้"
          >
            <PencilLine className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-500" />
            <span className="hidden sm:inline">โครงงานของฉัน</span>
          </Link>

          {/* Submit Project Button — requires login */}
          <Link
            href="/submit"
            onClick={(e) => {
              if (!requireLogin('/submit')) e.preventDefault();
            }}
            className="flex items-center space-x-1.5 px-2.5 sm:px-3.5 py-1.5 sm:py-2 bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-slate-950 font-bold text-xs rounded-xl shadow-xs transition-all shrink-0"
          >
            <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
            <span className="hidden sm:inline">เพิ่มโปรเจกต์</span>
          </Link>

          {/* Auth-aware User Menu (login link / user chip + logout) */}
          <UserMenu />
        </div>
      </div>

      {/* 2. Compact Unified Search & Filter Command Bar (Only on Explore/Favorites) */}
      {showSearchAndFilters && (
        <div className="px-4 sm:px-6 py-2 sm:py-2.5 bg-slate-50/80 border-t border-slate-200/70">
          <div className="max-w-7xl mx-auto flex flex-wrap md:grid md:grid-cols-[1fr_auto_1fr] items-center gap-2 sm:gap-3">

            {/* Left spacer — balances the group so search + filter stay centred together */}
            <div className="hidden md:block" aria-hidden="true" />

            {/* Centre: Search + Filter grouped tightly together, kept centred as one unit */}
            <div className="order-first md:order-none w-full md:w-auto flex items-center gap-2">

              {/* Search field with hint marquee */}
              <div className="relative flex-1 md:flex-none">
              <Search className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 absolute left-3.5 sm:left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                onFocus={() => setIsSearchHintVisible(false)}
                onBlur={() => setIsSearchHintVisible(true)}
                aria-label="ค้นหาโครงงาน"
                placeholder="ค้นหาโครงงาน หรือโจทย์ที่อยากทำ..."
                className="w-full md:w-[38rem] max-w-full pl-9 sm:pl-12 pr-16 sm:pr-28 py-2.5 sm:py-3 text-xs sm:text-sm font-medium bg-white border border-slate-200 rounded-2xl shadow-sm hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-400 text-slate-900 transition-all placeholder:text-slate-400 placeholder:text-xs sm:placeholder:text-sm sm:placeholder:text-transparent focus:sm:placeholder:text-slate-400"
              />

              {/* Animated hint ticker — visible on screens sm and up only to prevent mobile clutter */}
              {!searchQuery && isSearchHintVisible && (
                <div className="hidden sm:flex absolute inset-y-0 left-10 sm:left-12 right-16 sm:right-28 overflow-hidden items-center pointer-events-none select-none" aria-hidden="true">
                  <div className="dna-marquee-track text-xs sm:text-sm text-slate-400 font-medium font-sans">
                    <span>ค้นหาชื่อโครงงาน หรือพิมพ์โจทย์ที่อยากทำ…</span>
                    <span>เช่น อยากทำเครื่องสูบน้ำพลังงานแสงอาทิตย์</span>
                    <span>เช่น ระบบจัดการขยะด้วย AI + LoRaWAN</span>
                    <span>ค้นหาชื่อโครงงาน หรือพิมพ์โจทย์ที่อยากทำ…</span>
                    <span>เช่น อยากทำเครื่องสูบน้ำพลังงานแสงอาทิตย์</span>
                    <span>เช่น ระบบจัดการขยะด้วย AI + LoRaWAN</span>
                  </div>
                </div>
              )}
              
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center space-x-1">
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-full w-4.5 h-4.5 flex items-center justify-center text-[10px] transition-colors"
                    aria-label="Clear search"
                  >
                    ✕
                  </button>
                )}
                
                {onTriggerAiSearch && searchQuery.trim() && (
                  <button
                    onClick={() => onTriggerAiSearch(searchQuery)}
                    disabled={isAiSearching}
                    className="px-2 py-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-[10px] rounded-lg shadow-2xs flex items-center space-x-1 transition-all disabled:opacity-50"
                    title="ให้ AI กรองและคัดเลือกโครงงานที่ตรงที่สุด"
                  >
                    {isAiSearching ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      <Sparkles className="w-3 h-3 fill-current" />
                    )}
                    <span><span className="hidden sm:inline">AI </span>กรอง</span>
                  </button>
                )}
              </div>
              </div>

              {/* Unified Filter Trigger — sits right next to the search bar */}
              <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">

                {/* Quick-reset (only when filters are active) */}
                {hasActiveFilters && (
                  <button
                    onClick={handleResetAllFilters}
                    className="p-2 sm:p-2.5 rounded-xl border border-slate-200 bg-white text-slate-500 hover:text-red-600 hover:border-red-200 shadow-sm transition-colors"
                    title="ล้างตัวกรองทั้งหมด"
                    aria-label="ล้างตัวกรองทั้งหมด"
                  >
                    <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>
                )}

                <button
                  onClick={() => setIsFilterOpen(true)}
                  className={`flex items-center space-x-1.5 sm:space-x-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl border text-xs font-bold shadow-sm transition-all ${
                    activeFilterCount > 0
                      ? 'bg-amber-50 border-amber-400 ring-1 ring-amber-400/40 text-amber-900'
                      : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                  }`}
                  aria-haspopup="dialog"
                >
                  <Filter className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span className="text-xs">ตัวกรอง</span>
                  {activeFilterCount > 0 && (
                    <span className="min-w-[16px] sm:min-w-[18px] h-4 sm:h-[18px] px-1 flex items-center justify-center rounded-full bg-amber-500 text-white text-[9px] sm:text-[10px] font-extrabold leading-none">
                      {activeFilterCount}
                    </span>
                  )}
                  <ChevronDown className="w-3 h-3 sm:w-3.5 sm:h-3.5 opacity-50" />
                </button>
              </div>
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
                  <span>AI Semantic Filter</span>
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

      <FilterModal
        open={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        faculties={faculties}
        departments={availableDepartments}
        availableYears={availableYears}
        selectedFaculty={selectedFaculty}
        onSelectFaculty={setSelectedFaculty}
        selectedDept={selectedDept}
        onSelectDept={setSelectedDept}
        selectedYear={selectedYear}
        onSelectYear={setSelectedYear}
        resourceFilter={resourceFilter}
        onSelectResource={setResourceFilter}
        hasActiveFilters={hasActiveFilters}
        onResetAll={handleResetAllFilters}
      />

    </header>
  );
};
