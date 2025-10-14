"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function RowSkeleton({
  title,
  subtitle,
  skeletonCount = 6,
}: {
  title: string;
  subtitle?: string;
  skeletonCount?: number;
}) {
  const slides = Array.from({ length: skeletonCount });

  return (
    <section className="space-y-4 relative">
      <div className="md:px-12 space-y-1">
        <h3 className="text-2xl font-bold">
          <Skeleton className="h-7 w-64" />
        </h3>
        {subtitle ? (
          <Skeleton className="h-4 w-72" />
        ) : (
          <Skeleton className="h-4 w-56" />
        )}
      </div>

      <div className="relative md:px-12">
        <Carousel
          opts={{ align: skeletonCount <= 3 ? "center" : "start", slidesToScroll: 1 }}
          className="w-full"
        >
          <CarouselContent>
            {slides.map((_, i) => (
              <CarouselItem
                key={i}
                className="
                  pl-4 pr-4
                  basis-full
                  sm:basis-[340px]
                  md:basis-[380px]
                  lg:basis-[420px]
                  xl:basis-[460px]
                "
              >
                <div className="rounded-xl border p-3 h-60 flex flex-col gap-3">
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
              </CarouselItem>
            ))}
          </CarouselContent>

          {skeletonCount > 1 && (
            <>
              <CarouselPrevious className="absolute -left-6 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full border-2 border-border bg-background">
                <ChevronLeft className="h-5 w-5" />
              </CarouselPrevious>
              <CarouselNext className="absolute -right-6 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full border-2 border-border bg-background">
                <ChevronRight className="h-5 w-5" />
              </CarouselNext>
            </>
          )}
        </Carousel>
      </div>
    </section>
  );
}
