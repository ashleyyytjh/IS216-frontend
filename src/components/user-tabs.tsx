
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
        <div className="flex w-full flex-col gap-6 mt-5">
            <Tabs defaultValue="personal" className="w-full">
                <TabsList className="flex flex-col h-auto md:flex-row w-[100%] mb-4">
                    <TabsTrigger value="personal" className="w-full font-medium hover:shadow-lg data-[state=active]:!font-bold data-[state=active]:shadow-xl">Personal</TabsTrigger>
                    <TabsTrigger value="usernotes" className="w-full font-medium hover:shadow-lg data-[state=active]:!font-bold data-[state=active]:shadow-xl">Activity</TabsTrigger>
                    <TabsTrigger value="knowledgegraph" className="w-full font-medium hover:shadow-lg data-[state=active]:!font-bold data-[state=active]:shadow-xl">Knowledge Graph</TabsTrigger>
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
