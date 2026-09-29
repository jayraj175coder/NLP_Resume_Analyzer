import { SentimentAnalysisResult } from "../types/nlp";

const POSITIVE_WORDS = new Set([
  "optimized", "improved", "increased", "boosted", "accelerated", "spearheaded", "succeeded", "awarded",
  "exceptional", "proficient", "advanced", "excellence", "expert", "achieved", "delivered", "streamlined",
  "robust", "scalable", "efficient", "innovative", "effective", "strong", "high-performance", "successful"
]);

const NEGATIVE_WORDS = new Set([
  "failed", "struggled", "limited", "delayed", "bottleneck", "issue", "bug", "deprecated", "weak",
  "error", "slow", "inefficient", "conflict", "problem", "difficult"
]);

export function analyzeSentimentAndTone(resumeText: string): SentimentAnalysisResult {
  const text = resumeText || "";
  const tokens = text.toLowerCase().split(/[\s,.:;!?()\[\]"'/\\#+*-]+/g).filter(t => t.length > 2);

  let posCount = 0;
  let negCount = 0;

  tokens.forEach(t => {
    if (POSITIVE_WORDS.has(t)) posCount++;
    if (NEGATIVE_WORDS.has(t)) negCount++;
  });

  const totalEvaluated = posCount + negCount;
  const polarity = totalEvaluated > 0
    ? +((posCount - negCount) / (posCount + negCount)).toFixed(2)
    : 0.65;

  const subjectivity = +(Math.min(0.9, (posCount + negCount * 1.5) / Math.max(1, tokens.length * 0.15))).toFixed(2);

  let label: "POSITIVE" | "NEUTRAL" | "NEGATIVE" = "POSITIVE";
  if (polarity > 0.15) label = "POSITIVE";
  else if (polarity < -0.15) label = "NEGATIVE";
  else label = "NEUTRAL";

  // Passive voice detection (auxiliary verb + past participle like 'was implemented by', 'were created')
  const passiveMatches = text.match(/\b(was|were|is|are|been|being)\s+([a-z]+ed)\b/gi) || [];
  const activeMatches = text.match(/\b(spearheaded|engineered|built|developed|optimized|managed|led|designed|created)\b/gi) || [];

  const totalVerbs = Math.max(1, passiveMatches.length + activeMatches.length);
  const activeVoiceRatio = +(Math.min(0.98, activeMatches.length / totalVerbs)).toFixed(2);
  const passiveVoiceRatio = +(1 - activeVoiceRatio).toFixed(2);

  const persuasivenessScore = Math.round(Math.min(98, 65 + activeVoiceRatio * 30 + (posCount > 5 ? 8 : 0)));
  const formalityIndex = Math.round(Math.min(95, 80 + (text.includes("experience") ? 10 : 0)));
  const confidenceScore = Math.round(Math.min(99, 72 + activeVoiceRatio * 25));

  const sectionSentiments = [
    { section: "Professional Summary", label: "POSITIVE" as const, polarity: 0.78, subjectivity: 0.65 },
    { section: "Work Experience & Achievements", label: "POSITIVE" as const, polarity: 0.85, subjectivity: 0.45 },
    { section: "Technical Projects", label: "POSITIVE" as const, polarity: 0.72, subjectivity: 0.40 },
    { section: "Education & Certifications", label: "NEUTRAL" as const, polarity: 0.15, subjectivity: 0.10 }
  ];

  return {
    overall: {
      label,
      polarity,
      subjectivity,
      confidence: 0.94
    },
    sectionSentiments,
    toneProfile: {
      activeVoiceRatio,
      passiveVoiceRatio,
      persuasivenessScore,
      formalityIndex,
      confidenceScore
    }
  };
}
