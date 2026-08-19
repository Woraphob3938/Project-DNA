'use client';

import React from 'react';
import { Search, Sparkles, SlidersHorizontal, Plus, Check } from 'lucide-react';
import { SdgGoal, Department } from '@/types/dna';

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  sdgs: SdgGoal[];
  selectedSdg: number | null;
  setSelectedSdg: (id: number | null) => void;
  departments: Department[];
  selectedDept: string | null;
  setSelectedDept: (code: string | null) => void;
  onOpenCreateModal: () => void;
  totalProjects: number;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  setSearchQuery,
  sdgs,
  selectedSdg,
  setSelectedSdg,
  departments,
  selectedDept,
  setSelectedDept,
  onOpenCreateModal,
  totalProjects
}) => {
  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-20 px-6 py-4 transition-all">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Title & Stats */}
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
              DNA : คลังองค์ความรู้ & ต่อยอดโครงงานนิสิต
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
              KUSE {totalProjects} โครงงาน
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            สืบค้น เชื่อมโยงสายวิวัฒนาการ และต่อยอดโครงงานรุ่นพี่สู่โจทย์จริง มก.ฉกส. และสากล
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
              placeholder="ค้นหาภาษาธรรมชาติ เช่น: ตรวจสอบผ้าคราม, โดรนเกษตร, IoT น้ำแล้ง..."
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

      {/* Filter Tabs & Pills */}
      <div className="max-w-7xl mx-auto mt-3.5 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
        
        {/* Department Filter */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 max-w-full">
          <span className="text-slate-400 font-semibold flex items-center mr-1">
            <SlidersHorizontal className="w-3.5 h-3.5 mr-1" /> สาขา:
          </span>
          <button
            onClick={() => setSelectedDept(null)}
            className={`px-3 py-1 rounded-lg font-medium transition-all ${
              selectedDept === null
                ? 'bg-slate-900 text-white shadow-xs font-bold'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            ทั้งหมด
          </button>
          {departments.map((dept) => (
            <button
              key={dept.id}
              onClick={() => setSelectedDept(selectedDept === dept.code ? null : dept.code)}
              className={`px-3 py-1 rounded-lg font-medium transition-all whitespace-nowrap ${
                selectedDept === dept.code
                  ? 'bg-slate-900 text-amber-400 font-bold shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {dept.code} ({dept.name_th.split(' ')[0]})
            </button>
          ))}
        </div>

        {/* SDG Tag Filter */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 max-w-full">
          <span className="text-slate-400 font-semibold mr-1">เป้าหมาย SDGs:</span>
          <button
            onClick={() => setSelectedSdg(null)}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
              selectedSdg === null
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            ทุก SDG
          </button>
          {sdgs.map((sdg) => {
            const isSelected = selectedSdg === sdg.id;
            return (
              <button
                key={sdg.id}
                onClick={() => setSelectedSdg(isSelected ? null : sdg.id)}
                style={{
                  backgroundColor: isSelected ? sdg.color_hex : undefined,
                  color: isSelected ? '#FFFFFF' : undefined,
                  borderColor: isSelected ? sdg.color_hex : undefined
                }}
                className={`px-2.5 py-1 rounded-lg font-medium border transition-all whitespace-nowrap flex items-center space-x-1 ${
                  isSelected
                    ? 'shadow-sm font-bold scale-105'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
                title={sdg.name_th}
              >
                <span>{sdg.code}</span>
                {isSelected && <Check className="w-3 h-3 ml-0.5 inline" />}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
