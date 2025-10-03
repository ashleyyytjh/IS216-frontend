"use client"

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
  return `$${value}`
}

const chartConfig = {
  revenue: {
    label: "Revenue:",
    valueFormatter: (v: number) => formatCurrency(Number(v)),
  },
}

export function ChartBarLabel({ moduleRevenueArray }: ChartBarLabelProps) {
  const chartData = moduleRevenueArray.slice(0, 5)
  const isLoading = chartData.length === 0

  return (
    <Card className="h-[400px] flex flex-col shadow-lg transition-all duration-300 hover:!shadow-xl mt-2 mb-10">
      <CardHeader>
        <CardTitle>Top 5 Revenue-Generating Modules</CardTitle>
        <CardDescription>Based on total revenue earned</CardDescription>
      </CardHeader>

      <CardContent className="relative flex-1 flex items-center justify-center h-[380px] px-2 pt-4 sm:px-6 sm:pt-6">
        {/* Spinner overlay */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <SpinItem />
          </div>
        )}

        <ChartContainer
          config={chartConfig}
          className={`relative aspect-auto h-[250px] w-full transition-opacity duration-700 ${
            isLoading ? "opacity-0" : "opacity-100"
          }`}
        >
          <BarChart data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="module"
              tickLine={false}
              tickMargin={2}
              axisLine={false}
              label={{ value: "Modules", position: "insideBottom", offset: -5 }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              width={70}
              domain={[0, "auto"]}
              tickFormatter={(val) => formatCurrency(Number(val))}
              label={{
                value: "Revenue ($)",
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
                position="top"
                offset={4}
                className="fill-foreground"
                fontSize={12}
                formatter={(val: number) => formatCurrency(val)}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}