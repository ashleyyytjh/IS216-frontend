"use client"

import * as React from "react"
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import { jsPDF } from "jspdf"
import { FileText } from "lucide-react"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

export function ExportPdfPlugin() {
  const [editor] = useLexicalComposerContext()
  const [open, setOpen] = React.useState(false)
  const [isExporting, setIsExporting] = React.useState(false)
  const [isEmpty, setIsEmpty] = React.useState(true)

  // detect if editor is empty
  React.useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const text = editor.getRootElement()?.innerText ?? ""
        setIsEmpty(text.trim().length === 0)
      })
    })
  }, [editor])

  const handleExport = async () => {
    setIsExporting(true)
    try {
      const editorState = editor.getEditorState()
      let textContent = ""
      editorState.read(() => {
        textContent = editor.getRootElement()?.innerText || ""
      })

      if (!textContent.trim()) {
        setIsExporting(false)
        setOpen(false)
        return
      }

      const doc = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" })
      const margin = 40
      const maxWidth = 515

      doc.setFont("Helvetica", "normal")
      doc.setFontSize(12)
      doc.text(textContent, margin, margin, { maxWidth, align: "left" })
      doc.save("document.pdf")
    } finally {
      setIsExporting(false)
      setOpen(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <Tooltip>
        <TooltipTrigger asChild>
          <AlertDialogTrigger asChild>
            {/* Flat icon — same style as your other toolbar buttons */}
            <button
              disabled={isEmpty}
              className={`flex h-8 w-8 items-center justify-center rounded-md transition hover:bg-accent hover:text-accent-foreground ${
                isEmpty ? "opacity-50 cursor-not-allowed" : ""
              }`}
              aria-label="Export as PDF"
            >
              <FileText className="h-4 w-4" />
            </button>
          </AlertDialogTrigger>
        </TooltipTrigger>
        <TooltipContent>Export as PDF</TooltipContent>
      </Tooltip>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Export as PDF</AlertDialogTitle>
          <AlertDialogDescription>
            Do you want to export the current editor content as a PDF?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isExporting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleExport}
            disabled={isExporting}
            className="bg-red-600 hover:bg-red-600/90"
          >
            {isExporting ? "Exporting..." : "Export"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
