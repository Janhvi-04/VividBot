import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { ArrowLeft, Clock, Puzzle, Sparkles, Cog, Brain, ChevronRight, ChevronDown } from "lucide-react";
import backImg from "@/assets/history-back.png";
import { apiFetch } from "../utils/api";

export const Route = createFileRoute("/history")({
  head: () => ({
    meta: [
      { title: "VividBot — Activity History" },
      {
        name: "description",
        content: "View your complete activity history with VividBot - puzzles, facts, coding challenges, and mindfulness tasks.",
      },
    ],
  }),
  component: HistoryPage,
});

function HistoryPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [activityHistory, setActivityHistory] = useState([]);
  const [expandedDate, setExpandedDate] = useState(null);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = sessionStorage.getItem("user");
    if (!userData) {
      navigate({ to: "/login" });
    } else {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      apiFetch(`/api/activities/history/${parsedUser.identifier}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.history) {
            setActivityHistory(data.history);
          }
        })
        .catch((err) => console.error("Error fetching history:", err))
        .finally(() => setLoading(false));
    }
  }, [navigate]);

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'Asia/Kolkata'
    });
  };

  const getActivityIcon = (activityType) => {
    switch (activityType) {
      case 'logic-puzzle':
        return <Puzzle className="h-4 w-4" />;
      case 'curiosity-quest':
        return <Sparkles className="h-4 w-4" />;
      case 'coding-snippet':
        return <Cog className="h-4 w-4" />;
      case 'mindfulness-task':
        return <Brain className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getActivityColor = (activityType) => {
    switch (activityType) {
      case 'logic-puzzle':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'curiosity-quest':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      case 'coding-snippet':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
      case 'mindfulness-task':
        return 'bg-pink-500/20 text-pink-300 border-pink-500/30';
      default:
        return 'bg-slate-500/20 text-slate-300 border-slate-500/30';
    }
  };

  const groupedActivities = activityHistory.reduce((acc, activity) => {
    const dateKey = new Date(activity.timestamp).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      timeZone: 'Asia/Kolkata'
    });
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(activity);
    return acc;
  }, {});

  const sortedDates = Object.keys(groupedActivities).sort((a, b) => new Date(b) - new Date(a));

  return (
    <main className="relative min-h-screen bg-slate-950 text-white">
      <img
        src={backImg}
        alt=""
        aria-hidden="true"
        width={1600}
        height={1008}
        className="pointer-events-none fixed inset-0 h-full w-full object-cover opacity-30"
      />
      <div className="absolute inset-0 bg-slate-950/80 pointer-events-none" />

      <div className="relative mx-auto w-full max-w-7xl px-5 py-8 sm:px-10 sm:py-12 z-10">
        <div className="mb-6">
          <button
            onClick={() => navigate({ to: "/dashboard" })}
            className="flex items-center justify-center w-9 h-9 cursor-pointer rounded-full border border-white/20 bg-white/10 text-white transition hover:bg-white/20 backdrop-blur-md shadow-sm"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
        </div>
        <header className="flex flex-col items-center gap-2 mb-8 text-center">
          <h1 className="text-xl tracking-wide text-white font-bold sm:text-3xl drop-shadow-md">
            Activity History
          </h1>
          <p className="text-sm leading-tight text-slate-300">
            Your journey through puzzles, facts, coding, and mindfulness.
          </p>
        </header>

        {loading ? (
          <div className="text-center py-12 text-slate-400 italic">Loading your activity history...</div>
        ) : sortedDates.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            No activity history yet. Start exploring VividBot to see your progress here!
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-emerald-400 mb-4">
                Activity Dates
              </h2>
              {sortedDates.map((date) => (
                <div key={date} className="border border-white/20 bg-white/10 backdrop-blur-md rounded-2xl p-4 hover:bg-white/15 transition cursor-pointer shadow-lg">
                  <div
                    className="flex items-center justify-between"
                    onClick={() => setExpandedDate(expandedDate === date ? null : date)}
                  >
                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-emerald-400" strokeWidth={1.5} />
                      <span className="text-base sm:text-lg font-medium text-white">
                        {formatDate(groupedActivities[date][0].timestamp)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-300">
                        {groupedActivities[date].length} {groupedActivities[date].length === 1 ? 'activity' : 'activities'}
                      </span>
                      {expandedDate === date ? (
                        <ChevronDown className="h-4 w-4 text-slate-300" />
                      ) : (
                        <ChevronRight className="h-4 w-4 text-slate-300" />
                      )}
                    </div>
                  </div>

                  {expandedDate === date && (
                    <div className="mt-4 space-y-3">
                      {groupedActivities[date].map((activity, idx) => (
                        <div
                          key={idx}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedActivity(selectedActivity === activity ? null : activity);
                          }}
                          className={`flex items-start gap-3 p-3 rounded-xl border transition cursor-pointer backdrop-blur-sm ${
                            selectedActivity === activity 
                              ? 'bg-emerald-600/30 border-emerald-500/50 shadow-md' 
                              : 'bg-white/5 border-white/10 hover:bg-white/10'
                          }`}
                        >
                          <div className={`p-2 rounded-full ${getActivityColor(activity.activityType)} border`}>
                            {getActivityIcon(activity.activityType)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-[10px] font-semibold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                                {activity.activityType.replace('-', ' ')}
                              </span>
                              <span className="text-[10px] text-slate-400">
                                {formatTime(activity.timestamp)}
                              </span>
                              <ChevronRight className="h-3 w-3 text-slate-400 ml-auto" />
                            </div>
                            <p className="text-xs font-medium text-slate-200 truncate">{activity.title}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-8 border border-white/20 bg-white/10 backdrop-blur-md rounded-2xl p-5 shadow-xl">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-emerald-400 mb-4 flex items-center gap-2">
                  <Clock className="h-4 w-4" strokeWidth={1.5} />
                  Activity Details
                </h2>

                {selectedActivity ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`p-2 rounded-full ${getActivityColor(selectedActivity.activityType)} border`}>
                        {getActivityIcon(selectedActivity.activityType)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] font-semibold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full inline-block">
                          {selectedActivity.activityType.replace('-', ' ')}
                        </span>
                        <span className="text-[10px] text-slate-400 ml-2">
                          {formatTime(selectedActivity.timestamp)}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm font-semibold text-white mb-4">{selectedActivity.title}</p>

                    {selectedActivity.details && Object.keys(selectedActivity.details).length > 0 && (
                      <div className="text-xs text-slate-300 space-y-3 bg-black/40 border border-white/10 p-4 rounded-xl">
                        {selectedActivity.activityType === 'logic-puzzle' && (
                          <>
                            {selectedActivity.details.questionText && (
                              <div>
                                <span className="font-semibold text-emerald-400 block mb-1">Question:</span>
                                <p className="text-xs leading-relaxed text-slate-200">{selectedActivity.details.questionText}</p>
                              </div>
                            )}
                            {selectedActivity.details.userAnswer && (
                              <div>
                                <span className="font-semibold text-emerald-400 block mb-1">Your Answer:</span>
                                <p className="text-xs leading-relaxed text-slate-200">{selectedActivity.details.userAnswer}</p>
                              </div>
                            )}
                            {selectedActivity.details.isCorrect !== undefined && (
                              <div>
                                <span className="font-semibold text-emerald-400 block mb-1">Result:</span>
                                <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold ${selectedActivity.details.isCorrect ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-red-500/20 text-red-300 border border-red-500/30'}`}>
                                  {selectedActivity.details.isCorrect ? '✓ Correct' : '✗ Incorrect'}
                                </span>
                              </div>
                            )}
                          </>
                        )}

                        {selectedActivity.activityType === 'curiosity-quest' && (
                          <>
                            {selectedActivity.details.domain && (
                              <div>
                                <span className="font-semibold text-emerald-400 block mb-1">Domain:</span>
                                <span className="text-xs text-slate-200">{selectedActivity.details.domain}</span>
                              </div>
                            )}
                            {selectedActivity.details.questPrompt && (
                              <div>
                                <span className="font-semibold text-emerald-400 block mb-1">Fact:</span>
                                <p className="text-xs leading-relaxed text-slate-200">{selectedActivity.details.questPrompt}</p>
                              </div>
                            )}
                          </>
                        )}

                        {selectedActivity.activityType === 'coding-snippet' && (
                          <>
                            {selectedActivity.details.persona && (
                              <div>
                                <span className="font-semibold text-emerald-400 block mb-1">Persona:</span>
                                <span className="text-xs text-slate-200 capitalize">{selectedActivity.details.persona}</span>
                              </div>
                            )}
                            {selectedActivity.details.questionPrompt && (
                              <div>
                                <span className="font-semibold text-emerald-400 block mb-1">Challenge:</span>
                                <p className="text-xs leading-relaxed text-slate-200">{selectedActivity.details.questionPrompt}</p>
                              </div>
                            )}
                            {selectedActivity.details.questionCode && (
                              <div>
                                <span className="font-semibold text-emerald-400 block mb-1">Code:</span>
                                <pre className="mt-1 text-[11px] bg-black/60 border border-white/10 text-emerald-300 p-3 rounded-lg overflow-x-auto font-mono whitespace-pre">
                                  <code>{selectedActivity.details.questionCode}</code>
                                </pre>
                              </div>
                            )}
                          </>
                        )}

                        {selectedActivity.activityType === 'mindfulness-task' && (
                          <>
                            {selectedActivity.details.mood && (
                              <div>
                                <span className="font-semibold text-emerald-400 block mb-1">Mood:</span>
                                <span className="text-xs text-slate-200">{selectedActivity.details.mood}</span>
                              </div>
                            )}
                            {selectedActivity.details.taskDescription && (
                              <div>
                                <span className="font-semibold text-emerald-400 block mb-1">Task:</span>
                                <p className="text-xs leading-relaxed text-slate-200">{selectedActivity.details.taskDescription}</p>
                              </div>
                            )}
                            {selectedActivity.details.taskDuration && (
                              <div>
                                <span className="font-semibold text-emerald-400 block mb-1">Duration:</span>
                                <span className="text-xs text-slate-200">{selectedActivity.details.taskDuration}</span>
                              </div>
                            )}
                          </>
                        )}

                        {Object.entries(selectedActivity.details)
                          .filter(([key]) => ![
                            'category', 'isCorrect', 'userAnswer', 'questionText',
                            'domain', 'questTitle', 'questPrompt',
                            'persona', 'questionTitle', 'questionPrompt', 'questionCode', 'questionType',
                            'mood', 'taskTitle', 'taskDescription', 'taskDuration',
                            'completedAt'
                          ].includes(key))
                          .map(([key, value]) => (
                            <div key={key}>
                              <span className="font-semibold text-emerald-400 capitalize block mb-1">{key}:</span>
                              <span className="text-xs text-slate-200 break-words">{String(value)}</span>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 text-center py-6 italic">
                    Click on any activity to view its details
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}