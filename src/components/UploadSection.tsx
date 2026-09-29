import React, { useState, useRef } from "react";
import {
  Upload,
  FileText,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Trash2,
  Code2,
  ClipboardSignature,
  FileCode,
  Zap,
  Terminal,
  Cpu,
  Layers,
  ArrowRight,
  ShieldCheck
} from "lucide-react";

interface UploadSectionProps {
  onAnalyze: (data: { resumeText?: string; resumeFile?: File; jdText: string }) => void;
  loading: boolean;
}

const SAMPLE_JDS = [
  {
    title: "Full Stack Engineer",
    tag: "TS / REACT / PYTHON",
    text: `Full Stack Developer
We are looking for a skilled Full Stack Engineer to join our growing product team.

Responsibilities:
- Build scalable web applications using React, TypeScript, and Tailwind CSS.
- Design and implement microservices in Python or Node.js.
- Orchestrate data schemas on PostgreSQL and MongoDB databases.
- Deploy secure solutions on AWS or Google Cloud Platform (GCP).
- Write robust unit tests, participate in code reviews, and employ Docker for containerization.

Requirements:
- Strong experience with JavaScript, TypeScript, and Python.
- Practical expertise in React and Express or FastAPI frameworks.
- Proficient in SQL, relational databases, and NoSQL databases.
- Familiarity with CI/CD pipelines, Docker, and Git.
- Excellent communication and system design skills.`
  },
  {
    title: "AI / NLP Engineer",
    tag: "PYTORCH / LLM / NLP",
    text: `AI / NLP Engineer
Join our advanced NLP research and engineering unit to build language models.

Key Skills Needed:
- Python, pandas, numpy, scikit-learn.
- Experience with NLP frameworks (spaCy, NLTK, transformers).
- Strong concepts in machine learning, deep learning, and tf-idf vectorizers.
- Hands-on experience developing semantic search, chat agents, or text classifications.
- Experience with databases like PostgreSQL and Redis.
- Master's or Bachelor's degree in Computer Science, Data Science, or related field.`
  },
  {
    title: "Frontend Architect",
    tag: "REACT / NEXT / MOTION",
    text: `Frontend Engineer
Our design-focused engineering team is looking for a creative, detail-oriented Frontend Developer.

Key Responsibilities:
- Build beautiful, accessible user interfaces with React, Next.js, and TypeScript.
- Build polished responsive layouts styled with Tailwind CSS and Framer Motion.
- Collaborate closely with product designers to implement exact design specs.
- Optimize web application performance, accessibility (a11y), and loading times.
- Integrate RESTful APIs and real-time state managers.

Required Skills:
- Professional mastery of React, TypeScript, HTML, CSS, and Tailwind CSS.
- Familiarity with build systems, module bundlers, and Git.
- A strong sense of design, typography, spacing, and transition details.`
  },
  {
    title: "DevOps & Cloud",
    tag: "K8S / TERRAFORM / AWS",
    text: `Cloud & DevOps Architect
We are seeking an Infrastructure Specialist to own the security, scalability, and deployment automation of our cloud applications.

Responsibilities:
- Maintain production systems on AWS, Google Cloud (GCP), or Microsoft Azure.
- Implement robust Infrastructure as Code (IaC) architectures using Terraform.
- Orchestrate high-availability workloads inside Docker containers and Kubernetes.
- Build continuous integration & deployment pipelines (CI/CD) with Jenkins or GitHub Actions.
- Configure server firewalls, load balancers, and monitoring stacks (Prometheus, Grafana).

Required Expertise:
- Deep experience with Linux administration, shell scripting, and network topologies.
- Strong proficiency with Docker containerization and Kubernetes.
- Expert knowledge of Terraform, AWS services (EC2, S3, RDS, IAM), and Git.
- High attention to security audits, compliance, and disaster recovery.`
  },
  {
    title: "Backend Specialist",
    tag: "GO / JAVA / POSTGRES",
    text: `Backend Software Engineer
Our platform engineering team is hiring a Senior Backend Developer to build high-performance data systems.

Responsibilities:
- Architect scalable, secure microservices using Java / Spring Boot, Go, or Python.
- Build highly optimized database queries, schemas, and indexing on PostgreSQL or MySQL.
- Implement distributed caching systems using Redis or Memcached.
- Design clean, modular RESTful APIs and gRPC services.
- Participate in load testing, code reviews, and architectural planning.

Requirements:
- Strong core foundation in Java, Python, Go, or C#.
- Exceptional understanding of SQL databases, transactions, and performance tuning.
- Knowledge of system design patterns, concurrency, and security protocols.
- Experience with Docker, Git, and automated testing frameworks.`
  }
];

const SAMPLE_RESUME = `Alex Mercer
alex.mercer@email.com | (555) 123-4567 | linkedin.com/in/alexmercer
Full Stack Developer & Software Engineer

Professional Summary:
Dynamic Software Engineer with 3+ years of experience building responsive React applications and robust backend APIs. Skilled in designing clean code architecture, writing unit tests, and automating deployments. Passionate about machine learning and NLP.

Skills:
- Programming Languages: Python, JavaScript, TypeScript, SQL, HTML, CSS
- Frameworks: React, Vue, Nextjs, Express, FastAPI, scikit-learn, spacy
- Databases: PostgreSQL, SQLite, MongoDB, Redis
- Cloud & DevOps: AWS, Docker, Git, GitHub, Linux, CI/CD

Work Experience:
Software Developer | TechCorp Systems (2022 - Present)
- Developed and engineered key full stack modules using React, TypeScript, and Tailwind CSS.
- Built and optimized FastAPI microservices for secure data exchange, speeding up response times by 30%.
- Orchestrated and scaled relational databases using PostgreSQL, implementing advanced indexing queries.
- Created robust containerized services using Docker to simplify deployments across dev and prod environments.

Projects:
AI-Powered Markdown Parser
- Implemented a custom text parser in Python utilizing NLP patterns, regular expressions, and stopword cleaning.
- Utilized tf-idf metrics to auto-categorize tech documents, storing reports in MongoDB.

Education:
Bachelor of Science in Computer Science | Global Tech University (2018 - 2022)`;

export default function UploadSection({ onAnalyze, loading }: UploadSectionProps) {
  const [jdText, setJdText] = useState("");
  const [resumeText, setResumeText] = useState("");
  const [uploadMode, setUploadMode] = useState<"file" | "text">("file");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [activeJdIndex, setActiveJdIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle Drag Events
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  // Handle Drop Events
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const ext = file.name.split(".").pop()?.toLowerCase();
      if (ext === "pdf" || ext === "docx" || ext === "txt") {
        setSelectedFile(file);
      } else {
        alert("Unsupported format. Please upload PDF, DOCX, or TXT only.");
      }
    }
  };

  // Handle File Input Change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const selectFileTrigger = () => {
    fileInputRef.current?.click();
  };

  const removeFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Auto load demo content for instant inspection
  const loadDemo = () => {
    setUploadMode("text");
    setResumeText(SAMPLE_RESUME);
    setJdText(SAMPLE_JDS[0].text);
    setActiveJdIndex(0);
  };

  const handleSelectJdPreset = (index: number) => {
    setJdText(SAMPLE_JDS[index].text);
    setActiveJdIndex(index);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!jdText.trim()) {
      alert("Please provide target Job Description text.");
      return;
    }

    if (uploadMode === "file") {
      if (!selectedFile) {
        alert("Please upload a resume file (PDF, DOCX, TXT) or switch to Raw Text mode.");
        return;
      }
      onAnalyze({ resumeFile: selectedFile, jdText });
    } else {
      if (!resumeText.trim()) {
        alert("Please paste your resume text.");
        return;
      }
      onAnalyze({ resumeText, jdText });
    }
  };

  return (
    <div className="glass-cyber rounded-2xl p-6 sm:p-8 relative overflow-hidden transition-all duration-300">
      {/* Cyber HUD Corner brackets */}
      <div className="hud-corner-tl" />
      <div className="hud-corner-tr" />
      <div className="hud-corner-bl" />
      <div className="hud-corner-br" />

      {/* Decorative ambient background glows */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-[#FFD54A]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#00F5A0]/5 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-5 border-b border-[#00F5A0]/15">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-mono font-bold tracking-widest text-[#FFD54A] uppercase bg-[#FFD54A]/10 border border-[#FFD54A]/30 px-2 py-0.5 rounded">
              STEP 01 // INPUT EXTRACTION
            </span>
            <span className="text-xs font-mono text-emerald-400/60 hidden sm:inline">
              [VECTOR_STREAM]
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-display font-bold text-white tracking-tight">
            Upload Candidate Dossier & Target JD
          </h2>
          <p className="text-xs text-slate-300 font-sans">
            Feed your resume document or paste raw text alongside target role requirements for deep algorithmic vector comparison.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Two-Column Grid: Resume Document vs Job Description */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* LEFT COLUMN: Resume Input Block */}
          <div className="space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FileCode className="w-4 h-4 text-[#FFD54A]" />
                <label className="text-sm font-display font-bold text-white tracking-wide">
                  Candidate Resume <span className="text-[#FFD54A] font-mono">*</span>
                </label>
              </div>

              {/* Mode Toggle Pills */}
              <div className="flex bg-[#01140D] p-1 rounded-lg border border-[#00F5A0]/20">
                <button
                  type="button"
                  onClick={() => setUploadMode("file")}
                  className={`text-[11px] font-mono px-3 py-1 rounded-md transition-all ${
                    uploadMode === "file"
                      ? "bg-[#FFD54A] text-[#021E14] font-bold shadow-md"
                      : "text-slate-400 hover:text-emerald-300"
                  }`}
                >
                  FILE DROP
                </button>
                <button
                  type="button"
                  onClick={() => setUploadMode("text")}
                  className={`text-[11px] font-mono px-3 py-1 rounded-md transition-all ${
                    uploadMode === "text"
                      ? "bg-[#FFD54A] text-[#021E14] font-bold shadow-md"
                      : "text-slate-400 hover:text-emerald-300"
                  }`}
                >
                  RAW STREAM
                </button>
              </div>
            </div>

            {uploadMode === "file" ? (
              /* Futuristic Drag-and-Drop Zone */
              <div
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                onClick={selectFileTrigger}
                className={`relative rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 min-h-[250px] overflow-hidden ${
                  dragActive
                    ? "border-2 border-[#FFD54A] bg-[#FFD54A]/10 shadow-[0_0_30px_rgba(255,213,74,0.25)]"
                    : "border-2 border-dashed border-[#00F5A0]/30 hover:border-[#FFD54A]/60 bg-[#011810]/60 hover:bg-[#022418]/60"
                }`}
              >
                {/* Cyber Scan beam animation */}
                <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-[#00F5A0] to-transparent animate-scan-beam pointer-events-none" />

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".pdf,.docx,.txt"
                  className="hidden"
                />

                {!selectedFile ? (
                  <div className="text-center space-y-3 z-10">
                    <div className="mx-auto bg-[#021E14] p-4 rounded-2xl border border-[#00F5A0]/40 text-[#FFD54A] w-14 h-14 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <Upload className="w-6 h-6 animate-bounce" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-slate-100 font-display font-semibold">
                        Drag & Drop PDF, DOCX, or TXT
                      </p>
                      <p className="text-xs text-emerald-400/80 font-mono">
                        [MAX 10MB • NATIVE PARSER SUPPORTED]
                      </p>
                    </div>
                    <div className="pt-2">
                      <span className="inline-block text-xs font-mono font-bold bg-[#FFD54A]/15 text-[#FFD54A] px-3 py-1 rounded-md border border-[#FFD54A]/30">
                        BROWSE LOCAL STORAGE
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="text-center space-y-4 w-full px-4 z-10">
                    <div className="mx-auto bg-[#021E14] border-2 border-[#00F5A0] p-3.5 rounded-2xl text-[#00F5A0] w-14 h-14 flex items-center justify-center shadow-[0_0_20px_rgba(0,245,160,0.3)]">
                      <CheckCircle2 className="w-7 h-7 text-[#00F5A0]" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-center space-x-1.5">
                        <span className="text-[10px] font-mono font-bold bg-[#00F5A0]/20 text-[#00F5A0] px-2 py-0.5 rounded border border-[#00F5A0]/40">
                          FILE READY
                        </span>
                      </div>
                      <p className="text-sm text-white font-mono font-bold truncate max-w-xs mx-auto">
                        {selectedFile.name}
                      </p>
                      <p className="text-xs text-emerald-400/80 font-mono">
                        SIZE: {(selectedFile.size / 1024).toFixed(1)} KB • TYPE: {selectedFile.name.split(".").pop()?.toUpperCase()}
                      </p>
                    </div>
                    <div className="flex justify-center space-x-3 pt-1">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFile();
                        }}
                        className="text-xs font-mono font-bold bg-rose-950/40 hover:bg-rose-900/60 text-rose-400 border border-rose-800/60 px-3.5 py-1.5 rounded-lg flex items-center space-x-1.5 transition-all shadow"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>DISCARD</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Raw Textarea */
              <div className="relative">
                <textarea
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  placeholder="Paste complete raw text of resume here (experience, skills, education, projects)..."
                  className="w-full h-[250px] bg-[#01140D]/90 border border-[#00F5A0]/30 rounded-xl p-4 text-xs font-mono text-emerald-200 placeholder-emerald-800/60 focus:outline-none focus:border-[#FFD54A] focus:ring-1 focus:ring-[#FFD54A] resize-none transition-all scrollbar-cyber"
                />
                <div className="absolute bottom-3 right-3 flex items-center space-x-2 text-[10px] font-mono text-[#FFD54A] bg-[#021E14] px-2.5 py-1 rounded border border-[#FFD54A]/30">
                  <ClipboardSignature className="w-3 h-3 text-[#FFD54A]" />
                  <span>{resumeText.split(/\s+/).filter(Boolean).length} WORDS // PARSED</span>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: Target Job Description Input Block */}
          <div className="space-y-3.5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center space-x-2">
                <Terminal className="w-4 h-4 text-[#00F5A0]" />
                <label className="text-sm font-display font-bold text-white tracking-wide">
                  Target Job Description (JD) <span className="text-[#FFD54A] font-mono">*</span>
                </label>
              </div>

              {/* Quick Preset Selector */}
              <span className="text-[10px] font-mono text-emerald-400/80">
                PRESETS:
              </span>
            </div>

            {/* Preset Buttons Bar */}
            <div className="flex flex-wrap gap-1.5 pb-0.5">
              {SAMPLE_JDS.map((jd, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleSelectJdPreset(i)}
                  className={`text-[10px] font-mono px-2.5 py-1 rounded-md border transition-all ${
                    activeJdIndex === i
                      ? "bg-[#FFD54A] text-[#021E14] font-bold border-[#FFD54A] shadow-[0_0_10px_rgba(255,213,74,0.3)]"
                      : "bg-[#01140D] text-slate-300 hover:text-[#FFD54A] border-[#00F5A0]/20 hover:border-[#FFD54A]/40"
                  }`}
                >
                  {jd.title}
                </button>
              ))}
            </div>

            <div className="relative">
              <textarea
                value={jdText}
                onChange={(e) => {
                  setJdText(e.target.value);
                  setActiveJdIndex(null);
                }}
                placeholder="Paste the target job description requirements, responsibilities, and required tech stack..."
                className="w-full h-[210px] bg-[#01140D]/90 border border-[#00F5A0]/30 rounded-xl p-4 text-xs font-mono text-emerald-200 placeholder-emerald-800/60 focus:outline-none focus:border-[#FFD54A] focus:ring-1 focus:ring-[#FFD54A] resize-none transition-all scrollbar-cyber"
              />
              <div className="absolute bottom-3 right-3 flex items-center space-x-2 text-[10px] font-mono text-[#00F5A0] bg-[#021E14] px-2.5 py-1 rounded border border-[#00F5A0]/30">
                <FileText className="w-3 h-3 text-[#00F5A0]" />
                <span>{jdText.split(/\s+/).filter(Boolean).length} WORDS // LOADED</span>
              </div>
            </div>
          </div>

        </div>

        {/* Massive Submit Button */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[#00F5A0]/15">
          <div className="flex items-center space-x-2 text-xs font-mono text-emerald-400/80">
            <ShieldCheck className="w-4 h-4 text-[#00F5A0]" />
            <span>ALGORITHMS: TF-IDF TOKENIZER • COSINE SIMILARITY • NER • GEMINI AI AUDIT</span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto relative group overflow-hidden bg-[#FFD54A] hover:bg-[#ffe073] active:bg-[#e6be3b] text-[#021E14] font-display font-extrabold text-sm sm:text-base px-8 py-4 rounded-xl shadow-[0_0_25px_rgba(255,213,74,0.3)] hover:shadow-[0_0_35px_rgba(255,213,74,0.5)] active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none"
          >
            {/* Shimmer line */}
            <div className="absolute inset-0 bg-white/30 transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
            
            <div className="flex items-center justify-center space-x-2.5 relative z-10">
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-[#021E14] border-t-transparent rounded-full animate-spin" />
                  <span className="font-mono tracking-wider">RUNNING DEEP NLP AUDIT...</span>
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5 fill-[#021E14]" />
                  <span className="tracking-wide">EXECUTE DEEP ATS MATRIX SCAN</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </div>
          </button>
        </div>

      </form>
    </div>
  );
}
