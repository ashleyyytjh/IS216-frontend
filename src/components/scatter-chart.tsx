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
import { correl } from "@/utils/correlation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"


export function ScatterVisual() {
  const [userOrders, setUserOrder] = useState<any[]>([])
  const [allOrders, setAllOrders] = useState<any[]>([])
  const [matchedOrders, setMatchedOrders] = useState<any[]>([])

  const [isLoading, setIsLoading] = useState(true)
  const [isEmpty, setIsEmpty] = useState(false)
  const [correlation, setCorrelation] = useState(0)
  const [noteFilter, setNoteFilter] = useState("All");

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

  const isSmallScreen = typeof window !== "undefined" && window.innerWidth < 640;
  useEffect(() => {
    if (userOrders.length > 0 && allOrders.length > 0) {
      const aggregated = userOrders
        .map((note) => {
          const noteOrders = allOrders.filter((order) => order.note_id === note.id && order.status == "succeeded")
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
      const prices = aggregated.map(n => n?.price).filter((v): v is number => v !== undefined);
      const revenues = aggregated.map(n => n?.revenue).filter((v): v is number => v !== undefined);
      const correlation = correl(prices, revenues);
      setMatchedOrders(aggregated)
      setIsLoading(false)
      setCorrelation(correlation)
      setIsEmpty(aggregated.length === 0)
      console.log("Aggregated Orders:", aggregated)
    }
  }, [userOrders, allOrders])
  console.log(matchedOrders)
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (matchedOrders.length === 0) {
        setIsLoading(false)
        setIsEmpty(true)
      }
    }, 5000)
    return () => clearTimeout(timeout)
  }, [matchedOrders])

  const filteredData = noteFilter === "All"
    ? matchedOrders
    : matchedOrders.filter((n) => n.note === noteFilter);
  return (
    <Card className="shadow-md hover:shadow-lg">
      <CardHeader>
        <CardTitle>Price vs Sales Count of Note</CardTitle>
        <Select value={noteFilter} onValueChange={setNoteFilter}>
          <SelectTrigger className="w-[180px] h-8 text-xs border-gray-200 shadow-sm">
            <SelectValue placeholder="Select Note" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Notes</SelectItem>
            {matchedOrders.map((n, i) => (
              <SelectItem key={i} value={n.note}>
                {n.note}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {isLoading ? (
          <></>
        ) : isEmpty ? (
          <></>
        ) : (
          (() => {
            if (correlation > 0.5) {
              return (
                <CardDescription className="text-green-600">
                  <strong>Overall Insights: </strong>Higher-priced notes tend to earn <strong>more revenue</strong>.
                </CardDescription>
              );
            } else if (correlation > 0.1) {
              return (
                <CardDescription className="text-green-500">
                  <strong>Overall Insights: </strong>Slight positive relationship — pricier notes may perform a bit better.
                </CardDescription>
              );
            } else if (correlation < -0.1) {
              return (
                <CardDescription className="text-red-500">
                  <strong>Overall Insights: </strong>Higher prices might reduce total sales — consider optimizing pricing.
                </CardDescription>
              );
            } else {
              return (
                <CardDescription className="text-gray-500">
                  <strong>Overall Insights: </strong>No clear relationship between price and revenue.
                </CardDescription>
              );
            }
          })()
        )}


      </CardHeader>
      <CardContent className="h-[400px] flex items-center justify-start sm:justify-center relative px-3 sm:px-6">
        {isLoading ? (
          <SpinItem />
        ) : isEmpty ? (
          <p className="text-gray-500 text-sm">No data found.</p>
        ) : (
          <ResponsiveContainer width="100%" height="100%" className="align-content-center ml-auto mr-auto justify-start sm:justify-center">
            <ScatterChart
              margin={
                isSmallScreen
                  ? { top: 30, right: 10, bottom: 40, left: 5 } 
                  : { top: 20, right: 30, bottom: 20, left: 20 }
              }
            >
              <CartesianGrid stroke="#e5e7eb" strokeDasharray="3 3" opacity={0.8} />

              <XAxis
                dataKey="price"
                type="number"
                tickLine={false}
                axisLine={false}
                tickMargin={isSmallScreen ? 5 : 8}
                tick={{ fill: "#6B7280", fontSize: isSmallScreen ? 11 : 12, fontWeight: 300 }}
              >
                <Label
                  value="Price of Single Note ($)"
                  position="insideBottom"
                  offset={-15}
                  style={{ fill: "#6B7280", fontSize: 13, fontWeight: 300 }}
                />
              </XAxis>

              <YAxis
                dataKey="salesCount"
                type="number"
                tickLine={false}
                axisLine={false}
                domain={
                  isSmallScreen
                    ? [0, "dataMax + 2"] 
                    : [0, "dataMax + 1"]
                }
                tickMargin={8}
                tick={{ fill: "#6B7280", fontSize: isSmallScreen ? 11 : 13, fontWeight: 300 }}
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

              <ZAxis type="number" dataKey="revenue" range={[60, 400]} name="Revenue" />

              <Scatter
                data={filteredData}
                fill="#14B8A6"
                stroke="#0D9488"
                strokeWidth={1.5}
                shape="circle"
                onClick={(data) => {
                  if (data && data.id) {
                    window.location.href = `/listing/${data.id}`;
                  }
                }}
                style={{ cursor: "pointer" }}
              />

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