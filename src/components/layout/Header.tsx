import React from 'react';
import Link from 'next/link';
import { Search, Plus, GraduationCap, Building, Calendar, LogIn, Sparkles, Code, Database, Cpu, GitFork, X } from 'lucide-react';
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

  return (
    <header className="bg-white border-b border-slate-200/90 sticky top-0 z-20 px-6 py-4 transition-colors">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Title & Campus Info */}
        <div>
          <h1 className="font-display text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
            DNA : คลังองค์ความรู้ & ต่อยอดโครงงานนิสิต
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-sans">
            มหาวิทยาลัยเกษตรศาสตร์ วิทยาเขตเฉลิมพระเกียรติ จังหวัดสกลนคร (KU CSC)
          </p>
        </div>

        {/* Search Bar & Action Buttons */}
        <div className="flex items-center space-x-2.5 w-full md:w-auto justify-end">
          
          {/* Search Input (Only on explore / favorites tab) */}
          {showSearchAndFilters && (
            <div className="relative flex-1 md:w-72 lg:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ค้นหาโครงงาน: ตรวจสอบผ้าคราม, โดรนเกษตร..."
                className="w-full pl-10 pr-9 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-500 focus:bg-white text-slate-800 placeholder-slate-400 font-sans transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-700 bg-slate-200 hover:bg-slate-300 rounded-full w-5 h-5 flex items-center justify-center transition-colors"
                  aria-label="Clear search"
                >
                  ✕
                </button>
              )}
            </div>
          )}

          {/* AI Matchmaker Trigger Button */}
          {showSearchAndFilters && onOpenAiMatchModal && (
            <button
              onClick={onOpenAiMatchModal}
              className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl font-bold text-xs shadow-xs transition-colors shrink-0 ${
                isAiMatchActive
                  ? 'bg-amber-500 text-slate-950 ring-2 ring-amber-400'
                  : 'bg-slate-950 hover:bg-black text-amber-400'
              }`}
              title="ให้ Gemini AI ช่วยจับคู่โครงงานที่เหมาะสมกับคุณ"
            >
              <Sparkles className="w-3.5 h-3.5 fill-current" />
              <span className="hidden sm:inline">{isAiMatchActive ? 'AI Match เปิดอยู่' : '⚡ AI ช่วยคัดกรอง'}</span>
            </button>
          )}

          {/* Submit / New Project DNA Button */}
          <Link
            href="/submit"
            className="flex items-center space-x-1.5 px-3.5 py-2 bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-slate-950 font-bold text-xs rounded-xl shadow-xs transition-colors shrink-0"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span className="hidden sm:inline">เพิ่มโปรเจกต์</span>
          </Link>

          {/* Login Button */}
          <Link
            href="/login"
            className="flex items-center space-x-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-800 font-bold text-xs rounded-xl transition-colors shrink-0 border border-slate-200"
          >
            <LogIn className="w-3.5 h-3.5 text-slate-700" />
            <span className="hidden sm:inline">เข้าสู่ระบบ</span>
          </Link>
        </div>
      </div>

      {/* Filter Bar (Only visible on explore / favorites tab) */}
      {showSearchAndFilters && (
        <div className="max-w-7xl mx-auto mt-3.5 pt-3 border-t border-slate-100 space-y-2 text-xs">
          
          {/* Faculty Pills (4 คณะ) */}
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 max-w-full">
            <span className="text-slate-400 font-medium flex items-center mr-1 shrink-0">
              <GraduationCap className="w-3.5 h-3.5 mr-1" /> คณะ:
            </span>
            <button
              onClick={() => {
                setSelectedFaculty(null);
                setSelectedDept(null);
              }}
              className={`px-3 py-1 rounded-lg font-medium transition-colors shrink-0 ${
                selectedFaculty === null
                  ? 'bg-slate-900 text-white font-bold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              ทุกคณะ
            </button>
            {faculties.map((fac) => {
              const isSelected = selectedFaculty === fac.id;
              return (
                <button
                  key={fac.id}
                  onClick={() => {
                    setSelectedFaculty(isSelected ? null : fac.id);
                    setSelectedDept(null);
                  }}
                  className={`px-3 py-1 rounded-lg font-medium transition-colors whitespace-nowrap shrink-0 flex items-center space-x-1.5 ${
                    isSelected
                      ? 'bg-amber-500 text-slate-950 font-bold ring-1 ring-amber-400'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <span>{fac.name_th}</span>
                  <span className="text-[10px] opacity-75 font-mono">({fac.short_name})</span>
                </button>
              );
            })}
          </div>

          {/* Department / Major Pills */}
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 max-w-full">
            <span className="text-slate-400 font-medium flex items-center mr-1 shrink-0">
              <Building className="w-3.5 h-3.5 mr-1" /> สาขาวิชา:
            </span>
            <button
              onClick={() => setSelectedDept(null)}
              className={`px-2.5 py-0.5 rounded-md text-[11px] font-medium transition-colors shrink-0 ${
                selectedDept === null
                  ? 'bg-slate-800 text-amber-300 font-bold'
                  : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              ทุกสาขา
            </button>
            {availableDepartments.map((dept) => {
              const isSelected = selectedDept === dept.code;
              return (
                <button
                  key={dept.id}
                  onClick={() => setSelectedDept(isSelected ? null : dept.code)}
                  className={`px-2.5 py-0.5 rounded-md text-[11px] font-medium transition-colors whitespace-nowrap shrink-0 border ${
                    isSelected
                      ? 'bg-slate-900 text-amber-300 border-slate-900 font-bold'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {dept.code} - {dept.name_th}
                </button>
              );
            })}
          </div>

          {/* Year (ปีการศึกษา พ.ศ.) Pills */}
          {availableYears && availableYears.length > 0 && setSelectedYear && (
            <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 max-w-full">
              <span className="text-slate-400 font-medium flex items-center mr-1 shrink-0">
                <Calendar className="w-3.5 h-3.5 mr-1" /> ปี พ.ศ.:
              </span>
              <button
                onClick={() => setSelectedYear(null)}
                className={`px-2.5 py-0.5 rounded-md text-[11px] font-medium transition-colors shrink-0 ${
                  selectedYear === null
                    ? 'bg-slate-800 text-amber-300 font-bold'
                    : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                ทุกปี
              </button>
              {availableYears.map((yr) => {
                const isSelected = selectedYear === yr;
                return (
                  <button
                    key={yr}
                    onClick={() => setSelectedYear(isSelected ? null : yr)}
                    className={`px-2.5 py-0.5 rounded-md text-[11px] font-medium transition-colors whitespace-nowrap shrink-0 border ${
                      isSelected
                        ? 'bg-amber-500 text-slate-950 border-amber-500 font-bold'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    ปี {yr}
                  </button>
                );
              })}
            </div>
          )}

          {/* Resource Filter Pills */}
          {setResourceFilter && (
            <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 max-w-full pt-0.5">
              <span className="text-slate-400 font-medium flex items-center mr-1 shrink-0">
                <Code className="w-3.5 h-3.5 mr-1" /> ทรัพยากร:
              </span>
              <button
                onClick={() => setResourceFilter(null)}
                className={`px-2.5 py-0.5 rounded-md text-[11px] font-medium transition-colors shrink-0 ${
                  resourceFilter === null
                    ? 'bg-slate-800 text-amber-300 font-bold'
                    : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                ทั้งหมด
              </button>
              <button
                onClick={() => setResourceFilter(resourceFilter === 'code' ? null : 'code')}
                className={`px-2.5 py-0.5 rounded-md text-[11px] font-medium transition-colors whitespace-nowrap shrink-0 border flex items-center space-x-1 ${
                  resourceFilter === 'code'
                    ? 'bg-slate-900 text-amber-400 border-slate-900 font-bold'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <Code className="w-3 h-3 text-amber-600" />
                <span>มี Source Code</span>
              </button>
              <button
                onClick={() => setResourceFilter(resourceFilter === 'dataset' ? null : 'dataset')}
                className={`px-2.5 py-0.5 rounded-md text-[11px] font-medium transition-colors whitespace-nowrap shrink-0 border flex items-center space-x-1 ${
                  resourceFilter === 'dataset'
                    ? 'bg-slate-900 text-emerald-400 border-slate-900 font-bold'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <Database className="w-3 h-3 text-emerald-600" />
                <span>มี Dataset</span>
              </button>
              <button
                onClick={() => setResourceFilter(resourceFilter === 'model' ? null : 'model')}
                className={`px-2.5 py-0.5 rounded-md text-[11px] font-medium transition-colors whitespace-nowrap shrink-0 border flex items-center space-x-1 ${
                  resourceFilter === 'model'
                    ? 'bg-slate-900 text-purple-400 border-slate-900 font-bold'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <Cpu className="w-3 h-3 text-purple-600" />
                <span>มี AI Model</span>
              </button>
              <button
                onClick={() => setResourceFilter(resourceFilter === 'lineage' ? null : 'lineage')}
                className={`px-2.5 py-0.5 rounded-md text-[11px] font-medium transition-colors whitespace-nowrap shrink-0 border flex items-center space-x-1 ${
                  resourceFilter === 'lineage'
                    ? 'bg-amber-500 text-slate-950 border-amber-500 font-bold'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <GitFork className="w-3 h-3" />
                <span>มีสายต่อยอด</span>
              </button>
            </div>
          )}

          {/* Active AI Matcher Status Bar */}
          {isAiMatchActive && (
            <div className="flex items-center justify-between bg-gradient-to-r from-amber-500/15 via-amber-500/10 to-amber-500/5 border border-amber-300/80 px-3.5 py-2 rounded-xl text-xs text-amber-950 animate-in fade-in">
              <div className="flex items-center space-x-2 font-medium">
                <Sparkles className="w-4 h-4 text-amber-600 shrink-0 fill-current" />
                <span>
                  <strong>AI Match Active:</strong> กำลังแสดงผลการจับคู่และคัดกรองโดย Gemini AI (เรียงตามคะแนนความเหมาะสม)
                </span>
              </div>
              {onClearAiMatch && (
                <button
                  onClick={onClearAiMatch}
                  className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-800 text-[11px] font-bold rounded-lg border border-slate-200 transition-colors flex items-center space-x-1 shadow-2xs"
                >
                  <X className="w-3 h-3" />
                  <span>ล้างการจับคู่ AI</span>
                </button>
              )}
            </div>
          )}

        </div>
      )}
    </header>
  );
};
