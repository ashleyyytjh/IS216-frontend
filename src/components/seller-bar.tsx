"use client"

import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts"

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
import Spinner from "./spinner"
import "../components/customcss/charts.css";
import SpinItem from "./spinner"

type ChartBarLabelProps = {
  moduleRevenueArray: { module: string; revenue: number }[]
}

export function ChartBarLabel({ moduleRevenueArray }: ChartBarLabelProps) {
  const chartData = moduleRevenueArray.slice(0, 5) // top 5 only
  const isLoading = chartData.length === 0

  return (
    <Card className="h-[400px] flex flex-col shadow-lg transition-all duration-300 hover:!shadow-xl mt-2 mb-10">
      <CardHeader>
        <CardTitle>Top 5 Revenue-Generating Modules</CardTitle>
        <CardDescription>Based on total revenue earned</CardDescription>
      </CardHeader>
      <CardContent className="relative flex-1 flex items-center justify-center h-[380px] px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={{}}
          className="relative aspect-auto h-[250px] w-full"
        >
          {/* Spinner overlay */}
          <div
            className={`absolute inset-0 flex items-center justify-center transition-opacity duration-500 ${
              isLoading ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            <SpinItem />
          </div>

          {/* Chart (always mounted) */}
          <BarChart
            data={chartData}
            className={`aspect-auto h-[250px] w-full transition-opacity duration-700 ${
              isLoading ? "opacity-0" : "opacity-100"
            }`}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="module"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              width={60}
              tickFormatter={(val) => `$${val}`}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar
              dataKey="revenue"
              fill="var(--chart-1)"
              radius={8}
              barSize={70}
              isAnimationActive={true}
              animationDuration={800}
              animationEasing="ease-in-out"
            >
              <LabelList
                dataKey="revenue"
                position="top"
                offset={4}
                className="fill-foreground"
                fontSize={12}
                formatter={(val: number) => `$${val}`}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}