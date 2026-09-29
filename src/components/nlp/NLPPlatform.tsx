import React from "react";
import {
  Sparkles,
  Bot,
  Home
} from "lucide-react";
import { AnalysisResponse } from "../../types";

// Active Module: Module 15 Conversational AI Assistant
import Module15Chatbot from "./Module15Chatbot";

/*
 * Note: Other curriculum lab modules commented out as requested:
 * - Module 1: Preprocessing (Tokenization, Stemming, Lemmatization)
 * - Module 2: Feature Engineering (BoW, TF-IDF, Feature Hashing, N-Grams)
 * - Module 3: Word Embeddings (Word2Vec, FastText, GloVe)
 * - Module 4: Linguistics & Readability Analytics
 * - Module 5: N-Gram Language Models & Perplexity
 * - Module 6: Named Entity Recognition (NER)
 * - Module 7: Topic Modeling (LDA & NMF)
 * - Module 8: Information Retrieval & Okapi BM25
 * - Module 9: POS Tagging (Penn Treebank)
 * - Module 10: Syntactic Parsing (Dependency & Constituency Trees)
 * - Module 11: Sentiment & Active Voice Audit
 * - Module 12: Career Track Text Classification
 * - Module 13: Extractive & Abstractive Summarization
 * - Module 14: Cross-Lingual Machine Translation
 * - Module 16: Deep Sequence Architectures (HMM, CRF, RNN, LSTM, GRU, Transformers)
 * - Module 17: NLP Evaluation Benchmarks (Confusion Matrix, F1, ROUGE, BLEU)
 * - Module 18: Integrated 12-Stage NLP Pipeline
 */

/*
// import Module1Preprocessing from "./Module1Preprocessing";
// import Module2FeatureEngineering from "./Module2FeatureEngineering";
// import Module3Embeddings from "./Module3Embeddings";
// import Module4Linguistics from "./Module4Linguistics";
// import Module5LanguageModels from "./Module5LanguageModels";
// import Module6NER from "./Module6NER";
// import Module7TopicModeling from "./Module7TopicModeling";
// import Module8InformationRetrieval from "./Module8InformationRetrieval";
// import Module9POSTagging from "./Module9POSTagging";
// import Module10Parsing from "./Module10Parsing";
// import Module11SentimentTone from "./Module11SentimentTone";
// import Module12Classification from "./Module12Classification";
// import Module13Summarization from "./Module13Summarization";
// import Module14Translation from "./Module14Translation";
// import Module16SequenceModels from "./Module16SequenceModels";
// import Module17EvaluationMetrics from "./Module17EvaluationMetrics";
// import Module18PipelineRunner from "./Module18PipelineRunner";
*/

interface Props {
  resumeData?: AnalysisResponse | null;
  onReturnToDashboard?: () => void;
}

export default function NLPPlatform({ resumeData, onReturnToDashboard }: Props) {
  const sampleResumeText =
    resumeData?.resumeText ||
    (resumeData?.analysis?.summary
      ? `${resumeData.analysis.summary} Skills: ${resumeData.skillsFound?.join(", ")}.`
      : "") ||
    `Senior Software Engineer with 6+ years of experience architecting high-throughput distributed backend systems. Engineered and deployed scalable microservices using React, TypeScript, Python, and PostgreSQL. Spearheaded API performance optimization, reducing latency by 42% and accelerating delivery pipelines across cloud infrastructure. Managed technical skills, machine learning systems, database architectures, and education qualifications.`;

  return (
    <div className="min-h-screen bg-[#021E14] text-white p-4 md:p-8 space-y-6" id="nlp-platform-root">
      {/* Top Banner Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-[#04241a]/90 border border-emerald-500/30 rounded-2xl p-5 backdrop-blur-xl shadow-[0_0_30px_rgba(2,30,20,0.8)]">
        <div className="flex items-center gap-3">
          {onReturnToDashboard && (
            <button
              onClick={onReturnToDashboard}
              className="px-3.5 py-2 bg-[#02130d] hover:bg-emerald-950 text-emerald-400 border border-emerald-500/30 rounded-xl font-mono text-xs flex items-center gap-1.5 transition-all hover:scale-105 cursor-pointer"
            >
              <Home className="w-4 h-4" />
              Bento Dashboard
            </button>
          )}
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FFD54A] animate-pulse" />
              <span className="text-xs font-mono font-bold text-[#FFD54A] tracking-wider">
                CONVERSATIONAL AI INTELLIGENCE // RESUME CO-PILOT
              </span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white font-mono mt-0.5 flex items-center gap-2">
              <Bot className="w-6 h-6 text-emerald-400" />
              Conversational AI Assistant & Interview Co-Pilot
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-emerald-300 bg-[#02130d] px-3.5 py-2 rounded-xl border border-emerald-500/30">
            {resumeData?.candidateName ? `SYNCED: ${resumeData.candidateName}` : "INTENT RECOGNITION + RESUME MEMORY ACTIVE"}
          </span>
        </div>
      </div>

      {/* Active Conversational AI Assistant */}
      <div className="transition-all duration-300">
        <Module15Chatbot
          resumeText={sampleResumeText}
          candidateName={resumeData?.candidateName}
          jobTitle={resumeData?.jobTitle}
          skillsFound={resumeData?.skillsFound || []}
          missingSkills={resumeData?.missingSkills || []}
          atsScore={resumeData?.atsScore || 86}
        />
      </div>
    </div>
  );
}
