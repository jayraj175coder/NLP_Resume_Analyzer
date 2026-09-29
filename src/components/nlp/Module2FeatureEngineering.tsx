import React, { useState, useMemo } from "react";
import {
  Binary,
  Layers,
  BarChart3,
  Hash,
  Sparkles,
  Calculator,
  RefreshCw,
  Info
} from "lucide-react";
import { computeFeatureEngineering } from "../../nlp/feature-engineering";

interface Props {
  initialText: string;
  secondaryText?: string;
}

export default function Module2FeatureEngineering({ initialText, secondaryText }: Props) {
  const [doc1, setDoc1] = useState(
    initialText ||
      `Software engineer with expertise in building scalable web applications using React, TypeScript, and Python. Experience deploying Docker microservices on AWS cloud.`
  );
  const [doc2, setDoc2] = useState(
    secondaryText ||
      `Looking for a full stack engineer proficient in React, Python, PostgreSQL, and Docker microservices for cloud infrastructure.`
  );
  const [activeTab, setActiveTab] = useState<"tfidf" | "bow" | "hashing" | "ngrams">("tfidf");
  const [numBuckets, setNumBuckets] = useState(16);

  const result = useMemo(() => {
    return computeFeatureEngineering(doc1, doc2, numBuckets);
  }, [doc1, doc2, numBuckets]);

  return (
    <div className="space-y-6" id="module-features-container">
      {/* Header */}
      <div className="bg-[#04241a]/80 border border-emerald-500/20 rounded-xl p-5 backdrop-blur-md">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 text-xs font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded">
                MODULE 02 // VECTOR REPRESENTATIONS
              </span>
              <span className="text-xs text-gray-400 font-mono">NUMERICAL_VECTORIZATION</span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              Feature Engineering: BoW, TF-IDF & Hashing Vectorizers
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 px-3 py-1.5 border border-emerald-500/30 rounded-lg">
              Sparsity: {result.matrixDimensions.sparsity}%
            </span>
          </div>
        </div>

        <p className="text-xs text-gray-300 leading-relaxed mb-4">
          Converts unstructured text strings into numerical high-dimensional vector spaces for downstream machine learning. Demonstrates <strong>Term Frequency-Inverse Document Frequency (TF-IDF)</strong>, <strong>Bag of Words (Count Matrix)</strong>, <strong>Feature Hashing (Murmur-trick)</strong>, and <strong>N-Gram Collocations</strong>.
        </p>

        {/* Two Document Comparison Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-mono text-emerald-400 font-semibold mb-1 block">DOCUMENT 1 (RESUME)</label>
            <textarea
              value={doc1}
              onChange={(e) => setDoc1(e.target.value)}
              rows={3}
              className="w-full bg-[#02130d] border border-emerald-500/30 rounded-lg p-3 text-xs text-gray-200 font-mono focus:outline-none focus:border-emerald-400 resize-none"
            />
          </div>
          <div>
            <label className="text-xs font-mono text-[#FFD54A] font-semibold mb-1 block">DOCUMENT 2 (JOB DESCRIPTION)</label>
            <textarea
              value={doc2}
              onChange={(e) => setDoc2(e.target.value)}
              rows={3}
              className="w-full bg-[#02130d] border border-emerald-500/30 rounded-lg p-3 text-xs text-gray-200 font-mono focus:outline-none focus:border-emerald-400 resize-none"
            />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-emerald-500/20 pb-3">
        {[
          { id: "tfidf", label: "TF-IDF Weighted Vectors", icon: Calculator },
          { id: "bow", label: "Bag of Words (BoW Matrix)", icon: Layers },
          { id: "hashing", label: "Feature Hashing (Murmur Trick)", icon: Hash },
          { id: "ngrams", label: "N-Grams (Bigrams / Trigrams)", icon: BarChart3 }
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

      {/* TAB 1: TF-IDF */}
      {activeTab === "tfidf" && (
        <div className="space-y-4">
          <div className="bg-[#04241a]/70 border border-emerald-500/20 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2">
                  <Calculator className="w-4 h-4 text-emerald-400" />
                  TF-IDF Mathematical Decomposition
                </h3>
                <span className="text-xs text-gray-400 font-mono">
                  Formula: TF(t,d) = (count / total_terms) × IDF(t,D) = ln((1+N)/(1+DF)) + 1
                </span>
              </div>
              <span className="text-xs font-mono text-emerald-400">Top 20 Terms</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-emerald-500/20 text-gray-400">
                    <th className="py-2 px-3">TERM (t)</th>
                    <th className="py-2 px-3">TERM FREQ (TF)</th>
                    <th className="py-2 px-3">INVERSE DOC FREQ (IDF)</th>
                    <th className="py-2 px-3 text-[#FFD54A]">TF-IDF SCORE</th>
                    <th className="py-2 px-3">RELEVANCE BAR</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-emerald-500/10">
                  {result.tfidfVector.slice(0, 15).map((item, idx) => (
                    <tr key={idx} className="hover:bg-emerald-950/20">
                      <td className="py-2 px-3 text-white font-semibold">{item.word}</td>
                      <td className="py-2 px-3 text-gray-300">{item.tf}</td>
                      <td className="py-2 px-3 text-gray-400">{item.idf}</td>
                      <td className="py-2 px-3 text-[#FFD54A] font-bold">{item.tfidf}</td>
                      <td className="py-2 px-3 w-40">
                        <div className="w-full bg-[#02130d] h-2 rounded-full overflow-hidden border border-emerald-500/20">
                          <div
                            className="bg-emerald-400 h-full rounded-full transition-all"
                            style={{ width: `${Math.min(100, item.tfidf * 300)}%` }}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: BoW */}
      {activeTab === "bow" && (
        <div className="bg-[#04241a]/70 border border-emerald-500/20 rounded-xl p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-400" />
              Bag of Words (Count Vector Matrix)
            </h3>
            <span className="text-xs text-gray-400 font-mono">Vocabulary Size: {result.vocabulary.length}</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {result.bowVector.slice(0, 16).map((item, idx) => (
              <div key={idx} className="p-3 bg-[#02130d] border border-emerald-500/20 rounded-lg flex items-center justify-between">
                <span className="text-xs font-mono text-white font-semibold">{item.word}</span>
                <span className="px-2 py-0.5 text-xs font-mono font-bold bg-emerald-500/20 text-emerald-300 rounded">
                  Count: {item.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: HASHING VECTORIZER */}
      {activeTab === "hashing" && (
        <div className="bg-[#04241a]/70 border border-emerald-500/20 rounded-xl p-4 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2">
                <Hash className="w-4 h-4 text-emerald-400" />
                Feature Hashing (Hashing Trick Simulation)
              </h3>
              <p className="text-xs text-gray-400 font-mono">Fixed-dimension hashing without storing dictionary in memory</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-gray-400">Bucket Count (B):</span>
              <select
                value={numBuckets}
                onChange={(e) => setNumBuckets(Number(e.target.value))}
                className="bg-[#02130d] border border-emerald-500/30 text-emerald-400 text-xs font-mono px-2 py-1 rounded"
              >
                <option value={8}>8 Buckets (High Collision)</option>
                <option value={16}>16 Buckets (Medium)</option>
                <option value={32}>32 Buckets (Low Collision)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {result.hashingVector.map((h, i) => (
              <div
                key={i}
                className={`p-3 bg-[#02130d] rounded-lg border ${
                  h.collision ? "border-amber-500/40 bg-amber-950/10" : "border-emerald-500/20"
                }`}
              >
                <div className="flex items-center justify-between text-xs font-mono mb-1">
                  <span className="text-emerald-400 font-bold">Bucket [{h.bucket}]</span>
                  <span className="text-gray-400">{h.hashValue}</span>
                </div>
                <div className="text-sm font-bold text-white font-mono">{h.word}</div>
                {h.collision && (
                  <span className="text-[10px] text-amber-400 font-mono block mt-1">
                    ⚠ Hash Collision Detected
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: N-GRAMS */}
      {activeTab === "ngrams" && (
        <div className="bg-[#04241a]/70 border border-emerald-500/20 rounded-xl p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Bigrams */}
            <div className="space-y-2">
              <span className="text-xs font-mono text-emerald-400 font-bold block">BIGRAMS (N=2)</span>
              <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
                {result.ngrams.bigrams.map((bg, idx) => (
                  <div key={idx} className="p-2 bg-[#02130d] border border-emerald-500/20 rounded flex items-center justify-between text-xs font-mono">
                    <span className="text-white font-medium">"{bg.gram}"</span>
                    <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded font-bold">{bg.count}x</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Trigrams */}
            <div className="space-y-2">
              <span className="text-xs font-mono text-[#FFD54A] font-bold block">TRIGRAMS (N=3)</span>
              <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
                {result.ngrams.trigrams.map((tg, idx) => (
                  <div key={idx} className="p-2 bg-[#02130d] border border-emerald-500/20 rounded flex items-center justify-between text-xs font-mono">
                    <span className="text-white font-medium">"{tg.gram}"</span>
                    <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 rounded font-bold">{tg.count}x</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
