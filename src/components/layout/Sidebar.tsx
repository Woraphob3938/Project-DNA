'use client';

import React, { useState, useEffect } from 'react';
import { 
  Compass, 
  GitFork, 
  Target, 
  BarChart3, 
  Bookmark, 
  Sparkles, 
  Dna,
  ArrowUp
} from 'lucide-react';
import { ActiveTab } from '@/types/dna';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenCreateModal: () => void;
  favoriteCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  onOpenCreateModal,
  favoriteCount
}) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Track window scroll to create dynamic scrolling effects on sidebar
  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      const currentScroll = window.scrollY;
      
      if (totalScroll > 0) {
        setScrollProgress(Math.min(100, Math.max(0, (currentScroll / totalScroll) * 100)));
      }
      
      setShowScrollTop(currentScroll > 200);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
      label: 'โจทย์จริง & ความต้องการ',
      icon: Target,
    },
    {
      id: 'analytics' as ActiveTab,
      label: 'สถิติคลังโครงงาน',
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
    <aside className="sticky top-0 h-screen w-20 md:w-24 bg-gradient-to-b from-amber-400 via-amber-500 to-amber-600 flex flex-col items-center py-6 px-2 justify-between shrink-0 shadow-xl select-none text-slate-900 z-30 transition-all">
      
      {/* Scroll Progress Vertical Bar on edge */}
      <div className="absolute right-0 top-0 bottom-0 w-1 bg-black/10 overflow-hidden">
        <div 
          className="w-full bg-slate-900 transition-all duration-150 ease-out rounded-full"
          style={{ height: `${scrollProgress}%` }}
        />
      </div>

      {/* Top Logo */}
      <div className="flex flex-col items-center space-y-2">
        <button
          onClick={() => {
            setActiveTab('explore');
            scrollToTop();
          }}
          className="w-12 h-12 rounded-2xl bg-white/95 backdrop-blur-md shadow-md flex items-center justify-center text-amber-600 hover:scale-110 active:scale-95 transition-all group"
          title="Project DNA - เลื่อนกลับด้านบน"
        >
          <Dna className="w-7 h-7 stroke-[2.5] group-hover:rotate-45 transition-transform duration-300" />
        </button>
        <span className="text-[11px] font-black tracking-wider text-slate-950 drop-shadow-xs">DNA</span>
      </div>

      {/* Center Nav Buttons */}
      <nav 
        className="flex flex-col items-center space-y-3.5 my-auto transition-transform duration-300 ease-out"
        style={{
          transform: `translateY(${Math.min(12, Math.max(-12, (scrollProgress - 50) * 0.24))}px)`
        }}
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                scrollToTop();
              }}
              className={`relative group w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-200 ${
                isActive
                  ? 'bg-slate-900 text-amber-400 shadow-lg scale-110 ring-2 ring-white/50'
                  : 'text-slate-900/80 hover:bg-white/40 hover:text-slate-950 hover:scale-105 active:scale-95'
              }`}
              title={item.label}
            >
              <Icon className="w-6 h-6 stroke-[2.2]" />
              
              {/* Badge */}
              {item.badge !== undefined && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-amber-400 animate-bounce">
                  {item.badge}
                </span>
              )}

              {/* Active Indicator Glow Pip */}
              {isActive && (
                <span className="absolute -left-1.5 w-1 h-5 bg-slate-900 rounded-r-full" />
              )}

              {/* Tooltip on Hover */}
              <span className="absolute left-full ml-3 px-3 py-1.5 bg-slate-900 text-white text-xs font-semibold rounded-xl shadow-2xl opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                {item.label}
              </span>
            </button>
          );
        })}

        {/* Action Button: AI Ingestion */}
        <div className="pt-2 border-t border-amber-300/40 w-full flex justify-center">
          <button
            onClick={onOpenCreateModal}
            className="w-12 h-12 rounded-2xl bg-slate-900 text-amber-300 hover:bg-black hover:scale-110 active:scale-95 shadow-lg flex items-center justify-center transition-all group relative"
            title="เพิ่ม/สกัด DNA โครงงานด้วย AI"
          >
            <Sparkles className="w-6 h-6 stroke-[2.2] animate-pulse" />
            <span className="absolute left-full ml-3 px-3 py-1.5 bg-slate-900 text-white text-xs font-semibold rounded-xl shadow-2xl opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
              สร้าง DNA Card ด้วย AI
            </span>
          </button>
        </div>
      </nav>

      {/* Bottom Control: Scroll To Top */}
      <div className="flex flex-col items-center">
        {showScrollTop ? (
          <button
            onClick={scrollToTop}
            className="w-10 h-10 rounded-xl bg-slate-900/90 text-amber-400 hover:bg-slate-900 hover:scale-110 flex items-center justify-center transition-all shadow-md animate-in fade-in zoom-in group relative"
            title="เลื่อนกลับสู่ด้านบนสุด"
          >
            <ArrowUp className="w-5 h-5" />
            <span className="absolute left-full ml-3 px-2.5 py-1 bg-slate-900 text-white text-[11px] font-semibold rounded-lg shadow-xl opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
              กลับขึ้นบน
            </span>
          </button>
        ) : (
          <div className="w-10 h-10" />
        )}
      </div>
    </aside>
  );
};
