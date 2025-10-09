import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Frown, NotebookText, ThumbsDown, ThumbsUp } from "lucide-react"
import SpinItem from "./spinner"
import { useEffect, useState } from "react"

type SectionCardsProps = {
  loadInfo: boolean
  totalSales: number
  totalNoteCount: number
  topModule: { module: string; count: number } | null
}

function formatNumber(num: number): string {
  if (num < 1000) {
    return num.toString();
  } else if (num < 1_000_000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, "") + "K";
  } else if (num < 1_000_000_000) {
    return (num / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  } else {
    return (num / 1_000_000_000).toFixed(1).replace(/\.0$/, "") + "B";
  }
}

export function SectionCards({ loadInfo, totalSales, totalNoteCount, topModule }: SectionCardsProps) {
  const [noData, setNoData] = useState(false)
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout> | null = null;
    if (loadInfo) {
      setNoData(false)
      timeout = setTimeout(() => {
        setNoData(true)
      }, 5000)
    } else {
      if (timeout) {
        clearTimeout(timeout)
      }
    }
    return () => {
      if (timeout) {
        clearTimeout(timeout)
      }
    }

  }, [loadInfo])
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-3 @5xl/main:grid-cols-3 mb-5">
      {/* Total Revenue */}
      <Card className=" bg-[#f1f5f9] shadow-lg transition-all duration-300 hover:!shadow-xl">
        <CardHeader>
          <CardDescription>Total Revenue</CardDescription>
          <div className="relative h-8 flex">
            <div className={`absolute transition-opacity duration-700 ${loadInfo ? "opacity-100" : "opacity-0"}`}>
              {
                !noData ? (
                  <SpinItem />
                ) : (
                  <></>
                )
              }
            </div>
            <CardTitle
              className={`absolute text-2xl font-semibold tabular-nums transition-all duration-700 ${loadInfo ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"
                }`}
            >

              ${formatNumber(totalSales)}
            </CardTitle>
          </div>
          <CardAction />
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          {loadInfo ? (
            noData ? (
              <div className="line-clamp-1 flex gap-2 font-medium text-gray-500">
                No data found.
              </div>
            ) : (
              <div className="line-clamp-1 flex gap-2 font-medium text-gray-500">
                Loading your earnings...
              </div>
            )
          ) : totalSales <= 1000 ? (
            <div className="line-clamp-1 flex gap-2 font-medium text-red-500 transition-all duration-500 ease-in-out">
              Earnings have not been great. <IconTrendingDown className="size-4" />
            </div>
          ) : (
            <div className="line-clamp-1 flex gap-2 font-medium text-[#29be8b] transition-all duration-500 ease-in-out">
              Keep it going! <IconTrendingUp className="size-4" />
            </div>
          )}
        </CardFooter>
      </Card>

      {/* Total Notes Sold */}
      <Card className="bg-[#f1f5f9] shadow-lg transition-all duration-300 hover:!shadow-xl">
        <CardHeader>
          <CardDescription>Total Notes Sold</CardDescription>
          <div className="relative h-8 flex">
            <div className={`absolute transition-opacity duration-700 ${loadInfo ? "opacity-100" : "opacity-0"}`}>
              {
                !noData ? (
                  <SpinItem />
                ) : (
                  <></>
                )
              }

            </div>
            <CardTitle
              className={`absolute text-2xl font-semibold tabular-nums transition-all duration-700 ${loadInfo ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"
                }`}
            >
              {totalNoteCount}
            </CardTitle>
          </div>
          <CardAction />
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">

          {loadInfo ? (
            noData ? (
              <div className="line-clamp-1 flex gap-2 font-medium text-gray-500">
                No data found.
              </div>
            ) : (
              <div className="line-clamp-1 flex gap-2 font-medium text-gray-500">
                Loading your total notes sold
              </div>
            )
          ) : totalNoteCount <= 20 ? (
            <div className="line-clamp-1 flex gap-2 font-medium text-red-500">
              You can do better! <Frown className="size-4" />
            </div>
          ) : (
            <div className="line-clamp-1 flex gap-2 font-medium text-[#29be8b]">
              More notes for the community! <ThumbsUp className="size-4" />
            </div>
          )}

        </CardFooter>
      </Card>

      {/* Most Popular Module */}
      <Card className="bg-[#f1f5f9] shadow-lg transition-all duration-300 hover:!shadow-xl">
        <CardHeader>
          <CardDescription>Most Popular Module</CardDescription>
          <div className="relative h-8 flex">
            <div className={`absolute transition-opacity duration-700 ${loadInfo ? "opacity-100" : "opacity-0"}`}>
              {
                !noData ? (
                  <SpinItem />
                ) : (
                  <></>
                )
              }
            </div>
            <CardTitle
              className={`absolute text-2xl font-semibold tabular-nums transition-all duration-700 ${loadInfo ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"
                }`}
            >
              {topModule?.module
                ? topModule.module
                : "-"}
            </CardTitle>
          </div>
          <CardAction />
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">

          {loadInfo ? (
            noData ? (
              <div className="line-clamp-1 flex gap-2 font-medium text-gray-500">
                No data found.
              </div>
            ) : (
              <div className="line-clamp-1 flex gap-2 font-medium text-gray-500">
                Loading your most popular note
              </div>
            )
          ) : topModule ? (
            <div className="line-clamp-1 flex gap-2 font-medium text-red-500">
              {
                topModule.count > 1 ?(
                  <>
                  {topModule.count} notes of {topModule.module} sold. <NotebookText className="size-4" />
                  </>
                ):(
                  <>
                  {topModule.count} note of {topModule.module} sold. <NotebookText className="size-4" /></>
                )
              }
              
            </div>
          ) : (
            <div className="line-clamp-1 flex gap-2 font-medium text-[#29be8b]">
              No popular module data available.
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}