import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Clock, ArrowLeft } from "lucide-react";
import watercolor from "@/assets/watercolor-bg.jpg";
import { apiFetch } from "../../utils/api";

export const Route = createFileRoute("/history/")({
  component: HistoryIndex,
});

function HistoryIndex() {
  const [uniqueDates, setUniqueDates] = useState([]);
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
        const formattedDates = data.history.map((act) => 
        new Date(act.timestamp).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        })
      );
      setUniqueDates([...new Set(formattedDates)]);
      }
    })
    .catch((err) => {
      if (err.name !== "AbortError") {
        console.error("Error fetching history:", err);
      }
    });

  return () => controller.abort(); // Cancels the request if you leave the page quickly
}, [navigate]);

  return (
    <main className="relative min-h-screen bg-background p-6 sm:p-10">
      <img src={watercolor} alt="" className="pointer-events-none fixed inset-0 h-full w-full object-cover opacity-70" />
      <div className="relative mx-auto max-w-4xl">
        <button 
          onClick={() => navigate({ to: "/dashboard" })}
          className="mb-6 flex items-center gap-2 rounded-full bg-white/50 px-4 py-2 text-sm font-medium text-gray-700 backdrop-blur hover:bg-white/80 cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Dashboard
        </button>
        <div className="rounded-3xl bg-sidebar/90 p-6 backdrop-blur-[2px]">
          <div className="flex items-center gap-3 text-sidebar-foreground mb-6">
            <Clock className="h-6 w-6" strokeWidth={1.25} />
            <h1 className="font-display text-2xl uppercase tracking-wide">Activity History</h1>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {uniqueDates.length > 0 ? (
              uniqueDates.map((dateStr) => (
                <div
                  key={dateStr}
                  onClick={() => navigate({ to: "/history/$date", params: { date: dateStr } })}
                  className="flex items-center justify-between rounded-2xl bg-sidebar-accent/40 p-4 cursor-pointer transition hover:bg-sidebar-accent text-sidebar-foreground"
                >
                  <span className="font-body text-lg font-medium">{dateStr}</span>
                  <span className="text-xs uppercase tracking-wider opacity-75">View →</span>
                </div>
              ))
            ) : (
              <p className="text-sidebar-foreground/70">No past activity logs found.</p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}