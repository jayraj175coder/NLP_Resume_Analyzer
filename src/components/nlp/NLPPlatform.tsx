import React from "react";
import {
  Sparkles,
  Bot,
  Home,
  GraduationCap,
  Award
} from "lucide-react";
import { AnalysisResponse } from "../../types";
import Module15Chatbot from "./Module15Chatbot";

interface Props {
  resumeData?: AnalysisResponse | null;
  onReturnToDashboard?: () => void;
}

export default function NLPPlatform({ resumeData, onReturnToDashboard }: Props) {
  const sampleResumeText =
    resumeData?.resumeText ||
    (resumeData?.analysis?.summary
      ? `${resumeData.analysis.summary} Skills: ${resumeData.skillsFound?.join(", ")}.`
      : "") ||
    `Senior Software Engineer with 6+ years of experience architecting high-throughput distributed backend systems. Engineered and deployed scalable microservices using React, TypeScript, Python, and PostgreSQL. Spearheaded API performance optimization, reducing latency by 42% and accelerating delivery pipelines across cloud infrastructure. Managed technical skills, machine learning systems, database architectures, and education qualifications.`;

  return (
    <div className="min-h-screen text-slate-100 p-4 md:p-8 space-y-6" id="nlp-platform-root">
      {/* Top Academic Navigation & Module Header */}
      <div className="glass-academic rounded-2xl p-5 sm:p-6 relative overflow-hidden flex flex-wrap items-center justify-between gap-4">
        <div className="hud-corner-tl" />
        <div className="hud-corner-br" />

        <div className="flex items-center gap-4">
          {onReturnToDashboard && (
            <button
              onClick={onReturnToDashboard}
              className="px-4 py-2 bg-slate-900 hover:bg-amber-500 hover:text-slate-950 text-amber-300 border border-amber-500/30 rounded-xl font-serif text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow"
            >
              <Home className="w-4 h-4" />
              <span>Analyzer Dashboard</span>
            </button>
          )}
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-xs font-mono font-bold text-amber-300 tracking-wider uppercase">
                Conversational AI Engine • Interview Co-Pilot
              </span>
            </div>
            <h1 className="text-xl md:text-2xl font-serif font-bold tracking-tight text-white mt-1 flex items-center gap-2.5">
              <Bot className="w-6 h-6 text-amber-400" />
              Conversational AI Assistant & Interview Co-Pilot
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-teal-300 bg-slate-900/90 px-3.5 py-2 rounded-xl border border-teal-500/30 flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-400" />
            <span>{resumeData?.candidateName ? `Candidate Context: ${resumeData.candidateName}` : "Intent Recognition + Memory Active"}</span>
          </span>
        </div>
      </div>

      {/* Active Conversational AI Assistant */}
      <div className="transition-all duration-300">
        <Module15Chatbot
          resumeText={sampleResumeText}
          candidateName={resumeData?.candidateName}
          jobTitle={resumeData?.jobTitle}
          skillsFound={resumeData?.skillsFound || []}
          missingSkills={resumeData?.missingSkills || []}
          atsScore={resumeData?.atsScore || 86}
        />
      </div>
    </div>
  );
}
