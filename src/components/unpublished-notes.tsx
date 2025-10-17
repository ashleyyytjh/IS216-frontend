"use client"
import { Edit, Save, Search, Upload, X } from "lucide-react"
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
import { dateFormat } from './utils';

export function UnpublishedNotes() {
  const [searchQuery, setSearchQuery] = useState("")

  const [currentDraft, setCurrentDraft] = useState<any>([]);

  const handleNote = (note: any) => {
    console.log(note)
  }

  useEffect(() => {
    const notes = localStorage.getItem("draft-notes")
    if (notes) {
      //it comes as dont have.
      try {
        const jsonNote = JSON.parse(notes)
        const newNote = jsonNote.map((note) => {
          const cur = { ...note }
          if (cur.tag == undefined) {
            cur.tag = []
          }
          if (cur.description == undefined) {
            cur.description = ""
          }
          return cur;
        }
        )
        setCurrentDraft(newNote)
      } catch {
        setCurrentDraft([])
      }
    }
  }, [])

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
      <div className="rounded-md border overflow-visible mt-10">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-[2rem]">Note Title</TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead>Tags</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {
              currentDraft.length == 0 &&
              <p className="text-muted-foreground text-center">
                No notes found.
              </p>
            }

            {currentDraft.map((note) => {
              console.log(note)
              return (
                <TableRow>
                  <TableCell className="pl-[2rem]">{note.title}</TableCell>
                  <TableCell>{dateFormat(note.updatedAt)}</TableCell>
                  <TableCell>

                  </TableCell>
                  <TableCell>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-start gap-2">
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
                </TableRow>)
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
