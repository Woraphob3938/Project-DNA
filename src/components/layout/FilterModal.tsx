'use client';

import React, { useEffect } from 'react';
import { Filter, RotateCcw, ChevronDown } from 'lucide-react';
import type { Faculty, Department } from '@/types/dna';

// Shared styling for the popup's filter <select>s — keeps all four fields
// visually consistent from a single source of truth.
const filterSelectClass = (active: boolean) =>
  `w-full text-sm pl-3.5 pr-9 py-2.5 rounded-xl border bg-white appearance-none cursor-pointer font-medium focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all ${
    active
      ? 'border-amber-500 text-slate-950 ring-1 ring-amber-400/50'
      : 'border-slate-200 text-slate-700 hover:border-slate-300'
  }`;

interface FilterModalProps {
  open: boolean;
  onClose: () => void;
  /** Departments narrowed to the chosen faculty */
  departments: Department[];
  faculties: Faculty[];
  availableYears: number[];
  selectedFaculty: string | null;
  onSelectFaculty: (id: string | null) => void;
  selectedDept: string | null;
  onSelectDept: (code: string | null) => void;
  selectedYear?: number | null;
  onSelectYear?: ((year: number | null) => void) | undefined;
  resourceFilter?: string | null;
  onSelectResource?: ((res: string | null) => void) | undefined;
  hasActiveFilters: boolean;
  onResetAll: () => void;
}

export const FilterModal: React.FC<FilterModalProps> = ({
  open,
  onClose,
  departments,
  faculties,
  availableYears,
  selectedFaculty,
  onSelectFaculty,
  selectedDept,
  onSelectDept,
  selectedYear,
  onSelectYear,
  resourceFilter,
  onSelectResource,
  hasActiveFilters,
  onResetAll
}) => {
  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-[10vh]"
      role="dialog"
      aria-modal="true"
      aria-label="ตัวกรองโครงงาน"
    >
      {/* Backdrop */}
      <button
        className="absolute inset-0 bg-slate-950/40 backdrop-blur-[2px] cursor-default"
        onClick={onClose}
        tabIndex={-1}
        aria-label="ปิดหน้าต่างตัวกรอง"
      />

      {/* Panel */}
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">

        {/* Head */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <h2 className="font-display text-base font-bold text-slate-900 flex items-center space-x-2">
            <Filter className="w-4 h-4 text-amber-600" />
            <span>ตัวกรองทั้งหมด</span>
          </h2>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center transition-colors"
            aria-label="ปิด"
          >
            ✕
          </button>
        </div>

        {/* Body — every filter lives here */}
        <div className="px-5 py-4 space-y-4 max-h-[60vh] overflow-y-auto">

          {/* Faculty */}
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1.5">🏫 คณะ</label>
            <div className="relative">
              <select
                value={selectedFaculty || ''}
                onChange={(e) => {
                  onSelectFaculty(e.target.value || null);
                  onSelectDept(null);
                }}
                className={filterSelectClass(Boolean(selectedFaculty))}
              >
                <option value="">ทุกคณะ</option>
                {faculties.map((fac) => (
                  <option key={fac.id} value={fac.id}>
                    {fac.short_name} - {fac.name_th}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Department */}
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1.5">🎓 สาขาวิชา</label>
            <div className="relative">
              <select
                value={selectedDept || ''}
                onChange={(e) => onSelectDept(e.target.value || null)}
                className={filterSelectClass(Boolean(selectedDept))}
              >
                <option value="">ทุกสาขาวิชา</option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.code}>
                    {dept.code} - {dept.name_th}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Year */}
          {availableYears.length > 0 && onSelectYear && (
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1.5">📅 ปีการศึกษา</label>
              <div className="relative">
                <select
                  value={selectedYear ? String(selectedYear) : ''}
                  onChange={(e) => onSelectYear(e.target.value ? Number(e.target.value) : null)}
                  className={filterSelectClass(Boolean(selectedYear))}
                >
                  <option value="">ทุกปีการศึกษา</option>
                  {availableYears.map((yr) => (
                    <option key={yr} value={yr}>
                      ปี พ.ศ. {yr}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          )}

          {/* Resource type */}
          {onSelectResource && (
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1.5">💾 ทรัพยากรที่มี</label>
              <div className="relative">
                <select
                  value={resourceFilter || ''}
                  onChange={(e) => onSelectResource(e.target.value || null)}
                  className={filterSelectClass(Boolean(resourceFilter))}
                >
                  <option value="">ทรัพยากรทั้งหมด</option>
                  <option value="code">💻 มี Source Code</option>
                  <option value="dataset">📊 มี Dataset</option>
                  <option value="model">🤖 มี AI Model</option>
                  <option value="lineage">🌿 มีสายต่อยอด</option>
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          )}
        </div>

        {/* Foot */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-slate-50 border-t border-slate-100">
          <button
            onClick={onResetAll}
            disabled={!hasActiveFilters}
            className="text-xs font-semibold text-red-600 hover:text-red-700 flex items-center space-x-1 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>ล้างตัวกรองทั้งหมด</span>
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-slate-950 text-xs font-bold rounded-xl shadow-xs transition-colors"
          >
            เสร็จสิ้น
          </button>
        </div>
      </div>
    </div>
  );
};