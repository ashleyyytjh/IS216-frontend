import Hero from "@/components/explore/Hero";
import FilterBar from "@/components/explore/FilterBar";
import { NoteListing, TypeOption } from "@/types/types";
import ListingCard from "@/components/listing/ListingCard";
import { useEffect, useState } from "react";
import { searchNotes } from "@/services/NotesService";
import { SearchNotesItem } from "@/types/requests/notes";

const DEFAULT_PAGE_SIZE = 9

export default function Explore() {
  const [listings, setListings] = useState<SearchNotesItem[]>([])
  const [query, setQuery] = useState("")
  const [type, setType] = useState("")
  const [showPaid, setShowPaid] = useState<boolean>(true)
  const [options, setOptions] = useState<TypeOption[]>([])
  const [timeFilter, setTimeFilter] = useState("")

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
    const typeCounts = buildCounts(data.byType)
    setOptions(typeCounts)
  }

  useEffect(() => {
    getListings()
  }, [type, showPaid, timeFilter])

  return (
    <main className="px-5 xl:px-0">
      <Hero />
      <FilterBar
        query={query}
        setQuery={setQuery}
        type={type}
        setType={setType}
        showPaid={showPaid}
        setShowPaid={setShowPaid}
        onSearch={getListings}
        options={options}
        timeFilter={timeFilter}
        setTimeFilter={setTimeFilter}
      />

      <section className="w-full text-sm font-light my-10">
        <div className="max-w-6xl mx-auto grid gap-5 sm:grid-cols-2 lg:grid-cols-3 items-stretch">
          {listings.map((listing) => (
            <ListingCard key={listing.id} data={listing} />
          ))}
        </div>
      </section>
    </main>
  );
};

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
      count: match?.count ?? 0, // default to 0 if not present
    };
  });
}

const mockData: NoteListing[] = [
  {
    id: "68b98faba389fd1819c78c17",
    userId: "594a352c-2081-706e-b679-00b936e6b8f9",
    userFullName: "Ashley Toh",
    userImageUrl:
      "https://plus.unsplash.com/premium_photo-1661913010540-2edd44a5ea43?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8bmF0dXJlJTIwd2F0ZXJ8ZW58MHx8MHx8fDA%3D",
    userMajor: "Computer Science",
    userYear: 4,
    description:
      "Covers vector semantics and word embeddings, from frequency-based models to Word2Vec/GloVe and their role in capturing word meaning",
    originalName: "Vector Semantics & Word Embeddings",
    title: "Vector Semantics & Word Embeddings",
    tags: ["NLP", "Machine Learning", "cs425"],
    price: 5,
    type: "notes",
    module: "cs425",
    createdAt: "2025-09-04T13:10:03.602Z",
  },
];
