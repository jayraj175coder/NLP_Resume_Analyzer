import React, { useMemo } from "react";
import {
  BarChart3,
  CheckCircle2,
  Layers,
  Sparkles,
  Sliders,
  Target,
  Trophy,
  Activity,
  Calculator
} from "lucide-react";
import { computeEvaluationMetrics } from "../../nlp/evaluation-metrics";

export default function Module17EvaluationMetrics() {
  const result = useMemo(() => {
    return computeEvaluationMetrics();
  }, []);

  return (
    <div className="space-y-6" id="module-evaluation-container">
      {/* Header */}
      <div className="bg-[#04241a]/80 border border-emerald-500/20 rounded-xl p-5 backdrop-blur-md">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 text-xs font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded">
                MODULE 17 // BENCHMARKS & METRICS
              </span>
              <span className="text-xs text-gray-400 font-mono">NLP_STATISTICAL_EVALUATION</span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              NLP Evaluation Metrics: Confusion Matrix, F1, ROUGE, BLEU & UAS
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 px-3 py-1.5 border border-emerald-500/30 rounded-lg font-bold">
              Overall Macro F1: {result.metrics.macroF1}
            </span>
          </div>
        </div>

        <p className="text-xs text-gray-300 leading-relaxed">
          Comprehensive evaluation framework across classification (<strong>Precision, Recall, F1, Confusion Matrix</strong>), generative language models (<strong>ROUGE-1/2/L, BLEU-1/4, Perplexity</strong>), and dependency parsers (<strong>UAS & LAS</strong>).
        </p>
      </div>

      {/* Core Classification Metrics Bento */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-[#04241a]/60 border border-emerald-500/20 rounded-xl p-4 text-center">
          <span className="text-xs text-gray-400 font-mono block">OVERALL ACCURACY</span>
          <div className="text-2xl font-bold text-emerald-400 font-mono mt-1">{(result.metrics.accuracy * 100).toFixed(1)}%</div>
          <span className="text-[10px] text-gray-500 font-mono">Total True Positives / N</span>
        </div>
        <div className="bg-[#04241a]/60 border border-emerald-500/20 rounded-xl p-4 text-center">
          <span className="text-xs text-gray-400 font-mono block">MACRO PRECISION</span>
          <div className="text-2xl font-bold text-[#FFD54A] font-mono mt-1">{(result.metrics.precision * 100).toFixed(1)}%</div>
          <span className="text-[10px] text-gray-500 font-mono">TP / (TP + FP)</span>
        </div>
        <div className="bg-[#04241a]/60 border border-emerald-500/20 rounded-xl p-4 text-center">
          <span className="text-xs text-gray-400 font-mono block">MACRO RECALL</span>
          <div className="text-2xl font-bold text-cyan-400 font-mono mt-1">{(result.metrics.recall * 100).toFixed(1)}%</div>
          <span className="text-[10px] text-gray-500 font-mono">TP / (TP + FN)</span>
        </div>
        <div className="bg-[#04241a]/60 border border-emerald-500/20 rounded-xl p-4 text-center">
          <span className="text-xs text-gray-400 font-mono block">WEIGHTED F1-SCORE</span>
          <div className="text-2xl font-bold text-emerald-300 font-mono mt-1">{(result.metrics.weightedF1 * 100).toFixed(1)}%</div>
          <span className="text-[10px] text-gray-500 font-mono">Support-Weighted Harmonic Mean</span>
        </div>
      </div>

      {/* 5x5 Multi-Class Confusion Matrix */}
      <div className="bg-[#04241a]/70 border border-emerald-500/20 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2">
            <Target className="w-4 h-4 text-emerald-400" />
            5-Class Confusion Matrix Heatmap (Career Track Predictions)
          </h3>
          <span className="text-xs text-gray-400 font-mono">Diagonal = True Classifications</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-center text-xs font-mono">
            <thead>
              <tr className="border-b border-emerald-500/20 text-gray-400">
                <th className="py-2 px-3 text-left">ACTUAL \ PREDICTED</th>
                {result.confusionMatrix.labels.map((lbl) => (
                  <th key={lbl} className="py-2 px-3 text-emerald-300">{lbl}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-500/10">
              {result.confusionMatrix.matrix.map((row, rIdx) => (
                <tr key={rIdx} className="hover:bg-emerald-950/20">
                  <td className="py-2 px-3 text-left text-white font-bold">
                    {result.confusionMatrix.labels[rIdx]}
                  </td>
                  {row.map((cell, cIdx) => {
                    const isDiagonal = rIdx === cIdx;
                    return (
                      <td
                        key={cIdx}
                        className={`py-2 px-3 font-mono font-bold ${
                          isDiagonal
                            ? "bg-emerald-500/20 text-[#FFD54A] border border-emerald-400/30"
                            : cell > 0
                            ? "text-rose-400 bg-rose-950/20"
                            : "text-gray-600"
                        }`}
                      >
                        {cell}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Generation & Parsing Benchmarks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* NLG Metrics */}
        <div className="bg-[#04241a]/70 border border-emerald-500/20 rounded-xl p-5 space-y-3">
          <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#FFD54A]" />
            Natural Language Generation (NLG) Scores
          </h3>

          <div className="space-y-2">
            <div className="flex items-center justify-between p-2.5 bg-[#02130d] border border-emerald-500/10 rounded-lg text-xs font-mono">
              <span className="text-gray-300">ROUGE-1 (Unigram Overlap):</span>
              <span className="font-bold text-emerald-400">{result.generationMetrics.rouge1}</span>
            </div>
            <div className="flex items-center justify-between p-2.5 bg-[#02130d] border border-emerald-500/10 rounded-lg text-xs font-mono">
              <span className="text-gray-300">ROUGE-2 (Bigram Overlap):</span>
              <span className="font-bold text-emerald-400">{result.generationMetrics.rouge2}</span>
            </div>
            <div className="flex items-center justify-between p-2.5 bg-[#02130d] border border-emerald-500/10 rounded-lg text-xs font-mono">
              <span className="text-gray-300">ROUGE-L (Longest Common Subsequence):</span>
              <span className="font-bold text-emerald-400">{result.generationMetrics.rougeL}</span>
            </div>
            <div className="flex items-center justify-between p-2.5 bg-[#02130d] border border-emerald-500/10 rounded-lg text-xs font-mono">
              <span className="text-gray-300">BLEU-4 Score:</span>
              <span className="font-bold text-[#FFD54A]">{result.generationMetrics.bleu4}</span>
            </div>
            <div className="flex items-center justify-between p-2.5 bg-[#02130d] border border-emerald-500/10 rounded-lg text-xs font-mono">
              <span className="text-gray-300">Language Model Perplexity:</span>
              <span className="font-bold text-cyan-400">{result.generationMetrics.perplexity}</span>
            </div>
          </div>
        </div>

        {/* Parsing Benchmarks */}
        <div className="bg-[#04241a]/70 border border-emerald-500/20 rounded-xl p-5 space-y-3">
          <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2">
            <Calculator className="w-4 h-4 text-cyan-400" />
            Syntactic Dependency Parsing Accuracy
          </h3>

          <div className="space-y-4 pt-2">
            <div>
              <div className="flex items-center justify-between text-xs font-mono mb-1">
                <span className="text-gray-300">Unlabeled Attachment Score (UAS):</span>
                <span className="font-bold text-emerald-400">{(result.parsingMetrics.uas * 100).toFixed(1)}%</span>
              </div>
              <div className="w-full bg-[#02130d] h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-400 h-full" style={{ width: `${result.parsingMetrics.uas * 100}%` }} />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs font-mono mb-1">
                <span className="text-gray-300">Labeled Attachment Score (LAS):</span>
                <span className="font-bold text-[#FFD54A]">{(result.parsingMetrics.las * 100).toFixed(1)}%</span>
              </div>
              <div className="w-full bg-[#02130d] h-2 rounded-full overflow-hidden">
                <div className="bg-[#FFD54A] h-full" style={{ width: `${result.parsingMetrics.las * 100}%` }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
