import React, { useState } from "react";
import {
  Cpu,
  Layers,
  Sparkles,
  Zap,
  Activity,
  GitCommit,
  Share2,
  Sliders,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { SEQUENCE_MODELS_LIST } from "../../nlp/sequence-models";
import { SequenceModelArchitecture } from "../../types/nlp";

export default function Module16SequenceModels() {
  const [selectedId, setSelectedId] = useState<string>("lstm");

  const selectedModel: SequenceModelArchitecture =
    SEQUENCE_MODELS_LIST.find((m) => m.id === selectedId) || SEQUENCE_MODELS_LIST[3];

  return (
    <div className="space-y-6" id="module-sequence-models-container">
      {/* Header */}
      <div className="bg-[#04241a]/80 border border-emerald-500/20 rounded-xl p-5 backdrop-blur-md">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 text-xs font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded">
                MODULE 16 // DEEP SEQUENCE ARCHITECTURES
              </span>
              <span className="text-xs text-gray-400 font-mono">NEURAL_TEMPORAL_MODELS</span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              Sequence Models: HMM, CRF, RNN, LSTM, GRU & Transformers
            </h2>
          </div>
        </div>

        <p className="text-xs text-gray-300 leading-relaxed mb-4">
          Comparative deep dive into sequence modeling architectures from statistical <strong>Hidden Markov Models</strong> and <strong>Linear-Chain CRFs</strong> to recurrent networks (<strong>RNN, LSTM, GRU</strong>) and <strong>Multi-Head Self-Attention Transformers</strong>.
        </p>

        {/* Model Selector Bar */}
        <div className="flex flex-wrap gap-2">
          {SEQUENCE_MODELS_LIST.map((model) => (
            <button
              key={model.id}
              onClick={() => setSelectedId(model.id)}
              className={`px-3.5 py-2 text-xs font-mono rounded-lg transition-all flex items-center gap-2 ${
                selectedId === model.id
                  ? "bg-emerald-500 text-black font-bold shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                  : "bg-[#02130d] text-gray-300 hover:text-white border border-emerald-500/20"
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              {model.name}
            </button>
          ))}
        </div>
      </div>

      {/* Model Deep-Dive Bento Card */}
      <div className="bg-[#04241a]/70 border border-emerald-500/20 rounded-xl p-6 space-y-6">
        {/* Model Title & Category */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-emerald-500/10 pb-4">
          <div>
            <span className="text-xs font-mono text-emerald-400 font-bold block mb-1">
              CATEGORY: {selectedModel.category.toUpperCase()}
            </span>
            <h3 className="text-xl font-bold text-white font-mono">{selectedModel.name}</h3>
          </div>
          <span className="px-3 py-1 bg-emerald-950/60 text-[#FFD54A] border border-[#FFD54A]/30 rounded-lg text-xs font-mono font-bold">
            Architecture Blueprint
          </span>
        </div>

        {/* Mathematical Formulation */}
        <div className="bg-[#02130d] border border-emerald-500/30 rounded-xl p-4 space-y-2">
          <span className="text-xs font-mono text-emerald-400 font-bold block">GOVERNING MATHEMATICAL EQUATIONS</span>
          <div className="p-3 bg-[#04241a] rounded-lg border border-emerald-500/20 text-sm font-mono text-[#FFD54A] overflow-x-auto">
            <code>{selectedModel.formula}</code>
          </div>
          <p className="text-xs text-gray-300 font-mono leading-relaxed pt-1">
            {selectedModel.description}
          </p>
        </div>

        {/* Interactive Architecture Diagram Visualizer */}
        {selectedModel.id === "lstm" && (
          <div className="bg-[#02130d] border border-emerald-500/20 rounded-xl p-5 space-y-4">
            <h4 className="text-xs font-bold text-white font-mono flex items-center gap-2">
              <Zap className="w-3.5 h-3.5 text-[#FFD54A]" />
              LSTM Cell Gating Mechanics Breakdown
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 bg-[#04241a] border border-rose-500/30 rounded-lg">
                <span className="text-xs font-mono text-rose-400 font-bold block">1. FORGET GATE (f_t)</span>
                <span className="text-sm font-mono text-white block mt-1">σ(W_f · [h_t-1, x_t] + b_f)</span>
                <span className="text-[10px] text-gray-400 font-mono block mt-1">Decides what information to discard from cell state C_t-1</span>
              </div>
              <div className="p-3 bg-[#04241a] border border-emerald-500/30 rounded-lg">
                <span className="text-xs font-mono text-emerald-400 font-bold block">2. INPUT GATE (i_t)</span>
                <span className="text-sm font-mono text-white block mt-1">σ(W_i · [h_t-1, x_t] + b_i)</span>
                <span className="text-[10px] text-gray-400 font-mono block mt-1">Regulates candidate memory writes C̃_t into constant error carousel</span>
              </div>
              <div className="p-3 bg-[#04241a] border border-cyan-500/30 rounded-lg">
                <span className="text-xs font-mono text-cyan-400 font-bold block">3. OUTPUT GATE (o_t)</span>
                <span className="text-sm font-mono text-white block mt-1">σ(W_o · [h_t-1, x_t] + b_o)</span>
                <span className="text-[10px] text-gray-400 font-mono block mt-1">Filters cell memory to produce output hidden state vector h_t</span>
              </div>
            </div>
          </div>
        )}

        {selectedModel.id === "transformer_attention" && (
          <div className="bg-[#02130d] border border-emerald-500/20 rounded-xl p-5 space-y-4">
            <h4 className="text-xs font-bold text-white font-mono flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              Scaled Dot-Product Self-Attention Tensor Matrices
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 bg-[#04241a] border border-purple-500/30 rounded-lg text-center">
                <span className="text-xs font-mono text-purple-400 font-bold block">QUERY (Q)</span>
                <span className="text-xs font-mono text-gray-300 mt-1 block">What the current token seeks</span>
              </div>
              <div className="p-3 bg-[#04241a] border border-amber-500/30 rounded-lg text-center">
                <span className="text-xs font-mono text-[#FFD54A] font-bold block">KEY (K)</span>
                <span className="text-xs font-mono text-gray-300 mt-1 block">What attributes other tokens offer</span>
              </div>
              <div className="p-3 bg-[#04241a] border border-emerald-500/30 rounded-lg text-center">
                <span className="text-xs font-mono text-emerald-400 font-bold block">VALUE (V)</span>
                <span className="text-xs font-mono text-gray-300 mt-1 block">Contextual information payload</span>
              </div>
            </div>
          </div>
        )}

        {/* Strengths & Limitations */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-[#02130d] border border-emerald-500/20 rounded-xl space-y-2">
            <span className="text-xs font-mono text-emerald-400 font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              ARCHITECTURAL ADVANTAGES & STRENGTHS
            </span>
            <ul className="space-y-1.5 text-xs font-mono text-gray-300">
              {selectedModel.strengths.map((str, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-emerald-400">✓</span>
                  <span>{str}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-4 bg-[#02130d] border border-rose-500/20 rounded-xl space-y-2">
            <span className="text-xs font-mono text-rose-400 font-bold flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
              THEORETICAL LIMITATIONS & TRADEOFFS
            </span>
            <ul className="space-y-1.5 text-xs font-mono text-gray-300">
              {selectedModel.limitations.map((lim, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-rose-400">✗</span>
                  <span>{lim}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Hyperparameter Specs */}
        <div>
          <span className="text-xs font-mono text-gray-400 font-bold block mb-2">HYPERPARAMETER TUNING SPECS:</span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {selectedModel.hyperparameters.map((hp, i) => (
              <div key={i} className="p-3 bg-[#02130d] border border-emerald-500/10 rounded-lg">
                <div className="text-xs font-mono text-white font-bold">{hp.name}</div>
                <div className="text-sm font-mono text-[#FFD54A] font-bold mt-0.5">{String(hp.value)}</div>
                <span className="text-[10px] text-gray-400 font-mono block mt-1">{hp.description}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
