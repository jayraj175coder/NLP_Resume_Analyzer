import { ClassificationResult } from "../types/nlp";

const CAREER_TRACKS = [
  {
    category: "Full Stack Engineer",
    icon: "Layers",
    keywords: ["react", "typescript", "javascript", "node", "express", "fullstack", "full stack", "mongodb", "postgresql", "tailwind", "html", "css"],
    basePrior: 0.20
  },
  {
    category: "AI & NLP Specialist",
    icon: "Brain",
    keywords: ["nlp", "machine learning", "deep learning", "pytorch", "transformers", "tensorflow", "llm", "bert", "embeddings", "tokenization", "spacy", "nltk", "scikit-learn"],
    basePrior: 0.18
  },
  {
    category: "Backend Systems Architect",
    icon: "Cpu",
    keywords: ["python", "fastapi", "django", "java", "golang", "microservices", "redis", "postgresql", "grpc", "rest api", "system design", "distributed"],
    basePrior: 0.16
  },
  {
    category: "DevOps & Cloud Engineer",
    icon: "Cloud",
    keywords: ["docker", "kubernetes", "aws", "gcp", "azure", "terraform", "ci/cd", "jenkins", "linux", "ansible", "monitoring", "prometheus"],
    basePrior: 0.15
  },
  {
    category: "Data Scientist / Analytics",
    icon: "BarChart3",
    keywords: ["pandas", "numpy", "sql", "analytics", "tableau", "statistics", "data pipeline", "spark", "hadoop", "visualization", "r"],
    basePrior: 0.12
  },
  {
    category: "Cybersecurity Analyst",
    icon: "ShieldAlert",
    keywords: ["security", "vulnerability", "encryption", "penetration", "soc", "firewall", "auth", "oauth", "jwt", "owasp", "threat"],
    basePrior: 0.10
  },
  {
    category: "Frontend UI/UX Specialist",
    icon: "Palette",
    keywords: ["css", "figma", "ui/ux", "wireframe", "accessibility", "wcag", "animation", "motion", "svg", "styling"],
    basePrior: 0.09
  }
];

export function classifyResume(
  text: string,
  modelType: "NaiveBayes" | "LogisticRegression" | "NeuralNetwork" = "NaiveBayes"
): ClassificationResult {
  const lower = (text || "").toLowerCase();

  const featureWeights: { feature: string; weight: number }[] = [];

  // Compute log likelihoods & Softmax
  const rawScores = CAREER_TRACKS.map(track => {
    let matchCount = 0;
    track.keywords.forEach(kw => {
      if (lower.includes(kw)) {
        matchCount++;
        featureWeights.push({ feature: `${track.category} -> ${kw}`, weight: +(0.45 + matchCount * 0.1).toFixed(2) });
      }
    });

    const score = Math.log(track.basePrior) + matchCount * 1.8;
    return {
      category: track.category,
      icon: track.icon,
      score
    };
  });

  // Softmax normalization
  const maxScore = Math.max(...rawScores.map(s => s.score));
  const expScores = rawScores.map(s => Math.exp(s.score - maxScore));
  const sumExp = expScores.reduce((a, b) => a + b, 0);

  const probabilities = rawScores.map((s, idx) => ({
    category: s.category,
    probability: +(expScores[idx] / sumExp).toFixed(3),
    icon: s.icon
  })).sort((a, b) => b.probability - a.probability);

  const best = probabilities[0];

  return {
    predictedClass: best.category,
    confidence: Math.round(best.probability * 100),
    probabilities,
    modelType,
    topContributingFeatures: featureWeights.sort((a, b) => b.weight - a.weight).slice(0, 8)
  };
}
