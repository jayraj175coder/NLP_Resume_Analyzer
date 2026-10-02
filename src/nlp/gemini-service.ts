import { GoogleGenAI } from "@google/genai";

let aiInstance: GoogleGenAI | null = null;

/**
 * Lazy initialization of the Gemini client.
 * Avoids crashing the application on startup if the API key is missing.
 */
export function getGeminiClient(): GoogleGenAI | null {
  if (!aiInstance) {
    const key = process.env.GEMINI_API_KEY;
    if (!key || key === "MY_GEMINI_API_KEY") {
      console.warn("GEMINI_API_KEY is not defined or is a placeholder. Graceful rule-based engine enabled.");
      return null;
    }
    aiInstance = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiInstance;
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

/**
 * Uses Gemini AI to perform fast resume optimization, ATS advice, and grammar checks.
 */
export async function getGeminiAnalysis(resumeText: string, jdText: string): Promise<GeminiAnalysisResult> {
  const client = getGeminiClient();

  if (!client) {
    return getFallbackAnalysis(resumeText, jdText);
  }

  try {
    const model = process.env.GEMINI_MODEL?.trim() || "gemini-2.5-flash";
    const prompt = `
You are an expert Executive Recruiter and ATS Specialist.
Analyze the Resume and Job Description (JD) below. Provide concise JSON analysis.

RESUME TEXT:
"""
${resumeText.slice(0, 4000)}
"""

JOB DESCRIPTION TEXT:
"""
${jdText.slice(0, 4000)}
"""

Provide your output in strict JSON:
{
  "summary": "2 sentence overview of match quality.",
  "strengths": ["Key strength 1", "Key strength 2"],
  "weaknesses": ["Key weakness 1", "Key weakness 2"],
  "recommendations": ["Action step 1", "Action step 2"],
  "suggestedBulletPoints": ["Rewritten accomplishment bullet 1", "Rewritten bullet 2"],
  "missingKeywords": ["Missing skill 1", "Missing skill 2"],
  "grammarNotes": "Observation on resume tone/grammar."
}
`;

    const response = await client.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        maxOutputTokens: 1200,
        temperature: 0.2,
      }
    });

    const textOutput = response.text;
    if (!textOutput) throw new Error("Empty response from Gemini API");

    const analysis = JSON.parse(textOutput.trim()) as GeminiAnalysisResult;
    if (
      typeof analysis.summary !== "string" ||
      !Array.isArray(analysis.strengths) ||
      !Array.isArray(analysis.weaknesses) ||
      !Array.isArray(analysis.recommendations) ||
      !Array.isArray(analysis.suggestedBulletPoints) ||
      !Array.isArray(analysis.missingKeywords) ||
      typeof analysis.grammarNotes !== "string"
    ) {
      throw new Error("Gemini returned invalid analysis JSON structure");
    }

    return analysis;
  } catch (error) {
    console.error("Gemini analysis failed, using fast rule-based engine:", error);
    return getFallbackAnalysis(resumeText, jdText);
  }
}

/**
 * Intelligent rule-based fallback when Gemini API key is missing or call fails.
 */
function getFallbackAnalysis(resumeText: string, jdText: string): GeminiAnalysisResult {
  const resumeLower = resumeText.toLowerCase();
  const jdLower = jdText.toLowerCase();

  const keywords = ["docker", "kubernetes", "aws", "gcp", "azure", "ci/cd", "machine learning", "fastapi", "react", "typescript", "microservices", "unit testing"];
  const missingKeywords: string[] = [];
  const strengths: string[] = [];

  keywords.forEach(word => {
    const inJd = jdLower.includes(word);
    const inResume = resumeLower.includes(word);

    if (inJd && !inResume) {
      missingKeywords.push(word.toUpperCase());
    } else if (inJd && inResume) {
      strengths.push(`Matches JD requirement for ${word.toUpperCase()}`);
    }
  });

  if (strengths.length === 0) {
    strengths.push("Good length and layout density.");
    strengths.push("Technical skills section identified.");
  }

  const weaknesses: string[] = [];
  if (missingKeywords.length > 0) {
    weaknesses.push(`Missing target technologies: ${missingKeywords.slice(0, 3).join(", ")}.`);
  }

  const recommendations: string[] = [
    "Tailor your technical skills summary block to place matching JD technologies near the front.",
    "Add metrics or percentages to your project accomplishments (e.g. 'Optimized performance by 25%').",
    "Ensure your professional summary highlights your primary expertise within the first 15 words."
  ];

  return {
    summary: "The resume covers core software engineering tenets but requires tighter keyword alignment with modern cloud/platform tools in the target job description.",
    strengths,
    weaknesses: weaknesses.length > 0 ? weaknesses : ["Accomplishment quantitative metrics can be deepened."],
    recommendations,
    suggestedBulletPoints: [
      `Collaborated on scaling full stack services using modern framework stacks, resulting in improved latency across core modules.`,
      `Engineered secure REST APIs and orchestrated data layers to support business workflow requirements.`
    ],
    missingKeywords: missingKeywords.length > 0 ? missingKeywords : ["CLOUD ARCHITECTURE", "MICROSERVICES"],
    grammarNotes: "Tone is appropriately professional. Ensure consistent past tense verbs for completed positions."
  };
}

/**
 * Uses Gemini AI for ultra-fast, low-latency conversational responses grounded on candidate resume data.
 */
export async function getGeminiChatResponse(
  userQuery: string,
  context: {
    resumeText?: string;
    candidateName?: string;
    jobTitle?: string;
    skillsFound?: string[];
    missingSkills?: string[];
    atsScore?: number;
  }
): Promise<string | null> {
  const client = getGeminiClient();
  if (!client || !userQuery.trim()) return null;

  try {
    const model = process.env.GEMINI_MODEL?.trim() || "gemini-2.5-flash";
    const prompt = `
You are an expert AI Career Coach & Resume Co-Pilot.
Answer concisely based on the candidate's uploaded resume context.

CANDIDATE CONTEXT:
- Name: ${context.candidateName || "Candidate"}
- Target Position: ${context.jobTitle || "Software Engineer"}
- ATS Score: ${context.atsScore || 85}/100
- Skills Found: ${(context.skillsFound || []).slice(0, 10).join(", ") || "TypeScript, React, Python, SQL"}
- Missing Skills: ${(context.missingSkills || []).slice(0, 5).join(", ") || "Docker, AWS"}

USER QUESTION: "${userQuery}"

INSTRUCTIONS:
- Give a fast, helpful, clear response in under 180 words.
- Use bullet points & bold keywords where appropriate.
`;

    const response = await client.models.generateContent({
      model,
      contents: prompt,
      config: {
        maxOutputTokens: 500, // Reduced token length for sub-second responses
        temperature: 0.2,
      }
    });

    return response.text || null;
  } catch (err) {
    console.error("Gemini chat response failed, falling back to NLP engine:", err);
    return null;
  }
}
