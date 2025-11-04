"use client"

import { useNavigate } from "react-router-dom"
import { useEffect, useMemo, useState } from "react"
import { Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import UserActivityListing from "@/components/user-activity-listing"
import { stringFormat } from "@/components/utils"

//refactor to ensure components.
export function OrderReceived({
  orders,
  formatCurrency,
}: {
  orders: any[]
  formatCurrency: (n: number) => string
}) {
  const navigate = useNavigate()
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemPerPage] = useState(5)
  const [searchQuery, setSearchQuery] = useState("")

  const filteredOrders = useMemo(() => {
    return orders.filter((o) =>
      (o.originalName?.toLowerCase() ?? "").includes(searchQuery.toLowerCase()) ||
      (o.module?.toLowerCase() ?? "").includes(searchQuery.toLowerCase()) ||
      (o.status?.toLowerCase() ?? "").includes(searchQuery.toLowerCase())
    )
  }, [orders, searchQuery])

  //pagination stuff
  const startIndex = (currentPage - 1) * itemsPerPage //next few pages the start.
  const endIndex = startIndex + itemsPerPage
  let currentItems = filteredOrders.slice(startIndex, endIndex) //slice to get the actual item
  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / itemsPerPage))

  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, itemsPerPage, orders])

  return (
    <div className="flex-1 space-y-3">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-row w-full gap-3 sm:flex-row sm:items-center sm:gap-2">
          <div className="relative flex-1 opacity-70 focus-within:opacity-100 transition-opacity">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              type="search"
              placeholder="Search for notes..."
              className="pl-9 bg-gray-100 text-gray-500 focus:bg-white focus:text-black transition-colors w-full"
            />
          </div>
          <Select
            value={String(itemsPerPage)}
            onValueChange={(v) => setItemPerPage(Number(v))}

          >
            <SelectTrigger className="w-[150px] sm:w-[80px] md:w-[170px]">
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

      <>
        {
          currentItems.length == 0 ? (
            <div className="flex justify-center border-none mt-5">
              <p className="text-muted-foreground text-sm">No orders found.</p>
            </div>
          ) : (
            <>
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
                        className="hover:bg-muted/40 cursor-pointer h-4 table-row w-full"
                        onClick={() => navigate(`/orderdetails/${o.id}`, { state: { order: o } })}
                      >
                        <TableCell className="font-medium pl-[2rem]">{o.id}</TableCell>
                        <TableCell>
                          <div className="font-medium">{o.originalName}</div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {o.module.toUpperCase()}
                        </TableCell>
                        <TableCell className="font-medium">
                          {formatCurrency(o.price / 100)}
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-green-50 hover:bg-green-100 text-green-700">
                            {o?.status.charAt(0).toUpperCase() + o?.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>{stringFormat(o["noteType"])}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

              </div>
              <div className="mt-5 flex items-center justify-center text-sm text-muted-foreground pb-1">
                <div className="lg:flex items-center gap-2 hidden">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    Prev
                  </Button>
                  <div>Page {currentPage} of {totalPages}</div>
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

              <div className="flex flex-col gap-4 auto-rows-fr lg:hidden">
                <div className="flex flex-col h-full [&>a]:h-full [&>a>div]:h-full w-full gap-y-5">
                  {currentItems.map((note) => (
                    <UserActivityListing key={note.id} note={note} />
                  ))}
                  <div className="mt-5 flex items-center justify-center text-sm text-muted-foreground pb-1">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                        disabled={currentPage === 1}
                      >
                        Prev
                      </Button>
                      <div>Page {currentPage} of {totalPages}</div>
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
                </div>
              </div>
            </>


          )
        }

      </>

    </div>
  )
}