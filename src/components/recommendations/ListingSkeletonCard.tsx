"use client";

import { Skeleton } from "@/components/ui/skeleton";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils"; // optional if you want className merging

type ListingSkeletonCardProps = {
  message?: ReactNode | null;
  className?: string;
};

export default function ListingSkeletonCard({
  message = null,
  className,
}: ListingSkeletonCardProps) {
  return (
    <div className={cn("rounded-xl border p-3 h-60 flex flex-col gap-3 bg-white", className)}>
      <Skeleton className="h-32 w-full rounded-lg"/>
      
      <div className="space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>

      {message ? (
        <div className="text-sm text-muted-foreground">{message}</div>
      ) : null}

      <div className="mt-auto flex items-center gap-2">
        <Skeleton className="h-6 w-16" />
        <Skeleton className="h-6 w-20" />
      </div>
    </div>
  );
}
