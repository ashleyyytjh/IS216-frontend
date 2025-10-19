import { createContext, useContext, useMemo, useState, ReactNode } from "react";
import type { ProgramPlan } from "@/types/types";
import { DEGREES } from "@/assets/modules";

type FlowState = {
  compact: boolean;
  setCompact: (v: boolean) => void;
  search: string;
  setSearch: (v: string) => void;
  degreeKey: keyof typeof DEGREES;
  setDegreeKey: (k: keyof typeof DEGREES) => void;
  plan: ProgramPlan;
  filteredPlan: ProgramPlan;
};

const FlowCtx = createContext<FlowState | null>(null);

export function FlowProvider({ children }: { children: ReactNode }) {
  const [compact, setCompact] = useState(true);
  const [search, setSearch] = useState("");
  const [degreeKey, setDegreeKey] = useState<keyof typeof DEGREES>("cs");

  const plan = DEGREES[degreeKey].plan;

  const filteredPlan = useMemo(() => {
    if (!search.trim()) return plan;
    const q = search.trim().toLowerCase();
    const out: ProgramPlan = {};
    Object.entries(plan).forEach(([year, mods]) => {
      out[Number(year)] = mods.filter(
        (m) => m.code.toLowerCase().includes(q) || m.name.toLowerCase().includes(q)
      );
    });
    return out;
  }, [plan, search]);

  const value: FlowState = {
    compact,
    setCompact,
    search,
    setSearch,
    degreeKey,
    setDegreeKey,
    plan,
    filteredPlan,
  };

  return <FlowCtx.Provider value={value}>{children}</FlowCtx.Provider>;
}

export function useFlow() {
  const ctx = useContext(FlowCtx);
  if (!ctx) throw new Error("useFlow must be used inside FlowProvider");
  return ctx;
}