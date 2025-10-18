"use client"

import { useState } from "react"
import { ListItemNode, ListNode } from "@lexical/list"
import { CheckListPlugin } from "@lexical/react/LexicalCheckListPlugin"
import {
  InitialConfigType,
  LexicalComposer,
} from "@lexical/react/LexicalComposer"
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary"
import { ListPlugin } from "@lexical/react/LexicalListPlugin"
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin"
import { TablePlugin } from "@lexical/react/LexicalTablePlugin"
import { HeadingNode, QuoteNode } from "@lexical/rich-text"
import { TableCellNode, TableNode, TableRowNode } from "@lexical/table"
import { ParagraphNode, TextNode } from "lexical"
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin"
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin"
import { SerializedEditorState } from "lexical"

import { ContentEditable } from "@/components/editor/editor-ui/content-editable"
import { BlockFormatDropDown } from "@/components/editor/plugins/toolbar/block-format-toolbar-plugin"
import { FormatBulletedList } from "@/components/editor/plugins/toolbar/block-format/format-bulleted-list"
import { FormatCheckList } from "@/components/editor/plugins/toolbar/block-format/format-check-list"
import { FormatHeading } from "@/components/editor/plugins/toolbar/block-format/format-heading"
import { FormatNumberedList } from "@/components/editor/plugins/toolbar/block-format/format-numbered-list"
import { FormatParagraph } from "@/components/editor/plugins/toolbar/block-format/format-paragraph"
import { FormatQuote } from "@/components/editor/plugins/toolbar/block-format/format-quote"
import { ToolbarPlugin } from "@/components/editor/plugins/toolbar/toolbar-plugin"
import { editorTheme } from "@/components/editor/themes/editor-theme"
import { TooltipProvider } from "@/components/ui/tooltip"
import { ClearFormattingToolbarPlugin } from "@/components/editor/plugins/toolbar/clear-formatting-toolbar-plugin"
import { FontFamilyToolbarPlugin } from "@/components/editor/plugins/toolbar/font-family-toolbar-plugin"
import { HistoryToolbarPlugin } from "@/components/editor/plugins/toolbar/history-toolbar-plugin"
import { FontSizeToolbarPlugin } from "@/components/editor/plugins/toolbar/font-size-toolbar-plugin"
import { FontFormatToolbarPlugin } from "@/components/editor/plugins/toolbar/font-format-toolbar-plugin"
import { SubSuperToolbarPlugin } from "@/components/editor/plugins/toolbar/subsuper-toolbar-plugin"
import { AutoLinkPlugin } from "@/components/editor/plugins/auto-link-plugin"
import { FloatingLinkEditorPlugin } from "@/components/editor/plugins/floating-link-editor-plugin"
import { LinkPlugin } from "@/components/editor/plugins/link-plugin"
import { LinkToolbarPlugin } from "@/components/editor/plugins/toolbar/link-toolbar-plugin"
import { AutoLinkNode, LinkNode } from "@lexical/link"
import { ClickableLinkPlugin } from "@lexical/react/LexicalClickableLinkPlugin"
import { ActionsPlugin } from "@/components/editor/plugins/actions/actions-plugin"
import { ClearEditorActionPlugin } from "@/components/editor/plugins/actions/clear-editor-plugin"
import { ClearEditorPlugin } from "@lexical/react/LexicalClearEditorPlugin"
import { CounterCharacterPlugin } from "@/components/editor/plugins/actions/counter-character-plugin"
import { EditModeTogglePlugin } from "@/components/editor/plugins/actions/edit-mode-toggle-plugin"
// import { ImportExportPlugin } from "@/components/editor/plugins/actions/import-export-plugin"
import { ExportPdfPlugin } from "@/components/editor/plugins/toolbar/pdf"
// import { ImageNode } from "@/components/editor/nodes/image-node"
// import { ImagesPlugin } from "@/components/editor/plugins/images-plugin"
import { BlockInsertPlugin } from "@/components/editor/plugins/toolbar/block-insert-plugin"
// import { InsertImage } from "@/components/editor/plugins/toolbar/block-insert/insert-image"
import { InsertTable } from "@/components/editor/plugins/toolbar/block-insert/insert-table"

// import { FontBackgroundToolbarPlugin } from "@/components/editor/plugins/toolbar/font-background-toolbar-plugin"
// import { FontColorToolbarPlugin } from "@/components/editor/plugins/toolbar/font-color-toolbar-plugin"
import { ButtonGroup } from "@/components/ui/button-group"
import { ElementFormatToolbarPlugin } from "@/components/editor/plugins/toolbar/element-format-toolbar-plugin"
import { SlashCommandPlugin } from "@/components/editor/plugins/slash-command-plugin"


type EditorProps = {
  editorSerializedState?: SerializedEditorState
  onSerializedChange?: (value: SerializedEditorState) => void
}

const editorConfig: InitialConfigType = {
  namespace: "Editor",
  theme: editorTheme,
  nodes: [
    HeadingNode,
    ParagraphNode,
    TextNode,
    QuoteNode,
    ListNode,
    ListItemNode,
    LinkNode,
    AutoLinkNode,
    // ImageNode,
    TableNode,
    TableRowNode,
    TableCellNode,
  ],
  onError: (error: Error) => {
    console.error(error)
  },
}

export function Editor({
  editorSerializedState,
  onSerializedChange,
}: EditorProps) {
  return (
    <div className="bg-background w-[90%] mx-auto overflow-hidden rounded-lg border">
      <LexicalComposer
        initialConfig={{
          ...editorConfig,
         
          editorState: (editor) => {
            if (editorSerializedState) {
              const parsed = editor.parseEditorState(editorSerializedState)
              editor.setEditorState(parsed)
            }
          },
        }}
      >
        <TooltipProvider>
          <Plugins />
         
          <OnChangePlugin
            onChange={(state) =>
              onSerializedChange?.(state.toJSON() as SerializedEditorState)
            }
          />
        </TooltipProvider>
      </LexicalComposer>
    </div>
  )
}

const placeholder = "Press / for commands..."

export function Plugins() {
  const [floatingAnchorElem, setFloatingAnchorElem] =
    useState<HTMLDivElement | null>(null)

  const [isLinkEditMode, setIsLinkEditMode] = useState<boolean>(false)

  const onRef = (_floatingAnchorElem: HTMLDivElement) => {
    if (_floatingAnchorElem !== null) {
      setFloatingAnchorElem(_floatingAnchorElem)
    }

  }

  return (
    <div className="relative">
      {/* toolbar plugins */}
      <ToolbarPlugin>
        {({ blockType }) => (
          <div className="vertical-align-middle sticky top-0 z-10 border-b p-2">
        <div className="flex flex-row flex-wrap items-center gap-2 overflow-x-auto">
    {/* put all toolbar items INSIDE this row (see step 2) */}

            <HistoryToolbarPlugin />
            <BlockFormatDropDown>
              <FormatParagraph />
              <FormatHeading levels={["h1", "h2", "h3"]} />
              <FormatNumberedList />
              <FormatBulletedList />
              <FormatCheckList />
              <FormatQuote />
            </BlockFormatDropDown>
            <FontFamilyToolbarPlugin />
             <FontSizeToolbarPlugin />
             <FontFormatToolbarPlugin />
             <SubSuperToolbarPlugin />
             <LinkToolbarPlugin setIsLinkEditMode={setIsLinkEditMode} />
            <ClearFormattingToolbarPlugin />
             <ButtonGroup>
              {/* <FontColorToolbarPlugin />
              <FontBackgroundToolbarPlugin /> */}
             </ButtonGroup>
              <ElementFormatToolbarPlugin />
              <BlockInsertPlugin>
              {/* <InsertImage /> */}
              <InsertTable />
            </BlockInsertPlugin>
          </div>
          </div>
        )}
      </ToolbarPlugin>

      <div className="relative">
        <RichTextPlugin
          contentEditable={
            <div className="">
              <div className="" ref={onRef}>
                <ContentEditable
                  placeholder={placeholder}
                  className="ContentEditable__root relative block h-72 min-h-72 min-h-full overflow-auto px-8 py-4 focus:outline-none"
                />
              </div>
            </div>
          }
          ErrorBoundary={LexicalErrorBoundary}
        />
        <SlashCommandPlugin anchorElem={floatingAnchorElem} />
        {/* undo/redo buttons wont work if i enable commands need to fix */}
        <ListPlugin />
        <CheckListPlugin />
        <ClickableLinkPlugin />
        <AutoLinkPlugin />
        <LinkPlugin />
        <FloatingLinkEditorPlugin
              anchorElem={floatingAnchorElem}
              isLinkEditMode={isLinkEditMode}
              setIsLinkEditMode={setIsLinkEditMode}
         />
         {/* <ImagesPlugin /> */}
        <TablePlugin />
        <HistoryPlugin />
        {/* rest of the plugins */}
      </div>
      <ActionsPlugin>
        <div className="clear-both flex items-center justify-between gap-2 overflow-auto border-t p-1">
          <div className="flex flex-1 justify-start">
            {/* left side action buttons */}
          </div>
          <div>{/* center action buttons */}</div>
          <CounterCharacterPlugin charset="UTF-16" />
          <div className="flex flex-1 justify-end">
            {/* right side action buttons */}
            <>
              {/* <ImportExportPlugin /> */}
              <ExportPdfPlugin />
              <EditModeTogglePlugin />
              <ClearEditorActionPlugin />
              <ClearEditorPlugin />
            </>
          </div>
        </div>
      </ActionsPlugin>
      
    </div>
  )
}
