'use client';

import React from 'react';
import { 
  GitFork, 
  Eye, 
  Star, 
  Bookmark, 
  FileCode, 
  Database, 
  Cpu, 
  Box, 
  ArrowUpRight,
  Layers,
  Sparkles
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
    <div
      onClick={() => onSelect(project)}
      className={`group relative bg-white rounded-2xl border transition-all duration-200 cursor-pointer overflow-hidden flex flex-col justify-between ${
        isSelected
          ? 'border-amber-500 ring-2 ring-amber-400/50 shadow-cardHover scale-[1.01]'
          : 'border-slate-200/90 hover:border-amber-400/80 hover:shadow-card shadow-soft'
      }`}
    >
      {/* Top Banner / Image & Badges */}
      <div className="relative h-40 w-full overflow-hidden bg-slate-100">
        {project.cover_image_url ? (
          <img
            src={project.cover_image_url}
            alt={project.title_th}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-amber-100 to-amber-200 text-amber-600">
            <Layers className="w-12 h-12 opacity-50" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-black/30" />

        {/* Department & Year Badges */}
        <div className="absolute top-3 left-3 flex items-center space-x-1.5">
          <span className="px-2.5 py-1 bg-slate-900/85 backdrop-blur-md text-amber-400 text-xs font-bold rounded-lg shadow-sm border border-slate-700/50">
            {project.department?.code || 'KUSE'}
          </span>
          <span className="px-2 py-1 bg-white/80 backdrop-blur-md text-slate-800 text-[11px] font-semibold rounded-lg shadow-sm">
            ปี {project.academic_year}
          </span>
        </div>

        {/* Favorite Bookmark Button */}
        <button
          onClick={(e) => onToggleFavorite(project.id, e)}
          className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-all ${
            isFavorite
              ? 'bg-amber-500 text-slate-950 shadow-md scale-110'
              : 'bg-black/30 text-white hover:bg-black/60 hover:text-amber-300'
          }`}
          title={isFavorite ? 'นำออกจากรายการโปรด' : 'บันทึกเป็นรายการโปรด'}
        >
          <Bookmark className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
        </button>

        {/* SDGs Tag Badges on Banner */}
        <div className="absolute bottom-2.5 left-3 flex flex-wrap gap-1">
          {project.sdgs?.map((sdg) => (
            <span
              key={sdg.id}
              style={{ backgroundColor: sdg.color_hex }}
              className="text-white text-[10px] font-black px-2 py-0.5 rounded shadow-xs"
            >
              {sdg.code}
            </span>
          ))}
        </div>

        {/* Lineage Indicator */}
        {hasLineage && (
          <div className="absolute bottom-2.5 right-3 px-2 py-0.5 bg-amber-500/95 text-slate-950 text-[10px] font-bold rounded-full flex items-center space-x-1 shadow-sm backdrop-blur-xs">
            <GitFork className="w-3 h-3" />
            <span>มีสายต่อยอด</span>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Thai Title */}
          <h3 className="font-bold text-slate-900 text-sm md:text-base leading-snug line-clamp-2 group-hover:text-amber-600 transition-colors">
            {project.title_th}
          </h3>

          {/* English Subtitle */}
          <p className="text-xs text-slate-400 line-clamp-1 mt-0.5 font-medium">
            {project.title_en}
          </p>

          {/* Problem Statement snippet */}
          <p className="text-xs text-slate-600 line-clamp-2 mt-2.5 leading-relaxed bg-slate-50 p-2 rounded-xl border border-slate-100">
            {project.dna_card?.problem_statement || project.abstract_th}
          </p>
        </div>

        {/* Tech Stack Pills */}
        <div className="mt-3">
          <div className="flex flex-wrap gap-1 max-h-12 overflow-hidden">
            {project.dna_card?.tech_stack?.slice(0, 4).map((tech, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 text-[11px] font-medium bg-slate-100 text-slate-700 rounded-md border border-slate-200"
              >
                {tech}
              </span>
            ))}
            {(project.dna_card?.tech_stack?.length || 0) > 4 && (
              <span className="px-1.5 py-0.5 text-[10px] text-slate-400 bg-slate-50 rounded">
                +{(project.dna_card?.tech_stack?.length || 0) - 4}
              </span>
            )}
          </div>
        </div>

        {/* Reusable Asset DNA Badges */}
        <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center space-x-1.5 text-slate-400 text-xs">
            <span className="text-[10px] font-semibold text-slate-400 mr-0.5">ทรัพยากร:</span>
            {hasCode && (
              <span title="มีซอร์สโค้ด GitHub" className="p-1 rounded bg-slate-100 text-slate-700 hover:bg-amber-100 hover:text-amber-700">
                <FileCode className="w-3.5 h-3.5" />
              </span>
            )}
            {hasDataset && (
              <span title="มีชุดข้อมูล Dataset" className="p-1 rounded bg-slate-100 text-emerald-700 hover:bg-emerald-100">
                <Database className="w-3.5 h-3.5" />
              </span>
            )}
            {hasHardware && (
              <span title="มีแบบวงจร / CAD ฮาร์ดแวร์" className="p-1 rounded bg-slate-100 text-blue-700 hover:bg-blue-100">
                <Cpu className="w-3.5 h-3.5" />
              </span>
            )}
            {hasModel && (
              <span title="มีโมเดล AI สำเร็จรูป" className="p-1 rounded bg-slate-100 text-purple-700 hover:bg-purple-100">
                <Box className="w-3.5 h-3.5" />
              </span>
            )}
            {hasGaps && (
              <span title="มี AI Gap Analysis สำหรับต่อยอด" className="p-1 rounded bg-amber-50 text-amber-700 border border-amber-200">
                <Sparkles className="w-3.5 h-3.5" />
              </span>
            )}
          </div>

          {/* Rating & Action Icon */}
          <div className="flex items-center space-x-2 text-xs">
            <div className="flex items-center space-x-1 text-amber-500 font-bold">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span>{project.rating_score.toFixed(1)}</span>
            </div>
            <div className="w-6 h-6 rounded-full bg-slate-100 group-hover:bg-amber-500 group-hover:text-slate-950 text-slate-400 flex items-center justify-center transition-colors">
              <ArrowUpRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
