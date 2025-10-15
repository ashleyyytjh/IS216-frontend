import { z } from "zod"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"

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
import { Search } from "lucide-react"
import { Card, CardContent, CardHeader } from "./ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table"
import { useEffect, useMemo, useState } from "react"
import UserActivityListing from "./user-activity-listing"
import { UserOwnNote } from "./own-user-note-display"
import { getUserOwned } from "@/services/NotesService"
import { getOrders } from "@/services/OrdersService"
import { Badge } from "./ui/badge"
import { UnpublishedNotes } from "./unpublished-notes"

export const schema = z.object({
  id: z.number(),
  header: z.string(),
  type: z.string(),
  status: z.string(),
  target: z.string(),
  limit: z.string(),
  reviewer: z.string(),
})



const formatCurrency = (n: number) =>
  n.toLocaleString("en-SG", { style: "currency", currency: "SGD" });

type CurrentUserProp = {
  currentUser: { userFullName?: string }
}

type OwnedMap = Record<
  string,
  { module: string; type: string; originalName: string; description: string }
>

export function DataTable(props: CurrentUserProp) {
  const navigate = useNavigate()

  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemPerPage] = useState(5)
  const [searchQuery, setSearchQuery] = useState("")


  const [ownedID, setOwnedID] = useState<OwnedMap>({})
  const [orders, setAllOrders] = useState<any[]>([])
  const [view, setView] = useState<"past-performance" | "outline" | "disputes">("past-performance")

  const filteredOrders = useMemo(() => {
    return orders.filter((o) =>
      (o.originalName?.toLowerCase() ?? "").includes(searchQuery.toLowerCase()) ||
      (o.module?.toLowerCase() ?? "").includes(searchQuery.toLowerCase()) ||
      (o.status?.toLowerCase() ?? "").includes(searchQuery.toLowerCase())
    )
  }, [orders, searchQuery])

  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentItems = filteredOrders.slice(startIndex, endIndex)
  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / itemsPerPage))

  useEffect(() => {
    getUserOwned()
      .then((resp: any[]) => {
        const idToData: OwnedMap = {}
        resp?.forEach((item: any) => {
          idToData[item.id] = {
            module: item.module,
            type: item.type,
            originalName: item.originalName,
            description: item.description,
          }
        })
        setOwnedID(idToData)
      })
      .catch(console.error)
  }, [props])

  useEffect(() => {
    getOrders()
      .then((resp: any[] = []) => {
        let userOrder = resp.filter((item: any) =>
          Object.keys(ownedID).includes(item.note_id)
          &&
          item.status === "succeeded"
        )

        userOrder = userOrder.map((i: any) => ({
          ...i,
          userFullName: props.currentUser?.userFullName ?? "Unknown User",
          module: ownedID[i.note_id]?.module,
          type: ownedID[i.note_id]?.type,
          originalName: ownedID[i.note_id]?.originalName,
          description: ownedID[i.note_id]?.description,
        }))


        setAllOrders([...userOrder])
      })
      .catch((e) => {
        console.error(e)

      })
  }, [props, ownedID])

  const renderStatusBadge = (status?: string) => {
    const s = (status || "").toLowerCase()
    return; 
  }

  return (
    <Tabs
      value={view}
      onValueChange={(v) => setView(v as typeof view)}
      className="w-full flex-col justify-start gap-6 mb-10"
    >
      <div className="flex items-center justify-between px-4 lg:px-6">
        <Label htmlFor="view-selector" className="sr-only">
          View
        </Label>
        <TabsList className="flex flex-col h-auto md:flex-row w-[100%] mb-5 mt-10">
          <TabsTrigger
            value="past-performance"
            className="w-full font-semibold hover:shadow-lg data-[state=active]:!font-bold data-[state=active]:shadow-xl p-2 transition-all duration-300"
          >
            Your Listed Notes
          </TabsTrigger>

          <TabsTrigger
            value="outline"
            className="w-full font-semibold hover:shadow-lg data-[state=active]:!font-bold data-[state=active]:shadow-xl p-2 transition-all duration-300"
          >
            Orders You Received
          </TabsTrigger>

           <TabsTrigger
            value="unpublished"
            className="w-full font-semibold hover:shadow-lg data-[state=active]:!font-bold data-[state=active]:shadow-xl p-2 transition-all duration-300"
          >
            Unpublished Notes
          </TabsTrigger>


        </TabsList>
      </div>

      <TabsContent
        value="past-performance"
        className="flex flex-col px-4 lg:px-6 transition-opacity duration-200"
      >
        <UserOwnNote currentUserInfo={props.currentUser as any} />
      </TabsContent>

      <TabsContent
        value="outline"
        className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6 transition-opacity duration-200"
      >
        <div className="flex-1">
          <Card className="shadow-sm transition-shadow duration-500 hover:shadow-2xl w-[100%]">
            <CardHeader className="pb-2">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="flex flex-col w-full gap-3 sm:flex-row sm:items-center sm:gap-2">
                  {/* search */}
                  <div className="relative w-full">
                    <Search className="pointer-events-none absolute left-3 top-2.5 size-4 text-muted-foreground" />
                    <Input
                      placeholder="Search here"
                      className="pl-9 bg-gray-100 text-gray-500 focus:bg-white focus:text-black transition-colors w-full"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>

                  {/* rows per page */}
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
              <div className="overflow-auto rounded-md border hidden lg:block">
                <Table className="w-full">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="pl-[2rem]">Transaction ID</TableHead>
                      <TableHead>Note Name</TableHead>
                      <TableHead>Module</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Type</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {currentItems.map((o) => (
                      <TableRow
                        key={o.id}
                        className="hover:bg-muted/40 cursor-pointer h-16 table-row w-full"
                        onClick={() => navigate(`/orderdetails/${o.id}`, { state: { order: o } })}
                      >
                        <TableCell className="font-medium pl-[2rem]">{o.id}</TableCell>
                        <TableCell>
                          <div className="font-medium">{o.originalName}</div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{o.module.toUpperCase()}</TableCell>
                        <TableCell className="font-medium">{formatCurrency(o.price/100)}</TableCell>
                        <TableCell>
                          <Badge className="bg-green-600">{o?.status.charAt(0).toUpperCase()+ o?.status.slice(1)}</Badge>
                          </TableCell>
                        <TableCell>{o['type'].charAt(0).toUpperCase() + o['type'].slice(1)}</TableCell>
                      </TableRow>
                    ))}
                    {filteredOrders.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={9} className="h-24 text-center">
                          No orders match your filters.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>


              <div className="flex flex-col gap-4 auto-rows-fr lg:hidden">
  <div className="flex flex-col h-full [&>a]:h-full [&>a>div]:h-full w-full gap-y-5">
                {currentItems.map((note) => (
                  <UserActivityListing
                    key={note.id}
                    note={note}
                    onDownload={undefined}
                  />
                ))}
              </div>
              </div>

              <div className="mt-3 flex items-center justify-between text-sm text-muted-foreground">
                <div>Page {currentPage} of {totalPages}</div>
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


     <TabsContent value="unpublished"
        className="flex flex-col px-4 lg:px-6 transition-opacity duration-200">
          <UnpublishedNotes currentUserInfo={props.currentUser as any} />
      </TabsContent>

    </Tabs>
  )
}
