import React, { useState, useMemo } from "react";
import {
  Layers,
  Sparkles,
  Sliders,
  BarChart3,
  PieChart,
  RefreshCw
} from "lucide-react";
import { computeTopicModeling } from "../../nlp/topic-modeling";

interface Props {
  resumeText: string;
}

export default function Module7TopicModeling({ resumeText }: Props) {
  const [text, setText] = useState(
    resumeText ||
      `Software Engineer with full stack expertise building web apps with React, TypeScript, Tailwind, and Next.js. Developed backend APIs using Python, FastAPI, Express, PostgreSQL, and Redis. Deployed cloud microservices with Docker, Kubernetes, and CI/CD pipelines on AWS. Implemented NLP tokenizers, embeddings, and machine learning models with PyTorch.`
  );
  const [method, setMethod] = useState<"LDA" | "NMF">("LDA");
  const [numTopics, setNumTopics] = useState(4);

  const result = useMemo(() => {
    return computeTopicModeling(text, method, numTopics);
  }, [text, method, numTopics]);

  return (
    <div className="space-y-6" id="module-topic-modeling-container">
      {/* Header */}
      <div className="bg-[#04241a]/80 border border-emerald-500/20 rounded-xl p-5 backdrop-blur-md">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 text-xs font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded">
                MODULE 07 // UNSUPERVISED DISCOVERY
              </span>
              <span className="text-xs text-gray-400 font-mono">LATENT_DIRICHLET_ALLOCATION</span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              Topic Modeling: LDA & Non-Negative Matrix Factorization (NMF)
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value as any)}
              className="bg-[#02130d] border border-emerald-500/30 text-emerald-400 text-xs font-mono px-3 py-1.5 rounded-lg"
            >
              <option value="LDA">LDA (Latent Dirichlet Allocation - Gibbs Sampling)</option>
              <option value="NMF">NMF (Non-Negative Matrix Factorization)</option>
            </select>
          </div>
        </div>

        <p className="text-xs text-gray-300 leading-relaxed mb-3">
          Uncovers latent thematic structures and soft clustering weights across documents using generative Dirichlet distributions (theta ~ Dir(alpha), beta ~ Dir(eta)) and measures semantic interpretability via <strong>Topic Coherence (Cv)</strong>.
        </p>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={3}
          className="w-full bg-[#02130d] border border-emerald-500/30 rounded-lg p-3 text-xs text-gray-200 font-mono focus:outline-none focus:border-emerald-400 resize-none"
        />
      </div>

      {/* Coherence & Hyperparameter Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#04241a]/60 border border-emerald-500/20 rounded-xl p-4 text-center">
          <span className="text-xs text-gray-400 font-mono block">TOPIC COHERENCE SCORE (Cv)</span>
          <div className="text-2xl font-bold text-emerald-400 font-mono mt-1">{result.coherenceScore}</div>
          <span className="text-[10px] text-gray-500 font-mono">Optimal Range: 0.50 - 0.85</span>
        </div>
        <div className="bg-[#04241a]/60 border border-emerald-500/20 rounded-xl p-4 text-center">
          <span className="text-xs text-gray-400 font-mono block">DIRICHLET PRIOR ALPHA (α)</span>
          <div className="text-2xl font-bold text-[#FFD54A] font-mono mt-1">{result.alphaDirichlet}</div>
          <span className="text-[10px] text-gray-500 font-mono">Document-Topic Sparsity</span>
        </div>
        <div className="bg-[#04241a]/60 border border-emerald-500/20 rounded-xl p-4 text-center">
          <span className="text-xs text-gray-400 font-mono block">DIRICHLET PRIOR BETA (β)</span>
          <div className="text-2xl font-bold text-cyan-400 font-mono mt-1">{result.betaDirichlet}</div>
          <span className="text-[10px] text-gray-500 font-mono">Topic-Word Sparsity</span>
        </div>
      </div>

      {/* Topic Distribution Bubbles & Keywords Bento */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {result.topics.map((t) => (
          <div
            key={t.topicId}
            className="bg-[#04241a]/70 border border-emerald-500/20 rounded-xl p-5 space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: t.color }} />
                <h3 className="text-sm font-bold text-white font-mono">{t.name}</h3>
              </div>
              <span className="px-2.5 py-1 text-xs font-mono font-bold rounded-lg bg-black/40 text-white border border-white/10">
                {(t.weight * 100).toFixed(1)}% Weight
              </span>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-[#02130d] h-2 rounded-full overflow-hidden border border-white/5">
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${t.weight * 100}%`, backgroundColor: t.color }}
              />
            </div>

            {/* Top Keywords with Weights */}
            <div>
              <span className="text-[10px] text-gray-400 font-mono block mb-1.5">TOP RELEVANT TOKENS & DIRICHLET WEIGHTS:</span>
              <div className="flex flex-wrap gap-1.5">
                {t.keywords.map((kw, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 text-xs font-mono bg-[#02130d] text-gray-200 border border-emerald-500/20 rounded flex items-center gap-1.5"
                  >
                    <span>{kw.word}</span>
                    <span className="text-[10px] text-emerald-400 font-bold">({kw.weight})</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
