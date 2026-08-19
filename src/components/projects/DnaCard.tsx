'use client';

import React from 'react';
import { 
  GitFork, 
  Star, 
  Bookmark, 
  FileCode, 
  Database, 
  Cpu, 
  Box, 
  ArrowUpRight,
  Layers,
  GitBranch
} from 'lucide-react';
import { Project } from '@/types/dna';

interface DnaCardProps {
  project: Project;
  isSelected: boolean;
  onSelect: (project: Project) => void;
  isFavorite: boolean;
  onToggleFavorite: (projectId: string, e: React.MouseEvent) => void;
}

export const DnaCard: React.FC<DnaCardProps> = ({
  project,
  isSelected,
  onSelect,
  isFavorite,
  onToggleFavorite
}) => {
  const hasCode = project.assets?.some(a => a.asset_type === 'code_repo') || Boolean(project.dna_card?.repository_url);
  const hasDataset = project.assets?.some(a => a.asset_type === 'dataset');
  const hasHardware = project.assets?.some(a => a.asset_type === 'cad_blueprint' || a.asset_type === 'circuit_schematic') || Boolean(project.dna_card?.hardware_specs);
  const hasModel = project.assets?.some(a => a.asset_type === 'trained_model');
  const hasLineage = (project.parent_lineages?.length || 0) > 0 || (project.child_lineages?.length || 0) > 0;
  const hasGaps = (project.gaps?.length || 0) > 0;

  return (
    <article
      onClick={() => onSelect(project)}
      className={`group relative bg-white rounded-2xl border cursor-pointer overflow-hidden flex flex-col justify-between transition-[border-color,box-shadow] duration-150 ease-out ${
        isSelected
          ? 'border-amber-500 ring-2 ring-amber-400/40 shadow-card'
          : 'border-slate-200/80 hover:border-slate-300 hover:shadow-card shadow-soft'
      }`}
    >
      {/* Top Media Banner */}
      <div className="relative h-44 w-full overflow-hidden bg-slate-100">
        {project.cover_image_url ? (
          <img
            src={project.cover_image_url}
            alt={project.title_th}
            className="w-full h-full object-cover transition-opacity duration-200 group-hover:opacity-95"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400">
            <Layers className="w-10 h-10 opacity-40" />
          </div>
        )}
        
        {/* Subtle Dark Gradient Scrim (Single-layer) */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20 pointer-events-none" />

        {/* Top-Left: Consolidated Department & Year Pill */}
        <div className="absolute top-3 left-3 flex items-center space-x-1.5">
          <span className="px-2.5 py-1 bg-slate-900 text-amber-300 font-mono text-xs font-bold rounded-lg shadow-sm border border-slate-700">
            {project.department?.code || 'KU CSC'}
          </span>
          <span className="px-2 py-1 bg-white/95 text-slate-800 text-[11px] font-semibold rounded-lg shadow-sm">
            ปี {project.academic_year}
          </span>
        </div>

        {/* Top-Right: Favorite Button (Solid, crisp) */}
        <button
          onClick={(e) => onToggleFavorite(project.id, e)}
          className={`absolute top-3 right-3 w-8 h-8 rounded-lg flex items-center justify-center transition-colors shadow-sm ${
            isFavorite
              ? 'bg-amber-500 text-slate-950'
              : 'bg-slate-900/75 hover:bg-slate-900 text-white hover:text-amber-300'
          }`}
          title={isFavorite ? 'นำออกจากรายการโปรด' : 'บันทึกเป็นรายการโปรด'}
          aria-label={isFavorite ? 'Remove favorite' : 'Add favorite'}
        >
          <Bookmark className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
        </button>

        {/* Bottom Banner Metadata */}
        <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between pointer-events-none">
          <span className="text-[11px] font-medium text-slate-200 truncate pr-2">
            {project.department?.faculty?.name_th || 'มก.ฉกส.'}
          </span>

          {hasLineage && (
            <span className="px-2 py-0.5 bg-amber-500 text-slate-950 text-[10px] font-bold rounded-md flex items-center space-x-1 shrink-0">
              <GitFork className="w-3 h-3" />
              <span>สายต่อยอด</span>
            </span>
          )}
        </div>
      </div>

      {/* Content Area */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        
        {/* Title & Problem */}
        <div className="space-y-2">
          {/* Thai Title */}
          <h3 className="font-display font-bold text-slate-900 text-base leading-snug line-clamp-2 group-hover:text-amber-700 transition-colors">
            {project.title_th}
          </h3>

          {/* English Subtitle (High contrast) */}
          <p className="text-xs text-slate-500 font-medium line-clamp-1">
            {project.title_en}
          </p>

          {/* Problem Statement (Editorial Left-border indent, NO card-in-card) */}
          <p className="text-xs text-slate-700 leading-relaxed border-l-2 border-amber-500/70 pl-3 py-0.5 line-clamp-2">
            {project.dna_card?.problem_statement || project.abstract_th}
          </p>
        </div>

        {/* Tech Stack Chips */}
        <div>
          <div className="flex flex-wrap gap-1.5 max-h-12 overflow-hidden">
            {project.dna_card?.tech_stack?.slice(0, 4).map((tech, idx) => (
              <span
                key={idx}
                className="px-2.5 py-0.5 text-[11px] font-mono font-medium bg-slate-100 text-slate-800 rounded-md border border-slate-200/80"
              >
                {tech}
              </span>
            ))}
            {(project.dna_card?.tech_stack?.length || 0) > 4 && (
              <span className="px-1.5 py-0.5 text-[10px] text-slate-500 font-medium bg-slate-100 rounded">
                +{(project.dna_card?.tech_stack?.length || 0) - 4}
              </span>
            )}
          </div>
        </div>

        {/* Reusable Assets & Rating Footer */}
        <div className="pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs">
          
          {/* Asset Type Indicators */}
          <div className="flex items-center space-x-1 text-slate-500">
            <span className="text-[11px] font-medium mr-1 text-slate-400">ทรัพยากร:</span>
            {hasCode && (
              <span title="ซอร์สโค้ด GitHub" className="p-1 rounded bg-slate-100 text-slate-700 hover:text-amber-700">
                <FileCode className="w-3.5 h-3.5" />
              </span>
            )}
            {hasDataset && (
              <span title="ชุดข้อมูล Dataset" className="p-1 rounded bg-slate-100 text-emerald-700">
                <Database className="w-3.5 h-3.5" />
              </span>
            )}
            {hasHardware && (
              <span title="วงจร / พิมพ์เขียวฮาร์ดแวร์" className="p-1 rounded bg-slate-100 text-blue-700">
                <Cpu className="w-3.5 h-3.5" />
              </span>
            )}
            {hasModel && (
              <span title="โมเดล AI สำเร็จรูป" className="p-1 rounded bg-slate-100 text-purple-700">
                <Box className="w-3.5 h-3.5" />
              </span>
            )}
            {hasGaps && (
              <span title="มี Gap Analysis สำหรับต่อยอด" className="p-1 rounded bg-amber-50 text-amber-800 border border-amber-200/60">
                <GitBranch className="w-3.5 h-3.5" />
              </span>
            )}
          </div>

          {/* Rating & Arrow Action */}
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1 text-amber-600 font-bold text-xs">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span>{project.rating_score.toFixed(1)}</span>
            </div>
            <div className="w-6 h-6 rounded-md bg-slate-100 group-hover:bg-slate-900 group-hover:text-amber-400 text-slate-400 flex items-center justify-center transition-colors">
              <ArrowUpRight className="w-3.5 h-3.5" />
            </div>
          </div>

        </div>

      </div>
    </article>
  );
};
