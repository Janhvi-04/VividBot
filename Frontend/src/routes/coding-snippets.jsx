import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Search, Plus, Terminal, BookOpen, Send, UserCheck, Sparkles, RefreshCw,Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import bgImage from '@/assets/coding-background.png';

export const Route = createFileRoute('/coding-snippets')({
  component: CodingSnippetsPage,
});

function CodingSnippetsPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [userPersona, setUserPersona] = useState(null); 
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [loading, setLoading] = useState(false);
  const [chatLoading,setChatLoading]=useState(false);
  const [chatInput, setChatInput] = useState("");
  const [conversation, setConversation] = useState([]);

  const API_BASE_URL=import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

  const logActivity = async (activityType, title, details = {}) => {
    try {
      const user = JSON.parse(sessionStorage.getItem("user"));
      if (user) {
        await fetch(`${API_BASE_URL}/api/activities/log`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            identifier: user.identifier,
            activityType,
            title,
            details,
          }),
        });
      }
    } catch (error) {
      console.error("Error logging activity:", error);
    }
  };

  const fetchAIQuestion = async (personaType) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/snippets/generate-question`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ persona: personaType }),
      });
      const data = await res.json();
      if (data.success) {
        setCurrentQuestion(data.question);
        // Single log activity when challenge is generated with details
        logActivity('coding-snippet', `Coding challenge (${personaType})`, {
          persona: personaType,
          questionTitle: data.question?.title,
          questionPrompt: data.question?.prompt,
          questionCode: data.question?.code,
          questionType: data.question?.type,
          completedAt: new Date().toISOString()
        });
      }
    } catch (err) {
      console.error("Failed to fetch AI question",err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (userPersona) {
      fetchAIQuestion(userPersona);
    }
  }, [userPersona]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = { sender: "user", text: chatInput };
    setConversation((prev) => [...prev, userMsg]);
    const currentInput = chatInput;
    setChatInput("");
    setChatLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/snippets/respond`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          userInput: currentInput, 
          persona: userPersona,
          currentQuestion: currentQuestion?.prompt
        }),
      });
      const data = await res.json();
      if (data.success) {
        setConversation((prev) => [...prev, { sender: "bot", text: data.reply }]);
      }
    } catch (err) {
      setConversation((prev) => [...prev, { sender: "bot", text: "You're thinking along the right lines! Let's build on that." }]);
    } finally {
      setChatLoading(false);
    }
  };
  const formatText = (text) => {
    const parts = text.split(/(```[\s\S]*?```|`[^`]+`|\*\*.*?\*\*|\*[^*]+?\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <code key={i} className="px-1.5 py-0.5 rounded bg-black/40 font-mono text-emerald-300 border border-white/10 text-[11px]">
            {part.slice(1, -1)}
          </code>
        );
      } else if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="font-semibold text-white">{part.slice(2, -2)}</strong>;
      } else if (part.startsWith('*') && part.endsWith('*')) {
        return <em key={i} className="italic text-slate-100">{part.slice(1, -1)}</em>;
      }
      return part;
    });
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 flex flex-col justify-between p-4 sm:p-6">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${bgImage})`,
          filter: 'grayscale(100%) brightness(130%)',
        }}
      />
      <div className="absolute inset-0 bg-slate-900/75 pointer-events-none" />
      <div className="relative z-10 w-full max-w-full mx-auto mb-4 flex items-center justify-start">
        <button
          onClick={() => navigate({ to: "/dashboard" })}
          className="flex items-center justify-center w-9 h-9 cursor-pointer rounded-full text-white transition hover:bg-white/20 border border-white/20"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>

        
      </div>
      <span className="flex text-center items-center justify-center text-xs sm:text-sm font-bold text-white tracking-widest uppercase drop-shadow-md">
          Coding Snippets & Concepts
      </span>
      {!userPersona ? (
        <div className="relative z-20 flex-1 flex items-center justify-center w-full max-w-3xl mx-auto my-auto">
          <div className="grid gap-4 w-full">
            <button
              onClick={() => setUserPersona("non-coder")}
              className="p-6 rounded-2xl border border-white/20 hover:border-emerald-500/60 transition text-left cursor-pointer group shadow-xl flex flex-col justify-between"
            >
              <div>
                <div className="p-3 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 w-fit mb-3">
                  <BookOpen className="h-5 w-5" />
                </div>
                <h2 className="text-sm sm:text-base font-bold text-white mb-2 group-hover:text-emerald-400 transition">
                  I am a Non-Coder
                </h2>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Explore AI-generated logical puzzles, everyday analogies, and conceptual questions without needing syntax knowledge.
                </p>
              </div>
              <span className="mt-6 text-xs font-semibold text-emerald-400 flex items-center gap-1">
                Start Exploring &rarr;
              </span>
            </button>
            <button
              onClick={() => setUserPersona("coder")}
              className="p-6 rounded-2xl border border-white/20 hover:border-emerald-500/60 transition text-left cursor-pointer group shadow-xl flex flex-col justify-between"
            >
              <div>
                <div className="p-3 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 w-fit mb-3">
                  <Terminal className="h-5 w-5" />
                </div>
                <h2 className="text-sm sm:text-base font-bold text-white mb-2 group-hover:text-emerald-400 transition">
                  Familiar with Coding
                </h2>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Tackle lightweight syntax challenges, quick output predictions, and friendly bug-spotting problems generated by the AI.
                </p>
              </div>
              <span className="mt-6 text-xs font-semibold text-emerald-400 flex items-center gap-1">
                Start Exploring &rarr;
              </span>
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="relative z-10 flex-1 w-full max-w-4xl mx-auto overflow-y-auto space-y-4 pb-4">
            <div className="rounded-2xl border border-white/20 p-4 sm:p-6 text-white shadow-lg">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5" />
                  AI Generated Challenge ({userPersona === "non-coder" ? "Conceptual" : "Code & Syntax"})
                </span>
              </div>

              {loading ? (
                <div className="py-8 text-center text-xs text-slate-400">
                  Crafting a thoughtful challenge for you...
                </div>
              ) : currentQuestion ? (
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-white mb-2">
                    {currentQuestion.title}
                  </h3>
                  <div className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
                    {currentQuestion.prompt}
                  </div>
                  {currentQuestion.code && (
                    <pre className="p-3 my-3 rounded-xl bg-black/50 border border-white/10 font-mono text-xs overflow-x-auto text-emerald-300 whitespace-pre">
                      <code>{currentQuestion.code}</code>
                    </pre>
                  )}
                  <span className="text-[10px] px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 font-medium">
                    {currentQuestion.type}
                  </span>
                </div>
              ) : null}
            </div>

            {conversation.map((msg, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-2xl max-w-[85%] text-xs sm:text-sm ${
                  msg.sender === "user"
                    ? "ml-auto border border-emerald-500/40 text-white"
                    : "mr-auto border border-white/20 text-slate-200"
                }`}
              >
                {formatText(msg.text)}
              </div>
            ))}
            {chatLoading && (
              <div className="mr-auto p-3 rounded-2xl border border-white/20 text-slate-400 text-xs sm:text-sm flex items-center gap-2">
                <Loader2 className="h-3.5 w-3.5 animate-spin text-emerald-400" />
                <span>AI is analyzing your thoughts...</span>
              </div>
            )}
          </div>
          <div className="relative z-10 w-full max-w-4xl mx-auto">
            <form onSubmit={handleSendMessage} className="relative flex items-center">
              <input
                type="text"
                placeholder={userPersona === "non-coder" ? "Share your logical thoughts or answer..." : "Share your solution idea or debugging thought..."}
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                className="w-full rounded-xl border border-white/20 px-4 py-3 pr-12 text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500/65 placeholder:text-slate-400 shadow-inner"
              />
              <button
                type="submit"
                className="absolute right-2 p-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition cursor-pointer"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </>
      )}
    </main>
  );
}