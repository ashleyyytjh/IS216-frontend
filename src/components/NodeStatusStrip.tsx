// components/NodeStatusStrip.tsx
import { cn } from "@/lib/utils";

type Status = "todo" | "active" | "done" | "error";

export type NodeStep = {
  id: string;
  label: string;
  status: Status;
};

type Props = {
  steps: NodeStep[];
  compact?: boolean; // smaller labels
};

function dotClass(s: Status) {
  switch (s) {
    case "done":
      return "bg-emerald-500 ring-emerald-200";
    case "active":
      return "bg-amber-500 ring-amber-200 animate-pulse";
    case "error":
      return "bg-red-500 ring-red-200";
    default:
      return "bg-slate-300 ring-slate-200";
  }
}

export default function NodeStatusStrip({ steps, compact }: Props) {
  return (
    <div className="flex items-center gap-4 overflow-x-auto py-2">
      {steps.map((step, i) => {
        const isLast = i === steps.length - 1;
        return (
          <div key={step.id} className="flex items-center gap-3 min-w-[160px]">
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "h-3.5 w-3.5 rounded-full ring-4",
                  dotClass(step.status)
                )}
                aria-hidden="true"
              />
              <span
                className={cn(
                  "text-sm",
                  compact ? "font-medium" : "font-semibold"
                )}
              >
                {step.label}
              </span>
            </div>

            {!isLast && (
              <div
                className={cn(
                  "h-px w-16 sm:w-24",
                  step.status === "done" ? "bg-emerald-500" : "bg-slate-200"
                )}
                aria-hidden="true"
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
