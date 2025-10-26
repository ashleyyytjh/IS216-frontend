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

const EMPTY_MODULES: string[] = [];

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

  const stableModules = useMemo(
    () => (profile?.modules ? profile.modules : EMPTY_MODULES),
    [profile?.modules]
  );

  const safeProfile: UserProfile = useMemo(
    () => ({
      modules: stableModules,
      major: profile?.major,
    }),
    [stableModules, profile?.major]
  );

  const phaseQuery = useMemo(
    () =>
      buildQuery(
        safeProfile.modules.length ? safeProfile.modules : ["IS", "CS"],
        examPhase,
        safeProfile.major
      ),
    [safeProfile.modules, examPhase, safeProfile.major]
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
                title={`For Your Modules — ${examLabel}`}
                subtitle="Personalized recommendations based on your profile"
                skeletonCount={8}
              />
            ) : (
              <RecommendationRow
                profile={safeProfile}
                limit={8}
                queryOverride={phaseQuery}
                calendar={calendar}
              />
            )}
          </motion.div>

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
                  profile={{ ...safeProfile, modules: safeProfile.major ? [safeProfile.major] : [] }}
                  title={`Popular in ${safeProfile.major}`}
                  subtitle="Top-rated notes from your major"
                  limit={6}
                  calendar={calendar}
                  strictMajor
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
                strictModules
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
                profile={{ modules: [], major: undefined }}
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
                title="Recently Listed Notes"
                subtitle="Sign in to get personalized recommendations for your modules"
                skeletonCount={8}
              />
            ) : (
              <RecommendationRow
                profile={{ modules: [], major: undefined }}
                title="Recently Listed Notes"
                subtitle="Recent notes uploaded by the greatest"
                limit={8}
                queryOverride=""
                calendar={calendar}
                mode="recent"
              />
            )}
          </motion.div>
        </>
      )}
    </motion.div>
  );
}
