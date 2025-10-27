"use client"

import { useEffect, useState } from "react"
import { formatRelativeMonthYear } from "@/utils/dates"
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card"
import { Badge } from "./ui/badge"
import { courseGradient } from "@/utils/colors"
import { Separator } from "./ui/separator"
import { formatPriceSGD } from "@/utils/currency"
import { Button } from "./ui/button"
import { Search, ChevronDown, Eye, Trash2 } from "lucide-react"
import { deleteUploadedNote, getNotesById, getUserOwned } from "@/services/NotesService"
import { NoteListing } from "@/types/types"
import { Spinner } from "./ui/shadcn-io/spinner"
import { Input } from "./ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "./ui/alert-dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";


export const UserOwnNote = (currentUserInfo) => {
  const user = currentUserInfo?.currentUserInfo ?? {}
  const [notes, setNotes] = useState<NoteListing[]>([])
  const [loading, isLoading] = useState(true)
  const [searchQuery, setSearch] = useState("")
  const [activeFilter, setActiveFilter] = useState("All")
  const [currentNoteId, setCurrentNoteId] = useState();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const navigate = useNavigate();
  //get owned notes. if the graph edges length is 0, it is processing.
  useEffect(() => {
    getUserOwned()
      .then(async (resp) => {
        console.log(resp)
        const allUserOwned = await Promise.all(
          resp.map(async (r) => {
            const a = await getNotesById(r.id);
            console.log(a)
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


  const openDialog = (id: any) => {
    setCurrentNoteId(id)
    setDeleteDialogOpen(true)
  }

  const deleteNote = (id) => {
    setDeleteDialogOpen(false);
    setNotes(prev => prev.filter(n => n.id !== id));
    deleteUploadedNote(id).then((res) => {
      toast.success('Note deleted successfully')
    }).catch(err =>
      toast.error('Note unable to delete')
    )
  }

  return (
    <main className="w-full space-y-3">
      <section className="w-full">
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
              <SelectItem value="answerkey">Answer Key</SelectItem>
              <SelectItem value="knowledge">Knowledge</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </section>

      <section className="w-full">
        <div className="rounded-md border overflow-visible hidden lg:block">
          <Table className="border-collapse w-full">
            <TableHeader>
              <TableRow>
                <TableHead className="pl-[2rem]">Name</TableHead>
                <TableHead>Module</TableHead>
                <TableHead>Tags</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="pr-[2rem]">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filteredNotes.map((listing) => (
                <TableRow key={listing.id}>
                  <TableCell className="font-medium pl-[2rem]">{listing.originalName}</TableCell>
                  <TableCell className="text-foreground">
                    {listing.module}
                  </TableCell>
                  <TableCell>

                    {listing.tags.length == 0 ? (
                      <p className="text-muted-foreground">No tags</p>
                    ) : (<div className="flex flex-wrap items-center gap-1">
                      {listing.tags.map((tag, i) => (
                        <span key={tag} className="flex items-center">
                          <Badge className="px-3 py-1 rounded-full">
                            {tag}
                          </Badge>
                          {i < listing.tags.length - 1 && (
                            <span className="mx-1 text-muted-foreground">•</span>
                          )}
                        </span>
                      ))}
                    </div>)}

                  </TableCell>
                  <TableCell className="text-foreground">{formatPriceSGD(listing.price)}</TableCell>
                  <TableCell className="align-middle">
                    {listing['pending'] ? (
                      <Badge className="bg-amber-100 text-amber-600 font-semibold px-2 py-1 border-none">Processing</Badge>
                    ) : (
                      <Badge className="bg-green-100 text-green-600 font-semibold px-2 py-1 border-none">Success</Badge>
                    )}
                  </TableCell>
                  <TableCell>{formatRelativeMonthYear(listing.createdAt)} ago</TableCell>
                  <TableCell className="flex items-center gap-2 justify-start">
                    <Button
                      size="sm"
                      variant='outline'
                      onClick={() =>
                        navigate(`/listings/${(listing as any).note_id || listing.id}`)
                      }
                    >
                      <Eye />
                     
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() =>
                        openDialog(`${(listing as any).note_id || listing.id}`)
                      }
                    >
                      <Trash2 />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 w-full auto-rows-fr lg:hidden">
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
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <Badge
                          className="text-sm font-normal rounded-full border-none text-white uppercase"
                          style={{ background: courseGradient(listing.module ?? "") }}
                        >
                          {listing.module}
                        </Badge>
                        <div className="w-px h-4 bg-gray-300 mx-1" />
                        <span className="font-mono">{formatPriceSGD(listing.price)}</span>
                      </div>

                      {listing["pending"] ? (
                        <Badge className=" bg-amber-100 text-amber-700 border-none px-2 py-1 mt-2"> Processing </Badge>
                      ) : (
                        <Badge className=" bg-green-100 text-green-700 border-none px-2 py-1 mt-2"> Processing </Badge>
                      )}
                    </div>
                  </CardFooter>
                  {/* to={`/listings/${(listing as any).note_id || listing.id}`}*/}
                  {/* deleteNote(``) */}
                  <CardFooter className="flex flex-row-reverse justify-between gap-x-2 pl-0 pr-0">
                    <Button size="sm" className="w-[48%]" onClick={() => { navigate(`/listings/${(listing as any).note_id || listing.id}`) }}>Details</Button>
                    <Button size="sm" className="bg-red-400 hover:bg-red-500 w-[48%] px-2 py-1 border-none gap-1 items-center" onClick={() => { openDialog(`${(listing as any).note_id || listing.id}`) }}>Delete</Button>
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

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Delete Note
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this note? Deleting this note will delete all transactions related to your note.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel asChild>
              <Button variant="outline" className="!text-sm">Cancel</Button>
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button variant="destructive" className="!text-sm" onClick={() => { deleteNote(currentNoteId) }}>Delete</Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  )
}

