'use client';

import React from 'react';
import Link from 'next/link';
import { Search, Plus, GraduationCap, Building, LogIn } from 'lucide-react';
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
  const availableDepartments = selectedFaculty
    ? departments.filter(d => d.faculty_id === selectedFaculty)
    : departments;

  return (
    <header className="bg-white border-b border-slate-200/90 sticky top-0 z-20 px-6 py-4 transition-colors">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Title & Campus Info */}
        <div>
          <div className="flex items-center space-x-2.5">
            <h1 className="font-display text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
              DNA : คลังองค์ความรู้ & ต่อยอดโครงงานนิสิต
            </h1>
            <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300/80">
              มก.ฉกส. {totalProjects} โครงงาน
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 font-sans">
            มหาวิทยาลัยเกษตรศาสตร์ วิทยาเขตเฉลิมพระเกียรติ จังหวัดสกลนคร (KU CSC)
          </p>
        </div>

        {/* Search Bar & Action */}
        <div className="flex items-center space-x-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ค้นหาโครงงาน: ตรวจสอบผ้าคราม, โดรนเกษตร, IoT น้ำแล้ง..."
              className="w-full pl-10 pr-9 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-500 focus:bg-white text-slate-800 placeholder-slate-400 font-sans transition-colors"
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

          {/* New Project DNA Button */}
          <button
            onClick={onOpenCreateModal}
            className="flex items-center space-x-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-slate-950 font-bold text-sm rounded-xl shadow-xs transition-colors shrink-0"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span className="hidden sm:inline">เพิ่ม DNA โครงงาน</span>
          </button>

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

      {/* Filter Bar */}
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

      </div>
    </header>
  );
};
