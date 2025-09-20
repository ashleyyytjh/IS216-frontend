import { formatDateString } from "@/utils/dates";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarHeader, SidebarSeparator } from "../ui/sidebar";
import { courseGradient } from "@/utils/colors";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { formatPriceSGD } from "@/utils/currency";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { NoteListing } from "@/types/types";

export default function Infobar({ data } : { data: NoteListing }) {
  return (
    <Sidebar
      variant="floating"
      collapsible="offcanvas"
      className="top-20 h-[calc(100vh-5rem)]"
    >
      <SidebarContent className="p-5">
        <SidebarHeader className="font-medium">
          {data.originalName}
        </SidebarHeader>
        <SidebarGroup>
          <SidebarGroupContent>
            <p className="text-muted-foreground pb-2">
              {formatDateString(data.createdAt)}
            </p>
            <div className="flex h-6 gap-2">
              <Badge
                className="text-sm font-normal rounded-full border-none bg-linear-to-r text-white uppercase"
                style={{ background: courseGradient(data.module) }}
              >
                {data.module}
              </Badge>
              <Separator orientation="vertical" color="blue" />
              <span className="font-mono flex items-center">
                {formatPriceSGD(data.price)}
              </span>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarSeparator />
        <SidebarGroup>
          <p className="text-muted-foreground text-sm">Uploaded by</p>
          <SidebarGroupContent className="flex gap-4 my-2">
            <Avatar className="h-12 w-12 rounded-md overflow-hidden">
              <AvatarImage src={data.userImageUrl} className="object-cover" />
              <AvatarFallback>??</AvatarFallback>
            </Avatar>

            <div className="flex-1 flex flex-col justify-center gap-1">
              <div className="flex">
                <p className="flex-1 font-medium">{data.userFullName}</p>
              </div>
              <p className="text-xs text-muted-foreground">
                Year {data.yearOfStudy} {data.major}
              </p>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
