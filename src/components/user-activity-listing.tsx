import React, { useState } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

import { Link, useLocation, useNavigate } from "react-router-dom"

const UserActivityListing = ({ note, onDownload }) => {
  const navigate = useNavigate();
  const location = useLocation()

  const isSellerDashboard = location.pathname.includes("dashboardSeller")
  const n = note.note ? { ...note, ...note.note } : note
  console.log(n)


  const formatCurrency = (num: number) =>
    (num / 100).toLocaleString("en-SG", { style: "currency", currency: "SGD" })

  
  return (
    <>
      {/* make card fill and stack so footer sits at bottom */}
      <Card className="h-full flex flex-col hover:shadow-lg transition-shadow duration-300 cursor-pointer relative overflow-hidden">
        <CardHeader className="pr-6 md:pr-24">
          <div className="flex flex-col">
            <span className="text-sm sm:text-lg font-semibold break-words">{n.originalName}</span>

            {n?.module && (
              <Badge
                variant="outline"
                className="
                  mt-2 w-fit font-mono
                  md:absolute md:top-3 md:right-3
                  bg-white text-gray-800 border
                "
              >
                {String(n.module).toUpperCase()}
              </Badge>
            )}
          </div>

          {isSellerDashboard && (
            <CardDescription className="text-md">
              Tracking ID : {n.id}
            </CardDescription>
          )}
          <CardDescription>
            Note Type : {n.type?.charAt(0).toUpperCase() + n.type?.slice(1)}
          </CardDescription>
        </CardHeader>

        {/* grow to consume remaining space for equal heights */}
        <CardContent className="space-y-4 flex-1">
          {!n?.buyer_id && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center text-white text-sm font-bold">
                {n.userFullName?.split(" ").map((p) => p[0]).join("")}
              </div>
              <p className="font-semibold text-sm">{n.userFullName}</p>
            </div>
          )}

          <p className="text-gray-600 text-sm leading-relaxed hidden sm:block">
  {n.description}
</p>

          {n?.userFullName && (
            <div className="flex flex-wrap gap-1">
              {n.tags?.map((tag: string, index: number) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between text-sm text-gray-500">
            <>
              {n.status === "processing" ? (
                <Badge className="bg-amber-100 text-amber-700 border border-amber-300">
                  {n.status.charAt(0).toUpperCase() + n.status.slice(1)}
                </Badge>
              ) : n.status === "created" ? (
                <Badge className="bg-blue-100 text-blue-700 border border-blue-300">
                  Created
                </Badge>
              ) : n.status === "succeeded" ? (
                <Badge className="bg-green-100 text-green-700 border border-green-300">
                  Succeeded
                </Badge>
              ) : n.status === "failed" ? (
                <Badge className="bg-red-100 text-red-700 border border-red-300">
                  Failed
                </Badge>
              ) : null}
            </>
            <div />
          </div>
        </CardContent>

<CardFooter
  className="
    flex flex-col sm:flex-row justify-between items-start sm:items-center
    pt-4 border-t gap-2
  "
>
  {/* Price on the left */}
  <span className="text-2xl font-bold text-black-600">
    {formatCurrency(n.price)}
  </span>

  {/* Buttons group */}
  {n?.buyer_id && (
    <div
      className="
        flex flex-col gap-1.5 sm:flex-row sm:gap-2
        sm:ml-auto sm:justify-end w-full sm:w-auto
      "
    >
      {
        isSellerDashboard ? (
                <Button
        className="w-full sm:w-auto mt-2 sm:mt-0"
        onClick={() => navigate(`/orderdetails/${n.id}`)}
      >
        <p className="text-sm">Order Details</p>
      </Button>
        ) : (
          <></>
        )
      }


      <Button
        className="w-full sm:w-auto mt-2 sm:mt-0"
        onClick={() => navigate(`/listings/${n.note_id}`)}
      >
        <p className="text-sm">Note Details</p>
      </Button>
    </div>
  )}
</CardFooter>
      </Card>
    </>

  )
}

export default UserActivityListing
