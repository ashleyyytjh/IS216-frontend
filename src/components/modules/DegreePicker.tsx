import { useMemo, useState } from "react";
import { DEGREES } from "@/assets/modules";
import { useFlow } from "./FlowContext";

export default function DegreePicker() {
  const { degreeKey, setDegreeKey, setSearch } = useFlow();
  const current = DEGREES[degreeKey];

  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState("");

  const items = useMemo(
    () =>
      Object.entries(DEGREES).map(([key, v]) => ({
        key,
        name: v.name,
        haystack: [v.name, ...v.aliases].join(" ").toLowerCase(),
      })),
    []
  );

  const filtered = useMemo(() => {
    const q = filter.trim().toLowerCase();
    if (!q) return items;
    return items.filter((i) => i.haystack.includes(q));
  }, [items, filter]);

  function onPick(key: string) {
    setDegreeKey(key as keyof typeof DEGREES);
    setSearch("");
    setOpen(false);
    setFilter("");
  }

  return (
    <section className="mx-auto mt-4 w-full max-w-xs">
      <div
        tabIndex={0}
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node)) setOpen(false);
        }}
        className="relative"
      >
        <button
          onClick={() => setOpen((v) => !v)}
          className="mx-auto flex w-full items-center justify-center gap-2 rounded-full border bg-card px-4 py-2 font-medium shadow-sm hover:bg-accent/40"
        >
          <span className="text-xl sm:text-2xl">{current.name}</span>
          <svg
            className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}
            viewBox="0 0 20 20"
            fill="none"
          >
            <path d="M5 8l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>

        {open && (
          <div className="absolute left-1/2 z-20 mt-2 w-[min(16rem,90vw)] -translate-x-1/2 overflow-hidden rounded-xl border bg-card shadow-lg">
            <div className="p-2">
              <input
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                placeholder="Search degrees…"
                className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <ul className="max-h-72 overflow-auto py-1 text-center">
              {filtered.length === 0 ? (
                <li className="px-3 py-2 text-center text-xs text-muted-foreground">No matching degrees</li>
              ) : (
                filtered.map((s) => (
                  <li key={s.key}>
                    <button
                      className="w-full px-3 py-2 text-base hover:bg-accent/50 text-center"
                      onClick={() => onPick(s.key)}
                    >
                      {s.name}
                    </button>
                  </li>
                ))
              )}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}