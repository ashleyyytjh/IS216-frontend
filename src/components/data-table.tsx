import { z } from "zod"
import { useNavigate } from "react-router-dom"
import { Label } from "@/components/ui/label"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { useEffect, useMemo, useState } from "react"
import { UserOwnNote } from "./own-user-note-display"
import { getOwnedComposeNotes, getUserOwned } from "@/services/NotesService"
import { getOrders } from "@/services/OrdersService"
import { UnpublishedNotes } from "./unpublished-notes"
import { OrderReceived } from "./order-received"

export const schema = z.object({
  id: z.number(),
  header: z.string(),
  type: z.string(),
  status: z.string(),
  target: z.string(),
  limit: z.string(),
  reviewer: z.string(),
})



const formatCurrency = (n: number) =>
  n.toLocaleString("en-SG", { style: "currency", currency: "SGD" });

type CurrentUserProp = {
  currentUser: { userFullName?: string }
}
type OwnedMap = Record<
  string,
  { module: string; noteType: string; originalName: string; description: string }
>

export function DataTable(props: CurrentUserProp) {
  const navigate = useNavigate()

  const [ownedID, setOwnedID] = useState<OwnedMap>({})
  const [orders, setAllOrders] = useState<any[]>([])
  const [view, setView] = useState<"past-performance" | "outline" | "disputes">("past-performance")


useEffect(() => {
  async function fetchOwnedNotes() {
    try {
      const [normalRaw, composedRaw] = await Promise.all([
        getUserOwned(),
        getOwnedComposeNotes(),
      ]);

      const normalNotes = Array.isArray(normalRaw)
        ? normalRaw
        : normalRaw?.data ?? [];
      const composedNotes = Array.isArray(composedRaw)
        ? composedRaw
        : composedRaw?.data ?? [];

      const allOwned = [
        ...normalNotes.map((n) => ({ ...n, noteType: "normal" })),
        ...composedNotes.map((n) => ({ ...n, noteType: "composed" })),
      ];

      const idToData: OwnedMap = {};
      allOwned.forEach((item: any) => {
        idToData[item.id] = {
          module: item.module,
          noteType: item.noteType,       
          originalName: item.originalName,
          description: item.description,
        };
      });

      setOwnedID(idToData);
    } catch (err) {
    }
  }

  fetchOwnedNotes();
}, [props]);

useEffect(() => {
  getOrders()
    .then((resp: any[] = []) => {
      let userOrder = resp.filter(
        (item: any) =>
          Object.keys(ownedID).includes(item.note_id) &&
          item.status === "succeeded"
      );
      userOrder = userOrder.map((i: any) => ({
        ...i,
        userFullName: props.currentUser?.userFullName ?? "Unknown User",
        module: ownedID[i.note_id]?.module,
        noteType: ownedID[i.note_id]?.noteType, 
        originalName: ownedID[i.note_id]?.originalName,
        description: ownedID[i.note_id]?.description,
      }));

      setAllOrders([...userOrder]);
    })
    .catch((e) => {
      console.error("Error fetching orders:", e);
    });
}, [props, ownedID]);

console.log(orders)

  return (
    <Tabs
      value={view}
      onValueChange={(v) => setView(v as typeof view)}
      className="w-full flex-col justify-start gap-6 mb-10"
    >
      <div className="flex items-center justify-between px-4 lg:px-6">
        <Label htmlFor="view-selector" className="sr-only">
          View
        </Label>
        <TabsList className="flex flex-col h-auto md:flex-row w-[100%] mb-5 mt-10">
          <TabsTrigger
            value="past-performance"
            className="w-full font-semibold hover:shadow-lg data-[state=active]:!font-bold data-[state=active]:shadow-xl p-2 transition-all duration-300"
          >
            Your Listed Notes
          </TabsTrigger>

          <TabsTrigger
            value="outline"
            className="w-full font-semibold hover:shadow-lg data-[state=active]:!font-bold data-[state=active]:shadow-xl p-2 transition-all duration-300"
          >
            Orders You Received
          </TabsTrigger>

          <TabsTrigger
            value="unpublished"
            className="w-full font-semibold hover:shadow-lg data-[state=active]:!font-bold data-[state=active]:shadow-xl p-2 transition-all duration-300"
          >
            Written Notes
          </TabsTrigger>
        </TabsList>
      </div>

      <TabsContent
        value="past-performance"
        className="flex flex-col px-4 lg:px-6 transition-opacity duration-200"
      >
        <UserOwnNote currentUserInfo={props.currentUser as any} />
      </TabsContent>
      <TabsContent
        value="outline"
        className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6 transition-opacity duration-200"
      >
        <OrderReceived orders={orders}
          formatCurrency={formatCurrency} />
      </TabsContent>
      <TabsContent value="unpublished"
        className="flex flex-col px-4 lg:px-6 transition-opacity duration-200 relative z-[20] overflow-visible">
        <UnpublishedNotes />
      </TabsContent>

    </Tabs>
  )
}
