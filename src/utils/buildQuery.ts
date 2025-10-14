import {
  type TermPhase,
} from "@/utils/calendar";

export function buildQuery(mods: string[], phase: TermPhase) {
  const dict: Record<TermPhase, string[]> = {
    explore: ["overview", "lecture notes", "summary"],
    midterm: ["midterm", "quiz", "cheatsheet", "practice"],
    project: ["project", "report", "rubric", "guide"],
    finals: ["finals", "past year paper", "cheatsheet", "practice"],
  };
  const modStr = mods.join(" ");
  const kw = dict[phase].join(" ");
  return `SMU ${modStr} ${kw}`.trim();
}