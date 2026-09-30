import React, { useState, useRef, useEffect } from "react";
import {
  MessageSquare,
  Send,
  Sparkles,
  Bot,
  User,
  Zap,
  RefreshCw,
  Copy,
  Check,
  ThumbsUp,
  ThumbsDown,
  Paperclip,
  ArrowUp,
  ChevronDown,
  Cpu,
  Bookmark
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

/* Formatted Text Component for rendering Markdown text cleanly like ChatGPT */
function FormattedText({ text }: { text: string }) {
  const lines = text.split("\n");
  return (
    <div className="space-y-2 font-sans text-sm sm:text-base leading-relaxed text-slate-100">
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={idx} className="h-1.5" />;

        if (trimmed.startsWith("### ")) {
          return (
            <h4 key={idx} className="font-serif font-bold text-amber-300 text-base sm:text-lg mt-3 mb-1.5">
              {parseInlineMarkdown(trimmed.replace(/^###\s+/, ""))}
            </h4>
          );
        }

        if (trimmed.startsWith("## ")) {
          return (
            <h3 key={idx} className="font-serif font-bold text-white text-lg sm:text-xl mt-3 mb-2">
              {parseInlineMarkdown(trimmed.replace(/^##\s+/, ""))}
            </h3>
          );
        }

        if (trimmed.startsWith("- ") || trimmed.startsWith("• ") || trimmed.startsWith("* ")) {
          return (
            <div key={idx} className="flex items-start space-x-2.5 pl-2 text-slate-200">
              <span className="text-amber-400 font-bold select-none mt-0.5">•</span>
              <span>{parseInlineMarkdown(trimmed.replace(/^[-•*]\s+/, ""))}</span>
            </div>
          );
        }

        if (trimmed.startsWith("> ")) {
          return (
            <blockquote key={idx} className="border-l-3 border-amber-400/80 pl-3.5 py-1.5 bg-slate-900/80 rounded-r-xl text-amber-200 font-mono text-xs my-2">
              {parseInlineMarkdown(trimmed.replace(/^>\s+/, ""))}
            </blockquote>
          );
        }

        return (
          <p key={idx} className="text-slate-200">
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
        <strong key={match.index} className="font-semibold text-amber-300">
          {token.slice(2, -2)}
        </strong>
      );
    } else if (token.startsWith("`") && token.endsWith("`")) {
      parts.push(
        <code key={match.index} className="bg-slate-950 text-teal-300 border border-teal-500/30 px-1.5 py-0.5 rounded-md font-mono text-xs">
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
    text: `Hello ${candidateName ? `**${candidateName}**` : "Candidate"}! I am your **Resume Co-Pilot & ATS Intelligence AI**.\n\nI have indexed your uploaded resume${jobTitle ? ` targeting **${jobTitle}**` : ""} (${skillsFound.length > 0 ? skillsFound.length : 8} technical skills identified, ATS score: **${atsScore}/100**).\n\nAsk me anything about your uploaded resume, ATS optimization, missing skill bridges, or technical interview preparation!`,
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
  const [inputQuery, setInputQuery] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<Record<string, "up" | "down">>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages([getInitialWelcome()]);
  }, [resumeText, candidateName, jobTitle, atsScore, skillsFound.length]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isGenerating]);

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || inputQuery;
    if (!query.trim() || isGenerating) return;

    const userMsg: ChatbotMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputQuery("");
    setIsGenerating(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: query,
          context: {
            resumeText,
            candidateName,
            jobTitle,
            skillsFound,
            missingSkills,
            atsScore
          }
        })
      });

      const data = await res.json();
      if (data.success && data.text) {
        const botResponse: ChatbotMessage = {
          id: `bot-${Date.now()}`,
          sender: "bot",
          text: data.text,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          intent: data.intent || "GEMINI_GENERATIVE_AI",
          confidence: data.confidence || 0.99,
          suggestions: [
            "Summarize my uploaded resume",
            "What are my strengths and weaknesses?",
            "Which technical skills am I missing?",
            "Simulate a technical interview question",
            "How can I boost my ATS score?"
          ]
        };
        setMessages((prev) => [...prev, botResponse]);
        setIsGenerating(false);
        return;
      }
    } catch (err) {
      console.warn("Gemini Chat API call error, using local fallback:", err);
    }

    // Local NLP Rule-Engine Fallback
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
      setIsGenerating(false);
    }, 350);
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleFeedback = (id: string, type: "up" | "down") => {
    setFeedback((prev) => ({ ...prev, [id]: type }));
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-4" id="module-chatbot-container">
      
      {/* ChatGPT / Gemini Glass Container */}
      <div className="glass-academic border border-amber-500/30 rounded-3xl flex flex-col h-[650px] overflow-hidden shadow-2xl relative bg-slate-950/90">
        
        {/* Modern Model Selector Top Bar */}
        <div className="bg-slate-900/90 px-6 py-4 border-b border-amber-500/20 flex flex-wrap items-center justify-between gap-3 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-teal-500 text-slate-950 shadow-md">
              <Sparkles className="w-5 h-5 fill-slate-950 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif font-bold text-white text-base">
                  Resume Co-Pilot AI
                </span>
                <span className="bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[10px] font-mono px-2 py-0.5 rounded-full font-bold">
                  GPT-4o & Gemini Grounded
                </span>
              </div>
              <p className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
                <span>Resume context memory active</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                setMessages([
                  {
                    id: "reset",
                    sender: "bot",
                    text: "Conversation history cleared. How can I help with your resume or interview prep today?",
                    timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                    intent: "GREETING",
                    suggestions: ["How can I boost my ATS score?", "Which technical skills am I missing?"]
                  }
                ])
              }
              className="text-xs text-slate-400 hover:text-amber-300 font-sans font-medium px-3 py-1.5 rounded-lg hover:bg-slate-800 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Clear Chat</span>
            </button>
          </div>
        </div>

        {/* ChatGPT Chat Stream */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-6 scrollbar-academic">
          {messages.map((msg) => {
            const isBot = msg.sender === "bot";
            const isCopied = copiedId === msg.id;
            const currentFeedback = feedback[msg.id];

            return (
              <div
                key={msg.id}
                className={`flex gap-3 sm:gap-4 max-w-4xl mx-auto ${
                  isBot ? "justify-start" : "justify-end"
                }`}
              >
                {/* Bot Avatar */}
                {isBot && (
                  <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 flex items-center justify-center shrink-0 shadow-md font-bold mt-1">
                    <Sparkles className="w-5 h-5 fill-slate-950 stroke-[2.2]" />
                  </div>
                )}

                {/* Message Content Container */}
                <div className={`space-y-2 ${isBot ? "w-full max-w-[88%]" : "max-w-[80%]"}`}>
                  
                  {/* Bubble */}
                  <div
                    className={`p-4 sm:p-5 rounded-2xl ${
                      isBot
                        ? "bg-slate-900/90 border border-amber-500/20 shadow-md"
                        : "bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-sans shadow-md"
                    }`}
                  >
                    <FormattedText text={msg.text} />
                  </div>

                  {/* ChatGPT Action Toolbar for Bot Responses */}
                  {isBot && (
                    <div className="flex flex-wrap items-center justify-between gap-2 px-1 pt-1 text-xs text-slate-400 font-sans">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleCopy(msg.id, msg.text)}
                          className="hover:text-amber-300 flex items-center gap-1 cursor-pointer transition-colors"
                          title="Copy response"
                        >
                          {isCopied ? <Check className="w-3.5 h-3.5 text-teal-400" /> : <Copy className="w-3.5 h-3.5" />}
                          <span className="text-[11px]">{isCopied ? "Copied" : "Copy"}</span>
                        </button>

                        <button
                          onClick={() => handleFeedback(msg.id, "up")}
                          className={`hover:text-teal-300 cursor-pointer transition-colors ${
                            currentFeedback === "up" ? "text-teal-400" : ""
                          }`}
                          title="Helpful"
                        >
                          <ThumbsUp className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleFeedback(msg.id, "down")}
                          className={`hover:text-rose-400 cursor-pointer transition-colors ${
                            currentFeedback === "down" ? "text-rose-400" : ""
                          }`}
                          title="Not helpful"
                        >
                          <ThumbsDown className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {msg.intent && (
                        <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400">
                          <span className="px-2 py-0.5 rounded-md bg-slate-900 border border-amber-500/30 text-amber-300 font-bold">
                            INTENT: {msg.intent}
                          </span>
                          {msg.confidence && (
                            <span>{(msg.confidence * 100).toFixed(0)}% confidence</span>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Modern Prompt Chips */}
                  {isBot && msg.suggestions && msg.suggestions.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-2">
                      {msg.suggestions.map((sug, i) => (
                        <button
                          key={i}
                          onClick={() => handleSend(sug)}
                          className="px-3.5 py-1.5 text-xs font-sans font-medium bg-slate-900/90 hover:bg-amber-500 hover:text-slate-950 text-amber-300 border border-amber-500/30 rounded-xl transition-all hover:scale-[1.02] text-left cursor-pointer shadow-sm flex items-center gap-1.5"
                        >
                          <Zap className="w-3 h-3 text-amber-400 shrink-0" />
                          <span>{sug}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* User Avatar */}
                {!isBot && (
                  <div className="w-9 h-9 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center shrink-0 shadow-md font-bold mt-1">
                    <User className="w-5 h-5 text-slate-950" />
                  </div>
                )}
              </div>
            );
          })}

          {/* Typing indicator */}
          {isGenerating && (
            <div className="flex gap-3 max-w-4xl mx-auto items-center">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 flex items-center justify-center shrink-0 shadow-md">
                <Sparkles className="w-5 h-5 fill-slate-950 animate-spin" style={{ animationDuration: "3s" }} />
              </div>
              <div className="p-3.5 bg-slate-900/90 border border-amber-500/20 rounded-2xl flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-amber-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                <div className="w-2 h-2 rounded-full bg-amber-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                <div className="w-2 h-2 rounded-full bg-amber-400 animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* ChatGPT Floating Input Box */}
        <div className="p-4 sm:p-5 bg-slate-950 border-t border-amber-500/20">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="relative flex items-center max-w-4xl mx-auto"
          >
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Ask Resume Co-Pilot anything about ATS optimization, missing skills, or interview prep..."
              className="w-full bg-slate-900 border border-amber-500/30 rounded-2xl pl-5 pr-14 py-3.5 text-sm text-white font-sans placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 shadow-xl"
            />
            
            <button
              type="submit"
              disabled={!inputQuery.trim() || isGenerating}
              className="absolute right-2.5 w-9 h-9 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 disabled:opacity-30 text-slate-950 rounded-xl flex items-center justify-center transition-all cursor-pointer shadow-md"
              title="Send message"
            >
              <ArrowUp className="w-5 h-5 stroke-[2.5]" />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
