import { getComposeNoteById } from "@/services/NotesService";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { createNoteHTML } from "@/utils/editor";
import { GetComposeNotesRes } from "@/types/requests/compose";
import Error from "./ErrorPage";
import { formatDateString } from "@/utils/dates";
import { courseGradient } from "@/utils/colors";
import { Separator } from "@/components/ui/separator";
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

  if (!id) return null;
  const noteId = id;

  useEffect(() => {
    async function load() {
      const resp = await getComposeNoteById(noteId);
      if (!resp.data) {
        return <Error />;
      }
      if (resp.data.content) {
        const cleanedHtml = createNoteHTML(resp.data.content);
        setData(resp.data);
        setHtml(cleanedHtml);
      }
    }
    load();
  }, [noteId]);

  return (
    <div>
      <section className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold">{data.title}</h1>
        <h3 className="italic text-muted-foreground font-light my-2">{data.description}</h3>

        {/* User Info */}
        <div className="flex gap-4 my-2 items-center my-2">
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
        <div className="text-sm grid grid-cols-2 gap-2 w-fit mt-3 mb-10">
          <p>Date:</p>
          <p className="text-muted-foreground">
            {formatDateString(data.createdAt ?? "")}
          </p>
          <p>Module:</p>
          <Badge
            className="font-normal rounded-full border-none bg-linear-to-r text-white uppercase"
            style={{
              background: data?.module ? courseGradient(data.module) : "black",
            }}
          >
            {data?.module && data.module.trim() !== ""
              ? data.module
              : "General"}
          </Badge>
          <p>Price:</p>
          <span className="font-mono flex items-center">
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
