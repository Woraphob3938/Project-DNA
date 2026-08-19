'use client';

import React from 'react';
import { X, Award, Users, Dna, Sparkles, GraduationCap, Github } from 'lucide-react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-amber-300/60 flex flex-col justify-between">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-amber-500/10 via-amber-50 to-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-black shadow-md">
              <Dna className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 bg-amber-500 text-slate-950 rounded">
                SDGS-KUSE HACKATHON 2026
              </span>
              <h3 className="text-lg font-black text-slate-900 mt-0.5">
                เกี่ยวกับโครงการ DNA & ข้อมูลทีม
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-700 leading-relaxed">
          
          {/* Hackathon Context */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
            <div className="font-bold text-slate-900 flex items-center space-x-1.5">
              <Award className="w-4 h-4 text-amber-600" />
              <span>โครงการประกวดผลงานสร้างสรรค์ SDGs-KUSE NONTRI E-SAN HACKATRON 2026</span>
            </div>
            <p className="text-slate-600">
              มหาวิทยาลัยเกษตรศาสตร์ วิทยาเขตเฉลิมพระเกียรติ จังหวัดสกลนคร ประจำปี 2569
            </p>
            <div className="text-[11px] text-amber-800 font-bold">
              หัวข้อ: <strong>DNA: แพลตฟอร์มอัจฉริยะเพื่อค้นหา เชื่อมโยง และต่อยอดโครงงานนิสิต</strong>
            </div>
          </div>

          {/* Team Members List */}
          <div>
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-xs mb-3 flex items-center space-x-1.5">
              <Users className="w-4 h-4 text-amber-600" />
              <span>สมาชิกทีม Ambatukam</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
                <div className="font-bold text-slate-900">1. นางสาวชัชนัน บุญเหลือง</div>
                <div className="text-slate-500 text-[11px]">รหัสนิสิต 6740205106 • ชั้นปีที่ 3</div>
                <div className="text-amber-700 font-bold text-[10px] mt-0.5">หัวหน้าทีม (วิศวกรรมเครื่องกลและการผลิต)</div>
              </div>

              <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
                <div className="font-bold text-slate-900">2. นายวรภพ ไชยวงศ์คต</div>
                <div className="text-slate-500 text-[11px]">รหัสนิสิต 6640203938 • ชั้นปีที่ 4</div>
                <div className="text-amber-700 font-bold text-[10px] mt-0.5">สาขาวิชาวิทยาการคอมพิวเตอร์</div>
              </div>

              <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
                <div className="font-bold text-slate-900">3. นายพัชรพล วงค์คำ</div>
                <div className="text-slate-500 text-[11px]">รหัสนิสิต 6840209388 • ชั้นปีที่ 2</div>
                <div className="text-amber-700 font-bold text-[10px] mt-0.5">สาขาวิชาวิศวกรรมไฟฟ้า</div>
              </div>

              <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
                <div className="font-bold text-slate-900">4. นายพิพัฒน์ โพธิ์ศรีสุข</div>
                <div className="text-slate-500 text-[11px]">รหัสนิสิต 6640207426 • ชั้นปีที่ 4</div>
                <div className="text-amber-700 font-bold text-[10px] mt-0.5">สาขาวิชาวิศวกรรมคอมพิวเตอร์</div>
              </div>
            </div>
          </div>

          {/* GitHub Repository */}
          <div className="p-3.5 bg-slate-900 text-white rounded-2xl flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Github className="w-5 h-5 text-amber-400" />
              <div>
                <div className="font-bold text-xs">GitHub Repository หลักของโปรเจกต์</div>
                <div className="text-[10px] text-slate-400 font-mono">github.com/Woraphob3938/Project-DNA</div>
              </div>
            </div>
            <a
              href="https://github.com/Woraphob3938/Project-DNA.git"
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl"
            >
              เปิด GitHub
            </a>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl"
          >
            ปิด
          </button>
        </div>

      </div>
    </div>
  );
};
