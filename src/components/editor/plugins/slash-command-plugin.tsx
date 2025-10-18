// src/components/editor/plugins/slash-command-plugin.tsx
"use client"

import * as React from "react"
import { createPortal } from "react-dom"
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import {
  LexicalTypeaheadMenuPlugin,
  useBasicTypeaheadTriggerMatch,
  MenuOption,
} from "@lexical/react/LexicalTypeaheadMenuPlugin"
import {
  $createParagraphNode,
  $getSelection,
  $insertNodes,
  $isRangeSelection,
  LexicalEditor,
  KEY_DOWN_COMMAND,
  COMMAND_PRIORITY_CRITICAL,
  COMMAND_PRIORITY_LOW,
} from "lexical"
import { $setBlocksType } from "@lexical/selection"
import { $createHeadingNode, $createQuoteNode } from "@lexical/rich-text"
import {
  INSERT_CHECK_LIST_COMMAND,
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
} from "@lexical/list"
import {
  Heading1, Heading2, Heading3,
  List as BulletedIcon, ListOrdered,
  CheckSquare, Quote, Minus, Type as TextIcon
} from "lucide-react"


// ---- Types ----
type SlashItemInit = {
  title: string
  subtitle?: string
  keywords?: string[]
  icon: React.ReactNode
  onSelect: (editor: LexicalEditor) => void
}

// ---- Option model compatible with MenuOption ----
class SlashItem extends MenuOption {
  title: string
  subtitle?: string
  keywords?: string[]
  icon: React.ReactNode
  onSelect: (editor: LexicalEditor) => void

  // Must be a RefObject or undefined to match MenuOption typing
  ref: React.RefObject<HTMLElement | null> | undefined

  constructor(init: SlashItemInit, key?: string) {
    super(key ?? init.title)
    this.title = init.title
    this.subtitle = init.subtitle
    this.keywords = init.keywords
    this.icon = init.icon
    this.onSelect = init.onSelect
    this.ref = undefined
  }

  // LexicalTypeahead uses option.ref.current
  setRefElement = (el: HTMLElement | null) => {
    this.ref = { current: el } as React.RefObject<HTMLElement | null>
  }
}

// ---- Items ----
const RAW_ITEMS: SlashItemInit[] = [
  {
    title: "Text",
    subtitle: "Start writing with plain text",
    keywords: ["text","paragraph","plain","p"],
    icon: <TextIcon className="h-4 w-4" />,
    onSelect: (editor) =>
      editor.update(() => {
        const sel = $getSelection()
        if ($isRangeSelection(sel)) $setBlocksType(sel, () => $createParagraphNode())
      }),
  },
  {
    title: "Heading 1",
    subtitle: "Large section title",
    keywords: ["h1","title"],
    icon: <Heading1 className="h-4 w-4" />,
    onSelect: (editor) =>
      editor.update(() => {
        const sel = $getSelection()
        if ($isRangeSelection(sel)) $setBlocksType(sel, () => $createHeadingNode("h1"))
      }),
  },
  {
    title: "Heading 2",
    subtitle: "Medium section title",
    keywords: ["h2","subtitle"],
    icon: <Heading2 className="h-4 w-4" />,
    onSelect: (editor) =>
      editor.update(() => {
        const sel = $getSelection()
        if ($isRangeSelection(sel)) $setBlocksType(sel, () => $createHeadingNode("h2"))
      }),
  },
  {
    title: "Heading 3",
    subtitle: "Small section title",
    keywords: ["h3"],
    icon: <Heading3 className="h-4 w-4" />,
    onSelect: (editor) =>
      editor.update(() => {
        const sel = $getSelection()
        if ($isRangeSelection(sel)) $setBlocksType(sel, () => $createHeadingNode("h3"))
      }),
  },
  {
    title: "Bulleted list",
    subtitle: "Create a simple list",
    keywords: ["bullet","ul","list"],
    icon: <BulletedIcon className="h-4 w-4" />,
    onSelect: (editor) => editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined),
  },
  {
    title: "Numbered list",
    subtitle: "Create a list with numbering",
    keywords: ["numbered","ol","ordered"],
    icon: <ListOrdered className="h-4 w-4" />,
    onSelect: (editor) => editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined),
  },
  {
    title: "To-do list",
    subtitle: "Track tasks with checkboxes",
    keywords: ["todo","task","checkbox"],
    icon: <CheckSquare className="h-4 w-4" />,
    onSelect: (editor) => editor.dispatchCommand(INSERT_CHECK_LIST_COMMAND, undefined),
  },
  {
    title: "Quote",
    subtitle: "Capture a quote",
    keywords: ["quote","blockquote"],
    icon: <Quote className="h-4 w-4" />,
    onSelect: (editor) =>
      editor.update(() => {
        const sel = $getSelection()
        if ($isRangeSelection(sel)) $setBlocksType(sel, () => $createQuoteNode())
      }),
  },
]

const toOptions = (list: SlashItemInit[]) =>
  list.map((it, i) => new SlashItem(it, `${it.title}-${i}`))

function Row({
  option, selected, onClick,
}: { option: SlashItem; selected: boolean; onClick: () => void }) {
  return (
    <div
      className={`flex cursor-pointer items-center gap-3 rounded-md px-3 py-2 ${
        selected ? "bg-accent text-accent-foreground" : "hover:bg-accent/60"
      }`}
      ref={option.setRefElement}
      onMouseDown={(e) => { e.preventDefault(); onClick() }} // keep editor focus
    >
      <div className="text-muted-foreground">{option.icon}</div>
      <div className="flex flex-col">
        <span className="text-sm">{option.title}</span>
        {option.subtitle && (
          <span className="text-xs text-muted-foreground">{option.subtitle}</span>
        )}
      </div>
    </div>
  )
}

// ---- Component ----
// Accept the optional anchorElem prop you’re passing from editor.tsx
export function SlashCommandPlugin({ anchorElem }: { anchorElem?: HTMLElement | null }) {
  const [editor] = useLexicalComposerContext()
  const [portal, setPortal] = React.useState<HTMLElement | null>(null)
  const [options, setOptions] = React.useState<SlashItem[]>(toOptions(RAW_ITEMS))

  React.useEffect(() => {
    // If you want to portal within a specific container, use anchorElem; fallback to body
    setPortal(anchorElem ?? (typeof document !== "undefined" ? document.body : null))
  }, [anchorElem])

  // Do NOT swallow undo/redo; HistoryPlugin needs these
  React.useEffect(() => {
    return editor.registerCommand(
      KEY_DOWN_COMMAND,
      (e: KeyboardEvent) => {
        if (e.defaultPrevented || e.isComposing) return false
        if (e.metaKey || e.ctrlKey) return false
        return false
      },
      COMMAND_PRIORITY_CRITICAL
    )
  }, [editor])

  React.useEffect(() => {
    return editor.registerCommand(KEY_DOWN_COMMAND, () => false, COMMAND_PRIORITY_LOW)
  }, [editor])

  const trigger = useBasicTypeaheadTriggerMatch("/", { minLength: 0 })

  return (
    <LexicalTypeaheadMenuPlugin<SlashItem>
      triggerFn={trigger}
      options={options}
      onQueryChange={(q) => {
            const query = q ? q.trim().toLowerCase() : ""
        const filtered = query
          ? RAW_ITEMS.filter(
              (i) =>
                i.title.toLowerCase().includes(query) ||
                (i.keywords?.some((k) => k.toLowerCase().includes(query)) ?? false)
            )
          : RAW_ITEMS
        setOptions(toOptions(filtered))
      }}
      onSelectOption={(option, nodeToRemove, closeMenu) => {
        // avoid racing current transaction
        queueMicrotask(() => {
          editor.update(() => nodeToRemove?.remove())
          option.onSelect(editor)
          closeMenu()
        })
      }}
      menuRenderFn={(anchorRef, { selectedIndex, selectOptionAndCleanUp, setHighlightedIndex }) => {
        if (!portal || !anchorRef.current) return null
        const rect = anchorRef.current.getBoundingClientRect?.()
        if (!rect) return null

        // Use fixed + high z-index so it’s above other UI
        const style: React.CSSProperties = {
          position: "fixed",
          top: rect.bottom + 6,
          left: rect.left,
          zIndex: 99999,
        }

        return createPortal(
          <div className="mt-1 w-72 rounded-lg border bg-popover p-2 shadow-md" style={style}>
            <div className="max-h-80 overflow-auto">
              {options.map((opt, i) => (
                <div key={opt.key} onMouseEnter={() => setHighlightedIndex(i)}>
                  <Row
                    option={opt}
                    selected={i === selectedIndex}
                    onClick={() => selectOptionAndCleanUp(opt)}
                  />
                </div>
              ))}
            </div>
          </div>,
          portal
        )
      }}
    />
  )
}

export default SlashCommandPlugin
