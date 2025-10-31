import { Skeleton } from "@/components/ui/skeleton"
import { Frown } from "lucide-react"

export function SkeletonCircle() {
  return (
    <div className="flex items-center space-x-4 justify-center">
      <Skeleton className="h-45 w-70  flex flex-col justify-center text-center gap-2">
        {/* <Frown className="my-0 h-auto w-10 mx-auto "/> */}
        <span className="text-[9px] text-gray-500">Nothing to show for now</span>
      </Skeleton>
      
    </div>
  )
}
