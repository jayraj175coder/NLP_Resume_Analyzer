import React, { useState, useMemo } from "react";
import {
  FileText,
  Sliders,
  Scissors,
  CheckCircle2,
  Sparkles,
  RefreshCw,
  Eye,
  Terminal,
  Activity,
  Layers,
  ArrowRight,
  ShieldCheck,
  AlertCircle
} from "lucide-react";
import { runAdvancedPreprocessing } from "../../nlp/preprocessing";
import { STOPWORDS } from "../../nlp/nlp-engine";

interface Props {
  initialText: string;
}

export default function Module1Preprocessing({ initialText }: Props) {
  const [inputText, setInputText] = useState(
    initialText ||
      `Senior Software Engineer with 5+ years of experience. Developed scalable microservices, built high-throughput REST APIs using React and Python. Optimized database query latency by 45% and deployed Docker containers on AWS cloud infrastructure.`
  );
  const [activeTab, setActiveTab] = useState<"pipeline" | "stemming" | "lemmatization" | "stopwords" | "spelling">("pipeline");
  const [customStopwordInput, setCustomStopwordInput] = useState("");
  const [stopwordsSet, setStopwordsSet] = useState<Set<string>>(new Set(STOPWORDS));

  const result = useMemo(() => {
    return runAdvancedPreprocessing(inputText, stopwordsSet);
  }, [inputText, stopwordsSet]);

  const handleAddStopword = () => {
    if (customStopwordInput.trim()) {
      const next = new Set(stopwordsSet);
      next.add(customStopwordInput.trim().toLowerCase());
      setStopwordsSet(next);
      setCustomStopwordInput("");
    }
  };

  const handleRemoveStopword = (word: string) => {
    const next = new Set(stopwordsSet);
    next.delete(word);
    setStopwordsSet(next);
  };

  return (
    <div className="space-y-6" id="module-preprocessing-container">
      {/* Header & Concept Badges */}
      <div className="bg-[#04241a]/80 border border-emerald-500/20 rounded-xl p-5 backdrop-blur-md">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 text-xs font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded">
                MODULE 01 // FOUNDATIONS
              </span>
              <span className="text-xs text-gray-400 font-mono">TEXT_PIPELINE_ENGINE</span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              Advanced Text Preprocessing & Morphological Pipeline
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                setInputText(
                  `Full Stack Software Engineer leading development of cloud-native web applications with React, TypeScript, and FastAPI. Successfully reduced backend latency and containerized services using Docker and Kubernetes.`
                )
              }
              className="px-3 py-1.5 text-xs font-mono bg-emerald-950/60 hover:bg-emerald-900/80 text-emerald-300 border border-emerald-500/30 rounded-lg transition-all flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Load Sample Data
            </button>
          </div>
        </div>

        <p className="text-xs text-gray-300 leading-relaxed mb-4">
          Demonstrates the foundational NLP sequence: <strong>Sentence Boundary Disambiguation</strong>, <strong>Unicode Normalization</strong>, <strong>Word Tokenization</strong>, <strong>Stopword Filtering</strong>, <strong>Porter vs Snowball Stemming</strong>, <strong>Morphological Lemmatization</strong>, and <strong>Levenshtein Spelling Correction</strong>.
        </p>

        {/* Input Scratchpad */}
        <div className="space-y-2">
          <label className="text-xs font-mono text-emerald-400 font-semibold flex items-center justify-between">
            <span>INPUT RESUME / DOCUMENT TEXT CORPUS</span>
            <span className="text-gray-400">{inputText.length} characters | {result.stats.wordCount} words</span>
          </label>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            rows={3}
            className="w-full bg-[#02130d] border border-emerald-500/30 rounded-lg p-3 text-sm text-gray-200 font-mono focus:outline-none focus:border-emerald-400 transition-all resize-y"
            placeholder="Paste resume text or custom sentence to preprocess..."
          />
        </div>
      </div>

      {/* Stats Cards Bento */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        <div className="bg-[#04241a]/60 border border-emerald-500/20 rounded-lg p-3 text-center">
          <div className="text-xs text-gray-400 font-mono">CHARACTERS</div>
          <div className="text-lg font-bold text-white font-mono mt-1">{result.stats.charCount}</div>
        </div>
        <div className="bg-[#04241a]/60 border border-emerald-500/20 rounded-lg p-3 text-center">
          <div className="text-xs text-gray-400 font-mono">RAW TOKENS</div>
          <div className="text-lg font-bold text-emerald-400 font-mono mt-1">{result.stats.wordCount}</div>
        </div>
        <div className="bg-[#04241a]/60 border border-emerald-500/20 rounded-lg p-3 text-center">
          <div className="text-xs text-gray-400 font-mono">SENTENCES</div>
          <div className="text-lg font-bold text-[#FFD54A] font-mono mt-1">{result.stats.sentenceCount}</div>
        </div>
        <div className="bg-[#04241a]/60 border border-emerald-500/20 rounded-lg p-3 text-center">
          <div className="text-xs text-gray-400 font-mono">UNIQUE WORDS</div>
          <div className="text-lg font-bold text-white font-mono mt-1">{result.stats.uniqueWords}</div>
        </div>
        <div className="bg-[#04241a]/60 border border-emerald-500/20 rounded-lg p-3 text-center">
          <div className="text-xs text-gray-400 font-mono">STOPWORDS</div>
          <div className="text-lg font-bold text-rose-400 font-mono mt-1">{result.stats.stopwordsCount}</div>
        </div>
        <div className="bg-[#04241a]/60 border border-emerald-500/20 rounded-lg p-3 text-center">
          <div className="text-xs text-gray-400 font-mono">AVG WORD LEN</div>
          <div className="text-lg font-bold text-cyan-400 font-mono mt-1">{result.stats.avgWordLength}</div>
        </div>
        <div className="bg-[#04241a]/60 border border-emerald-500/20 rounded-lg p-3 text-center col-span-2 sm:col-span-1">
          <div className="text-xs text-gray-400 font-mono">AVG SENT LEN</div>
          <div className="text-lg font-bold text-emerald-400 font-mono mt-1">{result.stats.avgSentenceLength}</div>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-emerald-500/20 pb-3">
        {[
          { id: "pipeline", label: "Pipeline Step-by-Step", icon: Layers },
          { id: "stemming", label: "Porter vs Snowball Stemmer", icon: Scissors },
          { id: "lemmatization", label: "Morphological Lemmatizer", icon: Sparkles },
          { id: "stopwords", label: "Stopword Filter & Controls", icon: Sliders },
          { id: "spelling", label: "Levenshtein Spell Check", icon: CheckCircle2 }
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

      {/* TAB 1: PIPELINE STEP BY STEP */}
      {activeTab === "pipeline" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Step 1: Sentence Tokenization */}
            <div className="bg-[#04241a]/70 border border-emerald-500/20 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono text-emerald-400 font-bold">STEP 1 // SENTENCE TOKENIZATION</span>
                <span className="text-xs font-mono text-gray-400">{result.sentenceTokens.length} sentences</span>
              </div>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1 text-xs font-mono">
                {result.sentenceTokens.map((sent, i) => (
                  <div key={i} className="p-2 bg-[#02130d] border border-emerald-500/10 rounded flex items-start gap-2">
                    <span className="text-[#FFD54A] font-bold">[{i + 1}]</span>
                    <span className="text-gray-200">{sent}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Step 2: Word Tokenization */}
            <div className="bg-[#04241a]/70 border border-emerald-500/20 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono text-emerald-400 font-bold">STEP 2 // WORD TOKENIZATION</span>
                <span className="text-xs font-mono text-gray-400">{result.wordTokens.length} tokens</span>
              </div>
              <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto pr-1">
                {result.wordTokens.map((tok, i) => (
                  <span key={i} className="px-2 py-0.5 text-xs font-mono bg-[#02130d] text-emerald-300 border border-emerald-500/20 rounded">
                    {tok}
                  </span>
                ))}
              </div>
            </div>

            {/* Step 3: Stopword Filtering */}
            <div className="bg-[#04241a]/70 border border-emerald-500/20 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono text-emerald-400 font-bold">STEP 3 // STOPWORD FILTERING</span>
                <span className="text-xs font-mono text-rose-400">{result.removedStopwords.length} stripped</span>
              </div>
              <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto pr-1">
                {result.filteredTokens.map((tok, i) => (
                  <span key={i} className="px-2 py-0.5 text-xs font-mono bg-emerald-950/40 text-white border border-emerald-400/40 rounded">
                    {tok}
                  </span>
                ))}
              </div>
            </div>

            {/* Step 4: Clean Normalized Text */}
            <div className="bg-[#04241a]/70 border border-emerald-500/20 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono text-emerald-400 font-bold">STEP 4 // NORMALIZED CORPUS OUTPUT</span>
                <span className="text-xs font-mono text-emerald-400">READY FOR VECTORIZATION</span>
              </div>
              <div className="p-3 bg-[#02130d] border border-emerald-500/30 rounded-lg text-xs font-mono text-gray-300 max-h-48 overflow-y-auto leading-relaxed">
                {result.filteredTokens.join(" ")}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PORTER VS SNOWBALL STEMMING */}
      {activeTab === "stemming" && (
        <div className="bg-[#04241a]/70 border border-emerald-500/20 rounded-xl p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2">
              <Scissors className="w-4 h-4 text-emerald-400" />
              Side-by-Side Stemming Algorithm Comparison
            </h3>
            <span className="text-xs text-gray-400 font-mono">Porter (1980) vs Snowball (Porter2 2001)</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-emerald-500/20 text-gray-400">
                  <th className="py-2 px-3">ORIGINAL TOKEN</th>
                  <th className="py-2 px-3 text-emerald-400">PORTER STEMMER</th>
                  <th className="py-2 px-3 text-[#FFD54A]">SNOWBALL STEMMER</th>
                  <th className="py-2 px-3">RULE APPLIED</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-500/10">
                {result.porterStemmed.slice(0, 15).map((item, idx) => {
                  const snowball = result.snowballStemmed[idx]?.stem || item.stem;
                  const isDiff = item.stem !== snowball;
                  return (
                    <tr key={idx} className="hover:bg-emerald-950/20">
                      <td className="py-2 px-3 text-white font-semibold">{item.token}</td>
                      <td className="py-2 px-3 text-emerald-300 font-mono">{item.stem}</td>
                      <td className={`py-2 px-3 font-mono ${isDiff ? "text-[#FFD54A] font-bold" : "text-gray-300"}`}>
                        {snowball}
                      </td>
                      <td className="py-2 px-3 text-gray-400">
                        {item.token.endsWith("ing") ? "Step 1b: -ing reduction" : item.token.endsWith("ed") ? "Step 1b: -ed reduction" : item.token.endsWith("s") ? "Step 1a: -s reduction" : "Base suffix transformation"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: LEMMATIZATION */}
      {activeTab === "lemmatization" && (
        <div className="bg-[#04241a]/70 border border-emerald-500/20 rounded-xl p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              Morphological Base Lemmatizer (POS-Aware Lexical Mapping)
            </h3>
            <span className="text-xs text-gray-400 font-mono">Root Canonical Forms</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {result.lemmatized.slice(0, 18).map((item, i) => (
              <div key={i} className="p-3 bg-[#02130d] border border-emerald-500/20 rounded-lg flex items-center justify-between">
                <div>
                  <div className="text-xs text-gray-400 font-mono">SURFACE FORM</div>
                  <div className="text-sm font-bold text-white font-mono">{item.token}</div>
                </div>
                <ArrowRight className="w-4 h-4 text-emerald-400" />
                <div className="text-right">
                  <div className="text-xs text-emerald-400 font-mono">LEMMA ROOT</div>
                  <div className="text-sm font-bold text-[#FFD54A] font-mono">{item.lemma}</div>
                  <span className="text-[10px] text-gray-500">{item.pos}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: STOPWORDS */}
      {activeTab === "stopwords" && (
        <div className="bg-[#04241a]/70 border border-emerald-500/20 rounded-xl p-4 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-white font-mono">Interactive Stopword Filter Manager</h3>
              <p className="text-xs text-gray-400">Total Stopwords Active: {stopwordsSet.size}</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={customStopwordInput}
                onChange={(e) => setCustomStopwordInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddStopword()}
                placeholder="Add custom stopword..."
                className="px-3 py-1.5 text-xs bg-[#02130d] border border-emerald-500/30 rounded text-white font-mono focus:outline-none focus:border-emerald-400"
              />
              <button
                onClick={handleAddStopword}
                className="px-3 py-1.5 text-xs font-mono bg-emerald-500 text-black font-bold rounded hover:bg-emerald-400 transition-all"
              >
                Add Word
              </button>
            </div>
          </div>

          <div className="p-3 bg-[#02130d] border border-emerald-500/20 rounded-lg max-h-48 overflow-y-auto flex flex-wrap gap-1.5">
            {Array.from(stopwordsSet).slice(0, 60).map((sw, i) => (
              <span
                key={i}
                className="px-2 py-0.5 text-xs font-mono bg-emerald-950/60 text-gray-300 border border-emerald-500/20 rounded flex items-center gap-1.5 group hover:border-rose-500/40"
              >
                <span>{sw}</span>
                <button
                  onClick={() => handleRemoveStopword(String(sw))}
                  className="text-gray-500 group-hover:text-rose-400 text-xs"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: SPELLING */}
      {activeTab === "spelling" && (
        <div className="bg-[#04241a]/70 border border-emerald-500/20 rounded-xl p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Levenshtein Distance Spell Checking & Correction
            </h3>
            <span className="text-xs text-gray-400 font-mono">Distance Matrix Metric</span>
          </div>

          {result.spellingCorrections.length === 0 ? (
            <div className="p-6 text-center text-xs font-mono text-emerald-400 bg-[#02130d] border border-emerald-500/20 rounded-lg">
              No obvious spelling anomalies detected against tech lexicon.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {result.spellingCorrections.map((corr, i) => (
                <div key={i} className="p-3 bg-[#02130d] border border-emerald-500/20 rounded-lg flex items-center justify-between">
                  <div>
                    <div className="text-xs text-rose-400 font-mono line-through">{corr.original}</div>
                    <div className="text-sm font-bold text-emerald-400 font-mono">{corr.corrected}</div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-mono text-gray-400">CONFIDENCE</span>
                    <div className="text-sm font-bold text-[#FFD54A] font-mono">{corr.confidence}%</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
