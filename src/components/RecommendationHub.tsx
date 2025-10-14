// components/recommendations/RecommendationsHub.tsx
"use client";

import { motion, useInView, useReducedMotion, type Variants } from "framer-motion";
import { useMemo, useRef } from "react";

import { RecommendationRow } from "./RecommendationRow";
import { type UserProfile } from "@/utils/userProfile";
import {
  getPhaseIntent,
  getTermPhase,
  type CalendarConfig,
  type TermPhase,
} from "@/lib/calendar";

function buildQuery(mods: string[], phase: TermPhase) {
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

export default function RecommendationsHub({
  isLoggedIn,
  profile,
  calendar,
}: {
  isLoggedIn: boolean;
  profile?: UserProfile;
  calendar: CalendarConfig;
}) {
  // ---- term/intent logic (unchanged) ----
  const now = new Date();
  const intent = getPhaseIntent(now, calendar);
  const isMid = intent === "pre-midterm" || intent === "midterm";
  const isFin = intent === "pre-finals" || intent === "finals";

  const examPhase: TermPhase = isMid
    ? "midterm"
    : isFin
      ? "finals"
      : getTermPhase(now, calendar);

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

  const safeProfile: UserProfile = profile ?? { modules: [] };
  const phaseQuery = buildQuery(
    safeProfile.modules.length ? safeProfile.modules : ["IS", "CS"],
    examPhase
  );

  // ---- animation setup ----
  const ref = useRef<HTMLDivElement>(null);
  // Start a little earlier as it approaches viewport
  const inView = useInView(ref, { once: true, amount: 0.25, margin: "0px 0px -10% 0px" });
  const prefersReducedMotion = useReducedMotion();

  // Use Variants with identical keys in all branches to keep TS happy
  const containerVariants = useMemo<Variants>(() => {
    if (prefersReducedMotion) {
      return {
        hidden: { opacity: 0, y: 0 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
      };
    }
    return {
      hidden: { opacity: 0, y: 0 },
      visible: {
        opacity: 1,
        y: 0,
        transition: {
          when: "beforeChildren",
          delayChildren: 0.18,      // slower start of cascade
          staggerChildren: 0.24,    // slower stagger
          duration: 0.6,
          ease: [0.16, 1, 0.3, 1],  // smooth ease-out
        },
      },
    };
  }, [prefersReducedMotion]);

  const itemVariants = useMemo<Variants>(() => {
    if (prefersReducedMotion) {
      return {
        hidden: { opacity: 0, y: 0 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
      };
    }
    return {
      hidden: { y: 28, opacity: 0 },
      visible: {
        y: 0,
        opacity: 1,
        transition: {
          type: "spring",
          stiffness: 65,
          damping: 20,
          mass: 0.7,
          opacity: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
        },
      },
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
            <RecommendationRow
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
          </motion.div>

          <motion.div variants={itemVariants}>
            <RecommendationRow
              profile={{ ...safeProfile, modules: [safeProfile.major ?? "Information Systems"] }}
              title={`Popular in ${safeProfile.major ?? "Information Systems"}`}
              subtitle="Top-rated notes from your major"
              limit={6}
              calendar={calendar}
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <RecommendationRow
              profile={safeProfile}
              title="Trending in Your Modules"
              subtitle="What students are viewing right now"
              limit={6}
              calendar={calendar}
            />
          </motion.div>
        </>
      ) : (
        <>
          <motion.div variants={itemVariants}>
            <RecommendationRow
              profile={{ modules: ["IS", "CS"] }}
              title={`${examLabel} Essentials`}
              subtitle="Sign in to get personalized recommendations for your modules"
              limit={8}
              queryOverride={phaseQuery}
              calendar={calendar}
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <RecommendationRow
              profile={{ modules: ["Top Rated", "Best Sellers"] }}
              title="Top Rated Notes"
              subtitle="Highest-rated materials from our community"
              limit={6}
              calendar={calendar}
            />
          </motion.div>
        </>
      )}
    </motion.div>
  );
}
