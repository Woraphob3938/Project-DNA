'use client';

import React from 'react';
import { 
  Compass, 
  GitFork, 
  Target, 
  BarChart3, 
  Bookmark, 
  PlusCircle, 
  Layers, 
  Sparkles, 
  Info,
  Dna
} from 'lucide-react';
import { ActiveTab } from '@/types/dna';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenCreateModal: () => void;
  onOpenAboutModal: () => void;
  favoriteCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  onOpenCreateModal,
  onOpenAboutModal,
  favoriteCount
}) => {
  const navItems = [
    {
      id: 'explore' as ActiveTab,
      label: 'สำรวจ DNA โครงงาน',
      icon: Compass,
    },
    {
      id: 'lineage' as ActiveTab,
      label: 'สายการต่อยอด (Lineage)',
      icon: GitFork,
    },
    {
      id: 'challenges' as ActiveTab,
      label: 'โจทย์จริง & SDGs',
      icon: Target,
    },
    {
      id: 'analytics' as ActiveTab,
      label: 'สถิติผลกระทบ SDGs',
      icon: BarChart3,
    },
    {
      id: 'favorites' as ActiveTab,
      label: 'โครงงานที่บันทึกไว้',
      icon: Bookmark,
      badge: favoriteCount > 0 ? favoriteCount : undefined,
    },
  ];

  return (
    <aside className="w-20 md:w-24 bg-gradient-to-b from-amber-400 via-amber-500 to-amber-600 flex flex-col items-center py-6 px-2 justify-between shrink-0 shadow-lg select-none text-slate-900 z-30 min-h-screen">
      {/* Top Logo */}
      <div className="flex flex-col items-center space-y-2">
        <button
          onClick={() => setActiveTab('explore')}
          className="w-12 h-12 rounded-2xl bg-white/90 backdrop-blur-sm shadow-md flex items-center justify-center text-amber-600 hover:scale-105 transition-all group"
          title="Project DNA"
        >
          <Dna className="w-7 h-7 stroke-[2.5] group-hover:rotate-12 transition-transform" />
        </button>
        <span className="text-[11px] font-black tracking-wider text-slate-900 drop-shadow-sm">DNA</span>
      </div>

      {/* Center Nav Buttons */}
      <nav className="flex flex-col items-center space-y-4 my-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`relative group w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-200 ${
                isActive
                  ? 'bg-slate-900 text-amber-400 shadow-md scale-105'
                  : 'text-slate-900/80 hover:bg-white/30 hover:text-slate-950'
              }`}
              title={item.label}
            >
              <Icon className="w-6 h-6 stroke-[2.2]" />
              
              {/* Badge */}
              {item.badge !== undefined && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-amber-400">
                  {item.badge}
                </span>
              )}

              {/* Tooltip on Hover */}
              <span className="absolute left-full ml-3 px-3 py-1.5 bg-slate-900 text-white text-xs font-semibold rounded-lg shadow-xl opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                {item.label}
              </span>
            </button>
          );
        })}

        {/* Action Button: AI Ingestion */}
        <div className="pt-2 border-t border-amber-300/40 w-full flex justify-center">
          <button
            onClick={onOpenCreateModal}
            className="w-12 h-12 rounded-2xl bg-slate-900 text-amber-300 hover:bg-black hover:scale-105 shadow-md flex items-center justify-center transition-all group relative"
            title="เพิ่ม/สกัด DNA โครงงานด้วย AI"
          >
            <Sparkles className="w-6 h-6 stroke-[2.2] animate-pulse" />
            <span className="absolute left-full ml-3 px-3 py-1.5 bg-slate-900 text-white text-xs font-semibold rounded-lg shadow-xl opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
              สร้าง DNA Card ด้วย AI
            </span>
          </button>
        </div>
      </nav>

      {/* Bottom Info / Team Modal */}
      <div className="flex flex-col items-center space-y-2">
        <button
          onClick={onOpenAboutModal}
          className="w-10 h-10 rounded-xl bg-white/20 hover:bg-white/40 text-slate-900 flex items-center justify-center transition-all group relative"
          title="ข้อมูลโครงการ & ทีม Ambatukam"
        >
          <Info className="w-5 h-5" />
          <span className="absolute left-full ml-3 px-3 py-1.5 bg-slate-900 text-white text-xs font-semibold rounded-lg shadow-xl opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
            เกี่ยวกับโปรเจกต์ & ทีม
          </span>
        </button>
      </div>
    </aside>
  );
};
