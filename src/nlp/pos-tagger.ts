import { POSTagToken } from "../types/nlp";

const POS_DICTIONARY: { [word: string]: { tag: string; cat: POSTagToken["category"]; desc: string } } = {
  // Pronouns
  i: { tag: "PRP", cat: "PRONOUN", desc: "Personal Pronoun" },
  we: { tag: "PRP", cat: "PRONOUN", desc: "Personal Pronoun" },
  you: { tag: "PRP", cat: "PRONOUN", desc: "Personal Pronoun" },
  they: { tag: "PRP", cat: "PRONOUN", desc: "Personal Pronoun" },
  my: { tag: "PRP$", cat: "PRONOUN", desc: "Possessive Pronoun" },
  our: { tag: "PRP$", cat: "PRONOUN", desc: "Possessive Pronoun" },

  // Determiners
  the: { tag: "DT", cat: "DETERMINER", desc: "Determiner / Definite Article" },
  a: { tag: "DT", cat: "DETERMINER", desc: "Determiner / Indefinite Article" },
  an: { tag: "DT", cat: "DETERMINER", desc: "Determiner / Indefinite Article" },
  this: { tag: "DT", cat: "DETERMINER", desc: "Demonstrative Determiner" },
  that: { tag: "DT", cat: "DETERMINER", desc: "Demonstrative Determiner" },
  all: { tag: "DT", cat: "DETERMINER", desc: "Determiner" },

  // Prepositions / Conjunctions
  in: { tag: "IN", cat: "PREPOSITION", desc: "Preposition" },
  on: { tag: "IN", cat: "PREPOSITION", desc: "Preposition" },
  at: { tag: "IN", cat: "PREPOSITION", desc: "Preposition" },
  with: { tag: "IN", cat: "PREPOSITION", desc: "Preposition" },
  for: { tag: "IN", cat: "PREPOSITION", desc: "Preposition" },
  by: { tag: "IN", cat: "PREPOSITION", desc: "Preposition" },
  of: { tag: "IN", cat: "PREPOSITION", desc: "Preposition" },
  to: { tag: "TO", cat: "PREPOSITION", desc: "Infinitive marker / Preposition" },
  and: { tag: "CC", cat: "CONJUNCTION", desc: "Coordinating Conjunction" },
  or: { tag: "CC", cat: "CONJUNCTION", desc: "Coordinating Conjunction" },
  but: { tag: "CC", cat: "CONJUNCTION", desc: "Coordinating Conjunction" },

  // Common Verbs
  is: { tag: "VBZ", cat: "VERB", desc: "Verb 3rd person singular present" },
  are: { tag: "VBP", cat: "VERB", desc: "Verb non-3rd person singular present" },
  was: { tag: "VBD", cat: "VERB", desc: "Verb past tense" },
  were: { tag: "VBD", cat: "VERB", desc: "Verb past tense" },
  have: { tag: "VBP", cat: "VERB", desc: "Verb base / present" },
  has: { tag: "VBZ", cat: "VERB", desc: "Verb 3rd person present" },
  built: { tag: "VBD", cat: "VERB", desc: "Verb past tense" },
  developed: { tag: "VBD", cat: "VERB", desc: "Verb past tense" },
  engineered: { tag: "VBD", cat: "VERB", desc: "Verb past tense" },
  optimized: { tag: "VBD", cat: "VERB", desc: "Verb past tense" },
  designed: { tag: "VBD", cat: "VERB", desc: "Verb past tense" },
  implemented: { tag: "VBD", cat: "VERB", desc: "Verb past tense" },
  managed: { tag: "VBD", cat: "VERB", desc: "Verb past tense" },
  led: { tag: "VBD", cat: "VERB", desc: "Verb past tense" },
  accelerated: { tag: "VBD", cat: "VERB", desc: "Verb past tense" },
  building: { tag: "VBG", cat: "VERB", desc: "Verb gerund / present participle" },
  deploying: { tag: "VBG", cat: "VERB", desc: "Verb gerund / present participle" },
  optimizing: { tag: "VBG", cat: "VERB", desc: "Verb gerund / present participle" },

  // Adjectives
  scalable: { tag: "JJ", cat: "ADJECTIVE", desc: "Adjective" },
  responsive: { tag: "JJ", cat: "ADJECTIVE", desc: "Adjective" },
  full: { tag: "JJ", cat: "ADJECTIVE", desc: "Adjective" },
  senior: { tag: "JJ", cat: "ADJECTIVE", desc: "Adjective" },
  efficient: { tag: "JJ", cat: "ADJECTIVE", desc: "Adjective" },
  distributed: { tag: "JJ", cat: "ADJECTIVE", desc: "Adjective / Participle" },
  fast: { tag: "JJ", cat: "ADJECTIVE", desc: "Adjective" },
  robust: { tag: "JJ", cat: "ADJECTIVE", desc: "Adjective" },
  high: { tag: "JJ", cat: "ADJECTIVE", desc: "Adjective" },

  // Adverbs
  highly: { tag: "RB", cat: "ADVERB", desc: "Adverb" },
  successfully: { tag: "RB", cat: "ADVERB", desc: "Adverb" },
  efficiently: { tag: "RB", cat: "ADVERB", desc: "Adverb" },
  quickly: { tag: "RB", cat: "ADVERB", desc: "Adverb" },
  very: { tag: "RB", cat: "ADVERB", desc: "Adverb" }
};

export function tagPOS(text: string): {
  tokens: POSTagToken[];
  categoryCounts: { [cat: string]: number };
  tagFrequencies: { tag: string; count: number; desc: string }[];
} {
  const rawTokens = (text || "Software engineer developed scalable web applications with React and Python.")
    .split(/(\s+|[.,!?;:()\[\]"'])/g)
    .filter(t => t.trim().length > 0);

  const categoryCounts: { [cat: string]: number } = {
    NOUN: 0,
    VERB: 0,
    ADJECTIVE: 0,
    ADVERB: 0,
    PREPOSITION: 0,
    PRONOUN: 0,
    DETERMINER: 0,
    CONJUNCTION: 0,
    PUNCTUATION: 0,
    OTHER: 0
  };

  const tagCounts: { [tag: string]: { count: number; desc: string } } = {};

  const tokens: POSTagToken[] = rawTokens.map(rawWord => {
    const w = rawWord.toLowerCase().replace(/[^a-z0-9]/g, "");

    if (/^[.,!?;:()\[\]"']$/.test(rawWord)) {
      categoryCounts.PUNCTUATION++;
      return {
        word: rawWord,
        tag: ".",
        category: "PUNCTUATION",
        tagDescription: "Punctuation Mark",
        confidence: 0.99
      };
    }

    if (POS_DICTIONARY[w]) {
      const match = POS_DICTIONARY[w];
      categoryCounts[match.cat] = (categoryCounts[match.cat] || 0) + 1;
      tagCounts[match.tag] = tagCounts[match.tag] || { count: 0, desc: match.desc };
      tagCounts[match.tag].count++;
      return {
        word: rawWord,
        tag: match.tag,
        category: match.cat,
        tagDescription: match.desc,
        confidence: 0.96
      };
    }

    // Heuristic Rules for unknowns
    if (w.endsWith("ly")) {
      categoryCounts.ADVERB++;
      tagCounts["RB"] = tagCounts["RB"] || { count: 0, desc: "Adverb" };
      tagCounts["RB"].count++;
      return { word: rawWord, tag: "RB", category: "ADVERB", tagDescription: "Adverb", confidence: 0.88 };
    }

    if (w.endsWith("ing")) {
      categoryCounts.VERB++;
      tagCounts["VBG"] = tagCounts["VBG"] || { count: 0, desc: "Verb Gerund / Present Participle" };
      tagCounts["VBG"].count++;
      return { word: rawWord, tag: "VBG", category: "VERB", tagDescription: "Verb Gerund", confidence: 0.91 };
    }

    if (w.endsWith("ed")) {
      categoryCounts.VERB++;
      tagCounts["VBD"] = tagCounts["VBD"] || { count: 0, desc: "Verb Past Tense" };
      tagCounts["VBD"].count++;
      return { word: rawWord, tag: "VBD", category: "VERB", tagDescription: "Verb Past Tense", confidence: 0.92 };
    }

    if (w.endsWith("able") || w.endsWith("ful") || w.endsWith("ous") || w.endsWith("ive") || w.endsWith("al")) {
      categoryCounts.ADJECTIVE++;
      tagCounts["JJ"] = tagCounts["JJ"] || { count: 0, desc: "Adjective" };
      tagCounts["JJ"].count++;
      return { word: rawWord, tag: "JJ", category: "ADJECTIVE", tagDescription: "Adjective", confidence: 0.89 };
    }

    if (w.endsWith("s") && !w.endsWith("ss")) {
      categoryCounts.NOUN++;
      tagCounts["NNS"] = tagCounts["NNS"] || { count: 0, desc: "Noun Plural" };
      tagCounts["NNS"].count++;
      return { word: rawWord, tag: "NNS", category: "NOUN", tagDescription: "Noun Plural", confidence: 0.87 };
    }

    if (/^[A-Z]/.test(rawWord)) {
      categoryCounts.NOUN++;
      tagCounts["NNP"] = tagCounts["NNP"] || { count: 0, desc: "Proper Noun Singular" };
      tagCounts["NNP"].count++;
      return { word: rawWord, tag: "NNP", category: "NOUN", tagDescription: "Proper Noun Singular", confidence: 0.94 };
    }

    // Default to Common Noun
    categoryCounts.NOUN++;
    tagCounts["NN"] = tagCounts["NN"] || { count: 0, desc: "Noun Singular" };
    tagCounts["NN"].count++;
    return { word: rawWord, tag: "NN", category: "NOUN", tagDescription: "Noun Singular or Mass", confidence: 0.85 };
  });

  const tagFrequencies = Object.entries(tagCounts)
    .map(([tag, val]) => ({ tag, count: val.count, desc: val.desc }))
    .sort((a, b) => b.count - a.count);

  return {
    tokens,
    categoryCounts,
    tagFrequencies
  };
}
