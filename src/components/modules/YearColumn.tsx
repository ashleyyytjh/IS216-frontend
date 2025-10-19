import { useMemo } from "react";
import type { Module } from "@/types/types";
import ModuleCard from "./ModuleCard";

function groupBySemester(mods: Module[]) {
  const s1 = mods.filter((m) => m.sem === 1);
  const s2 = mods.filter((m) => m.sem === 2);
  const s0 = mods.filter((m) => m.sem == null || m.sem === 0);
  return { s1, s2, s0 };
}
function yearCredits(mods: Module[]) {
  return mods.reduce((sum, m) => sum + (m.units ?? 0), 0);
}

function SemesterBlock({ title, mods, compact }: { title: string; mods: Module[]; compact: boolean }) {
  if (mods.length === 0) return null;
  return (
    <div className="space-y-3">
      <div className="sticky top-0 z-10 -mx-2 px-2">
        <div className="relative mx-auto w-fit overflow-hidden rounded-full border bg-background/80 backdrop-blur px-3 py-1 text-xs text-foreground shadow-sm">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-zinc-300/40 via-zinc-200/20 to-transparent dark:from-zinc-700/40 dark:via-zinc-700/20" />
          <div className="relative">{title}</div>
        </div>
      </div>

      <div className="space-y-3">
        {mods.map((m) => (
          <ModuleCard key={m.code} m={m} compact={compact} />
        ))}
      </div>
    </div>
  );
}

export default function YearColumn({
  year,
  mods,
  compact,
  accent,
}: {
  year: number;
  mods: Module[];
  compact: boolean;
  accent: string;
}) {
  const { s1, s2, s0 } = useMemo(() => groupBySemester(mods), [mods]);
  const credits = useMemo(() => yearCredits(mods), [mods]);

  return (
    <section className="min-w-[280px] max-w-sm w-full">
      <div className="relative overflow-hidden rounded-2xl border bg-card shadow-sm">
        <div className={`absolute inset-0 pointer-events-none bg-gradient-to-b ${accent}`} />
        <div className="relative p-4 border-b bg-background/60 backdrop-blur">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Year {year}</h3>
            <span className="text-xs text-muted-foreground">Total Units: {credits}</span>
          </div>
        </div>

        <div className="relative p-4 space-y-6">
          <SemesterBlock title="Semester 1" mods={s1} compact={compact} />
          <SemesterBlock title="Semester 2" mods={s2} compact={compact} />
          <SemesterBlock title="Year-long / Unassigned" mods={s0} compact={compact} />
        </div>
      </div>
    </section>
  );
}