import React, { useState, useMemo } from "react";
import {
  BookOpen,
  Layers,
  Sparkles,
  BarChart3,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Clock
} from "lucide-react";
import { analyzeLinguistics } from "../../nlp/linguistics";

interface Props {
  resumeText: string;
}

export default function Module4Linguistics({ resumeText }: Props) {
  const [text, setText] = useState(
    resumeText ||
      `Senior Software Engineer with 6+ years of experience architecting high-throughput distributed backend systems. Engineered and deployed scalable microservices using React, TypeScript, Python, and PostgreSQL. Spearheaded API performance optimization, reducing latency by 42% and accelerating delivery pipelines across cloud infrastructure.`
  );

  const result = useMemo(() => {
    return analyzeLinguistics(text);
  }, [text]);

  return (
    <div className="space-y-6" id="module-linguistics-container">
      {/* Header */}
      <div className="bg-[#04241a]/80 border border-emerald-500/20 rounded-xl p-5 backdrop-blur-md">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 text-xs font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded">
                MODULE 04 // LINGUISTIC ANALYSIS
              </span>
              <span className="text-xs text-gray-400 font-mono">MORPHO_SYNTACTIC_ANALYTICS</span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              Linguistic Analysis: Morphology, Lexicon & Readability
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-cyan-400 bg-cyan-950/60 px-3 py-1.5 border border-cyan-500/30 rounded-lg flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              Est. Reading: {result.lexicon.readingTimeMinutes} min
            </span>
          </div>
        </div>

        <p className="text-xs text-gray-300 leading-relaxed mb-3">
          Performs deep computational linguistics: <strong>Inflectional vs Derivational Morphemes</strong>, <strong>Lexical Diversity (Type-Token Ratio TTR & Hapax Legomena)</strong>, <strong>Syntactic Clause Complexity</strong>, and <strong>Standard Readability Formulas</strong> (Flesch Reading Ease, Flesch-Kincaid, Gunning Fog, Coleman-Liau).
        </p>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={3}
          className="w-full bg-[#02130d] border border-emerald-500/30 rounded-lg p-3 text-xs text-gray-200 font-mono focus:outline-none focus:border-emerald-400 resize-none"
        />
      </div>

      {/* Readability & Lexicon Metrics Bento */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-[#04241a]/60 border border-emerald-500/20 rounded-xl p-3.5 text-center">
          <span className="text-[10px] text-gray-400 font-mono block">TYPE-TOKEN RATIO (TTR)</span>
          <div className="text-xl font-bold text-emerald-400 font-mono mt-1">{result.lexicon.typeTokenRatio}</div>
          <span className="text-[10px] text-gray-500">Lexical Richness</span>
        </div>
        <div className="bg-[#04241a]/60 border border-emerald-500/20 rounded-xl p-3.5 text-center">
          <span className="text-[10px] text-gray-400 font-mono block">FLESCH READING EASE</span>
          <div className="text-xl font-bold text-[#FFD54A] font-mono mt-1">{result.lexicon.fleschReadingEase}</div>
          <span className="text-[10px] text-gray-500">Standard / Professional</span>
        </div>
        <div className="bg-[#04241a]/60 border border-emerald-500/20 rounded-xl p-3.5 text-center">
          <span className="text-[10px] text-gray-400 font-mono block">FK GRADE LEVEL</span>
          <div className="text-xl font-bold text-cyan-400 font-mono mt-1">Grade {result.lexicon.fleschKincaidGrade}</div>
          <span className="text-[10px] text-gray-500">Education Standard</span>
        </div>
        <div className="bg-[#04241a]/60 border border-emerald-500/20 rounded-xl p-3.5 text-center">
          <span className="text-[10px] text-gray-400 font-mono block">GUNNING FOG INDEX</span>
          <div className="text-xl font-bold text-white font-mono mt-1">{result.lexicon.gunningFogIndex}</div>
          <span className="text-[10px] text-gray-500">Syntactic Density</span>
        </div>
        <div className="bg-[#04241a]/60 border border-emerald-500/20 rounded-xl p-3.5 text-center">
          <span className="text-[10px] text-gray-400 font-mono block">COLEMAN-LIAU</span>
          <div className="text-xl font-bold text-purple-400 font-mono mt-1">{result.lexicon.colemanLiauIndex}</div>
          <span className="text-[10px] text-gray-500">Letter/Sentence Math</span>
        </div>
        <div className="bg-[#04241a]/60 border border-emerald-500/20 rounded-xl p-3.5 text-center">
          <span className="text-[10px] text-gray-400 font-mono block">HAPAX LEGOMENA</span>
          <div className="text-xl font-bold text-emerald-300 font-mono mt-1">{result.lexicon.hapaxLegomena}</div>
          <span className="text-[10px] text-gray-500">Single-Occurrence</span>
        </div>
      </div>

      {/* Morphology & Verbs Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Morphology Affix Breakdown */}
        <div className="bg-[#04241a]/70 border border-emerald-500/20 rounded-xl p-4 space-y-3">
          <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            Morphological Affix Decomposition
          </h3>
          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {result.morphology.slice(0, 12).map((m, i) => (
              <div key={i} className="p-2.5 bg-[#02130d] border border-emerald-500/10 rounded flex items-center justify-between text-xs font-mono">
                <span className="text-white font-bold">{m.token}</span>
                <div className="flex items-center gap-2">
                  {m.prefix && <span className="text-purple-400 bg-purple-950/40 px-1.5 py-0.5 rounded">Pref: {m.prefix}-</span>}
                  <span className="text-emerald-400 bg-emerald-950/40 px-1.5 py-0.5 rounded">Root: {m.root}</span>
                  {m.suffix && <span className="text-cyan-400 bg-cyan-950/40 px-1.5 py-0.5 rounded">Suff: -{m.suffix}</span>}
                  <span className="text-[10px] text-gray-400 font-semibold uppercase">[{m.type}]</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Verbs & Metrics */}
        <div className="bg-[#04241a]/70 border border-emerald-500/20 rounded-xl p-4 space-y-3">
          <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2">
            <Zap className="w-4 h-4 text-[#FFD54A]" />
            Power Action Verbs & Quantified Metrics
          </h3>
          <div className="space-y-3">
            <div>
              <span className="text-xs text-gray-400 font-mono block mb-1.5">DETECTED HIGH-IMPACT VERBS:</span>
              <div className="flex flex-wrap gap-1.5">
                {result.semantics.actionVerbsFound.map((v, i) => (
                  <span key={i} className="px-2 py-0.5 text-xs font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded">
                    {v}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <span className="text-xs text-gray-400 font-mono block mb-1.5">QUANTIFIED METRICS DETECTED:</span>
              <div className="flex flex-wrap gap-1.5">
                {result.semantics.quantifiedMetrics.map((m, i) => (
                  <span key={i} className="px-2 py-0.5 text-xs font-mono bg-amber-500/20 text-[#FFD54A] border border-amber-500/40 rounded font-bold">
                    {m}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
