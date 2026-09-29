import React, { useState, useMemo } from "react";
import {
  Tag,
  Layers,
  Sparkles,
  BarChart3,
  RefreshCw,
  CheckCircle2,
  Info
} from "lucide-react";
import { tagPOS } from "../../nlp/pos-tagger";

interface Props {
  resumeText: string;
}

const CATEGORY_COLORS: { [cat: string]: { bg: string; text: string; border: string } } = {
  NOUN: { bg: "bg-blue-950/60", text: "text-blue-300", border: "border-blue-500/40" },
  VERB: { bg: "bg-emerald-950/60", text: "text-emerald-300", border: "border-emerald-500/40" },
  ADJECTIVE: { bg: "bg-amber-950/60", text: "text-amber-300", border: "border-amber-500/40" },
  ADVERB: { bg: "bg-purple-950/60", text: "text-purple-300", border: "border-purple-500/40" },
  PREPOSITION: { bg: "bg-rose-950/60", text: "text-rose-300", border: "border-rose-500/40" },
  PRONOUN: { bg: "bg-cyan-950/60", text: "text-cyan-300", border: "border-cyan-500/40" },
  DETERMINER: { bg: "bg-gray-800/60", text: "text-gray-300", border: "border-gray-500/40" },
  CONJUNCTION: { bg: "bg-indigo-950/60", text: "text-indigo-300", border: "border-indigo-500/40" },
  PUNCTUATION: { bg: "bg-zinc-900/60", text: "text-zinc-400", border: "border-zinc-700/40" },
  OTHER: { bg: "bg-emerald-950/40", text: "text-emerald-400", border: "border-emerald-500/20" }
};

export default function Module9POSTagging({ resumeText }: Props) {
  const [text, setText] = useState(
    resumeText ||
      `Software engineer developed scalable web applications with React and Python. Senior architect optimized database latency and managed distributed cloud infrastructure.`
  );

  const result = useMemo(() => {
    return tagPOS(text);
  }, [text]);

  return (
    <div className="space-y-6" id="module-pos-tagging-container">
      {/* Header */}
      <div className="bg-[#04241a]/80 border border-emerald-500/20 rounded-xl p-5 backdrop-blur-md">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 text-xs font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded">
                MODULE 09 // SYNTACTIC TAGGING
              </span>
              <span className="text-xs text-gray-400 font-mono">PENN_TREEBANK_POS_TAGGER</span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              Part-of-Speech (POS) Sequence Tagging & Grammatical Roles
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 px-3 py-1.5 border border-emerald-500/30 rounded-lg">
              {result.tokens.length} Words Tagged
            </span>
          </div>
        </div>

        <p className="text-xs text-gray-300 leading-relaxed mb-3">
          Labels every word token with its grammatical category in context using the <strong>Penn Treebank POS Tagset</strong> (NN, NNS, NNP, VB, VBD, VBG, JJ, RB, IN, DT) and calculates category density ratios.
        </p>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={3}
          className="w-full bg-[#02130d] border border-emerald-500/30 rounded-lg p-3 text-xs text-gray-200 font-mono focus:outline-none focus:border-emerald-400 resize-none"
        />
      </div>

      {/* POS Category Distribution Bento */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
        {Object.entries(result.categoryCounts)
          .filter(([_, count]) => Number(count) > 0)
          .map(([cat, count]) => {
            const colors = CATEGORY_COLORS[cat] || CATEGORY_COLORS.OTHER;
            return (
              <div key={cat} className={`p-3 rounded-xl border ${colors.border} ${colors.bg} text-center`}>
                <span className="text-[10px] text-gray-400 font-mono block">{cat}</span>
                <div className={`text-xl font-bold font-mono mt-1 ${colors.text}`}>{count}</div>
              </div>
            );
          })}
      </div>

      {/* Interactive Tagged Tokens Canvas */}
      <div className="bg-[#04241a]/70 border border-emerald-500/20 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2">
            <Tag className="w-4 h-4 text-emerald-400" />
            Annotated Sentence Stream with Penn Treebank POS Badges
          </h3>
          <span className="text-xs text-gray-400 font-mono">Hover for Grammatical Metadata</span>
        </div>

        <div className="flex flex-wrap gap-2 p-4 bg-[#02130d] border border-emerald-500/20 rounded-xl leading-loose">
          {result.tokens.map((tok, idx) => {
            const colors = CATEGORY_COLORS[tok.category] || CATEGORY_COLORS.OTHER;
            return (
              <div
                key={idx}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border ${colors.border} ${colors.bg} group relative cursor-pointer hover:scale-105 transition-all`}
              >
                <span className="text-xs font-mono font-bold text-white">{tok.word}</span>
                <span className={`text-[10px] font-mono font-bold px-1 rounded bg-black/40 ${colors.text}`}>
                  {tok.tag}
                </span>

                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 hidden group-hover:block bg-[#021e14] border border-emerald-500 text-[10px] text-white px-2 py-1 rounded shadow-xl whitespace-nowrap z-20 font-mono">
                  {tok.tagDescription} (Conf: {(tok.confidence * 100).toFixed(0)}%)
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
