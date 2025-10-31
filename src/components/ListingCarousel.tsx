// components/ListingCarousel.tsx
"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import ListingCard from "@/components/recommendations/CarouselCard";
import ListingSkeletonCard from "@/components/recommendations/ListingSkeletonCard";
import type { SearchNotesItem } from "@/types/requests/notes";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { SkeletonCircle } from "./recommendations/SkeletonCircle";


export default function ListingCarousel({
  title,
  subtitle,
  items,
  loading = false,
  error = false,
  skeletonCount = 6,

  // Empty-state controls
  showWhenEmpty = false,
  emptyMessage = "No notes for now — check back soon.",
}: {
  title: string;
  subtitle?: string;
  items: SearchNotesItem[];
  loading?: boolean;
  error?: boolean;
  skeletonCount?: number;

  /** Render a placeholder carousel when not loading/error and items are empty */
  showWhenEmpty?: boolean;
  emptyMessage?: string;
}) {
  if (error) {
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
          <Carousel className={cn("w-full transition-opacity", loading && "opacity-90")}>
            <CarouselContent>
              {Array.from({ length: Math.max(3, Math.min(6, skeletonCount)) }).map((_, idx) => (
                <CarouselItem
                  key={`err-sk-${idx}`}
                  className="pl-4 pr-4 basis-full sm:basis-[340px] md:basis-[380px] lg:basis-[420px] xl:basis-[460px] will-change-transform"
                >
                  <ListingSkeletonCard />
                </CarouselItem>
              ))}
            </CarouselContent>

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
          </Carousel>
        </div>
      </section>
    );
  }

  const slideData: (SearchNotesItem | "skeleton")[] = loading
    ? Array.from({ length: skeletonCount }, () => "skeleton")
    : (items ?? []);

  const isEmpty = !loading && slideData.length === 0;

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
        {isEmpty && showWhenEmpty ? (
          
          <Carousel
            opts={{
              align: "center",
              slidesToScroll: 1,
            }}
            className={cn("w-full transition-opacity")}
          >
            <CarouselContent className="justify-center">
              {Array.from({ length: 1 }).map((_, idx) => (
                <CarouselItem
                  key={`empty-${idx}`}
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
                 <SkeletonCircle />
                </CarouselItem>
              ))}
            </CarouselContent>

            <>
              
              <CarouselPrevious
                className="absolute -left-6 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full border-2 border-border bg-background hover:bg-foreground hover:text-background hover:border-foreground transition-all"
                disabled={loading}
                aria-disabled={loading}
              >
                <ChevronLeft className="h-5 w-5" />
              </CarouselPrevious>
              <CarouselNext
                className="absolute -right-6 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full border-2 border-border bg-background hover:bg-foreground hover:text-background hover:border-foreground transition-all"
                disabled={loading}
                aria-disabled={loading}
              >
                <ChevronRight className="h-5 w-5" />
              </CarouselNext>
            </>
          </Carousel>
        ) : (
          
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
          </Carousel>
        )}
      </div>
    </section>
  );
}
