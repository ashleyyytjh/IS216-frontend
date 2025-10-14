// components/recommendations/RecommendationRow.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import ListingCarousel from "@/components/ListingCarousel";
import { searchNotes } from "@/services/NotesService";
import type { SearchNotesItem } from "@/types/requests/notes";
import {
  getPhaseIntent,
  type CalendarConfig,
  type PhaseIntent,
  type TermPhase,
} from "@/lib/calendar";
import { type UserProfile } from "@/utils/userProfile";
/* ===== Frontend-only shapes ===== */


/* ===== Query + scoring ===== */
const phaseKeywords: Record<TermPhase, string[]> = {
  explore: ["overview", "lecture notes", "summary"],
  midterm: ["midterm", "quiz", "cheatsheet", "practice"],
  project: ["project", "report", "rubric", "guide"],
  finals: ["finals", "past year paper", "cheatsheet", "practice"],
};

function buildQuery(mods: string[], phase: TermPhase) {
  const modStr = mods.join(" ");
  const kw = phaseKeywords[phase].join(" ");
  return `SMU ${modStr} ${kw}`.trim();
}

function hybridScore(
  n: SearchNotesItem,
  ctx: { phase: TermPhase; intent: PhaseIntent; mods: string[]; budgetCents?: number }
) {
  let s = (n as any).score ?? 0; // keep vector score if backend adds it
  const tags = new Set((n.tags || []).map((t) => t.toLowerCase()));
  if (ctx.mods.includes(n.module || "")) s += 0.6;

  const nearMid = ctx.intent === "pre-midterm" || ctx.intent === "midterm";
  const nearFin = ctx.intent === "pre-finals" || ctx.intent === "finals";
  if (nearMid && (tags.has("midterm") || tags.has("quiz"))) s += 0.9;
  if (nearFin && (tags.has("finals") || tags.has("pastpaper") || tags.has("past year"))) s += 1.0;
  if (tags.has("cheatsheet")) s += 0.3;
  if (tags.has("summary")) s += 0.2;

  const days = (Date.now() - new Date(n.createdAt).getTime()) / 86400000;
  s += Math.exp(-days / 30) * 0.4;

  if (ctx.budgetCents && (n.price ?? 0) <= ctx.budgetCents) s += 0.2;
  return s;
}

/* ===== Hook: fetch + re-rank and return full items ===== */
function useRecommendations(
  profile: UserProfile,
  limit = 8,
  options: { queryOverride?: string; calendar: CalendarConfig; now?: Date }
) {
  const now = options.now ?? new Date();
  const intent = useMemo(() => getPhaseIntent(now, options.calendar), [now, options.calendar]);

  const basePhase: TermPhase = useMemo(() => {
    if (intent === "midterm" || intent === "pre-midterm") return "midterm";
    if (intent === "finals" || intent === "pre-finals") return "finals";
    if (intent === "project") return "project";
    return "explore";
  }, [intent]);

  const query = useMemo(() => {
    if (options.queryOverride?.trim()) return options.queryOverride;
    return buildQuery(profile.modules, basePhase);
  }, [options.queryOverride, profile.modules, basePhase]);

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

        // Backend already returns full SearchNotesItem[]
        const raw: SearchNotesItem[] = (res as any)?.items ?? [];

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
          .map((x) => x.n)
          .slice(0, limit);

        setItems(ranked);
        setError(null);
      })
      .catch((e: any) => !cancelled && setError(e?.message ?? "Search failed"))
      .finally(() => !cancelled && setLoading(false));

    return () => {
      cancelled = true;
    };
  }, [query, limit, profile.modules, profile.budgetCents, basePhase, intent]);

  return { items, loading, error } as const;
}

/* ===== Public row component ===== */
export function RecommendationRow({
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
      skeletonCount={limit}
    />
  );
}
