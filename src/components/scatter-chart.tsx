"use client"

import {
    ScatterChart,
    Scatter,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    ZAxis,
    Label,
} from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getUserOwned } from "@/services/NotesService"
import { useEffect, useState } from "react"
import { getOrders } from "@/services/OrdersService"

export function ScatterVisual() {
    const [userOrders, setUserOrder] = useState<any[]>([])
    const [allOrders, setAllOrders] = useState<any[]>([])
    const [matchedOrders, setMatchedOrders] = useState<any[]>([])

    // get all orders
    useEffect(() => {
        getOrders()
            .then((r) => setAllOrders(r))
            .catch((e) => console.error(e))
    }, [])

    // get notes owned by current user
    useEffect(() => {
        getUserOwned()
            .then((res) => {
                setUserOrder(res)
                console.log("User Owned Notes:", res)
            })
            .catch((err) => console.error(err))
    }, [])

    // aggregate sales/revenue for owned notes
    useEffect(() => {
        if (userOrders.length > 0 && allOrders.length > 0) {
            const aggregated = userOrders.map((note) => {
                // match orders by note_id
                const noteOrders = allOrders.filter((order) => order.note_id === note.id)

                // sales count = how many orders for this note
                const salesCount = noteOrders.length

                // revenue = salesCount * note.price
                const revenue = salesCount * note.price

                return {
                    id: note.id,
                    note: note.title,
                    module: note.module,
                    price: note.price,
                    salesCount,
                    revenue,
                }
            })

            setMatchedOrders(aggregated)
            console.log("Aggregated Orders:", aggregated)
        }
    }, [userOrders, allOrders])

    return (
        <Card className="shadow-md">
            <CardHeader>
                <CardTitle>Price vs Sales Count</CardTitle>
                <CardDescription>Based on price of note and sales made.</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%" className="align-content-center ml-auto mr-auto">
                    <ScatterChart margin={{ top: 20, right: 30, bottom: 20, left: 20 }}>
                        <CartesianGrid stroke="#e5e7eb" strokeDasharray="3 3" opacity={0.8} />

                        {/* X-axis = Price */}
                        <XAxis
                            dataKey="price"
                            type="number"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            tick={{ fill: "#6B7280", fontSize: 12, fontWeight: 300 }}
                        >
                            <Label
                                value="Price of Note ($)"
                                position="insideBottom"
                                offset={-5}
                                style={{ fill: "#6B7280", fontSize: 13, fontWeight: 300 }}
                            />
                        </XAxis>

                        <YAxis
                            dataKey="salesCount"
                            type="number"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            tick={{ fill: "#6B7280", fontSize: 12, fontWeight: 300 }}
                        >
                            <Label
                                value="Total Sale Count"
                                angle={-90}
                                position="center"
                                dx={-30}
                                offset={100}
                                style={{ fill: "#6B7280", fontSize: 13, fontWeight: 300 }}
                            />
                        </YAxis>

                        {/* Z-axis = Revenue (bubble size) */}
                        <ZAxis type="number" dataKey="revenue" range={[60, 400]} name="Revenue" />

                        {/* Tooltip */}
                        <Scatter
                            data={matchedOrders}
                            fill="rgba(59, 130, 246, 0.8)" // blue like your bars
                            stroke="#2563EB"
                            strokeWidth={1.5}
                            shape="circle"
                        />

                        <Tooltip
                            cursor={{ strokeDasharray: "3 3" }}
                            content={({ active, payload }) => {
                                if (active && payload && payload.length) {
                                    const { note, price, module, salesCount, revenue } = payload[0].payload
                                    return (
                                        <div className="bg-white border border-gray-200 rounded-md p-3 shadow-md text-sm">
                                            <p className="font-semibold text-gray-900">{note} - {module}</p>
                                            <p className="text-gray-600">Price: ${price}</p>
                                        
                                            <p className="text-gray-600">Sales: {salesCount}</p>
                                            <p className="text-gray-600">Revenue: ${revenue}</p>
                                        </div>
                                    )
                                }
                                return null
                            }}
                        />
                    </ScatterChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    )
}