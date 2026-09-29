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
  AlertCircle
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
    <div className="glass-cyber rounded-2xl p-6 relative overflow-hidden space-y-4">
      {/* Cyber Corner Accents */}
      <div className="hud-corner-tl" />
      <div className="hud-corner-br" />

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#00F5A0]/15">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <Database className="w-4 h-4 text-[#FFD54A]" />
            <h2 className="text-base font-display font-bold text-white tracking-wide">
              Saved Audit History
            </h2>
            <span className="text-[10px] font-mono font-bold bg-[#FFD54A]/10 text-[#FFD54A] border border-[#FFD54A]/30 px-2 py-0.5 rounded">
              {reports.length} RECORDS
            </span>
          </div>
          <p className="text-xs text-slate-400 font-mono">
            Persistent storage in SQLite database.
          </p>
        </div>

        {reports.length > 0 && (
          <a
            href="/api/export/csv"
            download
            className="text-xs font-mono font-bold bg-[#01140D] hover:bg-[#FFD54A] hover:text-[#021E14] text-[#00F5A0] border border-[#00F5A0]/40 hover:border-[#FFD54A] px-3.5 py-1.5 rounded-lg flex items-center space-x-1.5 transition-all shadow shrink-0"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>EXPORT CSV</span>
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
            placeholder="Search candidate name or target role..."
            className="w-full bg-[#01140D]/90 border border-[#00F5A0]/20 rounded-lg pl-8 pr-3 py-1.5 text-xs font-mono text-emerald-200 placeholder-slate-500 focus:outline-none focus:border-[#FFD54A]"
          />
        </div>
      )}

      {/* Report Items List */}
      {reports.length === 0 ? (
        <div className="border border-dashed border-[#00F5A0]/20 rounded-xl p-8 text-center bg-[#01140D]/40 space-y-2">
          <History className="w-8 h-8 text-slate-600 mx-auto" />
          <p className="text-xs font-mono text-slate-400">
            No audit records in SQLite database yet.
          </p>
          <p className="text-[11px] text-emerald-400/60 font-sans">
            Run your first resume scan to populate the intelligence matrix.
          </p>
        </div>
      ) : (
        <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1 scrollbar-cyber">
          {filteredReports.map((report) => {
            const isSelected = report.id === selectedId;
            return (
              <div
                key={report.id}
                onClick={() => onSelectReport(report)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between group relative overflow-hidden ${
                  isSelected
                    ? "bg-[#011E14] border-[#FFD54A] shadow-[0_0_15px_rgba(255,213,74,0.2)]"
                    : "bg-[#01140D]/80 border-[#00F5A0]/20 hover:border-[#FFD54A]/50 hover:bg-[#022418]"
                }`}
              >
                {/* Active left indicator */}
                {isSelected && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#FFD54A]" />
                )}

                <div className="flex items-center space-x-3.5 min-w-0">
                  {/* Hex/Box Score Indicator */}
                  <div
                    className={`w-11 h-11 rounded-lg flex flex-col items-center justify-center font-display font-extrabold text-xs shrink-0 border ${
                      report.matchPercentage >= 75
                        ? "bg-[#00F5A0]/10 text-[#00F5A0] border-[#00F5A0]/40"
                        : report.matchPercentage >= 50
                        ? "bg-[#FFD54A]/10 text-[#FFD54A] border-[#FFD54A]/40"
                        : "bg-rose-950/40 text-rose-400 border-rose-800/40"
                    }`}
                  >
                    <span>{report.matchPercentage}%</span>
                    <span className="text-[8px] font-mono opacity-80">MATCH</span>
                  </div>

                  <div className="min-w-0">
                    <h3 className="text-xs font-display font-bold text-slate-100 truncate group-hover:text-[#FFD54A] transition-colors">
                      {report.candidateName}
                    </h3>
                    <p className="text-[11px] font-mono text-emerald-300/80 truncate mt-0.5">
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
                  <span className="text-[10px] font-mono font-bold text-[#FFD54A] opacity-0 group-hover:opacity-100 transition-all flex items-center space-x-0.5">
                    <span>INSPECT</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteReport(report.id);
                    }}
                    type="button"
                    className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-950/40 border border-transparent hover:border-rose-900/40 transition-all"
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
