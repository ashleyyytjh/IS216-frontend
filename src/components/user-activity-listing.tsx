import React, { useState } from "react"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download, Eye, Star, Calendar } from "lucide-react"

const UserActivityListing = ({ note, onDownload, location }) => {
  const [downloadState, setDownloadState] = useState<string | null>(null)

  // normalize data shape (if wrapped under note.note, unwrap it)
  const n = note.note ? note.note : note

  const handleDownload = () => {
    setDownloadState("downloading")
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

  const getStatusColor = () => {
    switch (n.status) {
      case "downloaded":
        return "bg-green-500"
      case "downloading":
        return "bg-yellow-500"
      default:
        return "bg-gray-400"
    }
  }

  const isoString = n.createdAt
  const dateObject = new Date(isoString)

  const formatCurrency = (num: number) =>
    num.toLocaleString("en-SG", { style: "currency", currency: "SGD" })

  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="text-lg">{n.originalName}</span>
          <Badge variant="outline" className="font-mono">
            {n.module}
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Author Info */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center text-white text-sm font-bold">
            {n.userFullName.split(" ").map((part) => part[0]).join("")}
          </div>
          <p className="font-semibold text-sm">{n.userFullName}</p>
        </div>

        <p className="text-gray-600 text-sm leading-relaxed">{n.description}</p>

        <div className="flex flex-wrap gap-1">
          {n.tags?.map((tag: string, index: number) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>

        {/* Rating and Date */}
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span>{note.rating ?? 0} ({note.reviews ?? 0})</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>{dateObject.toLocaleDateString()}</span>
          </div>
        </div>

        {/* Price */}
        <div className="flex justify-between items-center pt-4 border-t">
          <span className="text-2xl font-bold text-black-600">
            {formatCurrency(n.price)}
          </span>
        </div>
      </CardContent>

      <CardFooter className="flex gap-2 pt-0">
        <Button
          className="flex-1 hover:shadow-xl text-white"
          onClick={handleDownload}
          disabled={downloadState === "downloading"}
        >
          <Download className="w-4 h-4 mr-2" />
          {getDownloadText()}
        </Button>
        <Button variant="outline" size="sm">
          <Eye className="w-4 h-4" />
        </Button>
      </CardFooter>
    </Card>
  )
}

export default UserActivityListing