import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

function DashboardSeller() {
    return (
        <>
            <Card className="w-[70%] bg-[#f1f5f9]">
                <CardHeader>
                    <h1 className="font-medium">Notes Purchased</h1>
                </CardHeader>
                <CardContent>
                    <h1 className="text-xl font-extrabold">20</h1>
                    <p className=" text-sm font-light">+2 from last month</p>
                </CardContent>
            </Card>

            <Card className="w-[70%] bg-[#f1f5f9]">
                <CardHeader>
                    <h1 className="font-medium">Total Spent</h1>
                </CardHeader>
                <CardContent>
                    <h1 className="text-xl font-extrabold">$200</h1>
                    <p className=" text-sm font-light">+$2 from last month</p>
                </CardContent>
            </Card>

            <Card className="w-[70%] bg-[#f1f5f9]">
                <CardHeader>
                    <h1 className="font-medium">Favourite Modules</h1>
                </CardHeader>
                <CardContent>
                    <h1 className="text-xl font-extrabold">IS216</h1>
                    <p className=" text-sm font-light">Purchased 10 times</p>
                </CardContent>
            </Card>

           <Card className="w-[70%] bg-[#f1f5f9]">
                <CardHeader>
                    <h1 className="font-medium">Recent Activity</h1>
                </CardHeader>
                <CardContent>
                    <h1 className="text-xl font-extrabold">3</h1>
                    <p className=" text-sm font-light">Notes purchased today</p>
                </CardContent>
            </Card>
        </>


    )
}
export default DashboardSeller;