"use client";

import { Skeleton } from "@/components/ui/skeleton";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import ListingCard from "@/components/explore/ListingCard";
import type { SearchNotesItem } from "@/types/requests/notes";
import { ChevronLeft, ChevronRight } from "lucide-react";

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
  if (loading) {
    return (
      <section className="space-y-4 px-12" aria-busy="true" aria-live="polite">
        <div className="space-y-1">
          <h3 className="text-2xl font-bold">{title}</h3>
          {subtitle && (
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          )}
        </div>
        <div className="flex gap-4 overflow-hidden">
          {Array.from({ length: skeletonCount }).map((_, i) => (
            <Skeleton key={i} className="h-60 min-w-[260px] rounded-xl" />
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <div className="px-12">
        <p className="text-sm text-red-600 bg-red-50 dark:bg-red-950/20 p-4 rounded-lg border border-red-200 dark:border-red-900">
          Couldn't load listings: {error}
        </p>
      </div>
    );
  }

  if (!items?.length) return null;

  return (
    <section className="space-y-4 relative" aria-label={title}>
      <div className="px-12 space-y-1">
        <h3 className="text-2xl font-bold">{title}</h3>
        {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
      </div>

      <div className="relative px-12">
        <Carousel
          opts={{
            align: items.length <= 3 ? "center" : "start",
            slidesToScroll: 1,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-4 mx-2">
            {items.map((item) => (
              <CarouselItem
  key={item.id}
  className="
    pl-4 pr-4
    basis-[300px]
    sm:basis-[340px]
    md:basis-[380px]
    lg:basis-[420px]
    xl:basis-[460px]
  "
>
  <ListingCard data={item} />
  
</CarouselItem>


            ))}
          </CarouselContent>

          {items.length > 1 && (
            <>
              <CarouselPrevious className="absolute -left-6 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full border-2 border-border bg-background hover:bg-foreground hover:text-background hover:border-foreground transition-all">
                <ChevronLeft className="h-5 w-5" />
              </CarouselPrevious>
              <CarouselNext className="absolute -right-6 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full border-2 border-border bg-background hover:bg-foreground hover:text-background hover:border-foreground transition-all">
                <ChevronRight className="h-5 w-5" />
              </CarouselNext>
            </>
          )}
        </Carousel>
      </div>
    </section>
  );
}
