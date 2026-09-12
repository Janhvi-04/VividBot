import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Settings, KeyRound,DoorOpen, Puzzle, Feather, Palette, Cog, TerminalSquare, Brain, HeartHandshake, Clock, LogOut, Sparkles, Compass } from "lucide-react";
import watercolor from "@/assets/watercolor-bg.jpg";
import sparkBot from "@/assets/spark-bot.png";
import { apiFetch } from "../utils/api";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "VividBot — Dashboard" },
      {
        name: "description",
        content:
          "VividBot serves logic puzzles, creative prompts, coding snippets and mindfulness tasks — one small spark every morning.",
      },
      { property: "og:title", content: "VividBot — Dashboard" },
      {
        property: "og:description",
        content:
          "Logic puzzles, creative prompts, coding snippets and mindfulness tasks, delivered daily.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Dashboard,
});

const categories = [
  {
    icons: [KeyRound, Puzzle],
    title: "Logic puzzles",
    sub: "(riddles, brain teasers)",
    path: '/logic-puzzles',
  },
  {
    icons: [Sparkles, Compass],
    title: "Curosity Quest",
    sub: "(fascinating facts & odd discoveries)",
    path: '/curiosity-quest',
  },
  {
    icons: [Cog, TerminalSquare],
    title: "Coding snippets",
    sub: "(tiny problems in Python, JS, etc.)",
    path: '/coding-snippets',
  },
  {
    icons: [Brain, HeartHandshake],
    title: "Mindfulness tasks",
    sub: "(list 3 things you're grateful for)",
    path: '/mindfulness-tasks',
  },
];

function CategoryCard({icons: [A, B], title, sub, path}) {
  const navigate=useNavigate();
  return (
    <article onClick={()=>navigate({to:path})} className="group cursor-pointer relative rounded-3xl border border-white/20 bg-white/10 p-5 sm:p-6 shadow-sm backdrop-blur-[1px] transition-all duration-300 hover:bg-white/20 hover:scale-[1.01]">
      <div className="relative">
        <div className="flex items-end gap-3 text-foreground/85 transition-transform duration-300 group-hover:translate-y-[-2px]">
          <A className="h-9 w-9 sm:h-11 sm:w-11" strokeWidth={1.25} />
          <B className="h-9 w-9 sm:h-11 sm:w-11" strokeWidth={1.25} />
        </div>
        <h2 className="mt-3 font-body text-xl sm:text-2xl lg:text-3xl font-normal leading-tight text-foreground">
          {title}
        </h2>
        <p className="font-body text-lg sm:text-2xl lg:text-3xl font-light leading-tight text-foreground/85">
          {sub}
        </p>
      </div>
    </article>
  );
}

function Dashboard() {
  const [backendStatus, setBackendStatus] = useState("Connecting...");
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    const userData = sessionStorage.getItem("user");
    if (!userData) {
      navigate({ to: "/login" });
    } else {
      const parsedUser=JSON.parse(userData);
      setUser(parsedUser);
    }
  }, [navigate]);
  
  const handleLogout = () => {
    sessionStorage.removeItem("user");
    navigate({ to: "/login" });
  };
  
  useEffect(() => {
    apiFetch('/api/test')
      .then((res) => res.json())
      .then((data) => setBackendStatus(data.message))
      .catch((err) => {
        console.error("Backend connection error:", err);
        setBackendStatus("Offline");
      });
  }, []);
    
  return (
    <main className="relative min-h-screen bg-background overflow-x-hidden">
      <img
        src={watercolor}
        alt=""
        aria-hidden="true"
        width={1600}
        height={1008}
        className="pointer-events-none fixed inset-0 h-full w-full object-cover opacity-70"
      />

      <div className="relative mx-auto w-full max-w-7xl px-4 py-6 sm:px-10 sm:py-12">
        {
          <>
            {/* Header */}
            <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-3">
                <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl tracking-wide text-foreground">
                  VividBot
                </h1>
                <img
                  src={sparkBot}
                  alt="VividBot mascot"
                  width={512}
                  height={512}
                  className="h-9 w-9 sm:h-11 sm:w-11 object-contain"
                />
              </div>
              
              <p className="font-ui text-xs sm:text-sm leading-tight text-foreground/80">
                Welcome, {user?.name || "Friend"}. What shall we discover today?
                <br className="hidden sm:inline"/>
                {" "}A new day for growth.
              </p>

              <div className="flex items-center">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 rounded-full border border-gray-200 bg-white/50 px-3.5 py-1.5 text-xs font-medium text-gray-700 transition cursor-pointer hover:text-black shadow-sm"
                >
                  <DoorOpen className="h-4 w-4" />
                  Escape !
                </button>
              </div>
            </header>

            {/* Body */}
            <div className="mt-8 sm:mt-12 lg:mt-17 grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2">
              {categories.map((cat) => (
                <CategoryCard key={cat.title} {...cat} />
              ))}
            </div>

            {/* History */}
            <div className="mt-8 sm:mt-10 text-center">
              <button 
                onClick={()=>navigate({to:"/history"})}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-amber-100/20 backdrop-blur-md border border-amber-200/50 text-amber-900 font-medium text-sm hover:bg-amber-100/40 transition cursor-pointer shadow-sm"
              >
                <Clock className="h-4 w-4" strokeWidth={1.25} />
                View Your History
              </button>
            </div>
          </>
        }
      </div>
    </main>
  );
}