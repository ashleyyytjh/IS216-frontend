import React, { useEffect, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
// CSS imports for selectable text etc (optional)
import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Slider } from "../ui/slider";
import { Badge } from "../ui/badge";
import { ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

export default function PDFViewer() {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pageScale, setPageScale] = useState(1.0);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setPageNumber(1);
  }

  function onPageScaleChange(values: number[]) {
    setPageScale(values[0] / 100);
  }

  return (
    <Card className="flex flex-col items-center justify-center w-full gap-0 pt-0">
      <div className="w-full flex items-center justify-between my-2 px-5">
        <div className="flex items-center w-fit">
          <Button
            size="sm"
            onClick={() => setPageNumber((prev) => Math.max(prev - 1, 1))}
            disabled={pageNumber <= 1}
          >
            <ChevronLeft />
          </Button>
          <span style={{ margin: "0 10px" }}>
            {pageNumber} of {numPages}
          </span>
          <Button
            size="sm"
            onClick={() =>
              setPageNumber((prev) => Math.min(prev + 1, numPages))
            }
            disabled={pageNumber >= numPages}
          >
            <ChevronRight />
          </Button>
        </div>
        <div className="flex justify-center items-center w-2/5 gap-5">
          <ZoomIn />
          <Slider
            defaultValue={[100]}
            min={50}
            max={200}
            step={10}
            onValueChange={onPageScaleChange}
          />
          <Badge>{Math.round(pageScale * 100)}%</Badge>
        </div>
      </div>
      <Document
        className="h-[800px] w-full flex justify-center bg-muted border-y overflow-scroll"
        file="/nlc.pdf"
        onLoadSuccess={onDocumentLoadSuccess}
        scale={100}
      >
        <Page className="w-fit h-fit" scale={pageScale} pageNumber={pageNumber} />
      </Document>
    </Card>
  );
}
