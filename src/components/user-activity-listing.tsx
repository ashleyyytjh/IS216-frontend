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
import { downloadNotes } from "@/services/NotesService"
import { toast } from "sonner"
import { Link, useLocation } from "react-router-dom"

const UserActivityListing = ({ note, onDownload }) => {
  const [downloadState, setDownloadState] = useState<string | null>(null)
  const location = useLocation()

  const isSellerDashboard = location.pathname.includes("dashboardSeller")
  const n = note.note ? { ...note, ...note.note } : note

  const handleDownload = () => {
    setDownloadState("downloading")
    downloadNotes(n.id)
      .then(() => toast.success("Successfully downloaded!"))
      .catch(console.error)

    setTimeout(() => {
      setDownloadState("completed")
      setTimeout(() => setDownloadState(null), 2000)
    }, 1500)

    if (onDownload) onDownload(n.id)
  }

  const getDownloadText = () => {
    if (downloadState === "downloading") return "Downloading..."
    if (downloadState === "completed") return "Downloaded!"
    return n.status === "downloaded" ? "Re-download" : "Download"
  }

  const formatCurrency = (num: number) =>
    (num / 100).toLocaleString("en-SG", { style: "currency", currency: "SGD" })

  return (
    <Link
      to={!n?.userFullName ? `/orderdetails/${n.id}` : `/listings/${n.id}`}
      className="block h-full"
    >
      {/* make card fill and stack so footer sits at bottom */}
      <Card className="h-full flex flex-col hover:shadow-lg transition-shadow duration-300 cursor-pointer relative overflow-hidden">
        <CardHeader className="pr-0 md:pr-24">
          <div className="flex flex-col">
            <span className="text-lg font-semibold break-words">{n.originalName}</span>

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

          <p className="text-gray-600 text-sm leading-relaxed">
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

        <CardFooter className="flex flex-col xs:flex-col sm:flex-row justify-between items-center pt-4 border-t gap-2">
          <span className="text-2xl font-bold text-black-600">
            {formatCurrency(n.price)}
          </span>

          {n?.buyer_id && (
            <Button className="w-full sm:w-auto mt-2 sm:mt-0">
              Order Details
            </Button>
          )}
        </CardFooter>
      </Card>
    </Link>
  )
}

export default UserActivityListing
