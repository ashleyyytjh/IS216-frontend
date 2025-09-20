import Infobar from "@/components/listing/Infobar";
import { InfobarTrigger } from "@/components/listing/InfobarTrigger";
import PDFViewer from "@/components/listing/PDFViewer";
import { Button } from "@/components/ui/button";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NoteListing } from "@/types/types";
import { Download } from "lucide-react";
import { useParams } from "react-router-dom";

export default function Listing() {
  const { id } = useParams<{ id: string }>();
  const data: NoteListing = mockData;
  return (
    <main className="text-sm">
      <SidebarProvider
        style={{ "--sidebar-width": "20rem" } as React.CSSProperties}
      >
        <div className="flex h-full w-full">
          <Infobar data={data} />
          <article className="py-10 flex-1">
            <InfobarTrigger />
            <div className="px-20 w-full">
              <Tabs defaultValue="preview" className="mx-auto max-w-5xl gap-5">
                <div className="flex flex-row justify-between">
                  <Button>
                    <Download />
                    Download
                  </Button>
                  <TabsList className="border font-medium border-none">
                    <TabsTrigger value="preview">Preview</TabsTrigger>
                    <TabsTrigger value="mindmap">Mindmap</TabsTrigger>
                  </TabsList>
                </div>
                <TabsContent value="preview">
                    <PDFViewer />
                </TabsContent>
                <TabsContent value="mindmap">Mindmap</TabsContent>
              </Tabs>
            </div>
          </article>
        </div>
      </SidebarProvider>
    </main>
  );
}

const mockData = {
  id: "68b98faba389fd1819c78c17",
  userId: "594a352c-2081-706e-b679-00b936e6b8f9",
  userFullName: "Ashley Toh",
  userImageUrl:
    "https://plus.unsplash.com/premium_photo-1661913010540-2edd44a5ea43?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8bmF0dXJlJTIwd2F0ZXJ8ZW58MHx8MHx8fDA%3D",
  major: "Computer Science",
  yearOfStudy: 4,
  description:
    "Covers vector semantics and word embeddings, from frequency-based models to Word2Vec/GloVe and their role in capturing word meaning",
  originalName: "Vector Semantics & Word Embeddings",
  tags: ["NLP", "Machine Learning", "cs425"],
  price: 5,
  type: "notes",
  module: "cs425",
  createdAt: "2025-09-04T13:10:03.602Z",
};
