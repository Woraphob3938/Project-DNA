'use client';

import React from 'react';
import { 
  GitFork, 
  Bookmark, 
  FileCode, 
  Database, 
  Cpu, 
  Box, 
  ArrowUpRight,
  Layers,
  Sparkles
} from 'lucide-react';
import { Project, AiMatchResult } from '@/types/dna';

interface DnaCardProps {
  project: Project;
  isSelected: boolean;
  onSelect: (project: Project) => void;
  isFavorite: boolean;
  onToggleFavorite: (projectId: string, e: React.MouseEvent) => void;
  aiMatchResult?: AiMatchResult;
}

export const DnaCard: React.FC<DnaCardProps> = ({
  project,
  isSelected,
  onSelect,
  isFavorite,
  onToggleFavorite,
  aiMatchResult
}) => {
  const hasCode = project.assets?.some(a => a.asset_type === 'code_repo') || Boolean(project.dna_card?.repository_url);
  const hasDataset = project.assets?.some(a => a.asset_type === 'dataset');
  const hasHardware = project.assets?.some(a => a.asset_type === 'cad_blueprint' || a.asset_type === 'circuit_schematic') || Boolean(project.dna_card?.hardware_specs);
  const hasModel = project.assets?.some(a => a.asset_type === 'trained_model');
  const hasLineage = (project.parent_lineages?.length || 0) > 0 || (project.child_lineages?.length || 0) > 0;

  return (
    <article
      onClick={() => onSelect(project)}
      className={`group relative bg-white rounded-2xl border cursor-pointer overflow-hidden flex flex-col justify-between transition-all duration-150 ease-out hover:-translate-y-0.5 ${
        isSelected
          ? 'border-amber-500 ring-2 ring-amber-400/40 shadow-card'
          : 'border-slate-200/80 hover:border-slate-300 hover:shadow-card shadow-soft'
      }`}
    >
      {/* 1. Compact Cover Image Banner (h-32) */}
      <div className="relative h-32 w-full overflow-hidden bg-slate-100 shrink-0">
        {project.cover_image_url ? (
          <img
            src={project.cover_image_url}
            alt={project.title_th}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400">
            <Layers className="w-8 h-8 opacity-30" />
          </div>
        )}
        
        {/* Subtle Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

        {/* Top-Left: Consolidated Department & Year Pill */}
        <div className="absolute top-2.5 left-2.5 flex items-center space-x-1.5 z-10">
          <span className="px-2 py-0.5 bg-slate-950/90 text-amber-300 font-mono text-[10px] font-bold rounded-md shadow-xs border border-slate-700/80 backdrop-blur-2xs">
            {project.department?.code || 'KU CSC'}
          </span>
          <span className="px-1.5 py-0.5 bg-white/95 text-slate-800 text-[10px] font-semibold rounded-md shadow-xs backdrop-blur-2xs">
            {project.academic_year}
          </span>
        </div>

        {/* Center: AI Match Score Pill (when active) */}
        {aiMatchResult && (
          <div className="absolute top-2.5 left-1/2 -translate-x-1/2 px-2.5 py-0.5 bg-amber-500 text-slate-950 font-bold text-[10px] rounded-full shadow-md flex items-center space-x-1 border border-amber-300 z-10 animate-in fade-in">
            <Sparkles className="w-3 h-3 fill-current" />
            <span>{aiMatchResult.match_score}% Match</span>
          </div>
        )}

        {/* Top-Right: Favorite Button */}
        <button
          onClick={(e) => onToggleFavorite(project.id, e)}
          className={`absolute top-2.5 right-2.5 w-7 h-7 rounded-lg flex items-center justify-center transition-all shadow-xs z-10 ${
            isFavorite
              ? 'bg-amber-500 text-slate-950'
              : 'bg-slate-900/75 hover:bg-slate-900 text-white hover:text-amber-300'
          }`}
          title={isFavorite ? 'นำออกจากรายการโปรด' : 'บันทึกเป็นรายการโปรด'}
          aria-label={isFavorite ? 'Remove favorite' : 'Add favorite'}
        >
          <Bookmark className={`w-3.5 h-3.5 ${isFavorite ? 'fill-current' : ''}`} />
        </button>

        {/* Bottom Banner Department / Faculty Name */}
        <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between pointer-events-none z-10 text-[10px] text-slate-200">
          <span className="truncate pr-2 font-medium drop-shadow-xs">
            {project.department?.name_th || project.department?.faculty?.name_th || 'มก.ฉกส.'}
          </span>
          {hasLineage && (
            <span className="px-1.5 py-0.5 bg-amber-500 text-slate-950 font-bold rounded flex items-center space-x-0.5 shrink-0 shadow-xs">
              <GitFork className="w-2.5 h-2.5" />
              <span>ต่อยอด</span>
            </span>
          )}
        </div>
      </div>

      {/* 2. Compact Content Body */}
      <div className="p-3.5 flex-1 flex flex-col justify-between space-y-2.5">
        
        {/* Title & Core Problem */}
        <div className="space-y-1">
          <h3 className="font-display font-bold text-slate-900 text-xs md:text-sm leading-snug line-clamp-2 group-hover:text-amber-600 transition-colors">
            {project.title_th}
          </h3>

          {/* AI Match Reason Banner OR Problem Statement */}
          {aiMatchResult?.match_reason ? (
            <div className="p-2 bg-amber-50/90 border border-amber-200/80 rounded-lg text-[10px] text-amber-950 flex items-start space-x-1.5 leading-snug mt-1">
              <Sparkles className="w-3 h-3 text-amber-600 shrink-0 mt-0.5" />
              <div className="line-clamp-2">
                <span className="font-bold text-amber-900">AI: </span>
                <span className="text-slate-700">{aiMatchResult.match_reason}</span>
              </div>
            </div>
          ) : (
            <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-2 mt-0.5">
              {project.dna_card?.problem_statement || project.abstract_th}
            </p>
          )}
        </div>

        {/* Tech Stack Chips (Single Clean Row) */}
        <div className="flex flex-wrap items-center gap-1 overflow-hidden max-h-6">
          {project.dna_card?.tech_stack?.slice(0, 3).map((tech, idx) => (
            <span
              key={idx}
              className="px-2 py-0.5 text-[10px] font-mono font-medium bg-slate-50 text-slate-700 rounded border border-slate-200/80 shrink-0"
            >
              {tech}
            </span>
          ))}
          {(project.dna_card?.tech_stack?.length || 0) > 3 && (
            <span className="px-1 py-0.5 text-[9px] text-slate-400 font-mono bg-slate-50 rounded border border-slate-200/60 shrink-0">
              +{(project.dna_card?.tech_stack?.length || 0) - 3}
            </span>
          )}
        </div>

        {/* 3. Reusable Assets & Footer Action Bar */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
          
          {/* Resource Mini Badges */}
          <div className="flex items-center space-x-1 text-slate-400">
            {hasCode && (
              <span title="มีซอร์สโค้ด GitHub" className="p-1 rounded bg-slate-50 hover:bg-amber-50 text-slate-600 hover:text-amber-800 border border-slate-200/60 transition-colors">
                <FileCode className="w-3 h-3" />
              </span>
            )}
            {hasDataset && (
              <span title="มีชุดข้อมูล Dataset" className="p-1 rounded bg-slate-50 hover:bg-emerald-50 text-slate-600 hover:text-emerald-800 border border-slate-200/60 transition-colors">
                <Database className="w-3 h-3" />
              </span>
            )}
            {hasHardware && (
              <span title="มีแบบวงจร / ฮาร์ดแวร์" className="p-1 rounded bg-slate-50 hover:bg-blue-50 text-slate-600 hover:text-blue-800 border border-slate-200/60 transition-colors">
                <Cpu className="w-3 h-3" />
              </span>
            )}
            {hasModel && (
              <span title="มีโมเดล AI พร้อมใช้" className="p-1 rounded bg-slate-50 hover:bg-purple-50 text-slate-600 hover:text-purple-800 border border-slate-200/60 transition-colors">
                <Box className="w-3 h-3" />
              </span>
            )}
          </div>

          {/* Action Link: ดูพิมพ์เขียว DNA */}
          <div className="flex items-center space-x-0.5 text-[11px] font-bold text-slate-500 group-hover:text-amber-700 transition-colors">
            <span>ดู DNA</span>
            <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </div>

        </div>

      </div>
    </article>
  );
};
