import { useFlow } from "./FlowContext";

export default function Toolbar() {
  const { compact, setCompact, search, setSearch } = useFlow();

  return (
    <div className="mx-auto max-w-7xl px-5 xl:px-0 mt-4 fade-in">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 pl-2 sm:pl-3">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search module code or name…"
            className="w-full sm:w-80 rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <div className="inline-flex rounded-lg border bg-background p-1 shadow-sm mx-auto sm:mx-0">
          <button
            aria-pressed={compact}
            onClick={() => setCompact(true)}
            className={`px-3 py-1.5 text-sm rounded-md transition ${
              compact
                ? "bg-neutral-100 text-foreground border border-neutral-200 dark:bg-neutral-800/60 dark:border-neutral-700"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Compact
          </button>
          <button
            aria-pressed={!compact}
            onClick={() => setCompact(false)}
            className={`px-3 py-1.5 text-sm rounded-md transition ${
              !compact
                ? "bg-neutral-100 text-foreground border border-neutral-200 dark:bg-neutral-800/60 dark:border-neutral-700"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Detailed
          </button>
        </div>
      </div>
    </div>
  );
}