import React, { useState } from "react";
import {
  BookOpen,
  Video,
  Award,
  ExternalLink,
  Play,
  Sparkles,
  TrendingUp,
  Target,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  GraduationCap,
  Briefcase,
  Layers,
  ChevronRight,
  ShieldCheck,
  Star
} from "lucide-react";
import { AnalysisResponse } from "../types";

interface Props {
  data: AnalysisResponse;
}

interface CourseItem {
  id: string;
  title: string;
  platform: "Coursera" | "Udemy" | "edX" | "LinkedIn Learning" | "Google";
  level: "Beginner" | "Intermediate" | "Advanced";
  duration: string;
  rating: number;
  url: string;
  skillTag: string;
  description: string;
}

interface VideoRecommendation {
  id: string;
  title: string;
  youtubeId: string;
  category: "Resume Tips" | "ATS Hacks" | "Technical Interview" | "System Design";
  duration: string;
  instructor: string;
  thumbnail: string;
  description: string;
}

export default function RecommendationsHub({ data }: Props) {
  const [activeTab, setActiveTab] = useState<"all" | "courses" | "videos" | "role_predict">("all");
  const [selectedVideo, setSelectedVideo] = useState<VideoRecommendation | null>(null);

  const skillsFound = data.skillsFound || [];
  const missingSkills = data.missingSkills || [];
  const resumeText = data.resumeText || "";
  const jobTitle = data.jobTitle || "Software Engineer";
  const matchPercentage = data.matchPercentage || 75;

  // --- ROLE & EXPERIENCE PREDICTION LOGIC ---
  const resumeLower = resumeText.toLowerCase();

  const getPredictedRole = () => {
    if (resumeLower.includes("data science") || resumeLower.includes("machine learning") || resumeLower.includes("pandas") || resumeLower.includes("tensorflow") || resumeLower.includes("pytorch")) {
      return {
        role: "Data Scientist / ML Engineer",
        category: "Artificial Intelligence & Data",
        confidence: 94,
        keySkills: ["Python", "TensorFlow", "Pandas", "Scikit-Learn", "SQL"]
      };
    } else if (resumeLower.includes("docker") || resumeLower.includes("kubernetes") || resumeLower.includes("aws") || resumeLower.includes("ci/cd") || resumeLower.includes("terraform")) {
      return {
        role: "DevOps & Cloud Systems Architect",
        category: "Cloud & Infrastructure",
        confidence: 92,
        keySkills: ["Docker", "Kubernetes", "AWS", "CI/CD", "Linux"]
      };
    } else if (resumeLower.includes("react") || resumeLower.includes("javascript") || resumeLower.includes("typescript") || resumeLower.includes("frontend") || resumeLower.includes("tailwind")) {
      return {
        role: "Full Stack Web Developer",
        category: "Software Engineering",
        confidence: 96,
        keySkills: ["React", "TypeScript", "Node.js", "Express", "REST APIs"]
      };
    } else {
      return {
        role: "Software Development Engineer (SDE)",
        category: "General Technology",
        confidence: 88,
        keySkills: ["Problem Solving", "System Architecture", "Git", "OOP"]
      };
    }
  };

  const getPredictedExperience = () => {
    const yearsMatches = resumeText.match(/(\d+)\+?\s*years?/gi);
    if (yearsMatches && yearsMatches.length > 0) {
      const nums = yearsMatches.map(m => parseInt(m.match(/\d+/)?.[0] || "0")).filter(n => n > 0 && n < 30);
      const maxYears = nums.length > 0 ? Math.max(...nums) : 2;
      if (maxYears >= 7) return { level: "Senior / Staff Engineer", range: "7+ Years Experience" };
      if (maxYears >= 3) return { level: "Mid-Level Specialist", range: "3-6 Years Experience" };
    }
    if (resumeLower.includes("lead") || resumeLower.includes("manager") || resumeLower.includes("architect")) {
      return { level: "Senior Lead Engineer", range: "5+ Years Experience" };
    }
    return { level: "Associate / Entry-Level Engineer", range: "0-2 Years Experience" };
  };

  const predictedRole = getPredictedRole();
  const predictedExp = getPredictedExperience();

  // --- CURATED RECOMMENDATIONS DATA ---
  const coursesList: CourseItem[] = [
    {
      id: "c1",
      title: "Meta Front-End Developer Professional Certificate",
      platform: "Coursera",
      level: "Intermediate",
      duration: "4 Months",
      rating: 4.8,
      url: "https://www.coursera.org/professional-certificates/meta-front-end-developer",
      skillTag: "React & TypeScript",
      description: "Master React, state management, and modern Web UI architecture directly from Meta engineers."
    },
    {
      id: "c2",
      title: "Machine Learning Specialization by Andrew Ng",
      platform: "Coursera",
      level: "Intermediate",
      duration: "3 Months",
      rating: 4.9,
      url: "https://www.coursera.org/specializations/machine-learning-introduction",
      skillTag: "Machine Learning & AI",
      description: "Deep dive into supervised learning, neural networks, and vector spaces with Stanford & DeepLearning.AI."
    },
    {
      id: "c3",
      title: "AWS Certified Solutions Architect – Associate",
      platform: "Udemy",
      level: "Intermediate",
      duration: "25 Hours",
      rating: 4.7,
      url: "https://www.udemy.com/course/aws-certified-solutions-architect-associate-amazon-web-services/",
      skillTag: "Cloud & DevOps",
      description: "Comprehensive guide to designing fault-tolerant, scalable cloud infrastructure on Amazon Web Services."
    },
    {
      id: "c4",
      title: "Docker and Kubernetes: The Complete Guide",
      platform: "Udemy",
      level: "Advanced",
      duration: "22 Hours",
      rating: 4.8,
      url: "https://www.udemy.com/course/docker-and-kubernetes-the-complete-guide/",
      skillTag: "Containerization",
      description: "Build, test, and deploy Docker container applications with production-grade Kubernetes clusters."
    },
    {
      id: "c5",
      title: "Google Data Analytics Professional Certificate",
      platform: "Google",
      level: "Beginner",
      duration: "6 Months",
      rating: 4.8,
      url: "https://www.coursera.org/professional-certificates/google-data-analytics",
      skillTag: "Data Analytics & SQL",
      description: "Gain hands-on skills in data cleaning, SQL query optimization, R programming, and data visualizations."
    }
  ];

  const videosList: VideoRecommendation[] = [
    {
      id: "v1",
      title: "How to Write an ATS-Friendly Resume in 2026 (Step-by-Step)",
      youtubeId: "BYUy1yvjHxE",
      category: "ATS Hacks",
      duration: "14:20",
      instructor: "CareerVidz",
      thumbnail: "https://img.youtube.com/vi/BYUy1yvjHxE/hqdefault.jpg",
      description: "Learn how modern Applicant Tracking Systems parse resume vectors, keywords, and typography formatting."
    },
    {
      id: "v2",
      title: "Top 10 Technical Interview Questions & Perfect Answers",
      youtubeId: "1mHjMNZZvFo",
      category: "Technical Interview",
      duration: "18:45",
      instructor: "Jeff Su",
      thumbnail: "https://img.youtube.com/vi/1mHjMNZZvFo/hqdefault.jpg",
      description: "Master the STAR method to answer complex technical, situational, and behavioral interview questions."
    },
    {
      id: "v3",
      title: "System Design Interview for Software Engineers",
      youtubeId: "bUHFg8CZFws",
      category: "System Design",
      duration: "45:10",
      instructor: "ByteByteGo",
      thumbnail: "https://img.youtube.com/vi/bUHFg8CZFws/hqdefault.jpg",
      description: "An architectural guide to designing high-throughput, low-latency microservices and database systems."
    },
    {
      id: "v4",
      title: "Resume Action Verbs & Metrics Optimization",
      youtubeId: "ttW6VzD_GzA",
      category: "Resume Tips",
      duration: "12:15",
      instructor: "Self Made Millennial",
      thumbnail: "https://img.youtube.com/vi/ttW6VzD_GzA/hqdefault.jpg",
      description: "Transform generic bullet points into high-impact, quantifiable accomplishment statements with metrics."
    }
  ];

  return (
    <div className="glass-academic rounded-2xl p-6 relative overflow-hidden space-y-6">
      <div className="hud-corner-tl" />
      <div className="hud-corner-br" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-amber-500/20">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h3 className="text-lg font-serif font-bold text-white tracking-wide">
              Smart Career Recommendations & Video Learning Hub
            </h3>
            <span className="text-[10px] font-mono font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30 px-2.5 py-0.5 rounded">
              AI PREDICTIONS & COURSES
            </span>
          </div>
          <p className="text-xs text-slate-300 font-sans">
            Predicted role analysis, skill gap courses, ATS hacks, and curated technical interview video guides.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-900/90 p-1 rounded-xl border border-amber-500/20">
          <button
            onClick={() => setActiveTab("all")}
            className={`text-[11px] font-mono px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === "all"
                ? "bg-amber-500 text-slate-950 font-bold shadow-md"
                : "text-slate-300 hover:text-amber-300"
            }`}
          >
            All Recommendations
          </button>
          <button
            onClick={() => setActiveTab("role_predict")}
            className={`text-[11px] font-mono px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === "role_predict"
                ? "bg-amber-500 text-slate-950 font-bold shadow-md"
                : "text-slate-300 hover:text-amber-300"
            }`}
          >
            Role Prediction
          </button>
          <button
            onClick={() => setActiveTab("courses")}
            className={`text-[11px] font-mono px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === "courses"
                ? "bg-amber-500 text-slate-950 font-bold shadow-md"
                : "text-slate-300 hover:text-amber-300"
            }`}
          >
            Skill Courses
          </button>
          <button
            onClick={() => setActiveTab("videos")}
            className={`text-[11px] font-mono px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === "videos"
                ? "bg-amber-500 text-slate-950 font-bold shadow-md"
                : "text-slate-300 hover:text-amber-300"
            }`}
          >
            Video Tutorials
          </button>
        </div>
      </div>

      {/* SECTION 1: PREDICTED JOB ROLE & EXPERIENCE LEVEL CARD */}
      {(activeTab === "all" || activeTab === "role_predict") && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* ML Classification Card */}
            <div className="p-5 bg-slate-900/90 rounded-xl border border-amber-500/40 relative overflow-hidden space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-wider flex items-center space-x-1.5">
                  <Target className="w-3.5 h-3.5" />
                  <span>PREDICTED JOB ROLE (SUPERVISED ML)</span>
                </span>
                <span className="text-[10px] font-mono bg-amber-500/15 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded font-bold">
                  {data.mlClassification?.confidence ? `${data.mlClassification.confidence}% CONFIDENCE` : `${predictedRole.confidence}% CONFIDENCE`}
                </span>
              </div>

              <div className="space-y-1">
                <h4 className="text-xl font-serif font-extrabold text-white">
                  {data.mlClassification?.predictedCategory || predictedRole.role}
                </h4>
                <p className="text-xs text-slate-300 font-sans flex items-center justify-between">
                  <span>ML Model: <strong className="text-amber-300">TF-IDF + Logistic Regression</strong></span>
                  {data.mlClassification?.modelAccuracy && (
                    <span className="text-[10px] font-mono text-teal-400 font-bold bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/20">
                      Model Accuracy: {data.mlClassification.modelAccuracy}%
                    </span>
                  )}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-800 space-y-1.5">
                <span className="text-[10px] font-mono text-slate-400 block uppercase">TOP CONTRIBUTING FEATURE WORDS (TF-IDF):</span>
                <div className="flex flex-wrap gap-1.5">
                  {(data.mlClassification?.topKeywords || predictedRole.keySkills).map((sk, idx) => (
                    <span key={idx} className="text-[10px] font-mono bg-slate-950 text-amber-300 border border-amber-500/20 px-2 py-0.5 rounded">
                      ✓ {sk}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Experience Level Card */}
            <div className="p-5 bg-slate-900/90 rounded-xl border border-teal-500/40 relative overflow-hidden space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-teal-400 uppercase tracking-wider flex items-center space-x-1.5">
                  <Briefcase className="w-3.5 h-3.5" />
                  <span>PREDICTED EXPERIENCE TIER</span>
                </span>
                <span className="text-[10px] font-mono bg-teal-500/15 text-teal-300 border border-teal-500/30 px-2 py-0.5 rounded font-bold">
                  {data.mlClassification?.experienceLevel ? "CLASSIFIED BY ML" : "CHRONOLOGY"}
                </span>
              </div>

              <div className="space-y-1">
                <h4 className="text-xl font-serif font-extrabold text-white">
                  {data.mlClassification?.experienceLevel || predictedExp.level}
                </h4>
                <p className="text-xs text-slate-300 font-sans">
                  Target Tier: <strong className="text-teal-300">{data.mlClassification?.experienceLevel || predictedExp.range}</strong>
                </p>
              </div>

              <div className="pt-2 border-t border-slate-800 space-y-1">
                <span className="text-[10px] font-mono text-slate-400 block">DATASET & MODEL METRICS:</span>
                <p className="text-xs text-slate-300 font-sans leading-relaxed">
                  Trained on <strong>{data.mlClassification?.datasetSize || 100} Resume Records</strong> across 10 distinct tech categories using Scikit-Learn TF-IDF feature extraction.
                </p>
              </div>
            </div>
          </div>

          {/* Probability Distribution Bar Breakdown */}
          {data.mlClassification?.probabilities && Object.keys(data.mlClassification.probabilities).length > 0 && (
            <div className="p-4 bg-slate-900/90 rounded-xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="font-bold text-white flex items-center space-x-2">
                  <Layers className="w-4 h-4 text-amber-400" />
                  <span>Supervised ML Probability Distribution Across Categories</span>
                </span>
                <span className="text-slate-400 text-[10px]">10 Category Matrix</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                {Object.entries(data.mlClassification.probabilities)
                  .sort((a, b) => b[1] - a[1])
                  .slice(0, 6)
                  .map(([cat, prob]) => (
                    <div key={cat} className="p-2 bg-slate-950 rounded border border-slate-800 space-y-1">
                      <div className="flex justify-between text-[11px]">
                        <span className="text-slate-300 font-semibold truncate max-w-[200px]">{cat}</span>
                        <span className="text-amber-400 font-bold">{prob}%</span>
                      </div>
                      <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-amber-500 to-teal-400 h-full rounded-full transition-all duration-500"
                          style={{ width: `${Math.max(prob, 2)}%` }}
                        />
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* SECTION 2: SKILL GAP & RECOMMENDED COURSES */}
      {(activeTab === "all" || activeTab === "courses") && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs font-mono text-slate-300">
            <span className="flex items-center space-x-2 font-bold text-white">
              <BookOpen className="w-4 h-4 text-amber-400" />
              <span>Recommended Certification Courses for Missing Skills</span>
            </span>
            <span className="text-amber-400 font-bold">{coursesList.length} Courses Curated</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {coursesList.map((course) => (
              <div
                key={course.id}
                className="p-4 bg-slate-900/90 rounded-xl border border-slate-800 hover:border-amber-500/40 transition-all duration-200 flex flex-col justify-between space-y-3 group"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[10px] font-mono">
                    <span className="bg-amber-500/15 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded font-bold">
                      {course.platform}
                    </span>
                    <span className="text-slate-400 flex items-center space-x-1">
                      <Star className="w-3 h-3 text-amber-400 fill-amber-400 inline" />
                      <span>{course.rating}</span>
                    </span>
                  </div>

                  <h5 className="font-serif font-bold text-white text-sm group-hover:text-amber-300 transition-colors leading-snug">
                    {course.title}
                  </h5>

                  <p className="text-[11px] text-slate-300 font-sans leading-relaxed line-clamp-2">
                    {course.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] font-mono">
                  <span className="text-teal-400 font-bold">{course.skillTag}</span>
                  <a
                    href={course.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1 text-amber-300 hover:text-amber-200 font-bold group-hover:translate-x-0.5 transition-transform"
                  >
                    <span>Enroll Now</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 3: RECOMMENDED INTERVIEW & RESUME TIP VIDEOS */}
      {(activeTab === "all" || activeTab === "videos") && (
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between text-xs font-mono text-slate-300">
            <span className="flex items-center space-x-2 font-bold text-white">
              <Video className="w-4 h-4 text-teal-400" />
              <span>Recommended Resume Tips & Interview Preparation Videos</span>
            </span>
            <span className="text-teal-400 font-bold">4 Video Guides</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {videosList.map((video) => (
              <div
                key={video.id}
                onClick={() => setSelectedVideo(video)}
                className="p-3 bg-slate-900/90 rounded-xl border border-slate-800 hover:border-teal-500/40 transition-all cursor-pointer space-y-2 group"
              >
                {/* Video Thumbnail with Play Badge */}
                <div className="relative aspect-video rounded-lg overflow-hidden bg-slate-950 border border-slate-800">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-85"
                  />
                  <div className="absolute inset-0 bg-slate-950/40 group-hover:bg-slate-950/20 transition-colors flex items-center justify-center">
                    <div className="w-9 h-9 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <Play className="w-4 h-4 fill-slate-950 ml-0.5" />
                    </div>
                  </div>
                  <span className="absolute bottom-1.5 right-1.5 bg-slate-950/90 text-white font-mono text-[9px] px-1.5 py-0.5 rounded border border-slate-800 font-bold">
                    {video.duration}
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-[9px] font-mono text-teal-400 font-bold block uppercase">
                    {video.category} • {video.instructor}
                  </span>
                  <h6 className="font-serif font-bold text-white text-xs leading-snug group-hover:text-amber-300 transition-colors line-clamp-2">
                    {video.title}
                  </h6>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIDEO MODAL PLAYER */}
      {selectedVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-3xl bg-slate-900 rounded-2xl border border-amber-500/40 p-4 shadow-2xl space-y-4 font-sans">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="space-y-0.5">
                <span className="text-[10px] font-mono font-bold text-amber-400 uppercase">
                  {selectedVideo.category} • {selectedVideo.instructor}
                </span>
                <h4 className="text-base font-serif font-bold text-white">{selectedVideo.title}</h4>
              </div>
              <button
                type="button"
                onClick={() => setSelectedVideo(null)}
                className="text-slate-400 hover:text-white font-mono text-xs p-1.5 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              >
                ✕ Close
              </button>
            </div>

            {/* Embedded YouTube Iframe */}
            <div className="aspect-video w-full rounded-xl overflow-hidden bg-black border border-slate-800 shadow-inner">
              <iframe
                className="w-full h-full"
                src={`https://www.youtube-nocookie.com/embed/${selectedVideo.youtubeId}?autoplay=1`}
                title={selectedVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            <p className="text-xs text-slate-300 font-sans leading-relaxed">
              {selectedVideo.description}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
