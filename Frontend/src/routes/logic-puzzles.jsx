import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Send, Play, Lightbulb } from "lucide-react";
import { LogicPuzzleBackground } from "../components/logic-puzzle-background";
import { useState, useEffect } from "react";
import ReactMarkDown from "react-markdown";
import { apiFetch } from "../utils/api";
export const Route = createFileRoute("/logic-puzzles")({
  component: LogicPuzzlesPage,
});

function LogicPuzzlesPage() {
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState("Daily Riddle");
  const [inputValue, setInputValue] = useState("");
  const [categoryLocked, setCategoryLocked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hintUsed, setHintUsed] = useState(false);
  const [hintLoading, setHintLoading] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [messages, setMessages] = useState({
    "Daily Riddle": [],
    "Pattern Sequence": [],
    "Equation": [],
    "Word Ladder": [],
  });
  const puzzleOptions = [
    { name: "Daily Riddle" },
    { name: "Pattern Sequence" },
    { name: "Equation" },
    { name: "Word Ladder" },
  ];
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
  
  const fetchNewPuzzle = async (category) => {
    setLoading(true);
    setCategoryLocked(true);
    setHintUsed(false);
    try {
        const response = await apiFetch('/api/puzzle/generate', {
            method: "POST",
            body: JSON.stringify({ category })
        });
        const data = await response.json();
        if (data.success) {
            setMessages((prev) => ({
                ...prev,
                [category]: [
                    ...prev[category],
                    { sender: "ai", text: data.puzzle.question, type: "question" },
                ],
            }));
            logActivity('logic-puzzle', `Started ${category}`, {
                category: category,
                questionText: data.puzzle.question,
                completedAt: new Date().toISOString()
            });
        }
    } catch (error) {
        console.error("Error fetching puzzle:", error);
        setMessages((prev) => ({
            ...prev,
            [category]: [
                ...prev[category],
                { sender: "ai", text: "Oops! Couldn't load the puzzle.", type: "error" }
            ],
        }));
    } finally {
        setLoading(false);
    }
  };

  const handleOptionClick = (optionName) => {
    if (categoryLocked) return;
    setSelectedOption(optionName);
  };

  const handleSend = async () => {
    if (!inputValue.trim() || loading || isEvaluating) return;
    const userAns = inputValue;
    setInputValue("");
    setMessages((prev) => ({
        ...prev,
        [selectedOption]: [
            ...prev[selectedOption],
            { sender: "user", text: userAns }
        ],
    }));
    setIsEvaluating(true);
    const currentCategoryMessages = messages[selectedOption];
    const lastQuestionObj = [...currentCategoryMessages].reverse().find(m => m.sender === "ai" && m.type === "question");
    const questionText = lastQuestionObj ? lastQuestionObj.text : "Solve the current puzzle.";
    try {
        const response = await apiFetch('/api/puzzle/verify', {
            method: "POST",
            body: JSON.stringify({
                question: questionText,
                userAnswer: userAns,
                category: selectedOption,
            }),
        });
        const data = await response.json();
        if (data.success) {
            const { isCorrect, feedback, farewell } = data.result;
            let responseText = feedback;
            if (isCorrect && farewell) {
                responseText += `\n\n👋 ${farewell}`;
            }
            setMessages((prev) => ({
                ...prev,
                [selectedOption]: [
                    ...prev[selectedOption],
                    { sender: "ai", text: responseText, type: "feedback" },
                ],
            }));
        }
    } catch (error) {
        console.error("Error verifying answer:", error);
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleHint = async () => {
    if (hintLoading || hintUsed) return;
    const currentCategoryMessages = messages[selectedOption];
    const lastQuestionObj = [...currentCategoryMessages].reverse().find(m => m.sender === "ai" && m.type === "question");
    const questionText = lastQuestionObj ? lastQuestionObj.text : "Current puzzle";
    setHintLoading(true);
    setHintUsed(true);
    try {
        const response = await apiFetch('/api/puzzle/hint', {
            method: "POST",
            body: JSON.stringify({
                question: questionText,
                category: selectedOption,
            }),
        });
        const data = await response.json();
        if (data.success) {
            setMessages((prev) => ({
                ...prev,
                [selectedOption]: [
                    ...prev[selectedOption],
                    { sender: "ai", text: `💡 Hint: ${data.hint}`, type: "hint" },
                ],
            }));
        }
    } catch (error) {
        console.error("Error fetching hint:", error);
    } finally {
        setHintLoading(false);
    }
  };

  const currentMessages = messages[selectedOption];
  const hasStartedCategory = currentMessages.length > 0;

  return (
    <main className="relative min-h-screen overflow-x-hidden">
      <LogicPuzzleBackground />
      
      <div className="relative z-10 flex min-h-screen flex-col">
        {/* Header */}
        <div className="p-3 sm:p-4 md:p-6 grid grid-cols-3 items-center">
          <div className="flex justify-start">
            <button
              onClick={() => navigate({ to: "/dashboard" })}
              className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full border border-white/40 bg-white/50 text-gray-700 transition hover:bg-white/70 cursor-pointer shadow-sm backdrop-blur-sm"
            >
              <ArrowLeft className="h-5 w-5 sm:h-4 sm:w-4" />
            </button>
          </div>
          <div className="flex justify-center text-center">
            <span className="text-[11px] sm:text-xs font-semibold text-gray-700 px-3 py-1 rounded-full backdrop-blur-sm bg-white/30 border border-white/20 shadow-xs truncate max-w-[180px] sm:max-w-none">
              {selectedOption.toUpperCase()}
            </span>
          </div>
          <div />
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 px-3 pb-3 sm:px-4 sm:pb-4 md:px-6 md:pb-6 overflow-y-auto">
          <div className="mx-auto max-w-2xl">
            {/* Chat Bubbles / Start View */}
            {!hasStartedCategory ? (
              <div className="mt-16 sm:mt-24 md:mt-30 text-center bg-white/20 sm:bg-transparent backdrop-blur-md sm:backdrop-blur-none p-6 sm:p-8 rounded-3xl border border-white/30 sm:border-none shadow-sm sm:shadow-none space-y-4">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                  Ready for {selectedOption}?
                </h3>
                <p className="text-xs sm:text-sm text-gray-700 max-w-md mx-auto leading-relaxed">
                  Once you start this category, your choice will be locked in and your puzzle will appear. Choose wisely!
                </p>
                <button
                  onClick={() => fetchNewPuzzle(selectedOption)}
                  disabled={loading}
                  className="inline-flex items-center gap-2 rounded-full bg-[#5B9BD5] px-6 py-3 text-xs sm:text-sm font-semibold text-white shadow-md hover:bg-[#4A8AC7] transition disabled:opacity-50 cursor-pointer"
                >
                  <Play className="h-4 w-4" />
                  {loading ? "Taking you there... It will take a minute" : "Start This Puzzle"}
                </button>
              </div>
            ) : (
              <div className="space-y-3 sm:space-y-4">
                {currentMessages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs sm:text-sm shadow-md whitespace-pre-wrap ${
                      msg.sender === "user"
                        ? "bg-[#5B9BD5] text-white rounded-br-none"
                        : "bg-white/80 backdrop-blur-md border border-white/40 text-gray-900 rounded-bl-none"
                    }`}>
                        {msg.sender === "user" ? (
                          msg.text
                        ) : (
                          <ReactMarkDown>{msg.text}</ReactMarkDown>
                        )}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-white/80 backdrop-blur-md border border-white/40 text-gray-600 rounded-2xl rounded-bl-none px-4 py-3 text-xs italic shadow-sm">
                      Thinking up something tricky...
                    </div>
                  </div>
                )}
                {isEvaluating && (
                  <div className="flex justify-start">
                    <div className="bg-white/80 backdrop-blur-md border border-white/40 text-gray-600 rounded-2xl rounded-bl-none px-4 py-3 text-xs italic shadow-sm animate-pulse">
                      Analyzing... Please wait a moment.
                    </div>
                  </div>
                )}
                {hintLoading && (
                  <div className="flex justify-start">
                    <div className="bg-white/80 backdrop-blur-md border border-white/40 text-gray-600 rounded-2xl rounded-bl-none px-4 py-3 text-xs italic shadow-sm">
                      Help is on the way...
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Input Area */}
        {hasStartedCategory && (
          <div className="px-3 pb-3 sm:px-4 sm:pb-4 md:px-6 md:pb-6">
            <div className="mx-auto max-w-2xl">
              <div className="flex flex-col gap-2 sm:gap-3">
                {/* Input Field */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="[Type your answer here...]"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    className="w-full rounded-full border border-white/40 bg-white/90 backdrop-blur-md px-4 py-3 sm:px-6 sm:py-4 pr-14 sm:pr-20 text-xs sm:text-sm shadow-md focus:outline-none focus:ring-2 focus:ring-[#5B9BD5]/50 placeholder:text-gray-400 text-gray-900"
                  />
                  <button 
                    onClick={handleSend}
                    disabled={loading}
                    className="absolute cursor-pointer right-2 top-1/2 -translate-y-1/2 rounded-full bg-[#5B9BD5] p-2 sm:p-2.5 text-white hover:bg-[#4A8AC7] transition shadow-sm disabled:opacity-50"
                  >
                    <Send className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  </button>
                </div>

                {/* Request Hint Button */}
                <button 
                  onClick={handleHint}
                  disabled={loading || hintUsed}
                  className="flex items-center justify-center cursor-pointer gap-2 rounded-full bg-white/80 backdrop-blur-md border border-white/40 px-4 py-2.5 sm:px-6 sm:py-3.5 text-xs sm:text-sm font-medium text-gray-700 shadow-md hover:bg-white transition disabled:opacity-50"
                >
                  <Lightbulb className={`h-3.5 w-3.5 sm:h-4 sm:w-4 transition-colors ${hintUsed ? "text-yellow-500 fill-yellow-400" : "text-gray-500"}`} />
                  {hintUsed ? "HINT ALREADY USED" : "REQUEST HINT"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Navigation */}
        <div className="border-t border-white/30 bg-white/40 backdrop-blur-md">
          <div className="mx-auto max-w-2xl px-2 sm:px-4 py-2 sm:py-3">
            <div className="flex items-center justify-around gap-1 sm:gap-2">
              {puzzleOptions.map((item) => {
                const isSelected = selectedOption === item.name;
                return (
                  <button
                    key={item.name}
                    onClick={() => handleOptionClick(item.name)}
                    disabled={categoryLocked}
                    className={`flex-1 rounded-full px-2 py-2 sm:px-3 sm:py-2.5 text-[10px] sm:text-xs font-medium transition cursor-pointer truncate ${
                      isSelected 
                        ? "bg-white text-[#5B9BD5] shadow-md font-semibold" 
                        : "text-gray-700 hover:bg-white/60"
                    } ${categoryLocked && !isSelected ? "opacity-40 cursor-not-allowed" : ""}`}
                  >
                    {item.name}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}