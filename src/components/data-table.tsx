import { z } from "zod"
import { Label } from "@/components/ui/label"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { useEffect, useState } from "react"
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
            originalName: item.title,
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
      //         resp.push({
      //   id: 109,
      //   buyer_id: "594a352c-2081-706e-b679-00b936e6b8f9",
      //   note_id: "68f4c9c51a5692f5bcbead5b", 
      //   price: 100,
      //   status: "succeeded",
      //   stripe_transaction_id: "pi_test_12345"
      // });
        let userOrder = resp.filter(
          (item: any) =>
            Object.keys(ownedID).includes(item.note_id) &&
            item.status === "succeeded"
        );
        resp.push()
        console.log(userOrder)
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
      className="w-full flex-col justify-start gap-6"
    >
      <div className="flex items-center justify-between">
        <Label htmlFor="view-selector" className="sr-only">
          View
        </Label>
        <TabsList className="flex flex-row md:flex-row text-sm">
          <TabsTrigger
            value="outline"
            className="w-full font-semibold px-3 transition-all duration-300"
          >
            Transactions
          </TabsTrigger>

          <TabsTrigger
            value="past-performance"
            className="w-full font-semibold px-3 transition-all duration-300"
          >
            Uploaded
          </TabsTrigger>

          <TabsTrigger
            value="unpublished"
            className="w-full font-semibold px-3 transition-all duration-300"
          >
            Written
          </TabsTrigger>
        </TabsList>
      </div>

      <TabsContent
        value="past-performance"
        className="flex flex-col transition-opacity duration-200"
      >
        <UserOwnNote currentUserInfo={props.currentUser as any} />
      </TabsContent>
      <TabsContent
        value="outline"
        className="relative flex flex-col gap-4 overflow-auto transition-opacity duration-200"
      >
        <OrderReceived orders={orders}
          formatCurrency={formatCurrency} />
      </TabsContent>
      <TabsContent value="unpublished"
        className="flex flex-col transition-opacity duration-200 relative z-[20] overflow-visible">
        <UnpublishedNotes />
      </TabsContent>

    </Tabs>
  )
}
