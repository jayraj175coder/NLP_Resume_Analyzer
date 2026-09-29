export type NLPModuleId =
  | "preprocessing"
  | "features"
  | "embeddings"
  | "linguistics"
  | "language_models"
  | "ner"
  | "topic_modeling"
  | "information_retrieval"
  | "pos_tagging"
  | "parsing"
  | "sentiment_tone"
  | "classification"
  | "summarization"
  | "translation"
  | "chatbot"
  | "sequence_models"
  | "evaluation"
  | "pipeline";

export interface NLPModuleMeta {
  id: NLPModuleId;
  number: number;
  title: string;
  shortTitle: string;
  tag: string;
  category: "Foundations" | "Representations" | "Syntax & Semantics" | "Machine Learning" | "Applications" | "Architectures";
  description: string;
  icon: string;
  syllabusConcepts: string[];
}

export interface PreprocessingResult {
  originalText: string;
  sentenceTokens: string[];
  wordTokens: string[];
  lowercasedTokens: string[];
  filteredTokens: string[];
  removedStopwords: string[];
  porterStemmed: { token: string; stem: string }[];
  snowballStemmed: { token: string; stem: string }[];
  lemmatized: { token: string; lemma: string; pos?: string }[];
  spellingCorrections: { original: string; corrected: string; confidence: number }[];
  normalizedText: string;
  stats: {
    charCount: number;
    wordCount: number;
    sentenceCount: number;
    uniqueWords: number;
    stopwordsCount: number;
    avgWordLength: number;
    avgSentenceLength: number;
  };
}

export interface FeatureEngineeringResult {
  vocabulary: { word: string; count: number; docFreq: number; idf: number }[];
  bowVector: { word: string; count: number }[];
  tfidfVector: { word: string; tf: number; idf: number; tfidf: number }[];
  hashingVector: { bucket: number; word: string; hashValue: string; collision: boolean }[];
  ngrams: {
    unigrams: { gram: string; count: number }[];
    bigrams: { gram: string; count: number }[];
    trigrams: { gram: string; count: number }[];
  };
  matrixDimensions: { rows: number; cols: number; sparsity: number };
}

export interface EmbeddingVector {
  word: string;
  vector: number[];
  x: number;
  y: number;
  z?: number;
  cluster: string;
}

export interface SemanticEmbeddingsResult {
  modelType: "word2vec_skipgram" | "word2vec_cbow" | "fasttext" | "glove";
  dimension: number;
  embeddings: EmbeddingVector[];
  similarityMatrix: { wordA: string; wordB: string; similarity: number }[];
  topSkillsClusters: { cluster: string; skills: string[]; color: string }[];
}

export interface LinguisticAnalysisResult {
  morphology: {
    token: string;
    prefix?: string;
    root: string;
    suffix?: string;
    type: "inflectional" | "derivational" | "root";
  }[];
  lexicon: {
    totalTokens: number;
    uniqueTypes: number;
    typeTokenRatio: number; // TTR
    hapaxLegomena: number; // Words appearing once
    lexicalDensity: number;
    fleschReadingEase: number;
    fleschKincaidGrade: number;
    gunningFogIndex: number;
    colemanLiauIndex: number;
    readingTimeMinutes: number;
  };
  syntax: {
    averageClauseCount: number;
    complexSentences: number;
    simpleSentences: number;
    compoundSentences: number;
  };
  semantics: {
    actionVerbsFound: string[];
    weakVerbsFound: string[];
    industryJargon: string[];
    quantifiedMetrics: string[];
  };
}

export interface LanguageModelResult {
  modelType: "unigram" | "bigram" | "trigram";
  smoothingMethod: "none" | "laplace" | "good_turing" | "kneser_ney";
  sentenceProbability: number;
  logProbability: number;
  perplexity: number;
  zeroProbabilityOccurred: boolean;
  wordPredictions: { prefix: string; candidate: string; probability: number }[];
  nGramProbabilities: { nGram: string; count: number; conditionalProb: number }[];
}

export interface EntitySpan {
  id: string;
  text: string;
  label:
    | "PERSON"
    | "EMAIL"
    | "PHONE"
    | "ORGANIZATION"
    | "COLLEGE"
    | "DEGREE"
    | "DATE"
    | "LOCATION"
    | "TECHNOLOGY"
    | "CERTIFICATION"
    | "SKILL"
    | "GITHUB"
    | "LINKEDIN"
    | "URL"
    | "ROLE";
  start: number;
  end: number;
  confidence: number;
  description?: string;
}

export interface TopicDistribution {
  topicId: number;
  name: string;
  weight: number;
  color: string;
  keywords: { word: string; weight: number }[];
}

export interface TopicModelingResult {
  method: "LDA" | "NMF";
  topics: TopicDistribution[];
  coherenceScore: number;
  alphaDirichlet: number;
  betaDirichlet: number;
  documentTopicMixture: { topicName: string; percentage: number }[];
}

export interface InformationRetrievalResult {
  queryText: string;
  results: {
    docId: string;
    title: string;
    category: string;
    cosineSimilarity: number;
    bm25Score: number;
    matchedTerms: string[];
    rank: number;
  }[];
  averagePrecision: number;
}

export interface POSTagToken {
  word: string;
  tag: string;
  category: "NOUN" | "VERB" | "ADJECTIVE" | "ADVERB" | "PREPOSITION" | "PRONOUN" | "DETERMINER" | "CONJUNCTION" | "PUNCTUATION" | "OTHER";
  tagDescription: string;
  confidence: number;
}

export interface DependencyNode {
  id: number;
  word: string;
  pos: string;
  head: number;
  relation: string; // nsubj, dobj, amod, prep, pobj, root, etc.
  children?: number[];
}

export interface SentimentAnalysisResult {
  overall: {
    label: "POSITIVE" | "NEUTRAL" | "NEGATIVE";
    polarity: number; // -1.0 to 1.0
    subjectivity: number; // 0.0 to 1.0
    confidence: number;
  };
  sectionSentiments: {
    section: string;
    label: "POSITIVE" | "NEUTRAL" | "NEGATIVE";
    polarity: number;
    subjectivity: number;
  }[];
  toneProfile: {
    activeVoiceRatio: number;
    passiveVoiceRatio: number;
    persuasivenessScore: number;
    formalityIndex: number;
    confidenceScore: number;
  };
}

export interface ClassificationResult {
  predictedClass: string;
  confidence: number;
  probabilities: { category: string; probability: number; icon: string }[];
  modelType: "NaiveBayes" | "LogisticRegression" | "NeuralNetwork";
  topContributingFeatures: { feature: string; weight: number }[];
}

export interface SummarizationResult {
  extractiveSummary: {
    sentences: { text: string; rank: number; score: number; included: boolean }[];
    compressionRatio: number;
  };
  abstractiveSummary: {
    text: string;
    keyHighlights: string[];
  };
  rougeScores: {
    rouge1: { precision: number; recall: number; f1: number };
    rouge2: { precision: number; recall: number; f1: number };
    rougeL: { precision: number; recall: number; f1: number };
  };
}

export interface TranslationResult {
  sourceLanguage: string;
  targetLanguage: string;
  originalText: string;
  translatedText: string;
  bleuScore: number;
  vocabularyAlignment: { source: string; target: string }[];
}

export interface ChatbotMessage {
  id: string;
  sender: "user" | "bot" | "system";
  text: string;
  timestamp: string;
  intent?: string;
  slots?: { [key: string]: string };
  confidence?: number;
  suggestions?: string[];
}

export interface SequenceModelArchitecture {
  id: "hmm" | "crf" | "rnn" | "lstm" | "gru" | "seq2seq" | "transformer_attention";
  name: string;
  category: "Markov / Statistical" | "Recurrent" | "Attention & Transformer";
  formula: string;
  description: string;
  strengths: string[];
  limitations: string[];
  hyperparameters: { name: string; value: string | number; description: string }[];
}

export interface EvaluationMetricsResult {
  confusionMatrix: {
    matrix: number[][];
    labels: string[];
  };
  metrics: {
    accuracy: number;
    precision: number;
    recall: number;
    f1Score: number;
    macroF1: number;
    weightedF1: number;
  };
  generationMetrics: {
    rouge1: number;
    rouge2: number;
    rougeL: number;
    bleu1: number;
    bleu4: number;
    perplexity: number;
  };
  parsingMetrics: {
    uas: number; // Unlabeled Attachment Score
    las: number; // Labeled Attachment Score
  };
}

export interface PipelineStage {
  id: string;
  name: string;
  description: string;
  status: "idle" | "running" | "completed" | "error";
  durationMs: number;
  dataOutputSummary: string;
}
