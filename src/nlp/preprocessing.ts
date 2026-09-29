import { PreprocessingResult } from "../types/nlp";
import { STOPWORDS } from "./nlp-engine";

/**
 * Standard Porter Stemmer Algorithm implementation
 */
export function porterStem(word: string): string {
  let w = word.toLowerCase().trim();
  if (w.length <= 2) return w;

  // Step 1a: sses -> ss, ies -> i, ss -> ss, s -> ''
  if (w.endsWith("sses")) w = w.slice(0, -2);
  else if (w.endsWith("ies")) w = w.slice(0, -2);
  else if (w.endsWith("ss")) { /* keep */ }
  else if (w.endsWith("s")) w = w.slice(0, -1);

  // Step 1b: eed, ed, ing
  if (w.endsWith("eed")) {
    if (w.length > 4) w = w.slice(0, -1);
  } else if (w.endsWith("ed")) {
    const base = w.slice(0, -2);
    if (/[aeiou]/.test(base)) {
      w = base;
      if (w.endsWith("at") || w.endsWith("bl") || w.endsWith("iz")) w += "e";
      else if (w.length > 2 && w[w.length - 1] === w[w.length - 2] && !/[lsz]/.test(w[w.length - 1])) {
        w = w.slice(0, -1);
      }
    }
  } else if (w.endsWith("ing")) {
    const base = w.slice(0, -3);
    if (/[aeiou]/.test(base)) {
      w = base;
      if (w.endsWith("at") || w.endsWith("bl") || w.endsWith("iz")) w += "e";
      else if (w.length > 2 && w[w.length - 1] === w[w.length - 2] && !/[lsz]/.test(w[w.length - 1])) {
        w = w.slice(0, -1);
      }
    }
  }

  // Step 1c: y -> i if preceded by consonant
  if (w.endsWith("y") && w.length > 2 && !/[aeiou]/.test(w[w.length - 2])) {
    w = w.slice(0, -1) + "i";
  }

  // Step 2: Step 2 suffixes
  const step2Map: { [key: string]: string } = {
    ational: "ate",
    tional: "tion",
    enci: "ence",
    anci: "ance",
    izer: "ize",
    abli: "able",
    alli: "al",
    entli: "ent",
    eli: "e",
    ousli: "ous",
    ization: "ize",
    ation: "ate",
    ator: "ate",
    alism: "al",
    iveness: "ive",
    fulness: "ful",
    ousness: "ous",
    aliti: "al",
    iviti: "ive",
    biliti: "ble"
  };

  for (const [suffix, rep] of Object.entries(step2Map)) {
    if (w.endsWith(suffix) && w.length - suffix.length > 2) {
      w = w.slice(0, -suffix.length) + rep;
      break;
    }
  }

  // Step 3: Step 3 suffixes
  const step3Map: { [key: string]: string } = {
    icate: "ic",
    ative: "",
    alize: "al",
    iciti: "ic",
    ical: "ic",
    ful: "",
    ness: ""
  };
  for (const [suffix, rep] of Object.entries(step3Map)) {
    if (w.endsWith(suffix) && w.length - suffix.length > 2) {
      w = w.slice(0, -suffix.length) + rep;
      break;
    }
  }

  // Step 4: Step 4 suffixes
  const step4List = ["al", "ance", "ence", "er", "ic", "able", "ible", "ant", "ement", "ment", "ent", "ou", "ism", "ate", "iti", "ous", "ive", "ize"];
  for (const suffix of step4List) {
    if (w.endsWith(suffix) && w.length - suffix.length > 3) {
      w = w.slice(0, -suffix.length);
      break;
    }
  }

  // Step 5: trailing e
  if (w.endsWith("e") && w.length > 4) {
    w = w.slice(0, -1);
  }

  return w;
}

/**
 * Snowball (Porter2) Stemmer variant simulation
 */
export function snowballStem(word: string): string {
  let w = word.toLowerCase().trim();
  if (w.length <= 2) return w;

  // Snowball has special handling for 'y', 'ly', 'ingly', etc.
  if (w.endsWith("ingly")) {
    w = w.slice(0, -5);
  } else if (w.endsWith("edly")) {
    w = w.slice(0, -4);
  } else if (w.endsWith("ly")) {
    w = w.slice(0, -2);
  } else {
    w = porterStem(w);
  }

  if (w.endsWith("e") && w.length > 3) {
    w = w.slice(0, -1);
  }
  return w;
}

/**
 * Levenshtein distance for spelling correction
 */
export function levenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = [];
  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }
  return matrix[b.length][a.length];
}

const COMMON_TECH_LEXICON = [
  "javascript", "typescript", "python", "react", "angular", "fastapi", "django", "express",
  "database", "postgresql", "mongodb", "developer", "engineering", "architecture", "microservices",
  "kubernetes", "docker", "pipeline", "optimization", "performance", "deployment", "experience",
  "responsible", "implemented", "leadership", "management", "communication", "collaborative",
  "machine", "learning", "intelligence", "algorithms", "framework", "production", "container"
];

/**
 * Basic Spell Checker based on distance to dictionary
 */
export function findSpellingCorrections(words: string[]): { original: string; corrected: string; confidence: number }[] {
  const corrections: { original: string; corrected: string; confidence: number }[] = [];
  const seen = new Set<string>();

  for (const w of words) {
    const clean = w.toLowerCase().replace(/[^a-z]/g, "");
    if (clean.length < 4 || seen.has(clean) || COMMON_TECH_LEXICON.includes(clean)) continue;
    seen.add(clean);

    let bestMatch = "";
    let minDistance = 999;

    for (const dictWord of COMMON_TECH_LEXICON) {
      const dist = levenshteinDistance(clean, dictWord);
      if (dist > 0 && dist <= 2 && dist < minDistance) {
        minDistance = dist;
        bestMatch = dictWord;
      }
    }

    if (bestMatch && minDistance <= 2) {
      const confidence = Math.round((1 - minDistance / Math.max(clean.length, bestMatch.length)) * 100);
      corrections.push({ original: w, corrected: bestMatch, confidence });
    }
  }

  return corrections.slice(0, 8);
}

/**
 * Execute full advanced preprocessing pipeline
 */
export function runAdvancedPreprocessing(text: string, customStopwords?: Set<string>): PreprocessingResult {
  const rawText = text || "";
  const stopwordsToUse = customStopwords || STOPWORDS;

  // 1. Sentence Tokenization (Regex accounting for abbreviations)
  const sentenceTokens = rawText
    .split(/(?<=[.?!])\s+(?=[A-Z0-9])/g)
    .map(s => s.trim())
    .filter(s => s.length > 0);

  // 2. Normalization: strip URLs, emails, special noise, normalize unicode
  const normalizedText = rawText
    .normalize("NFKD")
    .replace(/[^\x00-\x7F]/g, "")
    .replace(/\s+/g, " ")
    .trim();

  // 3. Word Tokenization
  const wordTokens = normalizedText
    .split(/[\s,.:;!?()\[\]"'/\\#+*-]+/g)
    .map(t => t.trim())
    .filter(t => t.length > 0);

  // 4. Lowercasing
  const lowercasedTokens = wordTokens.map(t => t.toLowerCase());

  // 5. Stopword removal
  const removedStopwords: string[] = [];
  const filteredTokens = lowercasedTokens.filter(token => {
    if (stopwordsToUse.has(token)) {
      removedStopwords.push(token);
      return false;
    }
    return true;
  });

  // 6. Porter vs Snowball Stemming
  const uniqueFiltered = Array.from(new Set(filteredTokens)).slice(0, 40);
  const porterStemmed = uniqueFiltered.map(token => ({
    token,
    stem: porterStem(token)
  }));
  const snowballStemmed = uniqueFiltered.map(token => ({
    token,
    stem: snowballStem(token)
  }));

  // 7. Lemmatization
  const lemmatized = uniqueFiltered.map(token => {
    let lemma = token;
    let pos = "Noun";
    if (token.endsWith("ing")) {
      lemma = token.slice(0, -3);
      pos = "Verb (Gerund)";
    } else if (token.endsWith("ed")) {
      lemma = token.slice(0, -2);
      pos = "Verb (Past)";
    } else if (token.endsWith("s") && !token.endsWith("ss")) {
      lemma = token.slice(0, -1);
      pos = "Noun (Plural)";
    }
    return { token, lemma, pos };
  });

  // 8. Spelling corrections
  const spellingCorrections = findSpellingCorrections(wordTokens);

  const charCount = rawText.length;
  const wordCount = wordTokens.length;
  const sentenceCount = sentenceTokens.length || 1;
  const uniqueWords = new Set(lowercasedTokens).size;
  const avgWordLength = wordCount > 0 ? +(charCount / wordCount).toFixed(2) : 0;
  const avgSentenceLength = sentenceCount > 0 ? +(wordCount / sentenceCount).toFixed(1) : 0;

  return {
    originalText: rawText,
    sentenceTokens,
    wordTokens,
    lowercasedTokens,
    filteredTokens,
    removedStopwords,
    porterStemmed,
    snowballStemmed,
    lemmatized,
    spellingCorrections,
    normalizedText,
    stats: {
      charCount,
      wordCount,
      sentenceCount,
      uniqueWords,
      stopwordsCount: removedStopwords.length,
      avgWordLength,
      avgSentenceLength
    }
  };
}
