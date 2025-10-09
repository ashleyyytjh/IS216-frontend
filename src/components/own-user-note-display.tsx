"use client"

import { useEffect, useState } from "react"
import { formatRelativeMonthYear } from "@/utils/dates"
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card"
import { Badge } from "./ui/badge"
import { courseGradient } from "@/utils/colors"
import { Separator } from "./ui/separator"
import { formatPriceSGD } from "@/utils/currency"
import { Button } from "./ui/button"
import { Search, ChevronDown } from "lucide-react"
import { getUserOwned } from "@/services/NotesService"
import { NoteListing } from "@/types/types"
import { Spinner } from './ui/shadcn-io/spinner';
import { Input } from "./ui/input"
import { Link } from "react-router-dom"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"

export const UserOwnNote = (currentUserInfo) => {
  const user = currentUserInfo?.currentUserInfo ?? {}
  const [notes, setNotes] = useState<NoteListing[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilter, setActiveFilter] = useState("All")

  useEffect(() => {
    getUserOwned()
      .then((resp) => setNotes(resp))
      .catch((err) => console.error("Error fetching owned notes:", err))
      .finally(() => setLoading(false))
  }, [])

  const filteredNotes = notes.filter((note) => {
    const matchesSearch =
      note.originalName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.description.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesFilter =
      activeFilter === "All" || note.type === activeFilter

    return matchesSearch && matchesFilter
  })

  if (loading)
    return (
      <div className="flex justify-center w-full">
        <Spinner variant="default" />
      </div>
    )

  return (
    <main className="w-full">
      <section className="w-full mb-6 pt-4 pb-4">
        <div className="flex w-full items-center gap-3">
          <div className="relative flex-1 opacity-70 focus-within:opacity-100 transition-opacity">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              type="search"
              placeholder="Search for notes..."
              className="w-full pl-9 bg-muted border-none text-foreground/80 focus:bg-white focus:text-foreground transition-colors flex-1"
            />
          </div>
          <Select
            value={activeFilter}
            onValueChange={(v) => setActiveFilter(v)}
          >
            <SelectTrigger className="w-[80px] sm:w-[80px] md:w-[80px]">
              <SelectValue placeholder="Type of note" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All</SelectItem>
              <SelectItem value="notes">Notes</SelectItem>
              <SelectItem value="cheatsheet">Cheatsheets</SelectItem>
              <SelectItem value="Answer Key">Answer Key</SelectItem>
               <SelectItem value="knowledge">Knowledge</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </section>

      <section className="w-full text-sm font-light">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 w-full">
          {filteredNotes.map((listing) => {
            console.log(listing)

            return (
              <Link
                to={`/listings/${(listing as any).note_id || listing.id}`}
                className="h-full"
                key={listing.id}
              >
                <Card className="p-5 rounded-md transition-shadow duration-300 hover:shadow-xl">
                  <CardHeader className="flex items-stretch gap-4 p-0">
                    <div className="flex-1 flex flex-col justify-center gap-1">
                      <div className="flex">
                        <p className="flex-1 font-medium">
                          {user.fullName ?? "Unknown user"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatRelativeMonthYear(listing.createdAt)}
                        </p>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Year {user.yearOfStudy ?? "Unknown year"}{" "}
                        {user.major ?? "Unknown major"}
                      </p>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-2 p-0 pb-3">
                    <h3 className="font-semibold">{listing.originalName}</h3>
                    <p className="text-sm line-clamp-2">{listing.description}</p>
                    <div className="flex flex-wrap text-xs text-muted-foreground gap-y-2">
                      {listing.tags?.map((tag, i) => {
                        console.log("Tag:", tag)

                        return (
                          <div key={tag} className="flex items-center">
                            <Badge
                              variant="secondary"
                              className="px-2 py-0.5 rounded-full bg-gray-200 text-gray-700"
                            >
                              {tag}
                            </Badge>
                            {i < listing.tags.length - 1 && (
                              <span className="mx-2 text-muted-foreground">•</span>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>

                  <CardFooter className="flex items-center justify-between p-0">
                    <div className="flex h-6 gap-2">
                      <Badge
                        className="text-sm font-normal rounded-full border-none text-white uppercase"
                        style={{ background: courseGradient(listing.module ?? "") }}
                      >
                        {listing.module}
                      </Badge>
                      <Separator orientation="vertical" />
                      <span className="font-mono flex items-center">
                        {formatPriceSGD(listing.price)}
                      </span>
                    </div>
                  </CardFooter>
                </Card>
              </Link>
            )
          })}
          {filteredNotes.length === 0 && (
            <p className="col-span-full text-center text-muted-foreground">
              No notes found.
            </p>
          )}
        </div>
      </section>
    </main>
  )
}