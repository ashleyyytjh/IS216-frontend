"use client";

import { useEffect, useMemo, useState } from "react";
import ListingCarousel from "@/components/ListingCarousel";
import { searchNotes } from "@/services/NotesService"; // adjust path if needed
import type { SearchNotesItem } from "@/types/requests/notes";

/* ===== Your NoteHit coming from backend search ===== */
type NoteHit = {
  id: string;
  userId?: string;
  description?: string;
  key?: string;
  originalName?: string;
  mimeType?: string;
  size?: number;
  tags?: string[];
  price?: number;
  type?: string;
  module?: string;
  createdAt: string;
  updatedAt?: string;
  score?: number;
};

/* ===== User profile / calendar types are unchanged ===== */
export type UserProfile = {
  modules: string[];
  major?: string;
  yearOfStudy?: number;
  budgetCents?: number;
};

export type TermPhase = "explore" | "midterm" | "project" | "finals";

export type CalendarConfig = {
  week1Monday: Date;
  midtermWeeks?: number | [number, number] | number[];
  finalsWeeks?: number | [number, number] | number[];
};

/* ===== Calendar helpers (same as before) ===== */
function startOfWeek(date: Date) {
  const d = new Date(date);
  const day = (d.getDay() + 6) % 7;
  d.setDate(d.getDate() - day);
  d.setHours(0, 0, 0, 0);
  return d;
}
function weekIndexFrom(date: Date, week1Monday: Date) {
  const ms = 7 * 24 * 3600 * 1000;
  const diff = startOfWeek(date).getTime() - startOfWeek(week1Monday).getTime();
  return Math.floor(diff / ms) + 1;
}
function normalizeWeeks(v?: number | readonly number[] | null): [number, number] | null {
  if (v == null) return null;
  if (typeof v === "number" && Number.isFinite(v)) return [v, v];
  if (Array.isArray(v) && v.length > 0) {
    const nums = (v as number[]).filter((x) => Number.isFinite(x));
    if (nums.length === 0) return null;
    const start = Math.min(...nums);
    const end = Math.max(...nums);
    return [start, end];
  }
  return null;
}
function getTermPhase(now: Date, cfg: CalendarConfig): TermPhase {
  const mid = normalizeWeeks(cfg.midtermWeeks);
  const fin = normalizeWeeks(cfg.finalsWeeks);
  const w = weekIndexFrom(now, cfg.week1Monday);
  if (fin && w >= fin[0] && w <= fin[1]) return "finals";
  if (mid && w >= mid[0] && w <= mid[1]) return "midterm";
  if (mid && fin && w > mid[1] && w < fin[0]) return "project";
  return "explore";
}
function daysBetween(a: Date, b: Date) {
  const A = new Date(a), B = new Date(b);
  A.setHours(0,0,0,0); B.setHours(0,0,0,0);
  return Math.round((B.getTime() - A.getTime()) / 86400000);
}
function weekRange(cfg: CalendarConfig, pair: [number, number]) {
  const [wStart, wEnd] = pair;
  const start = new Date(cfg.week1Monday);
  start.setDate(start.getDate() + (wStart - 1) * 7);
  const end = new Date(cfg.week1Monday);
  end.setDate(end.getDate() + (wEnd - 1) * 7 + 6);
  return { start, end };
}
export type PhaseIntent =
  | "explore" | "pre-midterm" | "midterm" | "project" | "pre-finals" | "finals";
const DEFAULT_PRE_MIDTERM_DAYS = 21;
const DEFAULT_PRE_FINALS_DAYS  = 21;
function getPhaseIntent(
  now: Date, cfg: CalendarConfig,
  preMidtermDays = DEFAULT_PRE_MIDTERM_DAYS,
  preFinalsDays  = DEFAULT_PRE_FINALS_DAYS
): PhaseIntent {
  const mid = normalizeWeeks(cfg.midtermWeeks);
  const fin = normalizeWeeks(cfg.finalsWeeks);
  if (!mid && !fin) {
    const phase = getTermPhase(now, cfg);
    return phase === "project" ? "project" : "explore";
  }
  if (mid) {
    const { start: midS, end: midE } = weekRange(cfg, mid);
    if (now >= midS && now <= midE) return "midterm";
  }
  if (fin) {
    const { start: finS, end: finE } = weekRange(cfg, fin);
    if (now >= finS && now <= finE) return "finals";
  }
  if (mid) {
    const { start: midS } = weekRange(cfg, mid);
    const d = daysBetween(now, midS);
    if (d > 0 && d <= preMidtermDays) return "pre-midterm";
  }
  if (fin) {
    const { start: finS } = weekRange(cfg, fin);
    const d = daysBetween(now, finS);
    if (d > 0 && d <= preFinalsDays) return "pre-finals";
  }
  const phase = getTermPhase(now, cfg);
  return phase === "project" ? "project" : "explore";
}

/* ===== Query + scoring (same) ===== */
const phaseKeywords: Record<TermPhase, string[]> = {
  explore: ["overview", "lecture notes", "summary"],
  midterm: ["midterm", "quiz", "cheatsheet", "practice"],
  project: ["project", "report", "rubric", "guide"],
  finals:  ["finals", "past year paper", "cheatsheet", "practice"],
};
function buildQuery(mods: string[], phase: TermPhase) {
  const modStr = mods.join(" ");
  const kw = phaseKeywords[phase].join(" ");
  return `SMU ${modStr} ${kw}`.trim();
}
function hybridScore(
  n: NoteHit,
  ctx: { phase: TermPhase; intent: PhaseIntent; mods: string[]; budgetCents?: number }
) {
  let s = n.score ?? 0;
  const tags = new Set((n.tags || []).map((t) => t.toLowerCase()));
  if (ctx.mods.includes(n.module || "")) s += 0.6;
  const nearMid = ctx.intent === "pre-midterm" || ctx.intent === "midterm";
  const nearFin = ctx.intent === "pre-finals"  || ctx.intent === "finals";
  if (nearMid && (tags.has("midterm") || tags.has("quiz"))) s += 0.9;
  if (nearFin && (tags.has("finals") || tags.has("pastpaper") || tags.has("past year"))) s += 1.0;
  if (tags.has("cheatsheet")) s += 0.3;
  if (tags.has("summary")) s += 0.2;
  const days = (Date.now() - new Date(n.createdAt).getTime()) / 86400000;
  s += Math.exp(-days / 30) * 0.4;
  if (ctx.budgetCents && (n.price ?? 0) <= ctx.budgetCents) s += 0.2;
  return s;
}

/* ===== Adapter: NoteHit -> SearchNotesItem (full shape) ===== */
function toSearchNotesItemFull(n: NoteHit): SearchNotesItem {
  return {
    // core
    id: n.id,
    title: n.originalName || n.description || "Untitled",
    description: n.description ?? "",
    price: n.price ?? 0,
    tags: n.tags ?? [],
    module: n.module ?? "General",

    // required meta expected by your carousel/card
    type: n.type ?? "note",
    userId: n.userId ?? "",
    userFullName: "Student Seller",
    userImageUrl: "", // leave empty; AvatarFallback will render
    userMajor: "",
    userYear: 0,

    // file-ish fields
    key: n.key ?? "",
    originalName: n.originalName ?? "",
    mimeType: n.mimeType ?? "",
    size: n.size ?? 0,

    // dates
    createdAt: n.createdAt,
    updatedAt: n.updatedAt ?? n.createdAt,
  };
}

/* ===== search + re-rank hook (returns SearchNotesItem[]) ===== */
function useRecommendations(
  profile: UserProfile,
  limit = 8,
  options?: { queryOverride?: string; calendar: CalendarConfig; now?: Date }
) {
  const now = options?.now ?? new Date();
  const intent = useMemo(() => getPhaseIntent(now, options!.calendar), [now, options]);
  const basePhase: TermPhase =
    intent === "midterm" || intent === "pre-midterm" ? "midterm" :
    intent === "finals"  || intent === "pre-finals"  ? "finals"  :
    intent === "project" ? "project" : "explore";

  const query = useMemo(
    () =>
      (options?.queryOverride && options.queryOverride.trim())
        ? options.queryOverride
        : buildQuery(profile.modules, basePhase),
    [options?.queryOverride, profile.modules, basePhase]
  );

  const [items, setItems] = useState<SearchNotesItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    const params = new URLSearchParams({ query, limit: String(limit * 2) });

    searchNotes(params)
      .then((res) => {
        if (cancelled) return;
        const raw: NoteHit[] = Array.isArray(res)
          ? res
          : Array.isArray((res as any).items)
          ? (res as any).items
          : [];

        const ranked = raw
          .map((n) => ({
            n,
            s: hybridScore(n, {
              phase: basePhase,
              intent,
              mods: profile.modules,
              budgetCents: profile.budgetCents,
            }),
          }))
          .sort((a, b) => b.s - a.s)
          .map((x) => toSearchNotesItemFull(x.n))
          .slice(0, limit);

        setItems(ranked);
        setError(null);
      })
      .catch((e: any) => !cancelled && setError(e.message ?? "Search failed"))
      .finally(() => !cancelled && setLoading(false));

    return () => { cancelled = true; };
  }, [query, limit, profile.modules, profile.budgetCents, basePhase, intent]);

  return { items, loading, error, phase: basePhase, intent } as const;
}

/* ===== Public single row: uses ListingCarousel (expects full items) ===== */
export function RecommendationCarousel({
  profile,
  title,
  limit = 8,
  queryOverride,
  calendar,
  subtitle,
}: {
  profile: UserProfile;
  title: string;
  limit?: number;
  queryOverride?: string;
  calendar: CalendarConfig;
  subtitle?: string;
}) {
  const { items, loading, error } = useRecommendations(profile, limit, {
    queryOverride,
    calendar,
  });

  return (
    
    <ListingCarousel
      title={title}
      subtitle={subtitle}
      items={items}      
      loading={loading}
      error={error}
      skeletonCount={8}
      
    />
  );
}

/* ===== Hub unchanged (omitted here for brevity) ===== */


/* ===== Multi-row hub (logged-in / guest) ===== */
export default function RecommendationsHub({
  isLoggedIn,
  profile,
  calendar,
}: {
  isLoggedIn: boolean;
  profile?: UserProfile;
  calendar: CalendarConfig;
}) {
  const now = new Date();
  const intent = getPhaseIntent(now, calendar);
  const isMid = intent === "pre-midterm" || intent === "midterm";
  const isFin = intent === "pre-finals" || intent === "finals";

  const examPhase: TermPhase = isMid
    ? "midterm"
    : isFin
    ? "finals"
    : getTermPhase(now, calendar);

  const examLabel =
    isMid ? "Midterms" :
    isFin ? "Finals"  :
    examPhase === "project" ? "Project & Catch-up" :
    examPhase === "midterm" ? "Midterms" :
    examPhase === "finals"  ? "Finals"  : "Explore";

  const safeProfile: UserProfile = profile ?? { modules: [] };
  const phaseQuery = buildQuery(
    safeProfile.modules.length ? safeProfile.modules : ["IS", "CS"],
    examPhase
  );

  return (
    <div className="space-y-12 py-8">
      {isLoggedIn ? (
        <>
          <RecommendationCarousel
            profile={safeProfile}
            title={`Perfect for Your ${safeProfile.modules.join("/") || "Modules"} ${examLabel}`}
            subtitle={
              safeProfile.modules.length
                ? `Curated for ${safeProfile.modules.join(", ")}`
                : "Personalized recommendations based on your profile"
            }
            limit={8}
            queryOverride={phaseQuery}
            calendar={calendar}
          />

          <RecommendationCarousel
            profile={{ ...safeProfile, modules: [safeProfile.major ?? "Information Systems"] }}
            title={`Popular in ${safeProfile.major ?? "Information Systems"}`}
            subtitle="Top-rated notes from your major"
            limit={6}
            calendar={calendar}
          />

          <RecommendationCarousel
            profile={safeProfile}
            title="Trending in Your Modules"
            subtitle="What students are viewing right now"
            limit={6}
            calendar={calendar}
          />
        </>
      ) : (
        <>
          <RecommendationCarousel
            profile={{ modules: ["IS", "CS"] }}
            title={`${examLabel} Essentials`}
            subtitle="Sign in to get personalized recommendations for your modules"
            limit={8}
            queryOverride={phaseQuery}
            calendar={calendar}
          />

          <RecommendationCarousel
            profile={{ modules: ["Top Rated", "Best Sellers"] }}
            title="Top Rated Notes"
            subtitle="Highest-rated materials from our community"
            limit={6}
            calendar={calendar}
          />
        </>
      )}
    </div>
  );
}
