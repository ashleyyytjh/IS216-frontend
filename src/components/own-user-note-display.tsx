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
import { deleteUploadedNote, getNotesById, getUserOwned } from "@/services/NotesService"
import { NoteListing } from "@/types/types"
import { Spinner } from "./ui/shadcn-io/spinner"
import { Input } from "./ui/input"
import { Link } from "react-router-dom"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"


export const UserOwnNote = (currentUserInfo) => {
  const user = currentUserInfo?.currentUserInfo ?? {}
  const [notes, setNotes] = useState<NoteListing[]>([])
  const [loading, isLoading] = useState(true)
  const [searchQuery, setSearch] = useState("")
  const [activeFilter, setActiveFilter] = useState("All")
  const navigate = useNavigate();
  useEffect(() => {
    getUserOwned()
      .then(async (resp) => {
        const allUserOwned = await Promise.all(
          resp.map(async (r) => {
            const a = await getNotesById(r.id);
            return {
              ...r,
              pending: a?.graph.edges.length === 0,
            };
          })
        );
        setNotes(allUserOwned);
      })
      .catch((err) => console.error("Error fetching owned notes:", err))
      .finally(() => { isLoading(false) })
  }, []);
  const filteredNotes = notes.filter((note) => {
    const matchesSearch =
      note.originalName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.description.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesFilter = activeFilter === "All" || note.type === activeFilter
    return matchesSearch && matchesFilter
  })
  if (loading) {
    return (<div className="flex justify-center"><Spinner variant={'default'} /></div>)
  }
  console.log(filteredNotes)

  const deleteNote = (id) =>{
    deleteUploadedNote(id).then((res)=>{
      toast.success('Note deleted successfully')
    }).catch(err=>
      toast.error('Note unable to delete')
    )
  }

  return (
    <main className="w-full">
      <section className="w-full mb-6 pt-4 pb-4">
        <div className="flex w-full items-center gap-3">
          <div className="relative flex-1 opacity-70 focus-within:opacity-100 transition-opacity">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearch(e.target.value)}
              type="search"
              placeholder="Search for notes..."
              className="pl-9 bg-gray-100 text-gray-500 focus:bg-white focus:text-black transition-colors w-full"
            />
          </div>
          <Select value={activeFilter} onValueChange={(v) => setActiveFilter(v)}>
            <SelectTrigger className="w-[150px] sm:w-[80px] md:w-[170px]">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All</SelectItem>
              <SelectItem value="notes">Notes</SelectItem>
              <SelectItem value="cheatsheet">Cheatsheets</SelectItem>
              <SelectItem value="Answerkey">Answer Key</SelectItem>
              <SelectItem value="knowledge">Knowledge</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </section>

      <section className="w-full text-sm font-light">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 w-full auto-rows-fr">
          {filteredNotes.map((listing) => (
            <div key={listing.id} className="h-full">
             
              <div
               
                className="block h-full"
              >
                <Card className="h-full flex flex-col p-5 rounded-md transition-shadow duration-300 hover:shadow-xl"
                >
                  <CardHeader className="flex items-stretch gap-4 p-0 font-semibold">
                    {listing.originalName}
                    <div className="flex-1 flex flex-col justify-center gap-1">
                      <div className="flex justify-end">
                        <p className="text-xs text-muted-foreground">
                          {formatRelativeMonthYear(listing.createdAt)}
                        </p>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-2 p-0 pb-3 flex-1">
                    <p className="text-sm line-clamp-2">{listing.description}</p>
                    <div className="flex flex-wrap text-xs text-muted-foreground gap-y-2">
                      {listing.tags?.map((tag, i) => (
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
                      ))}
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
                      <Separator orientation="vertical" />
                      {listing['pending'] ? (
                        <span className="font-mono flex items-center text-amber-600">
                          Processing
                        </span>
                      ) : (
                        <span className="font-mono flex items-center text-green-600">
                          Success
                        </span>
                      )}

                    </div>

                  </CardFooter>
                   {/* to={`/listings/${(listing as any).note_id || listing.id}`}*/}
                  <CardFooter className="flex flex-row-reverse justify-between gap-x-2 pl-0 pr-0">
                    <Button size ="sm" className="w-[48%]" onClick={()=>{navigate(`/listings/${(listing as any).note_id || listing.id}`)}}>Details</Button>
                    <Button size= "sm" className="bg-red-400 hover:bg-red-500 w-[48%] px-2 py-1 border-none gap-1 items-center" onClick={()=>{deleteNote(`${(listing as any).note_id || listing.id}`)}}>Delete</Button>
                  </CardFooter>
                </Card>

              </div>
            </div>
          ))}
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

