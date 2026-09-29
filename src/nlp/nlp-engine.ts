/**
 * Custom Natural Language Processing (NLP) Engine implemented from scratch.
 * Developed for the AI Resume Analyzer project.
 */

// A comprehensive list of standard English stopwords
export const STOPWORDS = new Set([
  "a", "about", "above", "after", "again", "against", "all", "am", "an", "and", "any", "are", "arent", "as", "at",
  "be", "because", "been", "before", "being", "below", "between", "both", "but", "by", "cant", "cannot", "could",
  "couldnt", "did", "didnt", "do", "does", "doesnt", "doing", "dont", "down", "during", "each", "few", "for", "from",
  "further", "had", "hadnt", "has", "hasnt", "have", "havent", "having", "he", "hed", "hell", "hes", "her", "here",
  "heres", "hers", "herself", "him", "himself", "his", "how", "hows", "i", "id", "ill", "im", "ive", "if", "in",
  "into", "is", "isnt", "it", "its", "itself", "lets", "me", "more", "most", "mustnt", "my", "myself", "no", "nor",
  "not", "of", "off", "on", "once", "only", "or", "other", "ought", "our", "ours", "ourselves", "out", "over", "own",
  "same", "shant", "she", "shed", "shell", "shes", "should", "shouldnt", "so", "some", "such", "than", "that", "thats",
  "the", "their", "theirs", "them", "themselves", "then", "there", "theres", "these", "they", "theyd", "theyll",
  "theyre", "theyve", "this", "those", "through", "to", "too", "under", "until", "up", "very", "was", "wasnt", "we",
  "wed", "well", "were", "weve", "werent", "what", "whats", "when", "whens", "where", "wheres", "which", "while",
  "who", "whos", "whom", "why", "whys", "with", "wont", "would", "wouldnt", "you", "youd", "youll", "youre", "youve",
  "your", "yours", "yourself", "yourselves", "us", "re", "will", "can", "should", "using", "used"
]);

// Skill lists for extraction and scoring
export const SKILLS_DICTIONARY = {
  programming_languages: ["python", "javascript", "typescript", "java", "c++", "c#", "ruby", "go", "rust", "php", "swift", "kotlin", "scala", "r", "sql", "html", "css", "bash"],
  frameworks: ["react", "angular", "vue", "nextjs", "express", "fastapi", "django", "flask", "spring boot", "laravel", "rails", "asp.net", "tensorflow", "pytorch", "keras", "scikit-learn", "spacy", "nltk", "pandas", "numpy", "react native", "flutter"],
  databases: ["mysql", "postgresql", "mongodb", "redis", "sqlite", "oracle", "mariadb", "cassandra", "dynamodb", "neo4j", "firebase", "firestore"],
  cloud_devops: ["aws", "azure", "gcp", "docker", "kubernetes", "jenkins", "git", "github", "gitlab", "terraform", "ansible", "ci/cd", "nginx", "linux"],
  concepts: ["machine learning", "deep learning", "natural language processing", "nlp", "computer vision", "data science", "artificial intelligence", "agile", "scrum", "rest api", "graphql", "microservices", "system design", "object oriented programming", "oop", "cloud computing", "devops", "big data", "cybersecurity"]
};

// Flatten all skills for quick dictionary matching
const ALL_SKILLS = Object.values(SKILLS_DICTIONARY).flat();

/**
 * Clean text: convert to lowercase, remove punctuation, numbers, special characters.
 */
export function cleanText(text: string): string {
  if (!text) return "";
  return text
    .toLowerCase()
    // Replace newline characters with spaces
    .replace(/[\r\n]+/g, " ")
    // Remove email addresses
    .replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, " ")
    // Remove URLs
    .replace(/https?:\/\/[^\s]+/g, " ")
    // Remove phone numbers (simple pattern)
    .replace(/[\+\d\-\(\)\s]{10,}/g, " ")
    // Keep letters, numbers, and basic spacing
    .replace(/[^a-zA-Z0-9\s#\+\-\.]/g, " ")
    // Collapse multiple spaces
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Tokenize text into words.
 */
export function tokenize(text: string): string[] {
  if (!text) return [];
  return text
    .toLowerCase()
    .split(/[\s,.:;!?()\[\]"']+/g)
    .filter(token => token.length > 0);
}

/**
 * Remove stopwords from token array.
 */
export function removeStopwords(tokens: string[]): string[] {
  return tokens.filter(token => !STOPWORDS.has(token));
}

/**
 * A rule-based English lemmatizer.
 */
export function lemmatizeWord(word: string): string {
  let w = word.trim().toLowerCase();
  if (w.length <= 2) return w;

  // Simple suffix rules
  if (w.endsWith("sses")) return w.slice(0, -2); // bosses -> boss
  if (w.endsWith("ies") && !w.endsWith("eies")) return w.slice(0, -3) + "y"; // studying -> study (not studies->study)
  if (w.endsWith("ss")) return w;
  if (w.endsWith("s") && !w.endsWith("is") && !w.endsWith("as") && !w.endsWith("us") && !w.endsWith("os")) {
    return w.slice(0, -1); // devops is unchanged, skills -> skill
  }

  // Verbs ending in -ing
  if (w.endsWith("ing")) {
    let base = w.slice(0, -3);
    if (base.endsWith("at") || base.endsWith("iz") || base.endsWith("v")) {
      return base + "e"; // creating -> create, optimizing -> optimize
    }
    // double consonant rule
    if (base.length > 3 && base[base.length - 1] === base[base.length - 2]) {
      const char = base[base.length - 1];
      if (["b", "d", "g", "l", "m", "n", "p", "r", "t"].includes(char)) {
        return base.slice(0, -1); // running -> run
      }
    }
    return base;
  }

  // Verbs ending in -ed
  if (w.endsWith("ed")) {
    let base = w.slice(0, -2);
    if (base.endsWith("at") || base.endsWith("iz") || base.endsWith("v") || base.endsWith("cre")) {
      return base; // created -> create (well, base of created is creat, so we add nothing or keep base)
    }
    if (w.endsWith("ied")) return w.slice(0, -3) + "y"; // applied -> apply
    return base;
  }

  return w;
}

export function lemmatize(tokens: string[]): string[] {
  return tokens.map(token => lemmatizeWord(token));
}

/**
 * Extract N-Grams (Bigrams and Trigrams)
 */
export function extractNGrams(tokens: string[], n: number): string[] {
  const nGrams: string[] = [];
  if (tokens.length < n) return [];
  for (let i = 0; i <= tokens.length - n; i++) {
    const gram = tokens.slice(i, i + n).join(" ");
    nGrams.push(gram);
  }
  return nGrams;
}

/**
 * TF-IDF Vectorizer & Cosine Similarity
 */
export interface TFIDFModel {
  vocabulary: string[];
  idf: { [word: string]: number };
}

export function buildTFIDFModel(documents: string[][]): TFIDFModel {
  const vocabularySet = new Set<string>();
  const docCounts: { [word: string]: number } = {};

  documents.forEach(doc => {
    const uniqueInDoc = new Set(doc);
    uniqueInDoc.forEach(word => {
      vocabularySet.add(word);
      docCounts[word] = (docCounts[word] || 0) + 1;
    });
  });

  const vocabulary = Array.from(vocabularySet);
  const idf: { [word: string]: number } = {};
  const N = documents.length;

  vocabulary.forEach(word => {
    // Standard IDF formula with smoothing to avoid divide by zero
    idf[word] = Math.log(1 + (N / (docCounts[word] || 1)));
  });

  return { vocabulary, idf };
}

export function vectorizeTFIDF(doc: string[], model: TFIDFModel): number[] {
  const tf: { [word: string]: number } = {};
  doc.forEach(word => {
    tf[word] = (tf[word] || 0) + 1;
  });

  // Calculate normalized term frequencies
  const docLength = doc.length || 1;
  const vector = model.vocabulary.map(word => {
    const termFreq = (tf[word] || 0) / docLength;
    const inverseDocFreq = model.idf[word] || 0;
    return termFreq * inverseDocFreq;
  });

  return vector;
}

export function cosineSimilarity(vecA: number[], vecB: number[]): number {
  if (vecA.length !== vecB.length || vecA.length === 0) return 0;

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }

  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

/**
 * Extract Skills from Text based on pre-defined dictionary.
 */
export function extractSkills(text: string): { found: string[], categoryBreakdown: { [cat: string]: string[] } } {
  const cleaned = cleanText(text);
  const found: string[] = [];
  const categoryBreakdown: { [cat: string]: string[] } = {};

  Object.entries(SKILLS_DICTIONARY).forEach(([category, skills]) => {
    categoryBreakdown[category] = [];
    skills.forEach(skill => {
      // Use boundary matching for precise skill extraction
      // Replace special characters like +, # in skill for regex compatibility
      const escapedSkill = skill.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
      const regex = new RegExp(`\\b${escapedSkill}\\b`, "i");
      
      // Special handle for C++ and C# which are stripped by standard boundaries
      let hasSkill = false;
      if (skill === "c++") {
        hasSkill = /c\+\+/i.test(text);
      } else if (skill === "c#") {
        hasSkill = /c#/i.test(text);
      } else {
        hasSkill = regex.test(cleaned);
      }

      if (hasSkill) {
        found.push(skill);
        categoryBreakdown[category].push(skill);
      }
    });
  });

  return { found, categoryBreakdown };
}

/**
 * Named Entity Recognition (NER) from scratch using regex patterns and lexicons.
 */
export interface Entity {
  text: string;
  label: "PERSON" | "ORGANIZATION" | "EDUCATION" | "LOCATION" | "DATE";
}

export function extractEntities(text: string): Entity[] {
  const entities: Entity[] = [];
  const lines = text.split("\n");

  // 1. Guessing Person Name: Usually the first line of a resume is the name if it is short
  if (lines.length > 0) {
    const firstLine = lines[0].trim();
    if (firstLine.length > 3 && firstLine.length < 30 && /^[A-Z][a-z]+(\s+[A-Z][a-z]+){1,2}$/.test(firstLine)) {
      entities.push({ text: firstLine, label: "PERSON" });
    }
  }

  // 2. Organization Lexicon & Regex
  const orgKeywords = ["Google", "Microsoft", "Amazon", "Apple", "Meta", "Netflix", "IBM", "Intel", "Infosys", "TCS", "Accenture", "Cognizant", "Wipro", "Capgemini", "Oracle", "Salesforce", "GitHub"];
  orgKeywords.forEach(org => {
    const regex = new RegExp(`\\b${org}\\b`, "gi");
    let match;
    while ((match = regex.exec(text)) !== null) {
      entities.push({ text: org, label: "ORGANIZATION" });
    }
  });

  // 3. Education entities
  const eduRegex = /(bachelor|master|b\.s|m\.s|ph\.d|b\.tech|m\.tech|b\.e|m\.e|diploma|university|college|institute|school|degree)\s+of\s+[A-Za-z\s]+/gi;
  let eduMatch;
  while ((eduMatch = eduRegex.exec(text)) !== null) {
    entities.push({ text: eduMatch[0].trim(), label: "EDUCATION" });
  }

  // 4. Date entities
  const dateRegex = /\b(19|20)\d{2}\b|\b(january|february|march|april|may|june|july|august|september|october|november|december|jan|feb|mar|apr|jun|jul|aug|sep|oct|nov|dec)\s+\d{4}\b/gi;
  let dateMatch;
  while ((dateMatch = dateRegex.exec(text)) !== null) {
    entities.push({ text: dateMatch[0].trim(), label: "DATE" });
  }

  // Remove duplicates
  const seen = new Set<string>();
  return entities.filter(ent => {
    const key = `${ent.text.toLowerCase()}_${ent.label}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

/**
 * Section detection using common header regex.
 */
export function detectSections(text: string): { [sectionName: string]: string } {
  const sections: { [key: string]: string } = {};
  const sectionHeaders = {
    summary: /^(summary|professional summary|objective|about me|profile)/i,
    experience: /^(experience|work experience|employment history|professional experience|career history)/i,
    education: /^(education|academic background|academic credentials)/i,
    skills: /^(skills|technical skills|core competencies|expertise)/i,
    projects: /^(projects|personal projects|academic projects)/i,
    certifications: /^(certifications|licenses|courses|awards)/i
  };

  const lines = text.split("\n");
  let currentSection = "general";
  sections[currentSection] = "";

  lines.forEach(line => {
    const trimmed = line.trim();
    if (trimmed.length === 0) return;

    let matched = false;
    for (const [sectionName, regex] of Object.entries(sectionHeaders)) {
      if (regex.test(trimmed) && trimmed.length < 40) {
        currentSection = sectionName;
        sections[currentSection] = "";
        matched = true;
        break;
      }
    }

    if (!matched) {
      sections[currentSection] += line + "\n";
    }
  });

  return sections;
}

/**
 * Duplicate keyword detection (often checked to flag keyword stuffing in resumes).
 */
export function detectDuplicateKeywords(tokens: string[]): { word: string, count: number }[] {
  const counts: { [word: string]: number } = {};
  tokens.forEach(token => {
    if (ALL_SKILLS.includes(token)) {
      counts[token] = (counts[token] || 0) + 1;
    }
  });

  return Object.entries(counts)
    .map(([word, count]) => ({ word, count }))
    .filter(item => item.count >= 4) // Flag word repeated 4 or more times
    .sort((a, b) => b.count - a.count);
}

/**
 * Resume Grammar, Quality, and Structure Score
 */
export interface QualityReport {
  score: number;
  grammarCheckScore: number;
  atsScore: number;
  issues: string[];
  hasContact: boolean;
  hasEmail: boolean;
  hasLinkedIn: boolean;
  sectionCoverage: number; // percentage
}

export function evaluateQuality(text: string): QualityReport {
  const issues: string[] = [];
  let score = 100;

  // 1. Check for Contact Info
  const hasPhone = /[\+\d\-\(\)\s]{10,}/g.test(text);
  const hasEmail = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(text);
  const hasLinkedIn = /linkedin\.com/i.test(text);

  if (!hasEmail) {
    issues.push("Missing Email address in contact details.");
    score -= 10;
  }
  if (!hasPhone) {
    issues.push("Missing Contact Phone number.");
    score -= 10;
  }
  if (!hasLinkedIn) {
    issues.push("LinkedIn profile URL not found. Adding your LinkedIn increases professional visibility.");
    score -= 5;
  }

  // 2. Check Sections
  const sections = detectSections(text);
  const detectedSectionNames = Object.keys(sections).filter(s => s !== "general" && sections[s].length > 50);
  const coveragePercent = Math.round((detectedSectionNames.length / 5) * 100);

  if (!sections.experience || sections.experience.length < 50) {
    issues.push("Work Experience section is missing or too brief.");
    score -= 15;
  }
  if (!sections.education || sections.education.length < 30) {
    issues.push("Education section is missing or too brief.");
    score -= 10;
  }
  if (!sections.skills || sections.skills.length < 20) {
    issues.push("Skills section is missing or poorly formatted.");
    score -= 10;
  }

  // 3. Length Quality Check
  const wordCount = tokenize(text).length;
  if (wordCount < 150) {
    issues.push("Resume is too short. (Fewer than 150 words). Add more detail about projects and experience.");
    score -= 15;
  } else if (wordCount > 1000) {
    issues.push("Resume is very long (More than 1000 words). Try to condense descriptions to keep it punchy.");
    score -= 5;
  }

  // 4. Grammar & Action Verbs Checks (Simple regex checks for college projects)
  const actionVerbs = ["managed", "led", "developed", "created", "built", "implemented", "optimized", "increased", "reduced", "designed", "engineered", "accelerated"];
  const actionVerbsFound = actionVerbs.filter(verb => new RegExp(`\\b${verb}\\b`, "i").test(text));
  if (actionVerbsFound.length < 3) {
    issues.push(`Add more strong action verbs. We found only ${actionVerbsFound.length} in your descriptions.`);
    score -= 5;
  }

  // Bound score
  score = Math.max(20, Math.min(100, score));

  // Simulating standard ATS compliance score based on structural elements
  const atsScore = Math.round((score + (hasEmail ? 10 : 0) + (hasPhone ? 10 : 0) + (coveragePercent * 0.8)) / 2.6);

  return {
    score,
    grammarCheckScore: Math.round(90 + (actionVerbsFound.length * 1)), // simple representative grammar scoring
    atsScore: Math.min(100, atsScore),
    issues,
    hasContact: hasPhone || hasEmail,
    hasEmail,
    hasLinkedIn,
    sectionCoverage: coveragePercent
  };
}
