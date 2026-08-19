'use client';

import React, { useState } from 'react';
import { 
  Target, 
  Building2, 
  GraduationCap, 
  Factory, 
  MapPin, 
  ArrowUpRight, 
  AlertCircle,
  GitFork,
  CheckCircle2
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
    <div className="max-w-7xl mx-auto space-y-8">
      
      {/* Header Banner */}
      <div className="bg-slate-900 text-white p-6 md:p-8 rounded-2xl border border-slate-800 shadow-sm">
        <div className="max-w-3xl space-y-2">
          <div className="flex items-center space-x-2 text-amber-400 font-mono text-xs font-bold uppercase tracking-wider">
            <Target className="w-4 h-4" />
            <span>REAL-WORLD CHALLENGES & MATCHING HUB</span>
          </div>
          <h2 className="font-display text-2xl md:text-3xl font-bold tracking-tight text-white">
            คลังโจทย์จริงจากชุมชน มหาวิทยาลัย และอุตสาหกรรม
          </h2>
          <p className="text-xs md:text-sm text-slate-300 leading-relaxed font-sans">
            เชื่อมโยงองค์ความรู้และงานวิจัยของนิสิต มก.ฉกส. เข้ากับความต้องการที่แท้จริงของภาคธุรกิจ ท้องถิ่น และมหาวิทยาลัย
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 text-xs">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`px-3.5 py-1.5 rounded-lg font-bold transition-colors ${
            selectedCategory === null
              ? 'bg-slate-900 text-white'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
          }`}
        >
          โจทย์ทั้งหมด ({challenges.length})
        </button>
        <button
          onClick={() => setSelectedCategory('industry')}
          className={`px-3.5 py-1.5 rounded-lg font-medium transition-colors flex items-center space-x-1.5 ${
            selectedCategory === 'industry'
              ? 'bg-purple-900 text-white font-bold'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
          }`}
        >
          <Factory className="w-3.5 h-3.5 text-purple-600" />
          <span>ภาคอุตสาหกรรม & ธุรกิจ</span>
        </button>
        <button
          onClick={() => setSelectedCategory('university')}
          className={`px-3.5 py-1.5 rounded-lg font-medium transition-colors flex items-center space-x-1.5 ${
            selectedCategory === 'university'
              ? 'bg-blue-900 text-white font-bold'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
          }`}
        >
          <GraduationCap className="w-3.5 h-3.5 text-blue-600" />
          <span>ภายในมหาวิทยาลัย (Smart Campus)</span>
        </button>
        <button
          onClick={() => setSelectedCategory('community')}
          className={`px-3.5 py-1.5 rounded-lg font-medium transition-colors flex items-center space-x-1.5 ${
            selectedCategory === 'community'
              ? 'bg-emerald-900 text-white font-bold'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
          }`}
        >
          <Building2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>ชุมชนและสิ่งแวดล้อมสกลนคร</span>
        </button>
      </div>

      {/* Challenges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredChallenges.map((chal) => (
          <article
            key={chal.id}
            className="bg-white rounded-2xl p-6 border border-slate-200 shadow-soft hover:shadow-card transition-[border-color,box-shadow] duration-150 flex flex-col justify-between space-y-6"
          >
            <div className="space-y-4">
              
              {/* Category & Location Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
                    chal.category === 'industry' ? 'bg-purple-100 text-purple-900' :
                    chal.category === 'university' ? 'bg-blue-100 text-blue-900' : 'bg-emerald-100 text-emerald-900'
                  }`}>
                    {chal.category === 'industry' ? 'ภาคอุตสาหกรรม' : chal.category === 'university' ? 'มหาวิทยาลัย' : 'ชุมชน'}
                  </span>
                  <span className="text-xs font-semibold text-slate-700">{chal.organization_name}</span>
                </div>
                <span className="text-xs text-slate-500 flex items-center">
                  <MapPin className="w-3.5 h-3.5 mr-1 text-slate-400" />
                  {chal.location}
                </span>
              </div>

              {/* Title & Description */}
              <div>
                <h3 className="font-display text-base font-bold text-slate-900 leading-snug">
                  {chal.title}
                </h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  {chal.description}
                </p>
              </div>

              {/* Pain Points (Editorial Indent, NO Card-in-card) */}
              <div className="space-y-1.5 pt-1">
                <div className="font-bold text-slate-800 text-xs flex items-center space-x-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                  <span>ปัญหาหลักที่ต้องการแก้ไข:</span>
                </div>
                <ul className="space-y-1 pl-5 text-xs text-slate-600 list-disc">
                  {chal.pain_points.map((p, i) => (
                    <li key={i} className="leading-relaxed">{p}</li>
                  ))}
                </ul>
              </div>

              {/* Desired Outputs */}
              <div className="space-y-1 text-xs">
                <span className="font-bold text-slate-800">ผลลัพธ์ที่ต้องการ (Desired Outputs):</span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {chal.desired_outputs.map((out, idx) => (
                    <span key={idx} className="px-2 py-0.5 bg-slate-100 text-slate-800 border border-slate-200 rounded text-[11px] font-medium">
                      ✓ {out}
                    </span>
                  ))}
                </div>
              </div>

            </div>

            {/* Matched DNA Projects Box */}
            <div className="pt-4 border-t border-slate-100 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700 flex items-center space-x-1">
                  <GitFork className="w-3.5 h-3.5 text-amber-600" />
                  <span>โครงงานที่มี DNA สอดคล้อง:</span>
                </span>
                <span className="text-[11px] font-mono font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
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
                      className="p-2.5 bg-slate-50 hover:bg-amber-50/70 rounded-lg border border-slate-200/80 cursor-pointer flex items-center justify-between transition-colors group"
                    >
                      <span className="text-xs font-medium text-slate-800 group-hover:text-amber-800 truncate mr-2">
                        {proj.title_th}
                      </span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-700 shrink-0" />
                    </div>
                  );
                })}
              </div>
            </div>

          </article>
        ))}
      </div>

    </div>
  );
};
