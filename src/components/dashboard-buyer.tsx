import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import {
    BookOpen,
    DollarSign,
    Eye,
    Heart
} from "lucide-react"

function DashboardBuyer() {
    return (
        <>
            <Card className="w-[100%] md:w-[70%] bg-[#f1f5f9]">
                <CardHeader className="justify-between flex flex-row">
                    <h1 className="font-medium">Notes Purchased</h1>
                    <BookOpen />
                </CardHeader>
                <CardContent>
                    <h1 className="text-xl font-extrabold">20</h1>
                    <p className=" text-sm font-light">+2 from last month</p>
                </CardContent>
            </Card>

            <Card className="w-[100%] md:w-[70%] bg-[#f1f5f9]">
                <CardHeader className="flex flex-row justify-between">
                    <h1 className="font-medium">Total Spent</h1>
                    <DollarSign />
                </CardHeader>
                <CardContent>
                    <h1 className="text-xl font-extrabold">$200</h1>
                    <p className=" text-sm font-light">+$2 from last month</p>
                </CardContent>
            </Card>

            <Card className="w-[100%] md:w-[70%] bg-[#f1f5f9]">
                <CardHeader className="flex flex-row justify-between">
                    <h1 className="font-medium">Favourite Modules</h1>
                    <Heart />
                </CardHeader>
                <CardContent>
                    <h1 className="text-xl font-extrabold">IS216</h1>
                    <p className=" text-sm font-light">Purchased 10 times</p>
                </CardContent>
            </Card>

            <Card className="w-[100%] md:w-[70%] bg-[#f1f5f9]">
                <CardHeader className="flex flex-row justify-between">
                    <h1 className="font-medium">Recent Activity</h1>
                    <Eye />
                </CardHeader>
                <CardContent>
                    <h1 className="text-xl font-extrabold">3</h1>
                    <p className=" text-sm font-light">Notes purchased today</p>
                </CardContent>
            </Card>


        </>
    )
}
export default DashboardBuyer;