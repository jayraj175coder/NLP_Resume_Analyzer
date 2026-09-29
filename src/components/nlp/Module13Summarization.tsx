import React, { useState, useMemo } from "react";
import {
  FileText,
  Sparkles,
  Sliders,
  BarChart3,
  CheckCircle2,
  Layers,
  Copy,
  Check
} from "lucide-react";
import { summarizeResume } from "../../nlp/summarizer-engine";

interface Props {
  resumeText: string;
}

export default function Module13Summarization({ resumeText }: Props) {
  const [text, setText] = useState(
    resumeText ||
      `Senior Software Engineer with 6+ years of experience architecting high-throughput distributed backend systems. Engineered and deployed scalable microservices using React, TypeScript, Python, and PostgreSQL. Spearheaded API performance optimization, reducing latency by 42% and accelerating delivery pipelines across cloud infrastructure. Led engineering team through 4 major enterprise product releases with zero critical downtime.`
  );
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    return summarizeResume(text);
  }, [text]);

  const handleCopy = (t: string) => {
    navigator.clipboard.writeText(t);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6" id="module-summarization-container">
      {/* Header */}
      <div className="bg-[#04241a]/80 border border-emerald-500/20 rounded-xl p-5 backdrop-blur-md">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 text-xs font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded">
                MODULE 13 // AUTOMATIC SUMMARIZATION
              </span>
              <span className="text-xs text-gray-400 font-mono">EXTRACTIVE_TEXTRANK_&_ABSTRACTIVE</span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              Resume Summarization: Extractive TextRank & Abstractive Synthesis
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 px-3 py-1.5 border border-emerald-500/30 rounded-lg">
              Compression Ratio: {(result.extractiveSummary.compressionRatio * 100).toFixed(0)}%
            </span>
          </div>
        </div>

        <p className="text-xs text-gray-300 leading-relaxed mb-3">
          Generates executive summaries via two paradigms: graph-based <strong>Extractive TextRank</strong> (PageRank centrality over sentence similarity graphs) and <strong>Abstractive Synthesis</strong>, validated against <strong>ROUGE-1, ROUGE-2, and ROUGE-L</strong> metrics.
        </p>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={3}
          className="w-full bg-[#02130d] border border-emerald-500/30 rounded-lg p-3 text-xs text-gray-200 font-mono focus:outline-none focus:border-emerald-400 resize-none"
        />
      </div>

      {/* ROUGE Scores Bento */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#04241a]/60 border border-emerald-500/20 rounded-xl p-4 text-center">
          <span className="text-xs text-gray-400 font-mono block">ROUGE-1 F1 (UNIGRAM OVERLAP)</span>
          <div className="text-2xl font-bold text-emerald-400 font-mono mt-1">
            {(result.rougeScores.rouge1.f1 * 100).toFixed(1)}%
          </div>
          <span className="text-[10px] text-gray-500 font-mono">
            P: {result.rougeScores.rouge1.precision} | R: {result.rougeScores.rouge1.recall}
          </span>
        </div>
        <div className="bg-[#04241a]/60 border border-emerald-500/20 rounded-xl p-4 text-center">
          <span className="text-xs text-gray-400 font-mono block">ROUGE-2 F1 (BIGRAM OVERLAP)</span>
          <div className="text-2xl font-bold text-[#FFD54A] font-mono mt-1">
            {(result.rougeScores.rouge2.f1 * 100).toFixed(1)}%
          </div>
          <span className="text-[10px] text-gray-500 font-mono">
            P: {result.rougeScores.rouge2.precision} | R: {result.rougeScores.rouge2.recall}
          </span>
        </div>
        <div className="bg-[#04241a]/60 border border-emerald-500/20 rounded-xl p-4 text-center">
          <span className="text-xs text-gray-400 font-mono block">ROUGE-L F1 (LONGEST COMMON SUBSEQ)</span>
          <div className="text-2xl font-bold text-cyan-400 font-mono mt-1">
            {(result.rougeScores.rougeL.f1 * 100).toFixed(1)}%
          </div>
          <span className="text-[10px] text-gray-500 font-mono">
            P: {result.rougeScores.rougeL.precision} | R: {result.rougeScores.rougeL.recall}
          </span>
        </div>
      </div>

      {/* Dual Summary Displays */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Extractive Summary */}
        <div className="bg-[#04241a]/70 border border-emerald-500/20 rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-400" />
              Extractive TextRank Selected Sentences
            </h3>
            <span className="text-xs text-gray-400 font-mono">Graph Centrality</span>
          </div>

          <div className="space-y-2">
            {result.extractiveSummary.sentences
              .filter((s) => s.included)
              .map((s, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-[#02130d] border border-emerald-500/20 rounded-lg text-xs font-mono text-gray-200 leading-relaxed"
                >
                  <div className="flex items-center justify-between text-[10px] text-emerald-400 font-bold mb-1">
                    <span>RANK #{s.rank}</span>
                    <span>Centrality Score: {s.score}</span>
                  </div>
                  "{s.text}"
                </div>
              ))}
          </div>
        </div>

        {/* Abstractive Summary */}
        <div className="bg-[#04241a]/70 border border-emerald-500/20 rounded-xl p-5 space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#FFD54A]" />
                Abstractive Synthesis (Neural Recruiter Overview)
              </h3>
              <button
                onClick={() => handleCopy(result.abstractiveSummary.text)}
                className="text-xs text-gray-400 hover:text-white flex items-center gap-1 font-mono"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? "Copied" : "Copy"}
              </button>
            </div>

            <p className="text-xs font-mono text-gray-200 bg-[#02130d] border border-emerald-500/30 p-3.5 rounded-lg leading-relaxed mb-3">
              {result.abstractiveSummary.text}
            </p>

            <span className="text-[10px] text-gray-400 font-mono block mb-1.5">KEY HIGHLIGHT BULLETS:</span>
            <div className="space-y-1.5">
              {result.abstractiveSummary.keyHighlights.map((h, i) => (
                <div key={i} className="flex items-start gap-2 text-xs font-mono text-emerald-300">
                  <span className="text-[#FFD54A]">▸</span>
                  <span>{h}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
