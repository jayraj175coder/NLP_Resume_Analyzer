import React, { useState } from "react";
import {
  FileText,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  TrendingUp,
  Tags,
  Layers,
  Printer,
  Brain,
  Code,
  ShieldCheck,
  ListChecks,
  ArrowUpRight,
  Copy,
  Check,
  Zap,
  Activity,
  Award,
  Sparkles,
  Search,
  Sliders,
  Calendar,
  Building,
  Target,
  ExternalLink,
  Flame,
  GraduationCap
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { AnalysisResponse } from "../types";
import NGramHeatmap from "./NGramHeatmap";
import AcademicCertificateModal from "./AcademicCertificateModal";

interface DashboardProps {
  data: AnalysisResponse;
}

export default function Dashboard({ data }: DashboardProps) {
  const [activeView, setActiveView] = useState<"bento" | "skills" | "rewrites" | "audit">("bento");
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [copiedKeyword, setCopiedKeyword] = useState<string | null>(null);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>("all");
  const [isCertModalOpen, setIsCertModalOpen] = useState(false);

  const {
    matchPercentage,
    atsScore,
    qualityScore,
    candidateName,
    jobTitle,
    skillsFound = [],
    skillsBreakdown = {},
    missingSkills = [],
    keywordFreq = [],
    entities = [],
    sections = [],
    duplicates = [],
    qualityReport = {
      grammarScore: 95,
      issues: [],
      hasEmail: true,
      hasLinkedIn: true,
      sectionCoverage: 80,
      score: 90,
      atsScore: 88
    },
    analysis = {
      summary: "",
      strengths: [],
      weaknesses: [],
      recommendations: [],
      suggestedBulletPoints: [],
      missingKeywords: [],
      grammarNotes: ""
    }
  } = data;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyBullet = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleCopyKeyword = (keyword: string) => {
    navigator.clipboard.writeText(keyword);
    setCopiedKeyword(keyword);
    setTimeout(() => setCopiedKeyword(null), 1500);
  };

  // Safe division for keyword count bars
  const maxKeywordCount = keywordFreq.length > 0 ? Math.max(...keywordFreq.map((k) => k.count)) : 1;

  // Extract organizations and dates for Experience Timeline
  const organizationEntities = entities.filter((e) => e.label === "ORGANIZATION");
  const dateEntities = entities.filter((e) => e.label === "DATE");
  const academicEntities = entities.filter((e) => e.label === "EDUCATION");

  // Determine overall ATS status color and label
  const getAtsStatus = () => {
    if (atsScore >= 80 && matchPercentage >= 75) {
      return {
        label: "HIGH HIRING PROBABILITY",
        sub: "PASSED TOP ATS TIER (TOP 5%)",
        color: "text-[#00F5A0]",
        badgeBg: "bg-teal-500/15 border-teal-500/40 text-teal-300"
      };
    } else if (atsScore >= 60 || matchPercentage >= 55) {
      return {
        label: "MODERATE ATS ALIGNMENT",
        sub: "REQUIRES TARGETED KEYWORD INJECTION",
        color: "text-amber-300",
        badgeBg: "bg-amber-500/15 border-amber-500/40 text-amber-300"
      };
    } else {
      return {
        label: "CRITICAL GAPS DETECTED",
        sub: "RESTRUCTURE FORMAT & MATCH KEYWORDS",
        color: "text-rose-400",
        badgeBg: "bg-rose-950/40 border-rose-800/50 text-rose-400"
      };
    }
  };

  const atsStatus = getAtsStatus();

  return (
    <div id="printable-report-area" className="space-y-6">
      {/* Official Academic Certificate Modal */}
      <AcademicCertificateModal
        isOpen={isCertModalOpen}
        onClose={() => setIsCertModalOpen(false)}
        data={data}
      />

      {/* Print-Only Title Header */}
      <div className="hidden print:block border-b-2 border-slate-900 pb-4 mb-6">
        <h1 className="text-2xl font-bold text-slate-950">Resume Analysis Report</h1>
        <p className="text-xs font-mono text-slate-500">Evaluated via TF-IDF Vectorizer, Cosine Similarity & Rule-Based NLP</p>
        <div className="grid grid-cols-2 gap-4 mt-4 text-xs font-sans text-slate-800">
          <div>
            <p><strong>Candidate:</strong> {candidateName}</p>
            <p><strong>Target Position:</strong> {jobTitle}</p>
          </div>
          <div className="text-right">
            <p><strong>Match Score:</strong> {matchPercentage}%</p>
            <p><strong>ATS Compliance:</strong> {atsScore}/100</p>
            <p><strong>Quality Rating:</strong> {qualityScore}/100</p>
          </div>
        </div>
      </div>

      {/* Report overview */}
      <div className="glass-academic rounded-2xl p-6 sm:p-8 relative overflow-hidden print:border-none print:shadow-none print:p-0">
        <div className="hud-corner-tl" />
        <div className="hud-corner-tr" />
        <div className="hud-corner-bl" />
        <div className="hud-corner-br" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-amber-500/20 print:hidden">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`text-[10px] font-mono font-bold tracking-wider px-2.5 py-0.5 rounded border ${atsStatus.badgeBg}`}>
                {atsStatus.label}
              </span>
              <span className="text-[10px] font-mono text-amber-300/80 bg-slate-900 px-2.5 py-0.5 rounded border border-amber-500/20">
                REPORT ID: {data.reportId ? data.reportId.slice(0, 8).toUpperCase() : "RPT_704"}
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight">
              {candidateName || "Candidate Profile"}
            </h2>

            <div className="flex items-center space-x-2 text-sm text-amber-300 font-mono">
              <Target className="w-4 h-4 text-amber-400" />
              <span>Target Role:</span>
              <strong className="text-white font-sans font-bold text-base">{jobTitle}</strong>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsCertModalOpen(true)}
              type="button"
              className="text-xs font-mono font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 px-4 py-2.5 rounded-xl flex items-center space-x-2 transition-all shadow-md cursor-pointer"
            >
              <Award className="w-4 h-4" />
              <span>ACADEMIC CERTIFICATE</span>
            </button>
            <button
              onClick={handlePrint}
              type="button"
              className="text-xs font-mono font-bold bg-slate-900 hover:bg-slate-800 text-amber-300 border border-amber-500/30 px-4 py-2.5 rounded-xl flex items-center space-x-2 transition-all shadow-md cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>EXPORT PDF</span>
            </button>
          </div>
        </div>

        {/* Report navigation */}
        <div className="flex items-center space-x-2 pt-6 overflow-x-auto pb-1 print:hidden">
          <button
            onClick={() => setActiveView("bento")}
            className={`text-xs font-mono font-bold px-4 py-2 rounded-xl transition-all flex items-center space-x-2 shrink-0 cursor-pointer ${
              activeView === "bento"
                ? "bg-amber-500 text-slate-950 shadow-md"
                : "bg-slate-900 text-slate-300 hover:text-white border border-amber-500/20 hover:border-amber-400/40"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Overview & Heatmap</span>
          </button>

          <button
            onClick={() => setActiveView("skills")}
            className={`text-xs font-mono font-bold px-4 py-2 rounded-xl transition-all flex items-center space-x-2 shrink-0 cursor-pointer ${
              activeView === "skills"
                ? "bg-amber-500 text-slate-950 shadow-md"
                : "bg-slate-900 text-slate-300 hover:text-white border border-amber-500/20 hover:border-amber-400/40"
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>SKILLS & KEYWORDS ({skillsFound.length})</span>
          </button>

          <button
            onClick={() => setActiveView("rewrites")}
            className={`text-xs font-mono font-bold px-4 py-2 rounded-xl transition-all flex items-center space-x-2 shrink-0 cursor-pointer ${
              activeView === "rewrites"
                ? "bg-amber-500 text-slate-950 shadow-md"
                : "bg-slate-900 text-slate-300 hover:text-white border border-amber-500/20 hover:border-amber-400/40"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>ACTION REWRITES</span>
          </button>

          <button
            onClick={() => setActiveView("audit")}
            className={`text-xs font-mono font-bold px-4 py-2 rounded-xl transition-all flex items-center space-x-2 shrink-0 cursor-pointer ${
              activeView === "audit"
                ? "bg-amber-500 text-slate-950 shadow-md"
                : "bg-slate-900 text-slate-300 hover:text-white border border-amber-500/20 hover:border-amber-400/40"
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>ATS DIAGNOSTICS</span>
          </button>
        </div>
      </div>

      {/* OVERVIEW BENTO DASHBOARD VIEW */}
      {activeView === "bento" && (
        <div className="space-y-6">
          {/* Top Metrics Row */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Primary Cosine Vector Score Gauge */}
            <div className="lg:col-span-8 glass-academic rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between">
              <div className="hud-corner-tl" />
              <div className="hud-corner-br" />

              <div className="space-y-1 pb-4">
                <span className="text-[10px] font-mono font-bold text-amber-300 tracking-wider uppercase">
                  TF-IDF Cosine Similarity Matrix
                </span>
                <h3 className="text-lg font-serif font-bold text-white tracking-wide">
                  Overall Qualification Match Score
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center my-2">
                {/* Circular Metric Meter */}
                <div className="relative w-44 h-44 mx-auto flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      className="stroke-slate-800"
                      strokeWidth="8"
                      fill="transparent"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      className="stroke-amber-400 transition-all duration-1000 ease-out"
                      strokeWidth="8"
                      strokeDasharray={251.2}
                      strokeDashoffset={251.2 - (251.2 * matchPercentage) / 100}
                      strokeLinecap="round"
                      fill="transparent"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="text-3xl font-serif font-extrabold text-amber-300">
                      {matchPercentage}%
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">
                      Cosine Distance
                    </span>
                  </div>
                </div>

                {/* Score breakdown pills */}
                <div className="space-y-3 font-mono text-xs">
                  <div className="p-3 bg-slate-900/90 rounded-xl border border-amber-500/20 flex items-center justify-between">
                    <span className="text-slate-300">ATS Compliance:</span>
                    <span className="text-amber-300 font-bold">{atsScore}/100</span>
                  </div>
                  <div className="p-3 bg-slate-900/90 rounded-xl border border-teal-500/20 flex items-center justify-between">
                    <span className="text-slate-300">Lexical Quality Rating:</span>
                    <span className="text-teal-300 font-bold">{qualityScore}/100</span>
                  </div>
                  <div className="p-3 bg-slate-900/90 rounded-xl border border-indigo-500/20 flex items-center justify-between">
                    <span className="text-slate-300">Skills Verified:</span>
                    <span className="text-indigo-300 font-bold">{skillsFound.length} Detected</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Profile Diagnostic summary */}
            <div className="lg:col-span-4 glass-academic rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between">
              <div className="hud-corner-tr" />
              <div className="hud-corner-bl" />

              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-xs font-mono text-amber-400 font-bold">
                  <Brain className="w-4 h-4" />
                  <span>EXECUTIVE SUMMARY</span>
                </div>
                <p className="text-xs font-sans text-slate-200 leading-relaxed">
                  {analysis.summary || `Candidate shows strong domain alignment with ${skillsFound.slice(0, 4).join(", ")}. Further quantification of engineering impact recommended.`}
                </p>
              </div>

              <div className="pt-4 border-t border-amber-500/20 space-y-2">
                <button
                  onClick={() => setIsCertModalOpen(true)}
                  className="w-full text-xs font-serif font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 py-2.5 rounded-xl flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-md"
                >
                  <Award className="w-4 h-4" />
                  <span>View Official Evaluation Certificate</span>
                </button>
              </div>
            </div>

          </div>

          {/* Interactive N-Gram Heatmap Matrix Component */}
          <NGramHeatmap
            resumeText={data.resumeText}
            skillsFound={skillsFound}
            missingSkills={missingSkills}
          />
        </div>
      )}

      {/* DETAILED SKILLS & KEYWORDS VIEW */}
      {activeView === "skills" && (
        <div className="space-y-6">
          <div className="glass-academic rounded-2xl p-6 space-y-6">
            <h3 className="text-lg font-serif font-bold text-white">Full Tech Stack & Keyword Coverage</h3>
            <div className="flex flex-wrap gap-2">
              {skillsFound.map((skill, idx) => (
                <span
                  key={idx}
                  onClick={() => handleCopyKeyword(skill)}
                  className="px-3 py-1.5 bg-slate-900 text-teal-300 border border-teal-500/30 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 hover:border-amber-400 transition-all cursor-pointer"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />
                  <span>{skill}</span>
                </span>
              ))}
              {missingSkills.map((missing, idx) => (
                <span
                  key={idx}
                  onClick={() => handleCopyKeyword(missing)}
                  className="px-3 py-1.5 bg-rose-950/40 text-rose-300 border border-rose-800/40 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 hover:border-rose-400 transition-all cursor-pointer"
                >
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                  <span>Missing: {missing}</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* DETAILED REWRITES VIEW */}
      {activeView === "rewrites" && (
        <div className="space-y-6">
          <div className="glass-academic rounded-2xl p-6 sm:p-8 space-y-6">
            <div className="space-y-1">
              <h3 className="text-xl font-serif font-bold text-white">Actionable Recommendations</h3>
              <p className="text-xs text-slate-300 font-sans">Step-by-step roadmap to maximize recruitment callbacks.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {analysis.recommendations && analysis.recommendations.map((rec, idx) => (
                <div key={idx} className="p-5 bg-slate-900/90 rounded-2xl border border-amber-500/30 relative overflow-hidden space-y-3">
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-amber-400" />
                  <span className="text-[10px] font-mono font-bold text-amber-300">STEP 0{idx + 1}</span>
                  <p className="text-xs font-sans text-slate-100 leading-relaxed font-medium">
                    {rec}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* DETAILED AUDIT VIEW */}
      {activeView === "audit" && (
        <div className="space-y-6">
          <div className="glass-academic rounded-2xl p-6 space-y-6">
            <h3 className="text-lg font-serif font-bold text-white">ATS Parsing & Formatting Diagnostics</h3>
            <div className="space-y-3">
              {qualityReport.issues && qualityReport.issues.length > 0 ? (
                qualityReport.issues.map((issue, idx) => (
                  <div key={idx} className="p-3.5 bg-rose-950/20 border border-rose-800/40 rounded-xl flex items-center space-x-3 text-xs text-rose-300">
                    <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                    <span>{issue}</span>
                  </div>
                ))
              ) : (
                <div className="p-4 bg-teal-500/10 border border-teal-500/30 rounded-xl text-xs font-mono text-teal-300">
                  ✓ No critical formatting or compliance issues detected in dossier.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
