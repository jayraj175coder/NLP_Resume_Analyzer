import React, { useState, useMemo } from "react";
import {
  Activity,
  Sliders,
  Sparkles,
  RefreshCw,
  Calculator,
  Layers,
  ArrowRight
} from "lucide-react";
import { computeLanguageModel } from "../../nlp/language-models";

interface Props {
  corpusText: string;
}

export default function Module5LanguageModels({ corpusText }: Props) {
  const [corpus, setCorpus] = useState(
    corpusText ||
      `Software engineer building scalable web applications with React, TypeScript, Python, and PostgreSQL. Deployed microservices with Docker on AWS.`
  );
  const [testSentence, setTestSentence] = useState("building scalable web applications with React");
  const [modelType, setModelType] = useState<"unigram" | "bigram" | "trigram">("bigram");
  const [smoothing, setSmoothing] = useState<"none" | "laplace" | "good_turing" | "kneser_ney">("laplace");

  const result = useMemo(() => {
    return computeLanguageModel(corpus, testSentence, modelType, smoothing);
  }, [corpus, testSentence, modelType, smoothing]);

  return (
    <div className="space-y-6" id="module-lms-container">
      {/* Header */}
      <div className="bg-[#04241a]/80 border border-emerald-500/20 rounded-xl p-5 backdrop-blur-md">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 text-xs font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded">
                MODULE 05 // PROBABILISTIC MODELS
              </span>
              <span className="text-xs text-gray-400 font-mono">STATISTICAL_LANGUAGE_MODELING</span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              Statistical N-Gram Language Models, Perplexity & Smoothing
            </h2>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={modelType}
              onChange={(e) => setModelType(e.target.value as any)}
              className="bg-[#02130d] border border-emerald-500/30 text-emerald-400 text-xs font-mono px-2.5 py-1.5 rounded"
            >
              <option value="unigram">Unigram Model: P(w)</option>
              <option value="bigram">Bigram Model: P(w_i | w_i-1)</option>
              <option value="trigram">Trigram Model: P(w_i | w_i-2, w_i-1)</option>
            </select>
            <select
              value={smoothing}
              onChange={(e) => setSmoothing(e.target.value as any)}
              className="bg-[#02130d] border border-emerald-500/30 text-[#FFD54A] text-xs font-mono px-2.5 py-1.5 rounded"
            >
              <option value="none">No Smoothing (MLE - Zero Prob Risk)</option>
              <option value="laplace">Laplace (+1 Additive Smoothing)</option>
              <option value="good_turing">Good-Turing Frequency Estimation</option>
              <option value="kneser_ney">Kneser-Ney Continuation Backoff</option>
            </select>
          </div>
        </div>

        <p className="text-xs text-gray-300 leading-relaxed mb-4">
          Calculates joint sentence likelihood P(w1, ..., wn) = product(P(wi|context)) and evaluates sequence fluency via <strong>Perplexity</strong> PP(W) = exp(-1/N * sum(ln P)). Includes <strong>Laplace (+1)</strong>, <strong>Good-Turing</strong>, and <strong>Kneser-Ney</strong> smoothing to resolve sparse out-of-vocabulary zeros.
        </p>

        {/* Input Text controls */}
        <div className="space-y-2">
          <label className="text-xs font-mono text-emerald-400 font-semibold">EVALUATION TEST SENTENCE</label>
          <input
            type="text"
            value={testSentence}
            onChange={(e) => setTestSentence(e.target.value)}
            className="w-full bg-[#02130d] border border-emerald-500/30 rounded-lg p-2.5 text-xs text-white font-mono focus:outline-none focus:border-emerald-400"
          />
        </div>
      </div>

      {/* Probability & Perplexity Bento Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#04241a]/60 border border-emerald-500/20 rounded-xl p-4 text-center">
          <span className="text-xs text-gray-400 font-mono block">SENTENCE PROBABILITY P(W)</span>
          <div className="text-xl font-bold text-emerald-400 font-mono mt-1">{result.sentenceProbability}</div>
          <span className="text-[10px] text-gray-500 font-mono">Joint Likelihood</span>
        </div>
        <div className="bg-[#04241a]/60 border border-emerald-500/20 rounded-xl p-4 text-center">
          <span className="text-xs text-gray-400 font-mono block">LOG LIKELIHOOD ln P(W)</span>
          <div className="text-xl font-bold text-[#FFD54A] font-mono mt-1">{result.logProbability}</div>
          <span className="text-[10px] text-gray-500 font-mono">Log Probability Sum</span>
        </div>
        <div className="bg-[#04241a]/60 border border-emerald-500/20 rounded-xl p-4 text-center">
          <span className="text-xs text-gray-400 font-mono block">PERPLEXITY PP(W)</span>
          <div className="text-xl font-bold text-cyan-400 font-mono mt-1">{result.perplexity}</div>
          <span className="text-[10px] text-gray-500 font-mono">Lower = More Fluent</span>
        </div>
      </div>

      {/* Step-by-Step Transition Probabilities */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-[#04241a]/70 border border-emerald-500/20 rounded-xl p-4 space-y-3">
          <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2">
            <Calculator className="w-4 h-4 text-emerald-400" />
            Conditional N-Gram Chain Probabilities
          </h3>
          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {result.nGramProbabilities.map((item, idx) => (
              <div key={idx} className="p-2.5 bg-[#02130d] border border-emerald-500/10 rounded flex items-center justify-between text-xs font-mono">
                <span className="text-white font-medium">{item.nGram}</span>
                <div className="flex items-center gap-2">
                  <span className="text-gray-400">Freq: {item.count}</span>
                  <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 font-bold rounded">
                    P = {item.conditionalProb}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Next Word Prediction Generator */}
        <div className="bg-[#04241a]/70 border border-emerald-500/20 rounded-xl p-4 space-y-3">
          <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#FFD54A]" />
            Statistical Next-Word Distribution Predictions
          </h3>
          <p className="text-xs text-gray-400 font-mono">Highest likelihood continuation based on corpus frequencies</p>

          <div className="space-y-2">
            {result.wordPredictions.map((pred, i) => (
              <div key={i} className="p-2.5 bg-[#02130d] border border-emerald-500/10 rounded flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-1.5">
                  <span className="text-gray-400">"{pred.prefix}"</span>
                  <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-white font-bold text-sm">"{pred.candidate}"</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-20 bg-emerald-950 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-400 h-full" style={{ width: `${pred.probability * 100}%` }} />
                  </div>
                  <span className="text-emerald-400 font-bold">{(pred.probability * 100).toFixed(1)}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
