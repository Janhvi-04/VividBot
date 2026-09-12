import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, CloudLightning, Droplets, Zap, Frown, CheckSquare, Sun, Sparkles, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import bgImage from '@/assets/mindfulness-background.png';
import exerciseBgImage from '@/assets/exercise-background.png';
import { apiFetch } from "../utils/api";

export const Route = createFileRoute('/mindfulness-tasks')({
  component: MindfulnessTasksPage,
});

const moods = [
  { id: "overwhelmed", label: "OVERWHELMED", icon: CloudLightning },
  { id: "calm", label: "CALM", icon: Droplets },
  { id: "energetic", label: "ENERGETIC", icon: Zap },
  { id: "sad", label: "SAD", icon: Frown },
  { id: "productive", label: "PRODUCTIVE", icon: CheckSquare },
  { id: "content", label: "CONTENT", icon: Sun },
];
const API_BASE_URL=import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

function MindfulnessTasksPage() {
  const navigate = useNavigate();
  const [selectedMood, setSelectedMood] = useState(null);
  const [taskView, setTaskView] = useState(false);
  const [loadingTask, setLoadingTask] = useState(false);
  const [aiTask, setAiTask] = useState(null);
  const [completed, setCompleted] = useState(false);

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

  const handleSelectAndContinue = async () => {
    if (!selectedMood) return;
    setTaskView(true);
    setLoadingTask(true);

    try {
      const response = await apiFetch('/api/mindfulness/generate-task', {
        method: 'POST',
        body: JSON.stringify({ mood: selectedMood }),
      });
      const data = await response.json();
      if (data.success) {
        setAiTask(data.task);
        logActivity('mindfulness-task', `Mindfulness task for ${selectedMood}`, {
          mood: selectedMood,
          taskTitle: data.task?.title,
          taskDescription: data.task?.description,
          taskDuration: data.task?.duration,
          completedAt: new Date().toISOString()
        });
      }
    } catch (err) {
      console.error("Failed to load AI mindfulness task", err);
    } finally {
      setLoadingTask(false);
    }
  };

  if (taskView) {
    return (
      <main className="relative min-h-[100dvh] overflow-y-auto overflow-x-hidden bg-rose-50 flex flex-col justify-between p-4 sm:p-6 md:p-8 box-border">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${exerciseBgImage})` }}
        />
        <div className="absolute inset-0 bg-rose-950/20 backdrop-blur-[2px] pointer-events-none" />

        <div className="relative z-10 w-full px-2 sm:px-4 flex items-center justify-start flex-shrink-0">
          <button
            onClick={() => setTaskView(false)}
            className="flex items-center justify-center w-9 h-9 cursor-pointer rounded-full backdrop-blur-md text-rose-900 transition border border-rose-200 shadow-sm"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
        </div>

        <div className="relative z-20 flex-1 flex flex-col items-center justify-center w-full max-w-lg mx-auto my-auto px-2 sm:px-4 py-6">
          <div className="w-full border border-rose-200/80 bg-white/80 sm:bg-white/90 backdrop-blur-md rounded-3xl p-5 sm:p-8 shadow-2xl text-center max-h-[85vh] overflow-y-auto">
            {loadingTask ? (
              <div className="py-12 flex flex-col items-center space-y-3">
                <p className="text-xs sm:text-sm text-rose-900 font-medium tracking-wide">
                  Curating a custom mindful activity for your energy...
                </p>
              </div>
            ) : aiTask ? (
              <>
                <h2 className="text-lg sm:text-2xl font-serif text-rose-950 mb-4 break-words">
                  {aiTask.title}
                </h2>
                
                <p className="text-xs sm:text-sm text-rose-900/80 leading-relaxed mb-6 font-serif italic break-words">
                  {aiTask.description}
                </p>
              </>
            ) : null}
          </div>
        </div>

        <div className="relative z-10 pb-4 flex-shrink-0" />
      </main>
    );
  }

  return (
    <main className="relative min-h-[100dvh] overflow-y-auto overflow-x-hidden bg-rose-50 flex flex-col justify-between p-4 sm:p-6 md:p-8 box-border">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${bgImage})` }}
      />
      <div className="absolute inset-0 bg-rose-100/30 pointer-events-none" />
      <div className="relative z-10 w-full max-w-full mx-auto flex items-center justify-start flex-shrink-0">
        <button
          onClick={() => navigate({ to: "/dashboard" })}
          className="flex items-center justify-center w-9 h-9 cursor-pointer rounded-full backdrop-blur-md text-rose-800 transition border border-rose-200 shadow-sm"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
      </div>
      <div className="relative z-20 flex-1 flex flex-col items-center justify-center w-full max-w-4xl mx-auto my-auto py-6 sm:py-8">
        <h1 className="text-lg sm:text-2xl font-serif text-rose-950 tracking-wider mb-6 sm:mb-10 text-center drop-shadow-sm px-2">
          HOW ARE YOU FEELING TODAY?
        </h1>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-8 w-full max-w-2xl px-2 sm:px-4">
          {moods.map((m) => {
            const IconComponent = m.icon;
            const isSelected = selectedMood === m.id;
            return (
              <button
                key={m.id}
                onClick={() => setSelectedMood(m.id)}
                className={`group flex flex-col items-center justify-center aspect-square rounded-full bg-white/85 backdrop-blur-md border transition-all duration-300 cursor-pointer shadow-lg hover:scale-105 p-3 sm:p-4 ${
                  isSelected 
                    ? "border-rose-300/50 ring-3 ring-rose-300/50 bg-white" 
                    : "border-rose-300/50 hover:border-rose-300"
                }`}
              >
                <div className="p-2 sm:p-3 rounded-full text-rose-950 transition mb-1">
                  <IconComponent className="h-7 w-7 sm:h-10 sm:w-10 stroke-[1.5]" />
                </div>
                <span className="text-[10px] sm:text-xs font-semibold tracking-widest text-rose-950 text-center">
                  {m.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
      <div className="relative z-20 w-full max-w-md mx-auto text-center pb-2 sm:pb-4 flex-shrink-0 px-2">
        <button
          disabled={!selectedMood}
          onClick={handleSelectAndContinue}
          className={`w-full py-3.5 px-6 rounded-full font-medium text-xs sm:text-sm tracking-widest uppercase transition shadow-md ${
            selectedMood
              ? "bg-rose-300 text-white cursor-pointer shadow-rose-300/50"
              : "bg-rose-300/50 text-rose-700/50 cursor-not-allowed"
          }`}
        >
          Select and Continue
        </button>
      </div>
    </main>
  );
}