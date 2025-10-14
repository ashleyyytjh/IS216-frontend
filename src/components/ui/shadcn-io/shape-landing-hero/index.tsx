"use client";

import { motion } from "framer-motion";
import { Circle } from "lucide-react";
import { cn } from "@/lib/utils";

type ElegantShapeProps = {
  className?: string;
  delay?: number;
  width?: number;
  height?: number;
  rotate?: number;
  /** Cover tint for book/notebook; use neutral by default for a B/W palette */
  gradient?: string; // e.g. "from-neutral-200"
  variant?: "notebook" | "book" | "paper" | "pill";
  ruled?: boolean;    // also applies to paper
  bookmark?: boolean; // book only
  rings?: number;     // notebook only
};

function ElegantShape({
  className,
  delay = 0,
  width = 420,
  height = 220,
  rotate = 0,
  gradient = "from-neutral-200",
  variant = "paper",
  ruled = true,
  bookmark = true,
  rings = 6,
}: ElegantShapeProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -150, rotate: rotate - 15 }}
      animate={{ opacity: 1, y: 0, rotate }}
      transition={{
        duration: 2.4,
        delay,
        ease: [0.23, 0.86, 0.39, 0.96],
        opacity: { duration: 1.2 },
      }}
      className={cn("absolute", className)}
    >
      <motion.div
        animate={{ y: [0, 15, 0] }}
        transition={{ duration: 12, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        style={{ width, height }}
        className="relative"
      >
        {/* --- Pill (kept, but tuned for light UI; low emphasis) --- */}
        {variant === "pill" && (
          <div
            className={cn(
              "absolute inset-0 rounded-full",
              "bg-gradient-to-r to-transparent",
              gradient, // neutral tint
              "border border-neutral-200",
              "shadow-[0_8px_28px_-8px_rgba(0,0,0,0.18)]"
            )}
          />
        )}

        {/* --- Paper (light UI) --- */}
        {variant === "paper" && (
          <>
            {/* base sheet */}
            <div
              className={cn(
                "absolute inset-0 rounded-xl",
                "bg-white",
                "border border-neutral-200",
                "shadow-[0_20px_40px_-16px_rgba(0,0,0,0.18),0_2px_0_rgba(0,0,0,0.04)]"
              )}
            />
            {/* subtle paper grain (monochrome) */}
            <div
              className="absolute inset-0 rounded-xl opacity-60 pointer-events-none"
              style={{
                background:
                  "radial-gradient(120% 80% at 20% 0%, rgba(0,0,0,0.03), transparent 55%), repeating-linear-gradient(180deg, rgba(0,0,0,0.02), rgba(0,0,0,0.02) 1px, transparent 1px, transparent 3px)",
              }}
            />
            {/* ruled/grid lines (optional) */}
            {ruled && (
              <div
                className="absolute inset-[14px] rounded-lg opacity-80 pointer-events-none"
                style={{
                  background:
                    "repeating-linear-gradient(0deg, rgba(0,0,0,0.06), rgba(0,0,0,0.06) 1px, transparent 1px, transparent 20px), repeating-linear-gradient(90deg, rgba(0,0,0,0.04), rgba(0,0,0,0.04) 1px, transparent 1px, transparent 20px)",
                }}
              />
            )}
            {/* dog-ear fold */}
            <div className="absolute top-2 right-2 w-7 h-7 overflow-hidden rounded-tr-xl">
              <div className="absolute right-0 top-0 w-7 h-7 bg-neutral-100 rotate-45 origin-top-right translate-x-3 -translate-y-3 border border-neutral-200" />
              <div className="absolute right-0 top-0 w-px h-7 bg-neutral-200" />
              <div className="absolute right-0 top-0 h-px w-7 bg-neutral-200" />
            </div>
          </>
        )}

        {/* --- Notebook (light UI) --- */}
        {variant === "notebook" && (
          <>
            {/* cover */}
            <div
              className={cn(
                "absolute inset-0 rounded-2xl",
                "bg-gradient-to-br to-transparent",
                gradient, // neutral cover
                "border border-neutral-200",
                "shadow-[0_24px_56px_-18px_rgba(0,0,0,0.2)]"
              )}
            />
            {/* spine */}
            <div className="absolute left-0 top-0 h-full w-6 rounded-l-2xl overflow-hidden">
              <div className="h-full w-full bg-[linear-gradient(180deg,rgba(0,0,0,0.04),transparent_40%,rgba(0,0,0,0.04))]" />
              <div className="absolute right-0 top-0 h-full w-px bg-neutral-300" />
            </div>
            {/* page edge */}
            <div className="absolute right-1 top-2 bottom-2 w-3 rounded-sm overflow-hidden">
              <div
                className="h-full w-full opacity-80"
                style={{
                  background:
                    "repeating-linear-gradient(180deg, rgba(0,0,0,0.18), rgba(0,0,0,0.18) 1px, rgba(0,0,0,0.06) 1px, rgba(0,0,0,0.06) 3px)",
                }}
              />
              <div className="absolute left-0 top-0 h-full w-px bg-neutral-300" />
            </div>
            {/* rings */}
            <div className="absolute left-2 top-4 bottom-4 w-6 flex flex-col justify-between">
              {Array.from({ length: rings }).map((_, i) => (
                <div key={i} className="relative h-0">
                  <div className="absolute -translate-y-1/2 top-1/2 left-1 h-4 w-4 rounded-full bg-neutral-50 border border-neutral-300 shadow-[inset_0_1px_2px_rgba(0,0,0,0.15),0_2px_6px_rgba(0,0,0,0.15)]" />
                  <div className="absolute -translate-y-1/2 top-1/2 left-0 h-4 w-1 bg-neutral-300/70 rounded" />
                </div>
              ))}
            </div>
            {/* inner page */}
            <div className="absolute inset-[16px] rounded-xl overflow-hidden bg-white border border-neutral-200">
              {ruled && (
                <div
                  className="absolute inset-0 opacity-80 pointer-events-none"
                  style={{
                    background:
                      "repeating-linear-gradient(180deg, transparent, transparent 22px, rgba(0,0,0,0.06) 23px)",
                  }}
                />
              )}
              {/* margin line */}
              <div className="absolute left-16 top-0 h-full w-px bg-neutral-300" />
            </div>
          </>
        )}

        {/* --- Book (light UI) --- */}
        {variant === "book" && (
          <>
            {/* cover */}
            <div
              className={cn(
                "absolute inset-0 rounded-2xl",
                "bg-gradient-to-br to-transparent",
                gradient,
                "border border-neutral-200",
                "shadow-[0_24px_56px_-18px_rgba(0,0,0,0.2)]"
              )}
            />
            {/* spine */}
            <div className="absolute left-0 top-0 h-full w-8 rounded-l-2xl overflow-hidden">
              <div className="h-full w-full bg-[linear-gradient(180deg,rgba(0,0,0,0.04),transparent_40%,rgba(0,0,0,0.04))]" />
              <div className="absolute right-0 top-0 h-full w-px bg-neutral-300" />
            </div>
            {/* page edge */}
            <div className="absolute right-1 top-2 bottom-2 w-3 rounded-sm overflow-hidden">
              <div
                className="h-full w-full opacity-80"
                style={{
                  background:
                    "repeating-linear-gradient(180deg, rgba(0,0,0,0.18), rgba(0,0,0,0.18) 1px, rgba(0,0,0,0.06) 1px, rgba(0,0,0,0.06) 3px)",
                }}
              />
              <div className="absolute left-0 top-0 h-full w-px bg-neutral-300" />
            </div>
            {/* ribbon (kept but neutral) */}
            {bookmark && (
              <div className="absolute top-6 right-10 w-3 h-14 bg-neutral-800 rounded-b-[2px] shadow-[0_6px_14px_rgba(0,0,0,0.25)]">
                <div className="absolute bottom-[-6px] left-0 w-3 h-3 bg-neutral-800 rotate-45 origin-top-left" />
              </div>
            )}
            {/* inner page */}
            <div className="absolute inset-[16px] rounded-xl overflow-hidden bg-white border border-neutral-200">
              {ruled && (
                <div
                  className="absolute inset-0 opacity-80 pointer-events-none"
                  style={{
                    background:
                      "repeating-linear-gradient(180deg, transparent, transparent 22px, rgba(0,0,0,0.06) 23px)",
                  }}
                />
              )}
            </div>
          </>
        )}
      </motion.div>
    </motion.div>
  );
}

type HeroGeometricProps = {
  badge?: string;
  title1?: string;
  title2?: string;
  description?: string;
  className?: string;
};

export function HeroGeometric({
  badge = "yourstudio.dev",
  title1 = "Elevate Your Digital Vision",
  title2 = "Crafting Exceptional Websites",
  description = "Thoughtful design, crisp engineering, and interfaces that feel effortless.",
  className,
}: HeroGeometricProps) {
  const fadeUpVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 1,
        delay: 0.5 + i * 0.2,
        ease: [0.25, 0.4, 0.25, 1] as const,
      },
    }),
  };

  return (
    <div
      className={cn(
        "relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-white",
        className
      )}
    >
      {/* background: ultra subtle grid to give depth on white */}
      <div
        className="absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black,transparent_85%)]"
        style={{
          background:
            "repeating-linear-gradient(0deg, transparent, transparent 19px, rgba(0,0,0,0.03) 20px), repeating-linear-gradient(90deg, transparent, transparent 19px, rgba(0,0,0,0.03) 20px)",
        }}
      />

      <div className="absolute inset-0 overflow-hidden">
        {/* Notebook */}
        <ElegantShape
          variant="notebook"
          rings={7}
          ruled
          bookmark={false}
          delay={0.3}
          width={600}
          height={340}
          rotate={10}
          gradient="from-neutral-200"
          className="left-[-10%] md:left-[-5%] top-[10%] md:top-[16%]"
        />

        {/* Hardcover book */}
        <ElegantShape
          variant="book"
          ruled
          bookmark
          delay={0.5}
          width={520}
          height={300}
          rotate={-12}
          gradient="from-neutral-300"
          className="right-[-6%] md:right-[0%] top-[64%] md:top-[70%]"
        />

        {/* Papers */}
        <ElegantShape
          variant="paper"
          ruled
          delay={0.4}
          width={320}
          height={200}
          rotate={-6}
          className="left-[5%] md:left-[10%] bottom-[5%] md:bottom-[10%]"
        />
        <ElegantShape
          variant="paper"
          ruled={false}
          delay={0.6}
          width={260}
          height={170}
          rotate={18}
          className="right-[15%] md:right-[20%] top-[10%] md:top-[15%]"
        />
        <ElegantShape
          variant="paper"
          ruled
          delay={0.7}
          width={220}
          height={150}
          rotate={-22}
          className="left-[20%] md:left-[25%] top-[5%] md:top-[10%]"
        />
      </div>

      <div className="relative z-10 container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            custom={0}
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-50 border border-neutral-200 mb-8 md:mb-12"
          >
            <Circle className="h-2 w-2 fill-neutral-900" />
            <span className="text-sm text-neutral-600 tracking-wide">
              {badge}
            </span>
          </motion.div>

          <motion.div custom={1} variants={fadeUpVariants} initial="hidden" animate="visible">
            <h1 className="text-4xl sm:text-6xl md:text-8xl font-bold mb-6 md:mb-8 tracking-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-b from-neutral-900 to-neutral-700">
                {title1}
              </span>
              <br />
              {/* monochrome “transition” gradient—still only black/white family */}
             
            </h1>
          </motion.div>

          <motion.div custom={2} variants={fadeUpVariants} initial="hidden" animate="visible">
            <p className="text-base sm:text-lg md:text-xl text-neutral-600 mb-8 leading-relaxed font-light tracking-wide max-w-xl mx-auto px-4">
              {description}
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export type { HeroGeometricProps, ElegantShapeProps };
