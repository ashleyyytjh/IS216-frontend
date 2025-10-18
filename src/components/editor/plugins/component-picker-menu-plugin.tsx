"use client"

import { JSX, useCallback, useMemo, useState } from "react"
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import {
  LexicalTypeaheadMenuPlugin,
  useBasicTypeaheadTriggerMatch,
} from "@lexical/react/LexicalTypeaheadMenuPlugin"
import { TextNode } from "lexical"
import { createPortal } from "react-dom"

import { useEditorModal } from "@/components/editor/editor-hooks/use-modal"
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command"

import { ComponentPickerOption } from "./picker/component-picker-option"

/* ---------- Helpers ---------- */
function escapeRegExp(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

export function ComponentPickerMenuPlugin({
  baseOptions = [],
  dynamicOptionsFn,
}: {
  baseOptions?: Array<ComponentPickerOption>
  dynamicOptionsFn?: (args: { queryString: string }) => Array<ComponentPickerOption>
}): JSX.Element {
  const [editor] = useLexicalComposerContext()
  const [modal, showModal] = useEditorModal()
  const [queryString, setQueryString] = useState<string | null>(null)

  const trigger = useBasicTypeaheadTriggerMatch("/", { minLength: 0 })

  const options = useMemo(() => {
    // start with dynamic first so they appear on top when typing
    if (!queryString) {
      return baseOptions
    }
    const rx = new RegExp(escapeRegExp(queryString), "i")
    const dyn = dynamicOptionsFn?.({ queryString }) ?? []
    const filteredBase = baseOptions.filter(
      (opt) => rx.test(opt.title) || opt.keywords.some((k) => rx.test(k))
    )
    return [...dyn, ...filteredBase]
  }, [baseOptions, dynamicOptionsFn, queryString])

  const onSelectOption = useCallback(
    (
      selectedOption: ComponentPickerOption,
      nodeToRemove: TextNode | null,
      closeMenu: () => void,
      matchingString: string
    ) => {
      editor.update(() => {
        nodeToRemove?.remove()
        selectedOption.onSelect(matchingString, editor, showModal)
        closeMenu()
      })
    },
    [editor, showModal]
  )

  return (
    <>
      {modal}
      <LexicalTypeaheadMenuPlugin<ComponentPickerOption>
        onQueryChange={setQueryString}
        onSelectOption={onSelectOption}
        triggerFn={trigger}
        options={options}
        menuRenderFn={(
          anchorRef,
          { selectedIndex, selectOptionAndCleanUp, setHighlightedIndex }
        ) => {
          if (!anchorRef.current || options.length === 0) return null

          const rect = anchorRef.current.getBoundingClientRect?.()
          const style: React.CSSProperties = rect
            ? {
                position: "absolute",
                top: rect.bottom + window.scrollY + 8,
                left: rect.left + window.scrollX,
              }
            : {}

          return createPortal(
            <div className="z-10 w-[250px] rounded-md shadow-md" style={style}>
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
                        value={option.title}
                        onSelect={() => selectOptionAndCleanUp(option)}
                        className={`flex items-center gap-2 ${
                          selectedIndex === index ? "bg-accent" : "!bg-transparent"
                        }`}
                      >
                        {option.icon}
                        {option.title}
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
    </>
  )
}
