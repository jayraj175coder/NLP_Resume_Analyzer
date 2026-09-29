import React, { useState, useEffect } from "react";
import {
  Cpu,
  Terminal,
  Shield,
  Award,
  Sparkles,
  Brain,
  History,
  ListRestart,
  Zap,
  Activity,
  Layers,
  Binary,
  Code2,
  CheckCircle2,
  AlertOctagon,
  BookOpen
} from "lucide-react";
import CyberBackground from "./components/CyberBackground";
import Header from "./components/Header";
import UploadSection from "./components/UploadSection";
import Dashboard from "./components/Dashboard";
import HistorySection from "./components/HistorySection";
import NLPPlatform from "./components/nlp/NLPPlatform";
import { ReportItem, AnalysisResponse } from "./types";

export default function App() {
  const [activeView, setActiveView] = useState<"dashboard" | "nlp_labs">("dashboard");
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [currentReport, setCurrentReport] = useState<AnalysisResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [analyzingTip, setAnalyzingTip] = useState("");

  const tips = [
    "PARSING_STRUCTURE // READING PDF & DOCX VECTORS...",
    "TOKENIZER_ENGINE // STRIPPING COMMON STOPWORDS...",
    "LEMMA_MATRIX // COMPUTING BASE WORD MORPHEMES...",
    "TF-IDF_VECTORIZER // BUILDING HIGH-DIMENSIONAL TERM MATRICES...",
    "COSINE_SIMILARITY // COMPUTING ANGULAR DISTANCE OVER RESUME VECTORS...",
    "NER_SCANNER // EXTRACTING TECH ROLES, COMPANIES & DATES...",
    "INSIGHT_ENGINE // GENERATING ATS RECOMMENDATIONS & BULLET REWRITES..."
  ];

  // Fetch reports history from backend SQLite on load
  const fetchHistory = async () => {
    try {
      const response = await fetch("/api/history");
      const data = await response.json();
      if (data.success && data.reports) {
        setReports(data.reports);
      }
    } catch (err) {
      console.error("Failed to load reports history:", err);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  // Staggered animated terminal logs during active audits
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (loading) {
      let index = 0;
      setAnalyzingTip(tips[0]);
      interval = setInterval(() => {
        index = (index + 1) % tips.length;
        setAnalyzingTip(tips[index]);
      }, 1400);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const handleAnalyze = async (payload: {
    resumeText?: string;
    resumeFile?: File;
    jdText: string;
  }) => {
    setLoading(true);
    setErrorMessage("");
    setCurrentReport(null);

    try {
      const formData = new FormData();
      formData.append("jdText", payload.jdText);

      if (payload.resumeFile) {
        formData.append("resumeFile", payload.resumeFile);
      } else if (payload.resumeText) {
        formData.append("resumeText", payload.resumeText);
      } else {
        throw new Error("No resume document or text was provided.");
      }

      const response = await fetch("/api/analyze", {
        method: "POST",
        body: formData
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "An error occurred during resume analysis.");
      }

      setCurrentReport(data);
      // Re-fetch SQLite history to sync database immediately
      await fetchHistory();

      // Scroll to results seamlessly
      setTimeout(() => {
        document.getElementById("printable-report-area")?.scrollIntoView({ behavior: "smooth" });
      }, 150);
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to analyze document.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectReport = (report: ReportItem) => {
    // Map ReportItem from DB back into the AnalysisResponse layout for the dashboard
    const mockResponse: AnalysisResponse = {
      success: true,
      reportId: report.id,
      timestamp: report.timestamp,
      candidateName: report.candidateName,
      jobTitle: report.jobTitle,
      matchPercentage: report.matchPercentage,
      atsScore: report.atsScore,
      qualityScore: report.qualityScore,
      skillsFound: report.skillsFound,
      skillsBreakdown: report.analysis
        ? {
            programming_languages: report.skillsFound.filter((s) =>
              ["python", "javascript", "typescript", "java", "sql", "c++", "go", "ruby"].includes(s.toLowerCase())
            ),
            frameworks: report.skillsFound.filter((s) =>
              ["react", "fastapi", "express", "django", "nextjs", "vue", "node", "flask"].includes(s.toLowerCase())
            ),
            databases: report.skillsFound.filter((s) =>
              ["postgresql", "mongodb", "sqlite", "redis", "mysql", "dynamodb"].includes(s.toLowerCase())
            ),
            cloud_devops: report.skillsFound.filter((s) =>
              ["aws", "docker", "kubernetes", "gcp", "azure", "git", "ci/cd", "linux", "terraform"].includes(s.toLowerCase())
            ),
            concepts: report.skillsFound.filter((s) =>
              ["machine learning", "data science", "nlp", "rest api", "microservices"].includes(s.toLowerCase())
            )
          }
        : {},
      missingSkills: report.missingSkills || [],
      resumeText: report.resumeText,
      keywordFreq: report.qualityReport?.duplicates || [],
      entities: [],
      sections: [],
      duplicates: report.qualityReport?.duplicates || [],
      qualityReport: {
        score: report.qualityScore,
        grammarScore: 94,
        atsScore: report.atsScore,
        issues: report.qualityReport?.issues || [],
        hasEmail: report.qualityReport?.hasEmail ?? true,
        hasLinkedIn: report.qualityReport?.hasLinkedIn ?? true,
        sectionCoverage: report.qualityReport?.sectionCoverage ?? 85
      },
      analysis: report.analysis
    };

    setCurrentReport(mockResponse);

    // Smooth scroll down to dashboard on selection
    setTimeout(() => {
      document.getElementById("printable-report-area")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleDeleteReport = async (id: string) => {
    try {
      const res = await fetch(`/api/history/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setReports((prev) => prev.filter((r) => r.id !== id));
        if (currentReport?.reportId === id) {
          setCurrentReport(null);
        }
      }
    } catch (err) {
      console.error("Failed to delete audit:", err);
    }
  };

  return (
    <div className="min-h-screen text-slate-100 flex flex-col font-sans relative antialiased selection:bg-[#FFD54A] selection:text-[#021E14]">
      {/* Interactive Cyber Particle Canvas & Glowing Grid */}
      <CyberBackground />

      {/* Cyber Header Navigation */}
      <Header activeView={activeView} onViewChange={setActiveView} />

      {activeView === "nlp_labs" ? (
        <main className="flex-1 w-full z-10">
          <NLPPlatform
            resumeData={currentReport}
            onReturnToDashboard={() => setActiveView("dashboard")}
          />
        </main>
      ) : (
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 z-10 print:p-0">
          
          {/* Massive Hero Section */}
          <div className="space-y-4 text-center max-w-4xl mx-auto pt-2 pb-4 print:hidden">
            <div className="flex flex-wrap items-center justify-center gap-2">
              <div className="inline-flex items-center space-x-2 bg-[#01140D] border border-[#00F5A0]/40 px-3.5 py-1 rounded-full text-xs font-mono text-[#00F5A0] shadow-[0_0_15px_rgba(0,245,160,0.15)]">
                <span className="w-2 h-2 rounded-full bg-[#00F5A0] animate-ping" />
                <span className="font-bold tracking-wider">HACKER_GRADE ATS BENCHMARKING ENGINE</span>
              </div>
              <button
                onClick={() => setActiveView("nlp_labs")}
                className="inline-flex items-center space-x-1.5 bg-[#FFD54A]/10 border border-[#FFD54A]/40 px-3.5 py-1 rounded-full text-xs font-mono text-[#FFD54A] hover:bg-[#FFD54A]/20 transition-all font-bold cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>NLP LEARNING LAB ▸</span>
              </button>
            </div>

            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-display font-extrabold tracking-tight text-white leading-tight">
              Crack The <span className="text-[#FFD54A] glow-yellow">Recruiter Algorithm</span>
            </h2>

            <p className="text-sm sm:text-base text-emerald-100/70 font-sans max-w-2xl mx-auto leading-relaxed">
              Autonomous vector NLP parser and TF-IDF matrix scorer engineered to provide clear ATS-focused feedback.
            </p>
          </div>

        {/* Error Alert Box */}
        {errorMessage && (
          <div className="glass-cyber border-rose-600/50 p-4 rounded-xl flex items-center space-x-3 text-rose-300 text-xs sm:text-sm max-w-3xl mx-auto print:hidden shadow-[0_0_20px_rgba(225,29,72,0.2)]">
            <AlertOctagon className="w-5 h-5 text-rose-400 shrink-0" />
            <div className="min-w-0">
              <strong className="font-mono text-rose-400 block uppercase">RUNTIME FAULT DETECTED:</strong>
              <span>{errorMessage}</span>
            </div>
          </div>
        )}

        {/* Upload Terminal Component */}
        <div className="print:hidden">
          <UploadSection onAnalyze={handleAnalyze} loading={loading} />
        </div>

        {/* Animated Cyber Terminal Loading State */}
        {loading && (
          <div className="glass-cyber-yellow rounded-2xl p-10 text-center relative overflow-hidden flex flex-col items-center justify-center min-h-[320px] print:hidden">
            <div className="hud-corner-tl" />
            <div className="hud-corner-tr" />
            <div className="hud-corner-bl" />
            <div className="hud-corner-br" />

            {/* Radar scanner sweep */}
            <div className="relative mb-6">
              <div className="w-20 h-20 rounded-full border-2 border-dashed border-[#FFD54A] flex items-center justify-center animate-radar">
                <div className="w-12 h-12 rounded-full border border-[#00F5A0] animate-ping opacity-60" />
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Zap className="w-6 h-6 text-[#FFD54A] fill-[#FFD54A] animate-pulse" />
              </div>
            </div>

            <div className="space-y-3 max-w-md">
              <div className="inline-block bg-[#01140D] px-3 py-1 rounded border border-[#FFD54A]/40 text-[#FFD54A] text-xs font-mono font-bold tracking-wider animate-pulse">
                &gt; {analyzingTip}
              </div>
              <p className="text-xs text-emerald-300/80 font-mono">
                Extracting tokens • Computing cosine similarities • Generating recommendations...
              </p>
            </div>
          </div>
        )}

        {/* Core Results Dashboard */}
        {currentReport && (
          <div className="space-y-8">
            <Dashboard data={currentReport} />
          </div>
        )}

        {/* Bottom Panel Grid (History & Technical NLP FAQ) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 print:hidden pt-4">
          
          {/* History Management column */}
          <div className="lg:col-span-2">
            <HistorySection
              reports={reports}
              onSelectReport={handleSelectReport}
              onDeleteReport={handleDeleteReport}
              selectedId={currentReport?.reportId}
            />
          </div>

          {/* Applied NLP Terminal Mechanics HUD */}
          <div className="glass-cyber rounded-2xl p-6 relative overflow-hidden space-y-4">
            <div className="hud-corner-tl" />
            <div className="hud-corner-br" />

            <div className="flex items-center space-x-2 text-xs font-mono font-bold text-[#FFD54A] pb-3 border-b border-[#00F5A0]/15">
              <Terminal className="w-4 h-4 text-[#FFD54A]" />
              <span>APPLIED NLP ARCHITECTURE</span>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-3 bg-[#01140D]/90 rounded-xl border border-[#00F5A0]/20 space-y-1">
                <h4 className="font-display font-bold text-white flex items-center space-x-1.5">
                  <span className="text-[#FFD54A] font-mono">[01]</span>
                  <span>Cosine Similarity Vector Matrix</span>
                </h4>
                <p className="text-slate-300 text-[11px] leading-relaxed font-sans">
                  Calculates angular distance between the multidimensional TF-IDF vectors of your resume and the target JD. Outputs true semantic overlap score.
                </p>
              </div>

              <div className="p-3 bg-[#01140D]/90 rounded-xl border border-[#00F5A0]/20 space-y-1">
                <h4 className="font-display font-bold text-white flex items-center space-x-1.5">
                  <span className="text-[#00F5A0] font-mono">[02]</span>
                  <span>TF-IDF Token Weighting</span>
                </h4>
                <p className="text-slate-300 text-[11px] leading-relaxed font-sans">
                  Term Frequency - Inverse Document Frequency boosts domain-specific tech terms (React, Docker, PyTorch) while dampening general vocabulary.
                </p>
              </div>

              <div className="p-3 bg-[#01140D]/90 rounded-xl border border-[#00F5A0]/20 space-y-1">
                <h4 className="font-display font-bold text-white flex items-center space-x-1.5">
                  <span className="text-[#38BDF8] font-mono">[03]</span>
                  <span>Named Entity Recognition (NER)</span>
                </h4>
                <p className="text-slate-300 text-[11px] leading-relaxed font-sans">
                  Scans and classifies structured entities including organizations, job titles, dates, degrees, contact protocols, and action verbs.
                </p>
              </div>
            </div>
          </div>

        </div>

      </main>
      )}

      {/* Cyberpunk Footer */}
      <footer className="bg-[#01140D]/90 border-t border-[#00F5A0]/20 py-6 mt-12 text-center print:hidden">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-emerald-400/70">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-[#00F5A0]" />
            <span>CYBER_ATS INTELLIGENCE MATRIX • FULL STACK NLP PRODUCTION SYSTEM</span>
          </div>
          <div className="flex items-center space-x-3 text-slate-400">
            <span>DATABASE: SQLITE 3.x</span>
            <span>•</span>
            <span className="text-[#FFD54A]">SECURITY: ZERO-LEAK AIRGAP</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
