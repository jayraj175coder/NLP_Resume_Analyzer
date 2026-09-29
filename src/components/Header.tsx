import React from "react";
import { Terminal, Shield, Sparkles, Cpu, Activity, Zap, Binary, Layers } from "lucide-react";

interface HeaderProps {
  activeView?: "dashboard" | "nlp_labs";
  onViewChange?: (view: "dashboard" | "nlp_labs") => void;
}

export default function Header({ activeView = "dashboard", onViewChange }: HeaderProps) {
  return (
    <header className="w-full bg-[#01140D]/80 backdrop-blur-xl border-b border-[#00F5A0]/20 sticky top-0 z-50 transition-all print:hidden">
      {/* Top micro-ticker bar */}
      <div className="bg-[#021810] border-b border-[#00F5A0]/10 px-4 py-1 flex items-center justify-between text-[11px] font-mono text-emerald-400/80 overflow-hidden">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1.5 text-[#FFD54A]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FFD54A] animate-ping" />
            <span className="font-bold tracking-wider">[SYS_ACTIVE]</span>
          </div>
          <span className="hidden sm:inline text-emerald-300/60">::</span>
          <span className="hidden sm:inline text-slate-300">
            ENGINE: <span className="text-[#00F5A0]">TF-IDF + COSINE + CONVERSATIONAL AI</span>
          </span>
          <span className="hidden md:inline text-emerald-300/60">::</span>
          <span className="hidden md:inline text-slate-300">
            NEURAL AUDITOR: <span className="text-[#FFD54A]">GEMINI AI DEEP_INSPECT</span>
          </span>
        </div>

        <div className="flex items-center space-x-3 text-slate-400">
          <span className="hidden lg:inline bg-[#021E14] px-2 py-0.5 rounded border border-[#FFD54A]/20 text-[10px] text-[#FFD54A]">
            CONVERSATIONAL AI COPILOT READY
          </span>
          <span className="font-mono text-[10px] text-emerald-400/70">
            LOC: HACKER_CORP_MAIN
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Logo and Brand */}
        <div
          onClick={() => onViewChange?.("dashboard")}
          className="flex items-center space-x-3.5 cursor-pointer"
        >
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#FFD54A] to-[#00F5A0] rounded-xl blur opacity-40 group-hover:opacity-80 transition duration-500 animate-pulse-glow" />
            <div className="relative bg-[#021E14] p-2.5 rounded-xl border border-[#FFD54A]/40 text-[#FFD54A] shadow-lg flex items-center justify-center">
              <Terminal className="w-6 h-6 text-[#FFD54A]" />
            </div>
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl sm:text-2xl font-display font-extrabold tracking-tight text-white flex items-center gap-1.5">
                <span>CV</span>
                <span className="text-[#FFD54A] glow-yellow">_ATS</span>
              </h1>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-[#FFD54A]/10 text-[#FFD54A] border border-[#FFD54A]/30 px-2 py-0.5 rounded">
                v3.0 HACKER + NLP
              </span>
            </div>
            <p className="text-xs text-emerald-400/80 font-mono flex items-center space-x-1 mt-0.5">
              <span>// AUTONOMOUS RESUME INTELLIGENCE MATRIX</span>
            </p>
          </div>
        </div>

        {/* Center/Right Navigation Switcher */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {onViewChange && (
            <div className="flex items-center bg-[#02130d] border border-emerald-500/30 p-1 rounded-xl">
              <button
                onClick={() => onViewChange("dashboard")}
                className={`px-3 sm:px-4 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                  activeView === "dashboard"
                    ? "bg-emerald-500 text-black shadow-[0_0_12px_rgba(16,185,129,0.4)]"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                ATS Dashboard
              </button>
              <button
                onClick={() => onViewChange("nlp_labs")}
                className={`px-3 sm:px-4 py-1.5 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
                  activeView === "nlp_labs"
                    ? "bg-[#FFD54A] text-black shadow-[0_0_12px_rgba(255,213,74,0.4)]"
                    : "text-[#FFD54A]/80 hover:text-[#FFD54A]"
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                AI Assistant
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
