import { FeatureEngineeringResult } from "../types/nlp";
import { STOPWORDS } from "./nlp-engine";

/**
 * Simple hashing function (FNV-1a / Murmur-like) for Feature Hashing
 */
function hashString(str: string, numBuckets: number): number {
  let hash = 2166136261;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return Math.abs(hash) % numBuckets;
}

/**
 * Generate N-Grams
 */
function generateNGramsList(tokens: string[], n: number): { gram: string; count: number }[] {
  const counts: { [gram: string]: number } = {};
  for (let i = 0; i <= tokens.length - n; i++) {
    const gram = tokens.slice(i, i + n).join(" ");
    counts[gram] = (counts[gram] || 0) + 1;
  }
  return Object.entries(counts)
    .map(([gram, count]) => ({ gram, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 20);
}

/**
 * Compute Feature Engineering matrices: Bag of Words, TF-IDF, Feature Hashing, N-Grams
 */
export function computeFeatureEngineering(
  text: string,
  corpusSecondaryText?: string,
  numBuckets = 16
): FeatureEngineeringResult {
  const cleanTokens = (text || "")
    .toLowerCase()
    .split(/[\s,.:;!?()\[\]"'/\\#+*-]+/g)
    .filter(t => t.length > 2 && !STOPWORDS.has(t));

  const secondaryTokens = (corpusSecondaryText || "")
    .toLowerCase()
    .split(/[\s,.:;!?()\[\]"'/\\#+*-]+/g)
    .filter(t => t.length > 2 && !STOPWORDS.has(t));

  // Build combined vocabulary
  const termCountsDoc1: { [w: string]: number } = {};
  cleanTokens.forEach(t => {
    termCountsDoc1[t] = (termCountsDoc1[t] || 0) + 1;
  });

  const termCountsDoc2: { [w: string]: number } = {};
  secondaryTokens.forEach(t => {
    termCountsDoc2[t] = (termCountsDoc2[t] || 0) + 1;
  });

  const allUniqueWords = Array.from(new Set([...Object.keys(termCountsDoc1), ...Object.keys(termCountsDoc2)]));
  const totalDocs = corpusSecondaryText ? 2 : 1;

  // 1. Vocabulary with Document Frequency and IDF
  const vocabulary = allUniqueWords.map(word => {
    let docFreq = 0;
    if (termCountsDoc1[word]) docFreq++;
    if (termCountsDoc2[word]) docFreq++;
    const count = (termCountsDoc1[word] || 0) + (termCountsDoc2[word] || 0);
    // Smooth IDF formula: log( (1 + N) / (1 + df) ) + 1
    const idf = +(Math.log((1 + totalDocs) / (1 + docFreq)) + 1).toFixed(4);
    return { word, count, docFreq, idf };
  }).sort((a, b) => b.count - a.count).slice(0, 30);

  // 2. Bag of Words vector (for current document)
  const bowVector = vocabulary.map(v => ({
    word: v.word,
    count: termCountsDoc1[v.word] || 0
  }));

  // 3. TF-IDF vector
  const totalDocWords = cleanTokens.length || 1;
  const tfidfVector = vocabulary.map(v => {
    const rawTf = (termCountsDoc1[v.word] || 0);
    const tf = +(rawTf / totalDocWords).toFixed(4);
    const tfidf = +(tf * v.idf).toFixed(4);
    return { word: v.word, tf, idf: v.idf, tfidf };
  }).sort((a, b) => b.tfidf - a.tfidf);

  // 4. Hashing Vectorizer (Feature Hashing trick)
  const bucketTracker: { [bucket: number]: string[] } = {};
  const hashingVector = vocabulary.slice(0, 16).map(v => {
    const bucket = hashString(v.word, numBuckets);
    if (!bucketTracker[bucket]) bucketTracker[bucket] = [];
    bucketTracker[bucket].push(v.word);
    const collision = bucketTracker[bucket].length > 1;
    const hashValue = "0x" + Math.abs(hashString(v.word, 65535)).toString(16).padStart(4, "0").toUpperCase();
    return {
      bucket,
      word: v.word,
      hashValue,
      collision
    };
  });

  // 5. N-Grams (Unigram, Bigram, Trigram)
  const unigrams = generateNGramsList(cleanTokens, 1);
  const bigrams = generateNGramsList(cleanTokens, 2);
  const trigrams = generateNGramsList(cleanTokens, 3);

  // Sparsity calculation
  const totalCells = vocabulary.length * totalDocs;
  const nonZeroCells = bowVector.filter(b => b.count > 0).length;
  const sparsity = totalCells > 0 ? +((1 - nonZeroCells / totalCells) * 100).toFixed(1) : 0;

  return {
    vocabulary,
    bowVector,
    tfidfVector,
    hashingVector,
    ngrams: {
      unigrams,
      bigrams,
      trigrams
    },
    matrixDimensions: {
      rows: totalDocs,
      cols: vocabulary.length,
      sparsity
    }
  };
}
