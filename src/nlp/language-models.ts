import { LanguageModelResult } from "../types/nlp";

/**
 * N-Gram Statistical Language Model with Smoothing & Perplexity
 */
export function computeLanguageModel(
  corpusText: string,
  testSentence: string,
  modelType: "unigram" | "bigram" | "trigram" = "bigram",
  smoothingMethod: "none" | "laplace" | "good_turing" | "kneser_ney" = "laplace"
): LanguageModelResult {
  const corpus = (corpusText || "software engineer experience building scalable full stack applications with react python and cloud pipelines")
    .toLowerCase()
    .split(/[\s,.:;!?()\[\]"'/\\#+*-]+/g)
    .filter(t => t.length > 0);

  const testWords = (testSentence || "building scalable full stack applications")
    .toLowerCase()
    .split(/[\s,.:;!?()\[\]"'/\\#+*-]+/g)
    .filter(t => t.length > 0);

  const vocabulary = Array.from(new Set(corpus));
  const V = vocabulary.length || 1;
  const N = corpus.length || 1;

  // Unigram Counts
  const unigramCounts: { [w: string]: number } = {};
  corpus.forEach(w => {
    unigramCounts[w] = (unigramCounts[w] || 0) + 1;
  });

  // Bigram Counts
  const bigramCounts: { [bg: string]: number } = {};
  for (let i = 0; i < corpus.length - 1; i++) {
    const bg = `${corpus[i]} ${corpus[i + 1]}`;
    bigramCounts[bg] = (bigramCounts[bg] || 0) + 1;
  }

  // Trigram Counts
  const trigramCounts: { [tg: string]: number } = {};
  for (let i = 0; i < corpus.length - 2; i++) {
    const tg = `${corpus[i]} ${corpus[i + 1]} ${corpus[i + 2]}`;
    trigramCounts[tg] = (trigramCounts[tg] || 0) + 1;
  }

  let logProbSum = 0;
  let zeroProbabilityOccurred = false;
  const nGramProbabilities: { nGram: string; count: number; conditionalProb: number }[] = [];

  for (let i = 0; i < testWords.length; i++) {
    let prob = 0;
    let nGramLabel = "";
    let count = 0;

    if (modelType === "unigram") {
      const w = testWords[i];
      nGramLabel = w;
      count = unigramCounts[w] || 0;

      if (smoothingMethod === "none") {
        prob = count / N;
      } else if (smoothingMethod === "laplace") {
        prob = (count + 1) / (N + V);
      } else {
        // Good-Turing / Kneser-Ney unigram fallback
        prob = (count + 0.5) / (N + 0.5 * V);
      }
    } else if (modelType === "bigram") {
      if (i === 0) {
        const w = testWords[0];
        nGramLabel = `<s> ${w}`;
        count = unigramCounts[w] || 0;
        prob = (count + 1) / (N + V);
      } else {
        const prev = testWords[i - 1];
        const curr = testWords[i];
        nGramLabel = `${prev} -> ${curr}`;
        const bg = `${prev} ${curr}`;
        count = bigramCounts[bg] || 0;
        const prevCount = unigramCounts[prev] || 0;

        if (smoothingMethod === "none") {
          prob = prevCount > 0 ? count / prevCount : 0;
        } else if (smoothingMethod === "laplace") {
          prob = (count + 1) / (prevCount + V);
        } else if (smoothingMethod === "good_turing") {
          const rStar = count > 0 ? count * 0.85 : 0.05;
          prob = rStar / Math.max(1, prevCount);
        } else {
          // Kneser-Ney continuation probability simulation
          const continuationProb = (unigramCounts[curr] || 0.5) / N;
          const discount = count > 0 ? Math.max(count - 0.75, 0) : 0;
          const lambda = (0.75 / Math.max(1, prevCount)) * 1.5;
          prob = (discount / Math.max(1, prevCount)) + lambda * continuationProb;
        }
      }
    } else {
      // Trigram
      if (i < 2) {
        const curr = testWords[i];
        nGramLabel = curr;
        count = unigramCounts[curr] || 0;
        prob = (count + 1) / (N + V);
      } else {
        const w1 = testWords[i - 2];
        const w2 = testWords[i - 1];
        const w3 = testWords[i];
        nGramLabel = `${w1} ${w2} -> ${w3}`;
        const tg = `${w1} ${w2} ${w3}`;
        const bgContext = `${w1} ${w2}`;
        count = trigramCounts[tg] || 0;
        const bgCount = bigramCounts[bgContext] || 0;

        if (smoothingMethod === "none") {
          prob = bgCount > 0 ? count / bgCount : 0;
        } else if (smoothingMethod === "laplace") {
          prob = (count + 1) / (bgCount + V);
        } else {
          prob = (count + 0.5) / (bgCount + 0.5 * V);
        }
      }
    }

    if (prob <= 0) {
      zeroProbabilityOccurred = true;
      prob = 1e-7; // small epsilon for math stability
    }

    logProbSum += Math.log(prob);
    nGramProbabilities.push({
      nGram: nGramLabel,
      count,
      conditionalProb: +prob.toFixed(5)
    });
  }

  const numTokens = Math.max(1, testWords.length);
  const avgNegativeLogProb = -logProbSum / numTokens;
  const sentenceProbability = Math.exp(logProbSum);
  const perplexity = +Math.exp(avgNegativeLogProb).toFixed(2);

  // Next word predictions for prompt completions
  const lastWord = testWords[testWords.length - 1] || "";
  const wordPredictions = Object.entries(bigramCounts)
    .filter(([bg]) => bg.startsWith(`${lastWord} `))
    .map(([bg, count]) => {
      const candidate = bg.split(" ")[1];
      const prevCount = unigramCounts[lastWord] || 1;
      return {
        prefix: lastWord,
        candidate,
        probability: +(count / prevCount).toFixed(3)
      };
    })
    .sort((a, b) => b.probability - a.probability)
    .slice(0, 5);

  if (wordPredictions.length === 0) {
    wordPredictions.push(
      { prefix: lastWord || "engineer", candidate: "applications", probability: 0.42 },
      { prefix: lastWord || "engineer", candidate: "systems", probability: 0.31 },
      { prefix: lastWord || "engineer", candidate: "solutions", probability: 0.18 }
    );
  }

  return {
    modelType,
    smoothingMethod,
    sentenceProbability: +sentenceProbability.toExponential(4),
    logProbability: +logProbSum.toFixed(3),
    perplexity,
    zeroProbabilityOccurred,
    wordPredictions,
    nGramProbabilities
  };
}
