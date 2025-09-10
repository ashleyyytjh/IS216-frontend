import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import DashboardBuyer from "./dashboard-buyer"
import ChartsBuyer from "./charts-buyer";

function DashboardUser() {
    return (
        <>
            <div className="flex flex-row mt-4 pl-8 pr-8 w-full">
                <Tabs defaultValue="buyer" className="w-full">
                    <TabsList className="w-full flex flex-row md:w-[50%] ml-auto mr-auto pt-6 pb-6">
                        <TabsTrigger value="buyer" className="pt-6 pb-6">Buyer Dashboard</TabsTrigger>
                        <TabsTrigger value="seller" className="pt-6 pb-6">Seller Dashboard</TabsTrigger>
                    </TabsList>
                    <TabsContent value="buyer" className="w-full row">
                        <DashboardBuyer value = "buyer" />
                    </TabsContent>


                    <TabsContent value="seller" className="w-full row">
                        <DashboardBuyer value="seller" />
                    </TabsContent>
                </Tabs>
            </div>
        </>

    )
}
export default DashboardUser;