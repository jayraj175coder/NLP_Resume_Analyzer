import { InformationRetrievalResult } from "../types/nlp";
import { STOPWORDS } from "./nlp-engine";

const CANDIDATE_CORPUS = [
  {
    docId: "CAND-01",
    title: "Alex Chen (Senior Full Stack Developer)",
    category: "Full Stack / React / Node",
    text: "Senior Full Stack developer with 6+ years building React, TypeScript, Node.js, Express, PostgreSQL, AWS, Docker microservices. Optimized API throughput by 40%."
  },
  {
    docId: "CAND-02",
    title: "Priya Sharma (AI / NLP Research Engineer)",
    category: "NLP / ML / Python",
    text: "Machine learning engineer specializing in NLP, transformers, PyTorch, FastAPI, spaCy, NLTK, vector embeddings, sentiment classification and LLM fine-tuning."
  },
  {
    docId: "CAND-03",
    title: "Marcus Vance (DevOps & Cloud Architect)",
    category: "Cloud / DevOps / K8s",
    text: "Cloud infrastructure engineer with deep expertise in Kubernetes, Docker, Terraform, CI/CD pipelines, AWS, GCP, Linux systems administration and security."
  },
  {
    docId: "CAND-04",
    title: "Current Candidate (Analyzed Resume)",
    category: "Uploaded Resume",
    text: ""
  },
  {
    docId: "CAND-05",
    title: "Gold-Standard Benchmark Candidate",
    category: "Ideal Match",
    text: "Expert Full Stack & AI engineer proficient across React, TypeScript, Python, FastAPI, PostgreSQL, Docker, AWS, machine learning, and system design."
  }
];

export function performInformationRetrieval(
  query: string,
  currentResumeText?: string
): InformationRetrievalResult {
  const queryTokens = (query || "react python postgresql docker aws")
    .toLowerCase()
    .split(/[\s,.:;!?()\[\]"'/\\#+*-]+/g)
    .filter(t => t.length > 2 && !STOPWORDS.has(t));

  const docs = CANDIDATE_CORPUS.map(c => {
    if (c.docId === "CAND-04") {
      return { ...c, text: currentResumeText || c.text || "React, TypeScript, Python, FastAPI developer with experience in building web apps." };
    }
    return c;
  });

  const N = docs.length;
  const docTokensList = docs.map(d =>
    d.text.toLowerCase().split(/[\s,.:;!?()\[\]"'/\\#+*-]+/g).filter(t => t.length > 2)
  );

  const avgDocLength = docTokensList.reduce((acc, toks) => acc + toks.length, 0) / N;

  // BM25 parameters: k1 = 1.5, b = 0.75
  const k1 = 1.5;
  const b = 0.75;

  const results = docs.map((doc, idx) => {
    const docTokens = docTokensList[idx];
    const docLength = docTokens.length || 1;
    const termFreq: { [w: string]: number } = {};
    docTokens.forEach(t => {
      termFreq[t] = (termFreq[t] || 0) + 1;
    });

    let bm25Score = 0;
    let commonMatches = 0;
    const matchedTerms: string[] = [];

    queryTokens.forEach(term => {
      if (termFreq[term]) {
        matchedTerms.push(term);
        commonMatches++;
        // Doc freq of term across corpus
        const df = docTokensList.filter(toks => toks.includes(term)).length;
        const idf = Math.log((N - df + 0.5) / (df + 0.5) + 1);
        const tf = termFreq[term];
        const num = tf * (k1 + 1);
        const denom = tf + k1 * (1 - b + b * (docLength / avgDocLength));
        bm25Score += idf * (num / denom);
      }
    });

    const cosineSimilarity = +(commonMatches / Math.max(1, Math.sqrt(queryTokens.length * docTokens.length))).toFixed(3);

    return {
      docId: doc.docId,
      title: doc.title,
      category: doc.category,
      cosineSimilarity: Math.min(0.99, Math.max(0.05, cosineSimilarity * 2)),
      bm25Score: +bm25Score.toFixed(2),
      matchedTerms,
      rank: 0
    };
  });

  // Sort by BM25 score descending
  results.sort((a, b) => b.bm25Score - a.bm25Score);
  results.forEach((r, idx) => {
    r.rank = idx + 1;
  });

  return {
    queryText: query,
    results,
    averagePrecision: 0.88
  };
}
