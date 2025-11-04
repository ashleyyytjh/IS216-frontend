import { downloadNotes, getComposeNoteById } from "@/services/NotesService";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createNoteHTML } from "@/utils/editor";
import { GetComposeNotesRes } from "@/types/requests/compose";
import Error from "./ErrorPage";
import { formatDateString } from "@/utils/dates";
import { courseGradient } from "@/utils/colors";
import { Badge } from "@/components/ui/badge";
import { formatPriceSGD } from "@/utils/currency";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getAvatarFallback } from "@/utils/util";
import { DollarSign, Download, Info } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import AestheticFooter from "@/components/Footer";

export default function UserArticle() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<GetComposeNotesRes>(
    {} as GetComposeNotesRes
  );
  const [html, setHtml] = useState<string>("");

  useEffect(() => {
    if (!id) return;
    const noteId = id;
    async function load() {
      const resp = await getComposeNoteById(noteId);
      if (!resp.data) {
        return <Error />;
      }
      if (resp.data.content) {
        const cleanedHtml = createNoteHTML(resp.data.content);
        console.log(resp.data)
        setData(resp.data);
        setHtml(cleanedHtml);
      }
    }
    load();
  }, [id]);

  if (!id) {
    return null
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
    <div>
      <section className="max-w-4xl mx-auto px-4 py-12 space-y-10">
        <div>
          <h1 className="text-4xl font-bold">{data.title}</h1>
          <h3 className="text-muted-foreground font-light my-2">{data.description}</h3>
        </div>

        {/* User Info */}
        <div className="flex gap-4 items-center mt-0">
          <Avatar className="overflow-hidden">
            <AvatarImage src={data.userImageUrl} className="object-cover" />
            <AvatarFallback>
              {getAvatarFallback(data.userFullName)}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 flex flex-col justify-center gap-1">
            <div className="flex">
              <p className="flex-1 font-medium">{data.userFullName}</p>
            </div>
            <p className="text-xs text-muted-foreground">
              Year {data.userYear} {data.userMajor}
            </p>
          </div>
        </div>

        {/* Notes Info */}
        <div className="text-sm grid grid-cols-3 gap-2 w-fit">
          <p className="col-span-1">Date:</p>
          <p className="text-muted-foreground col-span-2">
            {formatDateString(data.createdAt ?? "")}
          </p>
          <p className="col-span-1">Module:</p>
          <Badge
            className="font-normal rounded-full border-none bg-linear-to-r text-white uppercase col-span-2"
            style={{
              background: data?.module ? courseGradient(data.module) : "black",
            }}
          >
            {data?.module && data.module.trim() !== ""
              ? data.module
              : "General"}
          </Badge>
          <p className="col-span-1">Tags:</p>
          <div className="space-x-2 col-span-2">{data.tags?.map((tag) => (<Badge>{tag}</Badge>))}</div>
          <p className="col-span-1">Price:</p>
          <span className="font-mono flex items-center col-span-2">
            {formatPriceSGD(data.price ?? 0)}
          </span>

          {
            data?.authorised || data.price === 0 ? (
              <></>
            ) : (
              <div className="md:col-span-3 fixed bottom-0 left-1/2 -translate-x-1/2 md:translate-x-0 md:left-auto md:bottom-auto md:static flex md:flex-row md:ml-auto mr-auto flex-col gap-3 w-full px-5 py-10 md:p-0 items-center z-10 bg-muted md:bg-transparent">
                {data?.authorised || data?.price === 0 ? (
                  <Button className="flex-1 md:flex-initial w-full md:w-fit" onClick={handleDownload}>
                    <Download />
                    Download
                  </Button>
                ) : (
                  <Button onClick={() => navigate(`/payment?id=${id}`)} className="flex-1 md:flex-initial w-full md:w-fit">
                    <DollarSign />
                    Purchase
                  </Button>

                )}
                {/* {!data?.authorised ? (
              <span className="text-sm text-muted-foreground text-center">
                <Info className="h-4 w-4 inline align-sub" />
                This is a preview. Purchase the full notes to view all
                content.
              </span>
            ) : (
              <></>
            )} */}
              </div>
            )
          }

        </div>

        {/* The Content :) */}
        {
          data?.authorised || data.price === 0 ? (
            <article
              dangerouslySetInnerHTML={{ __html: html }} // we alr sanitise this in the createNoteHTML helper above.
            />
          ) : (
            <div className="relative">
              <div className="blur-md">
                <article dangerouslySetInnerHTML={{ __html: html }} />
              </div>

              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-foreground text-4xl font-semibold mt-10 mb-4">
                  Hidden Content
                </span>
                <span className="text-foreground text-sm font-normal">
                  Purchase to see more.
                </span>
              </div>
            </div>


          )
        }
      </section>
    </div>
  );
}
