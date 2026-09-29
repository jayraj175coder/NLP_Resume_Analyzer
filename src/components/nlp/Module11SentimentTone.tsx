import React, { useState, useMemo } from "react";
import {
  Smile,
  Meh,
  Frown,
  Activity,
  Layers,
  Sparkles,
  Zap,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle
} from "lucide-react";
import { analyzeSentimentAndTone } from "../../nlp/sentiment-tone";

interface Props {
  resumeText: string;
}

export default function Module11SentimentTone({ resumeText }: Props) {
  const [text, setText] = useState(
    resumeText ||
      `Senior Software Engineer with a successful track record of optimizing distributed architectures. Spearheaded microservices migration, achieving 45% lower latency and increasing throughput. Built scalable web applications with React and Python, earning the Innovation Award.`
  );

  const result = useMemo(() => {
    return analyzeSentimentAndTone(text);
  }, [text]);

  return (
    <div className="space-y-6" id="module-sentiment-container">
      {/* Header */}
      <div className="bg-[#04241a]/80 border border-emerald-500/20 rounded-xl p-5 backdrop-blur-md">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 text-xs font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded">
                MODULE 11 // SENTIMENT & TONE
              </span>
              <span className="text-xs text-gray-400 font-mono">OPINION_MINING_&_ACTIVE_VOICE</span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              Sentiment Analysis, Persuasiveness & Active Voice Detector
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-[#FFD54A] bg-amber-950/60 px-3 py-1.5 border border-amber-500/30 rounded-lg font-bold">
              Tone: {result.overall.label}
            </span>
          </div>
        </div>

        <p className="text-xs text-gray-300 leading-relaxed mb-3">
          Measures affective polarity $[-1.0, +1.0]$, subjectivity $[0.0, 1.0]$, and audits resume tone for <strong>Active vs Passive voice ratios</strong> to maximize executive impact and recruiter engagement.
        </p>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={3}
          className="w-full bg-[#02130d] border border-emerald-500/30 rounded-lg p-3 text-xs text-gray-200 font-mono focus:outline-none focus:border-emerald-400 resize-none"
        />
      </div>

      {/* Tone & Voice Metrics Bento */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <div className="bg-[#04241a]/60 border border-emerald-500/20 rounded-xl p-3.5 text-center">
          <span className="text-[10px] text-gray-400 font-mono block">POLARITY SCORE</span>
          <div className="text-xl font-bold text-emerald-400 font-mono mt-1">+{result.overall.polarity}</div>
          <span className="text-[10px] text-gray-500">Range [-1.0, +1.0]</span>
        </div>
        <div className="bg-[#04241a]/60 border border-emerald-500/20 rounded-xl p-3.5 text-center">
          <span className="text-[10px] text-gray-400 font-mono block">SUBJECTIVITY</span>
          <div className="text-xl font-bold text-[#FFD54A] font-mono mt-1">{result.overall.subjectivity}</div>
          <span className="text-[10px] text-gray-500">Fact vs Opinion</span>
        </div>
        <div className="bg-[#04241a]/60 border border-emerald-500/20 rounded-xl p-3.5 text-center">
          <span className="text-[10px] text-gray-400 font-mono block">ACTIVE VOICE RATIO</span>
          <div className="text-xl font-bold text-cyan-400 font-mono mt-1">{(result.toneProfile.activeVoiceRatio * 100).toFixed(0)}%</div>
          <span className="text-[10px] text-emerald-400">Target &gt; 85%</span>
        </div>
        <div className="bg-[#04241a]/60 border border-emerald-500/20 rounded-xl p-3.5 text-center">
          <span className="text-[10px] text-gray-400 font-mono block">PERSUASIVENESS</span>
          <div className="text-xl font-bold text-emerald-300 font-mono mt-1">{result.toneProfile.persuasivenessScore}/100</div>
          <span className="text-[10px] text-gray-500">Action Impact</span>
        </div>
        <div className="bg-[#04241a]/60 border border-emerald-500/20 rounded-xl p-3.5 text-center col-span-2 sm:col-span-1">
          <span className="text-[10px] text-gray-400 font-mono block">FORMALITY INDEX</span>
          <div className="text-xl font-bold text-white font-mono mt-1">{result.toneProfile.formalityIndex}%</div>
          <span className="text-[10px] text-gray-500">Professional Register</span>
        </div>
      </div>

      {/* Section-by-Section Sentiment Breakdown */}
      <div className="bg-[#04241a]/70 border border-emerald-500/20 rounded-xl p-5 space-y-4">
        <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2">
          <Activity className="w-4 h-4 text-emerald-400" />
          Section-by-Section Polarity & Subjectivity Distribution
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {result.sectionSentiments.map((sec, i) => (
            <div key={i} className="p-3.5 bg-[#02130d] border border-emerald-500/20 rounded-xl flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-white font-mono">{sec.section}</h4>
                <span className="text-[10px] text-emerald-400 font-mono">Sentiment: {sec.label}</span>
              </div>
              <div className="text-right font-mono">
                <div className="text-sm font-bold text-[#FFD54A]">+{sec.polarity}</div>
                <span className="text-[10px] text-gray-400">Subj: {sec.subjectivity}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
