"use client"

import { useState } from "react"
import { SerializedEditorState } from "lexical"

import { Editor } from "@/components/blocks/editor-00/editor"
import { Save } from "lucide-react"
import { Input } from "@/components/ui/input"

const initialValue = {
  root: {
    children: [
      {
        children: [
          {
            detail: 0,
            format: 0,
            mode: "normal",
            style: "",
            text: "Hello World 🚀" ,
            type: "text",
            version: 1,
          },
        ],
        direction: "ltr",
        format: "",
        indent: 0,
        type: "paragraph",
        version: 1,
      },
    ],
    direction: "ltr",
    format: "",
    indent: 0,
    type: "root",
    version: 1,
  },
} as unknown as SerializedEditorState

interface CreateComposeNotesReq {
  userId: string
  title: string
  tags: string[]
  publish: boolean
  price: number
  content: unknown
}

const mockNote: CreateComposeNotesReq = {
  userId: "mock-user-123",
  title: "Introduction to Machine Learning",
  tags: ["ai", "machine-learning", "lecture-notes"],
  publish: true,
  price: 5.0,
  content: {
    root: {
      type: "root",
      version: 1,
      children: [
        {
          type: "paragraph",
          version: 1,
          children: [
            {
              type: "text",
              text: "Machine learning is a subset of artificial intelligence focused on enabling systems to learn from data and improve over time without explicit programming.",
              detail: 0,
              format: 0,
              mode: "normal",
              style: "",
              version: 1,
            },
          ],
        },
      ],
    },
  },
  module: "IS216",
  embedding: [0.123456, 0.654321, 0.432198, 0.987654, 0.246810, 0.135791, 0.112233, 0.556677],
}

export default function EditorDemo() {
    const [editorState, setEditorState] = useState<SerializedEditorState>(
    
    (typeof mockNote !== "undefined" && mockNote?.content) ?? initialValue
  )

  const [title, setTitle] = useState<string>(
    
    (typeof mockNote !== "undefined" && mockNote?.title?.trim()) || "Untitled Note"
  )
    const [saving, setSaving] = useState(false)

    async function handleSave() {
        setSaving(true)
        try {
      // Simulate API save (replace with your own backend endpoint)
        await fetch("/api/notes", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title, content: editorState }),
        })
      // You can trigger a toast or message here
        console.log("Note saved successfully!")
        } catch (error) {
        console.error("Save failed:", error)
        } finally {
        setSaving(false)
        }
    }

  return (
    <div>
        <br></br>
        <div className="bg-background w-[90%] mx-auto overflow-hidden rounded-lg border">
        <div className="flex items-center justify-between border-b px-3 py-2">
            
        <Input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Untitled note"
        className="h-9 border-none bg-transparent shadow-none focus-visible:ring-0 text-base font-semibold"
        />

        <button
          onClick={handleSave}
          disabled={saving}
          className="flex h-8 w-8 items-center justify-center rounded-md transition hover:bg-accent hover:text-accent-foreground disabled:opacity-50"
          title="Save note"
        >
          <Save className="h-4 w-4" />
        </button>
      </div>
      </div>
      <br></br>
      <Editor
        editorSerializedState={editorState}
        onSerializedChange={(value) => setEditorState(value)}
      />

      <br></br>
    </div>
  )
}