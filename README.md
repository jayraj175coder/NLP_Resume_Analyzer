# 🎓 AI Resume Analyzer & Academic NLP Evaluation Platform

An end-to-end, academic-grade **Resume-to-Job Description Analyzer**, **Vector Space Evaluator**, and **Conversational AI Co-Pilot** built with React 19, TypeScript, Express, Vanta.js 3D WebGL, and deterministic NLP algorithms.

Upload a PDF, DOCX, or TXT resume (or paste text) to analyze multi-dimensional TF-IDF vector similarity against job descriptions, extract named entities, inspect N-Gram heatmaps, explore interactive NLP Pie Charts, and receive targeted course & video learning recommendations.

---

## 📚 Complete Syllabus & Course Outcome (CO1 - CO5) Alignment Matrix

This application was engineered to directly implement and demonstrate all 4 core modules of the academic Natural Language Processing (NLP) syllabus:

### 🔹 Module 1: Text Preprocessing & Feature Engineering (CO1, CO5)
| Syllabus Concept | Implementation File | Functions / Methods | How It Is Used in This Project |
| :--- | :--- | :--- | :--- |
| **Text Normalization** | [`src/nlp/nlp-engine.ts`](file:///c:/Users/Admin/Downloads/ai-resume-analyzer%20%282%29/src/nlp/nlp-engine.ts) | `cleanText()` | Strips URLs, email addresses, special symbols, and converts text to lowercase for consistent comparison. |
| **Tokenization** | [`src/nlp/nlp-engine.ts`](file:///c:/Users/Admin/Downloads/ai-resume-analyzer%20%282%29/src/nlp/nlp-engine.ts) | `tokenize()` | Splits raw resume/JD text into clean, individual word tokens using regex word boundaries. |
| **Stopword Removal** | [`src/nlp/nlp-engine.ts`](file:///c:/Users/Admin/Downloads/ai-resume-analyzer%20%282%29/src/nlp/nlp-engine.ts) | `removeStopwords()` | Filters out non-informative high-frequency English words (`the`, `and`, `is`, `for`) so matching focuses on domain terms. |
| **Rule-Based Lemmatization** | [`src/nlp/nlp-engine.ts`](file:///c:/Users/Admin/Downloads/ai-resume-analyzer%20%282%29/src/nlp/nlp-engine.ts) | `lemmatize()` | Reduces plural nouns (`skills` → `skill`) and verb inflections (`developing` → `develop`) to canonical base forms. |
| **Feature Engineering (N-Grams)** | [`src/nlp/nlp-engine.ts`](file:///c:/Users/Admin/Downloads/ai-resume-analyzer%20%282%29/src/nlp/nlp-engine.ts) | `extractNGrams()` | Generates Unigrams, Bigrams (`machine learning`), and Trigrams (`natural language processing`) for multi-word phrase matching. |
| **TF-IDF Vector Representation** | [`src/nlp/nlp-engine.ts`](file:///c:/Users/Admin/Downloads/ai-resume-analyzer%20%282%29/src/nlp/nlp-engine.ts) | `buildTFIDFModel()`, `vectorizeTFIDF()` | Constructs Bag-of-Words vocabulary and computes Term Frequency-Inverse Document Frequency weight vectors. |

---

### 🔹 Module 2: Linguistic & Statistical Analysis (CO2, CO5)
| Syllabus Concept | Implementation File | Functions / Methods | How It Is Used in This Project |
| :--- | :--- | :--- | :--- |
| **Linguistic Analysis** | [`src/nlp/nlp-engine.ts`](file:///c:/Users/Admin/Downloads/ai-resume-analyzer%20%282%29/src/nlp/nlp-engine.ts) | `extractSkills()` | Matches resume vocabulary against categorized skill lexicons (Languages, Frameworks, Cloud, Databases). |
| **Statistical Language Modeling** | [`src/components/NGramHeatmap.tsx`](file:///c:/Users/Admin/Downloads/ai-resume-analyzer%20%282%29/src/components/NGramHeatmap.tsx) | `NGramHeatmap` | Visualizes N-gram frequency distribution and term likelihood overlap between resume and job description. |
| **Named Entity Recognition (NER)** | [`src/nlp/nlp-engine.ts`](file:///c:/Users/Admin/Downloads/ai-resume-analyzer%20%282%29/src/nlp/nlp-engine.ts) | `extractEntities()` | Rule-based NER classifier extracting candidate names, organizations, academic qualifications, and timelines. |
| **Vector Space Model & Cosine Sim** | [`src/nlp/nlp-engine.ts`](file:///c:/Users/Admin/Downloads/ai-resume-analyzer%20%282%29/src/nlp/nlp-engine.ts) | `cosineSimilarity()` | Calculates the dot product divided by Euclidean norms between resume and JD vectors to produce the 0–100% Match Score. |
| **Information Retrieval Ranking** | [`src/components/nlp/NLPPlatform.tsx`](file:///c:/Users/Admin/Downloads/ai-resume-analyzer%20%282%29/src/components/nlp/NLPPlatform.tsx) | `BM25 Module` | Educational demonstration of ranked information retrieval and term relevance scoring. |

---

### 🔹 Module 3: Syntactic Processing & Classical NLP Tasks (CO3, CO5)
| Syllabus Concept | Implementation File | Functions / Methods | How It Is Used in This Project |
| :--- | :--- | :--- | :--- |
| **Parts-of-Speech (POS) Tagging** | [`src/nlp/nlp-engine.ts`](file:///c:/Users/Admin/Downloads/ai-resume-analyzer%20%282%29/src/nlp/nlp-engine.ts) | `evaluateQuality()` | Action verb pattern matcher identifying high-impact leadership and engineering verbs (`engineered`, `spearheaded`). |
| **Lexical Density & Readability** | [`src/components/NLPAnalyticsCharts.tsx`](file:///c:/Users/Admin/Downloads/ai-resume-analyzer%20%282%29/src/components/NLPAnalyticsCharts.tsx) | `TTR & Readability` | Computes Type-Token Ratio (TTR vocabulary richness) and Flesch Reading Ease score. |
| **Text Classification & ATS Audit** | [`src/components/Dashboard.tsx`](file:///c:/Users/Admin/Downloads/ai-resume-analyzer%20%282%29/src/components/Dashboard.tsx) | `getAtsStatus()` | Classifies candidates into hiring tiers (*High Hiring Probability*, *Moderate ATS Alignment*, *Critical Gaps Detected*). |
| **Model Evaluation Metrics** | [`src/components/NLPTechPieCharts.tsx`](file:///c:/Users/Admin/Downloads/ai-resume-analyzer%20%282%29/src/components/NLPTechPieCharts.tsx) | `NLPTechPieCharts` | Interactive SVG Pie Charts illustrating skill taxonomy, matched vs missing keyword ratios, and entity distribution. |

---

### 🔹 Module 4: Conversational Systems & Integrated NLP Pipelines (CO4, CO5)
| Syllabus Concept | Implementation File | Functions / Methods | How It Is Used in This Project |
| :--- | :--- | :--- | :--- |
| **Conversational Analysis & Intent** | [`src/nlp/chatbot-engine.ts`](file:///c:/Users/Admin/Downloads/ai-resume-analyzer%20%282%29/src/nlp/chatbot-engine.ts) | `processChatMessage()` | Slot-filling & intent recognition mapping user queries to dialogue actions (*Resume Summary*, *ATS Tips*, *Mock Interview*). |
| **Dual Dialogue Agent Architecture** | [`src/nlp/gemini-service.ts`](file:///c:/Users/Admin/Downloads/ai-resume-analyzer%20%282%29/src/nlp/gemini-service.ts) | `getGeminiChatResponse()` | Combines rule-based dialogue fallback with Google Gemini Generative AI for real-time career coaching. |
| **Role & Experience Prediction** | [`src/components/RecommendationsHub.tsx`](file:///c:/Users/Admin/Downloads/ai-resume-analyzer%20%282%29/src/components/RecommendationsHub.tsx) | `getPredictedRole()` | Predicts candidate target role, experience level, and maps missing skills to online courses (Coursera, Udemy) and video tutorials. |
| **End-to-End Integrated NLP Pipeline** | [`server.ts`](file:///c:/Users/Admin/Downloads/ai-resume-analyzer%20%282%29/server.ts) | `/api/analyze` | Complete pipeline: Document Extraction → Preprocessing → TF-IDF Vectorization → Cosine Matching → AI Co-Pilot → SQLite Persistence. |

---

## 🌟 Key Application Features

1. **Deterministic TF-IDF & Cosine Similarity Match Engine**: Objective, transparent vector-space scoring without black-box bias.
2. **Interactive SVG NLP Pie & Donut Charts**: 4 visual charts mapping skill taxonomy, keyword match coverage, NER entities, and lexical token density.
3. **Smart Role Prediction & Learning Hub**: Predicts job roles, experience levels, and recommends targeted certification courses (Coursera, Udemy, edX) and YouTube video tutorials.
4. **Vanta.js BIRDS 3D WebGL Background**: Animated dark cosmic theme background powered by Three.js & Vanta.js.
5. **AI Career Co-Pilot & Mock Interviewer**: Conversational AI assistant grounded in the candidate's resume context.
6. **SQLite History & CSV Dataset Export**: Full audit history persistence with instant SQLite querying and downloadable CSV reports.

---

## 🚀 Main Analysis Workflow

```text
Uploaded Resume (PDF / DOCX / TXT) + Job Specification
        ↓
Text Normalization, Cleaning & Regex Delimitation
        ↓
Tokenization → Stopword Removal → Rule-Based Lemmatization
        ↓
N-Gram Extraction (Unigrams, Bigrams, Trigrams)
        ↓
TF-IDF Term Weighting Matrix Construction
        ↓
Cosine Similarity Vector Distance Computation (0 – 100% Score)
        ↓
Named Entity Recognition (NER) & Skill Taxonomy Classifier
        ↓
Role Prediction, Course Recommendations & Video Tutorial Library
        ↓
Conversational AI Co-Pilot Dialogue Agent & SQLite Audit Persistence
```

---

## 🛠️ Tech Stack & Dependencies

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Lucide Icons, Motion (Framer Motion)
- **3D Graphics & Animations**: Three.js, Vanta.js BIRDS 3D WebGL Engine
- **Backend**: Node.js, Express, Multer (file parsing), SQLite3 (`better-sqlite3`)
- **Document Extractors**: `pdf-parse` (PDF extraction), `mammoth` (DOCX extraction)
- **Generative AI SDK**: `@google/genai` (Google Gemini API integration)

---

## 💻 Installation & Local Setup

### Prerequisites
- Node.js (v20.0.0 or higher)
- npm (v9.0.0 or higher)

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/jayraj175coder/NLP_Resume_Analyzer.git
cd NLP_Resume_Analyzer
npm ci
```

### 2. Configure Environment Variables (Optional)
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
*(Note: The core TF-IDF vector matching engine operates 100% offline without any API key required).*

### 3. Run Development Server
```bash
npm run dev
```
Open `http://localhost:3000` in your web browser.

---

## 🧪 Verification & Build Commands

To run TypeScript verification and production build checks:
```bash
npm run verify
```

To start the production server:
```bash
npm run build
npm start
```

---

## 📜 Academic License & Author
- **Author**: Jayraj Code Laboratory
- **Project**: Academic Microproject Report & NLP Evaluation Platform
- **License**: MIT License
