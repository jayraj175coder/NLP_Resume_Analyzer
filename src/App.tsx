import React, { useState, useEffect } from "react";
import {
  Sparkles,
  BookOpen,
  AlertOctagon,
  GraduationCap,
  Award,
  Zap,
  CheckCircle2,
  FileSpreadsheet,
  Brain,
  BookmarkCheck,
  Search,
  BookMarked
} from "lucide-react";
import AcademicBackground from "./components/CyberBackground";
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
    "PARSER_MODULE // Reading document vector structure...",
    "LEXICAL_LAB // Filtering stop-words & computing lemma matrices...",
    "TFIDF_VECTORIZER // Constructing term-frequency inverse weights...",
    "COSINE_METRIC // Evaluating angular distance across resume vectors...",
    "NER_SCANNER // Extracting tech roles, qualifications & metrics...",
    "SCHOLAR_ENGINE // Formulating ATS recommendations & bullet rewrites..."
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

  // Rotate helpful progress messages during analysis.
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
    <div className="min-h-screen text-slate-100 flex flex-col font-sans relative antialiased selection:bg-[#F59E0B] selection:text-[#0B132B]">
      {/* Subtle academic background texture */}
      <AcademicBackground />

      {/* Main navigation */}
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
          
          {/* Introduction */}
          <div className="space-y-4 text-center max-w-4xl mx-auto pt-6 pb-6 print:hidden">
            <div className="flex flex-wrap items-center justify-center gap-2.5">
              <div className="inline-flex items-center space-x-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 text-xs font-semibold text-amber-200 shadow-md shadow-amber-500/10">
                <GraduationCap className="h-4 w-4 text-amber-400" />
                <span>Peer-Reviewed Academic NLP & ATS Evaluator</span>
              </div>
              <button
                onClick={() => setActiveView("nlp_labs")}
                className="inline-flex items-center space-x-1.5 bg-teal-500/10 border border-teal-500/40 px-4 py-1.5 rounded-full text-xs font-mono text-teal-300 hover:bg-teal-500/20 transition-all font-bold cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Explore Interactive NLP Lab</span>
              </button>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-extrabold tracking-tight text-white leading-tight">
              Optimize Every Resume with <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-teal-300">Academic Precision</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 font-sans max-w-2xl mx-auto leading-relaxed">
              Evaluate your resume against target job requirements using mathematical TF-IDF vectorization, entity extraction, and scholarly ATS scoring.
            </p>
          </div>

        {/* Error Alert Box */}
        {errorMessage && (
          <div className="glass-academic border-rose-500/60 p-4 rounded-xl flex items-center space-x-3 text-rose-200 text-xs sm:text-sm max-w-3xl mx-auto print:hidden shadow-lg shadow-rose-950/30">
            <AlertOctagon className="w-5 h-5 text-rose-400 shrink-0" />
            <div className="min-w-0">
              <strong className="font-semibold text-rose-200 block">We could not complete the analysis</strong>
              <span>{errorMessage}</span>
            </div>
          </div>
        )}

        {/* Resume input */}
        <div className="print:hidden">
          <UploadSection onAnalyze={handleAnalyze} loading={loading} />
        </div>

        {/* Analysis progress */}
        {loading && (
          <div className="glass-academic-gold rounded-2xl p-10 text-center relative overflow-hidden flex flex-col items-center justify-center min-h-[320px] print:hidden">
            <div className="hud-corner-tl" />
            <div className="hud-corner-tr" />
            <div className="hud-corner-bl" />
            <div className="hud-corner-br" />

            {/* Scholarly Neural Vector Pulse */}
            <div className="relative mb-6">
              <div className="w-20 h-20 rounded-full border-2 border-dashed border-amber-400 flex items-center justify-center animate-spin" style={{ animationDuration: '8s' }}>
                <div className="w-12 h-12 rounded-full border border-teal-400 animate-ping opacity-60" />
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Brain className="w-7 h-7 text-amber-400 fill-amber-400/30 animate-pulse" />
              </div>
            </div>

            <div className="space-y-3 max-w-md">
              <div className="inline-block bg-slate-900/90 px-4 py-1.5 rounded-md border border-amber-400/40 text-amber-300 text-xs font-mono font-bold tracking-wider animate-pulse">
                &gt; {analyzingTip}
              </div>
              <p className="text-xs text-slate-300 font-sans">
                Reading your document, matching key skill matrices, and building your academic report.
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

        {/* History and method overview */}
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

          {/* How the analysis works */}
          <div className="glass-academic rounded-2xl p-6 relative overflow-hidden space-y-4">
            <div className="hud-corner-tl" />
            <div className="hud-corner-br" />

            <div className="flex items-center space-x-2 text-xs font-mono font-bold text-amber-400 pb-3 border-b border-amber-500/20">
              <BookMarked className="w-4 h-4 text-amber-400" />
              <span>SCHOLARLY EVALUATION METHODOLOGY</span>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-3.5 bg-slate-900/80 rounded-xl border border-amber-500/20 space-y-1">
                <h3 className="font-serif font-bold text-white text-sm flex items-center space-x-1.5">
                  <span className="text-amber-400 font-mono">[01]</span>
                  <span>Cosine Similarity Vector Space</span>
                </h3>
                <p className="text-slate-300 text-[11px] leading-relaxed font-sans">
                  Calculates angular distance between multi-dimensional TF-IDF vectors of your resume and target job requirements for objective semantic match scores.
                </p>
              </div>

              <div className="p-3.5 bg-slate-900/80 rounded-xl border border-amber-500/20 space-y-1">
                <h3 className="font-serif font-bold text-white text-sm flex items-center space-x-1.5">
                  <span className="text-teal-400 font-mono">[02]</span>
                  <span>TF-IDF Token Weighting</span>
                </h3>
                <p className="text-slate-300 text-[11px] leading-relaxed font-sans">
                  Term Frequency-Inverse Document Frequency highlights domain-specific engineering & research terminology while dampening high-frequency noise words.
                </p>
              </div>

              <div className="p-3.5 bg-slate-900/80 rounded-xl border border-amber-500/20 space-y-1">
                <h3 className="font-serif font-bold text-white text-sm flex items-center space-x-1.5">
                  <span className="text-cyan-400 font-mono">[03]</span>
                  <span>Named Entity Recognition (NER)</span>
                </h3>
                <p className="text-slate-300 text-[11px] leading-relaxed font-sans">
                  Parses and categorizes credentials, technological frameworks, metrics, publication markers, and leadership action verbs.
                </p>
              </div>
            </div>
          </div>

        </div>

      </main>
      )}

      {/* Footer */}
      <footer className="bg-slate-950/90 border-t border-amber-500/20 py-6 mt-12 text-center print:hidden">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-300">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span>SCHOLAR RESUME AI • ACADEMIC & RESEARCH EVALUATOR</span>
          </div>
          <div className="flex items-center space-x-3 text-slate-400">
            <span>Private analysis workspace</span>
            <span>•</span>
            <span className="text-amber-400 font-semibold">Scholar Grade Evaluation</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
