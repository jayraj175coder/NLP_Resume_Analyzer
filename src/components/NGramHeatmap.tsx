import React, { useState, useMemo } from "react";
import { Layers, Flame, CheckCircle2, AlertCircle, Sparkles, Filter, Hash } from "lucide-react";

interface Props {
  resumeText?: string;
  jdText?: string;
  skillsFound?: string[];
  missingSkills?: string[];
}

interface NGramItem {
  phrase: string;
  n: number; // 1, 2, or 3
  resumeFreq: number;
  jdFreq: number;
  isMatched: boolean;
  score: number;
}

export default function NGramHeatmap({
  resumeText = "",
  jdText = "",
  skillsFound = [],
  missingSkills = []
}: Props) {
  const [activeTab, setActiveTab] = useState<"all" | "unigram" | "bigram" | "trigram">("all");
  const [filterMatch, setFilterMatch] = useState<"all" | "matched" | "missing">("all");

  const ngramData = useMemo(() => {
    const tokenize = (text: string) =>
      text
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, " ")
        .split(/\s+/)
        .filter((w) => w.length > 2 && !["and", "for", "with", "the", "that", "this", "from", "you", "are", "have", "will", "our"].includes(w));

    const resumeTokens = tokenize(resumeText);
    const jdTokens = tokenize(jdText);

    const generateNGrams = (tokens: string[], n: number) => {
      const counts: Record<string, number> = {};
      for (let i = 0; i <= tokens.length - n; i++) {
        const phrase = tokens.slice(i, i + n).join(" ");
        counts[phrase] = (counts[phrase] || 0) + 1;
      }
      return counts;
    };

    const items: NGramItem[] = [];

    // Calculate Unigrams, Bigrams, Trigrams
    [1, 2, 3].forEach((n) => {
      const resumeNgrams = generateNGrams(resumeTokens, n);
      const jdNgrams = generateNGrams(jdTokens, n);

      // Collect top N-grams from JD
      Object.keys(jdNgrams).forEach((phrase) => {
        const jdFreq = jdNgrams[phrase];
        const resumeFreq = resumeNgrams[phrase] || 0;
        const isMatched = resumeFreq > 0;

        // Skip low frequency noise
        if (n === 1 && jdFreq < 2 && !skillsFound.includes(phrase) && !missingSkills.includes(phrase)) return;
        if (n > 1 && jdFreq < 1) return;

        // Score based on frequency and match
        const score = jdFreq * 10 + (isMatched ? 25 : 0);

        items.push({
          phrase,
          n,
          resumeFreq,
          jdFreq,
          isMatched,
          score
        });
      });
    });

    // Ensure detected skills and missing skills are present in list
    skillsFound.forEach((s) => {
      if (!items.some((item) => item.phrase === s.toLowerCase())) {
        items.push({
          phrase: s.toLowerCase(),
          n: s.includes(" ") ? s.split(" ").length : 1,
          resumeFreq: 2,
          jdFreq: 2,
          isMatched: true,
          score: 45
        });
      }
    });

    missingSkills.forEach((m) => {
      if (!items.some((item) => item.phrase === m.toLowerCase())) {
        items.push({
          phrase: m.toLowerCase(),
          n: m.includes(" ") ? m.split(" ").length : 1,
          resumeFreq: 0,
          jdFreq: 2,
          isMatched: false,
          score: 30
        });
      }
    });

    return items.sort((a, b) => b.score - a.score).slice(0, 32);
  }, [resumeText, jdText, skillsFound, missingSkills]);

  const filteredItems = ngramData.filter((item) => {
    if (activeTab === "unigram" && item.n !== 1) return false;
    if (activeTab === "bigram" && item.n !== 2) return false;
    if (activeTab === "trigram" && item.n !== 3) return false;

    if (filterMatch === "matched" && !item.isMatched) return false;
    if (filterMatch === "missing" && item.isMatched) return false;

    return true;
  });

  return (
    <div className="glass-academic rounded-2xl p-6 relative overflow-hidden space-y-5">
      <div className="hud-corner-tl" />
      <div className="hud-corner-br" />

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-amber-500/20">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <Flame className="w-4 h-4 text-amber-400" />
            <h3 className="text-lg font-serif font-bold text-white tracking-wide">
              N-Gram Overlap & Lexical Heatmap Matrix
            </h3>
            <span className="text-[10px] font-mono font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30 px-2.5 py-0.5 rounded">
              1-GRAM / 2-GRAM / 3-GRAM
            </span>
          </div>
          <p className="text-xs text-slate-300 font-sans">
            Visualizing term frequency, phrase collocations, and missing N-Gram density.
          </p>
        </div>

        {/* N-Gram Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-900/90 p-1 rounded-xl border border-amber-500/20">
          {(["all", "unigram", "bigram", "trigram"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-[11px] font-mono px-3 py-1 rounded-lg transition-all cursor-pointer capitalize ${
                activeTab === tab
                  ? "bg-amber-500 text-slate-950 font-bold shadow-md"
                  : "text-slate-300 hover:text-amber-300"
              }`}
            >
              {tab === "all" ? "All N-Grams" : tab === "unigram" ? "1-Gram" : tab === "bigram" ? "2-Gram" : "3-Gram"}
            </button>
          ))}
        </div>
      </div>

      {/* Secondary Match Filters */}
      <div className="flex items-center justify-between text-xs font-mono text-slate-300">
        <div className="flex items-center space-x-2">
          <Filter className="w-3.5 h-3.5 text-amber-400" />
          <span>Filter Status:</span>
          <button
            onClick={() => setFilterMatch("all")}
            className={`px-2.5 py-0.5 rounded transition-all cursor-pointer ${
              filterMatch === "all" ? "bg-slate-800 text-white font-bold border border-slate-700" : "text-slate-400 hover:text-white"
            }`}
          >
            All ({ngramData.length})
          </button>
          <button
            onClick={() => setFilterMatch("matched")}
            className={`px-2.5 py-0.5 rounded transition-all cursor-pointer ${
              filterMatch === "matched" ? "bg-teal-950 text-teal-300 font-bold border border-teal-500/40" : "text-slate-400 hover:text-teal-300"
            }`}
          >
            Matched ({ngramData.filter((i) => i.isMatched).length})
          </button>
          <button
            onClick={() => setFilterMatch("missing")}
            className={`px-2.5 py-0.5 rounded transition-all cursor-pointer ${
              filterMatch === "missing" ? "bg-rose-950 text-rose-300 font-bold border border-rose-800/40" : "text-slate-400 hover:text-rose-300"
            }`}
          >
            Missing ({ngramData.filter((i) => !i.isMatched).length})
          </button>
        </div>

        <span className="hidden sm:inline text-[11px] text-amber-300/80">
          Showing {filteredItems.length} phrases
        </span>
      </div>

      {/* Heatmap Grid Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
        {filteredItems.map((item, idx) => {
          const intensity = Math.min(1, item.jdFreq / 4);
          return (
            <div
              key={idx}
              className={`p-3 rounded-xl border transition-all relative overflow-hidden flex flex-col justify-between group ${
                item.isMatched
                  ? "bg-slate-900/90 border-teal-500/40 hover:border-teal-400 shadow-sm"
                  : "bg-slate-900/70 border-rose-500/40 hover:border-rose-400"
              }`}
            >
              {/* Background heat bar */}
              <div
                className={`absolute bottom-0 left-0 h-1 transition-all ${
                  item.isMatched ? "bg-teal-400" : "bg-rose-500"
                }`}
                style={{ width: `${Math.min(100, item.score * 2)}%` }}
              />

              <div className="flex items-center justify-between mb-1.5">
                <span
                  className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold uppercase ${
                    item.n === 1
                      ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                      : item.n === 2
                      ? "bg-teal-500/20 text-teal-300 border border-teal-500/30"
                      : "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                  }`}
                >
                  {item.n}-Gram
                </span>
                {item.isMatched ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                ) : (
                  <AlertCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                )}
              </div>

              <div className="font-mono text-xs font-bold text-white capitalize truncate my-1" title={item.phrase}>
                {item.phrase}
              </div>

              <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-1">
                <span>Resume: {item.resumeFreq}x</span>
                <span>JD: {item.jdFreq}x</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
