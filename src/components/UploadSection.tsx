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
  ShieldCheck,
  GraduationCap,
  BookOpen
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
    <div className="glass-academic rounded-2xl p-6 sm:p-8 relative overflow-hidden transition-all duration-300">
      {/* Card accents */}
      <div className="hud-corner-tl" />
      <div className="hud-corner-tr" />
      <div className="hud-corner-bl" />
      <div className="hud-corner-br" />

      {/* Decorative ambient background glows */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-5 border-b border-amber-500/20">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-mono font-bold tracking-widest text-amber-300 uppercase bg-amber-500/15 border border-amber-500/30 px-2.5 py-0.5 rounded">
              Phase 1 • Input Documents
            </span>
            <span className="text-xs font-mono text-teal-300/80 hidden sm:inline">
              PDF, DOCX & Text Ready
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-white tracking-tight">
            Document Evaluation Workspace
          </h2>
          <p className="text-xs text-slate-300 font-sans">
            Upload candidate resume and target role specification for high-precision vector distance scoring.
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
                <FileCode className="w-4 h-4 text-amber-400" />
                <label className="text-sm font-serif font-bold text-white tracking-wide">
                  Candidate Resume <span className="text-amber-400 font-mono">*</span>
                </label>
              </div>

              {/* Mode Toggle Pills */}
              <div className="flex bg-slate-900/90 p-1 rounded-lg border border-amber-500/20">
                <button
                  type="button"
                  onClick={() => setUploadMode("file")}
                  className={`text-[11px] font-mono px-3 py-1 rounded-md transition-all cursor-pointer ${
                    uploadMode === "file"
                      ? "bg-amber-500 text-slate-950 font-bold shadow-sm"
                      : "text-slate-300 hover:text-amber-300"
                  }`}
                >
                  Upload file
                </button>
                <button
                  type="button"
                  onClick={() => setUploadMode("text")}
                  className={`text-[11px] font-mono px-3 py-1 rounded-md transition-all cursor-pointer ${
                    uploadMode === "text"
                      ? "bg-amber-500 text-slate-950 font-bold shadow-sm"
                      : "text-slate-300 hover:text-amber-300"
                  }`}
                >
                  Paste text
                </button>
              </div>
            </div>

            {uploadMode === "file" ? (
              /* File drop zone */
              <div
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                onClick={selectFileTrigger}
                className={`relative rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 min-h-[250px] overflow-hidden ${
                  dragActive
                    ? "border-2 border-amber-400 bg-amber-500/10 shadow-[0_0_30px_rgba(245,158,11,0.25)]"
                    : "border-2 border-dashed border-amber-500/30 hover:border-amber-400/60 bg-slate-900/60 hover:bg-slate-800/60"
                }`}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".pdf,.docx,.txt"
                  className="hidden"
                />

                {!selectedFile ? (
                  <div className="text-center space-y-3 z-10">
                    <div className="mx-auto bg-slate-950 p-4 rounded-2xl border border-amber-500/40 text-amber-400 w-14 h-14 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <Upload className="w-6 h-6 text-amber-400" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-slate-100 font-serif font-semibold">
                        Drag & drop PDF, DOCX, or TXT document
                      </p>
                      <p className="text-xs text-amber-300/80 font-mono">
                        Up to 5 MB • PDF, DOCX, and TXT supported
                      </p>
                    </div>
                    <div className="pt-2">
                      <span className="inline-block text-xs font-mono font-bold bg-amber-500/15 text-amber-300 px-3 py-1 rounded-md border border-amber-500/30">
                        Choose Document File
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="text-center space-y-4 w-full px-4 z-10">
                    <div className="mx-auto bg-slate-950 border-2 border-teal-400 p-3.5 rounded-2xl text-teal-400 w-14 h-14 flex items-center justify-center shadow-[0_0_20px_rgba(13,148,136,0.3)]">
                      <CheckCircle2 className="w-7 h-7 text-teal-400" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-center space-x-1.5">
                        <span className="text-[10px] font-mono font-bold bg-teal-500/20 text-teal-300 px-2.5 py-0.5 rounded border border-teal-500/40">
                          Document Staged
                        </span>
                      </div>
                      <p className="text-sm text-white font-mono font-bold truncate max-w-xs mx-auto">
                        {selectedFile.name}
                      </p>
                      <p className="text-xs text-slate-300 font-mono">
                        {(selectedFile.size / 1024).toFixed(1)} KB • {selectedFile.name.split(".").pop()?.toUpperCase()} file
                      </p>
                    </div>
                    <div className="flex justify-center space-x-3 pt-1">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFile();
                        }}
                        className="text-xs font-mono font-bold bg-rose-950/50 hover:bg-rose-900/70 text-rose-300 border border-rose-800/60 px-3.5 py-1.5 rounded-lg flex items-center space-x-1.5 transition-all shadow cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove Document</span>
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
                  placeholder="Paste candidate resume content here, including work experience, technical stack, publications, and education..."
                  className="w-full h-[250px] bg-slate-900/90 border border-amber-500/30 rounded-xl p-4 text-xs font-mono text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 resize-none transition-all scrollbar-academic"
                />
                <div className="absolute bottom-3 right-3 flex items-center space-x-2 text-[10px] font-mono text-amber-300 bg-slate-950 px-2.5 py-1 rounded border border-amber-500/30">
                  <ClipboardSignature className="w-3 h-3 text-amber-400" />
                  <span>{resumeText.split(/\s+/).filter(Boolean).length} words</span>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: Target Job Description Input Block */}
          <div className="space-y-3.5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center space-x-2">
                <Terminal className="w-4 h-4 text-teal-400" />
                <label className="text-sm font-serif font-bold text-white tracking-wide">
                  Target Role Specification <span className="text-amber-400 font-mono">*</span>
                </label>
              </div>

              {/* Quick Preset Selector */}
              <span className="text-[10px] font-mono text-slate-300">
                Sample role presets
              </span>
            </div>

            {/* Preset Buttons Bar */}
            <div className="flex flex-wrap gap-1.5 pb-0.5">
              {SAMPLE_JDS.map((jd, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleSelectJdPreset(i)}
                  className={`text-[10px] font-mono px-2.5 py-1 rounded-md border transition-all cursor-pointer ${
                    activeJdIndex === i
                      ? "bg-amber-500 text-slate-950 font-bold border-amber-400 shadow-sm"
                      : "bg-slate-900 text-slate-300 hover:text-amber-300 border-amber-500/20 hover:border-amber-400/40"
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
                placeholder="Paste job description requirements, responsibilities, technical requirements, and qualifications..."
                className="w-full h-[210px] bg-slate-900/90 border border-amber-500/30 rounded-xl p-4 text-xs font-mono text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 resize-none transition-all scrollbar-academic"
              />
              <div className="absolute bottom-3 right-3 flex items-center space-x-2 text-[10px] font-mono text-teal-300 bg-slate-950 px-2.5 py-1 rounded border border-teal-500/30">
                <FileText className="w-3 h-3 text-teal-400" />
                <span>{jdText.split(/\s+/).filter(Boolean).length} words</span>
              </div>
            </div>
          </div>

        </div>

        {/* Submit Button */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-amber-500/20">
          <div className="flex items-center space-x-2 text-xs font-mono text-slate-300">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>TF-IDF vector distance • Cosine similarity • NER entity extraction</span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto relative group overflow-hidden bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-serif font-bold text-sm sm:text-base px-8 py-3.5 rounded-xl shadow-lg shadow-amber-500/25 active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
          >
            <div className="flex items-center justify-center space-x-2.5 relative z-10">
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  <span>Evaluating document...</span>
                </>
              ) : (
                <>
                  <GraduationCap className="w-5 h-5 stroke-[2.2]" />
                  <span className="tracking-wide">Run Academic Evaluation</span>
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
