
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
import { IconDotsVertical } from "@tabler/icons-react"
import { Filter, Search } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader } from "./ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table"
import { NoteListing } from "@/types/types"
import { useEffect, useState } from "react"
import UserActivityListing from "./user-activity-listing"
import { UserOwnNote } from "./own-user-note-display"
import { getUserOwned } from "@/services/NotesService"
import { getOrders } from "@/services/OrdersService"
import { Description } from "@radix-ui/react-dialog"

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


const formatCurrency = (n: number) =>
  n.toLocaleString("en-SG", { style: "currency", currency: "SGD" });
export function DataTable(currentUser) {
  console.log(currentUser['currentUser'])
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemPerPage] = useState(5)
  const [ownedID, setOwnedID] = useState({})
  const [orders, setAllOrders] = useState([])

  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentItems = orders.slice(startIndex, endIndex)

  const totalPages = Math.ceil(orders.length / itemsPerPage)
  const navigate = useNavigate()
  const [view, setView] = useState("past-performance");

  //get all notes owned by the person first using '/v1/notes/owned'
  //store the notes in an array of id
  //iterate through orders to get the orders.

  useEffect(() => {
    getUserOwned()
      .then((resp) => {
        const idToData: Record<string, { module: string; type: string; originalName: string, description: string }> = {}
        resp.forEach(item => {
          console.log(item)
          idToData[item.id] = {
            module: item.module,
            type: item.type,
            originalName: item.originalName,
            description: item.description
          }
        })
        setOwnedID(idToData)
      })
      .catch(console.error)
  }, [currentUser])
  useEffect(() => {
    getOrders()
      .then((resp) => {
        let userOrder = resp.filter(item =>
          Object.keys(ownedID).includes(item.note_id)
        )

        userOrder = userOrder.map(i => ({
          ...i,
          userFullName: currentUser.currentUser.userFullName,
          module: ownedID[i.note_id].module,
          type: ownedID[i.note_id].type,
          originalName: ownedID[i.note_id].originalName,
          description: ownedID[i.note_id].description

        }))

        setAllOrders(userOrder)
      })
      .catch(console.error)
  }, [currentUser, ownedID])

  console.log(orders)
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
            <SelectItem value="past-performance">Orders received</SelectItem>
          </SelectContent>
        </Select>
        <TabsList className="z-20 **:data-[slot=badge]:bg-muted-foreground/30 hidden **:data-[slot=badge]:size-5 **:data-[slot=badge]:rounded-full **:data-[slot=badge]:px-1 @4xl/main:flex mb-5">
          <TabsTrigger value="past-performance" className="p-4 transition-all duration-300 hover:!shadow-lg !font-semibold">Listed Notes</TabsTrigger>
          <TabsTrigger value="outline" className="p-4 transition-all duration-300 hover:!shadow-lg !font-semibold">Orders Received</TabsTrigger>
        </TabsList>
      </div>

      <TabsContent
        value="past-performance"
        className="flex flex-col px-4 lg:px-6 transition-opacity duration-200"
      >
        <UserOwnNote currentUserInfo={currentUser['currentUser']} />
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
              </div>
            </CardHeader>

            <CardContent className="pt-2">

              <div className="overflow-auto rounded-md flex flex-col gap-y-6 lg:hidden ">
                {/* {currentItems.map((o) => {
                  console.log(o)
                  return (
                    <UserActivityListing key={o.id} note={o} location="seller" />
                  )
                })} */}

              </div>
              <div className="overflow-auto rounded-md border hidden lg:block">
                <Table className="w-full">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="pl-[2rem]">ID</TableHead>
                      <TableHead>Note Name</TableHead>
                      <TableHead>Note Name</TableHead>
                      <TableHead>Module</TableHead>
                      <TableHead>Price</TableHead>

                      <TableHead>Type</TableHead>

                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {currentItems.map((o) => {
                      console.log(o)
                      return (
                        <>
                          <TableRow key={o.id} className="hover:bg-muted/40 cursor-pointer h-16 table-row w-full" onClick={() => navigate(`/orderdetails`)}>
                            <TableCell className="font-medium pl-[2rem]">
                              {o.id}

                            </TableCell>
                            <TableCell>
                              <div className="font-medium">{o.originalName}</div>
                              <p className="text-sm text-muted-foreground whitespace-normal break-words leading-relaxed">
                                {o.description}
                              </p>
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              {o.module}
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
                    {orders.length === 0 && (
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


