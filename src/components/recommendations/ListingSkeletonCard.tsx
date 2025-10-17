
"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function ListingSkeletonCard() {
  return (
    <div className="rounded-xl border p-3 h-60 flex flex-col gap-3 bg-white">
      <Skeleton className="h-32 w-full rounded-lg" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
      <div className="mt-auto flex items-center gap-2">
        <Skeleton className="h-6 w-16" />
        <Skeleton className="h-6 w-20" />
      </div>
    </div>
  );
}
