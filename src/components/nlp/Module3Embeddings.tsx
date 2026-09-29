import React, { useState, useMemo } from "react";
import {
  Brain,
  Layers,
  Sparkles,
  RefreshCw,
  Plus,
  Minus,
  Equal,
  Compass,
  Zap,
  Target
} from "lucide-react";
import { generateSemanticEmbeddings, performVectorArithmetic } from "../../nlp/embeddings";

interface Props {
  resumeText: string;
}

export default function Module3Embeddings({ resumeText }: Props) {
  const [modelType, setModelType] = useState<"word2vec_skipgram" | "word2vec_cbow" | "fasttext" | "glove">("word2vec_skipgram");
  const [wordA, setWordA] = useState("react");
  const [wordB, setWordB] = useState("frontend");
  const [wordC, setWordC] = useState("backend");
  const [activeTab, setActiveTab] = useState<"scatter" | "arithmetic" | "matrix">("scatter");

  const embeddingsData = useMemo(() => {
    return generateSemanticEmbeddings(resumeText, modelType);
  }, [resumeText, modelType]);

  const arithmeticResult = useMemo(() => {
    return performVectorArithmetic(wordA, wordB, wordC);
  }, [wordA, wordB, wordC]);

  return (
    <div className="space-y-6" id="module-embeddings-container">
      {/* Header */}
      <div className="bg-[#04241a]/80 border border-emerald-500/20 rounded-xl p-5 backdrop-blur-md">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 text-xs font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded">
                MODULE 03 // DISTRIBUTED REPRESENTATIONS
              </span>
              <span className="text-xs text-gray-400 font-mono">DENSE_SEMANTIC_MANIFOLDS</span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              Semantic Word Embeddings: Word2Vec, FastText & GloVe
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={modelType}
              onChange={(e) => setModelType(e.target.value as any)}
              className="bg-[#02130d] border border-emerald-500/30 text-emerald-400 text-xs font-mono px-3 py-1.5 rounded-lg focus:outline-none"
            >
              <option value="word2vec_skipgram">Word2Vec (Skip-Gram with Negative Sampling)</option>
              <option value="word2vec_cbow">Word2Vec (Continuous Bag of Words - CBOW)</option>
              <option value="fasttext">FastText (Subword Character N-Grams)</option>
              <option value="glove">GloVe (Global Vectors for Word Representation)</option>
            </select>
          </div>
        </div>

        <p className="text-xs text-gray-300 leading-relaxed">
          Embeds discrete vocabulary into dense continuous vector spaces where geometric proximity models semantic similarity. Supports <strong>Vector Arithmetic</strong> (e.g. <em>v(React) - v(Frontend) + v(Backend) ≈ v(FastAPI)</em>) and <strong>Multi-Cluster Topologies</strong>.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-emerald-500/20 pb-3">
        {[
          { id: "scatter", label: "2D Semantic Projection & Clusters", icon: Compass },
          { id: "arithmetic", label: "Vector Analogy Arithmetic", icon: Equal },
          { id: "matrix", label: "Pairwise Cosine Similarity Heatmap", icon: Target }
        ].map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-2 text-xs font-mono rounded-lg transition-all flex items-center gap-2 ${
                active
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-400 font-semibold shadow-[0_0_15px_rgba(16,185,129,0.2)]"
                  : "bg-[#04241a]/50 text-gray-400 hover:text-white border border-emerald-500/10 hover:border-emerald-500/30"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB 1: 2D PROJECTION */}
      {activeTab === "scatter" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 bg-[#02130d] border border-emerald-500/20 rounded-xl p-5 relative overflow-hidden h-[380px] flex items-center justify-center">
            {/* Grid background */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#04241a_1px,transparent_1px),linear-gradient(to_bottom,#04241a_1px,transparent_1px)] bg-[size:24px_24px] opacity-40" />
            
            {/* Center Axes */}
            <div className="absolute inset-x-0 top-1/2 h-[1px] bg-emerald-500/20" />
            <div className="absolute inset-y-0 left-1/2 w-[1px] bg-emerald-500/20" />

            {/* Plotted Embedding Nodes */}
            <div className="relative w-full h-full">
              {embeddingsData.embeddings.map((item, idx) => {
                // Map [-1, 1] coordinates to percentages [10%, 90%]
                const left = 50 + item.x * 40;
                const top = 50 - item.y * 40;
                return (
                  <div
                    key={idx}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
                    style={{ left: `${left}%`, top: `${top}%` }}
                  >
                    <div className="flex items-center gap-1.5 px-2 py-1 bg-[#04241a] border border-emerald-400/40 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.3)] hover:scale-110 hover:border-emerald-300 transition-all">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-[11px] font-mono font-bold text-white whitespace-nowrap">
                        {item.word}
                      </span>
                    </div>
                    {/* Hover tooltip */}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 hidden group-hover:block bg-[#021e14] border border-emerald-500/40 text-[10px] text-gray-200 px-2 py-1 rounded shadow-lg whitespace-nowrap z-20">
                      Cluster: {item.cluster} (x: {item.x.toFixed(2)}, y: {item.y.toFixed(2)})
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Cluster Legend */}
          <div className="bg-[#04241a]/70 border border-emerald-500/20 rounded-xl p-4 space-y-3">
            <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-400" />
              Semantic Skill Clusters
            </h3>
            <div className="space-y-2">
              {embeddingsData.topSkillsClusters.map((cluster, i) => (
                <div key={i} className="p-2.5 bg-[#02130d] border border-emerald-500/10 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cluster.color }} />
                    <span className="text-xs font-mono font-bold text-white">{cluster.cluster}</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {cluster.skills.map((s, j) => (
                      <span key={j} className="text-[10px] font-mono text-gray-300 bg-emerald-950/40 px-1.5 py-0.5 rounded">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: VECTOR ARITHMETIC */}
      {activeTab === "arithmetic" && (
        <div className="bg-[#04241a]/70 border border-emerald-500/20 rounded-xl p-5 space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2">
              <Equal className="w-4 h-4 text-[#FFD54A]" />
              Vector Space Analogy & Arithmetic Calculator
            </h3>
            <span className="text-xs text-gray-400 font-mono">Formula: $v(A) - v(B) + v(C) \approx v(Target)$</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 p-4 bg-[#02130d] border border-emerald-500/20 rounded-xl">
            <div className="text-center">
              <span className="text-[10px] text-gray-400 font-mono block mb-1">WORD A</span>
              <input
                type="text"
                value={wordA}
                onChange={(e) => setWordA(e.target.value)}
                className="w-28 text-center bg-[#04241a] border border-emerald-400 text-white font-mono font-bold text-sm px-2 py-1.5 rounded"
              />
            </div>
            <Minus className="w-4 h-4 text-rose-400 font-bold" />
            <div className="text-center">
              <span className="text-[10px] text-gray-400 font-mono block mb-1">WORD B</span>
              <input
                type="text"
                value={wordB}
                onChange={(e) => setWordB(e.target.value)}
                className="w-28 text-center bg-[#04241a] border border-emerald-400 text-white font-mono font-bold text-sm px-2 py-1.5 rounded"
              />
            </div>
            <Plus className="w-4 h-4 text-emerald-400 font-bold" />
            <div className="text-center">
              <span className="text-[10px] text-gray-400 font-mono block mb-1">WORD C</span>
              <input
                type="text"
                value={wordC}
                onChange={(e) => setWordC(e.target.value)}
                className="w-28 text-center bg-[#04241a] border border-emerald-400 text-white font-mono font-bold text-sm px-2 py-1.5 rounded"
              />
            </div>
            <Equal className="w-4 h-4 text-[#FFD54A] font-bold" />
            <div className="text-center bg-emerald-950/60 border border-[#FFD54A] px-4 py-2 rounded-lg">
              <span className="text-[10px] text-[#FFD54A] font-mono block">NEAREST MANIFOLD MATCH</span>
              <div className="text-base font-bold text-white font-mono">{arithmeticResult.resultWord}</div>
              <span className="text-[10px] text-emerald-400 font-mono">Similarity: {arithmeticResult.score}</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: SIMILARITY MATRIX */}
      {activeTab === "matrix" && (
        <div className="bg-[#04241a]/70 border border-emerald-500/20 rounded-xl p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2">
              <Target className="w-4 h-4 text-emerald-400" />
              Pairwise Cosine Similarity Matrix
            </h3>
            <span className="text-xs text-gray-400 font-mono">Cosine Range: [-1.0, 1.0]</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {embeddingsData.similarityMatrix.slice(0, 16).map((item, idx) => (
              <div key={idx} className="p-2.5 bg-[#02130d] border border-emerald-500/10 rounded flex items-center justify-between">
                <span className="text-xs font-mono text-gray-300">{item.wordA} ↔ {item.wordB}</span>
                <span className="text-xs font-mono font-bold text-[#FFD54A]">{item.similarity}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
