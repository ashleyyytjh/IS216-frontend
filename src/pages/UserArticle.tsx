import { getComposeNoteById } from "@/services/NotesService";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { createNoteHTML } from "@/utils/editor";
import { GetComposeNotesRes } from "@/types/requests/compose";
import Error from "./ErrorPage";
import { formatDateString } from "@/utils/dates";
import { courseGradient } from "@/utils/colors";
import { Badge } from "@/components/ui/badge";
import { formatPriceSGD } from "@/utils/currency";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getAvatarFallback } from "@/utils/util";

export default function UserArticle() {
  const { id } = useParams<{ id: string }>();
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
        </div>

        {/* The Content :) */}
        <article
          dangerouslySetInnerHTML={{ __html: html }} // we alr sanitise this in the createNoteHTML helper above.
        />
      </section>
    </div>
  );
}
