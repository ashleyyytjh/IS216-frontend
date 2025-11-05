import { useEffect, useMemo, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { Button, buttonVariants } from "../ui/button";
import { Card } from "../ui/card";
import { Slider } from "../ui/slider";
import { ChevronLeft, ChevronRight, RotateCw, ZoomIn } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { LineShadowText } from "../ui/shadcn-io/line-shadow-text";
import 'react-pdf/dist/Page/TextLayer.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import samplePdf from '@/assets/LP-Model-Documentation.pdf';
import { downloadNotes } from "@/services/NotesService";
import { Annotation } from "@/types/types";
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

export default function ForumPdfViewer({ 
  id, 
  pageHandler, 
  handleTextSelection,
  userHighlights,
  annotations,
  selectedAnnotationId,
  onPageOffsetChange, 
  onScaleChange
}: { 
  id: string, 
  pageHandler: (page: number) => void, 
  handleTextSelection?: (scale: number) => void, 
  userHighlights?: Record<number, any[]>,
  annotations: Annotation[],
  selectedAnnotationId: string,
  onPageOffsetChange?: (offset: { left: number, top: number }) => void,
  onScaleChange?: (scale: number) => void  
  }
  ) {
  const [fileData, setFileData] = useState<Uint8Array | null>(null);
  const file = useMemo(
    () => (fileData ? { data: fileData } : undefined),
    [fileData]
  );

  const [width, setWidth] = useState(0);
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(0);
  const [pageScale, setPageScale] = useState(1.0);
  const [pageDimensions, setPageDimensions] = useState<Record<number, { width: number; height: number }>>({});
  const [pageTextBoxes, setPageTextBoxes] = useState<Record<number, any[]>>({});
  const ref = useRef<HTMLDivElement>(null);
  const pageRect = ref.current?.getBoundingClientRect();
  const offsetLeft = pageRect?.left || 0;
  const offsetTop = pageRect?.top || 0;

  useEffect(() => {
    if (pageRect && onPageOffsetChange) {
      onPageOffsetChange({ left: offsetLeft, top: offsetTop });
    }
  }, [offsetLeft, offsetTop, onPageOffsetChange]);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setPageNumber(1);
  }


    useEffect(() => {
      (async () => {
        try {
          const data = await downloadNotes(id);
          const res = await fetch(data.url);
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          const blob = await res.blob();
          const arrayBuffer = await blob.arrayBuffer();
          setFileData(new Uint8Array(arrayBuffer));
        } catch (err) {
          toast.error("There was an error loading the file.", { description: String(err), dismissible: true, richColors: true })
        }
      })();
    }, []);


  // Update width when container resizes
  useEffect(() => {
      const updateWidth = () => {
        if (!ref.current) return;
        const newWidth = ref.current.clientWidth;
        setWidth(newWidth);
      };
      updateWidth();

      const observer = new ResizeObserver(updateWidth);
      if (ref.current) observer.observe(ref.current);
      window.addEventListener("resize", updateWidth);

      return () => {
        observer.disconnect();
        window.removeEventListener("resize", updateWidth);
      };
    }, []);

  const { scale, height } = useMemo(() => {
      const currentPageDimensions = pageDimensions[pageNumber];
      
      if (!width || !currentPageDimensions) {
        return { scale: 1, height: null };
      }

      const scaleToFit = width / currentPageDimensions.width;
      const calculatedHeight = currentPageDimensions.height * scaleToFit;
      const finalScale = scaleToFit * pageScale;
      

      return { scale: finalScale, height: calculatedHeight };
    }, [width, pageNumber, pageDimensions, pageScale]);



  useEffect(() => {
    if (onScaleChange) {
      onScaleChange(scale);
    } 
  }, [scale, onScaleChange]);


  
  return (
    <Card className="flex flex-col items-center justify-center w-full outline pt-0 gap-0">
      <div className="w-full flex items-center justify-between p-2">
        <div className="flex items-center w-fit">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              pageHandler(Math.max(pageNumber - 1, 1));
              setPageNumber((prev) => Math.max(prev - 1, 1))
            }}
            disabled={pageNumber <= 1}
          >
            <ChevronLeft />
          </Button>
          <span className="mx-2">
            {pageNumber}/{numPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              pageHandler(Math.min(pageNumber + 1, numPages));
              setPageNumber((prev) => Math.min(prev + 1, numPages));
            }}
          >
            <ChevronRight />
          </Button>
        </div>
        <div className="flex justify-end items-center w-2/5 gap-2 leading-none">
          <div
            className={cn(
              buttonVariants({ variant: "ghost", size: "sm" }),
              "pointer-events-none cursor-default select-none hidden md:flex"
            )}
          >
          </div>
        </div>
      </div>

      <div
        ref={ref}
        className="relative w-full overflow-auto bg-muted border-y"
        style={{
          height: height ? `${height}px` : "auto",
        }}
      >
        <Document
          file={file}
          onLoadSuccess={onDocumentLoadSuccess}
          loading={<div className="p-10 text-muted-foreground">Loading...</div>}
          noData={<LineShadowText className="text-3xl font-bold my-auto italic w-56 items-center">Nothing to See</LineShadowText>}
          className="m-0 overflow-clip flex items-center justify-center min-h-80 w-full"
        >
          {width > 0 && (
          <div className="relative"  onMouseUp={() => handleTextSelection?.(scale)}
>
            <Page
              pageNumber={pageNumber}
              width={width}
              onLoadSuccess={async (page: any) => {
                const textContent = await page.getTextContent();
                const viewport = page.getViewport({ scale: 1.0 });

                const highlights = textContent.items.map((item: any) => {
                  const tx = pdfjs.Util.transform(
                    pdfjs.Util.transform(viewport.transform, item.transform),
                    [1, 0, 0, -1, 0, 0] 
                  );
                setPageDimensions(prev => ({
                  ...prev,
                  [pageNumber]: {
                    width: viewport.width,
                    height: viewport.height
                  }
                }));

                  const x = tx[4];
                  const y = viewport.height - tx[5] - Math.abs(item.transform[3]);
                  const fontSize = Math.abs(item.transform[3]);
                  const width = item.width;
                  const height = fontSize;

                  return { text: item.str, x, y, width, height };
                });

                setPageTextBoxes(prev => ({
                  ...prev,
                  [pageNumber]: highlights,
                }));
              }}
            />
            
            {userHighlights && userHighlights[pageNumber]?.map((highlight, i) =>
                highlight.rects.map((r, j) => (
                    <div
                    key={`${i}-${j}`}
                    className="absolute bg-yellow-300 px-0.5 py-0.5 rounded animate-pulse"
                       style={{
                        left: `${r.x * scale}px`,
                        top: `${r.y * scale}px`,
                        width: `${r.width * scale}px`,
                        height: `${r.height * scale}px`,
                      }}
                    />
                ))
              )}

           {annotations
            .filter(a => a.page === pageNumber && a.id === selectedAnnotationId) 
            .map((annotation) =>
              annotation.rects.map((r, j) => ( 
                <div
                  key={`${annotation.id}-${j}`}
                  className="absolute bg-yellow-300 opacity-40 px-0.5 py-0.5 rounded animate-pulse"
                  style={{
                    left: `${r.x * scale}px`,
                    top: `${r.y * scale}px`,
                    width: `${r.width * scale}px`,
                    height: `${r.height * scale}px`,
                  }}
                />
              ))
            )}
          </div>
        )}
        </Document>
      </div>
    </Card>
  );
}
