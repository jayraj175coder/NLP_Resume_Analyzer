import React, { useState, useMemo } from "react";
import {
  Search,
  Trophy,
  BarChart3,
  Layers,
  Sparkles,
  RefreshCw,
  Calculator
} from "lucide-react";
import { performInformationRetrieval } from "../../nlp/information-retrieval";

interface Props {
  jobDescription: string;
}

export default function Module8InformationRetrieval({ jobDescription }: Props) {
  const [query, setQuery] = useState(
    jobDescription ||
      `Senior Full Stack Engineer needed with React, TypeScript, Python, FastAPI, Docker microservices, PostgreSQL, and AWS cloud deployment experience.`
  );
  const [modelType, setModelType] = useState<"BM25" | "Cosine" | "TFIDF">("BM25");

  const result = useMemo(() => {
    return performInformationRetrieval(query);
  }, [query]);

  return (
    <div className="space-y-6" id="module-ir-container">
      {/* Header */}
      <div className="bg-[#04241a]/80 border border-emerald-500/20 rounded-xl p-5 backdrop-blur-md">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 text-xs font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded">
                MODULE 08 // INFORMATION RETRIEVAL
              </span>
              <span className="text-xs text-gray-400 font-mono">OKAPI_BM25_VECTOR_RANKING</span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              Information Retrieval: Okapi BM25 & Vector Ranking Engine
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 px-3 py-1.5 border border-emerald-500/30 rounded-lg">
              k1 = 1.5 | b = 0.75
            </span>
          </div>
        </div>

        <p className="text-xs text-gray-300 leading-relaxed mb-3">
          Ranks candidate resume documents against recruitment search queries using probabilistic <strong>Okapi BM25</strong> term saturation and document length normalization (k1=1.5, b=0.75).
        </p>

        <div className="space-y-2">
          <label className="text-xs font-mono text-[#FFD54A] font-semibold flex items-center gap-2">
            <Search className="w-3.5 h-3.5" />
            RECRUITMENT SEARCH QUERY / TARGET JOB DESCRIPTION
          </label>
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            rows={2}
            className="w-full bg-[#02130d] border border-emerald-500/30 rounded-lg p-2.5 text-xs text-white font-mono focus:outline-none focus:border-emerald-400"
          />
        </div>
      </div>

      {/* Candidate Ranking Leaderboard Bento */}
      <div className="bg-[#04241a]/70 border border-emerald-500/20 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2">
            <Trophy className="w-4 h-4 text-[#FFD54A]" />
            Candidate Relevance Ranking Leaderboard
          </h3>
          <span className="text-xs text-gray-400 font-mono">Ranked by BM25 Score</span>
        </div>

        <div className="space-y-3">
          {result.candidates.map((c, idx) => (
            <div
              key={c.id}
              className={`p-4 rounded-xl border transition-all ${
                idx === 0
                  ? "bg-emerald-950/40 border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.15)]"
                  : "bg-[#02130d] border-emerald-500/20"
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-3">
                  <span
                    className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono font-bold text-xs ${
                      idx === 0
                        ? "bg-[#FFD54A] text-black"
                        : "bg-emerald-900/60 text-emerald-300 border border-emerald-500/30"
                    }`}
                  >
                    #{c.rank}
                  </span>
                  <div>
                    <h4 className="text-sm font-bold text-white font-mono">{c.name}</h4>
                    <span className="text-xs text-gray-400 font-mono">{c.title}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs font-mono">
                  <div>
                    <span className="text-gray-400 block text-[10px]">BM25 SCORE</span>
                    <span className="font-bold text-[#FFD54A] text-sm">{c.bm25Score}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[10px]">COSINE SIM</span>
                    <span className="font-bold text-emerald-400 text-sm">{(c.cosineSimilarity * 100).toFixed(0)}%</span>
                  </div>
                </div>
              </div>

              {/* Matched Keywords */}
              <div className="flex flex-wrap gap-1.5 mt-2">
                {c.matchedKeywords.map((kw, j) => (
                  <span key={j} className="px-2 py-0.5 text-[11px] font-mono bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 rounded">
                    ✓ {kw}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
