import { categoryStyles } from "@/assets/modules";
import type { Category } from "@/types/types";

export default function Legend() {
  const items: { label: Category; cls: string }[] = [
    { label: "Core", cls: categoryStyles.Core },
    { label: "Major", cls: categoryStyles.Major },
    { label: "Math", cls: categoryStyles.Math },
    { label: "Elective", cls: categoryStyles.Elective },
    { label: "GE", cls: categoryStyles.GE },
  ];

  return (
    <div className="mx-auto max-w-7xl px-5 xl:px-0 mt-6 fade-in">
      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-xs text-muted-foreground">Legend:</span>
        {items.map((i) => (
          <span
            key={i.label}
            className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] shadow-sm ${i.cls}`}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-current/70" />
            {i.label}
          </span>
        ))}
      </div>
    </div>
  );
}