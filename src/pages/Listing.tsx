import AestheticFooter from "@/components/Footer";
import Infobar from "@/components/listing/Infobar";
import { InfobarTrigger } from "@/components/listing/InfobarTrigger";
import SuspenseFallback from "@/components/listing/SuspenseFallback";
import SpinItem from "@/components/spinner";
import { Button } from "@/components/ui/button";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { downloadNotes, getNotesById } from "@/services/NotesService";
import { GetNotesRes } from "@/types/requests/notes";
import { DollarSign, Download, Info } from "lucide-react";
import { lazy, Suspense, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Error from "./ErrorPage";
import { toast } from "sonner";

const Graph = lazy(() => import("@/components/listing/Graph"));
const PDFViewer = lazy(() => import("@/components/listing/PDFViewer"));

export default function Listing() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<GetNotesRes>();
  const [exist, setExist] = useState<boolean>(true)

  useEffect(() => {
    async function load() {
      if (!id) return;
      const data = await getNotesById(id);
      if (!data) {
        setExist(false)
        return
      }
      console.log(data)
      setData(data);
    }
    load();
  }, []);
  if (!exist) {
    return <Error />
  }

  async function handleDownload() {
  if (!id) {
    return
  }
  try {
    const data = await downloadNotes(id);
    const res = await fetch(data.url);
    if (!res.ok) {
      toast.error("Error finding the file.", {
      description: "Unable to get note source url",
      dismissible: true,
      richColors: true,
    })
    }

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = data.originalName || `${id}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (err) {
    toast.error("Error downloading file.", {
      description: String(err),
      dismissible: true,
      richColors: true,
    });
  }
}

  return (
    data ? (
          <main className="text-sm h-full">
      <SidebarProvider
        breakpoint={1100}
        style={{ "--sidebar-width": "24rem" } as React.CSSProperties}
      >
        <div className="flex h-full w-full relative">
          <Infobar data={data} />
          <article className="py-10 flex-1 w-full h-full overflow-y-scroll my-3">
            <InfobarTrigger />
            <div className="2xl:px-20 w-full mb-5 md:px-2">
              <Tabs
                defaultValue="preview"
                className="mx-auto w-full max-w-5xl gap-5"
              >
                <div className="grid grid-cols-1 md:grid-cols-4">
                  {/* Movable Section */}
                  <div className="md:col-span-3 fixed bottom-0 md:static flex md:flex-row flex-col gap-3 w-full px-5 py-10 md:p-0 items-center bg-muted md:bg-transparent z-10">
                    {data?.purchased || data?.price === 0 ? (
                      <Button className="flex-1 md:flex-initial w-full md:w-fit" onClick={handleDownload}>
                        <Download />
                        Download
                      </Button>
                    ) : (
                      <Button  onClick={() => navigate(`/payment?id=${id}`)} className="flex-1 md:flex-initial w-full md:w-fit">
                        <DollarSign />
                        Purchase
                      </Button>
                    )}
                    {!data?.purchased ? (
                      <span className="text-sm text-muted-foreground text-center">
                        <Info className="h-4 w-4 inline align-sub" />
                        This is a preview. Purchase the full notes to view all
                        content.
                      </span>
                    ) : (
                      <></>
                    )}
                  </div>

                  <div className="flex gap-2 md:col-span-1 ml-auto w-full px-2 md:px-0">
                    <TabsList className="border font-medium border-none w-full">
                      <TabsTrigger value="preview">Document</TabsTrigger>
                      <TabsTrigger value="mindmap">Mindmap</TabsTrigger>
                    </TabsList>
                  </div>
                </div>
                <TabsContent value="preview" className="px-2 md:px-0">
                  <Suspense fallback={<SuspenseFallback />}>
                    <PDFViewer
                      id={id ?? ""}
                      purchased={data?.purchased ?? false}
                    />
                  </Suspense>
                </TabsContent>
                <TabsContent value="mindmap">
                  <Suspense fallback={<SuspenseFallback />}>
                    <Graph title={data?.title ?? ""} graph={data?.graph} />
                  </Suspense>
                </TabsContent>
              </Tabs>
            </div>
            <AestheticFooter />
          </article>
        </div>
      </SidebarProvider>
    </main>
    ) : (
      <div className="flex justify-center items-center w-full h-64"> <SpinItem/></div>
    )

  );
}

