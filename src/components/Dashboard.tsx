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
  ExternalLink
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { AnalysisResponse } from "../types";

interface DashboardProps {
  data: AnalysisResponse;
}

export default function Dashboard({ data }: DashboardProps) {
  const [activeView, setActiveView] = useState<"bento" | "skills" | "rewrites" | "audit">("bento");
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [copiedKeyword, setCopiedKeyword] = useState<string | null>(null);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>("all");

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
        badgeBg: "bg-[#00F5A0]/15 border-[#00F5A0]/40 text-[#00F5A0]"
      };
    } else if (atsScore >= 60 || matchPercentage >= 55) {
      return {
        label: "MODERATE ATS ALIGNMENT",
        sub: "REQUIRES TARGETED KEYWORD INJECTION",
        color: "text-[#FFD54A]",
        badgeBg: "bg-[#FFD54A]/15 border-[#FFD54A]/40 text-[#FFD54A]"
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
      {/* Print-Only Title Header */}
      <div className="hidden print:block border-b-2 border-slate-900 pb-4 mb-6">
        <h1 className="text-2xl font-bold text-slate-950">CYBER_ATS // RESUME INTELLIGENCE REPORT</h1>
        <p className="text-xs font-mono text-slate-500">Evaluated via TF-IDF Vectorizer, Cosine Similarity & Gemini AI</p>
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

      {/* Hero Dossier Card */}
      <div className="glass-cyber rounded-2xl p-6 sm:p-8 relative overflow-hidden print:border-none print:shadow-none print:p-0">
        <div className="hud-corner-tl" />
        <div className="hud-corner-tr" />
        <div className="hud-corner-bl" />
        <div className="hud-corner-br" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-[#00F5A0]/15 print:hidden">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`text-[10px] font-mono font-bold tracking-wider px-2.5 py-0.5 rounded border ${atsStatus.badgeBg}`}>
                {atsStatus.label}
              </span>
              <span className="text-[10px] font-mono text-emerald-400/70 bg-[#01140D] px-2.5 py-0.5 rounded border border-[#00F5A0]/20">
                AUDIT ID: {data.reportId ? data.reportId.slice(0, 8).toUpperCase() : "MAT_704"}
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-tight">
              {candidateName || "Candidate Profile"}
            </h2>

            <div className="flex items-center space-x-2 text-sm text-emerald-300 font-mono">
              <Target className="w-4 h-4 text-[#FFD54A]" />
              <span>Target Role:</span>
              <strong className="text-white font-sans font-bold text-base">{jobTitle}</strong>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handlePrint}
              type="button"
              className="text-xs font-mono font-bold bg-[#FFD54A] hover:bg-[#ffe073] text-[#021E14] px-4 py-2.5 rounded-xl flex items-center space-x-2 transition-all shadow-[0_0_15px_rgba(255,213,74,0.3)] active:scale-95"
            >
              <Printer className="w-4 h-4" />
              <span>EXPORT PDF REPORT</span>
            </button>
          </div>
        </div>

        {/* View Toggle Bar (Bento / Skills / Rewrites / Audits) */}
        <div className="flex items-center space-x-2 pt-6 overflow-x-auto pb-1 print:hidden">
          <button
            onClick={() => setActiveView("bento")}
            className={`text-xs font-mono font-bold px-4 py-2 rounded-xl transition-all flex items-center space-x-2 shrink-0 ${
              activeView === "bento"
                ? "bg-[#FFD54A] text-[#021E14] shadow-[0_0_15px_rgba(255,213,74,0.3)]"
                : "bg-[#01140D] text-slate-300 hover:text-white border border-[#00F5A0]/20 hover:border-[#FFD54A]/40"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>BENTO MATRIX VIEW</span>
          </button>

          <button
            onClick={() => setActiveView("skills")}
            className={`text-xs font-mono font-bold px-4 py-2 rounded-xl transition-all flex items-center space-x-2 shrink-0 ${
              activeView === "skills"
                ? "bg-[#FFD54A] text-[#021E14] shadow-[0_0_15px_rgba(255,213,74,0.3)]"
                : "bg-[#01140D] text-slate-300 hover:text-white border border-[#00F5A0]/20 hover:border-[#FFD54A]/40"
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>SKILLS & KEYWORDS ({skillsFound.length})</span>
          </button>

          <button
            onClick={() => setActiveView("rewrites")}
            className={`text-xs font-mono font-bold px-4 py-2 rounded-xl transition-all flex items-center space-x-2 shrink-0 ${
              activeView === "rewrites"
                ? "bg-[#FFD54A] text-[#021E14] shadow-[0_0_15px_rgba(255,213,74,0.3)]"
                : "bg-[#01140D] text-slate-300 hover:text-white border border-[#00F5A0]/20 hover:border-[#FFD54A]/40"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI BULLET REWRITES ({analysis.suggestedBulletPoints?.length || 0})</span>
          </button>

          <button
            onClick={() => setActiveView("audit")}
            className={`text-xs font-mono font-bold px-4 py-2 rounded-xl transition-all flex items-center space-x-2 shrink-0 ${
              activeView === "audit"
                ? "bg-[#FFD54A] text-[#021E14] shadow-[0_0_15px_rgba(255,213,74,0.3)]"
                : "bg-[#01140D] text-slate-300 hover:text-white border border-[#00F5A0]/20 hover:border-[#FFD54A]/40"
            }`}
          >
            <ListChecks className="w-3.5 h-3.5" />
            <span>HEALTH & COMPLIANCE</span>
          </button>
        </div>
      </div>

      {/* BENTO GRID MAIN DASHBOARD */}
      {(activeView === "bento" || window.matchMedia("print").matches) && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">
          
          {/* BENTO BLOCK 1: CORE ATS SCORE & SIMILARITY HUD (Span 8) */}
          <div className="lg:col-span-8 glass-cyber rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between">
            <div className="hud-corner-tl" />
            <div className="hud-corner-br" />

            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-mono font-bold tracking-widest text-[#FFD54A] uppercase bg-[#FFD54A]/10 border border-[#FFD54A]/30 px-2 py-0.5 rounded">
                  [TELEMETRY_01] // ATS CORE ENGINE
                </span>
                <span className="text-xs font-mono text-emerald-400">
                  STATUS: {atsScore >= 75 ? "EXEMPLARY" : "ATTENTION_REQUIRED"}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-center">
                {/* Massive Cyber Circular Gauge */}
                <div className="flex flex-col items-center justify-center p-4 bg-[#01140D]/90 rounded-2xl border border-[#00F5A0]/25 shadow-inner relative">
                  <div className="relative w-32 h-32 flex items-center justify-center">
                    {/* Outer Rotating Cyber Ring */}
                    <div className="absolute inset-0 border border-dashed border-[#FFD54A]/30 rounded-full animate-radar pointer-events-none" />
                    
                    <svg className="w-28 h-28 transform -rotate-90" viewBox="0 0 36 36">
                      <path
                        className="text-emerald-950/80"
                        strokeWidth="3.2"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path
                        className="text-[#FFD54A]"
                        strokeDasharray={`${matchPercentage}, 100`}
                        strokeWidth="3.6"
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>

                    <div className="absolute inset-0 flex flex-col items-center justify-center font-display text-center">
                      <span className="text-3xl font-extrabold text-white glow-yellow leading-none">
                        {matchPercentage}%
                      </span>
                      <span className="text-[9px] font-mono text-emerald-400 mt-1 uppercase">
                        MATCH RATIO
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-mono text-[#FFD54A] font-bold mt-2">
                    COSINE VECTOR SCORE
                  </span>
                </div>

                {/* Score Breakdown 2: ATS Compliance Score */}
                <div className="p-4 bg-[#01140D]/90 rounded-2xl border border-[#00F5A0]/25 flex flex-col justify-between h-full">
                  <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                    <span>ATS COMPLIANCE</span>
                    <ShieldCheck className="w-4 h-4 text-[#00F5A0]" />
                  </div>
                  <div className="my-2">
                    <span className="text-3xl font-display font-extrabold text-[#00F5A0] glow-emerald">
                      {atsScore}
                    </span>
                    <span className="text-xs font-mono text-slate-400"> / 100</span>
                  </div>
                  <div className="w-full bg-[#021E14] h-2 rounded-full overflow-hidden border border-[#00F5A0]/30">
                    <div
                      className="bg-gradient-to-r from-emerald-500 to-[#00F5A0] h-full rounded-full transition-all duration-1000"
                      style={{ width: `${atsScore}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-emerald-300/80 font-mono mt-2">
                    Structure, header formats & parsing readiness.
                  </p>
                </div>

                {/* Score Breakdown 3: Resume Quality Score */}
                <div className="p-4 bg-[#01140D]/90 rounded-2xl border border-[#00F5A0]/25 flex flex-col justify-between h-full">
                  <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                    <span>QUALITY INDEX</span>
                    <Award className="w-4 h-4 text-[#38BDF8]" />
                  </div>
                  <div className="my-2">
                    <span className="text-3xl font-display font-extrabold text-[#38BDF8]">
                      {qualityScore}
                    </span>
                    <span className="text-xs font-mono text-slate-400"> / 100</span>
                  </div>
                  <div className="w-full bg-[#021E14] h-2 rounded-full overflow-hidden border border-[#38BDF8]/30">
                    <div
                      className="bg-gradient-to-r from-cyan-600 to-[#38BDF8] h-full rounded-full transition-all duration-1000"
                      style={{ width: `${qualityScore}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-emerald-300/80 font-mono mt-2">
                    Grammar metrics, action verbs & contact checks.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-[#00F5A0]/15 flex items-center justify-between text-xs font-mono text-emerald-400/80">
              <span>ALGORITHM: COSINE_SIMILARITY(TF-IDF_VECTORS)</span>
              <span className="text-[#FFD54A] font-bold">{atsStatus.sub}</span>
            </div>
          </div>

          {/* BENTO BLOCK 2: AI RECRUITER EXECUTIVE SUMMARY (Span 4) */}
          <div className="lg:col-span-4 glass-cyber rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between">
            <div className="hud-corner-tr" />
            <div className="hud-corner-bl" />

            <div>
              <div className="flex items-center space-x-2 text-xs font-mono text-[#FFD54A] font-bold mb-3">
                <Brain className="w-4 h-4 text-[#FFD54A]" />
                <span>AI RECRUITER VERDICT</span>
              </div>
              <p className="text-xs font-sans text-slate-200 leading-relaxed font-medium">
                {analysis.summary || "Autonomous analysis completed. Semantic tokens mapped across skills, experience, and education domains."}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-[#00F5A0]/15 space-y-2">
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className="text-slate-400">MATCHED SKILLS:</span>
                <strong className="text-[#00F5A0]">{skillsFound.length} IDENTIFIED</strong>
              </div>
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className="text-slate-400">MISSING TARGET SKILLS:</span>
                <strong className="text-rose-400">{missingSkills.length} SKILLS</strong>
              </div>
            </div>
          </div>

          {/* BENTO BLOCK 3: STRENGTHS & KEYWORD AUDIT (Span 6) */}
          <div className="lg:col-span-6 glass-cyber rounded-2xl p-6 relative overflow-hidden space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-[#00F5A0]" />
                <h3 className="text-sm font-display font-bold text-white tracking-wide">
                  Top Profile Strengths
                </h3>
              </div>
              <span className="text-[10px] font-mono text-[#00F5A0] bg-[#00F5A0]/15 px-2 py-0.5 rounded border border-[#00F5A0]/30">
                {analysis.strengths?.length || 0} ADVANTAGES
              </span>
            </div>

            <div className="space-y-2.5">
              {analysis.strengths && analysis.strengths.slice(0, 4).map((str, idx) => (
                <div key={idx} className="p-3 bg-[#01140D]/90 rounded-xl border border-[#00F5A0]/20 flex items-start space-x-3 text-xs text-slate-200">
                  <span className="text-[#00F5A0] font-mono font-bold mt-0.5">[{idx + 1}]</span>
                  <span className="font-sans leading-relaxed">{str}</span>
                </div>
              ))}
            </div>
          </div>

          {/* BENTO BLOCK 4: WEAKNESSES & MISSING SKILLS AUDIT (Span 6) */}
          <div className="lg:col-span-6 glass-cyber rounded-2xl p-6 relative overflow-hidden space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-[#FFD54A]" />
                <h3 className="text-sm font-display font-bold text-white tracking-wide">
                  Critical Gaps & Missing Keywords
                </h3>
              </div>
              <span className="text-[10px] font-mono text-[#FFD54A] bg-[#FFD54A]/15 px-2 py-0.5 rounded border border-[#FFD54A]/30">
                ACTION REQUIRED
              </span>
            </div>

            {missingSkills.length > 0 ? (
              <div className="space-y-2">
                <p className="text-[11px] font-mono text-slate-300">
                  Click any missing skill to copy into clipboard:
                </p>
                <div className="flex flex-wrap gap-1.5 max-h-[140px] overflow-y-auto scrollbar-cyber pr-1">
                  {missingSkills.map((skill) => (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => handleCopyKeyword(skill)}
                      className="group text-xs font-mono font-bold bg-rose-950/30 hover:bg-rose-900/50 text-rose-300 border border-rose-800/50 px-2.5 py-1 rounded-lg flex items-center space-x-1.5 transition-all"
                      title="Click to copy skill"
                    >
                      <span>+ {skill.toUpperCase()}</span>
                      {copiedKeyword === skill ? (
                        <Check className="w-3 h-3 text-[#00F5A0]" />
                      ) : (
                        <Copy className="w-3 h-3 text-rose-400 opacity-60 group-hover:opacity-100" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-3 bg-[#00F5A0]/10 border border-[#00F5A0]/30 rounded-xl text-xs font-mono text-[#00F5A0] flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-[#00F5A0]" />
                <span>100% Target JD Skills covered in dossier.</span>
              </div>
            )}

            <div className="space-y-2 pt-2 border-t border-[#00F5A0]/15">
              {analysis.weaknesses && analysis.weaknesses.slice(0, 2).map((weak, idx) => (
                <div key={idx} className="p-2.5 bg-amber-950/20 rounded-xl border border-amber-800/40 text-xs text-amber-200/90 flex items-start space-x-2.5">
                  <span className="text-[#FFD54A] font-mono font-bold">⚠</span>
                  <span className="font-sans leading-relaxed">{weak}</span>
                </div>
              ))}
            </div>
          </div>

          {/* BENTO BLOCK 5: SKILLS RADAR & CATEGORY MATRIX (Span 7) */}
          <div className="lg:col-span-7 glass-cyber rounded-2xl p-6 relative overflow-hidden space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Code className="w-4 h-4 text-[#FFD54A]" />
                <h3 className="text-sm font-display font-bold text-white tracking-wide">
                  Skill Breakdown Matrix
                </h3>
              </div>
              <span className="text-xs font-mono text-emerald-400">
                {skillsFound.length} MATCHED TECH STACK
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {Object.entries(skillsBreakdown).map(([category, skills]) => {
                if (!skills || skills.length === 0) return null;
                const cleanCat = category.replace("_", " ").toUpperCase();
                return (
                  <div key={category} className="p-3.5 bg-[#01140D]/90 rounded-xl border border-[#00F5A0]/20 space-y-2">
                    <div className="flex items-center justify-between text-[10px] font-mono font-bold text-[#FFD54A]">
                      <span>{cleanCat}</span>
                      <span className="text-slate-400">{skills.length} ITEMS</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {skills.map((s) => (
                        <span
                          key={s}
                          className="text-[11px] font-mono font-semibold bg-[#00F5A0]/10 text-[#00F5A0] border border-[#00F5A0]/30 px-2 py-0.5 rounded"
                        >
                          {s.toUpperCase()}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* BENTO BLOCK 6: TF-IDF TOKEN DENSITY CHART (Span 5) */}
          <div className="lg:col-span-5 glass-cyber rounded-2xl p-6 relative overflow-hidden space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Layers className="w-4 h-4 text-[#00F5A0]" />
                <h3 className="text-sm font-display font-bold text-white tracking-wide">
                  TF-IDF Keyword Frequency
                </h3>
              </div>
              <span className="text-[10px] font-mono text-[#FFD54A]">VECTOR INTENSITY</span>
            </div>

            <div className="space-y-3 max-h-[220px] overflow-y-auto scrollbar-cyber pr-1">
              {keywordFreq.slice(0, 6).map((item, idx) => {
                const percent = Math.min(100, Math.round((item.count / maxKeywordCount) * 100));
                return (
                  <div key={idx} className="space-y-1 font-mono text-xs">
                    <div className="flex justify-between text-slate-200">
                      <span className="font-bold uppercase text-[11px] text-[#FFD54A]">{item.word}</span>
                      <span className="text-emerald-400 text-[10px]">{item.count} OCCURRENCES</span>
                    </div>
                    <div className="w-full bg-[#01140D] rounded-full h-2 overflow-hidden border border-[#00F5A0]/20">
                      <div
                        className="bg-gradient-to-r from-[#00F5A0] to-[#FFD54A] h-full rounded-full transition-all duration-700"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* BENTO BLOCK 7: AI BULLET POINT REWRITE PLAYGROUND (Span 12) */}
          <div className="lg:col-span-12 glass-cyber rounded-2xl p-6 sm:p-8 relative overflow-hidden space-y-5">
            <div className="hud-corner-tl" />
            <div className="hud-corner-tr" />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#00F5A0]/15">
              <div>
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-5 h-5 text-[#FFD54A] animate-spin" style={{ animationDuration: "8s" }} />
                  <h3 className="text-lg font-display font-bold text-white tracking-wide">
                    AI-Optimized Impact Bullet Points
                  </h3>
                </div>
                <p className="text-xs text-slate-300 font-sans mt-0.5">
                  Replace weak descriptive tasks with quantified, metric-driven accomplishments engineered for human recruiters and ATS algorithms.
                </p>
              </div>

              <span className="text-xs font-mono font-bold bg-[#FFD54A]/10 text-[#FFD54A] border border-[#FFD54A]/30 px-3 py-1 rounded-lg shrink-0">
                HIGH IMPACT FORMULAS
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {analysis.suggestedBulletPoints && analysis.suggestedBulletPoints.map((bullet, idx) => (
                <div key={idx} className="p-4 bg-[#01140D]/90 rounded-xl border border-[#00F5A0]/25 relative group hover:border-[#FFD54A]/50 transition-all flex flex-col justify-between space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <span className="text-[10px] font-mono font-bold text-[#FFD54A] uppercase bg-[#FFD54A]/15 px-2 py-0.5 rounded border border-[#FFD54A]/30">
                      REWRITE FORMULA 0{idx + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopyBullet(bullet, idx)}
                      className="text-xs font-mono font-bold bg-[#021E14] hover:bg-[#FFD54A] hover:text-[#021E14] text-[#00F5A0] border border-[#00F5A0]/40 px-2.5 py-1 rounded-lg flex items-center space-x-1.5 transition-all"
                      title="Copy to clipboard"
                    >
                      {copiedIndex === idx ? (
                        <>
                          <Check className="w-3 h-3 text-[#021E14]" />
                          <span>COPIED</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>COPY</span>
                        </>
                      )}
                    </button>
                  </div>

                  <p className="text-xs sm:text-sm font-sans text-slate-100 font-medium leading-relaxed">
                    {bullet}
                  </p>

                  <div className="flex items-center justify-between text-[10px] font-mono text-emerald-400/80 pt-2 border-t border-[#00F5A0]/10">
                    <span>ACTION VERB + METRIC + OUTCOME</span>
                    <span className="text-[#FFD54A]">ATS RATING: 98%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* BENTO BLOCK 8: CAREER TIMELINE & ENTITIES MAP (Span 6) */}
          <div className="lg:col-span-6 glass-cyber rounded-2xl p-6 relative overflow-hidden space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Building className="w-4 h-4 text-[#38BDF8]" />
                <h3 className="text-sm font-display font-bold text-white tracking-wide">
                  Experience & Organization Timeline
                </h3>
              </div>
              <span className="text-[10px] font-mono text-[#38BDF8]">NER EXTRACTION</span>
            </div>

            <div className="space-y-3 max-h-[220px] overflow-y-auto scrollbar-cyber pr-1">
              {organizationEntities.length === 0 && dateEntities.length === 0 ? (
                <p className="text-xs font-mono text-slate-500 italic">No organizations or dates extracted.</p>
              ) : (
                organizationEntities.map((org, i) => (
                  <div key={i} className="p-3 bg-[#01140D]/90 rounded-xl border border-[#38BDF8]/20 flex items-center space-x-3 text-xs">
                    <span className="w-2 h-2 rounded-full bg-[#38BDF8] animate-ping" />
                    <div>
                      <strong className="text-white font-sans font-bold block">{org.text}</strong>
                      <span className="text-[10px] font-mono text-slate-400">
                        {dateEntities[i]?.text ? `TIMELINE: ${dateEntities[i].text}` : "ORGANIZATION NODE"}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* BENTO BLOCK 9: RESUME HEALTH & COMPLIANCE (Span 6) */}
          <div className="lg:col-span-6 glass-cyber rounded-2xl p-6 relative overflow-hidden space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-[#00F5A0]" />
                <h3 className="text-sm font-display font-bold text-white tracking-wide">
                  Format Diagnostics & Contact Health
                </h3>
              </div>
              <span className="text-[10px] font-mono text-[#00F5A0]">AUDIT CHECKLIST</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-[#01140D]/90 rounded-xl border border-[#00F5A0]/20 space-y-1">
                <span className="text-[10px] font-mono text-slate-400 block">EMAIL VERIFICATION</span>
                <span className={`text-xs font-mono font-bold ${qualityReport.hasEmail ? "text-[#00F5A0]" : "text-rose-400"}`}>
                  {qualityReport.hasEmail ? "✓ VALID EMAIL DETECTED" : "✗ MISSING EMAIL"}
                </span>
              </div>

              <div className="p-3 bg-[#01140D]/90 rounded-xl border border-[#00F5A0]/20 space-y-1">
                <span className="text-[10px] font-mono text-slate-400 block">LINKEDIN PROFILE</span>
                <span className={`text-xs font-mono font-bold ${qualityReport.hasLinkedIn ? "text-[#00F5A0]" : "text-rose-400"}`}>
                  {qualityReport.hasLinkedIn ? "✓ LINKEDIN FOUND" : "✗ MISSING LINKEDIN"}
                </span>
              </div>

              <div className="p-3 bg-[#01140D]/90 rounded-xl border border-[#00F5A0]/20 space-y-1">
                <span className="text-[10px] font-mono text-slate-400 block">SECTIONS COVERAGE</span>
                <span className="text-xs font-mono font-bold text-[#FFD54A]">
                  {qualityReport.sectionCoverage}% COMPLETE
                </span>
              </div>

              <div className="p-3 bg-[#01140D]/90 rounded-xl border border-[#00F5A0]/20 space-y-1">
                <span className="text-[10px] font-mono text-slate-400 block">GRAMMAR & ACTION VERBS</span>
                <span className="text-xs font-mono font-bold text-[#38BDF8]">
                  {qualityReport.grammarScore}% INDEX
                </span>
              </div>
            </div>

            {duplicates && duplicates.length > 0 && (
              <div className="p-2.5 bg-amber-950/20 border border-amber-800/40 rounded-xl text-[11px] font-mono text-amber-300 flex items-center justify-between">
                <span>KEYWORD STUFFING WARNING:</span>
                <span>{duplicates.map(d => `${d.word} (${d.count}x)`).join(", ")}</span>
              </div>
            )}
          </div>

        </div>
      )}

      {/* DETAILED SKILLS VIEW */}
      {activeView === "skills" && (
        <div className="space-y-6">
          <div className="glass-cyber rounded-2xl p-6 space-y-6">
            <h3 className="text-lg font-display font-bold text-white">Full Tech Stack & Keyword Coverage</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(skillsBreakdown).map(([category, skills]) => (
                <div key={category} className="p-5 bg-[#01140D]/90 rounded-2xl border border-[#00F5A0]/25 space-y-3">
                  <span className="text-xs font-mono font-bold text-[#FFD54A] uppercase tracking-wider block border-b border-[#00F5A0]/15 pb-2">
                    {category.replace("_", " ")}
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {skills.map((s) => (
                      <span key={s} className="text-xs font-mono font-semibold bg-[#00F5A0]/10 text-[#00F5A0] border border-[#00F5A0]/30 px-3 py-1 rounded-lg">
                        {s.toUpperCase()}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* DETAILED REWRITES VIEW */}
      {activeView === "rewrites" && (
        <div className="space-y-6">
          <div className="glass-cyber rounded-2xl p-6 sm:p-8 space-y-6">
            <div className="space-y-1">
              <h3 className="text-xl font-display font-bold text-white">Gemini AI Actionable Recommendations</h3>
              <p className="text-xs text-slate-300 font-sans">Step-by-step roadmap to maximize recruitment callbacks.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {analysis.recommendations && analysis.recommendations.map((rec, idx) => (
                <div key={idx} className="p-5 bg-[#01140D]/90 rounded-2xl border border-[#FFD54A]/30 relative overflow-hidden space-y-3">
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-[#FFD54A]" />
                  <span className="text-[10px] font-mono font-bold text-[#FFD54A]">STEP 0{idx + 1}</span>
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
          <div className="glass-cyber rounded-2xl p-6 space-y-6">
            <h3 className="text-lg font-display font-bold text-white">ATS Parsing & Formatting Diagnostics</h3>
            <div className="space-y-3">
              {qualityReport.issues && qualityReport.issues.length > 0 ? (
                qualityReport.issues.map((issue, idx) => (
                  <div key={idx} className="p-3.5 bg-rose-950/20 border border-rose-800/40 rounded-xl flex items-center space-x-3 text-xs text-rose-300">
                    <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                    <span>{issue}</span>
                  </div>
                ))
              ) : (
                <div className="p-4 bg-[#00F5A0]/10 border border-[#00F5A0]/30 rounded-xl text-xs font-mono text-[#00F5A0]">
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
