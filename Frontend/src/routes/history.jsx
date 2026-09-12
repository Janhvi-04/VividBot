import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { ArrowLeft, Clock, Puzzle, Sparkles, Cog, Brain, ChevronRight, ChevronDown } from "lucide-react";
import backImg from "@/assets/history-back.png";
import sparkBot from "@/assets/spark-bot.png";
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

  const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

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
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'curiosity-quest':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'coding-snippet':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'mindfulness-task':
        return 'bg-pink-100 text-pink-800 border-pink-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Group activities by date
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
    <main className="relative min-h-screen bg-background">
      <img
        src={backImg}
        alt=""
        aria-hidden="true"
        width={1600}
        height={1008}
        className="pointer-events-none fixed inset-0 h-full w-full object-cover opacity-70"
      />

      <div className="relative mx-auto w-full max-w-7xl px-5 py-8 sm:px-10 sm:py-12">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate({ to: "/dashboard" })}
            className="flex items-center justify-center w-9 h-9 cursor-pointer rounded-full border border-gray-200 text-gray-700 transition hover:bg-white/70"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
        </div>
        <header className="flex flex-col items-center gap-4 mb-8">
          
          <h1 className="font-display text-xl tracking-wide text-foreground sm:text-3xl">
            Activity History
          </h1>
          
          <p className="font-ui text-sm leading-tight text-foreground/80">
            Your journey through puzzles, facts, coding, and mindfulness.
          </p>
        </header>

        {loading ? (
          <div className="text-center py-12 text-foreground/70">Loading your activity history...</div>
        ) : sortedDates.length === 0 ? (
          <div className="text-center py-12 text-foreground/70">
            No activity history yet. Start exploring VividBot to see your progress here!
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content - Date List */}
            <div className="lg:col-span-2 space-y-4">
              <h2 className=" text-xl uppercase tracking-wide text-foreground mb-4">
                Activity Dates
              </h2>
              {sortedDates.map((date) => (
                <div key={date} className="border border-white/20 bg-white/10 backdrop-blur-[1px] rounded-2xl p-4 hover:bg-white/20 transition cursor-pointer">
                  <div
                    className="flex items-center justify-between"
                    onClick={() => setExpandedDate(expandedDate === date ? null : date)}
                  >
                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-foreground/70" strokeWidth={1.25} />
                      <span className="font-body text-lg text-foreground">
                        {formatDate(groupedActivities[date][0].timestamp)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-foreground/60">
                        {groupedActivities[date].length} {groupedActivities[date].length === 1 ? 'activity' : 'activities'}
                      </span>
                      {expandedDate === date ? (
                        <ChevronDown className="h-4 w-4 text-foreground/60" />
                      ) : (
                        <ChevronRight className="h-4 w-4 text-foreground/60" />
                      )}
                    </div>
                  </div>

                  {/* Show activities when expanded */}
                  {expandedDate === date && (
                    <div className="mt-4 space-y-3">
                      {groupedActivities[date].map((activity, idx) => (
                        <div
                          key={idx}
                          onClick={() => setSelectedActivity(selectedActivity === activity ? null : activity)}
                          className={`flex items-start gap-3 p-3 rounded-xl border transition cursor-pointer ${
                            selectedActivity === activity 
                              ? 'bg-amber-50 border-amber-300' 
                              : 'bg-white/50 border-white/20 hover:bg-white/70'
                          }`}
                        >
                          <div className={`p-2 rounded-full ${getActivityColor(activity.activityType)} border`}>
                            {getActivityIcon(activity.activityType)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-[10px] font-semibold uppercase tracking-wider bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                                {activity.activityType.replace('-', ' ')}
                              </span>
                              <span className="text-[10px] text-gray-500">
                                {formatTime(activity.timestamp)}
                              </span>
                              <ChevronRight className="h-3 w-3 text-gray-400 ml-auto" />
                            </div>
                            <p className="text-xs font-medium text-gray-800">{activity.title}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Sidebar - Detailed Activity View */}
            <div className="lg:col-span-1">
              <div className="sticky top-8 border border-white/20 bg-white/10 backdrop-blur-[1px] rounded-2xl p-4">
                <h2 className=" text-xl uppercase tracking-wide text-foreground mb-4 flex items-center gap-2">
                  <Clock className="h-5 w-5" strokeWidth={1.25} />
                  Activity Details
                </h2>

                {selectedActivity ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`p-2 rounded-full ${getActivityColor(selectedActivity.activityType)} border`}>
                        {getActivityIcon(selectedActivity.activityType)}
                      </div>
                      <div className="flex-1">
                        <span className="text-[10px] font-semibold uppercase tracking-wider bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                          {selectedActivity.activityType.replace('-', ' ')}
                        </span>
                        <span className="text-[10px] text-gray-500 ml-2">
                          {formatTime(selectedActivity.timestamp)}
                        </span>
                      </div>
                    </div>

                    <p className="text-sm font-medium text-gray-800 mb-4">{selectedActivity.title}</p>

                    {/* Activity-specific details */}
                    {selectedActivity.details && Object.keys(selectedActivity.details).length > 0 && (
                      <div className="text-xs text-gray-600 space-y-3 bg-gray-50/50 p-4 rounded-lg">
                        {selectedActivity.activityType === 'logic-puzzle' && (
                          <>
                            {selectedActivity.details.questionText && (
                              <div>
                                <span className="font-medium block mb-1">Question:</span>
                                <p className="text-xs leading-relaxed">{selectedActivity.details.questionText}</p>
                              </div>
                            )}
                            {selectedActivity.details.userAnswer && (
                              <div>
                                <span className="font-medium block mb-1">Your Answer:</span>
                                <p className="text-xs leading-relaxed">{selectedActivity.details.userAnswer}</p>
                              </div>
                            )}
                            {selectedActivity.details.isCorrect !== undefined && (
                              <div>
                                <span className="font-medium block mb-1">Result:</span>
                                <span className={`ml-2 ${selectedActivity.details.isCorrect ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}`}>
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
                                <span className="font-medium block mb-1">Domain:</span>
                                <span className="text-xs">{selectedActivity.details.domain}</span>
                              </div>
                            )}
                            {selectedActivity.details.questPrompt && (
                              <div>
                                <span className="font-medium block mb-1">Fact:</span>
                                <p className="text-xs leading-relaxed">{selectedActivity.details.questPrompt}</p>
                              </div>
                            )}
                          </>
                        )}

                        {selectedActivity.activityType === 'coding-snippet' && (
                          <>
                            {selectedActivity.details.persona && (
                              <div>
                                <span className="font-medium block mb-1">Persona:</span>
                                <span className="text-xs">{selectedActivity.details.persona}</span>
                              </div>
                            )}
                            {selectedActivity.details.questionPrompt && (
                              <div>
                                <span className="font-medium block mb-1">Challenge:</span>
                                <p className="text-xs leading-relaxed">{selectedActivity.details.questionPrompt}</p>
                              </div>
                            )}
                            {selectedActivity.details.questionCode && (
                              <div>
                                <span className="font-medium block mb-1">Code:</span>
                                <pre className="mt-1 text-[9px] bg-gray-100 p-3 rounded overflow-x-auto font-mono">
                                  {selectedActivity.details.questionCode}
                                </pre>
                              </div>
                            )}
                          </>
                        )}

                        {selectedActivity.activityType === 'mindfulness-task' && (
                          <>
                            {selectedActivity.details.mood && (
                              <div>
                                <span className="font-medium block mb-1">Mood:</span>
                                <span className="text-xs">{selectedActivity.details.mood}</span>
                              </div>
                            )}
                            {selectedActivity.details.taskDescription && (
                              <div>
                                <span className="font-medium block mb-1">Task:</span>
                                <p className="text-xs leading-relaxed">{selectedActivity.details.taskDescription}</p>
                              </div>
                            )}
                            {selectedActivity.details.taskDuration && (
                              <div>
                                <span className="font-medium block mb-1">Duration:</span>
                                <span className="text-xs">{selectedActivity.details.taskDuration}</span>
                              </div>
                            )}
                          </>
                        )}

                        {/* Generic details for other fields */}
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
                              <span className="font-medium capitalize block mb-1">{key}:</span>
                              <span className="text-xs truncate">{String(value)}</span>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-xs text-foreground/60 text-center py-4">
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