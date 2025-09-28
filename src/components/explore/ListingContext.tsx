import { createContext, useContext, useState } from "react"
import { SearchNotesItem } from "@/types/requests/notes"
import { TypeOption } from "@/types/types"

type ListingContextType = {
  listings: SearchNotesItem[]
  setListings: React.Dispatch<React.SetStateAction<SearchNotesItem[]>>
  query: string
  setQuery: (val: string) => void
  type: string
  setType: (val: string) => void
  showPaid: boolean
  setShowPaid: (val: boolean) => void
  timeFilter: string
  setTimeFilter: (val: string) => void
  options: TypeOption[]
  setOptions: (val: TypeOption[]) => void
  total: number
  setTotal: (val: number) => void
  page: number
  setPage: (val: number) => void
  limit: number
  setLimit: (val: number) => void
}

const DEFAULT_PAGE_SIZE = 9

const ListingContext = createContext<ListingContextType | null>(null)

export function useListing() {
  const ctx = useContext(ListingContext)
  if (!ctx) throw new Error("useListing must be used within ListingProvider")
  return ctx
}

export function ListingProvider({ children }: { children: React.ReactNode }) {
  const [listings, setListings] = useState<SearchNotesItem[]>([])
  const [query, setQuery] = useState("")
  const [type, setType] = useState("")
  const [showPaid, setShowPaid] = useState(true)
  const [timeFilter, setTimeFilter] = useState("")
  const [options, setOptions] = useState<TypeOption[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(DEFAULT_PAGE_SIZE)

  return (
    <ListingContext.Provider
      value={{
        listings, setListings,
        query, setQuery,
        type, setType,
        showPaid, setShowPaid,
        timeFilter, setTimeFilter,
        options, setOptions,
        total, setTotal,
        page, setPage,
        limit, setLimit,
      }}
    >
      {children}
    </ListingContext.Provider>
  )
}