import PageHeader from "@/components/modules/PageHeader";
import DegreePicker from "@/components/modules/DegreePicker";
import Legend from "@/components/modules/Legend";
import Toolbar from "@/components/modules/Toolbar";
import YearColumn from "@/components/modules/YearColumn";
import { FlowProvider, useFlow } from "@/components/modules/FlowContext";
import { useEffect } from "react";

function Roadmap() {
    useEffect(() => {
      window.history.scrollRestoration = 'manual';
      window.scrollTo(0, 0);
    }, []);
  const { compact, filteredPlan } = useFlow();

  const accents = [
    "from-white/80 to-zinc-50/60 dark:from-zinc-900/25 dark:to-zinc-800/20",
    "from-zinc-200/70 to-zinc-300/60 dark:from-zinc-950/50 dark:to-zinc-900/45",
  ];

  return (
    <main className="px-5 xl:px-0 py-10">
      <PageHeader />
      <DegreePicker />
      <Legend />
      <Toolbar />

      <section className="mx-auto max-w-7xl mt-6 fade-in">
        <div className="relative rounded-3xl border bg-background shadow-sm">
          <div
            className="absolute inset-0 opacity-50 pointer-events-none"
            style={{
              backgroundImage: "radial-gradient(currentColor 1px, transparent 1px)",
              backgroundSize: "16px 16px",
              color: "var(--border)",
            }}
          />
          <div className="relative p-4">
            <div className="flex gap-6 overflow-x-auto pb-4">
              {Object.keys(filteredPlan)
                .map((k) => Number(k))
                .sort((a, b) => a - b)
                .map((year, idx) => (
                  <YearColumn
                    key={year}
                    year={year}
                    mods={filteredPlan[year]}
                    compact={compact}
                    accent={accents[idx % 2]}
                  />
                ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default function RoadmapPage() {
  return (
    <FlowProvider>
      <Roadmap />
    </FlowProvider>
  );
}