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

        let map: Record<string, number> = {};
        let count = 0;
        let spent = 0;
        let missingNotes: string[] = [];
        //TODO

        //cont more debugging
        const userOrders = orders.filter(o => o.buyer_id == currentUser.current.current.sub)
        console.log(userOrders)
        let uniqueNoteIds = userOrders.map((o) => o.note_id);
        console.log(uniqueNoteIds) // allnote id.
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
            <div className="w-full flex flex-col gap-y-5 md:flex-row gap-x-5 mt-4">
                <Card className="w-[100%] md:w-[70%] bg-[#f1f5f9] hover:shadow-lg transition-all duration-300">
                    <CardHeader className="justify-between flex flex-row">
                        <h1 className="font-bold text-foreground">Total purchased notes</h1>
                        <BookOpen />
                    </CardHeader>
                    {
                        loading ? (
                            <CardContent>
                                <Spinner variant="default" />
                            </CardContent>
                        ) : totalNote === 0 ? (
                            <CardContent className="flex flex-col">
                                <ReactTyped className="text-foreground text-xl font-medium" strings={['0']} typeSpeed={50} backSpeed={100} showCursor={false} />
                                <ReactTyped className="text-sm font-light text-foreground" strings={['No notes purchased yet.']} typeSpeed={50} backSpeed={100} showCursor={false} />
                            </CardContent>
                        ) : (
                            <CardContent className="flex flex-col">
                                <ReactTyped className="text-foreground text-xl font-medium" strings={[`${totalNote}`]} typeSpeed={50} backSpeed={100} showCursor={false} />
                                <ReactTyped className="text-sm font-light text-foreground" strings={['Notes purchased.']} typeSpeed={50} backSpeed={100} showCursor={false} />
                            </CardContent>
                        )
                    }

                </Card>

                <Card className="w-[100%] md:w-[70%] bg-[#f1f5f9] hover:shadow-lg transition-all duration-300">
                    <CardHeader className="flex flex-row justify-between">
                        <h1 className="font-bold text-foreground">Total Spent</h1>
                        <DollarSign />
                    </CardHeader>
                    {
                        loading ? (
                            <CardContent>
                                <Spinner variant="default" />
                            </CardContent>
                        ) : (normalNoteTotal + composeNoteTotal) === 0 ? (
                            <CardContent className="flex flex-col">
                                <ReactTyped className="text-foreground text-xl font-medium" strings={[`$0`]} typeSpeed={50} backSpeed={100} showCursor={false} />
                                <ReactTyped className="text-sm font-light text-foreground" strings={['No spending yet.']} typeSpeed={50} backSpeed={100} showCursor={false} />
                            </CardContent>
                        ) : (
                            <CardContent className="flex flex-col">
                                <ReactTyped className="text-foreground text-xl font-medium" strings={[`$${Number((normalNoteTotal + composeNoteTotal) / 100).toFixed(2)}`]} typeSpeed={50} backSpeed={100} showCursor={false} />
                                <ReactTyped className="text-sm font-light text-foreground" strings={['Spent in Onlynotes']} typeSpeed={50} backSpeed={100} showCursor={false} />
                            </CardContent>
                        )
                    }

                </Card>

                <Card className="w-[100%] md:w-[70%] bg-[#f1f5f9] hover:shadow-lg transition-all duration-300">
                    <CardHeader className="flex flex-row justify-between">
                        <h1 className="font-bold text-foreground">Favourite Modules</h1>
                        <Heart />
                    </CardHeader>
                    {
                        loading ? (
                            <CardContent>
                                <Spinner variant="default" />
                            </CardContent>
                        ) : !topModule || topModule.count === 0 ? (
                            <CardContent className="flex flex-col">
                                <ReactTyped className="text-foreground text-xl font-medium" strings={[`None`]} typeSpeed={50} backSpeed={100} showCursor={false} />
                                <ReactTyped className="text-sm font-light text-foreground" strings={['No purchases yet']} typeSpeed={50} backSpeed={100} showCursor={false} />
                            </CardContent>
                        ) : (
                            <CardContent className="flex flex-col">
                                <ReactTyped className="text-foreground text-xl font-medium" strings={[`${topModule.module.toUpperCase()}`]} typeSpeed={50} backSpeed={100} showCursor={false} />
                                <ReactTyped className="text-sm font-light text-foreground" strings={[`Purchased ${topModule.count} times.`]} typeSpeed={50} backSpeed={100} showCursor={false} />
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