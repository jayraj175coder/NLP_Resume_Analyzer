export interface ReportItem {
  id: string;
  timestamp: string;
  candidateName: string;
  jobTitle: string;
  matchPercentage: number;
  skillsFound: string[];
  missingSkills: string[];
  atsScore: number;
  qualityScore: number;
  resumeText: string;
  jdText: string;
  analysis: GeminiAnalysisResult;
  qualityReport: QualityReport;
}

export interface GeminiAnalysisResult {
  summary: string;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  suggestedBulletPoints: string[];
  missingKeywords: string[];
  grammarNotes: string;
}

export interface QualityReport {
  score: number;
  grammarScore: number;
  atsScore: number;
  issues: string[];
  hasEmail: boolean;
  hasLinkedIn: boolean;
  sectionCoverage: number;
  duplicates?: { word: string; count: number }[];
}

export interface MLClassificationResult {
  predictedCategory: string;
  confidence: number;
  isMlTrained: boolean;
  probabilities?: { [category: string]: number };
  topKeywords?: string[];
  experienceLevel?: string;
  modelAccuracy?: number;
  datasetSize?: number;
}

export interface AnalysisResponse {
  success: boolean;
  reportId: string;
  timestamp: string;
  candidateName: string;
  jobTitle: string;
  matchPercentage: number;
  atsScore: number;
  qualityScore: number;
  skillsFound: string[];
  skillsBreakdown: { [category: string]: string[] };
  missingSkills: string[];
  resumeText?: string;
  keywordFreq: { word: string; count: number }[];
  entities: { text: string; label: string }[];
  sections: string[];
  duplicates: { word: string; count: number }[];
  qualityReport: QualityReport;
  analysis: GeminiAnalysisResult;
  mlClassification?: MLClassificationResult;
}
