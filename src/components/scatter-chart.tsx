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
import SpinItem from "./spinner"

export function ScatterVisual() {
  const [userOrders, setUserOrder] = useState<any[]>([])
  const [allOrders, setAllOrders] = useState<any[]>([])
  const [matchedOrders, setMatchedOrders] = useState<any[]>([])

  const [isLoading, setIsLoading] = useState(true)
  const [isEmpty, setIsEmpty] = useState(false)

  // fetch all orders
  useEffect(() => {
    getOrders()
      .then((r) => setAllOrders(r))
      .catch((e) => console.error(e))
  }, [])

  // fetch user-owned notes
  useEffect(() => {
    getUserOwned()
      .then((res) => {
        setUserOrder(res)
        console.log("User Owned Notes:", res)
      })
      .catch((err) => console.error(err))
  }, [])

  // compute combined data
  useEffect(() => {
    if (userOrders.length > 0 && allOrders.length > 0) {
      const aggregated = userOrders
        .map((note) => {
          const noteOrders = allOrders.filter((order) => order.note_id === note.id)
          if (noteOrders.length === 0) return null 

          const salesCount = noteOrders.length
          const revenue = (salesCount * Number(note.price)) / 100

          return {
            id: note.id,
            note: note.title,
            module: note.module,
            price: Number(note.price) / 100,
            salesCount,
            revenue,
          }
        })
        .filter(Boolean) 

      setMatchedOrders(aggregated)
      setIsLoading(false)
      setIsEmpty(aggregated.length === 0)
      console.log("Aggregated Orders:", aggregated)
    }
  }, [userOrders, allOrders])
  console.log(matchedOrders)
  // fallback timeout — if no data after 5 s → mark as empty
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (matchedOrders.length === 0) {
        setIsLoading(false)
        setIsEmpty(true)
      }
    }, 5000)
    return () => clearTimeout(timeout)
  }, [matchedOrders])

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle>Price vs Sales Count of Note</CardTitle>
        <CardDescription>Based on price of single note and revenue made.</CardDescription>
      </CardHeader>
      <CardContent className="h-[400px] flex items-center justify-center relative">
        {isLoading ? (
          <SpinItem />
        ) : isEmpty ? (
          <p className="text-gray-500 text-sm">No data found.</p>
        ) : (
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
                  value="Price of Single Note ($)"
                  position="insideBottom"
                  offset={-15}
                  style={{ fill: "#6B7280", fontSize: 13, fontWeight: 300 }}
                />
              </XAxis>

              {/* Y-axis = Sales Count */}
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

              {/* Scatter plot */}
              <Scatter
                data={matchedOrders}
                fill="rgba(59, 130, 246, 0.8)"
                stroke="#2563EB"
                strokeWidth={1.5}
                shape="circle"
              />

              {/* Tooltip */}
              <Tooltip
                cursor={{ strokeDasharray: "3 3" }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const { note, price, module, salesCount, revenue } = payload[0].payload
                    return (
                      <div className="bg-white border border-gray-200 rounded-md p-3 shadow-md text-sm">
                        <p className="font-semibold text-gray-900">
                          {note} - {module}
                        </p>
                        <p className="text-gray-600">Price: ${price.toFixed(2)}</p>
                        <p className="text-gray-600">Sales: {salesCount}</p>
                        <p className="text-gray-600">Revenue: ${revenue.toFixed(2)}</p>
                      </div>
                    )
                  }
                  return null
                }}
              />
            </ScatterChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
}