import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Heart } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { courseGradient } from "@/utils/colors";
import { formatRelativeMonthYear } from "@/utils/dates";
import { Separator } from "@/components/ui/separator";
import { formatPriceSGD } from "@/utils/currency";
import { Link } from "react-router-dom";
import { SearchNotesItem } from "@/types/requests/notes";
import { getAvatarFallback } from "@/utils/util";

export default function ListingCard({ data }: { data: SearchNotesItem }) {
  return (
    <Link to={`/listings/${data.id}`} className="h-full hover:scale-101 transition  relative ">
      <Card className="h-full flex flex-col p-4 rounded-md paperfold-animate " style={{
                  background:
                    "repeating-linear-gradient(0deg, rgba(0,0,0,0.04), rgba(0,0,0,0.01) 1px, transparent 1px, transparent 20px), repeating-linear-gradient(90deg, rgba(0,0,0,0.0001), rgba(0,0,0,0.01) 1px, transparent 1px, transparent 20px) white",
                }}>
        <CardHeader className="flex items-stretch gap-4 p-0 md:flex-row sm:flex-row flex-col relative">
          <Avatar className="h-12 w-12 rounded-md overflow-hidden">
            <AvatarImage src={data.userImageUrl} className="object-cover" />
            <AvatarFallback className="rounded-md">{getAvatarFallback(data.userFullName)}</AvatarFallback>
          </Avatar>

          <div className="flex-1 flex flex-col justify-center gap-1 ">
            <div className="flex">
              <p className="flex-1 font-medium">{data.userFullName}</p>
              <p className="text-xs text-muted-foreground absolute top-0 right-0">
                {formatRelativeMonthYear(data.createdAt)}
              </p>
            </div>
            <p className="text-xs text-muted-foreground ">
              Year {data.userYear} {data.userMajor}
            </p>
          </div>
        </CardHeader>

        <CardContent className="flex-1 space-y-2 p-0 pb-3">
          <h3 className="font-semibold h-auto">{data.title}</h3>
          <p className="text-sm line-clamp-2">{data.description}</p>
          <div className="flex flex-wrap text-xs text-muted-foreground">
            {data.tags.map((tag, i) => (
              <div key={tag} className="flex items-center">
                <Badge
                  variant="secondary"
                  className="bg-transparent border-0 p-0 rounded-none font-normal text-muted-foreground hover:bg-transparent cursor-default"
                >
                  {tag}
                </Badge>
                {i < data.tags.length - 1 && (
                  <span className="mx-2 text-muted-foreground">•</span>
                )}
              </div>
            ))}
          </div>
        </CardContent>

        <CardFooter className="flex items-center justify-between p-0">
          <div className="flex h-6 gap-2">
            <Badge
              className="text-sm font-normal rounded-full border-none bg-linear-to-r text-white uppercase"
              style={{ background: data.module ? courseGradient(data.module): "black" }}
            >
              {data.module ?? "General"} 
            </Badge>
            <Separator orientation="vertical" color="blue" />
            <span className="font-mono flex items-center">
              {formatPriceSGD(data.price)}
            </span>
          </div>
          <Button className="h-8 w-8 px-2 py-2" variant="outline">
            <Heart className="text-muted-foreground" />
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
}
