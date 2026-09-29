import React, { useState, useMemo } from "react";
import {
  Tag,
  Filter,
  CheckCircle2,
  Sparkles,
  Layers,
  Search,
  ExternalLink,
  Shield
} from "lucide-react";
import { extractAdvancedEntities } from "../../nlp/ner-engine";
import { EntitySpan } from "../../types/nlp";

interface Props {
  resumeText: string;
}

const ENTITY_COLORS: { [label: string]: { bg: string; text: string; border: string } } = {
  PERSON: { bg: "bg-purple-950/50", text: "text-purple-300", border: "border-purple-500/40" },
  EMAIL: { bg: "bg-blue-950/50", text: "text-blue-300", border: "border-blue-500/40" },
  PHONE: { bg: "bg-cyan-950/50", text: "text-cyan-300", border: "border-cyan-500/40" },
  ORGANIZATION: { bg: "bg-amber-950/50", text: "text-amber-300", border: "border-amber-500/40" },
  COLLEGE: { bg: "bg-emerald-950/50", text: "text-emerald-300", border: "border-emerald-500/40" },
  DEGREE: { bg: "bg-teal-950/50", text: "text-teal-300", border: "border-teal-500/40" },
  DATE: { bg: "bg-rose-950/50", text: "text-rose-300", border: "border-rose-500/40" },
  LOCATION: { bg: "bg-indigo-950/50", text: "text-indigo-300", border: "border-indigo-500/40" },
  TECHNOLOGY: { bg: "bg-emerald-900/60", text: "text-emerald-300", border: "border-emerald-400" },
  ROLE: { bg: "bg-yellow-950/50", text: "text-[#FFD54A]", border: "border-yellow-500/40" },
  CERTIFICATION: { bg: "bg-orange-950/50", text: "text-orange-300", border: "border-orange-500/40" },
  GITHUB: { bg: "bg-gray-800/80", text: "text-gray-200", border: "border-gray-500/40" },
  LINKEDIN: { bg: "bg-sky-950/50", text: "text-sky-300", border: "border-sky-500/40" }
};

export default function Module6NER({ resumeText }: Props) {
  const [text, setText] = useState(
    resumeText ||
      `Alex Mercer
Software Engineer
alex.mercer@example.com | (555) 382-9912 | San Francisco, CA
github.com/alexmercer-dev | linkedin.com/in/alex-mercer-tech

Professional Summary
Senior Full Stack Developer with 6+ years at Google and Uber. Built scalable distributed microservices with React, TypeScript, Python, FastAPI, Docker, and AWS.

Education
Bachelor of Computer Science from Stanford University (2018 - 2022)

Certifications
AWS Certified Solutions Architect Associate`
  );

  const [selectedLabel, setSelectedLabel] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const entities = useMemo(() => {
    return extractAdvancedEntities(text);
  }, [text]);

  const uniqueLabels = useMemo(() => {
    const set = new Set(entities.map(e => e.label));
    return ["ALL", ...Array.from(set)];
  }, [entities]);

  const filteredEntities = useMemo(() => {
    return entities.filter(ent => {
      const matchLabel = selectedLabel === "ALL" || ent.label === selectedLabel;
      const matchSearch = searchQuery ? ent.text.toLowerCase().includes(searchQuery.toLowerCase()) : true;
      return matchLabel && matchSearch;
    });
  }, [entities, selectedLabel, searchQuery]);

  return (
    <div className="space-y-6" id="module-ner-container">
      {/* Header */}
      <div className="bg-[#04241a]/80 border border-emerald-500/20 rounded-xl p-5 backdrop-blur-md">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 text-xs font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded">
                MODULE 06 // INFORMATION EXTRACTION
              </span>
              <span className="text-xs text-gray-400 font-mono">15_CLASS_NAMED_ENTITY_RECOGNITION</span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              Named Entity Recognition (NER) & Span Classifier
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 px-3 py-1.5 border border-emerald-500/30 rounded-lg">
              {entities.length} Entities Identified
            </span>
          </div>
        </div>

        <p className="text-xs text-gray-300 leading-relaxed mb-3">
          Extracts and classifies contiguous character spans into 15 domain categories: <strong>PERSON</strong>, <strong>EMAIL</strong>, <strong>PHONE</strong>, <strong>ORGANIZATION</strong>, <strong>COLLEGE</strong>, <strong>DEGREE</strong>, <strong>DATE</strong>, <strong>LOCATION</strong>, <strong>TECHNOLOGY</strong>, <strong>CERTIFICATION</strong>, <strong>ROLE</strong>, <strong>GITHUB</strong>, and <strong>LINKEDIN</strong>.
        </p>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={4}
          className="w-full bg-[#02130d] border border-emerald-500/30 rounded-lg p-3 text-xs text-gray-200 font-mono focus:outline-none focus:border-emerald-400 resize-y"
        />
      </div>

      {/* Filter Chips & Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#04241a]/60 border border-emerald-500/20 rounded-xl p-3">
        <div className="flex flex-wrap items-center gap-1.5">
          {uniqueLabels.map((lbl) => (
            <button
              key={lbl}
              onClick={() => setSelectedLabel(lbl)}
              className={`px-2.5 py-1 text-xs font-mono rounded-lg transition-all ${
                selectedLabel === lbl
                  ? "bg-emerald-500 text-black font-bold shadow-[0_0_10px_rgba(16,185,129,0.3)]"
                  : "bg-[#02130d] text-gray-300 hover:text-white border border-emerald-500/20"
              }`}
            >
              {lbl}
            </button>
          ))}
        </div>

        <div className="relative">
          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search entities..."
            className="pl-8 pr-3 py-1.5 text-xs bg-[#02130d] border border-emerald-500/30 text-white font-mono rounded-lg focus:outline-none focus:border-emerald-400"
          />
        </div>
      </div>

      {/* Extracted Entity Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {filteredEntities.map((ent) => {
          const colors = ENTITY_COLORS[ent.label] || { bg: "bg-emerald-950/40", text: "text-emerald-300", border: "border-emerald-500/30" };
          return (
            <div
              key={ent.id}
              className={`p-3.5 rounded-xl border ${colors.border} ${colors.bg} flex flex-col justify-between transition-all hover:scale-[1.02]`}
            >
              <div>
                <div className="flex items-center justify-between text-[10px] font-mono mb-1.5">
                  <span className={`px-2 py-0.5 rounded font-bold ${colors.text} bg-black/40 border border-white/10`}>
                    {ent.label}
                  </span>
                  <span className="text-gray-400 font-mono">{(ent.confidence * 100).toFixed(0)}% Conf</span>
                </div>
                <div className="text-sm font-bold text-white font-mono break-words">{ent.text}</div>
              </div>
              <span className="text-[10px] text-gray-400 font-mono mt-2">{ent.description}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
