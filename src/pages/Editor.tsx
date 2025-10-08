'use client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import type { Editor, JSONContent } from '@/components/ui/shadcn-io/editor';
import {
    EditorBubbleMenu, EditorCharacterCount, EditorClearFormatting, EditorFloatingMenu,
    EditorFormatBold,
    EditorFormatCode,
    EditorFormatItalic,
    EditorFormatStrike,
    EditorFormatSubscript,
    EditorFormatSuperscript,
    EditorFormatUnderline,
    EditorLinkSelector,
    EditorNodeBulletList,
    EditorNodeCode,
    EditorNodeHeading1,
    EditorNodeHeading2,
    EditorNodeHeading3,
    EditorNodeOrderedList,
    EditorNodeQuote,
    EditorNodeTable,
    EditorNodeTaskList,
    EditorNodeText,
    EditorProvider,
    EditorSelector,
    EditorTableColumnAfter,
    EditorTableColumnBefore,
    EditorTableColumnDelete,
    EditorTableColumnMenu,
    EditorTableDelete,
    EditorTableFix,
    EditorTableGlobalMenu,
    EditorTableHeaderColumnToggle,
    EditorTableHeaderRowToggle,
    EditorTableMenu,
    EditorTableMergeCells,
    EditorTableRowAfter,
    EditorTableRowBefore,
    EditorTableRowDelete,
    EditorTableRowMenu,
    EditorTableSplitCell,
} from '@/components/ui/shadcn-io/editor';
import { useEffect, useState } from 'react';
import { saveNote as saveNoteToLocal, getNotes, type LocalNote } from '@/lib/localNotes';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';
import { usePDF } from "react-to-pdf";
import html2pdf from "html2pdf.js";

const Example = () => {
    const [notes, setNotes] = useState<LocalNote[]>([]);
    const [editorInstance, setEditorInstance] = useState<Editor | null>(null)
    const [currentNote, setCurrentNote] = useState<LocalNote | null>(null);
    const [content, setContent] = useState<JSONContent>({ type: 'doc', content: [] });
    const { toPDF, targetRef } = usePDF({
        filename: "MyNote.pdf",
        //method: "save", // or "blob" / "arraybuffer"
    });

    useEffect(() => {
        const allNotes = getNotes();
        setNotes(allNotes);
        setCurrentNote(null);
        setContent({ type: 'doc', content: [] });
    }, []);

    //handle the UI.
    const handleUpdate = ({ editor }: { editor: Editor }) => {
        const json = editor.getJSON();
        setContent(json);
    };

    //save note to localstorage
    const handleSaveNote = () => {
        if (!content) return;
        const allNotes = getNotes();
        const curDate = new Date().toISOString();
        const note: LocalNote = {
            id: currentNote?.id ?? uuidv4(),
            title: content?.content?.[0]?.content?.[0]?.text ?? 'Untitled Note',
            content,
            updatedAt: curDate,
        };
        const updatedNotes = getNotes();
        setNotes(updatedNotes);
        setCurrentNote(note);
        saveNoteToLocal(note);
        toast.success('Successfully saved into drafts!')
        //console.log(JSON.parse(localStorage.getItem('draft-notes')))
    };


    const handleDownloadNote = () => {
        if (!editorInstance) {
            toast.error("Editor not ready yet");
            return;
        }

        const html = editorInstance.getHTML();

        const documentHTML = `
    <html>
      <head>
        <title>${currentNote?.title ?? "My Note"}</title>
        <link href="https://cdn.jsdelivr.net/npm/tailwindcss@3.4.1/dist/tailwind.min.css" rel="stylesheet">
        <style>
          body {
            background: white;
            color: black;
            font-family: 'Inter', sans-serif;
            padding: 2rem;
          }

          /* Make sure the layout fits A4 nicely */
          @page {
            size: A4;
            margin: 1cm;
          }

          /* Clean Shadcn-style card look */
          .note-container {
            border: 1px solid #e5e7eb;
            border-radius: 0.75rem;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
            padding: 2rem;
            max-width: 800px;
            margin: auto;
          }

          h1, h2, h3, h4, h5, h6 {
            color: rgb(17, 24, 39);
            margin-top: 1rem;
            margin-bottom: 0.5rem;
          }

          p {
            margin-bottom: 0.5rem;
            line-height: 1.6;
          }

          table, th, td {
            border: 1px solid #e5e7eb;
            border-collapse: collapse;
            padding: 6px;
          }
        </style>
      </head>
      <body>
        <div class="note-container prose prose-neutral max-w-none">
          <h1 class="text-2xl font-bold mb-4">${currentNote?.title ?? "Untitled Note"}</h1>
          ${html}
        </div>
        <script>
          window.onload = function() {
            window.print();
          };
        </script>
      </body>
    </html>
  `;

        const printWindow = window.open("", "_blank");
        printWindow.document.write(documentHTML);
        printWindow.document.close();
    };


    return (
        <div className="mx-auto container w-[80%]">
            <h1 className="text-2xl font-semibold fade-in mt-10">Write your own notes here.</h1>
            <div className="relative right-0 flex justify-end mb-10 gap-[1rem]">
                <Button onClick={handleSaveNote}>Save Note</Button>
                <Button onClick={handleDownloadNote}>Upload Note</Button>
            </div>

            <div ref={targetRef}>
                <Card className="ml-auto mr-auto mt-10 mb-10">
                    <EditorProvider
                        className="w-full overflow-y-auto rounded-lg bg-background pl-8 pr-8 pt-1 h-[1100px] relative"
                        onCreate={({ editor }) => setEditorInstance(editor)}
                        content={content}
                        onUpdate={handleUpdate}
                        placeholder="Start typing..."
                    >
                        <EditorFloatingMenu>
                            <EditorNodeHeading1 hideName />
                            <EditorNodeBulletList hideName />
                            <EditorNodeQuote hideName />
                            <EditorNodeCode hideName />
                            <EditorNodeTable hideName />
                        </EditorFloatingMenu>

                        <EditorBubbleMenu>
                            <EditorSelector title="Text">
                                <EditorNodeText />
                                <EditorNodeHeading1 />
                                <EditorNodeHeading2 />
                                <EditorNodeHeading3 />
                                <EditorNodeBulletList />
                                <EditorNodeOrderedList />
                                <EditorNodeTaskList />
                                <EditorNodeQuote />
                                <EditorNodeCode />
                            </EditorSelector>
                            <EditorSelector title="Format">
                                <EditorFormatBold />
                                <EditorFormatItalic />
                                <EditorFormatUnderline />
                                <EditorFormatStrike />
                                <EditorFormatCode />
                                <EditorFormatSuperscript />
                                <EditorFormatSubscript />
                            </EditorSelector>
                            <EditorLinkSelector />
                            <EditorClearFormatting />
                        </EditorBubbleMenu>

                        <EditorTableMenu>
                            <EditorTableColumnMenu>
                                <EditorTableColumnBefore />
                                <EditorTableColumnAfter />
                                <EditorTableColumnDelete />
                            </EditorTableColumnMenu>
                            <EditorTableRowMenu>
                                <EditorTableRowBefore />
                                <EditorTableRowAfter />
                                <EditorTableRowDelete />
                            </EditorTableRowMenu>
                            <EditorTableGlobalMenu>
                                <EditorTableHeaderColumnToggle />
                                <EditorTableHeaderRowToggle />
                                <EditorTableDelete />
                                <EditorTableMergeCells />
                                <EditorTableSplitCell />
                                <EditorTableFix />
                            </EditorTableGlobalMenu>
                        </EditorTableMenu>

                        <EditorCharacterCount.Words>Words: </EditorCharacterCount.Words>
                    </EditorProvider>
                </Card>
            </div>

        </div>
    );
};

export default Example;
