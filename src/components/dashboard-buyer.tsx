import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import {
    BookOpen,
    DollarSign,
    Eye,
    Heart
} from "lucide-react"

import { TrendingUp } from "lucide-react"
import { CartesianGrid, Line, LineChart, XAxis } from "recharts"
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from '@/components/ui/chart'
// import { LabelList, Pie, PieChart } from "recharts"
import type { CustomTooltipProps } from '@/components/ui/chart'


export const description = "A bar chart with a label"

const chartData = [
    { month: "January", desktop: 186 },
    { month: "February", desktop: 305 },
    { month: "March", desktop: 237 },
    { month: "April", desktop: 73 },
    { month: "May", desktop: 209 },
    { month: "June", desktop: 214 },
]

const chartConfig = {
    desktop: {
        label: "Desktop",
        color: "var(--chart-1)",
    },
}

function DashboardBuyer(props) {
    return (
        <>
            <div className="w-full flex flex-col gap-y-5 md:flex-row gap-x-5 mt-4">
                <Card className="w-[100%] md:w-[70%] bg-[#f1f5f9]">
                    <CardHeader className="justify-between flex flex-row">
                        {
                            props.value == "buyer" ? (
                                <>
                                    <h1 className="font-medium">Notes Purchased</h1>
                                    <BookOpen />
                                </>
                            )
                                : (
                                    <>
                                        <h1 className="font-medium">Notes Sold</h1>
                                        <BookOpen />
                                    </>
                                )

                        }

                    </CardHeader>
                    <CardContent>
                        {
                            props.value == "buyer" ? (
                                <>
                                    <h1 className="text-xl font-extrabold">20</h1>
                                    <p className=" text-sm font-light">+2 from last month</p>
                                </>
                            )
                                : (
                                    <>
                                        <h1 className="text-xl font-extrabold">20</h1>
                                        <p className=" text-sm font-light">+2 from last month</p>
                                    </>
                                )

                        }
                    </CardContent>
                </Card>

                <Card className="w-[100%] md:w-[70%] bg-[#f1f5f9]">
                    <CardHeader className="flex flex-row justify-between">
                        {
                            props.value == "buyer" ? (
                                <>
                                    <h1 className="font-medium">Total Spent</h1>
                                    <DollarSign />
                                </>
                            )
                                : (
                                    <>
                                        <h1 className="font-medium">Total Revenue</h1>
                                        <DollarSign />
                                    </>
                                )

                        }
                    </CardHeader>
                    <CardContent>
                        {
                            props.value == "buyer" ? (
                                <>
                                    <h1 className="text-xl font-extrabold">20</h1>
                                    <p className=" text-sm font-light">+2 from last month</p>
                                </>
                            )
                                : (
                                    <>
                                        <h1 className="text-xl font-extrabold">$200</h1>
                                        <p className=" text-sm font-light">+$2 from last month</p>
                                    </>
                                )

                        }
                    </CardContent>
                </Card>

                <Card className="w-[100%] md:w-[70%] bg-[#f1f5f9]">
                    <CardHeader className="flex flex-row justify-between">

                        {
                            props.value == "buyer" ? (
                                <>
                                    <h1 className="font-medium">Favourite Modules</h1>
                                    <Heart />
                                </>
                            )
                                : (
                                    <>
                                        <h1 className="font-medium">Popular Modules</h1>
                                        <Heart />
                                    </>
                                )

                        }

                    </CardHeader>

                    <CardContent>
                        {
                            props.value == "buyer" ? (
                                <>
                                    <h1 className="text-xl font-extrabold">IS216</h1>
                                    <p className=" text-sm font-light">Purchased 10 times</p>
                                </>
                            )
                                : (
                                    <>
                                        <h1 className="text-xl font-extrabold">IS216</h1>
                                        <p className=" text-sm font-light">Purchased 10 times</p>
                                    </>
                                )

                        }
                    </CardContent>
                </Card>

                <Card className="w-[100%] md:w-[70%] bg-[#f1f5f9]">
                    <CardHeader className="flex flex-row justify-between">
                        {
                            props.value == "buyer" ? (
                                <>
                                    <h1 className="font-medium">Recent Activity</h1>
                                    <Eye />
                                </>
                            )
                                : (
                                    <>
                                        <h1 className="font-medium">Recent Activity</h1>
                                        <Eye />
                                    </>
                                )

                        }
                        <Eye />
                    </CardHeader>
                    <CardContent>
                        {
                            props.value == "buyer" ? (
                                <>
                                    <h1 className="text-xl font-extrabold">3</h1>
                                    <p className=" text-sm font-light">Notes purchased today</p>
                                </>
                            )
                                : (
                                    <>
                                        <h1 className="text-xl font-extrabold">3</h1>
                                        <p className=" text-sm font-light">Notes sold today</p>
                                    </>
                                )

                        }

                    </CardContent>
                </Card>
            </div>

            <div className="mt-10">
                <Card>
                    <CardHeader>
                        <CardTitle>Quick Analytics</CardTitle>

                    </CardHeader>
                    <CardContent>
                        <p>A quick look at your sales for the time period.</p>
                        <div className="w-full flex flex-col gap-y-5 md:flex-row gap-x-5 mt-4">
                            <Card className="w-[33%]">
                                <CardHeader>
                                    <CardTitle>Line Chart - Linear</CardTitle>
                                    <CardDescription>January - June 2024</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ChartContainer config={chartConfig}>
                                        <LineChart
                                            accessibilityLayer
                                            data={chartData}
                                            margin={{
                                                left: 12,
                                                right: 12,
                                            }}
                                        >
                                            <CartesianGrid vertical={false} />
                                            <XAxis
                                                dataKey="month"
                                                tickLine={false}
                                                axisLine={false}
                                                tickMargin={8}
                                                tickFormatter={(value) => value.slice(0, 3)}
                                            />
                                            <ChartTooltip
                                                cursor={false}
                                                content={(props: CustomTooltipProps) => (
                                                    <ChartTooltipContent {...props} hideIndicator hideLabel />
                                                )}
                                            />
                                            <Line
                                                dataKey="desktop"
                                                type="linear"
                                                stroke="var(--color-desktop)"
                                                strokeWidth={2}
                                                dot={false}
                                            />
                                        </LineChart>
                                    </ChartContainer>
                                </CardContent>
                                <CardFooter className="flex-col items-start gap-2 text-sm">
                                    <div className="flex gap-2 leading-none font-medium">
                                        Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
                                    </div>
                                    <div className="text-muted-foreground leading-none">
                                        Showing total visitors for the last 6 months
                                    </div>
                                </CardFooter>
                            </Card>

                            <Card className="w-[33%]">
                                Hi Guys
                            </Card>

                            <Card className="w-[33%]">
                                Hi Guys
                            </Card>
                        </div>

                    </CardContent>

                </Card>
            </div>


        </>
    )
}
export default DashboardBuyer;