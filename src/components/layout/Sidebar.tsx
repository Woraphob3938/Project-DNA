'use client';

import React, { useState, useEffect } from 'react';
import { 
  Compass, 
  GitFork, 
  Target, 
  BarChart3, 
  Bookmark, 
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
    <aside className="sticky top-0 h-screen w-20 md:w-24 bg-[#EAA208] flex flex-col items-center py-6 px-2 justify-between shrink-0 shadow-lg select-none text-slate-900 z-30 transition-colors">
      
      {/* Scroll Progress Vertical Bar on edge */}
      <div className="absolute right-0 top-0 bottom-0 w-1 bg-black/10 overflow-hidden">
        <div 
          className="w-full bg-slate-950 transition-all duration-150 ease-out"
          style={{ height: `${scrollProgress}%` }}
        />
      </div>

      {/* Top Brand Mark */}
      <div className="flex flex-col items-center space-y-1">
        <button
          onClick={() => {
            setActiveTab('explore');
            scrollToTop();
          }}
          className="w-12 h-12 rounded-xl bg-slate-950 text-amber-400 flex items-center justify-center transition-colors hover:bg-slate-900 shadow-sm"
          title="Project DNA - เลื่อนกลับด้านบน"
          aria-label="Home and scroll to top"
        >
          <Dna className="w-6 h-6 stroke-[2.5]" />
        </button>
        <span className="font-display text-[11px] font-bold tracking-wider text-slate-950">DNA</span>
      </div>

      {/* Center Navigation Buttons */}
      <nav 
        className="flex flex-col items-center space-y-3 my-auto transition-transform duration-200 ease-out"
        style={{
          transform: `translateY(${Math.min(10, Math.max(-10, (scrollProgress - 50) * 0.2))}px)`
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
              className={`relative group w-12 h-12 rounded-xl flex items-center justify-center transition-colors duration-150 ${
                isActive
                  ? 'bg-slate-950 text-amber-400 shadow-sm ring-2 ring-slate-950/20'
                  : 'text-slate-950/80 hover:bg-white/30 hover:text-slate-950'
              }`}
              title={item.label}
              aria-label={item.label}
            >
              <Icon className="w-5 h-5 stroke-[2.2]" />
              
              {/* Badge Counter */}
              {item.badge !== undefined && (
                <span className="absolute -top-1 -right-1 bg-slate-950 text-amber-400 text-[10px] font-mono font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center border-2 border-[#EAA208]">
                  {item.badge}
                </span>
              )}

              {/* Active Pip */}
              {isActive && (
                <span className="absolute -left-1.5 w-1 h-4 bg-slate-950 rounded-r-full" />
              )}

              {/* Tooltip on Hover */}
              <span className="absolute left-full ml-3 px-3 py-1.5 bg-slate-950 text-white text-xs font-medium rounded-lg shadow-xl opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                {item.label}
              </span>
            </button>
          );
        })}

      </nav>

      {/* Bottom Control: Scroll To Top */}
      <div className="flex flex-col items-center">
        {showScrollTop ? (
          <button
            onClick={scrollToTop}
            className="w-10 h-10 rounded-lg bg-slate-950 text-amber-400 hover:bg-slate-900 flex items-center justify-center transition-colors shadow-sm group relative"
            title="เลื่อนกลับสู่ด้านบนสุด"
            aria-label="Scroll to top"
          >
            <ArrowUp className="w-4 h-4 stroke-[2.5]" />
            <span className="absolute left-full ml-3 px-2.5 py-1 bg-slate-950 text-white text-[11px] font-medium rounded-md shadow-xl opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
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
