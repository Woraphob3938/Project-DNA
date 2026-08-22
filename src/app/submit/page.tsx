'use client';

import React from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  GraduationCap,
  Building,
  Upload,
  FileCode,
  Database,
  Cpu,
  Layers,
  Plus,
  Trash2,
  ArrowRight,
  GitFork,
  ExternalLink,
  HelpCircle,
  FolderArchive,
  BookOpen,
  Share2
} from 'lucide-react';
import { GithubIcon } from '@/components/icons/GithubIcon';
import { Logo } from '@/components/layout/Logo';
import { useSubmitForm } from '@/hooks/useSubmitForm';

export default function SubmitProjectPage() {
  const {
    faculties,
    departments,
    availableDepts,
    currentStep, setCurrentStep,
    titleTh, setTitleTh, titleEn, setTitleEn,
    selectedFacultyId, selectedDeptId, setSelectedDeptId, handleFacultyChange,
    academicYear, setAcademicYear,
    advisorName, setAdvisorName,
    studentAuthors, handleAddAuthor, handleRemoveAuthor, handleAuthorChange,
    abstractTh, setAbstractTh, problemStatement, setProblemStatement,
    proposedSolution, setProposedSolution,
    techStackInput, setTechStackInput, keyResults, setKeyResults,
    isAiExtracting, aiExtractedSuccess, handleAiExtract,
    githubUrl, setGithubUrl, datasetUrl, setDatasetUrl,
    modelUrl, setModelUrl, paperUrl, setPaperUrl,
    limitations, setLimitations, suggestedIdeas, setSuggestedIdeas,
    isSubmitting, submitSuccess, errorMessage, setErrorMessage,
    handlePublish
  } = useSubmitForm();

  return (
    <div className="min-h-screen bg-[#F4F5F7] text-slate-900 flex flex-col justify-between font-sans">
      
      {/* Top Header */}
      <header className="px-6 py-4 border-b border-slate-200/80 bg-white flex items-center justify-between sticky top-0 z-30">
        <Link 
          href="/"
          className="flex items-center space-x-2 text-xs font-bold text-slate-700 hover:text-amber-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>กลับสู่หน้าหลักคลังโครงงาน</span>
        </Link>

        <div className="flex items-center space-x-2">
          <Logo className="w-8 h-8" />
          <span className="font-display font-bold text-sm text-slate-900">Project DNA</span>
          <span className="text-[11px] font-mono text-slate-400">· KU CSC Registry</span>
        </div>
      </header>

      {/* Main Form Container */}
      <main className="max-w-4xl w-full mx-auto p-4 md:p-8 space-y-6 flex-1">
        
        {/* Banner Card */}
        <div className="bg-slate-900 text-white p-6 md:p-8 rounded-3xl border border-slate-800 shadow-card space-y-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-slate-800 text-amber-400 border border-slate-700 rounded-lg text-xs font-mono font-semibold">
            <BookOpen className="w-3.5 h-3.5" />
            <span>KU CSC STUDENT PROJECT REGISTRY</span>
          </div>
          <h1 className="font-display text-2xl md:text-3xl font-bold tracking-tight text-white">
            เพิ่มโปรเจกต์และองค์ความรู้ (สำหรับนิสิต)
          </h1>
          <p className="text-xs md:text-sm text-slate-300 leading-relaxed font-sans">
            ส่งต่อพิมพ์เขียว ซอร์สโค้ด ชุดข้อมูล และบทเรียนจากโครงงานของคุณ เพื่อให้นิสิตรุ่นน้องนำไปต่อยอด สร้างสายวิวัฒนาการนวัตกรรมที่ไม่สิ้นสุด
          </p>
        </div>

        {/* Step Progression Bar */}
        <div className="grid grid-cols-4 gap-2 text-xs font-bold">
          <button
            type="button"
            onClick={() => setCurrentStep(1)}
            className={`p-3 rounded-xl border text-center transition-colors flex items-center justify-center space-x-1.5 ${
              currentStep === 1
                ? 'bg-slate-900 text-amber-400 border-slate-900'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-[10px]">1</span>
            <span className="hidden sm:inline">ข้อมูลทั่วไป</span>
          </button>

          <button
            type="button"
            onClick={() => setCurrentStep(2)}
            className={`p-3 rounded-xl border text-center transition-colors flex items-center justify-center space-x-1.5 ${
              currentStep === 2
                ? 'bg-slate-900 text-amber-400 border-slate-900'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-[10px]">2</span>
            <span className="hidden sm:inline">สกัด DNA & AI</span>
          </button>

          <button
            type="button"
            onClick={() => setCurrentStep(3)}
            className={`p-3 rounded-xl border text-center transition-colors flex items-center justify-center space-x-1.5 ${
              currentStep === 3
                ? 'bg-slate-900 text-amber-400 border-slate-900'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-[10px]">3</span>
            <span className="hidden sm:inline">คลังทรัพยากร</span>
          </button>

          <button
            type="button"
            onClick={() => setCurrentStep(4)}
            className={`p-3 rounded-xl border text-center transition-colors flex items-center justify-center space-x-1.5 ${
              currentStep === 4
                ? 'bg-slate-900 text-amber-400 border-slate-900'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-[10px]">4</span>
            <span className="hidden sm:inline">ช่องว่างต่อยอด</span>
          </button>
        </div>

        {/* Feedback Message */}
        {errorMessage && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center space-x-2.5 text-xs text-red-700 font-medium">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        {submitSuccess && (
          <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-3xl text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h3 className="font-display text-lg font-bold text-emerald-900">
              เพิ่มโปรเจกต์สำเร็จเรียบร้อย!
            </h3>
            <p className="text-xs text-emerald-700">
              โครงงานของคุณถูกบรรจุเข้าสู่คลังองค์ความรู้ มก.ฉกส. และพร้อมให้นิสิตรุ่นน้องนำไปศึกษาและต่อยอดแล้ว
            </p>
          </div>
        )}

        {/* Main Form Content */}
        {!submitSuccess && (
          <form onSubmit={handlePublish} className="bg-white rounded-3xl border border-slate-200/90 shadow-soft p-6 md:p-8 space-y-6">
            
            {/* STEP 1: General Project Info */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-display text-lg font-bold text-slate-900">
                    ขั้นตอนที่ 1: ข้อมูลทั่วไปของโครงงาน
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    ระบุชื่อโครงงาน สังกัดคณะ สาขาวิชา และรายชื่อนิสิตผู้จัดทำ
                  </p>
                </div>

                {/* Title TH */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-800">
                    ชื่อโครงงาน (ภาษาไทย) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={titleTh}
                    onChange={(e) => setTitleTh(e.target.value)}
                    placeholder="เช่น ระบบตรวจสอบคุณภาพผ้าย้อมครามด้วย Computer Vision และ IoT"
                    className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-500 focus:bg-white text-slate-900 placeholder-slate-400"
                    required
                  />
                </div>

                {/* Title EN */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-800">
                    ชื่อโครงงาน (ภาษาอังกฤษ)
                  </label>
                  <input
                    type="text"
                    value={titleEn}
                    onChange={(e) => setTitleEn(e.target.value)}
                    placeholder="e.g. Computer Vision-based Indigo Dye Quality Inspection with IoT"
                    className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-500 focus:bg-white text-slate-900 placeholder-slate-400"
                  />
                </div>

                {/* Faculty, Department, Academic Year */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  
                  {/* Faculty */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-800 flex items-center space-x-1">
                      <GraduationCap className="w-3.5 h-3.5 text-amber-600" />
                      <span>คณะ</span>
                    </label>
                    <select
                      value={selectedFacultyId}
                      onChange={(e) => handleFacultyChange(e.target.value)}
                      className="w-full px-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-500 text-slate-900 font-semibold"
                    >
                      {faculties.map((f) => (
                        <option key={f.id} value={f.id}>{f.short_name} - {f.name_th}</option>
                      ))}
                    </select>
                  </div>

                  {/* Department */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-800 flex items-center space-x-1">
                      <Building className="w-3.5 h-3.5 text-amber-600" />
                      <span>สาขาวิชา</span>
                    </label>
                    <select
                      value={selectedDeptId}
                      onChange={(e) => setSelectedDeptId(e.target.value)}
                      className="w-full px-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-500 text-slate-900 font-semibold"
                    >
                      {availableDepts.map((d) => (
                        <option key={d.id} value={d.id}>{d.code} - {d.name_th}</option>
                      ))}
                    </select>
                  </div>

                  {/* Academic Year */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-800">
                      ปีการศึกษา (พ.ศ.)
                    </label>
                    <select
                      value={academicYear}
                      onChange={(e) => setAcademicYear(Number(e.target.value))}
                      className="w-full px-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-500 text-slate-900 font-semibold"
                    >
                      <option value={2568}>2568 (ปัจจุบัน)</option>
                      <option value={2567}>2567</option>
                      <option value={2566}>2566</option>
                      <option value={2565}>2565</option>
                    </select>
                  </div>

                </div>

                {/* Advisor Name */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-800">
                    อาจารย์ที่ปรึกษาโครงงาน
                  </label>
                  <input
                    type="text"
                    value={advisorName}
                    onChange={(e) => setAdvisorName(e.target.value)}
                    placeholder="เช่น ผศ.ดร.สมชาย ใจดี"
                    className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-500 text-slate-900 placeholder-slate-400"
                  />
                </div>

                {/* Student Authors */}
                <div className="space-y-3 pt-2 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-slate-800">
                      รายชื่อนิสิตผู้จัดทำ ({studentAuthors.length} คน)
                    </label>
                    <button
                      type="button"
                      onClick={handleAddAuthor}
                      className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center space-x-1"
                    >
                      <Plus className="w-3.5 h-3.5 stroke-[3]" />
                      <span>เพิ่มสมาชิก</span>
                    </button>
                  </div>

                  {studentAuthors.map((author, index) => (
                    <div key={index} className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 items-center bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                      <input
                        type="text"
                        value={author.name}
                        onChange={(e) => handleAuthorChange(index, 'name', e.target.value)}
                        placeholder="ชื่อ-นามสกุล นิสิต"
                        className="px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-900"
                        required
                      />
                      <input
                        type="text"
                        value={author.student_id}
                        onChange={(e) => handleAuthorChange(index, 'student_id', e.target.value)}
                        placeholder="รหัสนิสิต (เช่น b65216...)"
                        className="px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 font-mono"
                      />
                      <div className="flex items-center space-x-2">
                        <input
                          type="email"
                          value={author.email}
                          onChange={(e) => handleAuthorChange(index, 'email', e.target.value)}
                          placeholder="อีเมล @ku.th"
                          className="flex-1 px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-900"
                        />
                        {studentAuthors.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveAuthor(index)}
                            className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Step 1 Next Action */}
                <div className="pt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-amber-400 font-bold text-xs rounded-xl flex items-center space-x-2 transition-colors"
                  >
                    <span>ถัดไป: สกัด DNA & AI</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: Abstract & AI Extraction */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-display text-lg font-bold text-slate-900">
                    ขั้นตอนที่ 2: บทคัดย่อและ DNA Card (สกัดด้วย AI)
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    วางบทคัดย่อโครงงาน แล้วกดให้ Google Gemini AI ช่วยสรุปปัญหา เทคโนโลยี และผลลัพธ์
                  </p>
                </div>

                {/* Abstract Textarea */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-slate-800">
                      บทคัดย่อโครงงาน (Abstract)
                    </label>
                    <button
                      type="button"
                      onClick={handleAiExtract}
                      disabled={isAiExtracting}
                      className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-lg shadow-xs flex items-center space-x-1.5 transition-colors disabled:opacity-50"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{isAiExtracting ? 'กำลังให้ AI สกัด DNA...' : '⚡ สกัด DNA Card ด้วย Gemini AI'}</span>
                    </button>
                  </div>
                  <textarea
                    rows={5}
                    value={abstractTh}
                    onChange={(e) => setAbstractTh(e.target.value)}
                    placeholder="วางเนื้อหาบทคัดย่อโครงงานภาษาไทยหรือภาษาอังกฤษที่นี่..."
                    className="w-full p-4 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-500 focus:bg-white text-slate-900 placeholder-slate-400 leading-relaxed font-sans"
                  />
                </div>

                {aiExtractedSuccess && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center space-x-2 text-xs text-emerald-800 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Gemini AI สกัด DNA Card เรียบร้อย! คุณสามารถปรับแต่งรายละเอียดด้านล่างได้</span>
                  </div>
                )}

                {/* Problem Statement */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-800">
                    โจทย์ปัญหาหลัก (Problem Statement)
                  </label>
                  <input
                    type="text"
                    value={problemStatement}
                    onChange={(e) => setProblemStatement(e.target.value)}
                    placeholder="ปัญหาที่โครงงานนี้ต้องการแก้ไข"
                    className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-500 text-slate-900"
                  />
                </div>

                {/* Solution Approach */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-800">
                    แนวทางแก้ไขและนวัตกรรม (Solution Approach)
                  </label>
                  <input
                    type="text"
                    value={proposedSolution}
                    onChange={(e) => setProposedSolution(e.target.value)}
                    placeholder="เทคนิค วิธีการ หรืออัลกอริทึมที่ใช้"
                    className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-500 text-slate-900"
                  />
                </div>

                {/* Tech Stack */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-800">
                    เทคโนโลยีที่ใช้ (Tech Stack - คั่นด้วยเครื่องหมายจุลภาค ,)
                  </label>
                  <input
                    type="text"
                    value={techStackInput}
                    onChange={(e) => setTechStackInput(e.target.value)}
                    placeholder="เช่น Python, PyTorch, YOLOv8, ESP32, MQTT, React"
                    className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-500 text-slate-900 font-mono"
                  />
                </div>

                {/* Key Results */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-800">
                    ผลการทดสอบสำคัญ (Key Results)
                  </label>
                  <input
                    type="text"
                    value={keyResults}
                    onChange={(e) => setKeyResults(e.target.value)}
                    placeholder="เช่น ความแม่นยำ 94.2%, ประหยัดพลังงาน 30%, ส่งสัญญาณไกล 10 กม."
                    className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-500 text-slate-900"
                  />
                </div>

                {/* Step 2 Actions */}
                <div className="pt-4 flex justify-between">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors"
                  >
                    ย้อนกลับ
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(3)}
                    className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-amber-400 font-bold text-xs rounded-xl flex items-center space-x-2 transition-colors"
                  >
                    <span>ถัดไป: คลังทรัพยากร</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Reusable Assets */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-display text-lg font-bold text-slate-900">
                    ขั้นตอนที่ 3: คลังทรัพยากรสำหรับส่งต่อรุ่นน้อง (Reusable Assets)
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    แนบลิงก์ GitHub, ชุดข้อมูล (Dataset), หรือรายงาน เพื่อให้นิสิตรุ่นต่อไปไม่ต้องเริ่มจากศูนย์
                  </p>
                </div>

                {/* GitHub Code Repo */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-800 flex items-center space-x-1.5">
                    <GithubIcon className="w-4 h-4 text-slate-700" />
                    <span>ซอร์สโค้ด GitHub Repository URL</span>
                  </label>
                  <input
                    type="url"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    placeholder="https://github.com/your-username/your-project-repo"
                    className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-500 text-slate-900 font-mono"
                  />
                </div>

                {/* Dataset URL */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-800 flex items-center space-x-1.5">
                    <Database className="w-4 h-4 text-emerald-600" />
                    <span>ชุดข้อมูล Dataset URL (Kaggle / Google Drive / HuggingFace)</span>
                  </label>
                  <input
                    type="url"
                    value={datasetUrl}
                    onChange={(e) => setDatasetUrl(e.target.value)}
                    placeholder="https://drive.google.com/... หรือ Kaggle Dataset URL"
                    className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-500 text-slate-900 font-mono"
                  />
                </div>

                {/* Model / Weights URL */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-800 flex items-center space-x-1.5">
                    <Cpu className="w-4 h-4 text-amber-700" />
                    <span>โมเดล AI หรือพิมพ์เขียววงจร (Pre-trained Weights / Schematics)</span>
                  </label>
                  <input
                    type="url"
                    value={modelUrl}
                    onChange={(e) => setModelUrl(e.target.value)}
                    placeholder="https://huggingface.co/... หรือ ลิงก์ไฟล์โมเดล .pt / .onnx"
                    className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-500 text-slate-900 font-mono"
                  />
                </div>

                {/* Paper / PDF Report URL */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-800 flex items-center space-x-1.5">
                    <FileCode className="w-4 h-4 text-blue-600" />
                    <span>รายงานวิจัยฉบับสมบูรณ์ (PDF / Research Paper URL)</span>
                  </label>
                  <input
                    type="url"
                    value={paperUrl}
                    onChange={(e) => setPaperUrl(e.target.value)}
                    placeholder="https://... ลิงก์เอกสารรูปเล่มรายงาน"
                    className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-500 text-slate-900 font-mono"
                  />
                </div>

                {/* Step 3 Actions */}
                <div className="pt-4 flex justify-between">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors"
                  >
                    ย้อนกลับ
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(4)}
                    className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-amber-400 font-bold text-xs rounded-xl flex items-center space-x-2 transition-colors"
                  >
                    <span>ถัดไป: ช่องว่างต่อยอด</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: Extension Gaps & Publish */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-display text-lg font-bold text-slate-900">
                    ขั้นตอนที่ 4: ช่องว่างและไอเดียต่อยอดสำหรับรุ่นน้อง (Extension Gaps)
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    บอกเล่าสิ่งที่ยังเป็นข้อจำกัด และจุดที่รุ่นน้องสามารถนำไปทำวิจัยต่อได้ในรุ่นถัดไป
                  </p>
                </div>

                {/* Limitations */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-800">
                    ข้อจำกัดของโครงงานในรุ่นนี้ (Limitations)
                  </label>
                  <textarea
                    rows={3}
                    value={limitations}
                    onChange={(e) => setLimitations(e.target.value)}
                    placeholder="เช่น โมเดลยังตรวจจับได้เฉพาะช่วงแสงแดดจัด, เซ็นเซอร์ยังไม่ได้กันน้ำระดับ IP68, ยังไม่ได้ทำแอปบนมือถือ..."
                    className="w-full p-3.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-500 text-slate-900 placeholder-slate-400"
                  />
                </div>

                {/* Suggested Extension Ideas */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-800">
                    แนวทางที่แนะนำให้นิสิตรุ่นน้องนำไปต่อยอด (Recommended Extensions)
                  </label>
                  <textarea
                    rows={3}
                    value={suggestedIdeas}
                    onChange={(e) => setSuggestedIdeas(e.target.value)}
                    placeholder="เช่น ต่อยอดขึ้นโดรนบินสำรวจ, เพิ่มระบบแจ้งเตือนผ่าน Line Notify, นำชุดข้อมูลไปสร้างโมเดล Transformer..."
                    className="w-full p-3.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-500 text-slate-900 placeholder-slate-400"
                  />
                </div>

                {/* Ready to Publish Summary Box */}
                <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-2xl space-y-2 text-xs text-amber-950">
                  <div className="font-bold flex items-center space-x-1.5 text-amber-900">
                    <Share2 className="w-4 h-4 text-amber-700" />
                    <span>พร้อมเผยแพร่สู่คลังองค์ความรู้ มก.ฉกส.</span>
                  </div>
                  <p className="leading-relaxed text-slate-700">
                    เมื่อกด <strong>&quot;เผยแพร่ DNA โครงงาน&quot;</strong> ข้อมูลของคุณจะปรากฏในหน้าสำรวจ DNA และระบบวิเคราะห์สายวิวัฒนาการ เพื่อให้นิสิต อาจารย์ และภาคชุมชนสามารถเข้าถึงได้ทันที
                  </p>
                </div>

                {/* Step 4 Actions */}
                <div className="pt-4 flex justify-between items-center">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(3)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors"
                  >
                    ย้อนกลับ
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm rounded-xl shadow-xs flex items-center space-x-2 transition-colors disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center space-x-2">
                        <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                        <span>กำลังบันทึกและเผยแพร่...</span>
                      </span>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                        <span>เผยแพร่ DNA โครงงาน</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

          </form>
        )}

      </main>

      {/* Footer */}
      <footer className="px-6 py-4 text-center text-xs text-slate-500">
        © 2026 Project DNA Registry · มหาวิทยาลัยเกษตรศาสตร์ วิทยาเขตเฉลิมพระเกียรติ จังหวัดสกลนคร (KU CSC)
      </footer>

    </div>
  );
}
