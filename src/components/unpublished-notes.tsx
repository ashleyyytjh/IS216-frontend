"use client"
import { File, Search, Upload, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useEffect, useState } from "react"
import { dateFormat, stringFormat } from './utils';
import { Badge } from "./ui/badge"
import { formatPriceSGD } from "@/utils/currency"
import { Card } from "./ui/card";
import { CardContent, CardFooter, CardHeader } from "./ui/card"
import { courseGradient } from "@/utils/colors"
import { formatRelativeMonthYear } from "@/utils/dates"
import { Separator } from "./ui/separator"
import { getOwnedComposeNotes, uploadComposedNote } from "@/services/NotesService"
import { toast } from "sonner"
import { Spinner } from "./ui/shadcn-io/spinner"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"

export function UnpublishedNotes() {
  const [searchQuery, setSearchQuery] = useState("")
  const [rawData, setRawData] = useState<any>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentUpload, setCurrentUploadId] = useState<any>("")
  const [activeFilter, setActiveFilter] = useState<any>();

  //remove.
  const handleNote = (note: any) => {
    setCurrentUploadId(note.id);
    console.log(note.id)
    uploadComposedNote(note.id).then((response) => {
      toast.success('Note published.')
      console.log(response)
    }).catch((err) => {
      toast.error("Failure. Note did not get published.")
      console.error(err)
    })
  }
  useEffect(() => {
    getOwnedComposeNotes().then((res) => {
      let da = res.data
      if (activeFilter == "true") {
        da = da.filter((d) => d.publish === true)
      } else {
        if (activeFilter == "false") {
          da = da.filter((d) => d.publish === false)
        }
      }
      const filtered = da
        .filter((n) => {
          const term = searchQuery.toLowerCase();
          return (
            n.title.toLowerCase().includes(term) ||
            n.tags.some(tag => tag.toLowerCase().includes(term)) ||
            n.module.toLowerCase().includes(term)
          )
        })
      setIsLoading(false);
      setRawData(filtered)
    }).catch((err) => {
      console.error(err)
    })
  }, [searchQuery, currentUpload, activeFilter]);
  
  return (
    isLoading ? (
      <div className="flex justify-center mt-2">
        <Spinner variant={'default'} />
      </div>
    ) : (
      <div className="w-full relative">
        <div className="flex flex-nowrap overflow-x-auto items-center justify-between gap-3 mt-4 w-full">
          <div className="relative flex-1 min-w-0 opacity-70 focus-within:opacity-100 transition-opacity">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              type="search"
              placeholder="Search for unpublished notes"
              className="pl-9 bg-gray-100 text-gray-500 focus:bg-white focus:text-black transition-colors w-full"
            />
          </div>

          <Select value={activeFilter} onValueChange={setActiveFilter}>
            <SelectTrigger className="w-[150px] sm:w-[120px] md:w-[170px]">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="true">Published</SelectItem>
              <SelectItem value="false">Unpublished</SelectItem>
            </SelectContent>
          </Select>
        </div>



        {
          rawData.length > 0 ? (
            <>
              <div className="rounded-md border overflow-visible mt-10 hidden lg:block">
                <Table className="border-collapse w-full">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="pl-[2rem]">Note Title</TableHead>
                      <TableHead>Module Code</TableHead>
                      <TableHead>Tags</TableHead>
                      <TableHead>Created at</TableHead>
                      <TableHead>Updated at</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead className="pr-[2rem]">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rawData.map((note) => {
                      return (
                        <TableRow>
                          <TableCell className="pl-[2rem]">{note.title}</TableCell>
                          <TableCell>{note.module}</TableCell>
                          <TableCell>
                            <div className="flex gap-x-2 gap-y-2 flex-row flex-wrap">
                              {
                                note.tags.map((tag) => {
                                  return (
                                    <Badge className="px-3 py-1">{stringFormat(tag)}</Badge>
                                  )
                                })
                              }
                            </div>

                          </TableCell>
                          <TableCell>{dateFormat(note.createdAt)}</TableCell>
                          <TableCell className="text-foreground">{dateFormat(note.updatedAt)}</TableCell>
                          <TableCell className="text-foreground">{formatPriceSGD(note.price)}</TableCell>


                          <TableCell className="pr-[2rem]">
                            <div className="flex items-center justify-start gap-x-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="flex items-center gap-1 bg-slate-900 hover:bg-slate-800 text-white border-none px-2 py-1"
                                onClick={() => { handleNote(note) }}
                              >
                                <File className="h-4 w-4" />
                                <span className="text-xs font-medium">Details</span>
                              </Button>

                              <Button
                                size="sm"
                                variant="outline"
                                className="flex items-center gap-1 bg-slate-800/90 hover:bg-slate-700/90 text-slate-100 border-none px-2 py-1"
                                onClick={() => { handleNote(note) }}
                              >
                                <Upload className="h-4 w-4" />
                                <span className="text-xs font-medium">Upload</span>
                              </Button>



                            </div>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>

              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 w-full auto-rows-fr mt-10 lg:hidden">
                {
                  rawData.map((note) => {
                    console.log(note)
                    return (
                      <Card className="h-full flex flex-col p-5 transition-shadow duration-300 hover:shadow-xl border rounded-lg">
                        <CardHeader className="flex items-stretch gap-4 p-0 font-semibold">
                          {note.title}
                          <div className="flex-1 flex flex-col justify-center gap-1">
                            <div className="flex justify-end">
                              <p className="text-xs text-muted-foreground">
                                {formatRelativeMonthYear(note.updatedAt)}
                              </p>
                            </div>
                          </div>

                        </CardHeader>

                        <CardContent className="space-y-2 p-0 pb-3 flex-1">

                          <div className="flex flex-wrap text-xs text-muted-foreground gap-y-2">
                            {note.tags?.map((tag, i) => (
                              <div key={tag} className="flex items-center">
                                <Badge
                                  variant="secondary"
                                  className="px-2 py-0.5 rounded-full bg-gray-200 text-gray-700"
                                >
                                  {stringFormat(tag)}
                                </Badge>
                                {i < note.tags.length - 1 && (
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
                              style={{ background: courseGradient(note.module ?? "") }}
                            >
                              {note.module}
                            </Badge>
                            <Separator orientation="vertical" />
                            <span className="font-mono flex items-center">
                              {formatPriceSGD(note.price)}
                            </span>
                            <Separator orientation="vertical" />
                          </div>

                        </CardFooter>
                        <CardFooter className="justify-between gap-x-2 pl-0 pr-0">

                          {/* Change routings below. */}
                          <Button
                            size="sm"
                            className="flex items-center gap-1 border-none px-2 py-1 w-[50%] bg-slate-800/90 hover:bg-slate-700/90 text-slate-100"
                            onClick={() => { console.log('must nav to edit.') }}
                          >
                            <span className="text-xs font-medium">Note Details</span>
                          </Button>
                          <Button
                            size="sm"
                            className="flex items-center gap-1 border-none px-2 py-1 w-[50%] bg-slate-900 hover:bg-slate-800 text-white"
                            onClick={() => { handleNote(note) }}
                          >
                            <span className="text-xs font-medium">Upload</span>
                          </Button>
                        </CardFooter>
                      </Card>
                    )

                  })
                }
              </div>
            </>
          ) : (
            <div className="flex justify-center border-none mt-10">
              <p className="text-muted-foreground text-sm">No notes found.</p>
            </div>
          )
        }

      </div >
    )
  )
}

