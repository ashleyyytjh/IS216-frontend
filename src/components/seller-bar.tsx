"use client"

import { useEffect, useState } from "react"
import { Bar, BarChart, CartesianGrid, Cell, LabelList, XAxis, YAxis } from "recharts"
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer, ChartTooltip, ChartTooltipContent,
} from "@/components/ui/chart"
import SpinItem from "./spinner"

type ChartBarLabelProps = {
  moduleRevenueArray: { module: string; revenue: number }[]
}

const formatCurrency = (value: number) => {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`
  if (value >= 1_000) return `$${Math.round(value / 1_000)}K`
  return `$${value.toFixed(2)}`
}

const chartConfig = {
  revenue: {
    label: "Revenue:",
    valueFormatter: (v: number) => formatCurrency(Number(v)),
  },
}

export function ChartBarLabel({ moduleRevenueArray }: ChartBarLabelProps) {
  console.log(moduleRevenueArray)
  const [isLoading, setIsLoading] = useState(true)
  const [isEmpty, setIsEmpty] = useState(false)

  useEffect(() => {
    if (moduleRevenueArray.length === 0) {
      // wait 3 seconds before deciding it's truly empty
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

  const chartData = moduleRevenueArray
    .map((item) => ({
      ...item,
      revenue: item.revenue, // convert cents → dollars
    }))
    .slice(0, 5)

  return (
    <Card className="h-[400px] flex flex-col shadow-lg transition-all duration-300 hover:!shadow-xl mt-2 mb-10">
      <CardHeader>
        <CardTitle>Top 5 Revenue-Generating Modules</CardTitle>
        <CardDescription>Based on total revenue earned</CardDescription>
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
            <BarChart data={chartData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="module"
                tickLine={false}
                tickMargin={2}
                axisLine={false}
                label={{ value: "Module Code", position: "insideBottom", offset: -4 }}
                tick={{ fill: "#6B7280", fontSize: 13, fontWeight: 400 }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                width={70}
                domain={[0, "auto"]}
                tickFormatter={(val) => formatCurrency(Number(val))}
                tick={{ fill: "#6B7280", fontSize: 13, fontWeight: 400 }}
                label={{
                  value: "Revenue ($)",
                  angle: -90,
                  position: "insideLeft",
                  dx: -6,
                  style: { textAnchor: "middle" },
                  
                }}
                
              />
              <ChartTooltip
                cursor={false}
                labelFormatter={(label) => `Module: ${label}`}
                formatter={(value: any, _name: any, item: any) => [
                  chartConfig[item.dataKey]?.label,
                  formatCurrency(Number(value)),
                ]}
                content={<ChartTooltipContent hideIndicator />}
              />
              <Bar
                dataKey="revenue"
                fill="var(--chart-1)"
                radius={8}
                barSize={70}
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
                  dataKey="revenue"
                  position="insideTop"
  className="fill-white"
                  offset={4}
                  
                  fontSize={12}
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