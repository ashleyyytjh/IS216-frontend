"use client"

import { useEffect, useMemo, useState } from "react"
import { Bar, BarChart, CartesianGrid, Cell, LabelList, XAxis, YAxis } from "recharts"
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer, ChartTooltip, ChartTooltipContent,
} from "@/components/ui/chart"
import SpinItem from "./spinner"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useMediaQuery } from "usehooks-ts"
type ChartBarLabelProps = {
  moduleRevenueArray: { module: string; revenue: number }[]
}

const formatCurrency = (value: number) => {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`
  if (value >= 1_000) return `$${Math.round(value / 1_000)}K`
  return `$${value.toFixed(2)}`
}

type SafeLabelProps = {
  x?: number | string
  y?: number | string
  width?: number | string
  height?: number | string
  value?: number | string
  viewBox?: { x: number; y: number; width: number; height: number }
}


const chartConfig = {
  revenue: {
    label: "Revenue:",
    valueFormatter: (v: number) => formatCurrency(Number(v)),
  },
}

export function ChartBarLabel({ moduleRevenueArray }: ChartBarLabelProps) {
  const smallSize = useMediaQuery("(max-width: 400px)");
  const overlapBP = useMediaQuery("(max-width: 419px)");
  type CustomLabelProps = {
    x?: number
    y?: number
    width?: number
    height?: number
    value?: number | string
    viewBox?: { x: number; y: number; width: number; height: number }
  }
  const [isLoading, setIsLoading] = useState(true)
  const [isEmpty, setIsEmpty] = useState(false)
  const [topMod, setTopMod] = useState<{ module: string; revenue: number } | null>(null)
  const [moduleFilter, setModuleFilter] = useState("All")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")

  useEffect(() => {
    if (moduleRevenueArray.length === 0) {
      const timeout = setTimeout(() => {
        setIsLoading(false)
        setIsEmpty(true)
      }, 3000)
      return () => clearTimeout(timeout)
    } else {
      setIsLoading(false)
      setIsEmpty(false)
    }
  }, [moduleRevenueArray])

  const chartData = useMemo(() => {
    if (!moduleRevenueArray || moduleRevenueArray.length === 0) return []
    let filtered = [...moduleRevenueArray]
    if (moduleFilter !== "All") {
      filtered = filtered.filter((item) => item.module === moduleFilter)
    }
    filtered.sort((a, b) =>
      sortOrder === "asc" ? a.revenue - b.revenue : b.revenue - a.revenue
    )
    return filtered.slice(0, 5)
  }, [moduleRevenueArray, moduleFilter, sortOrder])

  useEffect(() => {
    if (chartData.length > 0) {
      const top = chartData[0]
      setTopMod((prev) =>
        prev?.module === top.module && prev?.revenue === top.revenue ? prev : top
      )
    }
  }, [chartData])



  return (
    <Card className="min-h-[400px] flex flex-col shadow-lg transition-all duration-300 hover:!shadow-xl mt-2 mb-10">
      <CardHeader className="pb-2">
        <div className="flex flex-wrap items-start justify-between gap-2 sm:gap-3 mb-2">
          <CardTitle className="text-base font-semibold text-gray-800">
            Top Revenue-Generating Modules
          </CardTitle>

          <div className="flex flex-col sm:flex-row sm:justify-end sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
            <Select value={moduleFilter} onValueChange={setModuleFilter}>
              <SelectTrigger className="w-[130px] h-7 text-xs border-gray-200 shadow-sm px-2 rounded-md hover:bg-gray-100">
                <SelectValue placeholder="Module" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All</SelectItem>
                {moduleRevenueArray.map((m, i) => (
                  <SelectItem key={i} value={m.module}>
                    {m.module}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortOrder} onValueChange={(v) => setSortOrder(v as "asc" | "desc")}>
              <SelectTrigger className="w-[130px] h-7 text-xs border-gray-200 shadow-sm px-2 rounded-md hover:bg-gray-100">
                <SelectValue placeholder="Sort" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="desc">Decreasing</SelectItem>
                <SelectItem value="asc">Increasing</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>


      <CardContent className="relative flex-1 flex items-center justify-center h-[380px] sm:h-[380px] xs:h-[300px] max-[400px]:h-[250px] px-2 pt-4 sm:px-6 sm:pt-6 space-y-3 sm:space-y-4">
        {isLoading ? (
          <SpinItem />
        ) : isEmpty ? (
          <p className="text-gray-500 text-sm">No data found.</p>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="relative aspect-auto h-[250px] sm:h-[250px] xs:h-[200px] max-[400px]:h-[160px] w-full transition-opacity duration-700">
            <BarChart data={chartData} style={{ overflow: "hidden" }}>
              <CartesianGrid stroke="#e5e7eb" strokeDasharray="3 3" opacity={0.8} />
              <XAxis
                dataKey="module"
                tickLine={false}
                interval={0}
                tickMargin={2}
                axisLine={false}
                label={{ value: "Module Code", position: "insideBottom", offset: -4 }}
                tick={{ fill: "#6B7280", fontSize: smallSize ? 9 : 13, fontWeight: 400 }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                width={70}
                domain={[0, "auto"]}
                tickFormatter={(val) => formatCurrency(Number(val))}
                tick={{ fill: "#6B7280", fontSize: smallSize ? 11 : 13, fontWeight: 400 }}
                label={{value: "Revenue ($)",angle: -90,
                  position: "insideLeft",
                  dx: -6,
                  style: { textAnchor: "middle" },

                }}

              />
              <ChartTooltip
                cursor={false}
                labelFormatter={(label) => `Module: ${label}`}
                formatter={(value: any, name: any, item: any) => [
                  chartConfig[item.dataKey]?.label,
                  formatCurrency(Number(value)),
                ]}
                content={<ChartTooltipContent hideIndicator />}
              />
              <Bar
                dataKey="revenue"
                fill="var(--chart-1)"
                radius={8}
                barSize={smallSize ? 25 : 50}
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
                <LabelList
                  dataKey="revenue"
                  position="top"
                  className="fill-gray-700"
                  offset={4}
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  // @ts-ignore
                  content={(props: SafeLabelProps) => {
                    // make sure everything is numeric
                    const x = Number(props.x ?? 0)
                    const y = Number(props.y ?? 0)
                    const width = Number(props.width ?? 0)
                    const value = Number(props.value ?? 0)

                    const labelY = y - 6        
                    const chartTop = 0          
                    if (labelY < chartTop) return null

                    return (
                      <text
                        x={x + width / 2}
                        y={labelY}
                        fill={overlapBP ? "black" : "#374151"}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fontSize={overlapBP ? 8 : 12}
                        pointerEvents="none"
                      >
                        {formatCurrency(value)}
                      </text>
                    )
                  }}
                  fontSize={overlapBP ? 8 : 12}
                  formatter={(val: number) => formatCurrency(val)}
                />
              </Bar>
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}