import { LinguisticAnalysisResult } from "../types/nlp";

const PREFIXES = ["un", "re", "in", "im", "dis", "non", "pre", "post", "anti", "de", "over", "under", "sub", "super", "inter", "auto", "co", "micro", "multi"];
const DERIVATIONAL_SUFFIXES = ["tion", "sion", "ment", "ness", "ity", "ance", "ence", "able", "ible", "al", "ful", "less", "ize", "ify", "ate", "ive", "ous", "ist", "ism", "er", "or"];
const INFLECTIONAL_SUFFIXES = ["s", "es", "ed", "ing", "er", "est"];

const STRONG_ACTION_VERBS = [
  "architected", "engineered", "optimized", "accelerated", "spearheaded", "orchestrated",
  "deployed", "developed", "designed", "streamlined", "implemented", "scaled", "automated",
  "transformed", "collaborated", "managed", "delivered", "mentored", "formulated", "published"
];

const WEAK_VERBS = [
  "worked", "helped", "assisted", "did", "handled", "participated", "tried", "attempted", "was responsible for"
];

function countSyllables(word: string): number {
  let w = word.toLowerCase().replace(/(?:[^laeiouy]|ed|es|e)$/, "").replace(/^y/, "");
  const matches = w.match(/[aeiouy]{1,2}/g);
  return matches ? Math.max(1, matches.length) : 1;
}

export function analyzeLinguistics(text: string): LinguisticAnalysisResult {
  const rawText = text || "";
  const rawTokens = rawText
    .toLowerCase()
    .split(/[\s,.:;!?()\[\]"'/\\#+*-]+/g)
    .filter(t => t.length > 0 && /^[a-z]+$/.test(t));

  const sentences = rawText.split(/[.!?]+/g).filter(s => s.trim().length > 0);
  const sentenceCount = Math.max(1, sentences.length);
  const totalTokens = Math.max(1, rawTokens.length);

  // 1. Morphology Breakdown
  const uniqueTokensSample = Array.from(new Set(rawTokens)).slice(0, 25);
  const morphology = uniqueTokensSample.map(token => {
    let prefix: string | undefined;
    let suffix: string | undefined;
    let root = token;
    let type: "inflectional" | "derivational" | "root" = "root";

    // Prefix check
    for (const p of PREFIXES) {
      if (token.startsWith(p) && token.length > p.length + 3) {
        prefix = p;
        root = token.slice(p.length);
        type = "derivational";
        break;
      }
    }

    // Derivational suffix check
    for (const s of DERIVATIONAL_SUFFIXES) {
      if (root.endsWith(s) && root.length > s.length + 2) {
        suffix = s;
        root = root.slice(0, -s.length);
        type = "derivational";
        break;
      }
    }

    // Inflectional suffix check if not derivational
    if (!suffix) {
      for (const s of INFLECTIONAL_SUFFIXES) {
        if (root.endsWith(s) && root.length > s.length + 2) {
          suffix = s;
          root = root.slice(0, -s.length);
          type = "inflectional";
          break;
        }
      }
    }

    return { token, prefix, root, suffix, type };
  });

  // 2. Lexical Diversity Calculations
  const tokenFreq: { [w: string]: number } = {};
  rawTokens.forEach(t => {
    tokenFreq[t] = (tokenFreq[t] || 0) + 1;
  });

  const uniqueTypes = Object.keys(tokenFreq).length;
  const typeTokenRatio = +(uniqueTypes / totalTokens).toFixed(3); // TTR
  const hapaxLegomena = Object.values(tokenFreq).filter(c => c === 1).length;

  // Syllables and Complex Words (> 2 syllables)
  let totalSyllables = 0;
  let complexWordsCount = 0;
  rawTokens.forEach(w => {
    const syl = countSyllables(w);
    totalSyllables += syl;
    if (syl >= 3) complexWordsCount++;
  });

  // Readability Formulas
  // Flesch Reading Ease = 206.835 - 1.015 * (words/sentences) - 84.6 * (syllables/words)
  const wordsPerSentence = totalTokens / sentenceCount;
  const syllablesPerWord = totalTokens > 0 ? totalSyllables / totalTokens : 1;
  const fleschReadingEase = Math.max(0, Math.min(100, +(206.835 - 1.015 * wordsPerSentence - 84.6 * syllablesPerWord).toFixed(1)));

  // Flesch-Kincaid Grade Level = 0.39 * (words/sentences) + 11.8 * (syllables/words) - 15.59
  const fleschKincaidGrade = Math.max(1, +(0.39 * wordsPerSentence + 11.8 * syllablesPerWord - 15.59).toFixed(1));

  // Gunning Fog Index = 0.4 * [ (words/sentences) + 100 * (complex_words / words) ]
  const complexPercentage = totalTokens > 0 ? (complexWordsCount / totalTokens) * 100 : 0;
  const gunningFogIndex = +(0.4 * (wordsPerSentence + complexPercentage)).toFixed(1);

  // Coleman-Liau Index = 0.0588 * L - 0.296 * S - 15.8 (L = avg letters per 100 words, S = avg sentences per 100 words)
  const totalLetters = rawTokens.reduce((acc, w) => acc + w.length, 0);
  const L = (totalLetters / totalTokens) * 100;
  const S = (sentenceCount / totalTokens) * 100;
  const colemanLiauIndex = +(0.0588 * L - 0.296 * S - 15.8).toFixed(1);

  const readingTimeMinutes = +(totalTokens / 200).toFixed(1); // Standard 200 WPM
  const lexicalDensity = +((uniqueTypes / (totalTokens || 1)) * 100).toFixed(1);

  // 3. Syntax Complexity
  let complexSentences = 0;
  let compoundSentences = 0;
  let simpleSentences = 0;

  sentences.forEach(s => {
    const sLower = s.toLowerCase();
    const hasSubordinating = /\b(although|because|since|unless|whereas|while|if|after|before)\b/.test(sLower);
    const hasCoordinating = /\b(and|but|or|nor|for|yet|so)\b/.test(sLower);

    if (hasSubordinating) complexSentences++;
    else if (hasCoordinating) compoundSentences++;
    else simpleSentences++;
  });

  // 4. Semantics (Action Verbs, Weak Verbs, Metrics)
  const actionVerbsFound = Array.from(
    new Set(STRONG_ACTION_VERBS.filter(v => new RegExp(`\\b${v}\\b`, "i").test(rawText)))
  );

  const weakVerbsFound = Array.from(
    new Set(WEAK_VERBS.filter(v => new RegExp(`\\b${v}\\b`, "i").test(rawText)))
  );

  const metricsMatches = rawText.match(/\b\d+(\.\d+)?%\b|\b\$\d+(\.\d+)?(M|K|B)?\b|\b\d+x\b|\b\d+\s*(users|customers|requests|queries|rps|ms|seconds|engineers|members)\b/gi) || [];
  const quantifiedMetrics = Array.from(new Set(metricsMatches)).slice(0, 8);

  const industryJargon = Array.from(
    new Set(
      ["microservices", "latency", "throughput", "concurrency", "scalability", "pipeline", "distributed systems", "ci/cd", "restful api", "nosql", "containerization"]
        .filter(j => rawText.toLowerCase().includes(j))
    )
  );

  return {
    morphology,
    lexicon: {
      totalTokens,
      uniqueTypes,
      typeTokenRatio,
      hapaxLegomena,
      lexicalDensity,
      fleschReadingEase,
      fleschKincaidGrade,
      gunningFogIndex,
      colemanLiauIndex,
      readingTimeMinutes
    },
    syntax: {
      averageClauseCount: +(wordsPerSentence / 8).toFixed(1),
      complexSentences,
      simpleSentences,
      compoundSentences
    },
    semantics: {
      actionVerbsFound,
      weakVerbsFound,
      industryJargon,
      quantifiedMetrics
    }
  };
}
