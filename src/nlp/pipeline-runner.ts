import { PipelineStage } from "../types/nlp";

export const DEFAULT_PIPELINE_STAGES: PipelineStage[] = [
  {
    id: "stage-1",
    name: "Document Ingestion & Text Extraction",
    description: "Binary buffer decoding for PDF/DOCX structures, OCR normalization, and layout boundary preservation.",
    status: "idle",
    durationMs: 42,
    dataOutputSummary: "Extracted 2,840 raw unicode characters and 410 raw tokens."
  },
  {
    id: "stage-2",
    name: "Advanced Preprocessing & Normalization",
    description: "Sentence boundary disambiguation, NFKD unicode normalization, lowercasing, and custom stopword stripping.",
    status: "idle",
    durationMs: 18,
    dataOutputSummary: "32 sentences isolated, 240 non-stopword tokens retained."
  },
  {
    id: "stage-3",
    name: "Stemming & Morphological Lemmatization",
    description: "Porter/Snowball rule-based stem reductions alongside dictionary-driven inflectional base derivation.",
    status: "idle",
    durationMs: 25,
    dataOutputSummary: "Computed 210 distinct lemma roots and morphological affix tags."
  },
  {
    id: "stage-4",
    name: "Part-of-Speech (POS) Sequence Tagging",
    description: "Penn Treebank grammatical role assignment (NN, VBD, JJ, RB, IN) and transition probability scoring.",
    status: "idle",
    durationMs: 34,
    dataOutputSummary: "Tagged 240 tokens: 104 Nouns, 48 Verbs, 32 Adjectives, 16 Adverbs."
  },
  {
    id: "stage-5",
    name: "Named Entity Recognition (NER 15-Class)",
    description: "Multi-pattern span extraction: Candidate Name, Email, GitHub, LinkedIn, Tech Stack, Education, and Dates.",
    status: "idle",
    durationMs: 38,
    dataOutputSummary: "Detected 28 high-confidence named entities across 8 categories."
  },
  {
    id: "stage-6",
    name: "Constituency & Dependency Parsing",
    description: "Hierarchical syntactic tree generation mapping Root verbs, Subject noun phrases, and prepositional modifiers.",
    status: "idle",
    durationMs: 45,
    dataOutputSummary: "Built dependency trees with 92.4% UAS and 89.1% LAS attachment scores."
  },
  {
    id: "stage-7",
    name: "High-Dimensional Vector Embeddings",
    description: "Word2Vec, FastText subword projections, and GloVe semantic coordinate manifolds.",
    status: "idle",
    durationMs: 52,
    dataOutputSummary: "Mapped 24 tech skills into 20-dimensional semantic cluster space."
  },
  {
    id: "stage-8",
    name: "Feature Engineering (TF-IDF & N-Grams)",
    description: "Sparse term-frequency inverse-document-frequency matrix generation, Feature Hashing, and Bigram extraction.",
    status: "idle",
    durationMs: 29,
    dataOutputSummary: "Constructed TF-IDF vector of length 156 with 82.4% matrix sparsity."
  },
  {
    id: "stage-9",
    name: "Topic Modeling (LDA & NMF)",
    description: "Dirichlet prior topic distribution assigning mixture weights across Frontend, Backend, DevOps, and AI.",
    status: "idle",
    durationMs: 48,
    dataOutputSummary: "Topic mixture: 42% Frontend, 31% Backend, 18% Cloud/DevOps, 9% AI."
  },
  {
    id: "stage-10",
    name: "Multi-Class Career Track Classification",
    description: "Discriminative Softmax probability estimation against 7 industry engineering job classifications.",
    status: "idle",
    durationMs: 30,
    dataOutputSummary: "Predicted Class: 'Full Stack Engineer' (Confidence: 89.4%)."
  },
  {
    id: "stage-11",
    name: "Information Retrieval & Cosine Match",
    description: "Angular vector similarity & Okapi BM25 ranking against Target Job Description requirements.",
    status: "idle",
    durationMs: 36,
    dataOutputSummary: "Computed 88% Cosine Similarity match against Job Description."
  },
  {
    id: "stage-12",
    name: "Neural Recruiter Verdict & Evaluation",
    description: "Dual Extractive/Abstractive summary synthesis, ATS compliance grading, and actionable recommendations.",
    status: "idle",
    durationMs: 65,
    dataOutputSummary: "ATS Grade: 92/100. Generated 4 high-impact bullet point optimizations."
  }
];
