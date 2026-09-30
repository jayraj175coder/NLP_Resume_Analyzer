import React from "react";
import { Bot, GraduationCap, LayoutDashboard, ShieldCheck, Award, Sparkles } from "lucide-react";

interface HeaderProps {
  activeView?: "dashboard" | "nlp_labs";
  onViewChange?: (view: "dashboard" | "nlp_labs") => void;
}

export default function Header({ activeView = "dashboard", onViewChange }: HeaderProps) {
  return (
    <header className="w-full sticky top-0 z-50 border-b border-amber-500/20 bg-[#0B132B]/90 backdrop-blur-xl print:hidden shadow-lg shadow-black/20">
      <div className="max-w-7xl mx-auto flex h-20 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={() => onViewChange?.("dashboard")}
          className="group flex min-w-0 items-center gap-3.5 text-left cursor-pointer"
          aria-label="Go to Resume Analyzer dashboard"
        >
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-amber-500/40 bg-gradient-to-br from-amber-500 via-amber-600 to-teal-700 text-slate-950 shadow-md shadow-amber-500/20 transition-transform duration-200 group-hover:-translate-y-0.5">
            <GraduationCap className="h-6 w-6 text-slate-950 stroke-[2.2]" />
          </span>
          <span className="min-w-0">
            <span className="flex items-center gap-2">
              <span className="truncate text-xl sm:text-2xl font-serif font-bold tracking-tight text-white group-hover:text-amber-300 transition-colors">
                Resume Analyzer
              </span>
              <span className="hidden rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-[10px] font-mono font-semibold uppercase tracking-wider text-amber-300 sm:inline">
                Conversational AI
              </span>
            </span>
            <span className="hidden text-xs text-slate-300 sm:block">
              Peer-reviewed resume matching & ATS optimization
            </span>
          </span>
        </button>

        <div className="flex items-center gap-2 sm:gap-4">
          {onViewChange && (
            <nav className="flex items-center rounded-xl border border-amber-500/30 bg-slate-900/60 p-1" aria-label="Primary navigation">
              <button
                type="button"
                onClick={() => onViewChange("dashboard")}
                className={`inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-semibold transition-all sm:px-4 cursor-pointer ${
                  activeView === "dashboard"
                    ? "bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20"
                    : "text-slate-300 hover:bg-white/10 hover:text-white"
                }`}
              >
                <LayoutDashboard className="h-4 w-4" />
                <span>Analyzer Dashboard</span>
              </button>
              <button
                type="button"
                onClick={() => onViewChange("nlp_labs")}
                className={`inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-semibold transition-all sm:px-4 cursor-pointer ${
                  activeView === "nlp_labs"
                    ? "bg-teal-500 text-slate-950 font-bold shadow-md shadow-teal-500/20"
                    : "text-slate-300 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Bot className="h-4 w-4" />
                <span>Conversational AI</span>
              </button>
            </nav>
          )}
        </div>
      </div>
    </header>
  );
}
