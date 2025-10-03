import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * A tiny status-dot that mimics React Flow's NodeStatusIndicator:
 * - running  => spinning ring
 * - success  => solid green
 * - error    => solid red
 * - idle     => gray outline
 *
 * Props let you tweak size/colors to "change the styling".
 */
type Status = "idle" | "running" | "success" | "error";
type Size = "sm" | "md" | "lg";

const sizeMap: Record<Size, string> = {
  sm: "h-4 w-4 border-[2px]",
  md: "h-5 w-5 border-[2.5px]",
  lg: "h-6 w-6 border-[3px]",
};

export function StatusIndicator({
  status = "idle",
  size = "md",
  className,
  color = {
    running: "#f59e0b", // amber-500
    success: "#16a34a", // green-600
    error: "#dc2626",   // red-600
    idle: "#cbd5e1",    // slate-300
  },
}: {
  status?: Status;
  size?: Size;
  className?: string;
  color?: {
    running: string;
    success: string;
    error: string;
    idle: string;
  };
}) {
  const base = cn(
    "relative inline-flex items-center justify-center rounded-full border-2",
    sizeMap[size],
    className
  );

  if (status === "success") {
    return <span className={base} style={{ borderColor: color.success, background: color.success }} />;
  }
  if (status === "error") {
    return <span className={base} style={{ borderColor: color.error, background: color.error }} />;
  }
  if (status === "running") {
    // spinning ring (top border transparent for loader effect)
    return (
      <span
        className={cn(base, "animate-spin")}
        style={{
          borderColor: color.running,
          borderTopColor: "transparent",
        }}
      />
    );
  }
  // idle
  return <span className={base} style={{ borderColor: color.idle, background: "transparent" }} />;
}
