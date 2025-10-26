"use client";
import { Eye, Pencil, Search, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import { dateFormat, stringFormat } from "./utils";
import { Badge } from "./ui/badge";
import { formatPriceSGD } from "@/utils/currency";
import { Card } from "./ui/card";
import { CardContent, CardFooter, CardHeader } from "./ui/card";
import { courseGradient } from "@/utils/colors";
import { formatRelativeMonthYear } from "@/utils/dates";
import { Separator } from "./ui/separator";
import {
  deleteComposeNote,
  getOwnedComposeNotes,
  uploadComposedNote,
} from "@/services/NotesService";
import { toast } from "sonner";
import { Spinner } from "./ui/shadcn-io/spinner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Switch } from "@/components/ui/switch";
import { useNavigate } from "react-router-dom";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";

export function UnpublishedNotes() {
  const [searchQuery, setSearchQuery] = useState("");
  const [rawData, setRawData] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUpload, setCurrentUploadId] = useState<any>("");
  const [activeFilter, setActiveFilter] = useState<any>("all");
  const [currentNoteId, setCurrentNoteId] = useState();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  function updateNote(id, newValue) {
    //UI trigger
    setRawData((prevRes) =>
      prevRes.map((n) => (n.id === id ? { ...n, publish: newValue } : n))
    );
    //publish the note (unhide feature)
    uploadComposedNote(id, newValue)
      .then((res) => {
        console.log(res);
        newValue
          ? toast.success("Note has been published successfully")
          : toast.success("Note has been hidden successfully");
      })
      .catch((err) => {
        toast.error("Note operation failed.");
      });
  }
  console.log(localStorage);

  //deleting method.for now would not work as think DB is blocking it.

  const openDialog = (id: any) => {
    setCurrentNoteId(id);
    setDeleteDialogOpen(true);
  };
  async function deleteNote(composeID: any) {
    try {
      const response = await deleteComposeNote(composeID);
      setRawData((prevRes) => prevRes.filter((n) => n.id != composeID));
      console.log(response);
      toast.success("Note deleted successfully");
    } catch (err) {
      toast.error("Note deletion failed.");
    }
  }

  useEffect(() => {
    //filtering.
    getOwnedComposeNotes()
      .then((res) => {
        let da = res.data;
        console.log(da);
        if (activeFilter == "true") {
          da = da.filter((d) => d.publish === true);
        } else {
          if (activeFilter == "false") {
            da = da.filter((d) => d.publish === false);
          }
        }
        const filtered = da.filter((n) => {
          const term = searchQuery.toLowerCase();
          return (
            n.title.toLowerCase().includes(term) ||
            n.tags.some((tag) => tag.toLowerCase().includes(term)) ||
            n.module.toLowerCase().includes(term)
          );
        });
        console.log(filtered)
        setIsLoading(false);
        setRawData(filtered);
        
      })
      .catch((err) => {
        console.error(err);
      });
  }, [searchQuery, currentUpload, activeFilter]);
  const navigate = useNavigate();

  return isLoading ? (
    <div className="flex justify-center">
      <Spinner variant={"default"} />
    </div>
  ) : (
    <>
      <div className="w-full relative space-y-3">
        <div className="flex flex-nowrap overflow-x-auto items-center justify-between gap-3 w-full">
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
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="true">Published</SelectItem>
              <SelectItem value="false">Unpublished</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {rawData.length > 0 ? (
          <>
            <div className="rounded-md border overflow-visible hidden lg:block">
              <Table className="border-collapse w-full">
                <TableHeader>
                  <TableRow>
                    <TableHead className="pl-[2rem]">Note Title</TableHead>
                    <TableHead>Module Code</TableHead>
                    <TableHead>Tags</TableHead>
                    <TableHead>Updated at</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Actions</TableHead>
                    <TableHead className="pr-[2rem]">Publish</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rawData.map((note) => {
                    console.log(note.module);
                    return (
                      <TableRow>
                        <TableCell className="pl-[2rem]">
                          {note.title}
                        </TableCell>
                        <TableCell>
                          {note.module == "" ? <>GENERAL</> : note.module}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-x-2 gap-y-2 flex-row flex-wrap">
                            {note.tags.map(
                              (tag, id) =>
                                id <= 2 && (
                                  <Badge key={tag} className="px-3 py-1">
                                    {stringFormat(tag)}
                                  </Badge>
                                )
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-foreground">
                          {dateFormat(note.updatedAt)}
                        </TableCell>
                        <TableCell className="text-foreground">
                          {formatPriceSGD(note.price)}
                        </TableCell>

                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="icon"
                              variant="outline"
                              onClick={() => navigate(`/article/${note.id}`)}
                            >
                              <Eye />
                            </Button>
                            <Button
                              size="icon"
                              variant="outline"
                              onClick={() => {
                                navigate(`/compose/edit/${note.id}`);
                              }}
                            >
                              <Pencil />
                            </Button>
                            <Button
                              size="icon"
                              variant="destructive"
                              onClick={() => {
                                openDialog(note.id);
                              }}
                            >
                              <Trash2 />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Switch
                            checked={note.publish}
                            onCheckedChange={(value) =>
                              updateNote(note.id, value)
                            }
                          >
                            Publish
                          </Switch>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 w-full auto-rows-fr mt-10 lg:hidden">
              {rawData.map((note) => {
                console.log(note);
                return (
                  <Card className="h-full flex flex-col p-5 transition-shadow duration-300 hover:shadow-xl border rounded-lg">
                    <CardHeader className="flex items-stretch gap-4 p-0 font-semibold">
                      <div className="pl-0">{note.title}</div>
                      <div className="flex-1 flex flex-col justify-center gap-1">
                        <div className="flex justify-end items-center h-6 gap-x-2">
                          <p className="text-xs text-muted-foreground">
                            {formatRelativeMonthYear(note.updatedAt)}
                          </p>
                          <Switch
                            checked={note.publish}
                            onCheckedChange={(value) =>
                              updateNote(note.id, value)
                            }
                          >
                            Publish
                          </Switch>
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
                              <span className="mx-2 text-muted-foreground">
                                •
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </CardContent>

                    <CardFooter className="flex items-center justify-between p-0">
                      <div className="flex h-6 gap-2">
                        <Badge
                          className="text-sm font-normal rounded-full border-none text-white uppercase"
                          style={{
                            background: courseGradient(note.module ?? ""),
                          }}
                        >
                          {note.module ?? "GENERAL"}
                        </Badge>

                        <Separator orientation="vertical" />
                        <span className="font-mono flex items-center">
                          {formatPriceSGD(note.price) || 0.0}
                        </span>
                        <Separator orientation="vertical" />
                      </div>
                    </CardFooter>
                    {/*  py-1 px-3 text-white */}

                    <CardFooter className="justify-between gap-x-2 pl-0 pr-0">
                      {/* Change routings below. */}
                      <Button
                        size="sm"
                        className="bg-red-400 hover:bg-red-500 w-[50%] px-2 py-1 border-none gap-1 items-center"
                      >
                        <span
                          className="text-xs font-medium"
                          onClick={() => {
                            openDialog(note.id);
                          }}
                        >
                          Delete
                        </span>
                      </Button>
                      {note.publish && (
                        <Button
                          size="sm"
                          className={`flex items-center gap-1 border-none px-2 py-1 w-[50%]
      bg-slate-900 hover:bg-slate-800 text-white`}
                          onClick={() => {
                            navigate(`/article/${note.id}`);
                          }}
                        >
                          <span className="text-xs font-medium">Details</span>
                        </Button>
                      )}

                      {!note.publish && (
                        <>
                          <Button
                            size="sm"
                            className={`flex items-center gap-1 border-none px-2 py-1 w-[50%]
      bg-slate-900 hover:bg-slate-800 text-white`}
                            onClick={() => {
                              navigate(`/compose/edit/${note.id}`);
                            }}
                          >
                            <span className="text-xs font-medium">
                              Edit Note
                            </span>
                          </Button>
                        </>
                      )}
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          </>
        ) : (
          <div className="flex justify-center border-none mt-5">
            <p className="text-muted-foreground text-sm">No notes found.</p>
          </div>
        )}
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Note</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this note?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel asChild>
              <Button variant="outline" className="!text-sm">
                Cancel
              </Button>
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button
                variant="destructive"
                className="!text-sm"
                onClick={() => {
                  deleteNote(currentNoteId);
                }}
              >
                Delete
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
