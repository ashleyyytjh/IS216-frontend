"use client"
import { Edit, Notebook, Save, Search, Upload, X } from "lucide-react"
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

export function UnpublishedNotes() {
  const [searchQuery, setSearchQuery] = useState("")
  const [curData, setCurData] = useState<any>([])


  const dummyData = [

    {
      "id": "note-001", //not showing
      "title": "Introduction to Algorithms", //show shown
      "tags": ["algorithms", "data structures", "cs102"], //badge shown
      "publish": true, // filter condition unshown
      "price": 4990,  //shown
      "createdAt": "2025-08-10T14:23:00Z", //shown
      "updatedAt": "2025-09-02T10:45:00Z", //shown
      "module": "CS102" // shown.
    },
    {
      "id": "note-002",
      "title": "Statistical Inference Cheat Sheet",
      "tags": ["statistics", "clt", "sampling"],
      "publish": false,
      "price": 1000,
      "createdAt": "2025-07-22T09:15:00Z",
      "updatedAt": "2025-08-01T16:40:00Z",
      "module": "STATS201"
    },
    {
      "id": "note-003",
      "title": "Database Normalization Summary",
      "tags": ["database", "normalization", "sql"],
      "publish": true,
      "price": 2500,
      "createdAt": "2025-06-15T12:00:00Z",
      "updatedAt": "2025-07-20T18:30:00Z",
      "module": "IS203"
    },
    {
      "id": "note-004",
      "title": "Machine Learning Basics",
      "tags": ["ml", "ai", "python"],
      "publish": false,
      "price": 6000,
      "createdAt": "2025-09-05T11:10:00Z",
      "updatedAt": "2025-09-30T21:25:00Z",
      "module": "CS425"
    },
    {
      "id": "note-005",
      "title": "Play-based Learning in Early Childhood",
      "tags": ["ece", "play", "child development"],
      "publish": false,
      "price": 3.75,
      "createdAt": "2025-08-28T08:45:00Z",
      "updatedAt": "2025-09-10T15:20:00Z",
      "module": "ECE101"
    }
  ]

  const procData = () => dummyData.filter(d => !d.publish)
  const currentList = procData();

  useEffect(() => {
    const filteredData = dummyData
      .filter(d => !d.publish)
      .filter((n) => {
        const term = searchQuery.toLowerCase();
        return (
          n.title.toLowerCase().includes(term) ||
          n.tags.some(tag => tag.toLowerCase().includes(term)) ||
          n.module.toLowerCase().includes(term)
        );
      });
    setCurData(filteredData);
  }, [searchQuery]);


  //simulate removal
  const handleNote = (note: any) => {
    //uploadNote(note).then((res)=>{
    // toast.success('Successfully uploaded notes')
    //}).catch((e)=>{
    // toast.error('Something went wrong.')
    //})
    console.log(note)
    const res = curData.filter((n) => {
      return n.id !== note.id
    })
    setCurData(res)
  }

  return (
    <div className="w-full relative">
      <div className="relative flex-1 opacity-70 focus-within:opacity-100 transition-opacity mt-4">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          type="search"
          placeholder="Search for unpublished notes"
          className="pl-9 bg-gray-100 text-gray-500 focus:bg-white focus:text-black transition-colors w-full"
        />
      </div>

      {
        curData.length > 0 ? (
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


                  {curData.map((note) => {
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
                          <div className="flex items-center justify-start">
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex items-center gap-1 bg-green-50 hover:bg-green-100 text-green-700 border-none px-2 py-1"
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
                curData.map((note) => {
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
                        <Button
                          size="sm"
                          className="flex items-center gap-1 border-none px-2 py-1 w-[50%] bg-slate-900 hover:bg-slate-800 text-white"
                          onClick={() => { handleNote(note) }}
                        >
                          <span className="text-xs font-medium">Upload</span>
                        </Button>
                        {/* Change routings below. */}
                        <Button
                          size="sm"
                          className="flex items-center gap-1 border-none px-2 py-1 w-[50%] bg-slate-800/90 hover:bg-slate-700/90 text-slate-100"
                          onClick={() => { handleNote(note) }}
                        >
                          <span className="text-xs font-medium">Note Details</span>
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

    </div>
  )
}

//if below lg, i will do a card layout to ensure consistency and ensure table dont horizontal scroll.