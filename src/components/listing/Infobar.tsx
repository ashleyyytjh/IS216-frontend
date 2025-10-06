import { formatDateString } from "@/utils/dates";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarHeader, SidebarSeparator, useSidebar } from "../ui/sidebar";
import { courseGradient } from "@/utils/colors";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { formatPriceSGD } from "@/utils/currency";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { GetNotesRes } from "@/types/requests/notes";

export default function Infobar({ data } : { data: GetNotesRes | undefined }) {
  return (
    <Sidebar
      variant="sidebar"
      collapsible="offcanvas"
    >
      <SidebarContent className="p-5 overflow-clip pt-20">
        <SidebarHeader className="text-lg font-medium">
          {data?.title}
        </SidebarHeader>
        <SidebarGroup>
          <SidebarGroupContent>
            <p className="text-muted-foreground pb-2">
              {formatDateString(data?.createdAt ?? "")}
            </p>
            <div className="flex h-6 gap-2">
              <Badge
                className="text-sm font-normal rounded-full border-none bg-linear-to-r text-white uppercase"
                style={{ background: data?.module ? courseGradient(data?.module): "black" }}
              >
                {data?.module ?? "General"}
              </Badge>
              <Separator orientation="vertical" color="blue" />
              <span className="font-mono flex items-center">
                {formatPriceSGD(data?.price ?? 0)}
              </span>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarSeparator />
        <SidebarGroup>
          <p className="text-muted-foreground text-sm">Uploaded by</p>
          <SidebarGroupContent className="flex gap-4 my-2">
            <Avatar className="h-12 w-12 rounded-md overflow-hidden">
              <AvatarImage src={data?.userImageUrl} className="object-cover" />
              <AvatarFallback>??</AvatarFallback>
            </Avatar>

            <div className="flex-1 flex flex-col justify-center gap-1">
              <div className="flex">
                <p className="flex-1 font-medium">{data?.userFullName}</p>
              </div>
              <p className="text-xs text-muted-foreground">
                Year {data?.userYear} {data?.userMajor}
              </p>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
