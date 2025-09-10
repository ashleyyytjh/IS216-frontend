import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import {
    BookOpen,
    DollarSign,
    Eye,
    Heart,
    TrendingUp
} from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "./ui/chart";


function ChartsBuyer() {

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
    return (
        <>
            <Card className="w-[100%] bg-[#f1f5f9] mt-10">
                <CardHeader className="justify-between flex flex-row">
                    <h1 className="font-medium">Quick Analytics</h1>
                    <BookOpen />
                </CardHeader>
                <CardContent>
                    <h1 className="text-xl font-extrabold">20</h1>
                    <p className=" text-sm font-light">+2 from last month</p>
                </CardContent>
            </Card>



        </>
    )
}
export default ChartsBuyer;