"use client";

import { useEffect, useMemo, useState } from "react";
import ListingCarousel from "@/components/ListingCarousel";
import { searchNotes } from "@/services/NotesService";
import type { SearchNotesItem } from "@/types/requests/notes";
import {
  getPhaseIntent,
  type CalendarConfig,
  type TermPhase,
} from "@/utils/calendar";
import { type UserProfile } from "@/utils/userProfile";
import { buildQuery } from "@/utils/buildQuery";

import {
  phaseToLabel,
  formatModulesLabel,
  narrowPool,
  rankPool,
  computeMatchedModules,
  computeTightenedToMajor,
  type PopularityCounts,
  type RankMode,
} from "@/utils/relevance";

type UseRecOptions = {
  queryOverride?: string;
  calendar: CalendarConfig;
  now?: Date;
  strictModules?: boolean;
  strictMajor?: boolean;
  mode?: RankMode; // "auto" | "recent" | "popular" | "user-popular"
  popularityCounts?: PopularityCounts; // injected from Hub
  popularitySig?: string;              // stable string for deps
};

function useRecommendations(profile: UserProfile, limit = 8, options: UseRecOptions) {
  const now = options.now ?? new Date();
  const intent = useMemo(() => getPhaseIntent(now, options.calendar), [now, options.calendar]);

  const basePhase: TermPhase = useMemo(() => {
    if (intent === "midterm" || intent === "pre-midterm") return "midterm";
    if (intent === "finals" || intent === "pre-finals") return "finals";
    if (intent === "project") return "project";
    return "explore";
  }, [intent]);

  // phase-aware default queries
  const generalPhaseQuery = useMemo(() => buildQuery([], basePhase, undefined), [basePhase]);
  const query = useMemo(() => {
    if (options.mode === "popular") {
      return options.queryOverride !== undefined ? options.queryOverride : generalPhaseQuery;
    }
    if (options.queryOverride !== undefined) return options.queryOverride;
    return buildQuery(profile.modules, basePhase, profile.major);
  }, [options.mode, options.queryOverride, profile.modules, profile.major, basePhase, generalPhaseQuery]);

  const [items, setItems] = useState<SearchNotesItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    // Phase → suggest a single type, but only apply for phase-driven rows (queryOverride provided)
    const phaseType =
      basePhase === "midterm" || basePhase === "finals"
        ? "cheatsheet"
        : basePhase === "project"
        ? "knowledge"
        : "";

    const shouldApplyPhaseType =
      typeof options.queryOverride === "string" &&
      options.queryOverride.trim().length > 0;

    const fetchLimit = Math.max(limit * 4, 48);
    const params = new URLSearchParams({ query, limit: String(fetchLimit) });
    if (shouldApplyPhaseType && phaseType) params.set("type", phaseType);

    searchNotes(params)
      .then((res) => {
        if (cancelled) return;
        const raw: SearchNotesItem[] = (res as any)?.items ?? [];

        // 1) narrow once
        const narrowed = narrowPool(
          raw,
          options.mode ?? "auto",
          { mods: profile.modules, major: profile.major },
          { strictModules: options.strictModules, strictMajor: options.strictMajor }
        );

        // 2) rank once
        const ranked = rankPool(
          narrowed,
          options.mode ?? "auto",
          options.popularityCounts,
          { phase: basePhase, intent, mods: profile.modules, major: profile.major },
          limit,
          { popWeight: 0.8 }
        );

        setItems(ranked);
        setError(false);
      })
      .catch(() => {
        setError(true);
        setItems([]);
      })
      .finally(() => !cancelled && setLoading(false));

    return () => {
      cancelled = true;
    };
  }, [
    query,
    limit,
    options.strictModules,
    options.strictMajor,
    options.mode,
    basePhase,
    intent,
    profile.modules,
    profile.major,
    options.popularitySig, // stable; don't depend on Map identity
  ]);

  return { items, loading, error, basePhase } as const;
}

/* ===== component ===== */
export function RecommendationRow({
  profile,
  title,
  limit = 8,
  queryOverride,
  calendar,
  subtitle,
  strictModules = false,
  strictMajor = false,
  mode = "auto",
  popularityCounts,
  popularitySig,
}: {
  profile: UserProfile;
  title?: string;
  limit?: number;
  queryOverride?: string;
  calendar: CalendarConfig;
  subtitle?: string;
  strictModules?: boolean;
  strictMajor?: boolean;
  mode?: "auto" | "recent" | "popular" | "user-popular";
  popularityCounts?: PopularityCounts;
  popularitySig?: string;
}) {
  const { items, loading, error, basePhase } = useRecommendations(profile, limit, {
    queryOverride,
    calendar,
    strictModules,
    strictMajor,
    mode,
    popularityCounts,
    popularitySig,
  });

  const matchedModules = useMemo(
    () => computeMatchedModules(items, profile.modules || []),
    [items, profile.modules]
  );

  const tightenedToMajor = useMemo(
    () => computeTightenedToMajor(items, profile.modules || [], profile.major),
    [items, profile.modules, profile.major]
  );

  const computedTitle = useMemo(() => {
    if (title) return title;
    const phase = phaseToLabel(basePhase);
    if (matchedModules.length > 0) return `For Your ${formatModulesLabel(matchedModules)} — ${phase}`;
    if (tightenedToMajor && profile.major) return `For Your ${profile.major} — ${phase}`;
    return `For Your ${formatModulesLabel(profile.modules || [])} — ${phase}`;
  }, [title, matchedModules, tightenedToMajor, profile.major, profile.modules, basePhase]);

  const computedSubtitle = useMemo(() => {
    if (subtitle) return subtitle;
    if (!loading && !error) {
      if (matchedModules.length > 0) return `Curated across ${matchedModules.join(", ")}`;
      if (tightenedToMajor && profile.major) return `Curated from ${profile.major}`;
      return "You may like";
    }
    return undefined;
  }, [subtitle, loading, error, matchedModules, tightenedToMajor, profile.major]);

  return (
    <ListingCarousel
      title={computedTitle}
      subtitle={computedSubtitle}
      items={items}
      loading={loading}
      error={error}
      skeletonCount={limit}
    />
  );
}
