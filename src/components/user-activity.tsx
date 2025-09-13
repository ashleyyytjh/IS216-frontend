
import type { Note } from "@/types/types"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card"
import UserActivityListing from "./user-activity-listing"
import { useState } from "react"
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import { myNotes } from "@/types/types"


function UserActivity(currentUser) {

    currentUser = currentUser['currentUser']
    const [currentPage, setCurrentPage] = useState(1)
    const notesPerPage = 4
    const pagesNeeded = Math.ceil(myNotes.length / notesPerPage)
    const startIndex = (currentPage - 1) * notesPerPage
    const endIndex = startIndex + notesPerPage
    const currentNotes = myNotes.slice(startIndex, endIndex) //slicing the myNotes according to page.
    return (
        <Card className="hover:shadow-xl transition-all duration-300">
            <CardHeader>
                <CardTitle>Purchased Notes</CardTitle>
                <CardDescription>
                    Your recent purchases and activity.
                </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-y-5">
                {
                    currentNotes.map((note) => {
                        return (
                            <UserActivityListing key={note.id} note={note} />
                        )
                    })
                }
            </CardContent>

            <CardFooter className="flex justify-center">
                <Pagination>
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious
                                onClick={() => setCurrentPage((p) => p-1)}
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