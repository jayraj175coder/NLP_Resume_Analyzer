# NLP Resume Analyzer

A full-stack resume-to-job-description analyzer built with React, Express, TypeScript, and deterministic NLP techniques. Upload a PDF, DOCX, or TXT resume (or paste text) to compare it with a job description, identify matched and missing skills, and generate ATS-oriented recommendations.

## Highlights

- PDF, DOCX, and TXT extraction with a 5 MB upload limit
- TF-IDF vectorization and cosine-similarity matching
- Skill extraction, section detection, quality checks, and report history
- Optional Gemini review with a deterministic, no-key fallback
- Production Express server that serves the Vite single-page application
- Render blueprint, health endpoint, and GitHub Actions verification

## Run locally

Prerequisites: Node.js 20 or later and npm.

```bash
git clone https://github.com/jayraj175coder/NLP_Resume_Analyzer.git
cd NLP_Resume_Analyzer
cp .env.example .env
npm ci
npm run dev
```

Open `http://localhost:3000`. The application works without a Gemini key; adding one enables the optional AI review.

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
4. Add `GEMINI_API_KEY` only if Gemini-powered reviews are required.
5. Deploy. Render uses `npm ci && npm run build`, starts with `npm start`, and checks `/api/health`.

The deployed service uses Render's assigned `PORT` automatically. Report history is stored in `DATA_DIR` (default: `.data`). Render's filesystem is ephemeral unless a persistent disk is attached; set `DATA_DIR` to the disk mount path when persistent report history is required.

## Environment variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `NODE_ENV` | No | Use `production` when serving the built app. |
| `PORT` | No | HTTP port; Render provides this automatically. |
| `GEMINI_API_KEY` | No | Enables Gemini-generated resume reviews. |
| `GEMINI_MODEL` | No | Gemini model name; defaults to `gemini-2.5-flash`. |
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
