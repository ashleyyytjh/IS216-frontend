import type { SearchNotesItem } from "@/types/requests/notes";
import type { PhaseIntent, TermPhase } from "@/utils/calendar";

//convert CS42O to cs420
export function normMod(s: string) {
  return (s || "").toLowerCase().replace(/\s+/g, "");
}

function buildModRegexTokens(mods: string[]) {
  return Array.from(
    new Set(
      (mods || [])
        .filter(Boolean)
        .map(normMod)
        .map((m) => new RegExp(m.split("").join("[\\s-]*"), "i"))
    )
  );
}

// note.module must be same as user mod
export function moduleMatches(note: SearchNotesItem, userMods: string[]) {
  if (!userMods?.length) return false;
  const noteMod = normMod((note.module as string) || "");
  if (!noteMod) return false;
  const set = new Set(userMods.map(normMod));
  return set.has(noteMod);
}

export function majorMatches(note: SearchNotesItem, major?: string) {
  if (!major) return false;
  return (note.userMajor || "").toLowerCase() === major.toLowerCase();
}


export function isModuleRelevant(n: SearchNotesItem, userMods: string[]): boolean {
  if (!userMods?.length) return true; // if no modules, don't block results
  if (moduleMatches(n, userMods)) return true;

  const hay = [n.title || "", n.description || "", ...(n.tags || []), n.module || ""].join(" ");
  const regexes = buildModRegexTokens(userMods);
  return regexes.some((rx) => rx.test(hay));
}


export function isMajorRelevant(n: SearchNotesItem, major?: string): boolean {
  if (!major) return true; // if no major, don't block results
  return majorMatches(n, major);
}

export function isRelevant(n: SearchNotesItem, opts: { mods: string[]; major?: string }) {
  return isModuleRelevant(n, opts.mods) || isMajorRelevant(n, opts.major);
}

export function phaseToLabel(phase: TermPhase) {
  switch (phase) {
    case "midterm":
      return "Midterms";
    case "finals":
      return "Finals";
    case "project":
      return "Project & Catch-up";
    default:
      return "Explore";
  }
}

export function formatModulesLabel(mods: string[]) {
  const clean = (mods || []).filter(Boolean);
  if (!clean.length) return "Modules";
  const maxShow = 2;
  if (clean.length <= maxShow) return clean.join(" / ");
  const shown = clean.slice(0, maxShow).join(" / ");
  return `${shown} +${clean.length - maxShow}`;
}

export function hybridScore(
  n: SearchNotesItem,
  ctx: { phase: TermPhase; intent: PhaseIntent; mods: string[] }
) {
  let s = (n as any).score ?? 0;

  const tags = new Set((n.tags || []).map((t) => t.toLowerCase()));
  const modsNorm = new Set(ctx.mods.map(normMod));
  if ((n.module as string) && modsNorm.has(normMod(n.module as string))) s += 0.6;

  const nearMid = ctx.intent === "pre-midterm" || ctx.intent === "midterm";
  const nearFin = ctx.intent === "pre-finals" || ctx.intent === "finals";
  if (nearMid && (tags.has("midterm") || tags.has("quiz"))) s += 0.9;
  if (nearFin && (tags.has("finals") || tags.has("pastpaper") || tags.has("past year"))) s += 1.0;
  if (tags.has("cheatsheet")) s += 0.3;
  if (tags.has("summary")) s += 0.2;

  const days = (Date.now() - new Date(n.createdAt as string).getTime()) / 86400000;
  s += Math.exp(-days / 30) * 0.4;

  return s;
}
