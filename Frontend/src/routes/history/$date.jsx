import { createFileRoute, useNavigate, useParams } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Clock, ArrowLeft } from "lucide-react";
import watercolor from "@/assets/watercolor-bg.jpg";
import { apiFetch } from "../../utils/api";

export const Route = createFileRoute("/history/$date")({
  component: HistoryDayDetail,
});

function HistoryDayDetail() {
  const { date } = useParams({ from: "/history/$date" });
  const [activities, setActivities] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const controller = new AbortController();
    const userData = sessionStorage.getItem("user");
    if (!userData) {
      navigate({ to: "/login" });
      return;
    }
    const parsedUser = JSON.parse(userData);

    apiFetch(`/api/activities/history/${parsedUser.identifier}`, {
      signal: controller.signal
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.history) {
          const filtered = data.history.filter((act) => {
            const itemDate = new Date(act.timestamp).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            });
            return itemDate.trim() === decodeURIComponent(date).trim();
          });
          setActivities(filtered);
        }
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          console.error("Error fetching history:", err);
        }
      });

    return () => controller.abort();
  }, [navigate]);

  return (
    <main className="relative min-h-[100dvh] overflow-y-auto overflow-x-hidden bg-background p-4 sm:p-6 md:p-10 box-border flex flex-col justify-between">
      <img src={watercolor} alt="" className="pointer-events-none fixed inset-0 h-full w-full object-cover opacity-70" />
      <div className="relative mx-auto w-full max-w-4xl z-10 flex-1 flex flex-col justify-center py-4">
        <button 
          onClick={() => navigate({ to: "/history" })}
          className="mb-6 flex items-center gap-2 rounded-full bg-white/50 px-4 py-2 text-sm font-medium text-gray-700 backdrop-blur hover:bg-white/80 cursor-pointer w-fit shadow-sm transition"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Dates
        </button>
        <div className="rounded-3xl bg-sidebar/90 p-5 sm:p-8 backdrop-blur-[2px] shadow-xl w-full">
          <h1 className="font-display text-xl sm:text-2xl uppercase tracking-wide text-sidebar-foreground mb-6 truncate">
            Activities on {date}
          </h1>
          <div className="space-y-3">
            {activities.length > 0 ? (
              activities.map((act, idx) => {
                const timeString = new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                return (
                  <div key={idx} className="rounded-2xl bg-sidebar-accent/30 p-4 text-sidebar-foreground flex items-start justify-between gap-4 shadow-sm">
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-sm sm:text-base break-words">{act.title}</p>
                      <span className="text-[10px] sm:text-xs opacity-75 uppercase tracking-wider block mt-0.5">{act.activityType}</span>
                    </div>
                    <span className="text-xs font-mono opacity-85 whitespace-nowrap bg-sidebar-accent/50 px-2.5 py-1 rounded-lg flex-shrink-0">
                      {timeString}
                    </span>
                  </div>
                );
              })
            ) : (
              <p className="text-sidebar-foreground/70 italic text-sm">No actions recorded for this date.</p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}