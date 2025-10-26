import { useMemo, useState } from "react";
import { DEGREES } from "@/assets/modules";
import { useFlow } from "./FlowContext";
import { ChevronsUpDown } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";

export default function DegreePicker() {
  const { degreeKey, setDegreeKey, setSearch } = useFlow();
  const current = DEGREES[degreeKey];

  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState("");

  const items = useMemo(
    () => Object.entries(DEGREES).map(([key, v]) => ({
      key,
      name: v.name,
      haystack: [v.name, ...(v.aliases ?? [])].join(" ").toLowerCase(),
    })),
    []
  );
  const filtered = useMemo(() => {
    const q = filter.trim().toLowerCase();
    return q ? items.filter((i) => i.haystack.includes(q)) : items;
  }, [items, filter]);

  function onPick(key: string) {
    setDegreeKey(key as keyof typeof DEGREES);
    setSearch("");
    setOpen(false);
    setFilter("");
  }

  return (
    <section className="mx-auto mt-4 w-full max-w-xs fade-in">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            className="mx-auto flex w-full items-center justify-center gap-2 rounded-full border bg-card px-4 py-2 font-medium shadow-sm hover:bg-accent/40"
          >
            <span className="text-sm truncate">{current?.name ?? "Select degree…"}</span>
            <ChevronsUpDown className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} />
          </button>
        </PopoverTrigger>

        <PopoverContent align="center" sideOffset={8} className="z-[9999] w-64 max-w-[90vw] p-0">
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
        </PopoverContent>
      </Popover>
    </section>
  );
}
