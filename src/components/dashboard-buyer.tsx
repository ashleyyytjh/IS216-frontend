import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import {
    BookOpen,
    DollarSign,
    Eye,
    Heart
} from "lucide-react"
import UserTabs from "./user-tabs";
import { useEffect, useState } from "react";
import { getOrders } from "@/services/OrdersService";
import { getNotesById } from "@/services/NotesService";

function DashboardBuyer(currentUser) {
    console.log(currentUser['current']['current'])
    const [orders, setOrders] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        getOrders()
            .then((resp) => {
                console.log(resp)
                setOrders(resp)
            })
            .catch((err) => {
                console.error("Error fetching orders:", err)
            })
            .finally(() => setLoading(false))
    }, [])
    let totalCount = 0;
    let totalSpent = 0;
    let hashMap = {}
    for(let order of orders){
        if(order['buyer_id'] == currentUser['current']['current']['sub']){
            let currentID = order['note_id']
            getNotesById(currentID).then((res)=>{
                console.log(res.module)
                if(hashMap[res.module]!= "undefined"){
                    hashMap[res.module] += Number(1)
                }else{
                    hashMap[res.module] = Number(1)
                }
                console.log(hashMap)
            }).catch((err)=>{
                console.log(err)
            })
            totalCount += 1
            totalSpent += order['price']
        }
    }

    return (
        <>
            <div className="w-full flex flex-col gap-y-5 md:flex-row gap-x-5 mt-4">
                <Card className="w-[100%] md:w-[70%] bg-[#f1f5f9] hover:shadow-lg transition-all duration-300">
                    <CardHeader className="justify-between flex flex-row">
                        <h1 className="font-medium">Total purchased notes</h1>
                        <BookOpen />
                    </CardHeader>
                    <CardContent>
                        <h1 className="text-xl font-extrabold">{totalCount}</h1>
                        <p className=" text-sm font-light">Note purchased</p>
                    </CardContent>
                </Card>

                <Card className="w-[100%] md:w-[70%] bg-[#f1f5f9] hover:shadow-lg transition-all duration-300">
                    <CardHeader className="flex flex-row justify-between">
                        <h1 className="font-medium">Total Spent</h1>
                        <DollarSign />
                    </CardHeader>
                    <CardContent>
                        <h1 className="text-xl font-extrabold">${totalSpent}</h1>
                        <p className=" text-sm font-light">Spent in Onlynotes.</p>
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
                <UserTabs current={currentUser} />
            </div>
        </>
    )
}
export default DashboardBuyer;