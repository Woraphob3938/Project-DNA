'use client';

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

/** Page buttons with ellipsis: 1 … 4 5 6 … 12 */
function getPageItems(current: number, total: number): (number | 'ellipsis')[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const items: (number | 'ellipsis')[] = [1];
  const rangeStart = Math.max(2, current - 1);
  const rangeEnd = Math.min(total - 1, current + 1);

  if (rangeStart > 2) items.push('ellipsis');
  for (let i = rangeStart; i <= rangeEnd; i++) items.push(i);
  if (rangeEnd < total - 1) items.push('ellipsis');

  items.push(total);
  return items;
}

/**
 * Catalog pagination: numbered pages, prev/next arrows and a jump-to-page
 * numeric input for large catalogs. Hidden entirely when there is only
 * one page.
 */
export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const [jumpValue, setJumpValue] = useState('');

  if (totalPages <= 1) return null;

  const goTo = (page: number) => {
    const clamped = Math.min(Math.max(1, page), totalPages);
    onPageChange(clamped);
    setJumpValue('');
  };

  const handleSubmitJump = (e: React.FormEvent) => {
    e.preventDefault();
    const n = parseInt(jumpValue, 10);
    if (!Number.isNaN(n)) goTo(n);
  };

  return (
    <nav
      aria-label="pagination"
      className="pt-2 flex flex-wrap items-center justify-between gap-x-4 gap-y-3"
    >
      {/* Numbered page buttons */}
      <div className="flex items-center flex-wrap gap-1.5">
        <button
          onClick={() => goTo(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="หน้าก่อนหน้า"
          className="p-2 bg-white border border-slate-200 text-slate-600 rounded-lg transition-colors hover:bg-slate-50 hover:border-slate-300 disabled:opacity-40 disabled:cursor-not-allowed shadow-2xs"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {getPageItems(currentPage, totalPages).map((item, idx) =>
          item === 'ellipsis' ? (
            <span
              key={`ellipsis-${idx}`}
              className="px-1.5 py-1 text-xs font-medium text-slate-400 select-none"
              aria-hidden="true"
            >
              …
            </span>
          ) : (
            <button
              key={item}
              onClick={() => goTo(item)}
              aria-current={item === currentPage ? 'page' : undefined}
              className={`min-w-[2.25rem] px-2 py-1.5 text-xs font-bold rounded-lg border transition-colors shadow-2xs ${
                item === currentPage
                  ? 'bg-amber-500 border-amber-500 text-slate-950'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300'
              }`}
            >
              {item}
            </button>
          )
        )}

        <button
          onClick={() => goTo(currentPage + 1)}
          disabled={currentPage === totalPages}
          aria-label="หน้าถัดไป"
          className="p-2 bg-white border border-slate-200 text-slate-600 rounded-lg transition-colors hover:bg-slate-50 hover:border-slate-300 disabled:opacity-40 disabled:cursor-not-allowed shadow-2xs"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Jump-to-page numeric input */}
      <form
        onSubmit={handleSubmitJump}
        className="flex items-center space-x-2 bg-white border border-slate-200 rounded-lg px-3 py-1.5 shadow-2xs"
      >
        <label htmlFor="jump-page" className="text-xs font-medium text-slate-500 whitespace-nowrap">
          ไปหน้าที่
        </label>
        <input
          id="jump-page"
          type="number"
          inputMode="numeric"
          min={1}
          max={totalPages}
          value={jumpValue}
          onChange={(e) => setJumpValue(e.target.value)}
          placeholder={`1-${totalPages}`}
          className="w-14 px-2 py-1 text-xs font-bold text-slate-800 bg-slate-50 border border-slate-200 rounded-md text-center focus:outline-none focus:ring-1 focus:ring-amber-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
        <span className="text-xs text-slate-400 whitespace-nowrap">จาก {totalPages}</span>
        <button
          type="submit"
          className="px-2.5 py-1 text-xs font-bold text-amber-900 bg-amber-100 hover:bg-amber-200 rounded-md transition-colors"
        >
          ไป
        </button>
      </form>
    </nav>
  );
}
