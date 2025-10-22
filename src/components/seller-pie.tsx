"use client"

import { useEffect, useMemo, useState } from "react"
import { Bar, BarChart, CartesianGrid, Cell, LabelList, XAxis, YAxis } from "recharts"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import SpinItem from "./spinner"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useMediaQuery } from "usehooks-ts";
import { formatCount } from "./utils"
type ChartBarNotesProps = {
  moduleCountsArray: { module: string; count: number }[]
}

const chartConfig = {
  count: {
    label: "Notes Sold:",
    valueFormatter: (v: number) => formatCount(Number(v)),
  },
}

export function ChartPieInteractive({ moduleCountsArray }: ChartBarNotesProps) {
  console.log(moduleCountsArray) //getting from data preprocessing from parent.
  const [isLoading, setIsLoading] = useState(true)
  const [isEmpty, setIsEmpty] = useState(false)
  const [topMod, setTopMod] = useState<{ module: string; count: number } | null>(null)
  const [moduleFilter, setModuleFilter] = useState("All")
  const [sortOrder, setSortOrder] = useState("desc")

  useEffect(() => {
    //checking if after 3 secodn data not here yet, then I'll set as something wrong.
    if (moduleCountsArray.length === 0) {
      const timeout = setTimeout(() => {
        setIsLoading(false)
        setIsEmpty(true)
      }, 3000)
      return () => clearTimeout(timeout)
    } else {
      setIsLoading(false)
      setIsEmpty(false)
    }
  }, [moduleCountsArray])


  //computing and sorting of data like according to asc/desc or the filtering by selectrtrigger.
  //always returns top 5 for chart data to prevent cluttering.
  const chartData = useMemo(() => {
    if (!moduleCountsArray || moduleCountsArray.length === 0) return []
    let filtered = [...moduleCountsArray]
    if (moduleFilter !== "All") {
      filtered = filtered.filter((item) => item.module === moduleFilter)
    }
    filtered.sort((a, b) =>
      sortOrder === "asc" ? a.count - b.count : b.count - a.count
    )

    return filtered.slice(0, 5)
  }, [moduleCountsArray, moduleFilter, sortOrder])

  //get stat of top mod by preprocessing.
  useEffect(() => {
    if (chartData.length > 0) {
      const top = chartData[0]
      setTopMod((prev) =>
        prev?.module === top.module && prev?.count === top.count ? prev : top
      )
    }
  }, [chartData])


  const onSmallScreen = useMediaQuery("(max-width: 400px)"); //smallscreen using mediaquery hooks.
  return (
    <Card className="min-h-[400px] flex flex-col shadow-lg transition-all duration-300 hover:!shadow-xl mt-2 mb-10">
      <CardHeader className="pb-2">
        <div className="flex flex-wrap items-start justify-between gap-2 sm:gap-3">
          <CardTitle className="text-base font-semibold text-gray-800">
            Amount of Notes Sold by Module
          </CardTitle>

          <div className="flex flex-col sm:flex-row sm:justify-end sm:items-center gap-1 sm:gap-1 w-full sm:w-auto">
            <div className="w-[130px] max-[400px]:w-[100px] max-[400px]:text-sm max-[400px]:h-6">
              <Select value={moduleFilter} onValueChange={setModuleFilter}>
                <SelectTrigger className="w-full h-7 text-xs border-gray-200 shadow-sm px-2 rounded-l-md hover:bg-gray-100">
                  <SelectValue placeholder="Module" />
                </SelectTrigger>
                <SelectContent className="w-[var(--radix-select-trigger-width)]">
                  <SelectItem value="All">All</SelectItem>
                  {moduleCountsArray.map((m, i) => (
                    <SelectItem key={i} value={m.module}>
                      {m.module}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="w-[130px] max-[400px]:w-[115px] max-[400px]:text-sm max-[400px]:h-6 max-[400px]:mt-4">
              <Select value={sortOrder} onValueChange={(v) => setSortOrder(v as "asc" | "desc")}>
                <SelectTrigger className="w-full h-7 text-xs border-gray-200 shadow-sm px-2 rounded-l-md hover:bg-gray-100">
                  <SelectValue placeholder="Sort" />
                </SelectTrigger>
                <SelectContent className="w-[var(--radix-select-trigger-width)]">
                  <SelectItem value="desc">Decreasing</SelectItem>
                  <SelectItem value="asc">Increasing</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="relative flex-1 flex items-center justify-center h-[380px] sm:h-[380px] xs:h-[300px] max-[400px]:h-[250px] px-2 pt-4 sm:px-6 sm:pt-6">
        {isLoading ? (
          <SpinItem />
        ) : isEmpty ? (
          <p className="text-gray-500 text-sm">No data found.</p>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="relative aspect-auto h-[250px] sm:h-[250px] xs:h-[200px] max-[400px]:h-[160px] w-full transition-opacity duration-700"
          >
            <BarChart layout="vertical" data={chartData} margin={{ right: 40, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" /> {/* show grid on the bars. */}
              {/* Axis lines formatting like ticks, axis etc. label to offset and dy. */}
              <XAxis
                type="number"
                tickLine={false}
                axisLine={false}
                tickMargin={2}
                tickFormatter={(val) => formatCount(Number(val))}
                tick={{ fill: "#6B7280",fontSize: onSmallScreen ? 11 : 13, fontWeight: 400 }}
                label={{
                  value: "Amount of notes sold",
                  position: "outsideBottom",
                  offset: -10,
                  dy: 10
                }}
              />
              {/* For y axis. */}
              <YAxis
                dataKey="module"
                type="category"
                tickLine={false}
                axisLine={false}
                width={70}
                tick={{ fill: "#6B7280", fontSize: onSmallScreen ? 11 : 13, fontWeight: 400 }}
                label={{
                  value: "Module Code",
                  angle: -90,
                  position: "insideLeft",
                  style: { textAnchor: "middle" },
                }}
              />
              {/* Shows the tool tip of our barchart when we hover. */}
              <ChartTooltip
                cursor={false}
                labelFormatter={(label) => `Module: ${label}`}
                formatter={(value: any, name: any, item: any) => [
                  chartConfig[item.dataKey]?.label,
                  formatCount(Number(value)),
                ]}
                content={<ChartTooltipContent hideIndicator />}
              />
              {/* Actual bar values. mapping by chartData */}
              <Bar
                dataKey="count"
                radius={[0, 8, 8, 0]}
                barSize={onSmallScreen?20 :40}
                isAnimationActive
                animationDuration={800}
                animationEasing="ease-in-out"
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"][
                      index % 5
                      ]
                    }
                  />
                ))}
                {/* Your labels like cs102, cs103, 104 */}
                <LabelList
                  dataKey="count"
                  position="right"
                  className="fill-gray-700"
                  fontSize={12}
                  formatter={(val: number) => formatCount(val)}
                />
              </Bar>
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}