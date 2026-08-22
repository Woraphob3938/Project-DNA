'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogIn, LogOut } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

interface CurrentUser {
  fullName: string;
  displayId: string;
  role: string;
}

export const UserMenu: React.FC = () => {
  const router = useRouter();
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    let active = true;

    const load = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!active) return;

      if (!authUser) {
        setUser(null);
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
        fullName: profile?.full_name || '',
        displayId: profile?.student_id || authUser.email || '',
        role: profile?.role || 'student',
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

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
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
      <a
        href="/login"
        className="flex items-center space-x-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-800 font-semibold text-xs rounded-xl transition-all shrink-0 border border-slate-200/80"
      >
        <LogIn className="w-3.5 h-3.5 text-slate-600" />
        <span className="hidden sm:inline">เข้าสู่ระบบ</span>
      </a>
    );
  }

  // Signed in — show identity chip + logout
  const initial = (user.fullName || user.displayId || '?').charAt(0).toUpperCase();

  return (
    <div className="flex items-center space-x-2 shrink-0">
      <div
        className="flex items-center space-x-2 pl-1 pr-3 py-1 bg-white rounded-full border border-slate-200/90 shadow-2xs"
        title={user.fullName ? `${user.fullName} (${user.displayId})` : user.displayId}
      >
        <span className="w-7 h-7 rounded-full bg-slate-950 text-amber-400 text-xs font-bold flex items-center justify-center">
          {initial}
        </span>
        <span className="hidden md:flex flex-col leading-tight">
          <span className="text-[11px] font-bold text-slate-900 truncate max-w-[140px]">
            {user.fullName || user.displayId}
          </span>
          <span className="text-[10px] text-slate-500">
            {user.displayId !== user.fullName ? user.displayId : (user.role === 'faculty' ? 'อาจารย์' : 'นิสิต')}
          </span>
        </span>
      </div>

      <button
        onClick={handleSignOut}
        className="p-2 bg-slate-100 hover:bg-red-50 hover:text-red-600 text-slate-600 rounded-xl border border-slate-200/80 transition-colors"
        title="ออกจากระบบ"
        aria-label="ออกจากระบบ"
      >
        <LogOut className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
