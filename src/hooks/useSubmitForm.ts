'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { dnaService } from '@/lib/dnaService';
import { useAuthGate } from '@/hooks/useAuthGate';
import { addMyProjectId } from '@/hooks/useMyProjects';
import {
  uploadProjectFile,
  removeProjectFile,
  detectAssetTypeFromFileName,
  formatFileSize,
  MAX_FILES_PER_SUBMISSION,
  type UploadedFileInfo
} from '@/lib/storageService';
import type { Project, ReusableAsset, ExtensionGap } from '@/types/dna';

/** Live status of one file in the Step-3 uploader. */
export type UploadedFileStatus = 'uploading' | 'done' | 'error';

export interface UploadedFileEntry {
  id: string;
  fileName: string;
  fileSizeLabel: string;
  status: UploadedFileStatus;
  errorMessage?: string;
  /** Set once the file lives in Supabase Storage ('done'). */
  storagePath?: string;
  publicUrl?: string;
}

/**
 * All form state, AI-extraction and publish logic for the project submission
 * wizard — extracted from the page component so the page stays purely
 * presentational.
 */
export function useSubmitForm() {
  const router = useRouter();
  const { isAuthenticated, requireLogin } = useAuthGate();

  // /submit is a gated action — anonymous visitors are bounced to /login and
  // returned here after signing in. This mirrors the database's
  // authenticated-only insert policy so guest spam can never reach the
  // public library again (the old open policy produced "asdas"-style junk).
  useEffect(() => {
    if (isAuthenticated === false) {
      requireLogin('/submit');
    }
  }, [isAuthenticated, requireLogin]);

  // Reference data from Service
  const faculties = dnaService.getInitialFaculties();
  const departments = dnaService.getInitialDepartments();

  // Form Step
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);

  // Form State: Step 1 Basic Info
  const [titleTh, setTitleTh] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [selectedFacultyId, setSelectedFacultyId] = useState<string>(faculties[0]?.id || 'fac-kuse');
  const [selectedDeptId, setSelectedDeptId] = useState<string>('');
  const [academicYear, setAcademicYear] = useState<number>(2568);
  const [advisorName, setAdvisorName] = useState('');
  const [studentAuthors, setStudentAuthors] = useState<{ name: string; student_id: string; email: string }[]>([
    { name: '', student_id: '', email: '' }
  ]);

  // Form State: Step 2 Abstract & AI Extraction
  const [abstractTh, setAbstractTh] = useState('');
  const [problemStatement, setProblemStatement] = useState('');
  const [proposedSolution, setProposedSolution] = useState('');
  const [techStackInput, setTechStackInput] = useState('Python, React, TypeScript, IoT');
  const [keyResults, setKeyResults] = useState('');
  const [isAiExtracting, setIsAiExtracting] = useState(false);
  const [aiExtractedSuccess, setAiExtractedSuccess] = useState(false);

  // Form State: Step 3 Reusable Assets (links)
  const [githubUrl, setGithubUrl] = useState('');
  const [datasetUrl, setDatasetUrl] = useState('');
  const [modelUrl, setModelUrl] = useState('');
  const [paperUrl, setPaperUrl] = useState('');

  // Form State: Step 3 Reusable Assets (uploaded files)
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFileEntry[]>([]);
  const [isUploadingFiles, setIsUploadingFiles] = useState(false);

  // Form State: Step 4 Extension Gaps
  const [limitations, setLimitations] = useState('');
  const [suggestedIdeas, setSuggestedIdeas] = useState('');

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Available departments for chosen faculty
  const availableDepts = departments.filter(d => d.faculty_id === selectedFacultyId);

  // Set default dept on faculty change
  const handleFacultyChange = (facId: string) => {
    setSelectedFacultyId(facId);
    const depts = departments.filter(d => d.faculty_id === facId);
    if (depts.length > 0) {
      setSelectedDeptId(depts[0].id);
    }
  };

  // Add/Remove Student Author
  const handleAddAuthor = () => {
    setStudentAuthors([...studentAuthors, { name: '', student_id: '', email: '' }]);
  };

  const handleRemoveAuthor = (index: number) => {
    if (studentAuthors.length > 1) {
      setStudentAuthors(studentAuthors.filter((_, i) => i !== index));
    }
  };

  const handleAuthorChange = (index: number, field: 'name' | 'student_id' | 'email', value: string) => {
    const updated = [...studentAuthors];
    updated[index][field] = value;
    setStudentAuthors(updated);
  };

  /**
   * Upload the files picked in Step 3 to Supabase Storage. Every file gets
   * a live list entry immediately so the page can render per-file spinners
   * / errors while uploads stream in. Slot-limited, sequential for clarity.
   */
  const handleFilesSelected = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;

    const remainingSlots = MAX_FILES_PER_SUBMISSION - uploadedFiles.length;
    if (remainingSlots <= 0) {
      setErrorMessage(`อัปโหลดได้สูงสุด ${MAX_FILES_PER_SUBMISSION} ไฟล์ต่อโปรเจกต์`);
      return;
    }

    const allFiles = Array.from(fileList);
    const accepted = allFiles.slice(0, remainingSlots);
    if (allFiles.length > remainingSlots) {
      setErrorMessage(`เลือกได้อีกเพียง ${remainingSlots} ไฟล์ (จำกัด ${MAX_FILES_PER_SUBMISSION} ไฟล์ต่อโปรเจกต์)`);
    }

    setIsUploadingFiles(true);
    setErrorMessage('');

    for (const file of accepted) {
      const entryId = `file-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      setUploadedFiles(prev => [
        ...prev,
        {
          id: entryId,
          fileName: file.name,
          fileSizeLabel: formatFileSize(file.size),
          status: 'uploading'
        }
      ]);

      try {
        const info: UploadedFileInfo = await uploadProjectFile(file);
        setUploadedFiles(prev =>
          prev.map(f =>
            f.id === entryId
              ? {
                  ...f,
                  status: 'done',
                  storagePath: info.storagePath,
                  publicUrl: info.publicUrl,
                  fileSizeLabel: info.fileSizeLabel
                }
              : f
          )
        );
      } catch (err) {
        setUploadedFiles(prev =>
          prev.map(f =>
            f.id === entryId
              ? { ...f, status: 'error', errorMessage: err instanceof Error ? err.message : 'อัปโหลดไม่สำเร็จ' }
              : f
          )
        );
      }
    }

    setIsUploadingFiles(false);
  };

  /** Remove one entry; completed files are also deleted from Storage. */
  const handleRemoveUploadedFile = (id: string) => {
    const target = uploadedFiles.find(f => f.id === id);
    if (!target || target.status === 'uploading') return; // let in-flight finish
    if (target.storagePath) void removeProjectFile(target.storagePath);
    setUploadedFiles(prev => prev.filter(f => f.id !== id));
  };

  // Gemini Live AI DNA Extraction
  const handleAiExtract = async () => {
    if (!abstractTh.trim() && !titleTh.trim()) {
      setErrorMessage('กรุณากรอกชื่อโครงงานหรือบทคัดย่อก่อนใช้ AI สกัด DNA');
      return;
    }

    setIsAiExtracting(true);
    setErrorMessage('');

    try {
      const promptText = `ชื่อโครงงาน: ${titleTh}\nบทคัดย่อ: ${abstractTh}`;
      const res = await fetch('/api/ai/dna-extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: promptText })
      });

      const data = await res.json();

      if (data.success && data.data) {
        const d = data.data;
        if (d.title_th && !titleTh) setTitleTh(d.title_th);
        if (d.title_en && !titleEn) setTitleEn(d.title_en);
        if (d.dna_card?.problem_statement) setProblemStatement(d.dna_card.problem_statement);
        if (d.dna_card?.solution_approach) setProposedSolution(d.dna_card.solution_approach);
        if (d.dna_card?.tech_stack) setTechStackInput(d.dna_card.tech_stack.join(', '));
        if (d.dna_card?.key_results) setKeyResults(d.dna_card.key_results);
        setAiExtractedSuccess(true);
      } else {
        // Smart Local Parser Fallback
        setProblemStatement(abstractTh.slice(0, 150));
        setProposedSolution('นำเสนอแนวทางแก้ไขและพัฒนาระบบตามขอบเขตงานวิจัย');
        setAiExtractedSuccess(true);
      }
    } catch (err) {
      console.warn('AI Extraction failed, falling back:', err);
      setProblemStatement(abstractTh.slice(0, 150));
      setProposedSolution('นำเสนอแนวทางแก้ไขและพัฒนาระบบตามขอบเขตงานวิจัย');
      setAiExtractedSuccess(true);
    } finally {
      setIsAiExtracting(false);
    }
  };

  // Final Publish Handler
  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();

    // Hard stop for signed-out visitors (defense in depth for the redirect
    // effect above) — the database also rejects anon inserts.
    if (!requireLogin('/submit')) return;

    if (!titleTh.trim()) {
      setErrorMessage('กรุณากรอกชื่อโครงงานภาษาไทย');
      setCurrentStep(1);
      return;
    }

    if (isUploadingFiles) {
      setErrorMessage('กรุณารอให้อัปโหลดไฟล์ทั้งหมดเสร็จก่อนเผยแพร่');
      setCurrentStep(3);
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const techArray = techStackInput.split(',').map(t => t.trim()).filter(Boolean);
      const chosenDeptId = selectedDeptId || availableDepts[0]?.id || departments[0]?.id;

      // Construct Reusable Assets
      const assets: ReusableAsset[] = [];
      if (githubUrl) {
        assets.push({
          id: 'asset-git-' + Date.now(),
          project_id: '',
          title: 'Source Code & Implementation',
          asset_type: 'code_repo',
          resource_url: githubUrl,
          download_count: 0,
          description: 'คลังซอร์สโค้ดและพิมพ์เขียวการพัฒนา'
        });
      }
      if (datasetUrl) {
        assets.push({
          id: 'asset-data-' + Date.now(),
          project_id: '',
          title: 'Benchmark Dataset',
          asset_type: 'dataset',
          resource_url: datasetUrl,
          download_count: 0,
          description: 'ชุดข้อมูลตัวอย่างสำหรับเทรนและทดสอบโมเดล'
        });
      }
      if (modelUrl) {
        assets.push({
          id: 'asset-model-' + Date.now(),
          project_id: '',
          title: 'Pre-trained AI Model / Weights',
          asset_type: 'trained_model',
          resource_url: modelUrl,
          download_count: 0,
          description: 'ไฟล์โมเดล AI ที่ฝึกฝนแล้วพร้อมใช้งาน'
        });
      }
      if (paperUrl) {
        assets.push({
          id: 'asset-doc-' + Date.now(),
          project_id: '',
          title: 'Full Research Report & Blueprint (PDF)',
          asset_type: 'document',
          resource_url: paperUrl,
          download_count: 0,
          description: 'รายงานวิจัยฉบับสมบูรณ์และคู่มือการต่อยอด'
        });
      }

      // Uploaded files become first-class ReusableAssets pointing into
      // Storage — only entries that finished successfully are included.
      uploadedFiles.forEach((file, index) => {
        if (file.status !== 'done' || !file.publicUrl) return;
        assets.push({
          id: 'asset-upload-' + Date.now() + '-' + index,
          project_id: '',
          asset_type: detectAssetTypeFromFileName(file.fileName),
          title: file.fileName,
          resource_url: file.publicUrl,
          download_count: 0,
          description: 'ไฟล์แนบที่อัปโหลดผ่านคลังทรัพยากรของระบบ',
          file_size: file.fileSizeLabel
        });
      });

      // Construct Extension Gaps
      const gaps: ExtensionGap[] = [];
      if (limitations || suggestedIdeas) {
        gaps.push({
          id: 'gap-' + Date.now(),
          project_id: '',
          gap_title: 'โอกาสและช่องทางต่อยอดสำหรับนิสิตรุ่นน้อง',
          gap_description: suggestedIdeas || limitations || 'สามารถนำโมเดลและโค้ดไปปรับใช้กับอุปกรณ์อื่นๆ',
          difficulty_level: 'Medium',
          recommended_tech: techArray.length > 0 ? techArray : ['Python'],
          potential_impact: 'ช่วยยกระดับและขยายผลงานวิจัยสู่การใช้งานจริง'
        });
      }

      // Create new Project DNA — new submissions wait for advisor approval
      const newProject: Partial<Project> = {
        title_th: titleTh,
        title_en: titleEn || titleTh,
        abstract_th: abstractTh || problemStatement,
        abstract_en: titleEn,
        academic_year: academicYear,
        status: 'pending_approval',
        department_id: chosenDeptId,
        cover_image_url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=60',
        dna_card: {
          id: 'dna-' + Date.now(),
          project_id: '',
          problem_statement: problemStatement || 'มุ่งแก้ปัญหาในชุมชนและอุตสาหกรรม',
          target_users: ['นิสิต มก.ฉกส.', 'เกษตรกรและชุมชน'],
          tech_stack: techArray.length > 0 ? techArray : ['Python', 'AI'],
          key_outcomes: [keyResults || 'ระบบทำงานได้ตามเป้าหมาย'],
          limitations: [limitations || 'ข้อจำกัดตามขอบเขตงานวิจัย'],
          advisor_name: advisorName || 'อาจารย์ที่ปรึกษาโครงงาน มก.ฉกส.',
          student_authors: studentAuthors.filter(a => a.name.trim()).map(a => ({
            name: a.name,
            student_id: a.student_id,
            email: a.email,
            role: 'นิสิตผู้พัฒนา'
          }))
        },
        assets,
        gaps
      };

      const created = await dnaService.createProject(newProject);
      if (created) addMyProjectId(created.id);

      const syncWarning = dnaService.getLastSyncWarning();
      if (syncWarning) {
        // Saved in-browser only, but the database write failed — tell the
        // user instead of silently claiming success.
        setErrorMessage(
          `โครงงานแสดงผลได้ชั่วคราว แต่ซิงก์ขึ้นฐานข้อมูลไม่สำเร็จ (${syncWarning})`
        );
        setTimeout(() => router.push('/'), 4000);
        return;
      }

      setSubmitSuccess(true);

      setTimeout(() => {
        router.push('/');
      }, 1500);

    } catch (err) {
      console.error('Publish error:', err);
      setErrorMessage(err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการบันทึกข้อมูล');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    // reference data
    faculties,
    departments,
    availableDepts,
    // step navigation
    currentStep, setCurrentStep,
    // step 1 — basic info
    titleTh, setTitleTh, titleEn, setTitleEn,
    selectedFacultyId, selectedDeptId, setSelectedDeptId, handleFacultyChange,
    academicYear, setAcademicYear, advisorName, setAdvisorName,
    studentAuthors, handleAddAuthor, handleRemoveAuthor, handleAuthorChange,
    // step 2 — abstract & AI extraction
    abstractTh, setAbstractTh, problemStatement, setProblemStatement,
    proposedSolution, setProposedSolution, techStackInput, setTechStackInput,
    keyResults, setKeyResults, isAiExtracting, aiExtractedSuccess, handleAiExtract,
    // step 3 — reusable assets
    githubUrl, setGithubUrl, datasetUrl, setDatasetUrl,
    modelUrl, setModelUrl, paperUrl, setPaperUrl,
    uploadedFiles, isUploadingFiles, handleFilesSelected, handleRemoveUploadedFile,
    // step 4 — extension gaps
    limitations, setLimitations, suggestedIdeas, setSuggestedIdeas,
    // submission
    isSubmitting, submitSuccess, errorMessage, setErrorMessage, handlePublish
  };
}