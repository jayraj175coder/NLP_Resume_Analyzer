import React, { useState, useRef, useEffect } from "react";
import {
  MessageSquare,
  Send,
  Sparkles,
  Bot,
  User,
  Zap,
  Terminal,
  RefreshCw,
  Tag,
  Layers,
  HelpCircle,
  CheckCircle2,
  GraduationCap
} from "lucide-react";
import { processChatbotQuery } from "../../nlp/chatbot-engine";
import { ChatbotMessage } from "../../types/nlp";

interface Props {
  resumeText: string;
  candidateName?: string;
  jobTitle?: string;
  skillsFound?: string[];
  missingSkills?: string[];
  atsScore?: number;
}

/* Inline Markdown Parser to render **bold**, `code`, ### headings, and • bullet points seamlessly */
function FormattedText({ text }: { text: string }) {
  const lines = text.split("\n");
  return (
    <div className="space-y-1.5 font-sans">
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={idx} className="h-1" />;

        if (trimmed.startsWith("### ")) {
          return (
            <h4 key={idx} className="font-serif font-bold text-amber-300 text-sm mt-2 mb-1">
              {parseInlineMarkdown(trimmed.replace(/^###\s+/, ""))}
            </h4>
          );
        }

        if (trimmed.startsWith("## ")) {
          return (
            <h3 key={idx} className="font-serif font-bold text-white text-base mt-2 mb-1">
              {parseInlineMarkdown(trimmed.replace(/^##\s+/, ""))}
            </h3>
          );
        }

        if (trimmed.startsWith("- ") || trimmed.startsWith("• ") || trimmed.startsWith("* ")) {
          return (
            <div key={idx} className="flex items-start space-x-2 pl-2 text-slate-200 text-xs leading-relaxed">
              <span className="text-amber-400 font-bold select-none">•</span>
              <span>{parseInlineMarkdown(trimmed.replace(/^[-•*]\s+/, ""))}</span>
            </div>
          );
        }

        if (trimmed.startsWith("> ")) {
          return (
            <blockquote key={idx} className="border-l-2 border-amber-400/60 pl-3 py-1 bg-slate-900/60 rounded-r text-amber-200/90 italic font-mono text-[11px] my-1">
              {parseInlineMarkdown(trimmed.replace(/^>\s+/, ""))}
            </blockquote>
          );
        }

        return (
          <p key={idx} className="text-slate-200 text-xs leading-relaxed">
            {parseInlineMarkdown(line)}
          </p>
        );
      })}
    </div>
  );
}

function parseInlineMarkdown(content: string) {
  const parts: React.ReactNode[] = [];
  const regex = /(\*\*[^*]+\*\*|`[^`]+`|\*[^*]+\*)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(content)) !== null) {
    if (match.index > lastIndex) {
      parts.push(content.substring(lastIndex, match.index));
    }
    const token = match[0];
    if (token.startsWith("**") && token.endsWith("**")) {
      parts.push(
        <strong key={match.index} className="font-bold text-amber-300">
          {token.slice(2, -2)}
        </strong>
      );
    } else if (token.startsWith("`") && token.endsWith("`")) {
      parts.push(
        <code key={match.index} className="bg-slate-950 text-teal-300 border border-teal-500/30 px-1.5 py-0.5 rounded font-mono text-[11px]">
          {token.slice(1, -1)}
        </code>
      );
    } else if (token.startsWith("*") && token.endsWith("*")) {
      parts.push(
        <em key={match.index} className="italic text-slate-300">
          {token.slice(1, -1)}
        </em>
      );
    }
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < content.length) {
    parts.push(content.substring(lastIndex));
  }

  return parts;
}

export default function Module15Chatbot({
  resumeText,
  candidateName,
  jobTitle,
  skillsFound = [],
  missingSkills = [],
  atsScore = 85
}: Props) {
  const getInitialWelcome = () => ({
    id: "msg-0",
    sender: "bot" as const,
    text: `Hello ${candidateName ? `**${candidateName}**` : "Candidate"}! I am your **CV_ATS Resume Intelligence & Interview Co-Pilot**.\n\nI have indexed your uploaded resume${jobTitle ? ` targeting **${jobTitle}**` : ""} (${skillsFound.length > 0 ? skillsFound.length : 8} technical skills identified, ATS score: **${atsScore}/100**).\n\nAsk me anything about your uploaded resume, ATS optimization, missing skill bridges, or interview preparation!`,
    timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    intent: "GREETING",
    confidence: 0.99,
    suggestions: [
      "Summarize my uploaded resume",
      "What are my strengths and weaknesses?",
      "Which technical skills am I missing?",
      "Simulate a technical interview question",
      "How can I boost my ATS score?"
    ]
  });

  const [messages, setMessages] = useState<ChatbotMessage[]>([getInitialWelcome()]);

  // When uploaded resume context updates, reset messages with new candidate context
  useEffect(() => {
    setMessages([getInitialWelcome()]);
  }, [resumeText, candidateName, jobTitle, atsScore, skillsFound.length]);

  const [inputQuery, setInputQuery] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (textToSend?: string) => {
    const query = textToSend || inputQuery;
    if (!query.trim()) return;

    const userMsg: ChatbotMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputQuery("");

    // Simulate conversational engine response
    setTimeout(() => {
      const botResponse = processChatbotQuery(
        query,
        {
          resumeText,
          candidateName,
          jobTitle,
          skillsFound,
          missingSkills,
          atsScore
        },
        messages
      );
      setMessages((prev) => [...prev, botResponse]);
    }, 350);
  };

  return (
    <div className="space-y-4" id="module-chatbot-container">
      {/* Sub-bar Metadata */}
      <div className="flex items-center justify-between px-2 text-xs font-mono text-slate-300">
        <div className="flex items-center space-x-2">
          <span className="px-2.5 py-0.5 text-[10px] font-mono font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30 rounded">
            DIALOGUE ENGINE • INTENT COPILOT
          </span>
          <span className="hidden sm:inline">Entity Extraction & Dynamic Multi-Turn Context Tracking</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-teal-300 bg-slate-900/90 px-3 py-1 border border-teal-500/30 rounded-lg flex items-center gap-1.5 shadow">
            <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
            Context Memory Active
          </span>
        </div>
      </div>

      {/* Chat Terminal Window */}
      <div className="glass-academic border border-amber-500/30 rounded-2xl flex flex-col h-[560px] overflow-hidden shadow-2xl relative">
        <div className="hud-corner-tl" />
        <div className="hud-corner-br" />

        {/* Terminal Title Bar */}
        <div className="bg-slate-950/90 px-4 py-3 border-b border-amber-500/20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-teal-500/80 inline-block" />
            </div>
            <span className="text-xs font-mono font-bold text-white ml-2 flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-amber-400" />
              nlp_copilot_session // port:3000
            </span>
          </div>
          <button
            onClick={() =>
              setMessages([
                {
                  id: "reset",
                  sender: "bot",
                  text: "Session state reset. How can I assist your career and NLP pipeline analysis today?",
                  timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                  intent: "GREETING",
                  suggestions: ["How can I boost my ATS score?", "Which technical skills am I missing?"]
                }
              ])
            }
            className="text-xs text-slate-400 hover:text-amber-300 font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset State</span>
          </button>
        </div>

        {/* Message Stream */}
        <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-4 scrollbar-academic">
          {messages.map((msg) => {
            const isBot = msg.sender === "bot";
            return (
              <div key={msg.id} className={`flex gap-3 ${isBot ? "justify-start" : "justify-end"}`}>
                {isBot && (
                  <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/40 flex items-center justify-center shrink-0 shadow-md">
                    <Bot className="w-4.5 h-4.5 text-amber-400" />
                  </div>
                )}

                <div className={`max-w-[88%] space-y-2 ${isBot ? "items-start" : "items-end"}`}>
                  <div
                    className={`p-4 rounded-xl shadow-md ${
                      isBot
                        ? "bg-slate-900/90 text-slate-200 border border-amber-500/20"
                        : "bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-medium font-sans shadow-amber-500/20"
                    }`}
                  >
                    <FormattedText text={msg.text} />
                  </div>

                  {/* Intent & Slot Badges for Bot */}
                  {isBot && msg.intent && (
                    <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono text-slate-400 pl-1">
                      <span className="px-2 py-0.5 rounded bg-slate-950 border border-amber-500/30 text-amber-300 font-bold">
                        INTENT: {msg.intent}
                      </span>
                      {msg.confidence && (
                        <span>Confidence: {(msg.confidence * 100).toFixed(0)}%</span>
                      )}
                      <span>•</span>
                      <span>{msg.timestamp}</span>
                    </div>
                  )}

                  {/* Dynamic Suggestion Chips */}
                  {isBot && msg.suggestions && msg.suggestions.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {msg.suggestions.map((sug, i) => (
                        <button
                          key={i}
                          onClick={() => handleSend(sug)}
                          className="px-3 py-1.5 text-xs font-sans font-medium bg-slate-900/90 hover:bg-amber-500 hover:text-slate-950 text-amber-300 border border-amber-500/30 rounded-lg transition-all hover:scale-[1.02] text-left cursor-pointer shadow-sm"
                        >
                          ▸ {sug}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {!isBot && (
                  <div className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 border border-amber-400 flex items-center justify-center shrink-0 shadow-md font-bold">
                    <User className="w-4.5 h-4.5 text-slate-950" />
                  </div>
                )}
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3.5 bg-slate-950/90 border-t border-amber-500/20">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Ask anything about ATS optimization, your resume strengths, missing skills, or interview prep..."
              className="flex-1 bg-slate-900 border border-amber-500/30 rounded-xl px-4 py-2.5 text-xs text-white font-sans placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
            />
            <button
              type="submit"
              disabled={!inputQuery.trim()}
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-slate-950 font-serif font-bold text-xs rounded-xl transition-all flex items-center gap-2 shrink-0 shadow-md cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Transmit</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
