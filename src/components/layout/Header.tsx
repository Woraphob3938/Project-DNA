'use client';

import React from 'react';
import { Search, Sparkles, SlidersHorizontal, Plus, GraduationCap, Building } from 'lucide-react';
import { Faculty, Department } from '@/types/dna';

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  faculties: Faculty[];
  selectedFaculty: string | null;
  setSelectedFaculty: (id: string | null) => void;
  departments: Department[];
  selectedDept: string | null;
  setSelectedDept: (code: string | null) => void;
  onOpenCreateModal: () => void;
  totalProjects: number;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  setSearchQuery,
  faculties,
  selectedFaculty,
  setSelectedFaculty,
  departments,
  selectedDept,
  setSelectedDept,
  onOpenCreateModal,
  totalProjects
}) => {
  // Filter departments by selected faculty if any
  const availableDepartments = selectedFaculty
    ? departments.filter(d => d.faculty_id === selectedFaculty)
    : departments;

  return (
    <header className="bg-white/85 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-20 px-6 py-4 transition-all">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Title & University Info */}
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
              DNA : คลังองค์ความรู้ & ต่อยอดโครงงานนิสิต
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
              มก.ฉกส. {totalProjects} โครงงาน
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            มหาวิทยาลัยเกษตรศาสตร์ วิทยาเขตเฉลิมพระเกียรติ จังหวัดสกลนคร (KU CSC)
          </p>
        </div>

        {/* Search Bar & AI Action */}
        <div className="flex items-center space-x-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ค้นหาโครงงาน เช่น: ตรวจสอบผ้าคราม, โดรนเกษตร, IoT น้ำแล้ง..."
              className="w-full pl-10 pr-10 py-2.5 text-sm bg-slate-100/80 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all text-slate-800 placeholder-slate-400"
            />
            {searchQuery ? (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 bg-slate-200 hover:bg-slate-300 rounded-full w-5 h-5 flex items-center justify-center"
              >
                ✕
              </button>
            ) : (
              <Sparkles className="w-4 h-4 text-amber-500 absolute right-3.5 top-1/2 -translate-y-1/2 opacity-70" />
            )}
          </div>

          {/* New Project DNA Button */}
          <button
            onClick={onOpenCreateModal}
            className="flex items-center space-x-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm rounded-xl shadow-sm transition-all hover:shadow-md shrink-0 active:scale-95"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span className="hidden sm:inline">เพิ่ม DNA โครงงาน</span>
          </button>
        </div>
      </div>

      {/* Faculty & Department Filter Bar */}
      <div className="max-w-7xl mx-auto mt-3.5 pt-3 border-t border-slate-100 space-y-2 text-xs">
        
        {/* Faculty Pills (4 คณะของ มก.ฉกส.) */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 max-w-full">
          <span className="text-slate-400 font-semibold flex items-center mr-1 shrink-0">
            <GraduationCap className="w-3.5 h-3.5 mr-1" /> คณะ:
          </span>
          <button
            onClick={() => {
              setSelectedFaculty(null);
              setSelectedDept(null);
            }}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all shrink-0 ${
              selectedFaculty === null
                ? 'bg-slate-900 text-white font-bold shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            ทุกคณะ (4 คณะ)
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
                className={`px-3 py-1.5 rounded-lg font-medium transition-all whitespace-nowrap shrink-0 flex items-center space-x-1.5 ${
                  isSelected
                    ? 'bg-amber-500 text-slate-950 font-black shadow-xs ring-1 ring-amber-400'
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
          <span className="text-slate-400 font-semibold flex items-center mr-1 shrink-0">
            <Building className="w-3.5 h-3.5 mr-1" /> สาขาวิชา:
          </span>
          <button
            onClick={() => setSelectedDept(null)}
            className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all shrink-0 ${
              selectedDept === null
                ? 'bg-slate-800 text-amber-400 font-bold'
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
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all whitespace-nowrap shrink-0 border ${
                  isSelected
                    ? 'bg-slate-900 text-amber-400 border-slate-900 font-bold'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {dept.code} - {dept.name_th}
              </button>
            );
          })}
        </div>

      </div>
    </header>
  );
};
