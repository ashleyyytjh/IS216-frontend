import React, { useState } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download, Calendar } from "lucide-react"
import { downloadNotes } from "@/services/NotesService"
import { toast } from "sonner"
import { Link } from "react-router-dom"
import { useLocation } from "react-router-dom"

const UserActivityListing = ({ note, onDownload }) => {
  const [downloadState, setDownloadState] = useState<string | null>(null)
  const location = useLocation()
  console.log(location.pathname)

  const isSellerDashboard = location.pathname.includes("dashboardSeller")
  const profile = location.pathname.includes("profile")

  // normalize data shape (if wrapped under note.note, unwrap it)
  //const n = note.note ? note.note : note
  const n = note.note ? { ...note, ...note.note } : note;
  const handleDownload = () => {
    setDownloadState("downloading")
    downloadNotes(n.id)
      .then((res) => {
        toast.success("Successfully downloaded!")
        console.log(res)
      })
      .catch((err) => {
        console.error(err)
      })
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

  const isoString = n.createdAt
  const dateObject = new Date(isoString)
  const formatCurrency = (num: number) =>
    (num / 100).toLocaleString("en-SG", { style: "currency", currency: "SGD" })
  return (
    <Link
      to={!n?.userFullName ? `/orderdetails/${n.id}` : `/listings/${n.id}`}
      className="block"
    >
      <Card className="hover:shadow-lg transition-shadow duration-300 cursor-pointer">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="text-lg">{n.originalName}</span>
            <Badge variant="outline" className="font-mono">
              {n.module.toUpperCase()}
            </Badge>
          </CardTitle>
          {/* this means that the if have buyer id, it is to show in order page. */}
          {isSellerDashboard && (
            <CardDescription className="text-md">
              Tracking ID : {n.id}
            </CardDescription>
          )}
          <CardDescription>
            Note Type : {n.type.charAt(0).toUpperCase() + n.type.slice(1)}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {!n?.buyer_id && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center text-white text-sm font-bold">
                {n.userFullName
                  .split(" ")
                  .map((part) => part[0])
                  .join("")}
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

          {/* Rating and Date */}
          <div className="flex items-center justify-between text-sm text-gray-500">

            {(
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
            )}
            <div />

          </div>
        </CardContent>

        <CardFooter className="flex justify-between items-center pt-4 border-t">
          <span className="text-2xl font-bold text-black-600">
            {formatCurrency(n.price)}
          </span>

          {!n?.buyer_id && (
            <Button
              className="hover:shadow-xl text-white"
              onClick={(e) => {
                e.preventDefault() // prevent Link navigation
                e.stopPropagation() // stop bubbling
                handleDownload()
              }}
              disabled={downloadState === "downloading"}
            >
              <Download className="h-4 mr-2" />
              {getDownloadText()}
            </Button>
          )}

          {n?.buyer_id && <Button>Order Details</Button>}
        </CardFooter>
      </Card>
    </Link>
  )
}

export default UserActivityListing