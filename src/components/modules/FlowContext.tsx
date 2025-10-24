import { createContext, useContext, useMemo, useState, ReactNode } from "react";
import type { ProgramPlan, Module, Category } from "@/types/types";
import { DEGREES } from "@/assets/modules";

type FlowState = {
  compact: boolean;
  setCompact: (v: boolean) => void;
  search: string;
  setSearch: (v: string) => void;
  degreeKey: keyof typeof DEGREES;
  setDegreeKey: (k: keyof typeof DEGREES) => void;
  selectedCategories: Category[];
  toggleCategory: (c: Category) => void;
  clearCategories: () => void;
  plan: ProgramPlan;
  filteredPlan: ProgramPlan;
};

const FlowCtx = createContext<FlowState | null>(null);

function getModuleCategories(m: Module): Category[] {
  return m.categories ?? (m.category ? ([m.category] as Category[]) : []);
}

export function FlowProvider({ children }: { children: ReactNode }) {
  const [compact, setCompact] = useState(true);
  const [search, setSearch] = useState("");
  const [degreeKey, setDegreeKey] = useState<keyof typeof DEGREES>("cs");
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);

  const plan = DEGREES[degreeKey].plan;

  const filteredPlan = useMemo(() => {
    const q = search.trim().toLowerCase();
    const hasSearch = !!q;
    const hasCatFilter = selectedCategories.length > 0;
    if (!hasSearch && !hasCatFilter) return plan;
    const out: ProgramPlan = {};
    Object.entries(plan).forEach(([year, mods]) => {
      out[Number(year)] = mods.filter((m) => {
        const matchesSearch =
          !hasSearch ||
          m.code.toLowerCase().includes(q) ||
          m.name.toLowerCase().includes(q);

        const cats = getModuleCategories(m);
        const matchesCategory =
          !hasCatFilter || cats.some((c) => selectedCategories.includes(c));

        return matchesSearch && matchesCategory;
      });
    });
    return out;
  }, [plan, search, selectedCategories]);

  function toggleCategory(c: Category) {
    setSelectedCategories((prev) =>
      prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]
    );
  }

  function clearCategories() {
    setSelectedCategories([]);
  }

  const value: FlowState = {
    compact,
    setCompact,
    search,
    setSearch,
    degreeKey,
    setDegreeKey,

    selectedCategories,
    toggleCategory,
    clearCategories,

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