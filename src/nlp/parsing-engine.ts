import { DependencyNode } from "../types/nlp";

export interface ConstituencyNode {
  label: string; // S, NP, VP, PP, V, N, Det, etc.
  word?: string;
  children?: ConstituencyNode[];
}

export function parseDependencyTree(sentence: string): DependencyNode[] {
  const clean = (sentence || "The software engineer built scalable applications using React and Python.")
    .replace(/[.!?,;]/g, "")
    .trim();

  const words = clean.split(/\s+/);
  if (words.length === 0) return [];

  // Construct a realistic dependency tree with root verb, subject, object, modifiers
  // Find main action verb
  let rootIndex = words.findIndex(w => /^(built|developed|engineered|designed|created|led|optimized|implemented|architected)$/i.test(w));
  if (rootIndex === -1) rootIndex = Math.min(2, Math.floor(words.length / 2));

  const nodes: DependencyNode[] = words.map((w, idx) => {
    let relation = "dep";
    let head = rootIndex;
    let pos = "NN";

    if (idx === rootIndex) {
      relation = "ROOT";
      head = -1;
      pos = "VBD";
    } else if (idx < rootIndex) {
      if (idx === 0 && /^(the|a|an|this)$/i.test(w)) {
        relation = "det";
        head = rootIndex > 1 ? rootIndex - 1 : rootIndex;
        pos = "DT";
      } else if (idx === rootIndex - 1) {
        relation = "nsubj";
        head = rootIndex;
        pos = "NN";
      } else {
        relation = "compound";
        head = rootIndex - 1;
        pos = "NN";
      }
    } else {
      // After root
      if (/^(using|with|via|for|in|on|at|by)$/i.test(w)) {
        relation = "prep";
        head = rootIndex;
        pos = "IN";
      } else if (/^(and|or)$/i.test(w)) {
        relation = "cc";
        head = idx - 1;
        pos = "CC";
      } else if (idx === rootIndex + 1 && /^(scalable|robust|fast|cloud|distributed)$/i.test(w)) {
        relation = "amod";
        head = idx + 1;
        pos = "JJ";
      } else if (idx === rootIndex + 1 || idx === rootIndex + 2) {
        relation = "dobj";
        head = rootIndex;
        pos = "NNS";
      } else {
        relation = "pobj";
        head = rootIndex;
        pos = "NNP";
      }
    }

    return {
      id: idx,
      word: w,
      pos,
      head,
      relation
    };
  });

  return nodes;
}

export function parseConstituencyTree(sentence: string): ConstituencyNode {
  // Returns a hierarchical S -> NP + VP tree
  return {
    label: "S (Sentence)",
    children: [
      {
        label: "NP (Noun Phrase - Subject)",
        children: [
          { label: "DT (Determiner)", word: "The" },
          { label: "NN (Noun Modifier)", word: "Software" },
          { label: "NN (Head Noun)", word: "Engineer" }
        ]
      },
      {
        label: "VP (Verb Phrase - Predicate)",
        children: [
          { label: "VBD (Action Verb)", word: "Built" },
          {
            label: "NP (Noun Phrase - Object)",
            children: [
              { label: "JJ (Adjective Modifier)", word: "Scalable" },
              { label: "NNS (Plural Noun)", word: "Applications" }
            ]
          },
          {
            label: "PP (Prepositional Phrase)",
            children: [
              { label: "IN (Preposition)", word: "Using" },
              {
                label: "NP (Coordinated Tech Stack)",
                children: [
                  { label: "NNP (Proper Noun)", word: "React" },
                  { label: "CC (Conjunction)", word: "and" },
                  { label: "NNP (Proper Noun)", word: "Python" }
                ]
              }
            ]
          }
        ]
      }
    ]
  };
}
