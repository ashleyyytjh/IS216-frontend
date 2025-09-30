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
import React from "react";
import { Spinner } from "./ui/shadcn-io/spinner";

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

    }, [])
    const [hashMap, setHashMap] = useState<Record<string, number>>({});
    const [totalCount, setTotalCount] = useState(0);
    const [totalSpent, setTotalSpent] = useState(0);

    useEffect(() => {
        if (!orders) return;

        if (orders.length === 0) {
            // No orders → just reset to defaults
            setHashMap({});
            setTotalCount(0);
            setTotalSpent(0);
            setLoading(false);
            return;
        }

        let map: Record<string, number> = {};
        let count = 0;
        let spent = 0;

        const promises = orders
            .filter(o => o.buyer_id === currentUser.current.current.sub)
            .map(o =>
                getNotesById(o.note_id).then(res => {
                    map[res.module] = (map[res.module] || 0) + 1;
                    count += 1;
                    spent += o.price;
                })
            );

        Promise.all(promises).then(() => {
            setHashMap(map);
            setTotalCount(count);
            setTotalSpent(spent);
            setLoading(false)
        });
    }, [orders, currentUser]);

    const topModule = React.useMemo(() => {
        if (!hashMap || Object.keys(hashMap).length === 0) return null;

        const entries = Object.entries(hashMap);
        entries.sort((a, b) => b[1] - a[1]);
        return { module: entries[0][0], count: entries[0][1] };
    }, [hashMap]);


    return (
        <>
            <div className="w-full flex flex-col gap-y-5 md:flex-row gap-x-5 mt-4">
                <Card className="w-[100%] md:w-[70%] bg-[#f1f5f9] hover:shadow-lg transition-all duration-300">
                    <CardHeader className="justify-between flex flex-row">
                        <h1 className="font-medium">Total purchased notes</h1>
                        <BookOpen />
                    </CardHeader>
                    {
                        loading ? (
                            <CardContent>
                                <Spinner variant="default" />
                            </CardContent>
                        ) : totalCount === 0 ? (
                            <CardContent>
                                <h1 className="text-xl font-extrabold">0</h1>
                                <p className="text-sm font-light">No notes purchased yet.</p>
                            </CardContent>
                        ) : (
                            <CardContent>
                                <h1 className="text-xl font-extrabold">{totalCount}</h1>
                                <p className="text-sm font-light">Notes purchased.</p>
                            </CardContent>
                        )
                    }

                </Card>

                <Card className="w-[100%] md:w-[70%] bg-[#f1f5f9] hover:shadow-lg transition-all duration-300">
                    <CardHeader className="flex flex-row justify-between">
                        <h1 className="font-medium">Total Spent</h1>
                        <DollarSign />
                    </CardHeader>
                    {
                        loading ? (
                            <CardContent>
                                <Spinner variant="default" />
                            </CardContent>
                        ) : totalSpent === 0 ? (
                            <CardContent>
                                <h1 className="text-xl font-extrabold">$0</h1>
                                <p className="text-sm font-light">No spending yet.</p>
                            </CardContent>
                        ) : (
                            <CardContent>
                                <h1 className="text-xl font-extrabold">${totalSpent}</h1>
                                <p className="text-sm font-light">Spent in Onlynotes.</p>
                            </CardContent>
                        )
                    }

                </Card>

                <Card className="w-[100%] md:w-[70%] bg-[#f1f5f9] hover:shadow-lg transition-all duration-300">
                    <CardHeader className="flex flex-row justify-between">
                        <h1 className="font-medium">Favourite Modules</h1>
                        <Heart />
                    </CardHeader>
                    {
                        loading ? (
                            <CardContent>
                                <Spinner variant="default" />
                            </CardContent>
                        ) : !topModule || topModule.count === 0 ? (
                            <CardContent>
                                <h1 className="text-xl font-extrabold">None</h1>
                                <p className="text-sm font-light">No purchases yet.</p>
                            </CardContent>
                        ) : (
                            <CardContent>
                                <h1 className="text-xl font-extrabold">{topModule.module}</h1>
                                <p className="text-sm font-light">Purchased {topModule.count} times.</p>
                            </CardContent>
                        )
                    }

                </Card>
            </div>
            <div className="flex flex-row w-full">
                <UserTabs current={currentUser} />
            </div>
        </>
    )
}
export default DashboardBuyer;