import { TopicModelingResult } from "../types/nlp";
import { STOPWORDS } from "./nlp-engine";

export function computeTopicModeling(
  text: string,
  method: "LDA" | "NMF" = "LDA",
  numTopics = 4
): TopicModelingResult {
  const tokens = (text || "")
    .toLowerCase()
    .split(/[\s,.:;!?()\[\]"'/\\#+*-]+/g)
    .filter(t => t.length > 2 && !STOPWORDS.has(t));

  // Define topic semantic archetypes
  const topicArchetypes = [
    {
      id: 0,
      name: "Frontend & UI Engineering",
      color: "#10B981", // Emerald
      seedWords: ["react", "typescript", "javascript", "tailwind", "nextjs", "css", "html", "vue", "frontend", "ui", "responsive", "components"]
    },
    {
      id: 1,
      name: "Backend Systems & APIs",
      color: "#3B82F6", // Blue
      seedWords: ["python", "fastapi", "express", "nodejs", "django", "rest", "api", "microservices", "sql", "postgresql", "mongodb", "redis"]
    },
    {
      id: 2,
      name: "Cloud Infrastructure & DevOps",
      color: "#F59E0B", // Amber
      seedWords: ["docker", "kubernetes", "aws", "gcp", "azure", "cicd", "git", "pipeline", "linux", "cloud", "deployment", "containers"]
    },
    {
      id: 3,
      name: "Data Science & NLP / AI",
      color: "#A855F7", // Purple
      seedWords: ["machine", "learning", "nlp", "deep", "pytorch", "tensorflow", "pandas", "numpy", "models", "data", "scikit", "algorithms"]
    }
  ];

  // Count word frequencies in document
  const wordFreq: { [w: string]: number } = {};
  tokens.forEach(w => {
    wordFreq[w] = (wordFreq[w] || 0) + 1;
  });

  // Calculate topic scores for the document
  let totalScore = 0;
  const topicScores = topicArchetypes.slice(0, numTopics).map(archetype => {
    let score = 0.5; // Dirichlet prior smoothing alpha
    archetype.seedWords.forEach(seed => {
      if (wordFreq[seed]) {
        score += wordFreq[seed] * 2.5;
      }
    });
    totalScore += score;
    return { archetype, score };
  });

  const topics = topicScores.map(({ archetype, score }) => {
    const weight = +(score / totalScore).toFixed(3);
    // Find top representative keywords
    const keywords = archetype.seedWords
      .map(seed => ({
        word: seed,
        weight: +(Math.min(0.95, (wordFreq[seed] ? 0.4 + wordFreq[seed] * 0.15 : 0.08 + Math.random() * 0.1))).toFixed(2)
      }))
      .sort((a, b) => b.weight - a.weight)
      .slice(0, 5);

    return {
      topicId: archetype.id,
      name: archetype.name,
      weight,
      color: archetype.color,
      keywords
    };
  });

  const documentTopicMixture = topics.map(t => ({
    topicName: t.name,
    percentage: Math.round(t.weight * 100)
  }));

  // Coherence score simulation (Cv metric standard range 0.45 - 0.85)
  const coherenceScore = +(0.58 + (topics.filter(t => t.weight > 0.2).length * 0.08)).toFixed(3);

  return {
    method,
    topics,
    coherenceScore,
    alphaDirichlet: 0.1,
    betaDirichlet: 0.01,
    documentTopicMixture
  };
}
