import { downloadNotes } from '@/services/NotesService';
import React, { useState, useRef, useEffect } from 'react';
import {
  PdfLoader,
  PdfHighlighter,
  Tip,
  Highlight,
  IHighlight,
} from 'react-pdf-highlighter';
import 'react-pdf-highlighter/dist/style.css';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';

export default function PdfAnnotator() {
  const [highlights, setHighlights] = useState<IHighlight[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
const { noteId } = useParams<{ noteId: string }>();
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  // Fetch PDF from your database
  useEffect(() => {
    (async () => {
      try {
        if (!noteId) return;
        const data = await downloadNotes(noteId);
        const res = await fetch(data.url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const blob = await res.blob();
        // Create a blob URL
        const blobUrl = URL.createObjectURL(blob);
        // console.log({ blobUrl });
        setPdfUrl(blobUrl);
      } catch (err) {
        toast.error("There was an error loading the file.", { 
          description: String(err), 
          dismissible: true, 
          richColors: true 
        });
      }
    })();

    // Cleanup: revoke the blob URL when component unmounts
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [noteId]);

  const addHighlight = ({ position, content, comment }) => {
    const id = Date.now().toString();
    console.log({ position, content, comment });
    setHighlights([{ id, position, content, comment }, ...highlights]);
  };

  if (!pdfUrl) {
    return <div>Loading PDF...</div>;
  }
  return (
    <div className='h-200 w-200'>
      <PdfLoader url={pdfUrl} beforeLoad={<div>Loading PDF…</div>}>
        {(pdfDocument) => (
          <div
            ref={scrollRef}
            style={{ height: '50%', overflowY: 'auto' }}
          >
            <PdfHighlighter
              pdfDocument={pdfDocument}
              highlights={highlights}
              scrollRef={() => scrollRef.current}
              onScrollChange={() => {}}
              enableAreaSelection={(event) => event.altKey}

              onSelectionFinished={(
                position,
                content,
                hideTipAndSelection,
                transformSelection
              ) => (
                <div>
                    TEST
                </div>
                // <Tip
                //   onOpen={() => {
                //     console.log('position, content', { position, content });
                //   }}
                //   onConfirm={(comment) => {
                //     addHighlight({ position, content, comment });
                //     hideTipAndSelection();
                //   }}
                // />
              )}

              highlightTransform={(
                highlight,
                index,
                setTip,
                hideTip,
                viewportToScaled,
                screenshot,
                isScrolledTo
              ) => (
                <Highlight
                  key={highlight.id}
                  position={highlight.position}
                  comment={highlight.comment}
                  isScrolledTo={isScrolledTo}
                />
              )}
            />
          </div>
        )}
      </PdfLoader>
    </div>
  );
}
