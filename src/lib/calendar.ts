// lib/reco/calendar.ts

export type TermPhase = "explore" | "midterm" | "project" | "finals";
export type PhaseIntent =
  | "explore" | "pre-midterm" | "midterm" | "project" | "pre-finals" | "finals";

export type CalendarConfig = {
  week1Monday: Date;
  midtermWeeks?: number | [number, number] | number[];
  finalsWeeks?: number | [number, number] | number[];
};

const DEFAULT_PRE_MIDTERM_DAYS = 21;
const DEFAULT_PRE_FINALS_DAYS = 21;

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
    if (!nums.length) return null;
    return [Math.min(...nums), Math.max(...nums)];
  }
  return null;
}

function weekRange(cfg: CalendarConfig, pair: [number, number]) {
  const [wStart, wEnd] = pair;
  const start = new Date(cfg.week1Monday);
  start.setDate(start.getDate() + (wStart - 1) * 7);
  const end = new Date(cfg.week1Monday);
  end.setDate(end.getDate() + (wEnd - 1) * 7 + 6);
  return { start, end };
}

function daysBetween(a: Date, b: Date) {
  const A = new Date(a), B = new Date(b);
  A.setHours(0, 0, 0, 0); B.setHours(0, 0, 0, 0);
  return Math.round((B.getTime() - A.getTime()) / 86400000);
}

export function getTermPhase(now: Date, cfg: CalendarConfig): TermPhase {
  const mid = normalizeWeeks(cfg.midtermWeeks);
  const fin = normalizeWeeks(cfg.finalsWeeks);
  const w = weekIndexFrom(now, cfg.week1Monday);
  if (fin && w >= fin[0] && w <= fin[1]) return "finals";
  if (mid && w >= mid[0] && w <= mid[1]) return "midterm";
  if (mid && fin && w > mid[1] && w < fin[0]) return "project";
  return "explore";
}

export function getPhaseIntent(
  now: Date,
  cfg: CalendarConfig,
  preMidtermDays = DEFAULT_PRE_MIDTERM_DAYS,
  preFinalsDays = DEFAULT_PRE_FINALS_DAYS
): PhaseIntent {
  const mid = normalizeWeeks(cfg.midtermWeeks);
  const fin = normalizeWeeks(cfg.finalsWeeks);

  if (mid) {
    const { start: midS, end: midE } = weekRange(cfg, mid);
    if (now >= midS && now <= midE) return "midterm";
    const d = daysBetween(now, midS);
    if (d > 0 && d <= preMidtermDays) return "pre-midterm";
  }

  if (fin) {
    const { start: finS, end: finE } = weekRange(cfg, fin);
    if (now >= finS && now <= finE) return "finals";
    const d = daysBetween(now, finS);
    if (d > 0 && d <= preFinalsDays) return "pre-finals";
  }

  const phase = getTermPhase(now, cfg);
  return phase === "project" ? "project" : "explore";
}
