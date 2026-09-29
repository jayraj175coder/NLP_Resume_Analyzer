import React, { useState, useEffect } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Clock,
  Sparkles,
  Layers,
  Terminal,
  Activity,
  ArrowRight,
  ShieldCheck
} from "lucide-react";
import { DEFAULT_PIPELINE_STAGES } from "../../nlp/pipeline-runner";
import { PipelineStage } from "../../types/nlp";

export default function Module18PipelineRunner() {
  const [stages, setStages] = useState<PipelineStage[]>(DEFAULT_PIPELINE_STAGES);
  const [isRunning, setIsRunning] = useState(false);
  const [currentStageIdx, setCurrentStageIdx] = useState<number>(-1);
  const [selectedStage, setSelectedStage] = useState<PipelineStage | null>(DEFAULT_PIPELINE_STAGES[0]);

  useEffect(() => {
    let timer: any;
    if (isRunning && currentStageIdx < stages.length) {
      // Mark current stage active
      setStages((prev) =>
        prev.map((s, idx) => {
          if (idx === currentStageIdx) return { ...s, status: "running" };
          if (idx < currentStageIdx) return { ...s, status: "completed" };
          return { ...s, status: "idle" };
        })
      );

      timer = setTimeout(() => {
        setStages((prev) =>
          prev.map((s, idx) => (idx === currentStageIdx ? { ...s, status: "completed" } : s))
        );
        if (currentStageIdx + 1 < stages.length) {
          setCurrentStageIdx((prev) => prev + 1);
        } else {
          setIsRunning(false);
        }
      }, 450);
    }
    return () => clearTimeout(timer);
  }, [isRunning, currentStageIdx, stages.length]);

  const handleStart = () => {
    setStages(DEFAULT_PIPELINE_STAGES.map((s) => ({ ...s, status: "idle" })));
    setCurrentStageIdx(0);
    setIsRunning(true);
  };

  const handleReset = () => {
    setIsRunning(false);
    setCurrentStageIdx(-1);
    setStages(DEFAULT_PIPELINE_STAGES.map((s) => ({ ...s, status: "idle" })));
  };

  const totalDuration = stages.reduce((acc, s) => acc + s.durationMs, 0);

  return (
    <div className="space-y-6" id="module-pipeline-runner-container">
      {/* Header */}
      <div className="bg-[#04241a]/80 border border-emerald-500/20 rounded-xl p-5 backdrop-blur-md">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 text-xs font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded">
                MODULE 18 // FULL PIPELINE RUNNER
              </span>
              <span className="text-xs text-gray-400 font-mono">END_TO_END_INTEGRATED_ORCHESTRATOR</span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              Integrated NLP Pipeline: 12-Stage Real-Time Execution Engine
            </h2>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {!isRunning ? (
              <button
                onClick={handleStart}
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-mono font-bold text-xs rounded-lg transition-all flex items-center gap-1.5 shadow-[0_0_15px_rgba(16,185,129,0.4)]"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                Execute 12-Stage Pipeline
              </button>
            ) : (
              <button
                onClick={() => setIsRunning(false)}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black font-mono font-bold text-xs rounded-lg transition-all flex items-center gap-1.5"
              >
                <Pause className="w-3.5 h-3.5" />
                Pause Execution
              </button>
            )}
            <button
              onClick={handleReset}
              className="px-3 py-2 bg-[#02130d] hover:bg-emerald-950 text-gray-300 border border-emerald-500/30 font-mono text-xs rounded-lg transition-all flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
          </div>
        </div>

        <p className="text-xs text-gray-300 leading-relaxed mb-3">
          Sequentially orchestrates the full university NLP lifecycle from raw document ingestion through tokenization, POS tagging, NER, tree parsing, embeddings, topic modeling, career track classification, and ATS report synthesis.
        </p>

        {/* Global Progress Bar */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-emerald-400">
              {currentStageIdx >= 0
                ? `Running Stage ${Math.min(currentStageIdx + 1, stages.length)} of ${stages.length}`
                : "Pipeline Ready"}
            </span>
            <span className="text-gray-400">Total Latency: {totalDuration}ms</span>
          </div>
          <div className="w-full bg-[#02130d] h-2 rounded-full overflow-hidden border border-emerald-500/20">
            <div
              className="bg-emerald-400 h-full rounded-full transition-all duration-300"
              style={{
                width: `${
                  currentStageIdx < 0 ? 0 : ((currentStageIdx + 1) / stages.length) * 100
                }%`
              }}
            />
          </div>
        </div>
      </div>

      {/* 12-Stage Interactive Pulse Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {stages.map((stage, idx) => {
          const isCurrent = currentStageIdx === idx;
          const isDone = stage.status === "completed";
          const isSelected = selectedStage?.id === stage.id;

          return (
            <div
              key={stage.id}
              onClick={() => setSelectedStage(stage)}
              className={`p-4 rounded-xl border transition-all cursor-pointer ${
                isSelected
                  ? "border-[#FFD54A] bg-amber-950/20 shadow-[0_0_15px_rgba(255,213,74,0.15)]"
                  : isCurrent
                  ? "border-emerald-400 bg-emerald-950/40 shadow-[0_0_15px_rgba(16,185,129,0.3)] animate-pulse"
                  : isDone
                  ? "border-emerald-500/30 bg-[#04241a]/60"
                  : "border-emerald-500/10 bg-[#02130d]/80 opacity-60"
              }`}
            >
              <div className="flex items-center justify-between text-xs font-mono mb-2">
                <span className="text-[#FFD54A] font-bold">STAGE 0{idx + 1}</span>
                <div className="flex items-center gap-1.5">
                  {isDone ? (
                    <span className="text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Done
                    </span>
                  ) : isCurrent ? (
                    <span className="text-emerald-300 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                      Active
                    </span>
                  ) : (
                    <span className="text-gray-500">Queued</span>
                  )}
                  <span className="text-gray-400 font-mono text-[10px]">({stage.durationMs}ms)</span>
                </div>
              </div>

              <h4 className="text-xs font-bold text-white font-mono mb-1">{stage.name}</h4>
              <p className="text-[11px] text-gray-400 font-mono line-clamp-2 leading-relaxed">
                {stage.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* Stage Detail Inspector */}
      {selectedStage && (
        <div className="bg-[#04241a]/70 border border-emerald-500/20 rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2">
              <Terminal className="w-4 h-4 text-emerald-400" />
              Stage Inspector & Intermediate Data Stream
            </h3>
            <span className="text-xs text-gray-400 font-mono">Stage ID: {selectedStage.id}</span>
          </div>

          <div className="p-4 bg-[#02130d] border border-emerald-500/30 rounded-xl text-xs font-mono space-y-2">
            <div className="text-emerald-300 font-bold">{selectedStage.name}</div>
            <div className="text-gray-300">{selectedStage.description}</div>
            <div className="pt-2 border-t border-emerald-500/10 text-[#FFD54A]">
              <strong>Output Artifact:</strong> {selectedStage.dataOutputSummary}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
