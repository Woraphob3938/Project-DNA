'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  LogIn,
  LogOut,
  ShieldCheck,
  ChevronDown
} from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

interface CurrentUser {
  fullName: string;
  displayId: string;
  role: 'student' | 'faculty' | 'advisor' | string;
}

export const UserMenu: React.FC = () => {
  const router = useRouter();
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const supabase = createClient();
    let active = true;

    const load = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!active) return;

      if (!authUser) {
        // Check for local demo preview role if any
        const savedDemoRole = typeof window !== 'undefined' ? localStorage.getItem('project_dna_demo_role') : null;
        if (savedDemoRole === 'faculty') {
          setUser({
            fullName: 'ผศ.ดร. นคร พัฒนา',
            displayId: 'nakorn.p@ku.th',
            role: 'faculty'
          });
        } else {
          setUser(null);
        }
        setLoading(false);
        return;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name, student_id, role')
        .eq('id', authUser.id)
        .single();

      if (!active) return;
      setUser({
        fullName: profile?.full_name || authUser.user_metadata?.full_name || '',
        displayId: profile?.student_id || authUser.email || '',
        role: profile?.role || authUser.user_metadata?.role || (authUser.email?.endsWith('@ku.th') || authUser.email?.endsWith('@ku.ac.th') ? 'faculty' : 'student'),
      });
      setLoading(false);
    };

    load();
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => load());

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    const supabase = createClient();
    if (typeof window !== 'undefined') {
      localStorage.removeItem('project_dna_demo_role');
    }
    await supabase.auth.signOut();
    setUser(null);
    setIsOpen(false);
    router.push('/login');
    router.refresh();
  };

  // Skeleton while the session is being checked
  if (loading) {
    return <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 animate-pulse" aria-hidden="true" />;
  }

  // Not signed in — show the login link
  if (!user) {
    return (
      <div className="flex items-center space-x-1.5 shrink-0">
        <Link
          href="/login"
          className="flex items-center space-x-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-800 font-semibold text-xs rounded-xl transition-all shrink-0 border border-slate-200/80 shadow-2xs"
        >
          <LogIn className="w-3.5 h-3.5 text-slate-600" />
          <span className="hidden sm:inline">เข้าสู่ระบบ</span>
        </Link>
      </div>
    );
  }

  const isFaculty = user.role === 'faculty' || user.role === 'advisor';
  const initial = (user.fullName || user.displayId || '?').charAt(0).toUpperCase();

  return (
    <div className="relative shrink-0" ref={menuRef}>
      
      {/* User Profile Chip Trigger */}
      <button
        onClick={() => setIsOpen(prev => !prev)}
        className={`flex items-center space-x-2 pl-1 pr-2.5 py-1 rounded-full border transition-all shadow-2xs ${
          isFaculty 
            ? 'bg-amber-50/80 hover:bg-amber-100/80 border-amber-300/80 text-amber-950 ring-1 ring-amber-400/30' 
            : 'bg-white hover:bg-slate-50 border-slate-200/90 text-slate-900'
        }`}
        title={user.fullName ? `${user.fullName} (${user.displayId})` : user.displayId}
      >
        <span className={`w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center ${
          isFaculty ? 'bg-slate-950 text-amber-400 shadow-xs' : 'bg-slate-800 text-white'
        }`}>
          {initial}
        </span>
        
        <div className="hidden md:flex flex-col text-left leading-tight">
          <span className="text-[11px] font-bold truncate max-w-[130px]">
            {user.fullName || user.displayId}
          </span>
          <span className="text-[10px] font-medium opacity-80 flex items-center space-x-1">
            {isFaculty ? (
              <span className="text-amber-800 font-semibold flex items-center">
                <ShieldCheck className="w-2.5 h-2.5 mr-0.5" /> อาจารย์
              </span>
            ) : (
              <span className="text-slate-500">นิสิต</span>
            )}
          </span>
        </div>

        <ChevronDown className={`w-3.5 h-3.5 opacity-60 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Floating Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl border border-slate-200/90 shadow-xl overflow-hidden z-50 text-slate-900 font-sans animate-in fade-in zoom-in-95 duration-100">
          
          {/* User Info Header */}
          <div className="p-4 bg-slate-50/90 border-b border-slate-200/80 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 truncate">
                {user.fullName || 'ผู้ใช้งาน'}
              </span>
              <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold font-mono ${
                isFaculty 
                  ? 'bg-amber-500 text-slate-950 shadow-2xs' 
                  : 'bg-slate-200 text-slate-800'
              }`}>
                {isFaculty ? 'ROLE: อาจารย์' : 'ROLE: นิสิต'}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-mono truncate">
              {user.displayId}
            </p>
          </div>

          {/* Faculty Dashboard Link */}
          {isFaculty && (
            <div className="p-2 border-b border-slate-200/80">
              <Link
                href="/advisor"
                onClick={() => setIsOpen(false)}
                className="w-full flex items-center space-x-2 p-2 rounded-xl text-amber-800 hover:bg-amber-50 text-xs font-semibold transition-colors"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>แดชบอร์ดอาจารย์ที่ปรึกษา</span>
              </Link>
            </div>
          )}

          {/* Sign Out Button */}
          <div className="p-2 border-t border-slate-200/80">
            <button
              onClick={handleSignOut}
              className="w-full flex items-center space-x-2 p-2 rounded-xl text-rose-600 hover:bg-rose-50 text-xs font-semibold transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>ออกจากระบบ</span>
            </button>
          </div>

        </div>
      )}

    </div>
  );
};
