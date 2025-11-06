// utils/buildQuery.ts
import type { TermPhase } from "@/utils/calendar";

const PHASE_KEYWORDS: Record<TermPhase, string[]> = {
  explore: ["overview", "lecture notes", "summary"],
  midterm: ["midterm", "quiz", "cheatsheet", "practice"],
  project: ["project", "report", "rubric", "guide"],
  finals: ["finals", "past year paper", "cheatsheet"],
};

export function buildQuery(mods: string[], phase: TermPhase, major?: string) {
  const modStr = (mods ?? []).filter(Boolean).join(" ");
  const kw = PHASE_KEYWORDS[phase].join(" ");
  const majorStr = major ? ` ${major} "${major}"` : "";
  return `${modStr} ${kw}${majorStr}`.trim();
}
