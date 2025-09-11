import { AppWindowIcon, CodeIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import  BadgeClosableDemo  from "./removable-badge"
const UserTabs = (currentUser) => {
    currentUser = currentUser['current']['current']['current']
    let curMods = currentUser['modules']
    console.log(currentUser)
    return (
        <div className="flex w-full flex-col gap-6 mt-5">
            <Tabs defaultValue="personal" className="w-full">
                <TabsList className="flex flex-col h-auto md:flex-row w-[100%] mb-4">
                    <TabsTrigger value="personal" className="w-[100%] data-[state=active]:shadow-xl hover:shadow-lg">Personal</TabsTrigger>
                    <TabsTrigger value="purchases" className="w-[100%] data-[state=active]:shadow-xl hover:shadow-lg">Purchases</TabsTrigger>
                    <TabsTrigger value="activity" className="w-[100%] data-[state=active]:shadow-xl hover:shadow-lg">Activity</TabsTrigger>
                    <TabsTrigger value="knowledgegraph" className="w-[100%] data-[state=active]:shadow-xl hover:shadow-lg">Knowledge Graph</TabsTrigger>
                </TabsList>
                <TabsContent value="personal">
                    <Card className="hover:shadow-xl transition-all duration-300">
                        <CardHeader>
                            <CardTitle>Account</CardTitle>
                            <CardDescription>
                                Make changes to your account here. Click save when you&apos;re
                                done.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col md:flex-row">
                            <div className="grid grid-cols-1 md:w-[50%] ">
                                <div className="grid gap-3">
                                    <Label htmlFor="tabs-demo-name">Username</Label>
                                    <Input id="tabs-demo-name" placeholder={currentUser.username} className="border border-[#f1f5f9] hover:border-gray-300 transition-all duration-500" />
                                    <div className="grid gap-3">
                                        <Label htmlFor="tabs-demo-username">Major</Label>
                                        <Input id="tabs-demo-username" placeholder={currentUser.major} className="border border-[#f1f5f9] hover:border-gray-300 transition-all duration-500" />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 w-[100%] gap-y-5 md:w-[50%] ">
                                <div className="grid gap-3">
                                    <Label htmlFor="tabs-demo-name">Email</Label>
                                    <Input id="tabs-demo-name" placeholder={currentUser.email} className="border border-[#f1f5f9] hover:border-gray-300 transition-all duration-500" />

                                    <div className="grid gap-3">
                                        <Label htmlFor="tabs-demo-username">Modules Taken</Label>
                                        <div className="flex flex-row gap-x-2">
                                            {
                                        
                                            curMods.map((mods)=>{
                                                return <BadgeClosableDemo currentModCode={mods}/>
                                            })
                                        }
                                        </div>
                                        
                                    </div>
                                </div>
                            </div>

                        </CardContent>
                        <CardFooter className="flex justify-content-end">
                            <Button>Save changes</Button>
                        </CardFooter>
                    </Card>
                </TabsContent>


            </Tabs>
        </div>
    )
}
export default UserTabs;
