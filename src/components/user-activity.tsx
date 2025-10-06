
import { myNotes, type Note } from "@/types/types"
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
// import { myNotes } from "@/types/types"
import { Input } from "@/components/ui/input"
import { getOrders, getUserOrderByUserId } from "@/services/OrdersService"
import { getNotesById } from "@/services/NotesService"
import SpinItem from "./spinner"

function UserActivity(currentUser) {


    currentUser = currentUser['currentUser']
    let usrID = currentUser.sub

    console.log(usrID)
    const [currentPage, setCurrentPage] = useState(1)
    const [searchQuery, setSearchQuery] = useState('');

    const [orders, setOrders] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const notesPerPage = 5
    console.log(usrID)
    useEffect(() => {
        if (!usrID) return
        async function fetchOrders() {
            try {
                //user's raw orders
                const rawOrders = await getUserOrderByUserId(usrID)
                console.log("Raw orders returned:", rawOrders)

                // remove duplicates by note_id
                const uniqueOrders = rawOrders.filter(
                    (order, index, self) =>
                        index === self.findIndex((o) => o.note_id === order.note_id)
                )

                const enrichedOrders = await Promise.all(
                    uniqueOrders.map(async (order) => {
                        console.log("note_id passed to getNotesById:", order.note_id)
                        const note = await getNotesById(order.note_id)
                        return { ...order, note }
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

    const filteredNotes = orders.filter(note => {
        const query = searchQuery.toLowerCase()
        return (
            note['note']['tags'][0].toLowerCase().includes(query) ||
            note.note.description.toLowerCase().includes(query) ||
            note.note.module.toLowerCase().includes(query)
        )
    })
    const pagesNeeded = Math.ceil(filteredNotes.length / notesPerPage)
    const startIndex = (currentPage - 1) * notesPerPage
    const endIndex = startIndex + notesPerPage
    const currentNotes = filteredNotes.slice(startIndex, endIndex) //slicing the myNotes according to page.

    useEffect(() => {
        setCurrentPage(1)
    }, [searchQuery])
    if (loading) return <div className="flex justify-center items-center w-full h-64"> <SpinItem /></div>
    if (!orders.length) return <div className="flex justify-center items-center w-full h-64"> <p className="text-gray-500">No orders found.</p></div>


    return (

        <Card className="hover:shadow-xl transition-all duration-300">
            <CardHeader>
                <CardTitle>Purchased Notes</CardTitle>
                <CardDescription>
                    Your recent purchases and activity.
                    <Input placeholder="Search for your notes here." className="mt-3" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-y-5">
                {
                    currentNotes.map((note) => {
                        return (
                            <UserActivityListing key={note.id} note={note} onDownload={undefined} />
                        )
                    })
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