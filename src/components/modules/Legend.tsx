import { categoryStyles } from "@/assets/modules";
import type { Category } from "@/types/types";
import { useFlow } from "./FlowContext";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";


export default function Legend() {
  const { selectedCategories, toggleCategory, clearCategories } = useFlow();

  const items: { label: Category; cls: string }[] = [
    { label: "Core", cls: categoryStyles.Core },
    { label: "Major", cls: categoryStyles.Major },
    { label: "Math", cls: categoryStyles.Math },
    { label: "Elective", cls: categoryStyles.Elective },
    { label: "GE", cls: categoryStyles.GE },
  ];

  const hasActive = selectedCategories.length > 0;

  function onKeyDown(e: React.KeyboardEvent, cat: Category) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggleCategory(cat);
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-5 xl:px-0 mt-6 fade-in">
      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-xs text-muted-foreground">Legend:</span>
        {items.map((i) => {
          const selected = selectedCategories.includes(i.label);
          return (
            <span
              key={i.label}
              role="button"
              tabIndex={0}
              aria-pressed={selected}
              onClick={() => toggleCategory(i.label)}
              onKeyDown={(e) => onKeyDown(e, i.label)}
              title={`Toggle ${i.label} filter`}
              className={`relative inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] shadow-sm cursor-pointer ${i.cls}`}
            >
              {selected && (
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 rounded-full
                             ring-inset ring-2 ring-current/60 bg-current/20"
                />
              )}
              <span className="relative z-10 inline-flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-current/70" />
                {i.label}
              </span>
            </span>
          );
        })}
        {hasActive && (
          <Badge
            variant="secondary"
            className="cursor-pointer rounded-full px-2.5 py-1 text-[11px] hover:bg-accent/40"
            onClick={clearCategories}
            title={'Clear Filters'}
          >
            <X  />
            Clear
          </Badge>
        )}
      </div>
    </div>
  );
}