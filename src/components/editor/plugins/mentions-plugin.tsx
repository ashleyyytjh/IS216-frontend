"use client"

import * as React from "react"
import { JSX, useCallback, useEffect, useMemo, useState } from "react"
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import {
  LexicalTypeaheadMenuPlugin,
  MenuOption,
  MenuTextMatch,
  useBasicTypeaheadTriggerMatch,
} from "@lexical/react/LexicalTypeaheadMenuPlugin"
import { TextNode } from "lexical"
import { CircleUserRoundIcon } from "lucide-react"
import { createPortal } from "react-dom"

import { $createMentionNode } from "@/components/editor/nodes/mention-node"
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command"

/* ---------------- Constants ---------------- */

const PUNCTUATION =
  "\\.,\\+\\*\\?\\$\\@\\|#{}\\(\\)\\^\\-\\[\\]\\\\/!%'\"~=<>_:;"
const NAME = "\\b[A-Z][^\\s" + PUNCTUATION + "]"

const PUNC = PUNCTUATION
const TRIGGERS = "@"
const VALID_CHARS = `[^${TRIGGERS}${PUNC}\\s]`
const VALID_JOINS = "(?:\\.[ |$]| |[" + PUNC + "])"
const LENGTH_LIMIT = 75
const ALIAS_LENGTH_LIMIT = 50
const SUGGESTION_LIST_LENGTH_LIMIT = 5

const AtSignMentionsRegex = new RegExp(
  `(^|\\s|\\()([${TRIGGERS}]((?:${VALID_CHARS}${VALID_JOINS}){0,${LENGTH_LIMIT}}))$`
)

const AtSignMentionsRegexAliasRegex = new RegExp(
  `(^|\\s|\\()([${TRIGGERS}]((?:${VALID_CHARS}){0,${ALIAS_LENGTH_LIMIT}}))$`
)

/* ---------------- Dummy Data ---------------- */

const mentionsCache = new Map<string | null, string[] | null>()

const dummyMentionsData = ["Luke Skywalker", "Leia Organa", "Han Solo", "Yoda", "Obi-Wan Kenobi"]

const dummyLookupService = {
  search(string: string, callback: (results: string[]) => void): void {
    setTimeout(() => {
      const results = dummyMentionsData.filter((mention) =>
        mention.toLowerCase().includes(string.toLowerCase())
      )
      callback(results)
    }, 300)
  },
}

/* ---------------- Utils ---------------- */

function useMentionLookupService(mentionString: string | null) {
  const [results, setResults] = useState<string[]>([])

  useEffect(() => {
    const cached = mentionsCache.get(mentionString)
    if (!mentionString) {
      setResults([])
      return
    }
    if (cached === null) return
    if (cached !== undefined) {
      setResults(cached)
      return
    }

    mentionsCache.set(mentionString, null)
    dummyLookupService.search(mentionString, (newResults) => {
      mentionsCache.set(mentionString, newResults)
      setResults(newResults)
    })
  }, [mentionString])

  return results
}

function checkForAtSignMentions(
  text: string,
  minMatchLength: number
): MenuTextMatch | null {
  let match = AtSignMentionsRegex.exec(text) || AtSignMentionsRegexAliasRegex.exec(text)
  if (!match) return null

  const maybeLeadingWhitespace = match[1]
  const matchingString = match[3]
  if (matchingString.length >= minMatchLength) {
    return {
      leadOffset: match.index + maybeLeadingWhitespace.length,
      matchingString,
      replaceableString: match[2],
    }
  }
  return null
}

function getPossibleQueryMatch(text: string): MenuTextMatch | null {
  return checkForAtSignMentions(text, 1)
}

/* ---------------- Option ---------------- */

class MentionTypeaheadOption extends MenuOption {
  name: string
  picture: JSX.Element

  constructor(name: string, picture: JSX.Element) {
    super(name)
    this.name = name
    this.picture = picture
  }
}

/* ---------------- Component ---------------- */

export function MentionsPlugin(): JSX.Element | null {
  const [editor] = useLexicalComposerContext()
  const [queryString, setQueryString] = useState<string | null>(null)
  const results = useMentionLookupService(queryString)

  const checkForSlashTriggerMatch = useBasicTypeaheadTriggerMatch("/", { minLength: 0 })

  const options = useMemo(
    () =>
      results
        .map(
          (result) =>
            new MentionTypeaheadOption(
              result,
              <CircleUserRoundIcon className="size-4" />
            )
        )
        .slice(0, SUGGESTION_LIST_LENGTH_LIMIT),
    [results]
  )

  const onSelectOption = useCallback(
    (
      selectedOption: MentionTypeaheadOption,
      nodeToReplace: TextNode | null,
      closeMenu: () => void
    ) => {
      editor.update(() => {
        const mentionNode = $createMentionNode(selectedOption.name)
        if (nodeToReplace) nodeToReplace.replace(mentionNode)
        mentionNode.select()
        closeMenu()
      })
    },
    [editor]
  )

  const checkForMentionMatch = useCallback(
    (text: string) => {
      const slashMatch = checkForSlashTriggerMatch(text, editor)
      if (slashMatch) return null
      return getPossibleQueryMatch(text)
    },
    [checkForSlashTriggerMatch, editor]
  )

  return (
    <LexicalTypeaheadMenuPlugin<MentionTypeaheadOption>
      onQueryChange={setQueryString}
      onSelectOption={onSelectOption}
      triggerFn={checkForMentionMatch}
      options={options}
      menuRenderFn={(
        anchorRef,
        { selectedIndex, selectOptionAndCleanUp, setHighlightedIndex }
      ) => {
        if (!anchorRef.current || results.length === 0) return null

        const rect = anchorRef.current.getBoundingClientRect?.()
        const style: React.CSSProperties = rect
          ? {
              position: "absolute",
              top: rect.bottom + window.scrollY + 8,
              left: rect.left + window.scrollX,
            }
          : {}

        return createPortal(
          <div className="z-10 w-[200px] rounded-md shadow-md" style={style}>
            <Command
              onKeyDown={(e) => {
                if (e.key === "ArrowUp") {
                  e.preventDefault()
                  setHighlightedIndex(
                    selectedIndex !== null
                      ? (selectedIndex - 1 + options.length) % options.length
                      : options.length - 1
                  )
                } else if (e.key === "ArrowDown") {
                  e.preventDefault()
                  setHighlightedIndex(
                    selectedIndex !== null
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
                      value={option.name}
                      onSelect={() => selectOptionAndCleanUp(option)}
                      className={`flex items-center gap-2 ${
                        selectedIndex === index ? "bg-accent" : "!bg-transparent"
                      }`}
                    >
                      {option.picture}
                      {option.name}
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
