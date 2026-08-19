import Link from 'next/link';
import { Dna, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-100 text-center">
      <div className="w-16 h-16 rounded-3xl bg-amber-500 text-slate-950 flex items-center justify-center shadow-lg mb-4">
        <Dna className="w-8 h-8" />
      </div>
      <h1 className="text-3xl font-black text-slate-900">404 - ไม่พบหน้าที่ต้องการ</h1>
      <p className="text-sm text-slate-600 mt-2 max-w-md">
        หน้าที่คุณกำลังค้นหาอาจถูกย้าย หรือไม่มีอยู่ในระบบ Project DNA
      </p>
      <Link
        href="/"
        className="mt-6 px-6 py-3 bg-slate-900 hover:bg-black text-amber-400 font-bold text-xs rounded-2xl shadow-md inline-flex items-center space-x-2 transition-all"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>กลับสู่หน้าแรก</span>
      </Link>
    </div>
  );
}
