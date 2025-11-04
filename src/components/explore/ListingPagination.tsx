import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { useListing } from "./ListingContext"
import { cn } from "@/lib/utils"

export default function ListingPagination() {
  const { page, setPage, limit, total } = useListing()
  const totalPages = Math.ceil(total / limit)

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={(e) => {
              e.preventDefault()
              if (page > 1) setPage(page - 1)
            }}
                          className={cn(
              page <= 1 && "pointer-events-none opacity-50 cursor-not-allowed"
            )}
          />
        </PaginationItem>

        {Array.from({ length: totalPages }).map((_, i) => {
          const pageNum = i + 1
          return (
            <PaginationItem key={pageNum}>
              <PaginationLink
                aria-disabled={page === 1}
                href="#"
                isActive={page === pageNum}
                onClick={(e) => {
                  e.preventDefault()
                  setPage(pageNum)
                }}
              >
                {pageNum}
              </PaginationLink>
            </PaginationItem>
          )
        })}

        <PaginationItem>
          <PaginationNext
            href="#"
            aria-disabled={page === totalPages}
            className={cn(
              page >= totalPages && "pointer-events-none opacity-50 cursor-not-allowed"
            )}
            onClick={(e) => {
              e.preventDefault()
              if (page < totalPages) setPage(page + 1)
            }}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
