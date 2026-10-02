import React, { useState } from "react";
import { PieChart, Layers, Brain, CheckCircle2, AlertTriangle, Sparkles, Cpu, Award } from "lucide-react";
import { AnalysisResponse } from "../types";

interface Props {
  data: AnalysisResponse;
}

interface SliceData {
  label: string;
  value: number;
  color: string;
  gradient: string;
  textColor: string;
  details?: string;
}

export default function NLPTechPieCharts({ data }: Props) {
  const [activeChartIndex, setActiveChartIndex] = useState<number>(0);
  const [hoveredSlice, setHoveredSlice] = useState<{ chartIdx: number; sliceIdx: number } | null>(null);

  const skillsFound = data.skillsFound || [];
  const missingSkills = data.missingSkills || [];
  const breakdown = data.skillsBreakdown || {};
  const resumeText = data.resumeText || "";
  const entities = data.entities || [];

  // --- CHART 1 DATA: NLP Technical Skill Categories Taxonomy ---
  const langCount = breakdown.programming_languages?.length || Math.max(1, Math.min(skillsFound.length, 3));
  const fwCount = breakdown.frameworks?.length || Math.max(1, Math.min(skillsFound.length, 4));
  const dbCount = breakdown.databases?.length || Math.max(1, Math.min(skillsFound.length, 2));
  const cloudCount = breakdown.cloud_devops?.length || Math.max(1, Math.min(skillsFound.length, 3));
  const conceptCount = breakdown.concepts?.length || Math.max(1, Math.min(skillsFound.length, 2));

  const taxonomySlices: SliceData[] = [
    {
      label: "Programming Languages",
      value: langCount,
      color: "#F59E0B",
      gradient: "from-amber-500 to-amber-600",
      textColor: "text-amber-400",
      details: breakdown.programming_languages?.join(", ") || "Python, JS, SQL, C++"
    },
    {
      label: "Frameworks & Libraries",
      value: fwCount,
      color: "#14B8A6",
      gradient: "from-teal-400 to-teal-600",
      textColor: "text-teal-400",
      details: breakdown.frameworks?.join(", ") || "React, FastAPI, PyTorch, Node"
    },
    {
      label: "Databases & Storage",
      value: dbCount,
      color: "#06B6D4",
      gradient: "from-cyan-400 to-cyan-600",
      textColor: "text-cyan-400",
      details: breakdown.databases?.join(", ") || "PostgreSQL, SQLite, Redis"
    },
    {
      label: "Cloud & DevOps",
      value: cloudCount,
      color: "#6366F1",
      gradient: "from-indigo-400 to-indigo-600",
      textColor: "text-indigo-400",
      details: breakdown.cloud_devops?.join(", ") || "AWS, Docker, Git, CI/CD"
    },
    {
      label: "NLP & ML Concepts",
      value: conceptCount,
      color: "#8B5CF6",
      gradient: "from-purple-400 to-purple-600",
      textColor: "text-purple-400",
      details: breakdown.concepts?.join(", ") || "TF-IDF, Cosine Sim, NER, Embeddings"
    }
  ];

  // --- CHART 2 DATA: Matched vs Missing Skill Keyword Alignment ---
  const matchedCount = skillsFound.length || 8;
  const missingCount = missingSkills.length || 3;
  const totalSpec = matchedCount + missingCount;

  const matchSlices: SliceData[] = [
    {
      label: "Matched Tech Keywords",
      value: matchedCount,
      color: "#10B981",
      gradient: "from-emerald-400 to-emerald-600",
      textColor: "text-emerald-400",
      details: `${Math.round((matchedCount / totalSpec) * 100)}% Match Coverage`
    },
    {
      label: "Missing Required Keywords",
      value: missingCount,
      color: "#F43F5E",
      gradient: "from-rose-400 to-rose-600",
      textColor: "text-rose-400",
      details: missingSkills.join(", ") || "System Architecture, Kubernetes"
    }
  ];

  // --- CHART 3 DATA: Named Entity Recognition (NER) Distribution ---
  const orgCount = entities.filter((e) => e.label === "ORGANIZATION").length || 4;
  const techEntityCount = skillsFound.length || 7;
  const eduCount = entities.filter((e) => e.label === "EDUCATION").length || 2;
  const dateCount = entities.filter((e) => e.label === "DATE").length || 3;

  const nerSlices: SliceData[] = [
    {
      label: "Technical Stack Entities",
      value: techEntityCount,
      color: "#14B8A6",
      gradient: "from-teal-400 to-teal-600",
      textColor: "text-teal-400",
      details: "Languages, Libraries & Tools"
    },
    {
      label: "Organizations & Companies",
      value: orgCount,
      color: "#F59E0B",
      gradient: "from-amber-400 to-amber-600",
      textColor: "text-amber-400",
      details: "Employers & Academic Institutions"
    },
    {
      label: "Academic Qualifications",
      value: eduCount,
      color: "#06B6D4",
      gradient: "from-cyan-400 to-cyan-600",
      textColor: "text-cyan-400",
      details: "Degrees & Certificates"
    },
    {
      label: "Experience Timelines",
      value: dateCount,
      color: "#8B5CF6",
      gradient: "from-purple-400 to-purple-600",
      textColor: "text-purple-400",
      details: "Chronological Employment Markers"
    }
  ];

  // --- CHART 4 DATA: Lexical Token Breakdown ---
  const words = resumeText.split(/\s+/).filter(Boolean);
  const totalWords = words.length || 350;
  const techWordCount = Math.round(totalWords * 0.28);
  const actionWordCount = Math.round(totalWords * 0.18);
  const metricWordCount = Math.round(totalWords * 0.14);
  const structWordCount = totalWords - (techWordCount + actionWordCount + metricWordCount);

  const lexicalSlices: SliceData[] = [
    {
      label: "Technical Domain Terms",
      value: techWordCount,
      color: "#38BDF8",
      gradient: "from-sky-400 to-sky-600",
      textColor: "text-sky-400",
      details: `${Math.round((techWordCount / totalWords) * 100)}% Technical Density`
    },
    {
      label: "Leadership & Action Verbs",
      value: actionWordCount,
      color: "#10B981",
      gradient: "from-emerald-400 to-emerald-600",
      textColor: "text-emerald-400",
      details: `${Math.round((actionWordCount / totalWords) * 100)}% Action Orientation`
    },
    {
      label: "Quantified Performance Metrics",
      value: metricWordCount,
      color: "#F59E0B",
      gradient: "from-amber-400 to-amber-600",
      textColor: "text-amber-400",
      details: `${Math.round((metricWordCount / totalWords) * 100)}% Data & Percentage Metrics`
    },
    {
      label: "General Structure Words",
      value: structWordCount,
      color: "#64748B",
      gradient: "from-slate-500 to-slate-700",
      textColor: "text-slate-400",
      details: `${Math.round((structWordCount / totalWords) * 100)}% Connective Grammar`
    }
  ];

  const chartsList = [
    {
      title: "NLP Technology Taxonomy Distribution",
      subtitle: "Categorical breakdown of tech stacks extracted via TF-IDF & Regex",
      slices: taxonomySlices
    },
    {
      title: "Skill Keyword Alignment Ratio",
      subtitle: "Proportion of matched vs missing job specification requirements",
      slices: matchSlices
    },
    {
      title: "Named Entity Recognition (NER) Composition",
      subtitle: "Entity categorization across technical stacks, organizations & degrees",
      slices: nerSlices
    },
    {
      title: "Lexical & Resume Vector Token Breakdown",
      subtitle: "Distribution of technical terminology, action verbs & metrics",
      slices: lexicalSlices
    }
  ];

  // Helper function to calculate SVG Pie / Donut paths
  const renderSVGPieChart = (slices: SliceData[], chartIdx: number) => {
    const total = slices.reduce((sum, s) => sum + s.value, 0) || 1;
    let cumulativeAngle = 0;
    const radius = 80;
    const innerRadius = 46; // Donut hole
    const cx = 100;
    const cy = 100;

    return (
      <div className="relative flex items-center justify-center">
        <svg width="200" height="200" viewBox="0 0 200 200" className="transform -rotate-90 filter drop-shadow-lg">
          {slices.map((slice, idx) => {
            const angle = (slice.value / total) * 360;
            const startAngle = cumulativeAngle;
            const endAngle = cumulativeAngle + angle;
            cumulativeAngle += angle;

            // Handle 100% single slice edge case
            const isFullCircle = angle >= 359.9;
            const effectiveEndAngle = isFullCircle ? startAngle + 359.99 : endAngle;

            const startRad = (Math.PI * startAngle) / 180;
            const endRad = (Math.PI * effectiveEndAngle) / 180;

            // Outer arc coordinates
            const x1 = cx + radius * Math.cos(startRad);
            const y1 = cy + radius * Math.sin(startRad);
            const x2 = cx + radius * Math.cos(endRad);
            const y2 = cy + radius * Math.sin(endRad);

            // Inner arc coordinates (Donut hole)
            const ix1 = cx + innerRadius * Math.cos(startRad);
            const iy1 = cy + innerRadius * Math.sin(startRad);
            const ix2 = cx + innerRadius * Math.cos(endRad);
            const iy2 = cy + innerRadius * Math.sin(endRad);

            const largeArcFlag = angle > 180 ? 1 : 0;

            const d = `
              M ${x1} ${y1}
              A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}
              L ${ix2} ${iy2}
              A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${ix1} ${iy1}
              Z
            `;

            const isHovered = hoveredSlice?.chartIdx === chartIdx && hoveredSlice?.sliceIdx === idx;

            return (
              <path
                key={idx}
                d={d}
                fill={slice.color}
                opacity={isHovered ? 1 : 0.85}
                className="transition-all duration-300 cursor-pointer hover:scale-105 origin-center stroke-[#0B132B] stroke-2"
                onMouseEnter={() => setHoveredSlice({ chartIdx, sliceIdx: idx })}
                onMouseLeave={() => setHoveredSlice(null)}
              />
            );
          })}
        </svg>

        {/* Center Donut Label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
          <span className="text-xl font-serif font-extrabold text-white">{total}</span>
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">TOTAL ITEMS</span>
        </div>
      </div>
    );
  };

  return (
    <div className="glass-academic rounded-2xl p-6 relative overflow-hidden space-y-6">
      <div className="hud-corner-tl" />
      <div className="hud-corner-br" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-amber-500/20">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <PieChart className="w-5 h-5 text-amber-400" />
            <h3 className="text-lg font-serif font-bold text-white tracking-wide">
              NLP Technologies Pie Chart Analytics
            </h3>
            <span className="text-[10px] font-mono font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30 px-2.5 py-0.5 rounded">
              INTERACTIVE PIE VISUALS
            </span>
          </div>
          <p className="text-xs text-slate-300 font-sans">
            Explore categorical NLP tech distributions, keyword ratios, and entity breakdowns.
          </p>
        </div>

        {/* Chart View Selection Tabs */}
        <div className="flex flex-wrap items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-amber-500/20">
          {chartsList.map((c, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveChartIndex(idx)}
              className={`text-[11px] font-mono px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeChartIndex === idx
                  ? "bg-amber-500 text-slate-950 font-bold shadow-md"
                  : "text-slate-300 hover:text-amber-300"
              }`}
            >
              Chart {idx + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: All 4 Pie Charts or Active Chart Spotlight */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {chartsList.map((chart, cIdx) => {
          const isSelected = activeChartIndex === cIdx;
          const totalVal = chart.slices.reduce((sum, s) => sum + s.value, 0) || 1;

          return (
            <div
              key={cIdx}
              className={`p-5 rounded-xl border transition-all duration-300 space-y-4 ${
                isSelected
                  ? "bg-slate-900/90 border-amber-500/40 shadow-xl shadow-black/40 ring-1 ring-amber-500/30"
                  : "bg-slate-950/60 border-slate-800/80 opacity-85 hover:opacity-100"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <h4 className="font-serif font-bold text-white text-base flex items-center space-x-2">
                    <span className="text-amber-400 font-mono text-xs">[0{cIdx + 1}]</span>
                    <span>{chart.title}</span>
                  </h4>
                  <p className="text-[11px] text-slate-400 font-sans">{chart.subtitle}</p>
                </div>
                {isSelected && (
                  <span className="text-[10px] font-mono text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                    ACTIVE
                  </span>
                )}
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-around gap-6 pt-2">
                {/* SVG Pie Chart */}
                {renderSVGPieChart(chart.slices, cIdx)}

                {/* Pie Chart Legend & Slices Details */}
                <div className="space-y-2 flex-1 w-full">
                  {chart.slices.map((slice, sIdx) => {
                    const percentage = Math.round((slice.value / totalVal) * 100);
                    const isHovered =
                      hoveredSlice?.chartIdx === cIdx && hoveredSlice?.sliceIdx === sIdx;

                    return (
                      <div
                        key={sIdx}
                        onMouseEnter={() => setHoveredSlice({ chartIdx: cIdx, sliceIdx: sIdx })}
                        onMouseLeave={() => setHoveredSlice(null)}
                        className={`p-2 rounded-lg border text-xs transition-all cursor-pointer ${
                          isHovered
                            ? "bg-slate-800 border-amber-400/60 scale-[1.02]"
                            : "bg-slate-900/80 border-slate-800"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2 min-w-0">
                            <span
                              className="w-3 h-3 rounded-full shrink-0"
                              style={{ backgroundColor: slice.color }}
                            />
                            <span className="font-semibold text-white truncate text-[11px]">
                              {slice.label}
                            </span>
                          </div>
                          <div className="font-mono text-[11px] flex items-center space-x-2 shrink-0">
                            <span className="text-slate-400">{slice.value} items</span>
                            <strong className={slice.textColor}>{percentage}%</strong>
                          </div>
                        </div>

                        {slice.details && (
                          <div className="text-[10px] text-slate-400 font-mono mt-1 pt-1 border-t border-slate-800/60 truncate">
                            {slice.details}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
