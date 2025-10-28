import type { SearchNotesItem } from "@/types/requests/notes";
import type { PhaseIntent, TermPhase } from "@/utils/calendar";

/* ===================== utils ===================== */

// convert CS42O to cs420
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

export function coerceNoteId(n: SearchNotesItem): string | undefined {
  // try common shapes
  return (n as any).id ?? (n as any)._id ?? (n as any).note_id;
}

/* ===================== matching ===================== */

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

/* ===================== labels ===================== */

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

/* ===================== popularity ===================== */

export type PopularityCounts = Map<string, number>;

export function popularityRawCount(n: SearchNotesItem, counts?: PopularityCounts): number {
  if (!counts) return 0;
  const id = coerceNoteId(n);
  return id ? counts.get(id) ?? 0 : 0;
}

/** Smooth popularity score (log1p) to dampen huge bestsellers */
export function popularityScore(
  n: SearchNotesItem,
  counts?: PopularityCounts,
  opts?: { base?: number }
): number {
  const c = popularityRawCount(n, counts);
  if (c <= 0) return 0;
  if (!opts?.base || opts.base === Math.E) return Math.log1p(c);
  return Math.log1p(c) / Math.log(opts.base);
}

/* ===================== hybrid score ===================== */

export function hybridScore(
  n: SearchNotesItem,
  ctx: { phase: TermPhase; intent: PhaseIntent; mods: string[] },
  extras?: {
    popCounts?: PopularityCounts; // Map<note_id, successful_purchase_count>
    popWeight?: number;           // default 0.8
  }
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

  // popularity boost (if provided)
  if (extras?.popCounts) {
    const popW = extras.popWeight ?? 0.8;
    s += popW * popularityScore(n, extras.popCounts);
  }

  return s;
}

/* ===================== narrowing + ranking ===================== */

export type RankMode = "auto" | "recent" | "popular" | "user-popular";
export type NarrowFlags = { strictModules?: boolean; strictMajor?: boolean };
export type RankCtx = {
  phase: TermPhase;
  intent: PhaseIntent;
  mods: string[];
  major?: string;
};

export function narrowPool(
  pool: SearchNotesItem[],
  mode: RankMode,
  profile: { mods: string[]; major?: string },
  flags: NarrowFlags
): SearchNotesItem[] {
  if (mode === "user-popular") {
    if (flags.strictModules) return pool.filter((n) => moduleMatches(n, profile.mods));
    if (flags.strictMajor)   return pool.filter((n) => majorMatches(n, profile.major));
    return pool.filter((n) => isRelevant(n, { mods: profile.mods, major: profile.major }));
  }
  if (mode === "popular") {
    if (flags.strictModules) return pool.filter((n) => moduleMatches(n, profile.mods));
    if (flags.strictMajor)   return pool.filter((n) => majorMatches(n, profile.major));
    return pool; // global
  }
  // "auto": legacy strict precedence
  const byModules = pool.filter((n) => moduleMatches(n, profile.mods));
  const byMajor   = pool.filter((n) => majorMatches(n, profile.major));
  if (flags.strictModules) return byModules;
  if (flags.strictMajor)   return byMajor;
  if (byModules.length)    return byModules;
  if (byMajor.length)      return byMajor;
  return pool;
}

export function rankPool(
  pool: SearchNotesItem[],
  mode: RankMode,
  popularityCounts: PopularityCounts | undefined,
  ctx: RankCtx,
  limit: number,
  opts?: { popWeight?: number }
): SearchNotesItem[] {
  if (mode === "recent") {
    return [...pool]
      .sort((a, b) => new Date(b.createdAt as string).getTime() - new Date(a.createdAt as string).getTime())
      .slice(0, limit);
  }

  if (mode === "popular" || mode === "user-popular") {
    // Popularity first, tie-break with hybrid (phase-aware)
    return [...pool]
      .map((n) => ({
        n,
        p: popularityRawCount(n, popularityCounts),
        t: hybridScore(n, { phase: ctx.phase, intent: ctx.intent, mods: mode === "user-popular" ? ctx.mods : [] }),
      }))
      .sort((a, b) => (b.p - a.p) || (b.t - a.t))
      .slice(0, limit)
      .map((x) => x.n);
  }

  // "auto": hybrid + (optional) popularity boost
  const popW = opts?.popWeight ?? 0.8;
  return [...pool]
    .map((n) => ({
      n,
      s: hybridScore(n, { phase: ctx.phase, intent: ctx.intent, mods: ctx.mods }, { popCounts: popularityCounts, popWeight: popW }),
    }))
    .sort((a, b) => b.s - a.s)
    .slice(0, limit)
    .map((x) => x.n);
}

/* ===================== small view helpers ===================== */

export function computeMatchedModules(items: SearchNotesItem[], mods: string[]): string[] {
  const out = new Set<string>();
  for (const m of mods || []) {
    if (items.some((n) => moduleMatches(n, [m]))) out.add(m);
  }
  return Array.from(out);
}

export function computeTightenedToMajor(
  items: SearchNotesItem[],
  mods: string[],
  major?: string
): boolean {
  if (!major) return false;
  const anyModuleMatch = items.some((n) => moduleMatches(n, mods));
  const anyMajorMatch  = items.some((n) => majorMatches(n, major));
  return !anyModuleMatch && anyMajorMatch;
}
