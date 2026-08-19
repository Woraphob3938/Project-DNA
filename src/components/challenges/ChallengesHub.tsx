'use client';

import React, { useState } from 'react';
import { 
  Target, 
  Building2, 
  GraduationCap, 
  Factory, 
  MapPin, 
  Sparkles, 
  ArrowUpRight, 
  CheckCircle2, 
  AlertCircle,
  Plus
} from 'lucide-react';
import { Challenge, Project } from '@/types/dna';

interface ChallengesHubProps {
  challenges: Challenge[];
  projects: Project[];
  onSelectProject: (project: Project) => void;
}

export const ChallengesHub: React.FC<ChallengesHubProps> = ({
  challenges,
  projects,
  onSelectProject
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredChallenges = selectedCategory
    ? challenges.filter(c => c.category === selectedCategory)
    : challenges;

  const projMap = new Map<string, Project>();
  projects.forEach(p => projMap.set(p.id, p));

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8 animate-in fade-in">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 text-slate-950 p-6 md:p-8 rounded-3xl shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center space-x-2 text-slate-900 text-xs font-black uppercase tracking-wider mb-2">
            <Target className="w-4 h-4" />
            <span>REAL-WORLD CHALLENGES & SDG MATCHING HUB</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-black tracking-tight">
            คลังโจทย์จริงจากชุมชน มหาวิทยาลัย และอุตสาหกรรม
          </h2>
          <p className="text-xs md:text-sm text-slate-900/90 mt-2 font-medium leading-relaxed">
            เชื่อมโยงองค์ความรู้และเทคโนโลยีของนิสิตเข้ากับความต้องการที่แท้จริง พร้อมขับเคลื่อนเป้าหมายการพัฒนาที่ยั่งยืน (SDGs 4, 9, 11, 12, 17)
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 text-xs">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`px-4 py-2 rounded-xl font-bold transition-all ${
            selectedCategory === null
              ? 'bg-slate-900 text-amber-400 shadow-sm'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          โจทย์ทั้งหมด ({challenges.length})
        </button>
        <button
          onClick={() => setSelectedCategory('industry')}
          className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center space-x-1.5 ${
            selectedCategory === 'industry'
              ? 'bg-purple-700 text-white shadow-sm'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Factory className="w-3.5 h-3.5" />
          <span>โจทย์ภาคอุตสาหกรรม & ธุรกิจ</span>
        </button>
        <button
          onClick={() => setSelectedCategory('university')}
          className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center space-x-1.5 ${
            selectedCategory === 'university'
              ? 'bg-blue-700 text-white shadow-sm'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <GraduationCap className="w-3.5 h-3.5" />
          <span>โจทย์ภายในมหาวิทยาลัย (Smart Campus)</span>
        </button>
        <button
          onClick={() => setSelectedCategory('community')}
          className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center space-x-1.5 ${
            selectedCategory === 'community'
              ? 'bg-emerald-700 text-white shadow-sm'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>โจทย์ชุมชนและสิ่งแวดล้อมสกลนคร</span>
        </button>
      </div>

      {/* Challenges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredChallenges.map((chal) => (
          <div
            key={chal.id}
            className="bg-white rounded-3xl p-6 border border-slate-200 shadow-soft hover:shadow-card transition-all flex flex-col justify-between"
          >
            <div>
              {/* Category & Location Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-lg ${
                    chal.category === 'industry' ? 'bg-purple-100 text-purple-800' :
                    chal.category === 'university' ? 'bg-blue-100 text-blue-800' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {chal.category === 'industry' ? 'ภาคอุตสาหกรรม' : chal.category === 'university' ? 'มหาวิทยาลัย' : 'ชุมชน'}
                  </span>
                  <span className="text-xs font-bold text-slate-500">{chal.organization_name}</span>
                </div>
                <span className="text-xs text-slate-400 flex items-center">
                  <MapPin className="w-3.5 h-3.5 mr-1" />
                  {chal.location}
                </span>
              </div>

              {/* Title & Description */}
              <h3 className="text-lg font-black text-slate-900 leading-snug">
                {chal.title}
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                {chal.description}
              </p>

              {/* Pain Points */}
              <div className="mt-4 bg-slate-50 p-3.5 rounded-2xl border border-slate-100 space-y-1.5 text-xs">
                <div className="font-bold text-slate-700 flex items-center space-x-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                  <span>ปัญหาหลักที่ต้องแก้ (Pain Points):</span>
                </div>
                {chal.pain_points.map((p, i) => (
                  <div key={i} className="text-slate-600 pl-5 text-[11px]">• {p}</div>
                ))}
              </div>

              {/* Desired Outputs */}
              <div className="mt-3 text-xs space-y-1">
                <span className="font-bold text-slate-700">ผลลัพธ์ที่ต้องการ (Desired Outputs):</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {chal.desired_outputs.map((out, idx) => (
                    <span key={idx} className="px-2 py-0.5 bg-amber-50 text-amber-900 border border-amber-200 rounded text-[10px] font-medium">
                      ✓ {out}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Matched DNA Projects Box */}
            <div className="mt-6 pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-slate-500 flex items-center space-x-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>โครงงานที่มี DNA สอดคล้องพร้อมนำไปใช้:</span>
                </span>
                <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                  {chal.matched_project_ids?.length || 0} โครงงาน
                </span>
              </div>

              <div className="space-y-1.5">
                {chal.matched_project_ids?.map((pid) => {
                  const proj = projMap.get(pid);
                  if (!proj) return null;
                  return (
                    <div
                      key={pid}
                      onClick={() => onSelectProject(proj)}
                      className="p-2.5 bg-slate-50 hover:bg-amber-50 rounded-xl border border-slate-200 cursor-pointer flex items-center justify-between transition-colors group"
                    >
                      <span className="text-xs font-bold text-slate-800 group-hover:text-amber-700 truncate mr-2">
                        {proj.title_th}
                      </span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-600 shrink-0" />
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
