import { supabase, isSupabaseConfigured } from './supabaseClient';
import type { ReusableAsset } from '@/types/dna';

/**
 * Client helpers for the Reusable Assets file uploader on /submit.
 *
 * Files land in the public `project-files` Storage bucket under
 * `<auth.uid>/submissions/…` — the first path segment MUST be the signed-in
 * user's id because the bucket's RLS policies enforce it (same convention as
 * the `project-covers` bucket). The 25 MiB cap mirrors the bucket's
 * `file_size_limit` set in migrations — keep both in sync.
 */

export const PROJECT_FILES_BUCKET = 'project-files';
export const MAX_FILE_SIZE_BYTES = 25 * 1024 * 1024;
/** Hard cap per submission so the assets table never explodes. */
export const MAX_FILES_PER_SUBMISSION = 10;

export const ACCEPTED_FILE_EXTENSIONS =
  '.pdf,.zip,.rar,.7z,.csv,.txt,.md,.json,.xml,.doc,.docx,' +
  '.xls,.xlsx,.ppt,.pptx,.py,.js,.ts,.jsx,.tsx,.c,.cpp,.h,.java,' +
  '.ipynb,.pt,.pth,.onnx,.h5,.stl,.step,.dwg,.png,.jpg,.jpeg,.webp';

export interface UploadedFileInfo {
  /** Path inside the bucket, e.g. "<uid>/submissions/1690-report.pdf". */
  storagePath: string;
  /** Fully qualified public URL suitable for reusable_assets.resource_url. */
  publicUrl: string;
  fileName: string;
  fileSizeLabel: string;
}

/** Human-readable size like "1.4 MB" for asset metadata and the file list. */
export function formatFileSize(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return '0 KB';
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(kb < 10 ? 1 : 0)} KB`;
  const mb = kb / 1024;
  return `${mb.toFixed(mb < 10 ? 2 : 1)} MB`;
}

/** Pre-flight checks with Thai messages surfaced directly in the form. */
export function validateFile(file: File): string | null {
  if (file.size === 0) return `ไฟล์ "${file.name}" ว่างเปล่า ไม่สามารถอัปโหลดได้`;
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return `ไฟล์ "${file.name}" มีขนาดเกิน ${formatFileSize(MAX_FILE_SIZE_BYTES)} (ปัจจุบัน ${formatFileSize(file.size)})`;
  }
  return null;
}

/**
 * Guess the reusable_asset type from the extension so uploaded files show
 * the right icon/category in the resource drawer and quick-resources modal.
 */
export function detectAssetTypeFromFileName(fileName: string): ReusableAsset['asset_type'] {
  const ext = fileName.split('.').pop()?.toLowerCase() ?? '';
  if (['zip', 'rar', '7z', 'tar', 'gz'].includes(ext)) return 'code_repo';
  if (['py', 'js', 'ts', 'jsx', 'tsx', 'c', 'cpp', 'h', 'java', 'ipynb'].includes(ext)) return 'code_repo';
  if (['csv', 'xlsx', 'xls', 'json', 'xml'].includes(ext)) return 'dataset';
  if (['pt', 'pth', 'onnx', 'h5'].includes(ext)) return 'trained_model';
  if (['stl', 'step', 'dwg'].includes(ext)) return 'cad_blueprint';
  if (['pdf', 'doc', 'docx', 'ppt', 'pptx', 'txt', 'md'].includes(ext)) return 'document';
  return 'document';
}

/** Storage forbids control chars and special glyphs in object keys. */
function sanitizeFileName(name: string): string {
  const cleaned = name
    .normalize('NFC')
    .replace(/[^\w.\-\u0E00-\u0E7F ]+/g, '_') // keep latin, digits, dots, Thai block
    .replace(/\s+/g, '-')
    .replace(/_{2,}/g, '_');
  return cleaned || 'file';
}

async function requireSignedInUser(): Promise<string> {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error('ระบบยังไม่เชื่อมต่อฐานข้อมูล — โหมดตัวอย่างไม่รองรับการอัปโหลดไฟล์');
  }
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) {
    throw new Error('กรุณาเข้าสู่ระบบก่อนอัปโหลดไฟล์ (ต้องรู้จักตัวตนเพื่อกำหนดสิทธิ์โฟลเดอร์)');
  }
  return data.user.id;
}

/** Map raw storage errors to short Thai guidance for the form banner. */
function toFriendlyUploadError(err: unknown): Error {
  const raw = err instanceof Error ? err.message : String(err);
  if (/exceed|size|payload/i.test(raw)) {
    return new Error(`ไฟล์ใหญ่เกินโควตา ${formatFileSize(MAX_FILE_SIZE_BYTES)}`);
  }
  if (/mime|type|allowed/i.test(raw)) {
    return new Error('ระบบยังไม่รองรับชนิดไฟล์นี้ ลองบีบอัดเป็น ZIP อีกครั้ง');
  }
  if (/row-level|policy|unauthorized|forbidden|JWT|403/i.test(raw)) {
    return new Error('ไม่มีสิทธิ์อัปโหลด — กรุณาเข้าสู่ระบบใหม่อีกครั้ง');
  }
  return new Error(raw || 'อัปโหลดไฟล์ไม่สำเร็จ กรุณาลองอีกครั้ง');
}

/**
 * Upload one file into `project-files/<uid>/submissions/<ts>-<name>` and
 * return its permanent public URL. Throws Error with a Thai message ready
 * to render.
 */
export async function uploadProjectFile(file: File): Promise<UploadedFileInfo> {
  const preflightProblem = validateFile(file);
  if (preflightProblem) throw new Error(preflightProblem);

  try {
    const userId = await requireSignedInUser();
    const path = `${userId}/submissions/${Date.now()}-${sanitizeFileName(file.name)}`;

    const { error } = await supabase!
      .storage
      .from(PROJECT_FILES_BUCKET)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: false,
        contentType: file.type || undefined
      });
    if (error) throw toFriendlyUploadError(error);

    const { data: urlData } = supabase!
      .storage
      .from(PROJECT_FILES_BUCKET)
      .getPublicUrl(path);

    return {
      storagePath: path,
      publicUrl: urlData.publicUrl,
      fileName: file.name,
      fileSizeLabel: formatFileSize(file.size)
    };
  } catch (err) {
    // Wrap everything (Storage API errors included) so callers always get a
    // short Thai message ready for the form banner.
    throw toFriendlyUploadError(err);
  }
}

/**
 * Best-effort cleanup when the user removes a completed upload from the
 * form. Failures are logged, never thrown — a stray orphan file beats a
 * broken removal flow.
 */
export async function removeProjectFile(storagePath: string): Promise<void> {
  if (!isSupabaseConfigured || !supabase) return;
  try {
    await supabase.storage.from(PROJECT_FILES_BUCKET).remove([storagePath]);
  } catch (e) {
    console.warn('Failed to remove orphaned project file:', e);
  }
}