import React, { useState, useMemo } from "react";
import {
  Layers,
  Brain,
  Cpu,
  Cloud,
  BarChart3,
  ShieldAlert,
  Palette,
  Sparkles,
  Sliders,
  CheckCircle2
} from "lucide-react";
import { classifyResume } from "../../nlp/classifier-engine";

interface Props {
  resumeText: string;
}

const ICONS: { [k: string]: any } = {
  Layers,
  Brain,
  Cpu,
  Cloud,
  BarChart3,
  ShieldAlert,
  Palette
};

export default function Module12Classification({ resumeText }: Props) {
  const [text, setText] = useState(
    resumeText ||
      `Full Stack Software Engineer with expertise in React, TypeScript, Node.js, and Python FastAPI. Developed scalable backend microservices, optimized PostgreSQL databases, and deployed containerized Docker applications on AWS.`
  );
  const [modelType, setModelType] = useState<"NaiveBayes" | "LogisticRegression" | "NeuralNetwork">("NaiveBayes");

  const result = useMemo(() => {
    return classifyResume(text, modelType);
  }, [text, modelType]);

  return (
    <div className="space-y-6" id="module-classification-container">
      {/* Header */}
      <div className="bg-[#04241a]/80 border border-emerald-500/20 rounded-xl p-5 backdrop-blur-md">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 text-xs font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded">
                MODULE 12 // TEXT CLASSIFICATION
              </span>
              <span className="text-xs text-gray-400 font-mono">MULTI_CLASS_CAREER_CLASSIFIER</span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              Supervised Text Classification & Career Track Predictor
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={modelType}
              onChange={(e) => setModelType(e.target.value as any)}
              className="bg-[#02130d] border border-emerald-500/30 text-emerald-400 text-xs font-mono px-3 py-1.5 rounded-lg"
            >
              <option value="NaiveBayes">Multinomial Naive Bayes (Log-Priors)</option>
              <option value="LogisticRegression">Multinomial Logistic Regression (L2)</option>
              <option value="NeuralNetwork">Dense Neural Classifier (Softmax Layer)</option>
            </select>
          </div>
        </div>

        <p className="text-xs text-gray-300 leading-relaxed mb-3">
          Maps document text tokens into normalized Softmax posterior probabilities P(C_k|X) = exp(w_k^T X) / sum(exp(w_j^T X)) to predict candidate career track specialization.
        </p>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={3}
          className="w-full bg-[#02130d] border border-emerald-500/30 rounded-lg p-3 text-xs text-gray-200 font-mono focus:outline-none focus:border-emerald-400 resize-none"
        />
      </div>

      {/* Top Prediction Banner */}
      <div className="bg-[#FFD54A]/10 border border-[#FFD54A]/40 rounded-xl p-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono text-[#FFD54A] font-bold block mb-1">PREDICTED CAREER CLASSIFICATION</span>
          <h3 className="text-2xl font-bold text-white font-mono">{result.predictedClass}</h3>
          <span className="text-xs text-gray-400 font-mono">Classifier Model: {result.modelType}</span>
        </div>
        <div className="text-right">
          <span className="text-xs font-mono text-gray-400 block">MODEL CONFIDENCE</span>
          <div className="text-3xl font-bold text-[#FFD54A] font-mono">{result.confidence}%</div>
        </div>
      </div>

      {/* Softmax Probability Distribution & Top Contributing Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Softmax Distribution */}
        <div className="bg-[#04241a]/70 border border-emerald-500/20 rounded-xl p-5 space-y-3">
          <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-400" />
            Softmax Class Probability Distribution
          </h3>

          <div className="space-y-3">
            {result.probabilities.map((p, i) => {
              const Icon = ICONS[p.icon] || Layers;
              const isTop = i === 0;
              return (
                <div key={p.category} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <div className="flex items-center gap-2">
                      <Icon className={`w-3.5 h-3.5 ${isTop ? "text-[#FFD54A]" : "text-gray-400"}`} />
                      <span className={`font-semibold ${isTop ? "text-white font-bold" : "text-gray-300"}`}>
                        {p.category}
                      </span>
                    </div>
                    <span className={`font-bold ${isTop ? "text-[#FFD54A]" : "text-emerald-400"}`}>
                      {(p.probability * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-[#02130d] h-2 rounded-full overflow-hidden border border-emerald-500/10">
                    <div
                      className={`h-full rounded-full transition-all ${
                        isTop ? "bg-[#FFD54A]" : "bg-emerald-400"
                      }`}
                      style={{ width: `${p.probability * 100}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Contributing Features */}
        <div className="bg-[#04241a]/70 border border-emerald-500/20 rounded-xl p-5 space-y-3">
          <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            Top Salient Discriminative Features
          </h3>
          <p className="text-xs text-gray-400 font-mono">Tokens with highest positive log-odds weight</p>

          <div className="space-y-2">
            {result.topContributingFeatures.map((f, idx) => (
              <div key={idx} className="p-2.5 bg-[#02130d] border border-emerald-500/10 rounded-lg flex items-center justify-between text-xs font-mono">
                <span className="text-gray-200 font-semibold">{f.feature}</span>
                <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded font-bold">
                  Weight: +{f.weight}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
