import { useNavigate } from "react-router-dom";
import { categoryStyles } from "@/assets/modules";
import type { Module, Category } from "@/types/types";

function moduleCategories(m: Module): Category[] {
  return m.categories ?? (m.category ? [m.category] as Category[] : []);
}

export default function ModuleCard({ m, compact }: { m: Module; compact: boolean }) {
  const navigate = useNavigate();
  const cats = moduleCategories(m);

  return (
    <div
  className="group relative overflow-hidden rounded-xl border bg-card/70 backdrop-blur supports-[backdrop-filter]:bg-card/60 will-change-transform transform-gpu transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 hover:scale-[1.015] hover:shadow-xl ring-1 ring-transparent hover:ring-foreground/10"
>
      <span
        aria-hidden
        className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 -skew-x-12 translate-x-0 bg-gradient-to-r from-transparent via-foreground/10 to-transparent opacity-0 transition-all duration-500 ease-out group-hover:translate-x-[250%] group-hover:opacity-100"
      />

      <button
        onClick={() => navigate(`/explore?query=${encodeURIComponent(m.code)}`)}
        className="relative z-10 w-full text-left p-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        aria-label={`Search notes for ${m.code}`}
      >
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="font-medium text-sm">{m.code}</div>
            <div className="text-sm text-muted-foreground">{m.name}</div>
          </div>
          {!!cats.length && (
            <div className="shrink-0 flex flex-wrap gap-1">
              {cats.map((c) => (
                <span
                  key={c}
                  className={`rounded-full border px-2 py-0.5 text-[10px] ${categoryStyles[c]}`}
                >
                  {c}
                </span>
              ))}
            </div>
          )}
        </div>

        {!compact && (
          <div className="mt-3 space-y-2">
            <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              {typeof m.units === "number" && (
                <span className="rounded-md border px-2 py-0.5">Units: {m.units}</span>
              )}
              {m.sem != null && m.sem !== 0 && (
                <span className="rounded-md border px-2 py-0.5">Sem {m.sem}</span>
              )}
              {m.sem === 0 && (
                <span className="rounded-md border px-2 py-0.5">Year-long</span>
              )}
            </div>

            {m.prereqs && m.prereqs.length > 0 && (
              <div>
                <div className="text-[11px] mb-1 font-medium text-foreground/80">Prerequisites</div>
                <div className="flex flex-wrap gap-1">
                  {m.prereqs.map((p) => (
                    <span
                      key={p}
                      className="rounded-md border bg-background px-2 py-0.5 text-[11px]"
                    >
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {m.notes && (
              <div>
                <div className="text-[11px] mb-1 font-medium text-foreground/80">Notes</div>
                <p className="text-xs text-muted-foreground">{m.notes}</p>
              </div>
            )}
          </div>
        )}
      </button>
    </div>
  );
}