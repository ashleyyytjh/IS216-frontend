"use client"

import * as React from "react"
import { Label, Pie, PieChart, ResponsiveContainer, Sector } from "recharts"
import { PieSectorDataItem } from "recharts/types/polar/Pie"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartStyle,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import SpinItem from "./spinner"

type ChartPieInteractiveProps = {
  title: string
  subtitle: string
  moduleCountsArray: { module: string; count: number }[]
}

export function ChartPieInteractive({
  title,
  subtitle,
  moduleCountsArray,
}: ChartPieInteractiveProps) {
  const id = "pie-interactive"

  const [activeMod, setActiveMod] = React.useState<string | null>(null)
  const [hasMounted, setHasMounted] = React.useState(false)

  // First load handling
  React.useEffect(() => {
    if (moduleCountsArray.length > 0) {
      setActiveMod((prev) => prev ?? moduleCountsArray[0].module)
      const t = setTimeout(() => setHasMounted(true), 120) // smooth fade-in
      return () => clearTimeout(t)
    }
  }, [moduleCountsArray])

  const pieData = React.useMemo(
    () =>
      moduleCountsArray.map((d, idx) => ({
        ...d,
        fill: `var(--chart-${(idx % 5) + 1})`,
      })),
    [moduleCountsArray]
  )

  const activeIndex = React.useMemo(() => {
    if (!pieData.length || !activeMod) return -1
    return pieData.findIndex((item) => item.module === activeMod)
  }, [activeMod, pieData])

  const modules = React.useMemo(
    () => moduleCountsArray.map((d) => d.module),
    [moduleCountsArray]
  )

  const isLoading = moduleCountsArray.length === 0

  return (
    <Card
      data-chart={id}
      className="flex flex-col shadow-lg transition-all duration-300 hover:!shadow-xl mt-2 mb-10 h-[400px]"
    >
      <ChartStyle id={id} config={{}} />

      {/* Header */}
      <CardHeader className="flex-row items-start space-y-0 pb-2 relative z-20">
        <div className="grid gap-1">
          <CardTitle>{title}</CardTitle>
          <CardDescription>{subtitle}</CardDescription>
        </div>

        <Select value={activeMod ?? ""} onValueChange={(val) => setActiveMod(val)}>
          <SelectTrigger
            className="ml-auto h-7 w-[160px] rounded-lg pl-2.5 relative z-20"
            aria-label="Select module"
          >
            <SelectValue placeholder="Select module" />
          </SelectTrigger>
          <SelectContent align="end" className="rounded-xl">
            {modules.map((mod, idx) => (
              <SelectItem key={mod} value={mod} className="rounded-lg [&_span]:flex">
                <div className="flex items-center gap-2 text-xs">
                  <span
                    className="flex h-3 w-3 shrink-0 rounded-xs"
                    style={{ backgroundColor: `var(--chart-${(idx % 5) + 1})` }}
                  />
                  {mod}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>
      {/* Chart */}
      <CardContent className="flex flex-1 items-center justify-center">
        {/* ADD relative so the spinner overlay anchors correctly */}
        <ChartContainer id={id} config={{}} className="relative w-full max-w-md aspect-square">
          {/* Spinner overlay */}
          <div
            className={`absolute inset-0 flex items-center justify-center transition-opacity duration-500 ${isLoading ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
          >
            <SpinItem />
          </div>

          {/* Chart (fades in after mount) */}
          <div
            className={`h-full w-full transition-opacity duration-700 will-change-transform ${isLoading || !hasMounted ? "opacity-0" : "opacity-100"
              }`}
          >
            <ResponsiveContainer width="100%" height="100%" debounce={80}>
              <PieChart>
                <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                <Pie
                  key={activeMod ?? "none"}
                  data={pieData}
                  dataKey="count"
                  nameKey="module"
                  cx="50%"
                  cy="25%"   
                  innerRadius="39%"
                  outerRadius="45%"
                  strokeWidth={5}
                  activeIndex={activeIndex >= 0 ? activeIndex : undefined}
                  isAnimationActive={hasMounted}
                  animationDuration={700}
                  animationEasing="ease-in-out"
                  activeShape={({ outerRadius = 0, ...props }: PieSectorDataItem) => (
                    <g>
                      <Sector {...props} outerRadius={outerRadius * 1.05} />
                      <Sector
                        {...props}
                        outerRadius={outerRadius * 1.15}
                        innerRadius={outerRadius * 1.08}
                      />
                    </g>
                  )}
                >
                  <Label
                    key={`label-${activeMod ?? "none"}`}
                    content={({ viewBox }) => {
                      if (viewBox && "cx" in viewBox && "cy" in viewBox && activeIndex >= 0) {
                        return (
                          <text
                            x={viewBox.cx}
                            y={viewBox.cy}
                            textAnchor="middle"
                            dominantBaseline="middle"
                            className="transition-opacity duration-500 ease-in-out"
                          >
                            <tspan
                              x={viewBox.cx}
                              y={viewBox.cy}
                              style={{ fontSize: "clamp(1rem, 2vw, 2rem)" }}
                            >
                              {pieData[activeIndex].count.toLocaleString()}
                            </tspan>
                            <tspan
                              x={viewBox.cx}
                              y={(viewBox.cy || 0) + 20}
                              className="hidden md:inline fill-muted-foreground text-sm md:text-base"
                            >
                              notes sold
                            </tspan>
                          </text>
                        )
                      }
                      return null
                    }}
                  />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}