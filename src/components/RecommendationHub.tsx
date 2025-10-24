// components/recommendations/RecommendationsHub.tsx
"use client";

import { motion, useInView, useReducedMotion, type Variants } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";

import { RecommendationRow } from "./RecommendationRow";
import { RowSkeleton } from "@/components/recommendations/RowSkeleton";
import { type UserProfile } from "@/utils/userProfile";
import {
  getPhaseIntent,
  getTermPhase,
  type CalendarConfig,
  type TermPhase,
} from "@/utils/calendar";
import { buildQuery } from "@/utils/buildQuery";

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

  const examPhase: TermPhase =
    isMid ? "midterm" : isFin ? "finals" : getTermPhase(now, calendar);

  const examLabel = useMemo(
    () =>
      isMid
        ? "Midterms"
        : isFin
        ? "Finals"
        : examPhase === "project"
        ? "Project & Catch-up"
        : examPhase === "midterm"
        ? "Midterms"
        : examPhase === "finals"
        ? "Finals"
        : "Explore",
    [isMid, isFin, examPhase]
  );

 
  const safeProfile: UserProfile = {
    modules: profile?.modules ?? [],
    major: profile?.major, // optional
  };

  const modulesLabel = useMemo(() => {
    const mods = safeProfile.modules.filter(Boolean);
    if (!mods.length) return "Modules";
    const maxShow = 2;
    if (mods.length <= maxShow) return mods.join(" / ");
    const shown = mods.slice(0, maxShow).join(" / ");
    return `${shown} +${mods.length - maxShow}`;
  }, [safeProfile.modules]);

  const phaseQuery = buildQuery(
    safeProfile.modules.length ? safeProfile.modules : ["IS", "CS"],
    examPhase
  );

  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.25, margin: "0px 0px -10% 0px" });
  const prefersReducedMotion = useReducedMotion();
  const [showSkeletons, setShowSkeletons] = useState(true);

  useEffect(() => {
    if (!inView) return;
    const t = setTimeout(() => setShowSkeletons(false), prefersReducedMotion ? 100 : 250);
    return () => clearTimeout(t);
  }, [inView, prefersReducedMotion]);

  const containerVariants = useMemo<Variants>(() => {
    if (prefersReducedMotion) {
      return { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.4 } } };
    }
    return {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: { when: "beforeChildren", staggerChildren: 0.2, duration: 0.1, ease: [0.16, 1, 0.3, 1] },
      },
    };
  }, [prefersReducedMotion]);

  const itemVariants = useMemo<Variants>(() => {
    if (prefersReducedMotion) {
      return { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.35 } } };
    }
    return {
      hidden: { y: 28, opacity: 0 },
      visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 65, damping: 20, mass: 0.7 } },
    };
  }, [prefersReducedMotion]);

  return (
    <motion.div
      ref={ref}
      className="space-y-12 py-8 transform-gpu will-change-transform"
      variants={containerVariants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
    >
      {isLoggedIn ? (
        <>
          <motion.div variants={itemVariants}>
            {showSkeletons ? (
              <RowSkeleton
                title={`For Your ${modulesLabel} — ${examLabel}`}
                subtitle={
                  safeProfile.modules.length
                    ? `Curated across ${safeProfile.modules.join(", ")}`
                    : "Personalized recommendations based on your profile"
                }
                skeletonCount={8}
              />
            ) : (
              <RecommendationRow
                profile={safeProfile}
                title={`For Your ${modulesLabel} — ${examLabel}`}
                subtitle={
                  safeProfile.modules.length
                    ? `Curated across ${safeProfile.modules.join(", ")}`
                    : "Personalized recommendations based on your profile"
                }
                limit={8}
                queryOverride={phaseQuery}
                calendar={calendar}
              />
            )}
          </motion.div>

          {/* Row 2: Popular in user's major (only if provided) */}
          {safeProfile.major ? (
            <motion.div variants={itemVariants}>
              {showSkeletons ? (
                <RowSkeleton
                  title={`Popular in ${safeProfile.major}`}
                  subtitle="Top-rated notes from your major"
                  skeletonCount={6}
                />
              ) : (
                <RecommendationRow
                  profile={{ ...safeProfile, modules: [safeProfile.major] }}
                  title={`Popular in ${safeProfile.major}`}
                  subtitle="Top-rated notes from your major"
                  limit={6}
                  calendar={calendar}
                />
              )}
            </motion.div>
          ) : null}

          <motion.div variants={itemVariants}>
            {showSkeletons ? (
              <RowSkeleton
                title="Trending in Your Modules"
                subtitle="What students are viewing right now"
                skeletonCount={6}
              />
            ) : (
              <RecommendationRow
                profile={safeProfile}
                title="Trending in Your Modules"
                subtitle="What students are viewing right now"
                limit={6}
                calendar={calendar}
              />
            )}
          </motion.div>
        </>
      ) : (
        <>
          <motion.div variants={itemVariants}>
            {showSkeletons ? (
              <RowSkeleton
                title={`${examLabel} Essentials`}
                subtitle="Sign in to get personalized recommendations for your modules"
                skeletonCount={8}
              />
            ) : (
              <RecommendationRow
                profile={{ modules: ["IS", "CS"] }}
                title={`${examLabel} Essentials`}
                subtitle="Sign in to get personalized recommendations for your modules"
                limit={8}
                queryOverride={phaseQuery}
                calendar={calendar}
              />
            )}
          </motion.div>

          <motion.div variants={itemVariants}>
            {showSkeletons ? (
              <RowSkeleton
                title="Top Rated Notes"
                subtitle="Highest-rated materials from our community"
                skeletonCount={6}
              />
            ) : (
              <RecommendationRow
                profile={{ modules: ["Top Rated", "Best Sellers"] }}
                title="Top Rated Notes"
                subtitle="Highest-rated materials from our community"
                limit={6}
                calendar={calendar}
              />
            )}
          </motion.div>
        </>
      )}
    </motion.div>
  );
}
