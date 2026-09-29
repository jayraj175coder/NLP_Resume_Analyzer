# AI Resume Analyzer using Natural Language Processing (NLP)

An intelligent, full-stack, enterprise-grade resume auditing and job matching platform built with **React, Node.js (Express), and Python (FastAPI)**. This application analyzes resumes against job descriptions from scratch using core NLP tokenization, lemmatization, and TF-IDF cosine similarity matrices, complemented by advanced LLM deep review.

This repository features two implementation stacks:
1. **Node.js + Express Full Stack Web App** (Active in Live Preview / Cloud Run deployment)
2. **Python + FastAPI Standalone Backend** (Excellent for college project offline demonstrations)

---

## 🚀 Key Features

* **Advanced Text Extraction**: Seamlessly parses resumes uploaded in `.pdf`, `.docx`, or `.txt` formats, or pasted as raw text.
* **Deterministic NLP Pipeline**: Engineered custom algorithms from scratch for:
  * Text cleaning and casing normalization.
  * Stopword filtering (with robust English dictionaries).
  * Rule-based suffix lemmatization.
  * N-Gram frequency distributions (Unigrams, Bigrams, Trigrams).
* **Semantic Compatibility Vectorization**: Implements Term Frequency - Inverse Document Frequency (TF-IDF) indexing and Cosine Similarity to compute a highly precise compatibility score.
* **Lexical Skill Comparison**: Maps resumes against detailed target job descriptions (JDs) to detect matches and extract crucial missing technical skills.
* **Custom Named Entity Recognition (NER)**: Identifies organizations, academic credentials, timelines, dates, and candidate names.
* **ATS Compatibility Audits**: Flags potential "keyword stuffing" (stuffing detectors), checks for contact credentials (email, linkedin, phone numbers), and evaluates section mapping.
* **Deep LLM Recommendations**: Generates personalized executive summaries, weaknesses reviews, actionable bullet-point rewrites, and optimization checklists using the Gemini API.
* **Admin Database History**: Saves past reports inside a durable SQLite-mimicked schema with options to delete, search, and download a compiled history `.csv`.
* **Professional Glassmorphic Dashboard**: A gorgeous interactive responsive layout crafted in deep indigo/cyan, featuring radial progress rings, dynamic custom SVG bar charts, and printable layouts.

---

## 📂 Project Structure

```text
resume-analyzer/
├── server.ts                  # Main Node.js full-stack Express server
├── package.json               # Node workspace configurations
├── requirements.txt           # Python backend library dependencies
├── python-backend/            # Python FastAPI implementation directory
│   ├── app.py                 # Core FastAPI backend entry
│   └── resume_analyzer_sqlite.db # Local SQLite database
├── src/
│   ├── App.tsx                # React application orchestration layer
│   ├── index.css              # Typography themes & animations
│   ├── main.tsx               # Frontend entry point
│   ├── types.ts               # Shared TypeScript models
│   ├── components/            # Modular frontend components
│   │   ├── Header.tsx         # Navigation & status bar
│   │   ├── UploadSection.tsx  # File drag-and-drop & paste textfields
│   │   ├── Dashboard.tsx      # Radial gauges, charts, & recommendations
│   │   └── HistorySection.tsx # Past reports table & CSV export
│   └── nlp/                   # Custom NLP Algorithms (TypeScript Core)
│       ├── nlp-engine.ts      # Custom Lemmatizer, Tokenizer, TF-IDF, Cosine Sim, & NER
│       ├── gemini-service.ts  # Gemini AI connector with graceful fallback
│       └── history-db.ts      # Flat-file database handling
└── README.md                  # Comprehensive documentation
```

---

## 🛠️ Installation & Setup

### Option 1: Running the Live Web Application (Node.js Full Stack)

To run the interactive, responsive full-stack platform:

```bash
# 1. Install Node.js dependencies
npm install

# 2. Run in development mode (launches Vite + Express on port 3000)
npm run dev

# 3. Compile production bundle
npm run build

# 4. Start production server
npm run start
```

### Option 2: Running the Python Standalone Backend (FastAPI + SQLite)

For offline demonstrations, local college labs, or pure Python executions:

```bash
# 1. Navigate to directory or keep in root and install packages
pip install -r requirements.txt

# 2. Start the FastAPI uvicorn server
uvicorn python-backend.app:app --reload --port 8000
```
*The FastAPI backend will launch on `http://localhost:8000` with automated interactive Swagger documentation available at `http://localhost:8000/docs`.*

---

## ⚙️ Algorithms & NLP Techniques Used

Our application executes text parsing in an ordered structural pipeline:

```text
User Input (Resume & JD)
       │
       ▼
Text Extraction (pdf-parse / mammoth)
       │
       ▼
Text Preprocessing (Casing, Special Character Stripping, URLs removal)
       │
       ▼
Tokenization (Splitting strings on whitespace and punctuation)
       │
       ▼
Stopword Filtering (Purging common English stop words)
       │
       ▼
Lemmatization (Rule-based suffix mapping to base lemma forms)
       │
       ▼
Vectorization (Building TF-IDF term-frequency matrices for the docs)
       │
       ▼
Cosine Similarity Assessment (Angle of intersection between vector space coordinates)
       │
       ▼
Result Generation (Visual graphs, ATS checklists, and custom NER extraction)
```

### Mathematical Formulations

#### 1. Term Frequency - Inverse Document Frequency (TF-IDF)
The importance of a term $t$ in a document $d$ within a collection $D$:
$$TF(t, d) = \frac{\text{Count of } t \text{ in } d}{\text{Total tokens in } d}$$
$$IDF(t, D) = \ln\left(1 + \frac{|D|}{1 + |\{d \in D : t \in d\}|}\right)$$
$$TF\text{-}IDF(t, d, D) = TF(t, d) \times IDF(t, D)$$

#### 2. Cosine Similarity
Calculates the cosine angle between the vectorized representation of the resume ($\vec{R}$) and job description ($\vec{JD}$):
$$\text{Similarity}(\vec{R}, \vec{JD}) = \frac{\vec{R} \cdot \vec{JD}}{\|\vec{R}\| \|\vec{JD}\|} = \frac{\sum_{i=1}^{n} R_i JD_i}{\sqrt{\sum_{i=1}^{n} R_i^2} \sqrt{\sum_{i=1}^{n} JD_i^2}}$$

---

## 🔮 Future Scope

* **Bi-directional PDF Parsing**: Rebuilding matching blocks directly into an exported optimized resume PDF.
* **Semantic Word Embeddings**: Integrating Word2Vec, GloVe, or BERT transformer embeddings to match synonymous descriptions (e.g., matching "Python scripting" directly with "FastAPI coding").
* **Continuous Multi-User Accounts**: Multi-tenant recruiter portals utilizing secure auth structures and durable PostgreSQL architectures.
* **Automated Job Scrapers**: Directly fetching active live job postings via API grounding to match candidates.
