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
      console.warn("GEMINI_API_KEY is not defined or is a placeholder. Graceful fallback enabled.");
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
 * Uses Gemini AI to perform deep resume optimization, ATS advice, and grammar check.
 */
export async function getGeminiAnalysis(resumeText: string, jdText: string): Promise<GeminiAnalysisResult> {
  const client = getGeminiClient();

  if (!client) {
    return getFallbackAnalysis(resumeText, jdText);
  }

  try {
    const prompt = `
You are an expert Executive Recruiter, Resume Writer, and ATS Specialist.
Analyze the following Resume and Job Description (JD). Offer detailed feedback, suggestions, and recommendations to optimize the resume.

RESUME TEXT:
"""
${resumeText}
"""

JOB DESCRIPTION TEXT:
"""
${jdText}
"""

Provide your analysis in the following strict JSON format:
{
  "summary": "A 2-3 sentence overview of how well the resume matches the JD.",
  "strengths": ["Strength 1 (e.g. strong backend foundations)", "Strength 2"],
  "weaknesses": ["Weakness 1 (e.g. lack of cloud deployments mentioned)", "Weakness 2"],
  "recommendations": ["Actionable optimization step 1", "Actionable optimization step 2"],
  "suggestedBulletPoints": ["Example of a rewritten accomplishment bullet matching the JD style", "Example 2"],
  "missingKeywords": ["Crucial skill or tool mentioned in JD but absent from Resume", "Keyword 2"],
  "grammarNotes": "A brief observation about the spelling, grammar, tone, or style of the resume."
}
`;

    const response = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    const textOutput = response.text;
    if (!textOutput) throw new Error("Empty response from Gemini API");

    return JSON.parse(textOutput.trim());
  } catch (error) {
    console.error("Gemini analysis failed, falling back to rule-based system:", error);
    return getFallbackAnalysis(resumeText, jdText);
  }
}

/**
 * Intelligent rule-based fallback when Gemini API key is missing or call fails.
 */
function getFallbackAnalysis(resumeText: string, jdText: string): GeminiAnalysisResult {
  const resumeLower = resumeText.toLowerCase();
  const jdLower = jdText.toLowerCase();

  // Basic keyword matcher
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
    weaknesses.push(`Missing important target technologies such as: ${missingKeywords.slice(0, 3).join(", ")}.`);
  }
  if (!resumeLower.includes("achieved") && !resumeLower.includes("improved") && !resumeLower.includes("led")) {
    weaknesses.push("Accomplishment statements lack quantitative impact (e.g., %, $ figures).");
  } else {
    strengths.push("Accomplishments show action-oriented language.");
  }

  const recommendations: string[] = [
    "Tailor your technical skills summary block to place matching JD technologies near the front.",
    "Add metrics or percentages to your project accomplishments (e.g. 'Optimized performance by 25%').",
    "Ensure your professional summary highlights your primary expertise within the first 15 words."
  ];

  if (missingKeywords.length > 0) {
    recommendations.push(`Incorporate keywords like ${missingKeywords.slice(0, 2).join(", ")} directly into your experience section description.`);
  }

  return {
    summary: "The resume covers basic software engineering tenets but lacks specific alignment with the modern cloud/platform tools defined in the target job description. Custom tailoring is recommended.",
    strengths,
    weaknesses: weaknesses.length > 0 ? weaknesses : ["Accomplishment quantitative impact could be deepened."],
    recommendations,
    suggestedBulletPoints: [
      `Collaborated on scaling full stack services using modern framework stacks, resulting in improved latency across core modules.`,
      `Engineered secure REST APIs and orchestrated data layers to support business workflow requirements.`
    ],
    missingKeywords: missingKeywords.length > 0 ? missingKeywords : ["CLOUD ARCHITECTURE", "MICROSERVICES"],
    grammarNotes: "Tone is appropriately professional. Ensure consistency in verb tenses across current and past experiences."
  };
}
