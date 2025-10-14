// src/components/ForumSidebar.tsx
import React, { useEffect, useState, useMemo } from "react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils"; // Your shadcn/ui utility file
import {
  Book,
  PanelLeft,
  ChevronsUpDown,
  AlertCircle,
  Search,
  PanelLeftClose,
  PanelRightClose,
} from "lucide-react";
import { getUser, getUserPurchases } from "@/services/UserService";
import { useNavigate } from "react-router-dom";
import { getUserOrderByUserId } from "@/services/OrdersService";
import { getNotesById } from "@/services/NotesService";
import { GetNotesRes } from "@/types/requests/notes";
import { Order } from "@/types/types";

interface ForumSidebarProps {
  selectedId?: string | null;
  token?: string; // Optional auth token
}

const ForumSidebar = ({ selectedId, token }: ForumSidebarProps) => {
  const [notes, setNotes] = useState<GetNotesRes[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSheetOpen, setSheetOpen] = useState(false);
  const [isDesktopSidebarOpen, setDesktopSidebarOpen] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotes = async () => {
      setLoading(true);
      setError(null);
      try {
        const user = await getUser();
        const orders = await getUserOrderByUserId(user.sub)
        const succeededOrders = orders.filter(order => order.status === 'succeeded');

        console.log("Fetched user owned notes:", orders);

        const notes: GetNotesRes[] = await Promise.all(
          succeededOrders.map((order) => {
            return getNotesById(order.note_id); 
          })
        );


        const sortedNotes = (notes || []).sort((a: any, b: any) => {
            if (a.course < b.course) return -1;
            if (a.course > b.course) return 1;
            return a.title.localeCompare(b.title);
        });

        setNotes(sortedNotes);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, [token]);

  const noteGroups = useMemo(() => {
    return notes.reduce((acc, note) => {
      const { module } = note;
      if (!module) return acc;
        if (!acc[module]) {
          acc[module] = [];
        }
      acc[module].push(note);
      return acc;
    }, {} as Record<string, GetNotesRes[]>);
  }, [notes]);

  const handleSelectNote = (note: GetNotesRes) => {
    setDesktopSidebarOpen(false);
    navigate(`/forum/${note.id}`);
    setSheetOpen(false); 
  };

  const sidebarContent = (
    <div className="flex h-full flex-col bg-muted/40">
      <div className="flex h-14 items-center border-b px-4 justify-between">
        <div className="flex items-center gap-2 font-semibold">
          <Book className="h-6 w-6" />
          <span>Purchased Notes</span>
        </div>
        {/* Desktop Close Button */}
        <Button
          variant="ghost"
          size="icon"
          className="hidden md:flex"
          onClick={() => setDesktopSidebarOpen(false)}
        >
          <PanelLeftClose className="h-5 w-5" />
          <span className="sr-only">Close sidebar</span>
        </Button>
      </div>
      <ScrollArea className="flex-1">
        <nav className="grid items-start gap-2 p-4 text-sm font-medium">
          {loading ? (
            <SidebarSkeleton />
          ) : error ? (
            <div className="flex flex-col items-center gap-2 p-4 text-destructive">
              <AlertCircle className="h-8 w-8" />
              <p className="text-center font-semibold">Error loading notes</p>
              <p className="text-center text-xs">{error}</p>
            </div>
          ) : Object.keys(noteGroups).length > 0 ? (
            Object.entries(noteGroups).map(([course, notesInGroup]) => (
              <Collapsible key={course} defaultOpen={true}>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" className="flex w-full justify-between pr-2">
                    <span className="font-bold">{course}</span>
                    <ChevronsUpDown className="h-4 w-4" />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="pl-4">
                  {notesInGroup.map((note) => (
                    <Button
                      key={note.id}
                      variant="ghost"
                      onClick={() => {
                        handleSelectNote(note);
                        // Close sheet on mobile after selection
                        setSheetOpen(false);
                      }}
                      className={cn(
                        "w-full justify-start h-auto py-2",
                        selectedId === note.id && "bg-muted font-bold"
                      )}
                    >
                      <span className="flex-1 text-left whitespace-normal break-words">
                        {note.originalName}
                      </span>
                    </Button>
                  ))}
                </CollapsibleContent>
              </Collapsible>
            ))
          ) : (
            <div className="p-4 text-center text-muted-foreground">
              <Search className="mx-auto h-8 w-8" />
              <p className="mt-2">No notes purchased yet.</p>
            </div>
          )}
        </nav>
      </ScrollArea>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      {isDesktopSidebarOpen && (
        <aside className="hidden h-full w-1/5 border-r md:block">
          {sidebarContent}
        </aside>
      )}
      {/* Mobile Sheet (Hamburger Menu) */}
       <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
        {/* Desktop Open Button */}
        {!isDesktopSidebarOpen && (
          <Button
            size="icon"
            variant="outline"
            className="hidden md:flex"
            onClick={() => setDesktopSidebarOpen(true)}
          >
            <PanelRightClose className="h-5 w-5" />
            <span className="sr-only">Open sidebar</span>
          </Button>
        )}

        {/* Mobile Sheet (Hamburger Menu) */}
        <Sheet open={isSheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger asChild>
            <Button size="icon" variant="outline" className="md:hidden">
              <PanelLeft className="h-5 w-5" />
              <span className="sr-only">Toggle Notes Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-full max-w-xs p-0">
            {sidebarContent}
          </SheetContent>
        </Sheet>
      </header>
    </>
  );
};

const SidebarSkeleton = () => (
  <div className="space-y-4 p-4">
    {Array.from({ length: 2 }).map((_, i) => (
        <div key={i} className="space-y-2">
            <Skeleton className="h-8 w-3/4" />
            <div className="pl-4 space-y-2">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-5/6" />
            </div>
        </div>
    ))}
  </div>
);

export default ForumSidebar;

