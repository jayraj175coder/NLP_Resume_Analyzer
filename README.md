# NLP Resume Analyzer

A full-stack resume-to-job-description analyzer built with React, Express, TypeScript, and deterministic NLP techniques. Upload a PDF, DOCX, or TXT resume (or paste text) to compare it with a job description, identify matched and missing skills, and generate ATS-oriented recommendations.

## Highlights

- PDF, DOCX, and TXT extraction with a 5 MB upload limit
- TF-IDF vectorization and cosine-similarity matching
- Skill extraction, section detection, quality checks, and report history
- Rule-based recommendations that work without an external API key
- Production Express server that serves the Vite single-page application
- Render blueprint, health endpoint, and GitHub Actions verification

## NLP techniques from the syllabus

The project uses the following techniques in the actual resume-analysis flow. They are implemented in TypeScript in `src/nlp/nlp-engine.ts`; no pretrained model is required for the core score.

| Syllabus technique | How it is implemented | How it is used in this project |
| --- | --- | --- |
| Text extraction | `pdf-parse` reads PDF files, `mammoth` reads DOCX files, and TXT files are decoded as UTF-8. | Converts the uploaded resume into plain text before NLP processing. |
| Text normalization | Text is lower-cased; extra whitespace, URLs, email addresses, phone numbers, and unsupported symbols are removed. | Reduces noise so `Python`, `python`, and `PYTHON` can be compared consistently. |
| Tokenization | Cleaned text is split into word tokens using whitespace and punctuation delimiters. | Produces the individual terms used by the downstream NLP stages. |
| Stop-word removal | A standard English stop-word set removes high-frequency words such as `the`, `and`, and `is`. | Makes the comparison focus on meaningful technical and domain words. |
| Rule-based lemmatization | Suffix rules reduce variants such as plural `skills` and verb forms ending in `-ing` or `-ed` toward a base form. | Improves matching when resume and job description use different grammatical forms of the same word. |
| N-grams | Unigrams, bigrams, and trigrams are generated from the lemmatized tokens. | Supports inspection of important one-word and multi-word keyword patterns. |
| Term Frequency (TF) | Each term count is divided by the number of tokens in its document. | Measures how important a word is inside a resume or job description. |
| Inverse Document Frequency (IDF) | IDF is calculated across the resume and job-description documents with smoothing. | Reduces the influence of words that occur in both documents and gives more weight to distinguishing terms. |
| TF-IDF vectorization | Every document becomes a vector of TF-IDF weights over a shared vocabulary. | Creates the numerical representation used for matching. |
| Cosine similarity | The dot product of the two TF-IDF vectors is divided by the product of their magnitudes. | The result is converted to the resume–job match percentage shown in the dashboard. |
| Lexicon/dictionary-based information extraction | The resume and job description are matched against categorized skill dictionaries using word-boundary regular expressions. | Finds skills present in the resume and identifies skills requested in the job description but missing from the resume. |
| Rule-based Named Entity Recognition (NER) | Regular expressions and small lexicons identify names, organizations, education, and dates. | Extracts candidate details and demonstrates NER concepts in the NLP Learning Lab. |
| Rule-based document segmentation | Common headings such as `Education`, `Experience`, `Skills`, and `Projects` are detected with regular expressions. | Checks whether an ATS-friendly resume has important sections. |
| Keyword-frequency analysis | Terms are counted and skills repeated four or more times are flagged. | Detects possible keyword stuffing and provides quality feedback. |

### Main analysis pipeline

```text
Resume (PDF/DOCX/TXT) + Job Description
        -> text extraction and normalization
        -> tokenization -> stop-word removal -> lemmatization
        -> TF-IDF vectors -> cosine similarity -> match percentage
        -> skill/NER/section rules -> ATS feedback and recommendations
```

### NLP Learning Lab modules

The interface also contains an **NLP Learning Lab** for demonstrating additional syllabus concepts visually: Porter and Snowball stemming, sentence tokenization, Bag of Words, feature hashing, n-grams, advanced regex/lexicon NER, and BM25 information retrieval ranking.

The evaluation-metrics screen is an educational illustration of confusion matrices, precision, recall, F1-score, ROUGE, BLEU, and perplexity. It is **not** presented as accuracy measured from a separately trained production classifier. This distinction is important for an honest project demonstration.

### How to explain the match score

The core score is based on lexical similarity, not a claim that the system understands every synonym. For example, a resume containing `React`, `TypeScript`, and `Docker` will score higher for a job description containing the same important terms. The matching is transparent and suitable for a microproject demonstration.

## Run locally

Prerequisites: Node.js 20 or later and npm.

```bash
git clone https://github.com/jayraj175coder/NLP_Resume_Analyzer.git
cd NLP_Resume_Analyzer
cp .env.example .env
npm ci
npm run dev
```

Open `http://localhost:3000`. The core NLP analysis works without any API key.

### Production build

```bash
npm run verify
NODE_ENV=production npm start
```

On Windows PowerShell, use:

```powershell
$env:NODE_ENV = "production"
npm start
```

## Deploy to Render

This repository includes `render.yaml`, so it can be deployed as a Blueprint.

1. Push the `main` branch to GitHub.
2. In Render, choose **New +** → **Blueprint** and select this repository.
3. Confirm the service settings from `render.yaml`.
4. The core analysis needs no secret. Optional external-review settings can be added only if required.
5. Deploy. Render uses `npm ci && npm run build`, starts with `npm start`, and checks `/api/health`.

The deployed service uses Render's assigned `PORT` automatically. Report history is stored in `DATA_DIR` (default: `.data`). Render's filesystem is ephemeral unless a persistent disk is attached; set `DATA_DIR` to the disk mount path when persistent report history is required.

## Environment variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `NODE_ENV` | No | Use `production` when serving the built app. |
| `PORT` | No | HTTP port; Render provides this automatically. |
| `GEMINI_API_KEY` | No | Optional external-review integration; not required by the NLP pipeline. |
| `GEMINI_MODEL` | No | Model name for the optional external-review integration. |
| `DATA_DIR` | No | Directory for local report history. |

Never commit `.env` or a real API key. `.env` and runtime report data are ignored by Git.

## HTTP API

| Method | Route | Description |
| --- | --- | --- |
| `GET` | `/api/health` | Liveness probe for Render and monitoring. |
| `POST` | `/api/analyze` | Analyze `resumeFile` or `resumeText` with `jdText`. |
| `GET` | `/api/history` | List saved local reports. |
| `DELETE` | `/api/history/:id` | Remove one saved report. |
| `GET` | `/api/export/csv` | Download report history as CSV. |

The analysis endpoint accepts `multipart/form-data`. Supply `jdText` plus either `resumeText` or `resumeFile`.

## Optional Python demonstration backend

`python-backend/app.py` is a standalone FastAPI implementation useful for offline demonstrations. It is not part of the Render Node service.

```bash
pip install -r requirements.txt
uvicorn python-backend.app:app --reload --port 8000
```

## Verification

Run these checks before opening a pull request or deployment:

```bash
npm run verify
```

This runs TypeScript checking and the production build. GitHub Actions runs the same command on pushes and pull requests targeting `main`.
