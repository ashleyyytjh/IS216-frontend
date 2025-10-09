"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card"

import { Search, ChevronDown } from "lucide-react"
import { NoteListing } from "@/types/types"
import { Spinner } from './ui/shadcn-io/spinner';
import { Input } from "./ui/input"
import { Link } from "react-router-dom"

export const UnpublishedNotes = (currentUserInfo) => {
  const user = currentUserInfo?.currentUserInfo ?? {}
  const [notes, setNotes] = useState<NoteListing[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    const saved = localStorage.getItem('draft-notes')
    if(saved !== null){
        const parsed = JSON.parse(saved);
        parsed.sort((a,b)=>{
          return new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()
        }
        )
        setNotes(parsed)
        setLoading(false)
    }
    if(saved== null){
      setLoading(false)
    }

  }, [])

  const filteredNotes = notes.filter((note) => {
    const matchesSearch =
      note.title.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesSearch
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
              className="w-full pl-9 bg-muted border-none text-foreground/80 focus:bg-white focus:text-foreground transition-colors"
            />
          </div>

        </div>
      </section>

      <section className="w-full text-sm font-light">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 w-full">
          {filteredNotes.map((listing) => {
            let currentDateTime : Date | null = null
            if(listing.updatedAt){
                currentDateTime = new Date(listing.updatedAt)
            }
            
            let date = currentDateTime?.toLocaleDateString();
            let time = currentDateTime?.toLocaleTimeString();
            return (
              <Link     
                to={`/editNote/${(listing as any).id || listing.id}`}
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
                          {date} {time}
                        </p>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Year {user.yearOfStudy ?? "Unknown year"}{" "}
                        {user.major ?? "Unknown major"}
                      </p>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-2 p-0 pb-3">
                    <h3 className="font-semibold">{listing.title}</h3>
                  </CardContent>

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