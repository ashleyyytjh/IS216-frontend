import Infobar from "@/components/listing/Infobar";
import { InfobarTrigger } from "@/components/listing/InfobarTrigger";
import SuspenseFallback from "@/components/listing/SuspenseFallback";
import { Button } from "@/components/ui/button";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GraphData, NoteListing } from "@/types/types";
import { DollarSign, Info } from "lucide-react";
import { lazy, Suspense, useEffect } from "react";
import { useParams } from "react-router-dom";

const Graph = lazy(() => import("@/components/listing/Graph"))
const PDFViewer = lazy(() => import("@/components/listing/PDFViewer"));

export default function Listing() {
  const { id } = useParams<{ id: string }>();
  const data: NoteListing = mockData;

  return (
    <main className="text-sm h-full">
      <SidebarProvider
        style={{ "--sidebar-width": "24rem" } as React.CSSProperties}
      >
        <div className="flex h-full w-full">
          <Infobar data={data} />
          <article className="py-10 flex-1">
            <InfobarTrigger />
            <div className="px-20 w-full">
              <Tabs defaultValue="preview" className="mx-auto max-w-5xl gap-5">
                <div className="flex flex-row justify-between">
                  <Button>
                    <DollarSign />
                    Purchase
                  </Button>
                  <div className="flex gap-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Info className="h-4 w-4" />
                      <span>This is a preview. Purchase the full notes to view all content.</span>
                    </div>
                    <TabsList className="border font-medium border-none">
                      <TabsTrigger value="preview">Document</TabsTrigger>
                      <TabsTrigger value="mindmap">Mindmap</TabsTrigger>
                    </TabsList>
                  </div>
                </div>
                <TabsContent value="preview">
                  <Suspense fallback={<SuspenseFallback />}>
                    <PDFViewer />
                  </Suspense>
                </TabsContent>
                <TabsContent value="mindmap">
                  <Suspense fallback={<SuspenseFallback />}>
                    <Graph title={data.originalName} graph={mockGraph} />
                  </Suspense>
                </TabsContent>
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
  yearOfStudy: 4,
  major: "Computer Science",
  userId: "594a352c-2081-706e-b679-00b936e6b8f9",
  userFullName: "Ashley Toh",
  title: "Vector Semantics & Word Embeddings",
  userImageUrl:
    "https://plus.unsplash.com/premium_photo-1661913010540-2edd44a5ea43?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8bmF0dXJlJTIwd2F0ZXJ8ZW58MHx8MHx8fDA%3D",
  userMajor: "Computer Science",
  userYear: 4,
  description:
    "Covers vector semantics and word embeddings, from frequency-based models to Word2Vec/GloVe and their role in capturing word meaning",
  originalName: "Vector Semantics & Word Embeddings",
  tags: ["NLP", "Machine Learning", "cs425"],
  price: 5,
  type: "notes",
  module: "cs425",
  createdAt: "2025-09-04T13:10:03.602Z",
};

const mockGraph: GraphData = {
  nodes: [
    {
      id: "vector-semantics",
      title: "Vector semantics",
      description:
        "Study of meaning via vector spaces; similarity = distance between word vectors in embedding space.",
      type: "concept",
    },
    {
      id: "word-embeddings",
      title: "Word embeddings",
      description:
        "Dense vector representations of words learned from large corpora to capture semantic/syntactic relationships.",
      type: "concept",
    },
    {
      id: "cooccurrence-matrix",
      title: "Cooccurrence matrix",
      description:
        "Word-context co-occurrence counts within a fixed window; basis for distributional semantics (e.g., used by GloVe).",
      type: "concept",
    },
    {
      id: "cosine-similarity",
      title: "Cosine similarity",
      description:
        "Measure of similarity between two vectors defined as the cosine of the angle between them.",
      type: "concept",
    },
    {
      id: "word2vec",
      title: "Word2Vec",
      description:
        "Popular method for learning word embeddings via predictive models (Skip-Gram / CBOW); SGNS is widely used.",
      type: "concept",
    },
    {
      id: "glove",
      title: "GloVe",
      description:
        "Global Vectors; learns embeddings from global word-word co-occurrence statistics.",
      type: "concept",
    },
    {
      id: "skip-gram-neg-sampling",
      title: "Skip-Gram with Negative Sampling",
      description:
        "SGNS training objective using positive and negative samples to learn embeddings.",
      type: "concept",
    },
    {
      id: "context-window",
      title: "Context window",
      description:
        "Surrounding words used as context for a target word; defines co-occurrence structure.",
      type: "concept",
    },
    {
      id: "vocabulary",
      title: "Vocabulary",
      description:
        "Set of unique words in the corpus; size |V|; defines embedding matrix dimensions.",
      type: "concept",
    },
    {
      id: "embedding-dimension",
      title: "Embedding dimension",
      description:
        "Dimensionality d of word embeddings; trade-off between capacity and efficiency.",
      type: "concept",
    },
    {
      id: "training-objective",
      title: "Training objective",
      description:
        "Log-likelihood objective for positive context pairs and negative samples guiding embedding learning.",
      type: "concept",
    },
    {
      id: "gradient-descent",
      title: "Gradient descent",
      description:
        "Optimization algorithm that updates embeddings to minimize loss via gradient steps.",
      type: "concept",
    },
    {
      id: "positive-negative-samples",
      title: "Positive and negative samples",
      description:
        "Positive: real context words; Negative: random words used to contrast with positives.",
      type: "concept",
    },
    {
      id: "word-analogies",
      title: "Word analogies",
      description:
        "Embeddings enable vector arithmetic to capture relational meaning (e.g., king - man + woman ≈ queen).",
      type: "concept",
    },
  ],
  edges: [
    {
      source: "cooccurrence-matrix",
      target: "word-embeddings",
      relation: "produces",
    },
    {
      source: "word2vec",
      target: "skip-gram-neg-sampling",
      relation: "references",
    },
    {
      source: "glove",
      target: "skip-gram-neg-sampling",
      relation: "references",
    },
    {
      source: "skip-gram-neg-sampling",
      target: "context-window",
      relation: "requires",
    },
    {
      source: "skip-gram-neg-sampling",
      target: "vocabulary",
      relation: "requires",
    },
    {
      source: "word-embeddings",
      target: "embedding-dimension",
      relation: "requires",
    },
    {
      source: "word-embeddings",
      target: "gradient-descent",
      relation: "requires",
    },
    {
      source: "training-objective",
      target: "gradient-descent",
      relation: "requires",
    },
    {
      source: "skip-gram-neg-sampling",
      target: "positive-negative-samples",
      relation: "requires",
    },
    {
      source: "word-embeddings",
      target: "word-analogies",
      relation: "produces",
    },
    {
      source: "word-analogies",
      target: "word-embeddings",
      relation: "similar-to",
    },
  ],
};
