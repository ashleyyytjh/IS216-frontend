
import { ColumnDef } from "@tanstack/react-table"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { NoteDisplay } from "./note-display"
import { IconDotsVertical } from "@tabler/icons-react"
import { Filter, Search } from "lucide-react"
import { Card, CardContent, CardHeader } from "./ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table"
import { NoteListing } from "@/types/types"
import { useState } from "react"
import UserActivityListing from "./user-activity-listing"

export const schema = z.object({
  id: z.number(),
  header: z.string(),
  type: z.string(),
  status: z.string(),
  target: z.string(),
  limit: z.string(),
  reviewer: z.string(),
})


const columns: ColumnDef<z.infer<typeof schema>>[] = [

  {
    id: "actions",
    cell: () => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
            size="icon"
          >
            <IconDotsVertical />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-32">
          <DropdownMenuItem>Edit</DropdownMenuItem>
          <DropdownMenuItem>Make a copy</DropdownMenuItem>
          <DropdownMenuItem>Favorite</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
]


const mockData: NoteListing[] = [
  {
    id: "68b98faba389fd1819c78c17",
    userId: "594a352c-2081-706e-b679-00b936e6b8f9",
    userFullName: "Ashley Toh",
    userImageUrl:
      "https://plus.unsplash.com/premium_photo-1661913010540-2edd44a5ea43?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8bmF0dXJlJTIwd2F0ZXJ8ZW58MHx8MHx8fDA%3D",
    major: "Computer Science",
    yearOfStudy: 4,
    description:
      "Covers vector semantics and word embeddings, from frequency-based models to Word2Vec/GloVe and their role in capturing word meaning",
    originalName: "Vector Semantics & Word Embeddings",
    tags: ["NLP", "Machine Learning", "cs425"],
    price: 5,
    type: "notes",
    module: "cs425",
    createdAt: "2025-09-04T13:10:03.602Z",
  },
  {
    id: "68b98faba389fd1819c78c17",
    userId: "594a352c-2081-706e-b679-00b936e6b8f9",
    userFullName: "Ashley Toh",
    userImageUrl:
      "https://plus.unsplash.com/premium_photo-1661913010540-2edd44a5ea43?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8bmF0dXJlJTIwd2F0ZXJ8ZW58MHx8MHx8fDA%3D",
    major: "Computer Science",
    yearOfStudy: 4,
    description:
      "Covers vector semantics and word embeddings, from frequency-based models to Word2Vec/GloVe and their role in capturing word meaning",
    originalName: "Vector Semantics & Word Embeddings",
    tags: ["NLP", "Machine Learning", "cs425"],
    price: 5,
    type: "notes",
    module: "cs425",
    createdAt: "2025-09-04T13:10:03.602Z",
  },
  {
    id: "68b98faba389fd1819c78c17",
    userId: "594a352c-2081-706e-b679-00b936e6b8f9",
    userFullName: "Ashley Toh",
    userImageUrl:
      "https://plus.unsplash.com/premium_photo-1661913010540-2edd44a5ea43?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8bmF0dXJlJTIwd2F0ZXJ8ZW58MHx8MHx8fDA%3D",
    major: "Computer Science",
    yearOfStudy: 4,
    description:
      "Covers vector semantics and word embeddings, from frequency-based models to Word2Vec/GloVe and their role in capturing word meaning",
    originalName: "Vector Semantics & Word Embeddings",
    tags: ["NLP", "Machine Learning", "cs425"],
    price: 5,
    type: "notes",
    module: "cs425",
    createdAt: "2025-09-04T13:10:03.602Z",
  },
  {
    id: "68b98faba389fd1819c78c17",
    userId: "594a352c-2081-706e-b679-00b936e6b8f9",
    userFullName: "Ashley Toh",
    userImageUrl:
      "https://plus.unsplash.com/premium_photo-1661913010540-2edd44a5ea43?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8bmF0dXJlJTIwd2F0ZXJ8ZW58MHx8MHx8fDA%3D",
    major: "Computer Science",
    yearOfStudy: 4,
    description:
      "Covers vector semantics and word embeddings, from frequency-based models to Word2Vec/GloVe and their role in capturing word meaning",
    originalName: "Vector Semantics & Word Embeddings",
    tags: ["NLP", "Machine Learning", "cs425"],
    price: 5,
    type: "notes",
    module: "cs425",
    createdAt: "2025-09-04T13:10:03.602Z",
  },
  {
    id: "68b98faba389fd1819c78c17",
    userId: "594a352c-2081-706e-b679-00b936e6b8f9",
    userFullName: "Ashley Toh",
    userImageUrl:
      "https://plus.unsplash.com/premium_photo-1661913010540-2edd44a5ea43?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8bmF0dXJlJTIwd2F0ZXJ8ZW58MHx8MHx8fDA%3D",
    major: "Computer Science",
    yearOfStudy: 4,
    description:
      "Covers vector semantics and word embeddings, from frequency-based models to Word2Vec/GloVe and their role in capturing word meaning",
    originalName: "Vector Semantics & Word Embeddings",
    tags: ["NLP", "Machine Learning", "cs425"],
    price: 5,
    type: "notes",
    module: "cs425",
    createdAt: "2025-09-04T13:10:03.602Z",
  },
  {
    id: "68b98faba389fd1819c78c17",
    userId: "594a352c-2081-706e-b679-00b936e6b8f9",
    userFullName: "Ashley Toh",
    userImageUrl:
      "https://plus.unsplash.com/premium_photo-1661913010540-2edd44a5ea43?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8bmF0dXJlJTIwd2F0ZXJ8ZW58MHx8MHx8fDA%3D",
    major: "Computer Science",
    yearOfStudy: 4,
    description:
      "Covers vector semantics and word embeddings, from frequency-based models to Word2Vec/GloVe and their role in capturing word meaning",
    originalName: "Vector Semantics & Word Embeddings",
    tags: ["NLP", "Machine Learning", "cs425"],
    price: 5,
    type: "notes",
    module: "cs425",
    createdAt: "2025-09-04T13:10:03.602Z",
  },
  {
    id: "68b98faba389fd1819c78c17",
    userId: "594a352c-2081-706e-b679-00b936e6b8f9",
    userFullName: "Ashley Toh",
    userImageUrl:
      "https://plus.unsplash.com/premium_photo-1661913010540-2edd44a5ea43?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8bmF0dXJlJTIwd2F0ZXJ8ZW58MHx8MHx8fDA%3D",
    major: "Computer Science",
    yearOfStudy: 4,
    description:
      "Covers vector semantics and word embeddings, from frequency-based models to Word2Vec/GloVe and their role in capturing word meaning",
    originalName: "Vector Semantics & Word Embeddings",
    tags: ["NLP", "Machine Learning", "cs425"],
    price: 5,
    type: "notes",
    module: "qf102",
    createdAt: "2025-09-04T13:10:03.602Z",
  },
  {
    id: "68b98faba389fd1819c78c17",
    userId: "594a352c-2081-706e-b679-00b936e6b8f9",
    userFullName: "Ashley Toh",
    userImageUrl:
      "https://plus.unsplash.com/premium_photo-1661913010540-2edd44a5ea43?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8bmF0dXJlJTIwd2F0ZXJ8ZW58MHx8MHx8fDA%3D",
    major: "Computer Science",
    yearOfStudy: 4,
    description:
      "Covers vector semantics and word embeddings, from frequency-based models to Word2Vec/GloVe and their role in capturing word meaning",
    originalName: "Vector Semantics & Word Embeddings",
    tags: ["NLP", "Machine Learning", "cs425"],
    price: 5,
    type: "notes",
    module: "qf102",
    createdAt: "2025-09-04T13:10:03.602Z",
  },
  {
    id: "68b98faba389fd1819c78c17",
    userId: "594a352c-2081-706e-b679-00b936e6b8f9",
    userFullName: "Ashley Toh",
    userImageUrl:
      "https://plus.unsplash.com/premium_photo-1661913010540-2edd44a5ea43?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8bmF0dXJlJTIwd2F0ZXJ8ZW58MHx8MHx8fDA%3D",
    major: "Computer Science",
    yearOfStudy: 4,
    description:
      "Covers vector semantics and word embeddings, from frequency-based models to Word2Vec/GloVe and their role in capturing word meaning",
    originalName: "Vector Semantics & Word Embeddings",
    tags: ["NLP", "Machine Learning", "cs425"],
    price: 5,
    type: "notes",
    module: "qf102",
    createdAt: "2025-09-04T13:10:03.602Z",
  },
];
const formatCurrency = (n: number) =>
  n.toLocaleString("en-SG", { style: "currency", currency: "SGD" });
export function DataTable() {
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemPerPage] = useState(5)
  console.log(itemsPerPage)

  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentItems = mockData.slice(startIndex, endIndex)

  const totalPages = Math.ceil(mockData.length / itemsPerPage)
  const navigate = useNavigate()
  const [view, setView] = useState("past-performance");

  return (
    <Tabs
      value={view} onValueChange={setView}
      className="w-full flex-col justify-start gap-6 mb-10"
    >
      <div className="flex items-center justify-between px-4 lg:px-6">
        <Label htmlFor="view-selector" className="sr-only">
          View
        </Label>
        <Select defaultValue={view} onValueChange={setView}>
          <SelectTrigger
            className="flex w-fit @4xl/main:hidden"
            size="sm"
            id="view-selector"
          >
            <SelectValue placeholder="Select a view" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="outline">My Notes</SelectItem>
            <SelectItem value="past-performance">Notes Sold</SelectItem>
          </SelectContent>
        </Select>
        <TabsList className="**:data-[slot=badge]:bg-muted-foreground/30 hidden **:data-[slot=badge]:size-5 **:data-[slot=badge]:rounded-full **:data-[slot=badge]:px-1 @4xl/main:flex mb-5">
          <TabsTrigger value="past-performance" className="p-4 transition-all duration-300 hover:!shadow-lg !font-semibold">Listed Notes</TabsTrigger>
          <TabsTrigger value="outline" className="p-4 transition-all duration-300 hover:!shadow-lg !font-semibold">Notes Sold</TabsTrigger>
        </TabsList>
      </div>

      <TabsContent
        value="past-performance"
        className="flex flex-col px-4 lg:px-6 transition-opacity duration-200"
      >
        <NoteDisplay />
      </TabsContent>
      <TabsContent
        value="outline"
        className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6 transition-opacity duration-200"
      >
        <div className="flex-1">

          {/* Content */}
          <Card className="shadow-sm transition-shadow duration-500 hover:shadow-2xl w-[100%]">
            <CardHeader className="pb-2">
              {/* Toolbar */}
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="flex flex-col w-full gap-3 sm:flex-row sm:items-center sm:gap-2">
                  {/* search here */}
                  <div className="relative w-full">
                    <Search className="pointer-events-none absolute left-3 top-2.5 size-4 text-muted-foreground" />
                    <Input
                      placeholder="Search here"
                      className="pl-9 bg-gray-100 text-gray-500 focus:bg-white focus:text-black transition-colors w-full"
                    />
                  </div>

                  {/* drop down here */}
                  {/* Filters */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline">
                        <Filter className="mr-2 size-4" />
                        Filter
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-72" align="start">
                      <DropdownMenuLabel>Date range</DropdownMenuLabel>
                      <div className="px-2 pb-2 text-xs text-muted-foreground">
                        (Stub) Add your Calendar/DateRange picker here
                      </div>
                      <DropdownMenuSeparator />
                      <DropdownMenuLabel>Payment method</DropdownMenuLabel>
                      {(["Card", "Bank Transfer", "Cash", "PayNow"] as const).map(
                        (m) => (
                          <DropdownMenuCheckboxItem
                            key={m}
                          // checked={paymentFilter[m]}
                          // onCheckedChange={(v) =>
                          //   setPaymentFilter((prev) => ({
                          //     ...prev,
                          //     [m]: Boolean(v),
                          //   }))
                          // }
                          >
                            {m}
                          </DropdownMenuCheckboxItem>
                        )
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {/* Status */}
                  <Select
                  value={String(itemsPerPage)}
onValueChange={(v) => setItemPerPage(Number(v))}

                  >
                    <SelectTrigger className="w-[100%] sm:w-[15%]">
                      <SelectValue placeholder="View rows per page" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5 rows</SelectItem>
                      <SelectItem value="10">10 rows</SelectItem>
                      <SelectItem value="15">15 rows</SelectItem>
                      <SelectItem value="20">20 rows</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* <div className="flex items-center gap-2">
                    {selected.length > 0 ? (
                      <>
                        <Button variant="outline" size="sm">
                          <CircleCheck className="mr-2 size-4" />
                          Mark as paid
                        </Button>
                        <Button variant="outline" size="sm">
                          <Truck className="mr-2 size-4" />
                          Mark as shipped
                        </Button>
                        <Button variant="destructive" size="sm">
                          <Trash2 className="mr-2 size-4" />
                          Delete ({selected.length})
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button size="sm">
                          <Plus className="mr-2 size-4" />
                          Create order
                        </Button>
                        <Button variant="outline" size="sm">
                          <RefreshCcw className="mr-2 size-4" />
                          Sync
                        </Button>
                      </>
                    )}
                  </div> */}
              </div>
            </CardHeader>

            <CardContent className="pt-2">

              <div className="overflow-auto rounded-md flex flex-col gap-y-6 lg:hidden ">
                {currentItems.map((o) => {
                  return (
                    <UserActivityListing key={o.id} note={o} location="seller" />
                  )
                })}

              </div>
              <div className="overflow-auto rounded-md border hidden lg:block">
                <Table className="w-full">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="pl-[2rem]">ID</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Customer Name</TableHead>
                      <TableHead>Note Name</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Module</TableHead>
                      <TableHead>Type</TableHead>

                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {currentItems.map((o) => {
                      // const meta = STATUS_META[o.status];
                      return (
                        <>
                          <TableRow key={o.id} className="hover:bg-muted/40 cursor-pointer h-16 table-row w-full" onClick={() => navigate(`/orderdetails`)}>
                            <TableCell className="font-medium pl-[2rem]">
                              {o.id}
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              {new Date(o.createdAt).toLocaleString()}
                            </TableCell>
                            <TableCell>
                              <div className="font-medium">{o.userFullName}</div>
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              {o.originalName}
                            </TableCell>
                            <TableCell className="font-medium">
                              {formatCurrency(o.price)}
                            </TableCell>
                            <TableCell>
                              {o.module}
                            </TableCell>
                            <TableCell>
                              {o.type}
                            </TableCell>
                          </TableRow>
                        </>

                      );
                    })}
                    {mockData.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={9} className="h-24 text-center">
                          No orders match your filters.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              <div className="mt-3 flex items-center justify-between text-sm text-muted-foreground">
                <div>
                  Page {currentPage} of {totalPages}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    Prev
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

      </TabsContent>
      <TabsContent value="key-personnel" className="flex flex-col px-4 lg:px-6">
        <div className="aspect-video w-full flex-1 rounded-lg border border-dashed"></div>
      </TabsContent>
      <TabsContent
        value="focus-documents"
        className="flex flex-col px-4 lg:px-6"
      >
        <div className="aspect-video w-full flex-1 rounded-lg border border-dashed"></div>
      </TabsContent>
    </Tabs>
  )
}


