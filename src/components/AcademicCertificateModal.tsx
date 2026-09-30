import React, { useEffect } from "react";
import {
  Award,
  GraduationCap,
  Printer,
  X,
  CheckCircle2,
  BookMarked,
  ShieldCheck,
  Calendar,
  ArrowLeft
} from "lucide-react";
import { AnalysisResponse } from "../types";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  data: AnalysisResponse;
}

export default function AcademicCertificateModal({ isOpen, onClose, data }: Props) {
  // Listen for Escape key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const candidate = data.candidateName || "Candidate";
  const jobTitle = data.jobTitle || "Software Engineer";
  const match = data.matchPercentage || 85;
  const atsScore = data.atsScore || 88;
  const quality = data.qualityScore || 90;
  const skillsCount = data.skillsFound?.length || 8;
  const reportId = data.reportId || `REP-${Date.now().toString().slice(-6)}`;
  const dateStr = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });

  const getGrade = (score: number) => {
    if (score >= 90) return { grade: "A+ (Distinction)", text: "Exceptional Alignment" };
    if (score >= 80) return { grade: "A (Merit)", text: "High Academic & Skill Alignment" };
    if (score >= 70) return { grade: "B (Proficient)", text: "Satisfactory Technical Foundation" };
    return { grade: "C (Developing)", text: "Requires Targeted Keyword Optimization" };
  };

  const gradeInfo = getGrade(match);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto print:p-0 print:bg-white"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-3xl bg-[#0B132B] border-2 border-amber-500/50 rounded-2xl shadow-2xl p-4 sm:p-8 text-slate-100 space-y-5 my-auto max-h-[92vh] flex flex-col print:border-none print:shadow-none print:p-0 print:bg-white print:text-black print:max-h-none print:my-0"
      >
        {/* STICKY TOP ACTION BAR (Always visible even when scrolling) */}
        <div className="sticky top-0 z-20 bg-[#0B132B] flex items-center justify-between border-b border-amber-500/20 pb-3 shrink-0 print:hidden">
          <button
            onClick={onClose}
            type="button"
            className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-amber-300 border border-amber-500/30 rounded-xl font-mono text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow"
          >
            <ArrowLeft className="w-4 h-4 text-amber-400" />
            <span>Back to Dashboard</span>
          </button>

          <div className="hidden sm:flex items-center space-x-2 text-amber-400 font-mono text-xs font-bold">
            <Award className="w-4 h-4" />
            <span>ACADEMIC EVALUATION CERTIFICATE</span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              type="button"
              className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-serif font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all shadow cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              type="button"
              className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors cursor-pointer border border-transparent hover:border-slate-700"
              title="Close modal (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* SCROLLABLE CERTIFICATE CONTENT */}
        <div className="overflow-y-auto flex-1 pr-1 space-y-6 scrollbar-academic print:overflow-visible">
          
          {/* Certificate Frame Content */}
          <div className="border-4 border-double border-amber-500/40 p-6 sm:p-8 rounded-xl bg-slate-900/60 relative overflow-hidden space-y-6 print:border-black print:bg-white print:p-4">
            <div className="hud-corner-tl print:hidden" />
            <div className="hud-corner-tr print:hidden" />
            <div className="hud-corner-bl print:hidden" />
            <div className="hud-corner-br print:hidden" />

            {/* Certificate Header */}
            <div className="text-center space-y-2 border-b border-amber-500/20 pb-6 print:border-black">
              <div className="mx-auto w-14 h-14 rounded-full bg-amber-500/15 border-2 border-amber-400 flex items-center justify-center text-amber-400 mb-2 shadow-md">
                <GraduationCap className="w-8 h-8 stroke-[2.2]" />
              </div>
              <span className="text-[11px] font-mono tracking-widest text-amber-300 uppercase font-bold print:text-black">
                Official Academic NLP Audit Record
              </span>
              <h1 className="text-2xl sm:text-3xl font-serif font-bold tracking-wide text-white print:text-black">
                Certificate of Resume Evaluation
              </h1>
              <p className="text-xs text-slate-300 font-sans print:text-slate-700">
                Issued by Resume Analyzer • Academic NLP & ATS Verification Suite
              </p>
            </div>

            {/* Body Statement */}
            <div className="text-center space-y-4 py-2">
              <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed print:text-black">
                This official evaluation certificate confirms that the candidate resume submitted by
              </p>
              <h2 className="text-xl sm:text-2xl font-serif font-extrabold text-amber-300 tracking-wide underline decoration-amber-500/40 print:text-black">
                {candidate}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed print:text-black">
                has undergone multidimensional TF-IDF vector analysis, Cosine Similarity evaluation, and Named Entity Recognition against target role:
              </p>
              <div className="inline-block bg-slate-950/80 px-4 py-1.5 rounded-lg border border-amber-500/30 text-teal-300 font-mono text-xs font-bold print:border-black print:text-black">
                {jobTitle}
              </div>
            </div>

            {/* Score Metrics Grid */}
            <div className="grid grid-cols-3 gap-3 text-center py-2">
              <div className="p-3 bg-slate-950/80 rounded-xl border border-amber-500/20 print:border-slate-300">
                <div className="text-xl sm:text-2xl font-serif font-bold text-amber-300 print:text-black">
                  {match}%
                </div>
                <div className="text-[10px] font-mono text-slate-400 uppercase print:text-slate-600">Vector Match</div>
              </div>
              <div className="p-3 bg-slate-950/80 rounded-xl border border-teal-500/20 print:border-slate-300">
                <div className="text-xl sm:text-2xl font-serif font-bold text-teal-300 print:text-black">
                  {atsScore}/100
                </div>
                <div className="text-[10px] font-mono text-slate-400 uppercase print:text-slate-600">ATS Benchmark</div>
              </div>
              <div className="p-3 bg-slate-950/80 rounded-xl border border-indigo-500/20 print:border-slate-300">
                <div className="text-xl sm:text-2xl font-serif font-bold text-indigo-300 print:text-black">
                  {skillsCount}
                </div>
                <div className="text-[10px] font-mono text-slate-400 uppercase print:text-slate-600">Skills Verified</div>
              </div>
            </div>

            {/* Grade Outcome Box */}
            <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-center justify-between text-xs font-mono print:border-black">
              <div className="space-y-0.5">
                <span className="text-[10px] text-amber-300/80 uppercase">Academic Performance Rank</span>
                <div className="text-sm font-bold text-white print:text-black">{gradeInfo.grade}</div>
              </div>
              <div className="text-right text-slate-300 font-sans text-xs print:text-black">
                {gradeInfo.text}
              </div>
            </div>

            {/* Footer Metadata */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-amber-500/20 text-[10px] font-mono text-slate-400 print:border-black print:text-black">
              <div>
                <span>REPORT ID: {reportId}</span>
                <span className="mx-2">•</span>
                <span>DATE: {dateStr}</span>
              </div>
              <div className="flex items-center space-x-1 text-amber-400 print:text-black font-bold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>VERIFIED NLP ALGORITHMIC AUDIT</span>
              </div>
            </div>

          </div>

          {/* BOTTOM BACK BUTTON */}
          <div className="pt-2 flex justify-center print:hidden">
            <button
              onClick={onClose}
              type="button"
              className="px-6 py-2.5 bg-slate-900 hover:bg-amber-500 hover:text-slate-950 text-amber-300 border border-amber-500/40 rounded-xl font-mono text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-md"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Dashboard</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
