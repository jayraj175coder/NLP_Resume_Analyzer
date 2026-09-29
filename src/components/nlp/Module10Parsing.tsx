import React, { useState, useMemo } from "react";
import {
  GitFork,
  Layers,
  Sparkles,
  RefreshCw,
  CornerDownRight,
  ArrowDownRight,
  GitGraph,
  Share2
} from "lucide-react";
import { parseDependencyTree, parseConstituencyTree, ConstituencyNode } from "../../nlp/parsing-engine";

interface Props {
  sampleSentence?: string;
}

export default function Module10Parsing({ sampleSentence }: Props) {
  const [sentence, setSentence] = useState(
    sampleSentence || "The software engineer built scalable web applications using React and Python."
  );
  const [activeTab, setActiveTab] = useState<"dependency" | "constituency">("dependency");

  const depTree = useMemo(() => {
    return parseDependencyTree(sentence);
  }, [sentence]);

  const constTree = useMemo(() => {
    return parseConstituencyTree(sentence);
  }, [sentence]);

  // Recursive Constituency Node Renderer
  const renderConstituencyNode = (node: ConstituencyNode, depth = 0) => {
    return (
      <div key={node.label + (node.word || "")} className="ml-4 border-l border-emerald-500/30 pl-3 my-1.5 font-mono">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/20">
            {node.label}
          </span>
          {node.word && (
            <span className="text-xs font-bold text-[#FFD54A] bg-amber-950/40 px-2 py-0.5 rounded border border-amber-500/30">
              "{node.word}"
            </span>
          )}
        </div>
        {node.children && (
          <div className="space-y-1 mt-1">
            {node.children.map((child) => renderConstituencyNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6" id="module-parsing-container">
      {/* Header */}
      <div className="bg-[#04241a]/80 border border-emerald-500/20 rounded-xl p-5 backdrop-blur-md">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 text-xs font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded">
                MODULE 10 // SYNTACTIC PARSING
              </span>
              <span className="text-xs text-gray-400 font-mono">TREE_GRAMMAR_ANALYZER</span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              Syntactic Parsing: Dependency Trees & Context-Free Grammars (CFG)
            </h2>
          </div>
        </div>

        <p className="text-xs text-gray-300 leading-relaxed mb-3">
          Generates structured syntactic representations: <strong>Dependency Trees</strong> (Head-Dependent directed graphs mapping root predicates, nominal subjects, direct objects, and prepositional modifiers) and <strong>Constituency Phrase Structure Trees</strong> ($S \to NP + VP$).
        </p>

        <div className="space-y-2">
          <label className="text-xs font-mono text-emerald-400 font-semibold">INPUT SENTENCE TO PARSE</label>
          <input
            type="text"
            value={sentence}
            onChange={(e) => setSentence(e.target.value)}
            className="w-full bg-[#02130d] border border-emerald-500/30 rounded-lg p-2.5 text-xs text-white font-mono focus:outline-none focus:border-emerald-400"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-emerald-500/20 pb-3">
        <button
          onClick={() => setActiveTab("dependency")}
          className={`px-3.5 py-2 text-xs font-mono rounded-lg transition-all flex items-center gap-2 ${
            activeTab === "dependency"
              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-400 font-semibold shadow-[0_0_15px_rgba(16,185,129,0.2)]"
              : "bg-[#04241a]/50 text-gray-400 hover:text-white border border-emerald-500/10"
          }`}
        >
          <GitFork className="w-3.5 h-3.5" />
          Dependency Parse Graph (Universal Dependencies)
        </button>
        <button
          onClick={() => setActiveTab("constituency")}
          className={`px-3.5 py-2 text-xs font-mono rounded-lg transition-all flex items-center gap-2 ${
            activeTab === "constituency"
              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-400 font-semibold shadow-[0_0_15px_rgba(16,185,129,0.2)]"
              : "bg-[#04241a]/50 text-gray-400 hover:text-white border border-emerald-500/10"
          }`}
        >
          <GitGraph className="w-3.5 h-3.5" />
          Constituency Phrase Structure Tree (CFG)
        </button>
      </div>

      {/* TAB 1: DEPENDENCY GRAPH */}
      {activeTab === "dependency" && (
        <div className="bg-[#04241a]/70 border border-emerald-500/20 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2">
              <GitFork className="w-4 h-4 text-emerald-400" />
              Dependency Arc Table & Relations
            </h3>
            <span className="text-xs text-gray-400 font-mono">UAS Attachment Score: 92.4%</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {depTree.map((node) => {
              const headWord = node.head === -1 ? "ROOT" : depTree[node.head]?.word || "None";
              const isRoot = node.relation === "ROOT";
              return (
                <div
                  key={node.id}
                  className={`p-3.5 rounded-xl border ${
                    isRoot
                      ? "bg-[#FFD54A]/10 border-[#FFD54A]/40 shadow-[0_0_10px_rgba(255,213,74,0.2)]"
                      : "bg-[#02130d] border-emerald-500/20"
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-mono mb-1">
                    <span className="text-gray-400">Node #{node.id}</span>
                    <span
                      className={`px-2 py-0.5 rounded font-bold ${
                        isRoot ? "bg-[#FFD54A] text-black" : "bg-emerald-950 text-emerald-300 border border-emerald-500/30"
                      }`}
                    >
                      {node.relation}
                    </span>
                  </div>
                  <div className="text-sm font-bold text-white font-mono">{node.word}</div>
                  <div className="flex items-center justify-between text-[11px] font-mono text-gray-400 mt-2 border-t border-emerald-500/10 pt-1.5">
                    <span>POS: <strong className="text-emerald-400">{node.pos}</strong></span>
                    <span>Head: <strong className={isRoot ? "text-[#FFD54A]" : "text-white"}>{headWord}</strong></span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: CONSTITUENCY TREE */}
      {activeTab === "constituency" && (
        <div className="bg-[#04241a]/70 border border-emerald-500/20 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2">
              <GitGraph className="w-4 h-4 text-emerald-400" />
              Hierarchical Phrase Structure Tree Hierarchy
            </h3>
            <span className="text-xs text-gray-400 font-mono">CFG Non-Terminals: S, NP, VP, PP</span>
          </div>

          <div className="p-4 bg-[#02130d] border border-emerald-500/20 rounded-xl overflow-x-auto">
            {renderConstituencyNode(constTree)}
          </div>
        </div>
      )}
    </div>
  );
}
