// components/ListingCarousel.tsx
"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import ListingCard from "@/components/explore/ListingCard";
import ListingSkeletonCard from "@/components/explore/ListingSkeletonCard";
import type { SearchNotesItem } from "@/types/requests/notes";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ListingCarousel({
  title,
  subtitle,
  items,
  loading = false,
  error = null,
  skeletonCount = 6,
}: {
  title: string;
  subtitle?: string;
  items: SearchNotesItem[];
  loading?: boolean;
  error?: string | null;
  skeletonCount?: number;
}) {
  if (error) {
    return (
      <div className="px-12">
        <p className="text-sm text-red-600 bg-red-50 dark:bg-red-950/20 p-4 rounded-lg border border-red-200 dark:border-red-900">
          Couldn't load listings: {error}
        </p>
      </div>
    );
  }

  // While loading, we fill with skeleton items so layout/controls stay stable.
  const slideData: (SearchNotesItem | "skeleton")[] =
    loading
      ? Array.from({ length: skeletonCount }, () => "skeleton")
      : items ?? [];

  if (!loading && !slideData.length) return null;

  return (
    <section
      className="space-y-4 relative"
      aria-label={title}
      aria-busy={loading || undefined}
      aria-live="polite"
    >
      <div className="md:px-12 space-y-1">
        <h3 className="text-2xl font-bold">{title}</h3>
        {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
      </div>

      <div className="relative md:px-12">
        <Carousel
          opts={{
            align: slideData.length <= 3 ? "center" : "start",
            slidesToScroll: 1,
          }}
          className={cn("w-full transition-opacity", loading && "opacity-90")}
        >
          <CarouselContent>
            {slideData.map((item, idx) => (
              <CarouselItem
                key={item === "skeleton" ? `sk-${idx}` : (item as SearchNotesItem).id}
                className="
                  pl-4 pr-4
                  basis-full
                  sm:basis-[340px]
                  md:basis-[380px]
                  lg:basis-[420px]
                  xl:basis-[460px]
                  will-change-transform
                "
              >
                {item === "skeleton" ? (
                  <ListingSkeletonCard />
                ) : (
                  <ListingCard data={item as SearchNotesItem} />
                )}
              </CarouselItem>
            ))}
          </CarouselContent>

          {slideData.length > 1 && (
            <>
              <CarouselPrevious
                className="absolute -left-6 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full border-2 border-border bg-background hover:bg-foreground hover:text-background hover:border-foreground transition-all disabled:opacity-50"
                disabled={loading}
                aria-disabled={loading}
              >
                <ChevronLeft className="h-5 w-5" />
              </CarouselPrevious>
              <CarouselNext
                className="absolute -right-6 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full border-2 border-border bg-background hover:bg-foreground hover:text-background hover:border-foreground transition-all disabled:opacity-50"
                disabled={loading}
                aria-disabled={loading}
              >
                <ChevronRight className="h-5 w-5" />
              </CarouselNext>
            </>
          )}
        </Carousel>
      </div>
    </section>
  );
}
