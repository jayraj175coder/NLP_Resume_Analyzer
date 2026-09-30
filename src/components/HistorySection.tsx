import React, { useState } from "react";
import {
  History,
  Trash2,
  Calendar,
  FileSpreadsheet,
  ArrowRight,
  Database,
  Search,
  CheckCircle2,
  AlertCircle,
  BookMarked
} from "lucide-react";
import { ReportItem } from "../types";

interface HistorySectionProps {
  reports: ReportItem[];
  onSelectReport: (report: ReportItem) => void;
  onDeleteReport: (id: string) => void;
  selectedId?: string;
}

export default function HistorySection({
  reports,
  onSelectReport,
  onDeleteReport,
  selectedId
}: HistorySectionProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });
    } catch (e) {
      return "Recent";
    }
  };

  const filteredReports = reports.filter((r) => {
    const q = searchTerm.toLowerCase();
    return (
      r.candidateName.toLowerCase().includes(q) ||
      r.jobTitle.toLowerCase().includes(q)
    );
  });

  return (
    <div className="glass-academic rounded-2xl p-6 relative overflow-hidden space-y-4">
      {/* Card accents */}
      <div className="hud-corner-tl" />
      <div className="hud-corner-br" />

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-amber-500/20">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <BookMarked className="w-4 h-4 text-amber-400" />
            <h2 className="text-base font-serif font-bold text-white tracking-wide">
              Evaluation Archives & Repository
            </h2>
            <span className="text-[10px] font-mono font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded">
              {reports.length} ARCHIVED
            </span>
          </div>
          <p className="text-xs text-slate-300 font-sans">
            Access past candidate evaluations or download complete dataset export.
          </p>
        </div>

        {reports.length > 0 && (
          <a
            href="/api/export/csv"
            download
            className="text-xs font-mono font-bold bg-slate-900 hover:bg-amber-500 hover:text-slate-950 text-amber-300 border border-amber-500/40 hover:border-amber-400 px-3.5 py-1.5 rounded-lg flex items-center space-x-1.5 transition-all shadow shrink-0 cursor-pointer"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>EXPORT CSV DATA</span>
          </a>
        )}
      </div>

      {/* Search Filter input */}
      {reports.length > 3 && (
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search candidate name or role title..."
            className="w-full bg-slate-900/90 border border-amber-500/20 rounded-lg pl-8 pr-3 py-1.5 text-xs font-mono text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-400"
          />
        </div>
      )}

      {/* Report Items List */}
      {reports.length === 0 ? (
        <div className="border border-dashed border-amber-500/20 rounded-xl p-8 text-center bg-slate-900/40 space-y-2">
          <History className="w-8 h-8 text-slate-500 mx-auto" />
          <p className="text-xs font-mono text-slate-400">
            No archived evaluation records found.
          </p>
          <p className="text-[11px] text-amber-300/60 font-sans">
            Run your first evaluation to generate paper archive records.
          </p>
        </div>
      ) : (
        <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1 scrollbar-academic">
          {filteredReports.map((report) => {
            const isSelected = report.id === selectedId;
            return (
              <div
                key={report.id}
                onClick={() => onSelectReport(report)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between group relative overflow-hidden ${
                  isSelected
                    ? "bg-slate-900 border-amber-400 shadow-md shadow-amber-500/20"
                    : "bg-slate-900/60 border-amber-500/20 hover:border-amber-400/50 hover:bg-slate-850"
                }`}
              >
                {/* Active left indicator */}
                {isSelected && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-400" />
                )}

                <div className="flex items-center space-x-3.5 min-w-0">
                  {/* Hex/Box Score Indicator */}
                  <div
                    className={`w-11 h-11 rounded-lg flex flex-col items-center justify-center font-serif font-bold text-xs shrink-0 border ${
                      report.matchPercentage >= 75
                        ? "bg-teal-500/15 text-teal-300 border-teal-500/40"
                        : report.matchPercentage >= 50
                        ? "bg-amber-500/15 text-amber-300 border-amber-500/40"
                        : "bg-rose-950/40 text-rose-300 border-rose-800/40"
                    }`}
                  >
                    <span>{report.matchPercentage}%</span>
                    <span className="text-[8px] font-mono opacity-80">MATCH</span>
                  </div>

                  <div className="min-w-0">
                    <h3 className="text-xs font-serif font-bold text-slate-100 truncate group-hover:text-amber-300 transition-colors">
                      {report.candidateName}
                    </h3>
                    <p className="text-[11px] font-mono text-teal-300/90 truncate mt-0.5">
                      {report.jobTitle}
                    </p>
                    <div className="flex items-center space-x-2 text-[9px] font-mono text-slate-400 mt-1">
                      <span className="flex items-center space-x-1">
                        <Calendar className="w-2.5 h-2.5" />
                        <span>{formatDate(report.timestamp)}</span>
                      </span>
                      <span>•</span>
                      <span>ATS: {report.atsScore}</span>
                      <span>•</span>
                      <span>SKILLS: {report.skillsFound.length}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <span className="text-[10px] font-mono font-bold text-amber-300 opacity-0 group-hover:opacity-100 transition-all flex items-center space-x-0.5">
                    <span>VIEW</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteReport(report.id);
                    }}
                    type="button"
                    className="p-1.5 rounded-lg text-slate-500 hover:text-rose-300 hover:bg-rose-950/40 border border-transparent hover:border-rose-900/40 transition-all cursor-pointer"
                    title="Delete record"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
