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
import { Link, useLocation } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import React from 'react';
import { useNavigate } from "react-router-dom";
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Download, PrinterIcon, Save, Trash, Upload } from 'lucide-react';
import { Separator } from 'radix-ui';

const Example = () => {
  const [notes, setNotes] = useState<LocalNote[]>([]);
  const [editorInstance, setEditorInstance] = useState<Editor | null>(null)
  const [currentNote, setCurrentNote] = useState<LocalNote | null>(null);
  const [content, setContent] = useState<JSONContent>({ type: 'doc', content: [] });
  const location = useLocation();
  const { id } = useParams();
  const isCurrentEdit = location.pathname.includes('editNote')
  const isCurrentWrite = location.pathname.includes('writeNotes')
  const navigate = useNavigate();
  //processing to get the current note.
  useEffect(() => {
    const allNotes = getNotes();
    setNotes(allNotes);
    if (isCurrentEdit && id) {
      const noteToEdit = allNotes.find((note) => note.id === id);
      if (noteToEdit) {
        setCurrentNote(noteToEdit);
        setContent(noteToEdit.content);
      } else {
        toast.error("Note not found in drafts!");
        setCurrentNote(null);
        setContent({ type: "doc", content: [] });
      }
    } else if (isCurrentWrite) {
      setCurrentNote(null);
      setContent({ type: "doc", content: [] });
    }
  }, [id, isCurrentEdit, isCurrentWrite]);

  useEffect(() => {
    if (editorInstance && currentNote) {
      editorInstance.commands.setContent(currentNote.content);
    } else if (editorInstance && !currentNote && isCurrentWrite) {
      editorInstance.commands.clearContent();
    }
  }, [editorInstance, currentNote, isCurrentWrite]);

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
    navigate(`/editNote/${note.id}`);
  };

  //Here is to allow the user to download the note locally into their own browsers.
  const handleDownloadNote = () => {
    if (!editorInstance) {
      toast.error("Editor not ready yet");
      return;
    }
    const html = editorInstance.getHTML();
    const printWindow = window.open('', '', 'height=800,width=600');
    //code here allows us to use some form of tailwind variables and some overwrites to ensure that we will get the styling we want.
    printWindow?.document.write(`
    <html>
      <head>
        <title></title>
        <link href="https://cdn.jsdelivr.net/npm/tailwindcss@3.4.1/dist/tailwind.min.css" rel="stylesheet">
        <style>
          body {
            background: white;
            color: black;
            font-family: 'Inter', sans-serif;
            padding: 2rem;
          }
          @page { margin: 1cm; size: A4; }
          .note-container { max-width: 800px; margin: auto; }

                  @media print {
  * {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }

  table {
    border-collapse: collapse;
    width: 100%;
    margin-top: 1rem;
  }

  th, td {
    border: 1px solid #e5e7eb;       /* border-gray-200 */
    padding: 0.5rem 0.75rem;
    text-align: left;
  }

  th {
    background-color: #f9fafb !important; /* bg-gray-50 */
    color: #374151;                       /* text-gray-700 */
    font-weight: 600;
  }

  tr:nth-child(even) {
    background-color: #f3f4f6 !important; /* alternate row color */
  }
}

@media print {
  pre {
    background-color: #f9fafb !important; /* light gray bg */
    border: 1px solid #e5e7eb;
    border-radius: 0.5rem;
    padding: 1rem;
    overflow-x: auto;
    font-family: 'JetBrains Mono', 'Courier New', monospace;
    color: #111827;
  }

  code {
    font-family: 'JetBrains Mono', 'Courier New', monospace;
    font-size: 0.875rem;
  }

  /* optional inline code (not blocks) */
  :not(pre) > code {
    background-color: #f3f4f6 !important;
    color: #b91c1c !important; /* red-700 for keywords */
    padding: 0.1rem 0.25rem;
    border-radius: 0.25rem;
  }

  /* ensure colors print */
  * {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }
}
        </style>


      </head>
      <body>
            <div class="note-container prose prose-neutral max-w-none">
      ${html}
    </div>
      </body>
    </html>
  `);
    printWindow?.document.close();
    printWindow?.focus();
    if (printWindow !== null) {
      printWindow.onload = () => {
        printWindow?.print();
      };
    }

  };


  //This portion is the handling of uploading of notes.
  const handleUploadNote = async () => {
    if (editorInstance !== null) {
      const html = editorInstance?.getHTML();
      const title = currentNote?.title ?? "Untitled Note";
      console.log(html)
    }
  };

  const handleDeleteNote = async () => {
    const allNotes = getNotes();

    if (currentNote !== null) {
      const updatedNotes = allNotes.filter((note) => note.id !== currentNote.id);
      localStorage.setItem("draft-notes", JSON.stringify(updatedNotes));
      setNotes(updatedNotes);
      setCurrentNote(null);
      setContent({ type: "doc", content: [] });
      toast.success(`"${currentNote.title}" deleted successfully. Navigating to Seller Dashboard.`);
      navigate("/DashboardSeller");
    } else {
      toast.error('No current note to be deleted.')
    }

  }


  return (
    <div className="mx-auto container w-[80%]">

      <div className="flex justify-between items-center gap-3 mb-10 border rounded-lg px-8 py-4 shadow-sm bg-white align-middle mt-10">
        <div className="flex-1 min-w-0" title={currentNote?.title}>
          <h1 className="text-lg font-semibold leading-tight truncate">
            {isCurrentEdit
              ? currentNote?.title || "Untitled Note"
              : "New Note"}
          </h1>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                className="p-2 rounded-md hover:bg-gray-100"
                onClick={handleDeleteNote}
              >
                <Trash className="h-4 w-4 text-red-500" />
              </button>
            </TooltipTrigger>
            <TooltipContent>Delete Note</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <button
                className="p-2 rounded-md hover:bg-gray-100"
                onClick={handleSaveNote}
              >
                <Save className="h-4 w-4 text-gray-700" />
              </button>
            </TooltipTrigger>
            <TooltipContent>Save Draft</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <button
                className="p-2 rounded-md hover:bg-gray-100"
                onClick={handleDownloadNote}
              >
                <Download className="h-4 w-4 text-gray-700" />
              </button>
            </TooltipTrigger>
            <TooltipContent>Download PDF</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <button
                className="p-2 rounded-md hover:bg-green-100"
                onClick={handleUploadNote}
              >
                <Upload className="h-4 w-4 text-green-600" />
              </button>
            </TooltipTrigger>
            <TooltipContent>Publish</TooltipContent>
          </Tooltip>
        </div>
      </div>


      <Card className="ml-auto mr-auto mt-10 mb-10">
        <div>
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
        </div>
      </Card>


    </div>
  );
};

export default Example;
