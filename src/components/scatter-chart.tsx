"use client"

import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ZAxis, Label } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const jitter = (range = 0.2) => (Math.random() - 0.5) * range;

const data = [
    //need to process the notes.
    //Get all notes owned by the user first.
    //Onced own, get those that she sold and keep the count
    //use price from notes to count the amount of times (revenue)

  { id: 1, note: "NLP Notes", price: 5, salesCount: 20, revenue: 100 },
  { id: 2, note: "QF102 Notes", price: 8, salesCount: 5, revenue: 40 },
  { id: 3, note: "CS425 Notes", price: 12, salesCount: 15, revenue: 180 },
  { id: 4, note: "CS426 Notes", price: 12 + jitter(), salesCount: 15 + jitter(), revenue: 180 },
];

export function ScatterVisual() {
    return (
        <Card className="shadow-md">
            <CardHeader>
                <CardTitle>Price vs Sales Count</CardTitle>
                <CardDescription>Based on price of note and sales made.</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%" className="align-content-center ml-auto mr-auto">
                    <ScatterChart margin={{ top: 20, right: 30, bottom: 20, left: 20 }}>
                        <CartesianGrid stroke="#e5e7eb"
                            strokeDasharray="3 3"
                            opacity={0.8} />
                        <XAxis
                            dataKey="price"
                            name="Price"
                            type="number"  
                            stroke="#6b7280"
                            tick={{ fill: "#374151", fontSize: 12 }}
                        >
                            <Label
                                value="Price ($)"
                                offset={-5}
                                position="insideBottom"
                                style={{ textAnchor: "middle", fill: "#374151", fontSize: 14 }}
                            />
                        </XAxis>
                        <YAxis
                            dataKey="salesCount"
                            name="Sales Count"
                            stroke="#6b7280"
                            tick={{ fill: "#374151", fontSize: 14 }}

                        >
                            <Label
                                value="Value (Units)"
                                angle={-90}
                                position="insideLeft"
                                style={{ textAnchor: "middle", fill: "#374151", fontSize: 12 }}
                            />
                        </YAxis>
                        <ZAxis type="number" dataKey="revenue" range={[50, 400]} name="Revenue" />
                        <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                        <Scatter data={data.map((d, i) => ({ ...d, id: i }))} fill="var(--chart-3)" strokeWidth={1.5} stroke="#374151"/>
                    </ScatterChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    )
}