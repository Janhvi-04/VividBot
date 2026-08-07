import { createFileRoute } from "@tanstack/react-router";
import { Settings, KeyRound, Puzzle, Feather, Palette, Cog, TerminalSquare, Brain, HeartHandshake, Clock, type LucideIcon } from "lucide-react";
import watercolor from "@/assets/watercolor-bg.jpg";
import sparkBot from "@/assets/spark-bot.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "VividBot — A Daily Nudge for Curious Minds" },
      {
        name: "description",
        content:
          "VividBot serves logic puzzles, creative prompts, coding snippets and mindfulness tasks — one small spark every morning.",
      },
      { property: "og:title", content: "VividBot — A Daily Nudge for Curious Minds" },
      {
        property: "og:description",
        content:
          "Logic puzzles, creative prompts, coding snippets and mindfulness tasks, delivered daily.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const categories: { icons: [LucideIcon, LucideIcon]; title: string; sub: string }[] = [
  {
    icons: [KeyRound, Puzzle],
    title: "Logic puzzles",
    sub: "(riddles, brain teasers)",
  },
  {
    icons: [Feather, Palette],
    title: "Creative prompts",
    sub: "(write a 2-line poem, sketch an idea)",
  },
  {
    icons: [Cog, TerminalSquare],
    title: "Coding snippets",
    sub: "(tiny problems in Python, JS, etc.)",
  },
  {
    icons: [Brain, HeartHandshake],
    title: "Mindfulness tasks",
    sub: "(list 3 things you're grateful for)",
  },
];

const history = [
  "Oct 25, 2023",
  "Oct 24, 2023",
  "Oct 22, 2023",
  "Oct 21, 2023",
  "Oct 18, 2023",
  "Oct 15, 2023",
  "Oct 10, 2023",
  "Oct 05, 2023",
];

function CategoryCard({
  icons: [A, B],
  title,
  sub,
}: {
  icons: [LucideIcon, LucideIcon];
  title: string;
  sub: string;
}) {
  return (
    <article className="relative rounded-3xl border border-white/20 bg-white/10 p-6 shadow-sm backdrop-blur-[1px]">
      <div className="relative">
        <div className="flex items-end gap-3 text-foreground/85">
          <A className="h-11 w-11" strokeWidth={1.25} />
          <B className="h-11 w-11" strokeWidth={1.25} />
        </div>
        <h2 className="mt-3 font-body text-2xl font-normal leading-tight text-foreground sm:text-3xl">
          {title}
        </h2>
        <p className="font-body text-2xl font-light leading-tight text-foreground/85 sm:text-3xl">
          {sub}
        </p>
      </div>
    </article>
  );
}



function Index() {
  return (
    <main className="relative min-h-screen bg-background">
      <img
        src={watercolor}
        alt=""
        aria-hidden="true"
        width={1600}
        height={1008}
        className="pointer-events-none fixed inset-0 h-full w-full object-cover opacity-70"
      />

      <div className="relative mx-auto w-full max-w-7xl px-5 py-8 sm:px-10 sm:py-12">
        {
          <>
            {/* Header */}
            <header className="flex flex-wrap items-center gap-4">
              <h1 className="font-display text-3xl tracking-wide text-foreground sm:text-4xl">
                VividBot
              </h1>
              <img
                src={sparkBot}
                alt="VividBot mascot"
                width={512}
                height={512}
                className="h-11 w-11 object-contain"
              />
              <p className="max-w-xs font-ui text-sm leading-tight text-foreground/80">
                Good morning, Janhvi. What shall we discover today?
                <br />
                A new day for growth.
              </p>
              <div className="ml-auto flex items-center gap-3">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-accent font-ui text-sm font-medium text-accent-foreground">
                  J
                </span>
                <button
                  type="button"
                  aria-label="Settings"
                  className="rounded-full p-1.5 text-foreground/70 transition-colors hover:bg-secondary hover:text-foreground"
                >
                  <Settings className="h-5 w-5" />
                </button>
              </div>
            </header>

            {/* Body */}
            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              {categories.map((cat) => (
                <CategoryCard key={cat.title} {...cat} />
              ))}
            </div>

            {/* History */}
            <aside className="mt-8 h-fit rounded-3xl bg-sidebar/90 p-4 backdrop-blur-[2px]">
              <div className="flex items-center gap-2 text-sidebar-foreground">
                <Clock className="h-5 w-5" strokeWidth={1.25} />
                <h2 className="font-display text-xl uppercase tracking-wide">History</h2>
              </div>
              <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5">
                {history.map((d) => (
                  <li
                    key={d}
                    className="flex items-center gap-2 rounded-full bg-sidebar-accent/50 px-3 py-1 font-body text-base text-sidebar-foreground"
                  >
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-sidebar-foreground" />
                    {d}
                  </li>
                ))}
              </ul>
            </aside>
          </>
        }
      </div>
    </main>
  );
}
