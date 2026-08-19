'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Dna, 
  ArrowLeft, 
  GraduationCap, 
  Lock, 
  User, 
  ArrowRight, 
  ShieldCheck, 
  Layers, 
  CheckCircle2, 
  AlertCircle,
  Building,
  KeyRound
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [accountType, setAccountType] = useState<'student' | 'faculty' | 'guest'>('student');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  
  // 8-state handling: default, loading, error, success
  const [status, setStatus] = useState<'idle' | 'loading' | 'error' | 'success'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) {
      setStatus('error');
      setErrorMessage('กรุณากรอกบัญชีผู้ใช้ KU Account หรือรหัสนิสิต');
      return;
    }
    if (!password) {
      setStatus('error');
      setErrorMessage('กรุณากรอกรหัสผ่าน');
      return;
    }

    setStatus('loading');
    setErrorMessage('');

    // Simulate authentic KU CSC authentication
    setTimeout(() => {
      setStatus('success');
      setTimeout(() => {
        router.push('/');
      }, 900);
    }, 1100);
  };

  const handleSSOGoogle = () => {
    setStatus('loading');
    setTimeout(() => {
      setStatus('success');
      setTimeout(() => {
        router.push('/');
      }, 800);
    }, 1000);
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
          <div className="w-7 h-7 rounded-lg bg-slate-950 text-amber-400 flex items-center justify-center">
            <Dna className="w-4 h-4" />
          </div>
          <span className="font-display font-bold text-sm text-slate-900">Project DNA</span>
          <span className="text-[11px] font-mono text-slate-400">· มก.ฉกส.</span>
        </div>
      </header>

      {/* Main Split Layout Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 md:p-8 flex items-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 bg-white rounded-3xl border border-slate-200/90 shadow-card overflow-hidden">
          
          {/* Left Panel: Academic Identity & Showcase (5 cols) */}
          <div className="lg:col-span-5 bg-slate-900 text-white p-8 md:p-10 flex flex-col justify-between relative overflow-hidden">
            
            {/* Top Badge */}
            <div className="space-y-4 relative z-10">
              <div className="inline-flex items-center space-x-2 px-3 py-1 bg-slate-800 text-amber-400 border border-slate-700 rounded-lg text-xs font-mono font-semibold">
                <GraduationCap className="w-3.5 h-3.5" />
                <span>KU CSC IDENTITY PORTAL</span>
              </div>

              <h1 className="font-display text-2xl md:text-3xl font-bold tracking-tight text-white leading-snug">
                ระบบจัดการองค์ความรู้ & พิมพ์เขียวโครงงานนิสิต
              </h1>

              <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
                เข้าสู่ระบบเพื่อสืบค้น พัฒนาต่อยอด (Inception Studio) และสืบทอดสายวิวัฒนาการเทคโนโลยีของมหาวิทยาลัยเกษตรศาสตร์ สกลนคร
              </p>
            </div>

            {/* Middle Feature List (Honest academic facts) */}
            <div className="my-8 space-y-3.5 relative z-10 text-xs text-slate-300">
              <div className="flex items-start space-x-2.5">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>เชื่อมต่อฐานข้อมูล 4 คณะ 23 สาขาวิชา มก.ฉกส.</span>
              </div>
              <div className="flex items-start space-x-2.5">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>เข้าถึงซอร์สโค้ด GitHub, ชุดข้อมูล Dataset และแบบวงจร</span>
              </div>
              <div className="flex items-start space-x-2.5">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>ใช้ AI สกัด DNA และวิเคราะห์ช่องว่างต่อยอดผลงาน</span>
              </div>
            </div>

            {/* Bottom University Footer */}
            <div className="pt-6 border-t border-slate-800 relative z-10 text-[11px] text-slate-400 space-y-1">
              <div className="font-medium text-slate-300">มหาวิทยาลัยเกษตรศาสตร์</div>
              <div>วิทยาเขตเฉลิมพระเกียรติ จังหวัดสกลนคร (KU CSC)</div>
            </div>
          </div>

          {/* Right Panel: Login Form & Auth Actions (7 cols) */}
          <div className="lg:col-span-7 p-8 md:p-12 flex flex-col justify-center bg-white">
            <div className="max-w-md w-full mx-auto space-y-6">
              
              {/* Form Heading */}
              <div>
                <h2 className="font-display text-xl md:text-2xl font-bold text-slate-900">
                  เข้าสู่ระบบ (Sign In)
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  กรุณาเข้าสู่ระบบด้วยบัญชี KU Account หรืออีเมลองค์กร @ku.th
                </p>
              </div>

              {/* Account Type Selector (Pill tabs) */}
              <div className="flex p-1 bg-slate-100 rounded-xl text-xs font-semibold text-slate-600">
                <button
                  type="button"
                  onClick={() => setAccountType('student')}
                  className={`flex-1 py-1.5 rounded-lg transition-colors ${
                    accountType === 'student'
                      ? 'bg-white text-slate-950 font-bold shadow-xs'
                      : 'hover:text-slate-900'
                  }`}
                >
                  นิสิต มก. (Student)
                </button>
                <button
                  type="button"
                  onClick={() => setAccountType('faculty')}
                  className={`flex-1 py-1.5 rounded-lg transition-colors ${
                    accountType === 'faculty'
                      ? 'bg-white text-slate-950 font-bold shadow-xs'
                      : 'hover:text-slate-900'
                  }`}
                >
                  อาจารย์ / ที่ปรึกษา
                </button>
                <button
                  type="button"
                  onClick={() => setAccountType('guest')}
                  className={`flex-1 py-1.5 rounded-lg transition-colors ${
                    accountType === 'guest'
                      ? 'bg-white text-slate-950 font-bold shadow-xs'
                      : 'hover:text-slate-900'
                  }`}
                >
                  บุคคลทั่วไป (Guest)
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

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Identifier (KU Account / Student ID) */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-800">
                    {accountType === 'student' ? 'รหัสนิสิต หรือ KU Mail (@ku.th)' : 'บัญชีผู้ใช้ KU Account / อีเมล'}
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder={accountType === 'student' ? 'เช่น b6521600000 หรือ firstname.l@ku.th' : 'เช่น username หรือ firstname.l@ku.th'}
                      className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-500 focus:bg-white text-slate-900 placeholder-slate-400 transition-colors"
                      required
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-slate-800">
                      รหัสผ่าน (Password)
                    </label>
                    <a
                      href="https://accounts.ku.th"
                      target="_blank"
                      rel="noreferrer"
                      className="text-[11px] font-semibold text-amber-700 hover:text-amber-800 transition-colors"
                    >
                      ลืมรหัสผ่าน KU?
                    </a>
                  </div>
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

                  <span className="text-[11px] text-slate-400 flex items-center">
                    <ShieldCheck className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                    ระบบปลอดภัย 256-bit
                  </span>
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
                      <span>เข้าสู่ระบบ</span>
                      <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                    </>
                  )}
                </button>
              </form>

              {/* Registration Hint */}
              <div className="pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
                ยังไม่มีบัญชี หรือเป็นนิสิตใหม่?{' '}
                <a
                  href="https://accounts.ku.th"
                  target="_blank"
                  rel="noreferrer"
                  className="font-bold text-slate-900 hover:text-amber-700 transition-colors"
                >
                  เปิดใช้งาน KU Account
                </a>
              </div>

            </div>
          </div>

        </div>
      </main>

      {/* Page Footer */}
      <footer className="px-6 py-4 text-center text-xs text-slate-500">
        © 2026 Project DNA · มหาวิทยาลัยเกษตรศาสตร์ วิทยาเขตเฉลิมพระเกียรติ จังหวัดสกลนคร (KU CSC)
      </footer>

    </div>
  );
}
