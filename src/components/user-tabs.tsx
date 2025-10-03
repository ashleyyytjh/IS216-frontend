
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import UserEdit from "./user-edit"
import UserActivity from "./user-activity"
const UserTabs = (currentUser) => {
    currentUser = currentUser['current']['current']['current']
    return (
        <div className="flex w-full flex-col gap-6 mt-11">
            <Tabs defaultValue="personal" className="w-full">
                <TabsList className="flex flex-col h-auto md:flex-row w-[100%] mb-13">
                    <TabsTrigger value="personal" className="w-full font-semibold hover:shadow-lg data-[state=active]:!font-bold data-[state=active]:shadow-xl p-2 transition-all duration-300">Personal</TabsTrigger>
                    <TabsTrigger value="usernotes" className="w-full font-semibold hover:shadow-lg data-[state=active]:!font-bold data-[state=active]:shadow-xl p-2 transition-all duration-300">Purchased Notes</TabsTrigger>
                </TabsList>
                <TabsContent value="personal">
                   <UserEdit currentUser={currentUser}/>
                </TabsContent>

                <TabsContent value="usernotes">
                   <UserActivity currentUser={currentUser}/>
                </TabsContent>

            </Tabs>
        </div>
    )
}
export default UserTabs;
