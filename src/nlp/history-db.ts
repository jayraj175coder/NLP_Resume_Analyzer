import fs from "fs";
import path from "path";

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
  analysis: any; // Gemini analysis
  qualityReport: any; // clean NLP evaluation
}

const DB_PATH = path.join(process.cwd(), "resume_analyzer_db.json");

/**
 * Initialize local database file if it doesn't exist
 */
function initDb() {
  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify([], null, 2), "utf8");
  }
}

/**
 * Get all reports from the database
 */
export function getAllReports(): ReportItem[] {
  initDb();
  try {
    const data = fs.readFileSync(DB_PATH, "utf8");
    return JSON.parse(data);
  } catch (err) {
    console.error("Error reading database file:", err);
    return [];
  }
}

/**
 * Save a new report to the database
 */
export function saveReport(report: Omit<ReportItem, "id" | "timestamp">): ReportItem {
  initDb();
  const reports = getAllReports();
  const newReport: ReportItem = {
    ...report,
    id: `rep_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
    timestamp: new Date().toISOString()
  };

  reports.unshift(newReport); // Add to the front
  
  // Keep last 100 entries to prevent files from growing infinitely
  if (reports.length > 100) {
    reports.pop();
  }

  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(reports, null, 2), "utf8");
  } catch (err) {
    console.error("Error writing database file:", err);
  }

  return newReport;
}

/**
 * Delete a report from the database
 */
export function deleteReport(id: string): boolean {
  initDb();
  const reports = getAllReports();
  const filtered = reports.filter(r => r.id !== id);

  if (reports.length === filtered.length) return false;

  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(filtered, null, 2), "utf8");
    return true;
  } catch (err) {
    console.error("Error writing database file during delete:", err);
    return false;
  }
}

/**
 * Export history as a CSV string
 */
export function exportReportsCSV(): string {
  const reports = getAllReports();
  if (reports.length === 0) {
    return "ID,Timestamp,Candidate Name,Job Title,Match %,ATS Score,Quality Score\n";
  }

  const headers = ["ID", "Timestamp", "Candidate Name", "Job Title", "Match Percentage", "ATS Score", "Quality Score"];
  const csvRows = [headers.join(",")];

  reports.forEach(r => {
    const row = [
      r.id,
      r.timestamp,
      `"${r.candidateName.replace(/"/g, '""')}"`,
      `"${r.jobTitle.replace(/"/g, '""')}"`,
      r.matchPercentage,
      r.atsScore,
      r.qualityScore
    ];
    csvRows.push(row.join(","));
  });

  return csvRows.join("\n");
}
