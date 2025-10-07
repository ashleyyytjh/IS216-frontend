"use client"

import { useEffect, useMemo, useState } from "react"
import { Bar, BarChart, CartesianGrid, Cell, LabelList, XAxis, YAxis } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import SpinItem from "./spinner"

type ChartBarNotesProps = {
  moduleCountsArray: { module: string; count: number }[]
}

const formatCount = (value: number) => {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`
  if (value >= 1_000) return `${Math.round(value / 1_000)}K`
  return `${value}`
}

const chartConfig = {
  count: {
    label: "Notes Sold:",
    valueFormatter: (v: number) => formatCount(Number(v)),
  },
}

export function ChartPieInteractive({ moduleCountsArray }: ChartBarNotesProps) {
  console.log(moduleCountsArray)
  const [isLoading, setIsLoading] = useState(true)
  const [isEmpty, setIsEmpty] = useState(false)
  const [topMod, setTopMod] = useState<{ module: string; count: number } | null>(null)

  useEffect(() => {
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

  // const chartData = moduleCountsArray.slice(0, 5)

  const chartData = useMemo(() => {
    if (!moduleCountsArray || moduleCountsArray.length === 0) return []
    // sort descending by revenue
    return [...moduleCountsArray]
      .map((item) => ({ ...item, count: item.count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)
  }, [moduleCountsArray])

  useEffect(() => {
    if (chartData.length > 0) {
      const top = chartData[0]
      setTopMod((prev) =>
        prev?.module === top.module && prev?.count === top.count ? prev : top
      )
    }
  }, [chartData])



  return (
    <Card className="h-[400px] flex flex-col shadow-lg transition-all duration-300 hover:!shadow-xl mt-2 mb-10">
      <CardHeader>
        <CardTitle>Amount of Notes Sold</CardTitle>
        {
          isLoading ? (<></>) :

            isEmpty ? (<></>) : (<CardDescription><strong>Insight:</strong> Best performing note by revenue is <strong>{topMod?.module}</strong></CardDescription>
            )
        }
      </CardHeader>

      <CardContent className="relative flex-1 flex items-center justify-center h-[380px] px-2 pt-4 sm:px-6 sm:pt-6">
        {isLoading ? (
          <SpinItem />
        ) : isEmpty ? (
          <p className="text-gray-500 text-sm">No data found.</p>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="relative aspect-auto h-[250px] w-full transition-opacity duration-700"
          >
            <BarChart layout="vertical" data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                type="number"
                tickLine={false}
                axisLine={false}
                tickMargin={2}
                tickFormatter={(val) => formatCount(Number(val))}
                tick={{ fill: "#6B7280", fontSize: 13, fontWeight: 400 }}
                label={{
                  value: "Amount of notes sold",
                  position: "insideBottom",
                  offset: -5,
                }}
              />
              <YAxis
                dataKey="module"
                type="category"
                tickLine={false}
                axisLine={false}
                width={70}
                tick={{ fill: "#6B7280", fontSize: 13, fontWeight: 400 }}
                label={{
                  value: "Module Code",
                  angle: -90,
                  position: "insideLeft",
                  style: { textAnchor: "middle" },
                }}
              />
              <ChartTooltip
                cursor={false}
                labelFormatter={(label) => `Module: ${label}`}
                formatter={(value: any, _name: any, item: any) => [
                  chartConfig[item.dataKey]?.label,
                  formatCount(Number(value)),
                ]}
                content={<ChartTooltipContent hideIndicator />}
              />
              <Bar
                dataKey="count"
                radius={[0, 8, 8, 0]}
                barSize={40}
                isAnimationActive
                animationDuration={800}
                animationEasing="ease-in-out"
              >
                {chartData.map((_entry, index) => (
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
                  dataKey="count"
                  position="insideRight"
                  className="fill-white"
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