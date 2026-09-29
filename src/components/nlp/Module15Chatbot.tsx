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
  HelpCircle
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
    text: `Hello ${candidateName ? `**${candidateName}**` : ""}! I am your **CV_ATS Resume Intelligence & Interview Co-Pilot**.\n\nI have indexed your uploaded resume${jobTitle ? ` targeting **${jobTitle}**` : ""} (${skillsFound.length > 0 ? skillsFound.length : 8} technical skills identified, ATS score: **${atsScore}/100**).\n\nAsk me anything about your uploaded resume, ATS optimization, missing skill bridges, or interview preparation!`,
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
    }, 400);
  };

  return (
    <div className="space-y-6" id="module-chatbot-container">
      {/* Header */}
      <div className="bg-[#04241a]/80 border border-emerald-500/20 rounded-xl p-5 backdrop-blur-md">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-2">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 text-xs font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded">
                CV_ATS // RESUME INTELLIGENCE ASSISTANT
              </span>
              <span className="text-xs text-gray-400 font-mono">CONVERSATIONAL_INTENT_COPILOT</span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              Conversational AI Assistant & Interview Co-Pilot
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 px-3 py-1.5 border border-emerald-500/30 rounded-lg flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Context Memory Active
            </span>
          </div>
        </div>

        <p className="text-xs text-gray-300 leading-relaxed">
          Full conversational dialogue engine featuring <strong>Intent Recognition</strong>, <strong>Slot Filling / Entity Extraction</strong>, <strong>Dynamic Multi-Turn Context Tracking</strong>, and real-time knowledge grounding against your uploaded resume data.
        </p>
      </div>

      {/* Chat Terminal Window */}
      <div className="bg-[#02130d] border border-emerald-500/30 rounded-xl flex flex-col h-[520px] overflow-hidden shadow-2xl">
        {/* Terminal Title Bar */}
        <div className="bg-[#04241a] px-4 py-3 border-b border-emerald-500/20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
            </div>
            <span className="text-xs font-mono font-bold text-white ml-2 flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-emerald-400" />
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
            className="text-xs text-gray-400 hover:text-white font-mono flex items-center gap-1"
          >
            <RefreshCw className="w-3 h-3" />
            Reset State
          </button>
        </div>

        {/* Message Stream */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          {messages.map((msg) => {
            const isBot = msg.sender === "bot";
            return (
              <div key={msg.id} className={`flex gap-3 ${isBot ? "justify-start" : "justify-end"}`}>
                {isBot && (
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4 text-emerald-400" />
                  </div>
                )}

                <div className={`max-w-[85%] space-y-2 ${isBot ? "items-start" : "items-end"}`}>
                  <div
                    className={`p-3.5 rounded-xl text-xs font-mono leading-relaxed ${
                      isBot
                        ? "bg-[#04241a] text-gray-200 border border-emerald-500/20"
                        : "bg-emerald-500 text-black font-semibold shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                    }`}
                  >
                    <div className="whitespace-pre-line">{msg.text}</div>
                  </div>

                  {/* Intent & Slot Badges for Bot */}
                  {isBot && msg.intent && (
                    <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono text-gray-400 pl-1">
                      <span className="px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 font-bold">
                        INTENT: {msg.intent}
                      </span>
                      {msg.confidence && (
                        <span>Confidence: {(msg.confidence * 100).toFixed(0)}%</span>
                      )}
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
                          className="px-2.5 py-1 text-[11px] font-mono bg-[#04241a] hover:bg-emerald-950 text-emerald-300 border border-emerald-500/30 rounded-lg transition-all hover:scale-[1.02] text-left"
                        >
                          ▸ {sug}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {!isBot && (
                  <div className="w-8 h-8 rounded-lg bg-[#FFD54A]/20 border border-[#FFD54A]/40 flex items-center justify-center shrink-0">
                    <User className="w-4 h-4 text-[#FFD54A]" />
                  </div>
                )}
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-[#04241a] border-t border-emerald-500/20">
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
              className="flex-1 bg-[#02130d] border border-emerald-500/30 rounded-lg px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-emerald-400"
            />
            <button
              type="submit"
              disabled={!inputQuery.trim()}
              className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-black font-bold text-xs font-mono rounded-lg transition-all flex items-center gap-1.5 shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
              Transmit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
