// components/recommendations/RecommendationRow.tsx
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
  moduleMatches,
  majorMatches,
  phaseToLabel,
  formatModulesLabel,
  hybridScore,
} from "@/utils/relevance";


type UseRecOptions = {
  queryOverride?: string;
  calendar: CalendarConfig;
  now?: Date;
  strictModules?: boolean;  
  strictMajor?: boolean;   
  mode?: "auto" | "recent"; 
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

  const query = useMemo(() => {
    if (options.queryOverride !== undefined) return options.queryOverride;
    return buildQuery(profile.modules, basePhase, profile.major);
  }, [options.queryOverride, profile.modules, profile.major, basePhase]);

  const [items, setItems] = useState<SearchNotesItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    const params = new URLSearchParams({ query, limit: String(limit * 2) });

    searchNotes(params)
      .then((res) => {
        if (cancelled) return;
        const raw: SearchNotesItem[] = (res as any)?.items ?? [];

        if (options.mode === "recent") {
          const recent = [...raw]
            .sort((a, b) => new Date(b.createdAt as string).getTime() - new Date(a.createdAt as string).getTime())
            .slice(0, limit);
          setItems(recent);
          setError(false);
          return;
        }

        const byModules = raw.filter((n) => moduleMatches(n, profile.modules));
        const byMajor   = raw.filter((n) => majorMatches(n, profile.major));

        let pool: SearchNotesItem[] = raw;
        if (options.strictModules) {
          pool = byModules;
        } else if (options.strictMajor) {
          pool = byMajor;
        } else if (byModules.length > 0) {
          pool = byModules;
        } else if (byMajor.length > 0) {
          pool = byMajor;
        } // else keep raw

        const ranked = pool
          .map((n) => ({
            n,
            s: hybridScore(n, { phase: basePhase, intent, mods: profile.modules }),
          }))
          .sort((a, b) => b.s - a.s)
          .map((x) => x.n)
          .slice(0, limit);

        setItems(ranked);
        setError(false);
      })
      .catch(() => {
        setError(true);
        setItems([]);
      })
      .finally(() => !cancelled && setLoading(false));

  }, [query, limit, options.strictModules, options.strictMajor, options.mode]);

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
}: {
  profile: UserProfile;
  title?: string;
  limit?: number;
  queryOverride?: string;
  calendar: CalendarConfig;
  subtitle?: string;
  strictModules?: boolean;
  strictMajor?: boolean;
  mode?: "auto" | "recent";
}) {
  const { items, loading, error, basePhase } = useRecommendations(profile, limit, {
    queryOverride,
    calendar,
    strictModules,
    strictMajor,
    mode,
  });

  if (mode === "recent") {
    return (
      <ListingCarousel
        title={title ?? "Recently Listed Notes"}
        subtitle={subtitle}
        items={items}
        loading={loading}
        error={error}
        skeletonCount={limit}
      />
    );
  }
  const matchedModules = useMemo(() => {
    const out = new Set<string>();
    for (const m of profile.modules || []) {
      if (items.some((n) => moduleMatches(n, [m]))) out.add(m);
    }
    return Array.from(out);
  }, [items, profile.modules]);

  const tightenedToMajor = useMemo(() => {
    if (!profile.major) return false;
    const anyModuleMatch = items.some((n) => moduleMatches(n, profile.modules));
    const anyMajorMatch  = items.some((n) => majorMatches(n, profile.major));
    return !anyModuleMatch && anyMajorMatch;
  }, [items, profile.modules, profile.major]);

  const computedTitle = useMemo(() => {
    if (title) return title;
    const phase = phaseToLabel(basePhase);
    if (matchedModules.length > 0) {
      return `For Your ${formatModulesLabel(matchedModules)} — ${phase}`;
    }
    if (tightenedToMajor && profile.major) {
      return `For Your ${profile.major} — ${phase}`;
    }
    return `For Your ${formatModulesLabel(profile.modules || [])} — ${phase}`;
  }, [title, matchedModules, tightenedToMajor, profile.major, profile.modules, basePhase]);

  const computedSubtitle = useMemo(() => {
    if (subtitle) return subtitle;
    if (!loading && !error) {
      if (matchedModules.length > 0) {
        return `Curated across ${matchedModules.join(", ")}`;
      }
      if (tightenedToMajor && profile.major) {
        return `Curated from ${profile.major}`;
      }
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
