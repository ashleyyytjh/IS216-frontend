"use client"

/**
 * Emoji picker typeahead for Lexical (Vite/React)
 */
import * as React from "react"
import { useCallback, useEffect, useMemo, useState } from "react"
import { createPortal } from "react-dom"
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import {
  LexicalTypeaheadMenuPlugin,
  MenuOption,
  useBasicTypeaheadTriggerMatch,
} from "@lexical/react/LexicalTypeaheadMenuPlugin"
import {
  $createTextNode,
  $getSelection,
  $isRangeSelection,
  TextNode,
} from "lexical"

import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command"

/* ---------------- Utilities ---------------- */

function escapeRegExp(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

/* ---------------- Types & Option ---------------- */

class EmojiOption extends MenuOption {
  title: string
  emoji: string
  keywords: string[]

  constructor(
    title: string,
    emoji: string,
    options: {
      keywords?: string[]
    } = {}
  ) {
    super(title) // sets .key too
    this.title = title
    this.emoji = emoji
    this.keywords = options.keywords ?? []
  }
}

type Emoji = {
  emoji: string
  description: string
  category: string
  aliases: string[]
  tags: string[]
  unicode_version: string
  ios_version: string
  skin_tones?: boolean
}

const MAX_EMOJI_SUGGESTION_COUNT = 10

/* ---------------- Component ---------------- */

export function EmojiPickerPlugin() {
  const [editor] = useLexicalComposerContext()
  const [queryString, setQueryString] = useState<string | null>(null)
  const [emojis, setEmojis] = useState<Emoji[]>([])
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    // your path might differ
    import("../utils/emoji-list").then((file) => setEmojis(file.default))
  }, [])

  const emojiOptions = useMemo(
    () =>
      emojis.map(
        ({ emoji, aliases, tags }) =>
          new EmojiOption(aliases[0] ?? emoji, emoji, {
            keywords: [...(aliases ?? []), ...(tags ?? [])],
          })
      ),
    [emojis]
  )

  const checkForTriggerMatch = useBasicTypeaheadTriggerMatch(":", {
    minLength: 0,
  })

  const options: EmojiOption[] = useMemo(() => {
    if (!queryString) {
      // no query => allow all
      return emojiOptions.slice(0, MAX_EMOJI_SUGGESTION_COUNT)
    }
    const rx = new RegExp(escapeRegExp(queryString), "i")
    return emojiOptions
      .filter((option) => {
        if (rx.test(option.title)) return true
        return option.keywords?.some((k) => rx.test(k)) ?? false
      })
      .slice(0, MAX_EMOJI_SUGGESTION_COUNT)
  }, [emojiOptions, queryString])

  const onSelectOption = useCallback(
    (
      selectedOption: EmojiOption,
      nodeToRemove: TextNode | null,
      closeMenu: () => void
    ) => {
      editor.update(() => {
        const selection = $getSelection()
        if (!$isRangeSelection(selection) || !selectedOption) return
        if (nodeToRemove) nodeToRemove.remove()
        selection.insertNodes([$createTextNode(selectedOption.emoji)])
        closeMenu()
      })
    },
    [editor]
  )

  return (
    <LexicalTypeaheadMenuPlugin
      onQueryChange={setQueryString}
      onSelectOption={onSelectOption}
      triggerFn={checkForTriggerMatch}
      options={options}
      onOpen={() => setIsOpen(true)}
      onClose={() => setIsOpen(false)}
      menuRenderFn={(
        anchorElementRef,
        { selectedIndex, selectOptionAndCleanUp, setHighlightedIndex }
      ) => {
        if (!anchorElementRef.current || options.length === 0) return null

        // Position the menu relative to the anchor
        const anchor = anchorElementRef.current
        const rect = anchor.getBoundingClientRect?.()
        const style: React.CSSProperties = rect
          ? {
              position: "absolute",
              top: rect.bottom + window.scrollY + 8,
              left: rect.left + window.scrollX,
            }
          : {}

        return createPortal(
          <div className="z-10 w-[220px] rounded-md shadow-md" style={style}>
            <Command
              onKeyDown={(e) => {
                if (e.key === "ArrowUp") {
                  e.preventDefault()
                  setHighlightedIndex(
                    selectedIndex != null
                      ? (selectedIndex - 1 + options.length) % options.length
                      : options.length - 1
                  )
                } else if (e.key === "ArrowDown") {
                  e.preventDefault()
                  setHighlightedIndex(
                    selectedIndex != null
                      ? (selectedIndex + 1) % options.length
                      : 0
                  )
                }
              }}
            >
              <CommandList>
                <CommandGroup>
                  {options.map((option, index) => (
                    <CommandItem
                      key={option.key}
                      value={option.title}
                      onSelect={() => selectOptionAndCleanUp(option)}
                      className={`flex items-center gap-2 ${
                        selectedIndex === index ? "bg-accent" : "!bg-transparent"
                      }`}
                    >
                      {option.emoji} {option.title}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </div>,
          document.body
        )
      }}
    />
  )
}
