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
  Cell,
} from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getOwnedComposeNotes, getUserOwned } from "@/services/NotesService"
import { useEffect, useState } from "react"
import { getOrders } from "@/services/OrdersService"
import SpinItem from "./spinner"
import { correl } from "@/utils/correlation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { useMediaQuery } from "usehooks-ts"


//Code for scatter plot.
export function ScatterVisual() {
  const [userNotes, setUserNote] = useState<any[]>([])
  const [allOrders, setAllOrders] = useState<any[]>([])
  const [matchedOrders, setMatchedOrders] = useState<any[]>([])

  const [isLoading, setIsLoading] = useState(true)
  const [isEmpty, setIsEmpty] = useState(false)
  const [correlation, setCorrelation] = useState(0)
  const [noteFilter, setNoteFilter] = useState("All");


  //all orders
  useEffect(() => {
    async function fetchData() {
      try {
        const [normalNotesRaw, composedNotesRaw, ordersRaw] = await Promise.all([
          getUserOwned(),
          getOwnedComposeNotes(),
          getOrders(),
        ]);
        //desanitise. if normalnoteraw is not arr, ref data, else empty arr
        const normalNotes = Array.isArray(normalNotesRaw)
          ? normalNotesRaw
          : normalNotesRaw?.data ?? [];
        const composedNotes = Array.isArray(composedNotesRaw)
          ? composedNotesRaw
          : composedNotesRaw?.data ?? [];
        const orders = Array.isArray(ordersRaw)
          ? ordersRaw
          : ordersRaw?.data ?? [];
        const allUserNotes = [
          ...normalNotes.map((n) => ({ ...n, type: "normal" })),
          ...composedNotes.map((n) => ({ ...n, type: "composed" })),
        ];
        //works here. but due to collision, if you put same price, will not really show.
        // orders.push({
        //   buyer_id: "594a352c-2081-706e-b679-00b936e6b8f9",
        //   id: 109,
        //   note_id: "68f46033d4eca64133084d5d",
        //   price: 1,
        //   status: "succeeded",
        //   stripe_transaction_id: "pi_3SI0K93X5OiOA0YE1G7ztLfM",
        // })
        console.log("normal:", normalNotes.length);
        console.log("composed:", composedNotes.length);
        console.log("total:", orders.length);
        setUserNote(allUserNotes);
        setAllOrders(orders);
      } catch (err) {
      }
    }

    fetchData();
  }, []);

  console.log(userNotes, 'l74')
  console.log(allOrders, '75')

  //navigation code for scatter plot clicking.
  const hrefMover = (data: any) => {
    console.log(data)
    if (data && data.id && data.payload.type == "normal") {
      window.location.href = `/listings/${data.id}`;
    }
    else {
      window.location.href = `/article/${data.id}`;
    }
  }

  //custom tooltip code for scatter and allows for clicks.
  const showTooltip = ({ active, payload }) => {
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
    } else {
      return null
    }
  }
  const isSmallScreen = useMediaQuery("(max-width: 400px)"); // smallscreen checks for responsiveness below.
  useEffect(() => {
    if (userNotes.length > 0 && allOrders.length > 0) {

      const aggregated = userNotes
        .map((note) => {

          //mapping to only get succeded ones.
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
            type: note.type,
          }
        }).filter(Boolean)

      //remove falsy values like 0 etc.

      //allows scatter to show visible changes like if two notes are the same price, it shows visually different
      //better for ux.
      const jittered = aggregated.map((point:any, i, arr) => {
        const duplicates = arr.filter(
          (p:any) => p.price === point?.price && p.salesCount === point?.salesCount
        );

        if (duplicates.length > 1) {
          const index = duplicates.findIndex((p) => p?.id === point?.id);
          return { ...point, price: point.price + index * 0.05 };
        }

        return point;
      });
      const prices = aggregated.map(n => n?.price).filter((v): v is number => v !== undefined);
      const revenues = aggregated.map(n => n?.revenue).filter((v): v is number => v !== undefined);

      //correlation to get insights from the charts.
      const correlation = correl(prices, revenues);
      console.log(correlation)
      setMatchedOrders(jittered)
      setIsLoading(false)
      setCorrelation(correlation)
      setIsEmpty(aggregated.length === 0)
    }
  }, [userNotes, allOrders])
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (matchedOrders.length === 0) {
        setIsLoading(false)
        setIsEmpty(true)
      }
    }, 5000)
    return () => clearTimeout(timeout)
  }, [matchedOrders])

  const filteredData = noteFilter === "All" ? matchedOrders : matchedOrders.filter((n) => n.note === noteFilter);
  return (
    <Card className="min-h-[400px]">
      <CardHeader>
        <CardTitle>Price vs Sales Count of Note</CardTitle>
        <div className="w-[130px] max-[400px]:w-[115px] max-[400px]:text-sm max-[400px]:h-6">
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
        </div>
        <div className="max-[400px]:mt-5">
          {isLoading || isEmpty ? (
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
        </div>



      </CardHeader>
      <CardContent className="relative flex-1 flex items-center justify-start sm:justify-center h-[380px] sm:h-[380px] max-[640px]:h-[280px] max-[400px]:h-[250px] px-2 pt-4 sm:px-6 sm:pt-6">
        {isLoading ? (
          <SpinItem />
        ) : isEmpty ? (
          <div className="align-center text-center ml-auto mr-auto">
            <p className="text-gray-500 text-sm">No data found.</p>
          </div>

        ) : (
          <div className="w-full h-[380px] sm:h-[380px] max-[640px]:h-[280px] max-[400px]:h-[250px]">
            {/* Abit different here. previously, theres X Y axis but now, there is Z axis for scatter. */}
            <ResponsiveContainer width="100%" height="100%" className="align-content-center ml-auto mr-auto justify-start sm:justify-center">
              <ScatterChart
                margin={
                  //responsive check.
                  isSmallScreen
                    ? { top: 15, right: 10, bottom: 25, left: 10 }
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
                  tick={{ fill: "#6B7280", fontSize: isSmallScreen ? 9 : 12, fontWeight: 400 }}
                >
                  <Label
                    value="Price of Single Note ($)"
                    position="insideBottom"
                    offset={-15}
                    style={{ fill: "#6B7280", fontSize: isSmallScreen ? 10 : 13, fontWeight: 300 }}
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
                  tick={{ fill: "#6B7280", fontSize: isSmallScreen ? 9 : 12, fontWeight: 400 }}
                >
                  <Label
                    value="Total Sale Count"
                    angle={-90}
                    position="center"
                    dx={-30}
                    offset={100}
                    style={{ fill: "#6B7280", fontSize: isSmallScreen ? 10 : 13, fontWeight: 300 }}
                  />
                </YAxis>

                <ZAxis type="number" dataKey="revenue" range={isSmallScreen ? [25, 160] : [60, 400]} name="Revenue" />

                <Scatter
                  data={filteredData}
                  fill="#14B8A6"
                  stroke="#0D9488"
                  strokeWidth={1.5}
                  shape="circle"
                  onClick={(data) => { hrefMover(data) }}
                  style={{ cursor: "pointer" }}
                >
                </Scatter>
                <Tooltip
                  cursor={{ strokeDasharray: "3 3" }}
                  content={({ active, payload }) => showTooltip({ active, payload })}
                />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  )
}