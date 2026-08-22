import { Loader2 } from 'lucide-react';

/**
 * Full loading state for the explore/favorites catalog: a clear status
 * banner plus skeleton cards mirroring the DnaCard layout, shown while
 * initial data is still being fetched.
 */
export function HomeSkeleton() {
  return (
    <div className="space-y-6" role="status" aria-live="polite" aria-busy="true">
      {/* Status banner */}
      <div className="flex items-center space-x-3 bg-white border border-slate-200 rounded-2xl px-5 py-4 shadow-soft">
        <Loader2 className="w-5 h-5 text-amber-500 animate-spin shrink-0" />
        <div>
          <p className="text-sm font-bold text-slate-900">กำลังโหลดคลัง DNA โครงงาน...</p>
          <p className="text-xs text-slate-500 mt-0.5">
            กำลังดึงข้อมูลโครงงาน คณะ สาขาวิชา และสายวิวัฒนาการ กรุณารอสักครู่
          </p>
        </div>
      </div>

      {/* Section header placeholder */}
      <div className="h-8 w-72 bg-slate-200 rounded-lg animate-pulse" />

      {/* Skeleton cards matching the DnaCard grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-soft"
          >
            {/* Cover banner */}
            <div className="relative h-32 bg-slate-200 animate-pulse" />
            {/* Body */}
            <div className="p-4 space-y-2.5">
              <div className="h-3.5 w-3/4 bg-slate-200 rounded animate-pulse" />
              <div className="h-3 w-full bg-slate-100 rounded animate-pulse" />
              <div className="h-3 w-2/3 bg-slate-100 rounded animate-pulse" />
              <div className="flex flex-wrap gap-1.5 pt-1.5">
                <div className="h-5 w-14 bg-slate-100 rounded-md animate-pulse" />
                <div className="h-5 w-12 bg-slate-100 rounded-md animate-pulse" />
                <div className="h-5 w-16 bg-slate-100 rounded-md animate-pulse" />
              </div>
              <div className="flex items-center justify-between pt-1.5">
                <div className="h-6 w-20 bg-slate-100 rounded-md animate-pulse" />
                <div className="h-6 w-6 bg-slate-100 rounded-full animate-pulse" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
