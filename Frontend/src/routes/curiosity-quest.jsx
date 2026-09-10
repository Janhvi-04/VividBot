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
  const [mounted, setMounted] = useState(false);
  const [diplayPedrompt,setDisplayedPrompt]=useState("");

  useEffect(() => {
    setMounted(true);
  }, []);
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
  const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

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
        // Log activity when user explores a domain with details
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
    <main className="relative min-h-screen overflow-hidden flex flex-col justify-between p-4 sm:p-6">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${bgImage})`,
        }}
      />
      <div className="absolute inset-0 pointer-events-none" />
      <div className="relative z-10 w-full max-w-full mx-auto mb-4 flex items-center justify-start">
        <button
          onClick={() => {
            if (selectedDomain) {
              setSelectedDomain(null);
              setQuest(null);
            } else {
              navigate({ to: "/dashboard" });
            }
          }}
          className="flex items-center justify-center w-9 h-9 cursor-pointer rounded-full text-white transition hover:bg-white/20 border border-white/20"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <span className="flex text-center items-center justify-center w-full text-xs sm:text-sm font-bold text-white tracking-widest uppercase drop-shadow-md gap-2">
          Curiosity Quest
        </span>
      </div>

      {!selectedDomain && (
        <div className="relative z-10 w-full mx-auto text-center px-4 mt-7">
            <p className="text-l sm:text-xl text-white mt-2 leading-relaxed">
              Choose your domain of wonder to discover a fascinating fact or discovery...
            </p>
        </div>
      )}

      <div className="relative z-10 flex-1 w-full max-w-4xl mx-auto flex flex-col justify-center pb-4">
          {!selectedDomain ? (
            <div className="relative w-full h-[70vh] flex items-center justify-center">
              {mounted && domains.map((domain, index) => {
                const angle = (index / domains.length) * 2 * Math.PI;
                const radiusX = 220; 
                const radiusY = 175; 
                const x = Math.cos(angle) * radiusX;
                const y = Math.sin(angle) * radiusY;

                return (
                  <button
                    key={domain}
                    onClick={() => handleSelectDomain(domain)}
                    style={{
                      transform: `translate(${x}px, ${y}px)`,
                    }}
                    className="absolute z-30 w-28 h-28 sm:w-32 sm:h-32 rounded-full border border-white/20 p-2 text-white text-xs sm:text-sm font-medium transition hover:scale-110 cursor-pointer shadow-xl flex flex-col items-center justify-center text-center group"
                  >
                    <span className="line-clamp-2 px-1">{domain}</span>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="space-y-4 overflow-y-auto max-h-[70vh] pr-1">
            {loading && !quest ? (
              <div className="text-center text-white/70 py-12">On the way to discover facts...</div>
            ) : (
              <div className="rounded-2xl border border-white/20 p-5 sm:p-6 text-slate-100 shadow-xl">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] sm:text-xs font-semibold text-amber-300 uppercase tracking-wider bg-amber-500/20 px-3 py-1 rounded-full border border-amber-500/30">
                    {quest?.type}
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white mb-2">
                  {quest?.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-serif italic">
                  {quest?.prompt}
                </p>
              </div>        
            )}
          </div>
          )}
      </div>
    </main>
  );
}