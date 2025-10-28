
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card"
import UserActivityListing from "./user-activity-listing"
import { useEffect, useState } from "react"
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import { Input } from "@/components/ui/input"
import { getUserOrderByUserId } from "@/services/OrdersService"
import { getComposeNoteById, getNotesById, getSingleCompose } from "@/services/NotesService"
import SpinItem from "./spinner"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"

function UserActivity(currentUser) {
    currentUser = currentUser['currentUser']
    let usrID = currentUser.sub
    const [currentPage, setCurrentPage] = useState(1)
    const [searchQuery, setSearchQuery] = useState('');

    const [orders, setOrders] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const notesPerPage = 5
    useEffect(() => {
        if (!usrID) return
        async function fetchOrders() {
            try {
                //might have to tweak this portion if notes are free (dont need to find them.)
                //BUGGED OUT.
                const rawOrders = await getUserOrderByUserId(usrID)
                // rawOrders.push({
                //     buyer_id: `${usrID}`,
                //     id: 109,
                //     note_id: "68f4c9c51a5692f5bcbead5b",
                //     price: 100,
                //     status: "succeeded",
                //     stripe_transaction_id: "pi_3SI0K93X5OiOA0YE1G7ztLfM",
                // })
                const succeededOrders = rawOrders
                const enrichedOrders = await Promise.all(
                    succeededOrders.map(async (order) => {
                        let note: any = null;
                        try {
                            const normal = await getNotesById(order.note_id);
                            if (normal !== undefined && normal !== null) {
                                note = normal
                                note.noteType = "normal";
                                ;
                            } else {
                                console.warn(`Normal note not found (${order.note_id}), trying composed...`);
                                const composedResp = await getSingleCompose(String(order.note_id));
                                if (composedResp?.data) {
                                    note = composedResp?.data;
                                    note.noteType = "composed"
                                } else {
                                    note = null
                                }
                            }
                        } catch (err) {
                        }
                        return { ...order, note };
                    })
                )
                setOrders(enrichedOrders)
            } catch (err) {
                console.error("Error fetching userOrders:", err)
            } finally {
                setLoading(false)
            }
        }
        fetchOrders()
    }, [usrID])
    console.log(orders)


    //GET orders where buyer_id == currentUserID
    //Using above, filter and get the individual note tags (individual note details)

    //Get note name
    //Get mod code
    //Get price - done
    //Get seller name?
    const [statusFilter, setStatusFilter] = useState("All");
    const filteredNotes = orders.filter(note => {
        const query = searchQuery.toLowerCase()
        const matchesSearch =
            //missing some code.
            note?.note?.originalName?.toLowerCase()?.includes(query)
        const matchedQuery = statusFilter == "All" || note.status.toLowerCase() === statusFilter.toLowerCase();
        return matchesSearch && matchedQuery;
    })
    const pagesNeeded = Math.ceil(filteredNotes.length / notesPerPage)
    const startIndex = (currentPage - 1) * notesPerPage
    const endIndex = startIndex + notesPerPage
    const currentNotes = filteredNotes.slice(startIndex, endIndex)

    useEffect(() => {
        setCurrentPage(1)
    }, [searchQuery, statusFilter])

    if (loading) return <div className="flex justify-center items-center w-full h-64"> <SpinItem /></div>
    if (!orders.length) return <div className="flex justify-center items-center w-full h-64"> <p className="text-gray-500">No orders found.</p></div>


    return (

        <Card className="hover:shadow-xl transition-all duration-300">
            <CardHeader>
                <CardTitle>Order History</CardTitle>
                <CardDescription>
                    View your previously purchased notes that remain active.

                </CardDescription>
                <div className="flex justify-center align-middle gap-1.5">
                    <Input placeholder="Search for your notes here." className="mt-3" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-[160px] h-8 text-xs border-gray-200 shadow-sm mt-3 hover:bg-gray-100">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="All">All</SelectItem>
                            <SelectItem value="created">Created</SelectItem>
                            <SelectItem value="processing">Processing</SelectItem>
                            <SelectItem value="succeeded">Success</SelectItem>
                            <SelectItem value="failure">Failure</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </CardHeader>

            <CardContent className="flex flex-col gap-y-5">
                {
                    currentNotes.length > 0 ? (
                        currentNotes.map((note) => {
                            console.log(note)
                            return (
                                <UserActivityListing key={note.id} note={note} />
                            )
                        })

                    ) : (
                        <div className="flex text-center justify-center"><p>No results matches your search.</p></div>
                    )

                }
            </CardContent>

            <CardFooter className="flex justify-center">
                <Pagination>
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious
                                onClick={() => setCurrentPage((p) => p - 1)}
                                className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                            />
                        </PaginationItem>

                        {Array.from({ length: pagesNeeded }).map((_, idx) => (
                            <PaginationItem key={idx}>
                                <PaginationLink
                                    isActive={currentPage === idx + 1}
                                    onClick={() => setCurrentPage(idx + 1)}
                                >
                                    {idx + 1}
                                </PaginationLink>
                            </PaginationItem>
                        ))}

                        <PaginationItem>
                            <PaginationNext
                                onClick={() =>
                                    setCurrentPage((p) => Math.min(p + 1))
                                }
                                className={currentPage === pagesNeeded ? "pointer-events-none opacity-50" : ""}
                            />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </CardFooter>
        </Card>
    )
}
export default UserActivity;