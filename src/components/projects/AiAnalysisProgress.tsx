import { Sparkles } from 'lucide-react';

interface AiAnalysisProgressProps {
  /** 0–100, updated in near-real-time while the request is in flight */
  progress: number;
  query: string;
}

function stageLabel(progress: number): string {
  if (progress < 15) return 'กำลังส่งโจทย์ให้ AI วิเคราะห์...';
  if (progress < 50) return 'AI กำลังวิเคราะห์เจตนาของโจทย์...';
  if (progress < 85) return 'AI กำลังจับคู่พิมพ์เขียวโครงงาน...';
  return 'กำลังจัดอันดับความเหมาะสม...';
}

/**
 * Live progress card shown while the AI match computation is running:
 * an eased percentage counter, a gradient progress bar and rotating
 * stage labels so the wait feels active rather than frozen.
 */
export function AiAnalysisProgress({ progress, query }: AiAnalysisProgressProps) {
  const clamped = Math.min(100, Math.max(0, Math.round(progress)));

  return (
    <div
      className="mb-6 p-5 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 text-white rounded-2xl border border-amber-500/40 shadow-soft space-y-3"
      role="status"
      aria-live="polite"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center space-x-2 text-amber-400 text-xs font-bold font-mono">
          <Sparkles className="w-4 h-4 fill-current animate-pulse" />
          <span>AI MATCH ANALYSIS</span>
        </div>
        <span className="font-mono text-2xl font-bold text-amber-400 tabular-nums leading-none">
          {clamped}
          <span className="text-sm text-slate-400 ml-0.5">%</span>
        </span>
      </div>

      {/* Progress rail */}
      <div
        className="h-2.5 w-full bg-slate-800 rounded-full overflow-hidden"
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="h-full bg-gradient-to-r from-amber-600 via-amber-400 to-amber-300 rounded-full transition-all duration-150 ease-out"
          style={{ width: `${clamped}%` }}
        />
      </div>

      <p className="text-xs text-slate-300 truncate">
        <span className="font-medium text-white">{stageLabel(clamped)}</span>
        {query && <span className="text-slate-500"> — “{query}”</span>}
      </p>
    </div>
  );
}
