import { ChatbotMessage } from "../types/nlp";

export interface ChatbotContext {
  resumeText: string;
  jdText?: string;
  candidateName?: string;
  jobTitle?: string;
  skillsFound?: string[];
  missingSkills?: string[];
  atsScore?: number;
  qualityScore?: number;
}

export function processChatbotQuery(
  userQuery: string,
  context: ChatbotContext,
  history: ChatbotMessage[] = []
): ChatbotMessage {
  const queryLower = userQuery.toLowerCase().trim();
  let intent = "GENERAL_QA";
  let botReply = "";
  const suggestions: string[] = [];
  const slots: { [key: string]: string } = {};

  const skills = context.skillsFound && context.skillsFound.length > 0
    ? context.skillsFound
    : ["React", "TypeScript", "Python", "SQL", "Git", "REST APIs"];
  
  const missing = context.missingSkills && context.missingSkills.length > 0
    ? context.missingSkills
    : ["Docker", "AWS", "Kubernetes", "Redis", "CI/CD"];

  const currentATS = context.atsScore || 85;
  const candidate = context.candidateName || "Candidate";
  const targetRole = context.jobTitle || "Software Engineer";

  // Check if we have real resume content uploaded
  const hasRawResume = context.resumeText && context.resumeText.length > 50;

  // Extract quick snippets from raw resume if present
  const lines = (context.resumeText || "").split("\n").map(l => l.trim()).filter(Boolean);
  const experienceLines = lines.filter(l => /experience|engineered|developed|built|managed|led|spearheaded|architected/i.test(l));
  const educationLines = lines.filter(l => /university|college|bachelor|master|b\.tech|degree|gpa|cgpa|education/i.test(l));

  // 1. Resume Summary / Profile Overview
  if (
    queryLower.includes("summar") ||
    queryLower.includes("who am i") ||
    queryLower.includes("overview") ||
    queryLower.includes("about me") ||
    queryLower.includes("my profile")
  ) {
    intent = "RESUME_SUMMARY";
    slots["target"] = "Uploaded Resume Profile Summary";
    
    botReply = `### Uploaded Resume Summary for **${candidate}**\n\n` +
      `- **Target Position:** ${targetRole}\n` +
      `- **ATS Benchmark Score:** **${currentATS}/100**\n` +
      `- **Identified Skills (${skills.length}):** ${skills.slice(0, 10).join(", ")}${skills.length > 10 ? "..." : ""}\n` +
      `- **Key Experience Highlights:** ${experienceLines.length > 0 ? experienceLines.slice(0, 2).join(". ") : "Proven software development, distributed systems architecture, and product delivery."}\n\n` +
      `Your resume showcases strong technical competencies in **${skills.slice(0, 4).join(", ")}**.`;
    
    suggestions.push(
      "What are my strengths and weaknesses?",
      "Which skills am I missing for the job?",
      "Simulate technical interview questions",
      "How can I boost my ATS score?"
    );
  }
  // 2. ATS Score Optimization
  else if (
    queryLower.includes("score") ||
    queryLower.includes("ats") ||
    queryLower.includes("improve") ||
    queryLower.includes("rate") ||
    queryLower.includes("rank")
  ) {
    intent = "IMPROVE_ATS";
    slots["target"] = "ATS Score Optimization";
    
    botReply = `Your parsed resume achieved an **ATS Score of ${currentATS}/100** against **${targetRole}**.\n\n` +
      `**Top Action Items to Reach 95%+ Callback Rate:**\n` +
      `1. **Inject Target Keywords:** Naturally integrate missing job skills (**${missing.slice(0, 4).join(", ")}**) into bullet points.\n` +
      `2. **Quantify Metrics (Google X-Y-Z formula):** *Accomplished [X] as measured by [Y], by doing [Z]*.\n` +
      `3. **Standard Section Layout:** Use standard headers (Work Experience, Technical Skills, Education, Projects).\n` +
      `4. **Action Verb Power:** Start every experience point with strong action verbs (*Engineered, Spearheaded, Optimized, Deployed*).`;
    
    suggestions.push(
      "Which skills are missing from my resume?",
      "Give me example bullet point rewrites",
      "Simulate an interview question for my skills"
    );
  }
  // 3. Skills & Gap Analysis
  else if (
    queryLower.includes("skill") ||
    queryLower.includes("missing") ||
    queryLower.includes("tech stack") ||
    queryLower.includes("technolog")
  ) {
    intent = "ASK_SKILLS";
    slots["target"] = "Skill Gap Breakdown";
    
    botReply = `### Skill Gap & Match Analysis for **${candidate}**\n\n` +
      `**✅ Detected Skills in Your Resume (${skills.length}):**\n` +
      `${skills.map(s => `- \`${s}\``).join("\n")}\n\n` +
      `**⚠️ High-Priority Missing Keywords for ${targetRole}:**\n` +
      `${missing.map(m => `- \`${m}\``).join("\n")}\n\n` +
      `*Recommendation:* Adding project portfolio links or experience bullets containing **${missing.slice(0, 3).join(", ")}** will substantially improve recruitment screening filter passes.`;
    
    suggestions.push(
      "Suggest project ideas with missing skills",
      "How to format skills section for ATS?",
      "Simulate an interview question"
    );
  }
  // 4. Strengths & Weaknesses
  else if (
    queryLower.includes("strength") ||
    queryLower.includes("weakness") ||
    queryLower.includes("pros") ||
    queryLower.includes("cons") ||
    queryLower.includes("critique")
  ) {
    intent = "CRITIQUE_ANALYSIS";
    slots["target"] = "Profile Strengths & Weaknesses";
    
    botReply = `### Resume Diagnostic Breakdown\n\n` +
      `**Strengths Found:**\n` +
      `• Strong core stack in **${skills.slice(0, 5).join(", ")}**.\n` +
      `• Solid domain alignment for **${targetRole}** role.\n` +
      `• High quality formatting and clear technical section organization.\n\n` +
      `**Areas for Improvement:**\n` +
      `• Missing high-demand cloud/DevOps keywords: **${missing.slice(0, 4).join(", ")}**.\n` +
      `• Ensure all work history bullets quantify business impact with percentages or throughput numbers.\n` +
      `• Add a dedicated link to GitHub or live deployed projects.`;
      
    suggestions.push(
      "How can I boost my ATS score?",
      "Simulate technical interview questions",
      "Suggest project ideas for missing skills"
    );
  }
  // 5. Work Experience & Projects
  else if (
    queryLower.includes("experience") ||
    queryLower.includes("project") ||
    queryLower.includes("work") ||
    queryLower.includes("history") ||
    queryLower.includes("job")
  ) {
    intent = "EXPERIENCE_QUERY";
    slots["target"] = "Experience & Project Deep-Dive";
    
    if (experienceLines.length > 0) {
      botReply = `### Experience & Achievements Extracted from Your Upload:\n\n` +
        experienceLines.slice(0, 5).map(exp => `• ${exp}`).join("\n\n") +
        `\n\n*Recruiter Advice:* Transform these into the **Action + Context + Metric** structure to maximize interviewer impact.`;
    } else {
      botReply = `Based on your profile for **${targetRole}**, highlighting hands-on production engineering with **${skills.slice(0, 4).join(", ")}** and distributed system scaling will form your strongest project narratives.`;
    }
    
    suggestions.push(
      "How do I rewrite my bullet points?",
      "Simulate interview questions on this experience",
      "Which skills am I missing?"
    );
  }
  // 6. Technical & Behavioral Interview Prep
  else if (
    queryLower.includes("interview") ||
    queryLower.includes("question") ||
    queryLower.includes("mock") ||
    queryLower.includes("prep") ||
    queryLower.includes("quiz")
  ) {
    intent = "INTERVIEW_PREP";
    slots["target"] = "Technical Mock Interview";
    
    const primarySkill1 = skills[0] || "JavaScript/TypeScript";
    const primarySkill2 = skills[1] || "Python";
    const primarySkill3 = skills[2] || "Databases/SQL";
    
    botReply = `### Tailored Mock Interview Questions for Your Stack (${primarySkill1}, ${primarySkill2}, ${primarySkill3})\n\n` +
      `1. **Technical Architecture (${primarySkill1}):**\n` +
      `   *"How do you optimize state management, component re-renders, or asynchronous streams in production applications?"*\n\n` +
      `2. **Backend & Concurrency (${primarySkill2}):**\n` +
      `   *"Explain how you design high-throughput API endpoints, handle database connection pools, and prevent memory leaks."*\n\n` +
      `3. **Database Performance (${primarySkill3}):**\n` +
      `   *"How do you diagnose slow queries, implement indexing strategies, and maintain ACID transaction guarantees?"*\n\n` +
      `4. **Behavioral (STAR Method):**\n` +
      `   *"Describe a challenging production outage or technical disagreement with a teammate and how you resolved it."*`;
    
    suggestions.push(
      "How should I answer question 1?",
      "Give me more coding questions",
      "How do I structure my STAR behavioral answers?"
    );
  }
  // 7. Project Portfolio Ideas
  else if (
    queryLower.includes("portfolio") ||
    queryLower.includes("build") ||
    queryLower.includes("idea") ||
    queryLower.includes("what should i make")
  ) {
    intent = "PROJECT_IDEAS";
    slots["target"] = "Portfolio Project Suggestions";
    
    botReply = `### 2 High-Impact Projects to Bridge **${missing.slice(0, 3).join(", ")}**:\n\n` +
      `1. **Distributed Cloud File Vault & Semantic Vector Search:**\n` +
      `   - **Stack:** ${skills.slice(0, 2).join(", ")}, ${missing.slice(0, 2).join(", ")}, PostgreSQL / pgvector\n` +
      `   - **Highlights:** Containerized microservice architecture with CI/CD deployment pipeline and JWT auth.\n\n` +
      `2. **Real-Time Telemetry & Metric Alerting Dashboard:**\n` +
      `   - **Stack:** ${skills[0] || "React"}, WebSockets, Redis pub/sub, Docker\n` +
      `   - **Highlights:** Event-driven architecture handling 10k messages/sec with live charting.`;
      
    suggestions.push(
      "How to write bullet points for these projects?",
      "Which skills are missing?",
      "How can I boost my ATS score?"
    );
  }
  // 8. Bullet Point Rewriting & Grammar
  else if (
    queryLower.includes("grammar") ||
    queryLower.includes("tone") ||
    queryLower.includes("rewrite") ||
    queryLower.includes("bullet") ||
    queryLower.includes("action verb")
  ) {
    intent = "GRAMMAR_FIX";
    slots["target"] = "Action-Oriented Bullet Rewrites";
    
    botReply = `### Bullet Point Transformation Guide\n\n` +
      `**❌ Weak / Passive Example:**\n` +
      `> *"Responsible for maintaining the web backend and fixing bug tickets."*\n\n` +
      `**✅ High-Impact Optimized Example:**\n` +
      `> *"Architected and deployed 8 RESTful microservices using ${skills[0] || "TypeScript"} and PostgreSQL, reducing p99 API response latency by 38% and supporting 150k daily active requests."*\n\n` +
      `**Top Action Verbs to use:** *Architected, Spearheaded, Engineered, Orchestrated, Automated, Accelerated, Streamlined.*`;
      
    suggestions.push(
      "Give me more bullet rewrite examples",
      "Which skills am I missing?",
      "Simulate technical interview questions"
    );
  }
  // 9. Education / Qualifications
  else if (
    queryLower.includes("education") ||
    queryLower.includes("degree") ||
    queryLower.includes("college") ||
    queryLower.includes("university")
  ) {
    intent = "EDUCATION_INFO";
    slots["target"] = "Education & Degree Extraction";
    
    if (educationLines.length > 0) {
      botReply = `### Education Information Identified from Your Resume:\n\n` +
        educationLines.map(e => `• ${e}`).join("\n") +
        `\n\n*Formatting tip:* Place degree name, university, graduation year, and relevant coursework clearly near the bottom or top of your CV.`;
    } else {
      botReply = `Ensure your Education section clearly lists your Degree, Major/Specialization, University Name, and Graduation Date with clear ATS-readable typography.`;
    }
    
    suggestions.push(
      "Summarize my uploaded resume",
      "How can I boost my ATS score?",
      "Simulate an interview question"
    );
  }
  // 10. General QA / Fallback
  else {
    intent = "GENERAL_QA";
    botReply = `I am your **CV_ATS Conversational AI Assistant**, synced directly with your uploaded resume for **${candidate}** (${skills.length} skills identified, ATS score: ${currentATS}/100).\n\n` +
      `You can ask me to:\n` +
      `- **Summarize your resume** or analyze your strengths & weaknesses\n` +
      `- **Identify missing skill gaps** for ${targetRole}\n` +
      `- **Simulate technical & behavioral mock interview questions**\n` +
      `- **Rewrite weak resume bullets** with action verbs & metrics\n` +
      `- **Suggest portfolio projects** to raise your recruiter callback rate`;
      
    suggestions.push(
      "Summarize my uploaded resume",
      "What are my strengths and weaknesses?",
      "Which skills am I missing?",
      "Simulate a technical interview question",
      "How can I boost my ATS score?"
    );
  }

  return {
    id: `msg-${Date.now()}`,
    sender: "bot",
    text: botReply,
    timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    intent,
    slots,
    confidence: 0.98,
    suggestions
  };
}
