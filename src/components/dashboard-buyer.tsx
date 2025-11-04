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
import { getComposeBatch, getComposeNoteById, getNotesById, getUploadBatch } from "@/services/NotesService";
import React from "react";
import { Spinner } from "./ui/shadcn-io/spinner";
import { ReactTyped } from "react-typed";

function DashboardBuyer(currentUser) {
    console.log(currentUser['current']['current'])
    const [orders, setOrders] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        getOrders()
            .then((resp) => {
                setOrders(resp)
            })
            .catch((err) => {
                console.error("Error fetching orders:", err)
            })

    }, [])
    const [hashMap, setHashMap] = useState<Record<string, number>>({});
    const [totalUploadedNotesByMod, setTotalUploadedNotesByMod] = useState([]);
    const [totalComposeNoteByMod, setTotalComposeNoteByMod] = useState([]);
    const [normalNoteTotal, setNormalNoteStat] = useState(0);
    const [composeNoteTotal, setComposeNoteStat] = useState(0);
    const [totalNote, setTotalNote] = useState(0);

    useEffect(() => {
        if (!orders) {
            return;
        }
        if (orders.length === 0) {
            // setHashMap({});
            // setTotalCount(0);
            // setTotalSpent(0);
            setLoading(false);
            return;
        }
        //TODO

        //cont more debugging
        const userOrders = orders.filter(o => o.buyer_id == currentUser.current.current.sub)
        console.log(userOrders)
        let uniqueNoteIds = userOrders  .filter((o) => o.status === "succeeded")
  .map((o) => o.note_id);
        console.log(uniqueNoteIds, 'line59') // allnote id.
        setTotalNote(uniqueNoteIds.length)
        getUploadBatch(uniqueNoteIds).then((res) => {
            setTotalUploadedNotesByMod(res.data)
            let totalSum = res.data.reduce((sum, a) => sum + (a.price ?? 0), 0);
            setNormalNoteStat(totalSum)
        }).catch((e) => console.log(e))

        getComposeBatch(uniqueNoteIds).then((res) => {
            let totalSum = res.reduce((sum, a) => sum + (a.price ?? 0), 0);
            setTotalComposeNoteByMod(res)
            setComposeNoteStat(totalSum)
        }).catch((e) => console.log(e))


        setLoading(false)

    }, [orders, currentUser]);

    useEffect(() => {
        const mergedList = [...totalComposeNoteByMod, ...totalUploadedNotesByMod];
        if (mergedList.length === 0) return;

        const hash: Record<string, number> = {};
        mergedList.forEach((a: any) => {
            const mod = a.module?.toUpperCase() ?? "UNKNOWN";
            hash[mod] = (hash[mod] || 0) + 1;
        });

        setHashMap(hash);
    }, [totalComposeNoteByMod, totalUploadedNotesByMod]);
    //total price here.
    console.log(normalNoteTotal, composeNoteTotal)
    
    console.log(hashMap)

    const topModule = React.useMemo(() => {
        if (!hashMap || Object.keys(hashMap).length === 0) return null;

        const entries = Object.entries(hashMap);
        entries.sort((a, b) => b[1] - a[1]);
        return { module: entries[0][0], count: entries[0][1] };
    }, [hashMap]); 


    return (
        <>
            <div className="w-full flex flex-col gap-y-5 lg:flex-row gap-x-5 mt-4">
                <Card className="w-[100%] md:w-[100%] bg-[#f1f5f9] hover:shadow-lg transition-all duration-300 gap-2">
                    <CardHeader>
                        <h1 className="font-bold text-foreground text-sm">Total Purchased</h1>
                    </CardHeader>
                    {
                        loading ? (
                            <CardContent>
                                <Spinner variant="default"/>
                            </CardContent>
                        ) : totalNote === 0 ? (
                            <CardContent className="flex flex-col">
                                <p className="text-foreground text-2xl font-medium">0</p>
                                <p className="text-sm font-light text-foreground mt-1">No notes purchased yet.</p>
                            </CardContent>
                        ) : (
                            <CardContent className="flex flex-col">
                                <p className="text-foreground text-2xl font-medium">{totalNote}</p>
                                <p className="text-sm font-light text-foreground mt-1">Notes purchased.</p>
                            </CardContent>
                        )
                    }

                </Card>

                <Card className="w-[100%] md:w-[100%] bg-[#f1f5f9] hover:shadow-lg transition-all duration-300 gap-2">
                    <CardHeader>
                        <h1 className="font-bold text-foreground text-sm">Total Spent</h1>
                    </CardHeader>
                    {
                        loading ? (
                            <CardContent>
                                <Spinner variant="default" />
                            </CardContent>
                        ) : (normalNoteTotal + composeNoteTotal) === 0 ? (
                            <CardContent className="flex flex-col">
                                 <p className="text-foreground text-2xl font-medium">$0</p>
                                <p className="text-sm font-light text-foreground mt-1">No spending yet.</p>
                            </CardContent>
                        ) : (
                            <CardContent className="flex flex-col">
                                 <p className="text-foreground text-2xl font-medium">${Number((normalNoteTotal + composeNoteTotal) / 100).toFixed(2)}</p>
                                <p className="text-sm font-light text-foreground mt-1">Spent in Onlynotes.</p>
                            </CardContent>
                        )
                    }

                </Card>

                <Card className="w-[100%] md:w-[100%] bg-[#f1f5f9] hover:shadow-lg transition-all duration-300 gap-2">
                    <CardHeader>
                        <h1 className="font-bold text-foreground text-sm">Favourite Modules</h1>
                    </CardHeader>
                    {
                        loading ? (
                            <CardContent>
                                <Spinner variant="default" />
                            </CardContent>
                        ) : !topModule || topModule.count === 0 ? (
                            <CardContent className="flex flex-col">
                                <p className="text-foreground text-2xl font-medium">None</p>
                                <p className="text-sm font-light text-foreground mt-1">No purchases yet.</p>
                            </CardContent>
                        ) : (
                            <CardContent className="flex flex-col">
                                <p className="text-foreground text-2xl font-medium">{topModule.module.toUpperCase()}</p>
                                <p className="text-sm font-light text-foreground mt-1">Purchased {topModule.count} times.</p>
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