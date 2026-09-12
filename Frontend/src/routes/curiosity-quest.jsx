import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";
import bgImage from '@/assets/curiosity-background.png';
import { apiFetch } from "../utils/api";

export const Route = createFileRoute("/curiosity-quest")({
  component: CuriosityQuestPage,
});

const domains = [
  "Science & Nature", 
  "History & Culture", 
  "Technology & Innovation", 
  "Space & Universe", 
  "Human Body & Mind", 
  "Animals & Wildlife"
];

function CuriosityQuestPage() {
  const navigate = useNavigate();
  const [selectedDomain, setSelectedDomain] = useState(null);
  const [loading, setLoading] = useState(false);
  const [quest, setQuest] = useState(null);
  const [displayedPrompt, setDisplayedPrompt] = useState("");

  useEffect(() => {
    if (!quest?.prompt) {
      setDisplayedPrompt("");
      return;
    }
    setDisplayedPrompt("");
    let index = 0;
    const textToType = quest.prompt;

    const timer = setInterval(() => {
      if (index < textToType.length) {
        setDisplayedPrompt((prev) => prev + textToType.charAt(index));
        index++;
      } else {
        clearInterval(timer);
      }
    }, 12); 

    return () => clearInterval(timer);
  }, [quest]);

  const logActivity = async (activityType, title, details = {}) => {
    try {
      const user = JSON.parse(sessionStorage.getItem("user"));
      if (user) {
        await apiFetch('/api/activities/log', {
          method: "POST",
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

  const handleSelectDomain = async (domain) => {
    setSelectedDomain(domain);
    setLoading(true);
    
    try {
      const response = await apiFetch('/api/curiosity/fact', {
        method: "POST",
        body: JSON.stringify({ domain })
      });
      const data = await response.json();
      if (data.success) {
        setQuest(data.quest);
        logActivity('curiosity-quest', `Explored ${domain}`, {
          domain: domain,
          questTitle: data.quest?.title,
          questPrompt: data.quest?.prompt,
          completedAt: new Date().toISOString()
        });
      } else {
        setQuest({
          title: `The Secret of ${domain}`,
          prompt: `Could not fetch facts right now.`,
          type: domain,
        });
      }
    } catch (error) {
      console.error("Error fetching quest fact:", error);
      setQuest({
        title: `The Secret of ${domain}`,
        prompt: `Error while loading discovery.`,
        type: domain,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-x-hidden flex flex-col justify-between p-4 sm:p-6">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${bgImage})`,
        }}
      />
      <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px] pointer-events-none" />
      
      {/* Header */}
      <div className="relative z-10 w-full max-w-4xl mx-auto flex items-center justify-between">
        <button
          onClick={() => {
            if (selectedDomain) {
              setSelectedDomain(null);
              setQuest(null);
            } else {
              navigate({ to: "/dashboard" });
            }
          }}
          className="flex items-center justify-center w-9 h-9 cursor-pointer rounded-full text-white transition hover:bg-white/20 border border-white/20 bg-white/10 backdrop-blur-md shadow-sm"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <span className="text-xs sm:text-sm font-bold text-white tracking-widest uppercase drop-shadow-md">
          Curiosity Quest
        </span>
        <div className="w-9" /> {/* Spacer for centering */}
      </div>

      {/* Subtitle / Prompt when no domain selected */}
      {!selectedDomain && (
        <div className="relative z-10 w-full max-w-xl mx-auto text-center px-4 my-6">
          <p className="text-sm sm:text-lg text-white/90 leading-relaxed font-medium drop-shadow">
            Choose your domain of wonder to discover a fascinating fact or discovery...
          </p>
        </div>
      )}

      {/* Main Content Area */}
      <div className="relative z-10 flex-1 w-full max-w-3xl mx-auto flex flex-col items-center justify-center py-4">
        {!selectedDomain ? (
          <div className="w-full grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-6 px-2">
            {domains.map((domain) => (
              <button
                key={domain}
                onClick={() => handleSelectDomain(domain)}
                className="group relative h-28 sm:h-36 w-full rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md p-3 text-white text-xs sm:text-sm font-medium transition-all duration-300 hover:scale-105 hover:bg-white/20 hover:border-white/40 cursor-pointer shadow-xl flex flex-col items-center justify-center text-center overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="line-clamp-3 px-1 relative z-10">{domain}</span>
              </button>
            ))}
          </div>
        ) : (
          <div className="w-full space-y-4 overflow-y-auto max-h-[75vh] px-2">
            {loading && !quest ? (
              <div className="text-center text-white/80 py-12 text-sm italic">
                On the way to discover facts...
              </div>
            ) : (
              <div className="rounded-2xl border border-white/30 bg-white/15 backdrop-blur-xl p-5 sm:p-8 text-slate-100 shadow-2xl">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] sm:text-xs font-semibold text-amber-300 uppercase tracking-wider bg-amber-500/20 px-3 py-1 rounded-full border border-amber-500/30">
                    {quest?.type}
                  </span>
                </div>
                <h3 className="text-base sm:text-xl font-bold text-white mb-3">
                  {quest?.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-100 leading-relaxed font-serif italic whitespace-pre-wrap">
                  {displayedPrompt}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}