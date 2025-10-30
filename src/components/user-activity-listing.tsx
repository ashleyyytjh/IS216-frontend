import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

import { useLocation, useNavigate } from "react-router-dom"

const UserActivityListing = ({ note }) => {
  const navigate = useNavigate();
  const location = useLocation()
  const isSellerDashboard = location.pathname.includes("dashboardSeller")
  const n = note.note ? { ...note, ...note.note } : note
  const formatCurrency = (num: number) =>
    (num / 100).toLocaleString("en-SG", { style: "currency", currency: "SGD" })
  console.log(n, 'current Note.')
  return (
    <>
      <Card className="h-full flex flex-col hover:shadow-lg transition-shadow duration-300 cursor-pointer relative overflow-hidden">
        <CardHeader className="pr-6 md:pr-24">
          <div className="flex flex-col">
            <span className="text-sm sm:text-lg font-semibold break-words">{n.originalName || n.title}</span>

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
            <CardDescription className="text-sm">
              Tracking ID : {n.id}
            </CardDescription>
          )}
          <CardDescription className="text-sm">
            Type : {n.noteType?.charAt(0).toUpperCase() + n.noteType?.slice(1)} Note
          </CardDescription>
        </CardHeader>

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
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center pt-4 border-t gap-2"
        >
          <span className="text-2xl font-bold text-black-600">
            {formatCurrency(n.price)}
          </span>

          {n?.buyer_id && (
            <div
              className="flex flex-row gap-1.5 sm:flex-row sm:gap-2 sm:ml-auto sm:justify-end w-full sm:w-auto"
            >
              {
                isSellerDashboard ? (
                  <Button
                  size="sm"
                    className="flex items-center gap-1 border-none px-2 py-1 bg-slate-900 hover:bg-slate-800 text-white"
                    onClick={() => navigate(`/orderdetails/${n.id}`, { state: { order: n } })}
                    // onClick={() => navigate(`/orderdetails/${n.id}`)}
                  >
                    <span className="text-xs font-medium">Order Details</span>
                  </Button>
                ) : (
                  <></>
                )
              }
              
              {
                n.noteType == "normal" ? (
                  <Button
              size="sm"
                className="flex items-center gap-1 border-none px-2 py-1 w-auto bg-slate-800/90 hover:bg-slate-700/90 text-slate-100"
                onClick={() => navigate(`/listings/${n.note_id}`)}
              >
                <span className="text-xs font-medium">Note Details</span>
              </Button>
                ) : (
                  <Button
              size="sm"
                className="flex items-center gap-1 border-none px-2 py-1 w-auto bg-slate-800/90 hover:bg-slate-700/90 text-slate-100"
                onClick={() => navigate(`/article/${n.note_id}`)}
              >
                <span className="text-xs font-medium">Note Details</span>
              </Button>
                )
              }
              
            </div>
          )}
        </CardFooter>
      </Card>
    </>

  )
}

export default UserActivityListing
