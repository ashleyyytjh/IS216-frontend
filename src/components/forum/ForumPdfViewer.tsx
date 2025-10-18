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
import samplePdf from '@/assets/LP-Model-Documentation.pdf';
import { downloadNotes } from "@/services/NotesService";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

export default function ForumPdfViewer({ id }: { id: string}) {
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
  const ref = useRef<HTMLDivElement>(null);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setPageNumber(1);
  }

  function onPageScaleChange(values: number[]) {
    setPageScale(values[0] / 100);
  }

  function resetPageScale() {
    setPageScale(1.0);
  }

  // useEffect(() => {
  //   const loadPdf = async () => {
  //     try {
  //       const response = await fetch(samplePdf);

  //       if (!response.ok) {
  //         throw new Error(`HTTP error! status: ${response.status}`);
  //       }

  //       const arrayBuffer = await response.arrayBuffer();
  //       const uint8Array = new Uint8Array(arrayBuffer);
  //       setFileData(uint8Array);

  //     } catch (e) {
  //       console.error('Error loading PDF:', e);
  //       toast.error("There was an error loading the file.", { 
  //         description: String(e), 
  //         dismissible: true, 
  //         richColors: true 
  //       });
  //     }
  //   };

  //   loadPdf();
  // }, []); 
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
      setWidth(ref.current.clientWidth);
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

  // Calculate the scale and height for the current page based on container width
  const { scale, height } = useMemo(() => {
    const currentPageDimensions = pageDimensions[pageNumber];
    
    if (!width || !currentPageDimensions) {
      return { scale: 1, height: null };
    }

    const scaleToFit = width / currentPageDimensions.width;
    const calculatedHeight = currentPageDimensions.height * scaleToFit;

    return { scale: scaleToFit * pageScale, height: calculatedHeight };
  }, [width, pageNumber, pageDimensions, pageScale]);

  return (
    <Card className="flex flex-col items-center justify-center w-full pt-0 gap-0">
      <div className="w-full flex items-center justify-between p-2">
        <div className="flex items-center w-fit">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPageNumber((prev) => Math.max(prev - 1, 1))}
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
            onClick={() =>
              setPageNumber((prev) => Math.min(prev + 1, numPages))
            }
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
            {/* <ZoomIn /> */}
          </div>
          {/* <Slider
            value={[pageScale*100]}
            min={50}
            max={200}
            step={25}
            onValueChange={onPageScaleChange}
            className="hidden md:flex"
          />
          <div
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "cursor-default select-none pointer-events-none"
            )}
          >
            {Math.round(pageScale * 100)}%
          </div> */}
          {/* <Button
            size="sm"
            variant="outline"
            className="cursor-pointer"
            onClick={resetPageScale}
          >
            <RotateCw className="h-full" />
            Reset
          </Button> */}
        </div>
      </div>

      <div
        ref={ref}
        className="relative w-full overflow-auto bg-muted border-y flex justify-center"
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
            <Page
              key={`page-${pageNumber}-${width}`}
              className="block"
              pageNumber={pageNumber}
            //   scale={scale}
              width={width}
              onLoadSuccess={({ originalWidth, originalHeight }: any) => {
                // Only store dimensions if we haven't already for this page
                if (originalWidth && originalHeight && !pageDimensions[pageNumber]) {
                  setPageDimensions(prev => ({
                    ...prev,
                    [pageNumber]: { width: originalWidth, height: originalHeight }
                  }));
                }
              }}
              renderAnnotationLayer={false}
              renderTextLayer={true}
              onMouseUp={() => {
                const sel = window.getSelection();
                if (sel && sel.toString().trim()) {
                  console.log('highlight detected', { 
                    pageNumber, 
                    text: sel.toString(), 
                    rects: sel.getRangeAt(0).getClientRects() 
                  });
                  sel.removeAllRanges();
                }
              }}
            />
          )}
        </Document>
      </div>
    </Card>
  );
}
