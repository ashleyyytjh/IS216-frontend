"use client"

import { useEffect, useState } from "react"
import { formatRelativeMonthYear } from "@/utils/dates"
import FilterBar from "./explore/FilterBar"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card"
import { Badge } from "./ui/badge"
import { courseGradient } from "@/utils/colors"
import { Separator } from "./ui/separator"
import { formatPriceSGD } from "@/utils/currency"
import { Button } from "./ui/button"
import { Heart } from "lucide-react"
import { getUserOwned } from "@/services/NotesService"
import { NoteListing } from "@/types/types"

export const UserOwnNote = (currentUserInfo) => {
console.log(currentUserInfo)
  const [notes, setNotes] = useState<NoteListing[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getUserOwned()
      .then((resp) => {
        console.log("Owned notes:", resp)
        
        setNotes(resp) // store in state
      })
      .catch((err) => {
        console.error("Error fetching owned notes:", err)
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div>Loading...</div>

  return (
    <main className="w-full">
      <FilterBar />
      <section className="w-full text-sm font-light my-10">
        <div className="mx-auto grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {notes.map((listing) => (
            <Card
              key={listing.id}
              className="p-4 rounded-md transition-shadow duration-300 hover:shadow-xl"
            >
              <CardHeader className="flex items-stretch gap-4 p-0">
                <Avatar className="h-12 w-12 rounded-md overflow-hidden">
                  <AvatarImage
                    src={listing.userImageUrl}
                    className="object-cover"
                  />
                  <AvatarFallback>??</AvatarFallback>
                </Avatar>

                <div className="flex-1 flex flex-col justify-center gap-1">
                  <div className="flex">
                    <p className="flex-1 font-medium">{currentUserInfo.currentUserInfo.fullName}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatRelativeMonthYear(listing.createdAt)}
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Year {currentUserInfo.currentUserInfo.yearOfStudy} {currentUserInfo.currentUserInfo.major}
                  </p>
                </div>
              </CardHeader>

              <CardContent className="space-y-2 p-0 pb-3">
                <h3 className="font-semibold">{listing.originalName}</h3>
                <p className="text-sm line-clamp-2">{listing.description}</p>
                <div className="flex flex-wrap text-xs text-muted-foreground">
                  {listing.tags.map((tag, i) => (
                    <div key={tag} className="flex items-center">
                      <Badge
                        variant="secondary"
                        className="bg-transparent border-0 p-0 rounded-none font-normal text-muted-foreground hover:bg-transparent cursor-default"
                      >
                        {tag}
                      </Badge>
                      {i < listing.tags.length - 1 && (
                        <span className="mx-2 text-muted-foreground">•</span>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>

              <CardFooter className="flex items-center justify-between p-0">
                <div className="flex h-6 gap-2">
                  <Badge
                    className="text-sm font-normal rounded-full border-none bg-linear-to-r text-white uppercase"
                    style={{ background: courseGradient(listing.module) }}
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
          ))}
        </div>
      </section>
    </main>
  )
}