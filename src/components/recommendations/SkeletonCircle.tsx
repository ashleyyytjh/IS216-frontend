import { Skeleton } from "@/components/ui/skeleton"
import { Frown } from "lucide-react"

export function SkeletonCircle({message} :{message:String | null}) {
  return (
    <div className="flex flex-col items-center  space-y-2   justify-center text-center">
      
        {/* <Frown className="my-0 h-auto w-10 mx-auto "/> */}
      
        <span className="text-[16px] text-gray-900">Nothing here yet!</span>
      <span className="text-[12px] text-gray-800 animate-pulse truncate">{message}</span>
   
    </div>
  )
}
