import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import multer from "multer";
import * as pdfParseModule from "pdf-parse";

const pdfParse = async (buffer: Buffer): Promise<{ text: string }> => {
  const mod: any = pdfParseModule;
  if (mod.PDFParse) {
    const parser = new mod.PDFParse({ data: buffer });
    return await parser.getText();
  } else if (mod.default?.PDFParse) {
    const parser = new mod.default.PDFParse({ data: buffer });
    return await parser.getText();
  } else if (typeof mod.default === "function") {
    return mod.default(buffer);
  } else if (typeof mod === "function") {
    return mod(buffer);
  } else {
    return { text: buffer.toString("utf8") };
  }
};
import mammoth from "mammoth";

// Import NLP Engine & Services
import {
  cleanText,
  tokenize,
  removeStopwords,
  lemmatize,
  extractNGrams,
  buildTFIDFModel,
  vectorizeTFIDF,
  cosineSimilarity,
  extractSkills,
  extractEntities,
  detectSections,
  detectDuplicateKeywords,
  evaluateQuality
} from "./src/nlp/nlp-engine.ts";
import { getGeminiAnalysis } from "./src/nlp/gemini-service.ts";
import { getAllReports, saveReport, deleteReport, exportReportsCSV } from "./src/nlp/history-db.ts";

const app = express();
const parsedPort = Number.parseInt(process.env.PORT ?? "3000", 10);
const PORT = Number.isInteger(parsedPort) && parsedPort > 0 ? parsedPort : 3000;

// Health check route for cloud ingress/monitoring
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Setup JSON parsing and urlencoded payloads
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Configure Multer for File Uploads (In-Memory storage)
const MAX_UPLOAD_SIZE_BYTES = 5 * 1024 * 1024;
const ALLOWED_FILE_EXTENSIONS = new Set([".pdf", ".docx", ".txt"]);
const ALLOWED_MIME_TYPES = new Set([
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain"
]);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_UPLOAD_SIZE_BYTES },
  fileFilter: (_request, file, callback) => {
    const extension = path.extname(file.originalname).toLowerCase();
    if (!ALLOWED_FILE_EXTENSIONS.has(extension) || !ALLOWED_MIME_TYPES.has(file.mimetype)) {
      callback(new Error("Only PDF, DOCX, and TXT resumes are supported."));
      return;
    }
    callback(null, true);
  }
});

/**
 * Helper to extract text from buffer based on mime-type
 */
async function extractTextFromBuffer(buffer: Buffer, mimeType: string, originalName: string): Promise<string> {
  const ext = path.extname(originalName).toLowerCase();
  
  if (mimeType === "application/pdf" || ext === ".pdf") {
    const data = await pdfParse(buffer);
    return data.text;
  }
  
  if (mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || ext === ".docx") {
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  }
  
  if (mimeType === "text/plain" || ext === ".txt") {
    return buffer.toString("utf8");
  }

  throw new Error("Unsupported file format. Please upload PDF, DOCX, or TXT file.");
}

// ==========================================
// API ROUTES
// ==========================================

/**
 * Core Route: Analyze Resume and JD
 */
app.post("/api/analyze", upload.single("resumeFile"), async (req, res) => {
  try {
    let resumeText = req.body.resumeText || "";
    const jdText = req.body.jdText || "";

    if (!jdText) {
      return res.status(400).json({ error: "Job description text is required." });
    }

    // If file is uploaded, extract text from it
    if (req.file) {
      try {
        resumeText = await extractTextFromBuffer(req.file.buffer, req.file.mimetype, req.file.originalname);
      } catch (err: any) {
        return res.status(400).json({ error: `Failed to extract text from file: ${err.message}` });
      }
    }

    if (!resumeText.trim()) {
      return res.status(400).json({ error: "Resume text or file is required." });
    }

    // 1. NLP Processing - Text Cleaning & Tokenization
    const cleanedResume = cleanText(resumeText);
    const cleanedJD = cleanText(jdText);

    const tokensResume = tokenize(cleanedResume);
    const tokensJD = tokenize(cleanedJD);

    const filteredTokensResume = removeStopwords(tokensResume);
    const filteredTokensJD = removeStopwords(tokensJD);

    const lemmatizedResume = lemmatize(filteredTokensResume);
    const lemmatizedJD = lemmatize(filteredTokensJD);

    // 2. Feature Engineering - N-Grams
    const bigramsResume = extractNGrams(lemmatizedResume, 2);
    const trigramsResume = extractNGrams(lemmatizedResume, 3);

    // Calculate dynamic Keyword Frequency (N-grams & Unigrams)
    const keywordFreqMap: { [word: string]: number } = {};
    lemmatizedResume.forEach(word => {
      if (word.length > 2) {
        keywordFreqMap[word] = (keywordFreqMap[word] || 0) + 1;
      }
    });
    const keywordFreq = Object.entries(keywordFreqMap)
      .map(([word, count]) => ({ word, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 15);

    // 3. TF-IDF & Cosine Similarity Calculation
    const tfidfModel = buildTFIDFModel([lemmatizedResume, lemmatizedJD]);
    const vecResume = vectorizeTFIDF(lemmatizedResume, tfidfModel);
    const vecJD = vectorizeTFIDF(lemmatizedJD, tfidfModel);
    
    const simScore = cosineSimilarity(vecResume, vecJD);
    const matchPercentage = Math.round(simScore * 100);

    // 4. Skills Extraction and Comparison
    const resumeSkillsResult = extractSkills(resumeText);
    const jdSkillsResult = extractSkills(jdText);

    // Missing skills detection: Skills that are in the JD but not in the Resume
    const missingSkills = jdSkillsResult.found.filter(skill => !resumeSkillsResult.found.includes(skill));

    // 5. Entities, Sections & Quality Analytics
    const entities = extractEntities(resumeText);
    const sections = detectSections(resumeText);
    const duplicates = detectDuplicateKeywords(lemmatizedResume);
    const qualityReport = evaluateQuality(resumeText);

    // Identify candidate name if found in NER
    const personEntity = entities.find(e => e.label === "PERSON");
    const candidateName = personEntity ? personEntity.text : "Candidate Profile";

    // Detect target Job Title from JD
    const jdLines = jdText.split("\n");
    let jobTitle = "Target Position";
    if (jdLines.length > 0 && jdLines[0].trim().length < 50) {
      jobTitle = jdLines[0].trim();
    }

    // 6. Gemini AI Deep Analysis & Recommendations
    const geminiAnalysis = await getGeminiAnalysis(resumeText, jdText);

    // 7. Save Report to Local Database
    const reportData = {
      candidateName,
      jobTitle,
      matchPercentage,
      skillsFound: resumeSkillsResult.found,
      missingSkills,
      atsScore: qualityReport.atsScore,
      qualityScore: qualityReport.score,
      resumeText,
      jdText,
      analysis: geminiAnalysis,
      qualityReport: {
        ...qualityReport,
        duplicates
      }
    };

    const savedReport = saveReport(reportData);

    // Return comprehensive analysis package
    return res.json({
      success: true,
      reportId: savedReport.id,
      timestamp: savedReport.timestamp,
      candidateName,
      jobTitle,
      matchPercentage,
      atsScore: qualityReport.atsScore,
      qualityScore: qualityReport.score,
      skillsFound: resumeSkillsResult.found,
      skillsBreakdown: resumeSkillsResult.categoryBreakdown,
      missingSkills,
      resumeText,
      keywordFreq,
      entities,
      sections: Object.keys(sections).filter(s => s !== "general" && sections[s].length > 0),
      duplicates,
      qualityReport: {
        grammarScore: qualityReport.grammarCheckScore,
        issues: qualityReport.issues,
        hasEmail: qualityReport.hasEmail,
        hasLinkedIn: qualityReport.hasLinkedIn,
        sectionCoverage: qualityReport.sectionCoverage
      },
      analysis: geminiAnalysis
    });

  } catch (error: any) {
    console.error("Analysis route error:", error);
    return res.status(500).json({ error: error.message || "Internal server error occurred." });
  }
});

/**
 * History Routes
 */
app.get("/api/history", (req, res) => {
  try {
    const reports = getAllReports();
    return res.json({ success: true, reports });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

app.delete("/api/history/:id", (req, res) => {
  try {
    const success = deleteReport(req.params.id);
    return res.json({ success });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

/**
 * Export CSV
 */
app.get("/api/export/csv", (req, res) => {
  try {
    const csvContent = exportReportsCSV();
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=resume_analyzer_history.csv");
    return res.send(csvContent);
  } catch (err: any) {
    return res.status(500).send("Error exporting history.");
  }
});

app.use((error: Error, _req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (res.headersSent) return next(error);

  if (error instanceof multer.MulterError && error.code === "LIMIT_FILE_SIZE") {
    return res.status(413).json({ error: "Resume uploads must be 5 MB or smaller." });
  }

  if (error instanceof multer.MulterError || error.message === "Only PDF, DOCX, and TXT resumes are supported.") {
    return res.status(400).json({ error: error.message });
  }

  console.error("Unhandled request error:", error);
  return res.status(500).json({ error: "Unexpected server error." });
});

// ==========================================
// VITE DEV SERVER & STATIC HOSTING BUILD
// ==========================================

async function startServer() {
  try {
    if (process.env.NODE_ENV !== "production") {
      // Mount Vite Dev Server in middleware mode
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: "spa",
      });
      app.use(vite.middlewares);
      console.log("Vite development server loaded.");
    } else {
      // Production serving static assets
      const distPath = path.join(process.cwd(), "dist");
      app.use(express.static(distPath));
      app.get("*", (req, res) => {
        res.sendFile(path.join(distPath, "index.html"));
      });
      console.log("Serving production static assets.");
    }

    const server = app.listen(PORT, "0.0.0.0", () => {
      console.log(`AI Resume Analyzer backend is running on http://localhost:${PORT}`);
    });

    server.on("error", (error) => {
      console.error("Unable to start HTTP server:", error);
      process.exit(1);
    });

    const shutdown = (signal: string) => {
      console.log(`${signal} received. Closing HTTP server...`);
      server.close((error) => {
        if (error) {
          console.error("HTTP server did not close cleanly:", error);
          process.exit(1);
        }
        process.exit(0);
      });

      setTimeout(() => process.exit(1), 10_000).unref();
    };

    process.once("SIGTERM", () => shutdown("SIGTERM"));
    process.once("SIGINT", () => shutdown("SIGINT"));
  } catch (err) {
    console.error("Fatal error starting server:", err);
  }
}

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception thrown:", err);
});

startServer();
