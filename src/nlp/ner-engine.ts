import { EntitySpan } from "../types/nlp";

const TECH_LEXICON = [
  "React", "TypeScript", "JavaScript", "Python", "FastAPI", "Express", "Node.js", "Django", "Flask",
  "PostgreSQL", "MongoDB", "Redis", "MySQL", "Docker", "Kubernetes", "AWS", "GCP", "Azure",
  "Git", "GitHub", "GraphQL", "REST API", "Tailwind CSS", "Next.js", "PyTorch", "TensorFlow", "Pandas", "Scikit-Learn"
];

const ORGS_LEXICON = [
  "Google", "Microsoft", "Amazon", "Meta", "Apple", "Netflix", "IBM", "Intel", "Oracle",
  "Salesforce", "Uber", "Airbnb", "Infosys", "TCS", "Wipro", "Accenture", "Cognizant", "Stripe", "OpenAI"
];

const ROLES_LEXICON = [
  "Software Engineer", "Full Stack Developer", "Backend Engineer", "Frontend Developer", "Data Scientist",
  "ML Engineer", "DevOps Engineer", "Cloud Architect", "Product Manager", "Systems Engineer", "Tech Lead"
];

const CERT_LEXICON = [
  "AWS Certified Solutions Architect", "CKA", "CKAD", "Google Cloud Professional", "PMP", "CompTIA Security+", "CISSP", "Azure Developer Associate"
];

export function extractAdvancedEntities(text: string): EntitySpan[] {
  if (!text) return [];
  const entities: EntitySpan[] = [];
  let idCounter = 1;

  // 1. Email
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  let match: RegExpExecArray | null;
  while ((match = emailRegex.exec(text)) !== null) {
    entities.push({
      id: `ent-${idCounter++}`,
      text: match[0],
      label: "EMAIL",
      start: match.index,
      end: match.index + match[0].length,
      confidence: 0.99,
      description: "Direct candidate contact electronic mail"
    });
  }

  // 2. Phone
  const phoneRegex = /(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g;
  while ((match = phoneRegex.exec(text)) !== null) {
    if (match[0].replace(/\D/g, "").length >= 10) {
      entities.push({
        id: `ent-${idCounter++}`,
        text: match[0],
        label: "PHONE",
        start: match.index,
        end: match.index + match[0].length,
        confidence: 0.95,
        description: "Primary telephone contact number"
      });
    }
  }

  // 3. GitHub
  const githubRegex = /(?:https?:\/\/)?(?:www\.)?github\.com\/[a-zA-Z0-9_-]+/gi;
  while ((match = githubRegex.exec(text)) !== null) {
    entities.push({
      id: `ent-${idCounter++}`,
      text: match[0],
      label: "GITHUB",
      start: match.index,
      end: match.index + match[0].length,
      confidence: 0.98,
      description: "Open-source codebase portfolio link"
    });
  }

  // 4. LinkedIn
  const linkedinRegex = /(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+/gi;
  while ((match = linkedinRegex.exec(text)) !== null) {
    entities.push({
      id: `ent-${idCounter++}`,
      text: match[0],
      label: "LINKEDIN",
      start: match.index,
      end: match.index + match[0].length,
      confidence: 0.98,
      description: "Professional social identity profile"
    });
  }

  // 5. Degree & Education
  const degreeRegex = /\b(Bachelor|Master|B\.S\.|M\.S\.|Ph\.D\.|B\.Tech|M\.Tech|B\.E\.|M\.E\.|Diploma|Associate)\s+(?:of|in)?\s+[A-Za-z\s]{3,30}\b/gi;
  while ((match = degreeRegex.exec(text)) !== null) {
    entities.push({
      id: `ent-${idCounter++}`,
      text: match[0].trim(),
      label: "DEGREE",
      start: match.index,
      end: match.index + match[0].length,
      confidence: 0.92,
      description: "Academic degree qualification"
    });
  }

  // 6. University / College
  const uniRegex = /\b[A-Z][a-zA-Z\s]+(?:University|Institute|College|Academy|Polytechnic)\b/g;
  while ((match = uniRegex.exec(text)) !== null) {
    entities.push({
      id: `ent-${idCounter++}`,
      text: match[0].trim(),
      label: "COLLEGE",
      start: match.index,
      end: match.index + match[0].length,
      confidence: 0.94,
      description: "Higher educational institution"
    });
  }

  // 7. Dates
  const dateRegex = /\b(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\s+\d{4}\b|\b(?:20|19)\d{2}\s*[-–—]\s*(?:(?:20|19)\d{2}|Present|Current)\b|\b(?:20|19)\d{2}\b/gi;
  while ((match = dateRegex.exec(text)) !== null) {
    entities.push({
      id: `ent-${idCounter++}`,
      text: match[0].trim(),
      label: "DATE",
      start: match.index,
      end: match.index + match[0].length,
      confidence: 0.90,
      description: "Temporal tenure or milestone date"
    });
  }

  // 8. Locations
  const locRegex = /\b(San Francisco|New York|Seattle|Austin|Boston|London|Berlin|Toronto|Mumbai|Bangalore|Hyderabad|Pune|Delhi|Singapore|Remote|CA|NY|TX|WA)\b/g;
  while ((match = locRegex.exec(text)) !== null) {
    entities.push({
      id: `ent-${idCounter++}`,
      text: match[0].trim(),
      label: "LOCATION",
      start: match.index,
      end: match.index + match[0].length,
      confidence: 0.88,
      description: "Geographic work location"
    });
  }

  // 9. Lexicon based: Tech, Org, Roles, Certs
  TECH_LEXICON.forEach(tech => {
    const r = new RegExp(`\\b${tech.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "gi");
    while ((match = r.exec(text)) !== null) {
      entities.push({
        id: `ent-${idCounter++}`,
        text: match[0],
        label: "TECHNOLOGY",
        start: match.index,
        end: match.index + match[0].length,
        confidence: 0.96,
        description: "Software language, framework, or cloud tool"
      });
    }
  });

  ORGS_LEXICON.forEach(org => {
    const r = new RegExp(`\\b${org}\\b`, "gi");
    while ((match = r.exec(text)) !== null) {
      entities.push({
        id: `ent-${idCounter++}`,
        text: match[0],
        label: "ORGANIZATION",
        start: match.index,
        end: match.index + match[0].length,
        confidence: 0.94,
        description: "Corporate employer or enterprise"
      });
    }
  });

  ROLES_LEXICON.forEach(role => {
    const r = new RegExp(`\\b${role}\\b`, "gi");
    while ((match = r.exec(text)) !== null) {
      entities.push({
        id: `ent-${idCounter++}`,
        text: match[0],
        label: "ROLE",
        start: match.index,
        end: match.index + match[0].length,
        confidence: 0.91,
        description: "Target or past professional designation"
      });
    }
  });

  CERT_LEXICON.forEach(cert => {
    const r = new RegExp(`\\b${cert}\\b`, "gi");
    while ((match = r.exec(text)) !== null) {
      entities.push({
        id: `ent-${idCounter++}`,
        text: match[0],
        label: "CERTIFICATION",
        start: match.index,
        end: match.index + match[0].length,
        confidence: 0.95,
        description: "Verified industry credential"
      });
    }
  });

  // 10. Guess Person candidate name from top lines
  const lines = text.split("\n").map(l => l.trim()).filter(l => l.length > 0);
  if (lines.length > 0) {
    const firstLine = lines[0];
    if (firstLine.length < 35 && /^[A-Z][a-z]+(\s+[A-Z][a-z]+){1,2}$/.test(firstLine)) {
      entities.push({
        id: `ent-${idCounter++}`,
        text: firstLine,
        label: "PERSON",
        start: text.indexOf(firstLine),
        end: text.indexOf(firstLine) + firstLine.length,
        confidence: 0.97,
        description: "Candidate primary identity name"
      });
    }
  }

  // Sort by start position and deduplicate exact overlapping ranges
  entities.sort((a, b) => a.start - b.start);
  const filtered: EntitySpan[] = [];
  let lastEnd = -1;

  for (const ent of entities) {
    if (ent.start >= lastEnd) {
      filtered.push(ent);
      lastEnd = ent.end;
    }
  }

  return filtered;
}
