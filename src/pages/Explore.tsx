import Hero from "@/components/explore/Hero";
import FilterBar from "@/components/explore/FilterBar";
import { TypeOption } from "@/types/types";
import ListingCard from "@/components/explore/ListingCard";
import { useEffect } from "react";
import { searchNotes } from "@/services/NotesService";
import { ListingProvider, useListing } from "@/components/explore/ListingContext";
import ListingPagination from "@/components/explore/ListingPagination";

const DEFAULT_PAGE_SIZE = 9

export function ExploreContent() {
    const { query, type, showPaid, timeFilter, listings, setListings, setOptions, setTotal, page } = useListing()

  const getListings = async () => {
    let since = new Date()
    const now = new Date();

    if (timeFilter === "week") {
      since.setDate(now.getDate() - 7);
    } else if (timeFilter === "month") {
      since.setMonth(now.getMonth() - 1);
    } else if (timeFilter === "6month") {
      since.setMonth(now.getMonth() - 6);
    } else if (timeFilter === "year") {
      since.setFullYear(now.getFullYear() - 1);
    }
    const params = new URLSearchParams({ limit: `${DEFAULT_PAGE_SIZE}` });
    if (query.trim() !== "") {
      params.set("query", query);
    }
    if (type != "") {
      params.set("type", type)
    }
    if (!showPaid) {
      params.set("free", "true")
    }
    if (timeFilter != "") {
      params.set("since", since.toISOString())
    }
    const data = await searchNotes(params);
    setListings(data.items)
    setOptions(buildCounts(data.byType))
    setTotal(data.total)
  }

  useEffect(() => {
    getListings()
  }, [type, showPaid, timeFilter, page])

  return (
    <main className="px-5 xl:px-0 flex flex-col gap-8 py-10">
      <Hero />
      <FilterBar onSearch={getListings} />
      <section className="w-full text-sm font-light">
        <div className="max-w-6xl mx-auto grid gap-5 sm:grid-cols-2 lg:grid-cols-3 items-stretch">
          {listings.map((listing) => (
            <ListingCard key={listing.id} data={listing} />
          ))}
        </div>
      </section>
      <ListingPagination />
    </main>
  );
};

export default function Explore() {
  return (
    <ListingProvider>
      <ExploreContent />
    </ListingProvider>
  )
}

export type ByTypeCount = { type: string; count: number };

const LABELS: Record<string, string> = {
  notes: "Notes",
  cheatsheet: "Cheat Sheets",
  answerkey: "Answer Key",
  knowledge: "Knowledge",
};

function buildCounts(byType: ByTypeCount[]): TypeOption[] {
  return Object.entries(LABELS).map(([value, label]) => {
    const match = byType.find((t) => t.type === value);
    return {
      value,
      label,
      count: match?.count ?? 0,
    };
  });
}
