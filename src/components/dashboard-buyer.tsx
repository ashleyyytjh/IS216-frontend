import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import {
    BookOpen,
    DollarSign,
    Eye,
    Heart
} from "lucide-react"
import UserTabs from "./user-tabs";

function DashboardBuyer(currentUser) {
    return (
        <>
            <div className="w-full flex flex-col gap-y-5 md:flex-row gap-x-5 mt-4">
                <Card className="w-[100%] md:w-[70%] bg-[#f1f5f9] hover:shadow-lg transition-all duration-300">
                    <CardHeader className="justify-between flex flex-row">
                        <h1 className="font-medium">Notes Purchased</h1>
                        <BookOpen />
                    </CardHeader>
                    <CardContent>
                        <h1 className="text-xl font-extrabold">20</h1>
                        <p className=" text-sm font-light">+2 from last month</p>
                    </CardContent>
                </Card>

                <Card className="w-[100%] md:w-[70%] bg-[#f1f5f9] hover:shadow-lg transition-all duration-300">
                    <CardHeader className="flex flex-row justify-between">
                        <h1 className="font-medium">Total Spent</h1>
                        <DollarSign />
                    </CardHeader>
                    <CardContent>
                        <h1 className="text-xl font-extrabold">$200</h1>
                        <p className=" text-sm font-light">+$2 from last month</p>
                    </CardContent>
                </Card>

                <Card className="w-[100%] md:w-[70%] bg-[#f1f5f9] hover:shadow-lg transition-all duration-300">
                    <CardHeader className="flex flex-row justify-between">
                        <h1 className="font-medium">Favourite Modules</h1>
                        <Heart />
                    </CardHeader>

                    <CardContent>
                        <h1 className="text-xl font-extrabold">IS216</h1>
                        <p className=" text-sm font-light">Purchased 10 times</p>
                    </CardContent>
                </Card>
            </div>
            <div className="flex flex-row w-full">
                <UserTabs current={currentUser}/>
            </div>
        </>
    )
}
export default DashboardBuyer;