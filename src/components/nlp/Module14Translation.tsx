import React, { useState, useMemo } from "react";
import {
  Globe,
  Languages,
  ArrowRight,
  Sparkles,
  BarChart3,
  CheckCircle2,
  Layers,
  Copy,
  Check
} from "lucide-react";
import { translateResumeText } from "../../nlp/translation-engine";

interface Props {
  resumeText: string;
}

const LANGUAGES = [
  { code: "hi", name: "Hindi (हिन्दी)", flag: "🇮🇳" },
  { code: "mr", name: "Marathi (मराठी)", flag: "🇮🇳" },
  { code: "gu", name: "Gujarati (ગુજરાતી)", flag: "🇮🇳" },
  { code: "ta", name: "Tamil (தமிழ்)", flag: "🇮🇳" },
  { code: "fr", name: "French (Français)", flag: "🇫🇷" },
  { code: "de", name: "German (Deutsch)", flag: "🇩🇪" },
  { code: "es", name: "Spanish (Español)", flag: "🇪🇸" }
];

export default function Module14Translation({ resumeText }: Props) {
  const [text, setText] = useState(
    resumeText ||
      `Software Engineer with extensive experience in building scalable web applications. Managed technical skills, machine learning systems, database architectures, and education qualifications.`
  );
  const [targetLang, setTargetLang] = useState("hi");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    return translateResumeText(text, targetLang);
  }, [text, targetLang]);

  const handleCopy = (t: string) => {
    navigator.clipboard.writeText(t);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6" id="module-translation-container">
      {/* Header */}
      <div className="bg-[#04241a]/80 border border-emerald-500/20 rounded-xl p-5 backdrop-blur-md">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 text-xs font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded">
                MODULE 14 // MACHINE TRANSLATION
              </span>
              <span className="text-xs text-gray-400 font-mono">NEURAL_CROSS_LINGUAL_ENGINE</span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              Cross-Lingual Resume Translation & BLEU Alignment
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-[#FFD54A] bg-amber-950/60 px-3 py-1.5 border border-amber-500/30 rounded-lg font-bold">
              BLEU Score: {result.bleuScore}
            </span>
          </div>
        </div>

        <p className="text-xs text-gray-300 leading-relaxed mb-3">
          Translates resumes across Indian Regional (Hindi, Marathi, Gujarati, Tamil) and European languages (French, German, Spanish) with <strong>bilingual word alignment</strong> and <strong>BLEU evaluation</strong> metrics.
        </p>

        {/* Language Selection Row */}
        <div className="flex flex-wrap gap-2 pt-2">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => setTargetLang(lang.code)}
              className={`px-3 py-1.5 text-xs font-mono rounded-lg transition-all flex items-center gap-2 ${
                targetLang === lang.code
                  ? "bg-emerald-500 text-black font-bold shadow-[0_0_12px_rgba(16,185,129,0.3)]"
                  : "bg-[#02130d] text-gray-300 hover:text-white border border-emerald-500/20"
              }`}
            >
              <span>{lang.flag}</span>
              <span>{lang.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Side-by-Side Translation Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Source English */}
        <div className="bg-[#04241a]/70 border border-emerald-500/20 rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-emerald-400 font-bold">SOURCE LANGUAGE (ENGLISH)</span>
            <span className="text-[10px] text-gray-400 font-mono">Editable</span>
          </div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={5}
            className="w-full bg-[#02130d] border border-emerald-500/30 rounded-lg p-3 text-xs text-gray-200 font-mono focus:outline-none focus:border-emerald-400 resize-none leading-relaxed"
          />
        </div>

        {/* Target Translation */}
        <div className="bg-[#04241a]/70 border border-emerald-500/20 rounded-xl p-5 space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono text-[#FFD54A] font-bold">TARGET TRANSLATION ({result.targetLanguage})</span>
              <button
                onClick={() => handleCopy(result.translatedText)}
                className="text-xs text-gray-400 hover:text-white flex items-center gap-1 font-mono"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
            <div className="p-3 bg-[#02130d] border border-emerald-500/30 rounded-lg text-sm text-white font-mono leading-relaxed min-h-[110px]">
              {result.translatedText}
            </div>
          </div>
        </div>
      </div>

      {/* Bilingual Word Alignments */}
      <div className="bg-[#04241a]/70 border border-emerald-500/20 rounded-xl p-5 space-y-3">
        <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2">
          <Languages className="w-4 h-4 text-emerald-400" />
          Bilingual Terminology Alignment Pairs
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {result.vocabularyAlignment.map((align, idx) => (
            <div key={idx} className="p-2.5 bg-[#02130d] border border-emerald-500/10 rounded-lg flex items-center justify-between text-xs font-mono">
              <span className="text-gray-300">{align.source}</span>
              <ArrowRight className="w-3 h-3 text-emerald-400" />
              <span className="text-[#FFD54A] font-bold">{align.target}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
