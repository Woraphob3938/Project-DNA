'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { 
  ArrowLeft, 
  Lock, 
  User, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle
} from 'lucide-react';
import { Logo } from '@/components/layout/Logo';

// University email domains that are allowed to sign in
const ALLOWED_KU_DOMAINS = ['student.ku.ac.th', 'ku.ac.th', 'ku.th'];
const STUDENT_EMAIL_DOMAIN = 'student.ku.ac.th';

/**
 * Normalize a KU CSC student ID into the canonical "b + digits" form.
 * Accepts: b6521600000 / B65-216-0000 / 6521600000
 */
function normalizeStudentId(raw: string): string | null {
  const cleaned = raw.trim().toLowerCase().replace(/[\s.\-_()/]/g, '');
  if (/^b\d{9,11}$/.test(cleaned)) return cleaned;
  if (/^\d{9,11}$/.test(cleaned)) return `b${cleaned}`;
  return null;
}

function getEmailDomain(email: string): string {
  return email.split('@')[1]?.toLowerCase().trim() ?? '';
}

function translateAuthError(message: string): string {
  const m = message.toLowerCase();
  if (m.includes('invalid login credentials')) return 'รหัสนิสิต / อีเมลหรือรหัสผ่านไม่ถูกต้อง กรุณาลองอีกครั้ง';
  if (m.includes('user already registered')) return 'รหัสนี้สมัครใช้งานแล้ว กรุณาเข้าสู่ระบบแทนการสมัครใหม่';
  if (m.includes('password should be at least')) return 'รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร';
  if (m.includes('email not confirmed')) return 'กรุณายืนยันตัวตนผ่านอีเมลก่อนเข้าสู่ระบบ';
  if (m.includes('rate limit') || m.includes('too many')) return 'พยายามบ่อยเกินไป กรุณารอสักครู่แล้วลองอีกครั้ง';
  if (m.includes('signup') && m.includes('not allowed')) return 'ระบบปิดการสมัครสมาชิกชั่วคราว กรุณาติดต่อผู้ดูแลระบบ';
  return `เกิดข้อผิดพลาด: ${message}`;
}

export default function LoginPage() {
  const router = useRouter();
  const [accountType, setAccountType] = useState<'student' | 'faculty'>('student');
  const [isSignUp, setIsSignUp] = useState(false);
  const [identifier, setIdentifier] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  
  // 8-state handling: default, loading, error, success
  const [status, setStatus] = useState<'idle' | 'loading' | 'error' | 'success'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [infoMessage, setInfoMessage] = useState('');

  // Surface errors passed back from the OAuth callback (e.g. non-KU email)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const err = params.get('error');
    if (err === 'domain') {
      setStatus('error');
      setErrorMessage('อีเมลนี้ไม่ใช่อีเมลของมหาวิทยาลัยเกษตรศาสตร์ กรุณาใช้อีเมล @student.ku.ac.th, @ku.ac.th หรือ @ku.th เท่านั้น');
    } else if (err === 'oauth') {
      setStatus('error');
      setErrorMessage('การเข้าสู่ระบบด้วย Google ไม่สำเร็จ กรุณาลองอีกครั้ง');
    }
  }, []);

  const handleSuccess = () => {
    setStatus('success');
    setTimeout(() => {
      // Return the visitor to the gated action that sent them here.
      // Only same-app absolute paths are allowed (open-redirect guard).
      const params = new URLSearchParams(window.location.search);
      const next = params.get('next');
      router.push(next && next.startsWith('/') && !next.startsWith('//') ? next : '/');
      router.refresh();
    }, 800);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) {
      setStatus('error');
      setErrorMessage(accountType === 'student' ? 'กรุณากรอกรหัสนิสิต' : 'กรุณากรอกอีเมลมหาวิทยาลัย');
      return;
    }
    if (!password) {
      setStatus('error');
      setErrorMessage('กรุณากรอกรหัสผ่าน');
      return;
    }

    setStatus('loading');
    setErrorMessage('');
    setInfoMessage('');

    try {
      const supabase = createClient();

      if (accountType === 'student') {
        // ---- Student flow: รหัสนิสิต มก.สกลนคร ----
        const studentId = normalizeStudentId(identifier);
        if (!studentId) {
          throw new Error('รูปแบบรหัสนิสิตไม่ถูกต้อง ตัวอย่าง: b6521600000 หรือ 6521600000');
        }
        if (password.length < 6) {
          throw new Error('รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร');
        }

        // Supabase Auth ใช้อีเมลเป็น identifier — map รหัสนิสิตเป็นอีเมลสังเคราะห์ของวิทยาเขต
        const email = `${studentId}@${STUDENT_EMAIL_DOMAIN}`;

        if (isSignUp) {
          if (!fullName.trim()) {
            throw new Error('กรุณากรอกชื่อ-นามสกุล');
          }
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: { data: { full_name: fullName.trim(), student_id: studentId } },
          });
          if (error) throw error;
          if (data.session) {
            handleSuccess(); // auto-confirm enabled — signed in immediately
          } else {
            setStatus('idle');
            setInfoMessage('สมัครบัญชีสำเร็จ! หาระบบเปิดใช้การยืนยันอีเมล กรุณาตรวจสอบอีเมลเพื่อยืนยันตัวตนก่อนเข้าสู่ระบบ');
          }
        } else {
          const { error } = await supabase.auth.signInWithPassword({ email, password });
          if (error) throw error;
          handleSuccess();
        }
      } else {
        // ---- Faculty flow: อีเมลมหาวิทยาลัย ----
        const email = identifier.trim().toLowerCase();
        if (!ALLOWED_KU_DOMAINS.includes(getEmailDomain(email))) {
          throw new Error('กรุณาใช้อีเมลมหาวิทยาลัยเกษตรศาสตร์เท่านั้น (@ku.ac.th หรือ @ku.th)');
        }
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        handleSuccess();
      }
    } catch (err) {
      setStatus('error');
      setErrorMessage(err instanceof Error ? translateAuthError(err.message) : 'เกิดข้อผิดพลาดที่ไม่รู้จัก กรุณาลองอีกครั้ง');
    }
  };

  const handleSSOGoogle = async () => {
    setStatus('loading');
    setErrorMessage('');
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          // Callback route verifies the email is a KU address before allowing entry
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
      // Browser will redirect to Google — nothing else to do here
    } catch {
      setStatus('error');
      setErrorMessage('ไม่สามารถเชื่อมต่อ Google Sign-In ได้ กรุณาลองอีกครั้ง');
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F5F7] text-slate-900 flex flex-col justify-between font-sans">
      
      {/* Top Simple Navigation */}
      <header className="px-6 py-4 border-b border-slate-200/80 bg-white flex items-center justify-between">
        <Link 
          href="/"
          className="flex items-center space-x-2 text-xs font-bold text-slate-700 hover:text-amber-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>กลับสู่หน้าหลักคลังโครงงาน</span>
        </Link>

        <div className="flex items-center space-x-2">
          <Logo className="w-8 h-8" />
          <span className="font-display font-bold text-sm text-slate-900">Project DNA</span>
          <span className="text-[11px] font-mono text-slate-400">· มก.ฉกส.</span>
        </div>
      </header>

      {/* Main Centered Login Card */}
      <main className="flex-1 max-w-xl w-full mx-auto p-4 md:p-8 flex items-center justify-center">
        <div className="w-full bg-white rounded-3xl border border-slate-200/90 shadow-card p-8 md:p-10 space-y-6">
          
          {/* Form Heading */}
          <div>
            <h1 className="font-display text-xl md:text-2xl font-bold text-slate-900">
              เข้าสู่ระบบ (Sign In)
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              เข้าสู่ระบบด้วยรหัสนิสิต มก.สกลนคร หรือ Google อีเมลมหาวิทยาลัย (@student.ku.ac.th / @ku.ac.th / @ku.th)
            </p>
          </div>

          {/* Account Type Selector (Pill tabs) */}
          <div className="flex p-1 bg-slate-100 rounded-xl text-xs font-semibold text-slate-600">
            <button
              type="button"
              onClick={() => { setAccountType('student'); setIsSignUp(false); }}
              className={`flex-1 py-1.5 rounded-lg transition-colors ${
                accountType === 'student'
                  ? 'bg-white text-slate-950 font-bold shadow-xs'
                  : 'hover:text-slate-900'
              }`}
            >
              นิสิต มก.สกลนคร (Student)
            </button>
            <button
              type="button"
              onClick={() => { setAccountType('faculty'); setIsSignUp(false); }}
              className={`flex-1 py-1.5 rounded-lg transition-colors ${
                accountType === 'faculty'
                  ? 'bg-white text-slate-950 font-bold shadow-xs'
                  : 'hover:text-slate-900'
              }`}
            >
              อาจารย์ / ที่ปรึกษา (Email)
            </button>
          </div>

          {/* SSO Google / KU Mail Button */}
          <div>
            <button
              type="button"
              onClick={handleSSOGoogle}
              disabled={status === 'loading'}
              className="w-full py-2.5 px-4 bg-white border border-slate-300 hover:bg-slate-50 active:bg-slate-100 rounded-xl text-xs font-bold text-slate-800 flex items-center justify-center space-x-2.5 transition-colors shadow-2xs disabled:opacity-50"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
              <span>เข้าสู่ระบบด้วย Google Workspace (@ku.th)</span>
            </button>
          </div>

          {/* Divider */}
          <div className="relative flex items-center justify-center">
            <div className="border-t border-slate-200 w-full" />
            <span className="bg-white px-3 text-[11px] font-medium text-slate-400 uppercase tracking-wider">
              หรือเข้าสู่ระบบด้วยรหัสผ่าน
            </span>
          </div>

          {/* Feedback Error / Success Alert */}
          {status === 'error' && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center space-x-2 text-xs text-red-700 font-medium">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          {status === 'success' && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center space-x-2 text-xs text-emerald-700 font-bold">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>เข้าสู่ระบบสำเร็จ กำลังนำทางสู่คลังโครงงาน...</span>
            </div>
          )}

          {infoMessage && status !== 'error' && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start space-x-2 text-xs text-amber-800 font-medium">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
              <span>{infoMessage}</span>
            </div>
          )}

          {/* Login / Sign-up Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Full Name (only when students register) */}
            {accountType === 'student' && isSignUp && (
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-800">
                  ชื่อ-นามสกุล
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="เช่น สมชาย ใจดี"
                    className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-500 focus:bg-white text-slate-900 placeholder-slate-400 transition-colors"
                    required
                  />
                </div>
              </div>
            )}

            {/* Identifier (Student ID / KU Email) */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-800">
                {accountType === 'student' ? 'รหัสนิสิต มก.สกลนคร' : 'อีเมลมหาวิทยาลัย (@ku.ac.th / @ku.th)'}
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder={accountType === 'student' ? 'เช่น b6521600000 หรือ 6521600000' : 'เช่น somchai.j@ku.ac.th'}
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-500 focus:bg-white text-slate-900 placeholder-slate-400 transition-colors"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-800">
                รหัสผ่าน (Password)
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="กรอกรหัสผ่านบัญชี KU"
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-500 focus:bg-white text-slate-900 placeholder-slate-400 transition-colors"
                  required
                />
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center space-x-2 cursor-pointer select-none text-slate-600">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-300 text-amber-600 focus:ring-amber-500 w-4 h-4"
                />
                <span>จดจำการเข้าสู่ระบบบนอุปกรณ์นี้</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={status === 'loading' || status === 'success'}
              className="w-full py-3 px-4 bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-slate-950 font-bold text-sm rounded-xl shadow-xs flex items-center justify-center space-x-2 transition-colors disabled:opacity-50 mt-2"
            >
              {status === 'loading' ? (
                <span className="flex items-center space-x-2">
                  <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  <span>กำลังตรวจสอบข้อมูล...</span>
                </span>
              ) : (
                <>
                  <span>{accountType === 'student' && isSignUp ? 'สมัครบัญชีใหม่ด้วยรหัสนิสิต' : 'เข้าสู่ระบบ'}</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </>
              )}
            </button>
          </form>

          {/* Sign-in / Sign-up Toggle (students only) */}
          {accountType === 'student' && (
            <div className="pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
              {isSignUp ? (
                <>
                  มีบัญชีอยู่แล้ว?{' '}
                  <button
                    type="button"
                    onClick={() => { setIsSignUp(false); setStatus('idle'); setInfoMessage(''); }}
                    className="font-bold text-slate-900 hover:text-amber-700 transition-colors underline underline-offset-2"
                  >
                    เข้าสู่ระบบที่นี่
                  </button>
                </>
              ) : (
                <>
                  นิสิตใหม่ยังไม่มีบัญชี?{' '}
                  <button
                    type="button"
                    onClick={() => { setIsSignUp(true); setStatus('idle'); setInfoMessage(''); }}
                    className="font-bold text-slate-900 hover:text-amber-700 transition-colors underline underline-offset-2"
                  >
                    สมัครบัญชีด้วยรหัสนิสิต
                  </button>
                </>
              )}
            </div>
          )}

          {accountType === 'faculty' && (
            <div className="pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
              บัญชีอาจารย์สร้างโดยผู้ดูแลระบบเท่านั้น กรุณาติดต่อคณะกรรมการโครงงานหากเข้าสู่ระบบไม่ได้
            </div>
          )}

        </div>
      </main>

      {/* Page Footer */}
      <footer className="px-6 py-4 text-center text-xs text-slate-500">
        © 2026 Project DNA · มหาวิทยาลัยเกษตรศาสตร์ วิทยาเขตเฉลิมพระเกียรติ จังหวัดสกลนคร (KU CSC)
      </footer>

    </div>
  );
}
