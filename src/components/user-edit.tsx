import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { Label } from "@/components/ui/label"
import BadgeClosableDemo from "./removable-badge"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { Plus, X } from "lucide-react"
import { useState } from "react"


function UserEdit(currentUser) {
    currentUser = currentUser['currentUser']
    let curMods = currentUser['modules']
    const [curModsState, setCurMods] = useState(curMods)
    console.log(curModsState)
    const passNewMod = () => {
        setCurMods([...curModsState, "CS222"])
    }
    const removeModule = (moduleName : String) =>{
        setCurMods(curModsState.filter((m)=>m!== moduleName))
    }
    return (
        <Card className="hover:shadow-xl transition-all duration-300 pl-4 pr-4">
            <CardHeader>
                <CardTitle>Account</CardTitle>
                <CardDescription>
                    Make changes to your account here. Click save when you&apos;re
                    done.
                </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-y-6">
                <div className="flex flex-col md:flex-row gap-6 w-full">
                    <div className="grid gap-2 w-full md:w-1/2">
                        <Label htmlFor="tabs-demo-username">Username</Label>
                        <Input
                            id="tabs-demo-username"
                            placeholder={currentUser.username}
                            className="placeholder:text-opacity-25 border border-[#f1f5f9] hover:border-gray-300 transition-all duration-300 w-full "
                        />
                    </div>

                    <div className="grid gap-2 w-full md:w-1/2">
                        <Label htmlFor="tabs-demo-email">Email</Label>
                        <Input
                            id="tabs-demo-email"
                            placeholder={currentUser.email}
                            className="placeholder:text-opacity-25 border border-[#f1f5f9] hover:border-gray-300 transition-all duration-300 w-full"
                        />
                    </div>
                </div>

                <div className="grid gap-2 w-full">
                    <Label htmlFor="tabs-demo-major">Major</Label>
                    <Input
                        id="tabs-demo-major"
                        placeholder={currentUser.major}
                        className="placeholder:text-opacity-25 border border-[#f1f5f9] hover:border-gray-300 transition-all duration-300 w-full md:w-[calc(100%)]"
                    />
                </div>

                <div className="grid gap-2 w-full">
                    <Label htmlFor="tabs-demo-username">Modules Taken</Label>

                    <div className="p-4 border-2 border-dashed border-gray-200 rounded-lg bg-gray-50/50 min-h-[80px] transition-colors hover:border-gray-300">
                        {curMods.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                                {curModsState.map((module) => (
                                    <BadgeClosableDemo
                                        key={module}
                                        variant="secondary"
                                        currentModCode={module}
                                        onRemove={()=>removeModule(module)}
                                        className="bg-slate-900 text-white hover:bg-slate-800 px-3 py-1.5 text-sm font-medium transition-colors"
                                    >

                                        <button
                                            // onClick={() => removeModule(module)}
                                            className="ml-2 hover:text-red-300 transition-colors"
                                            aria-label={`Remove ${module}`}
                                        >
                                            <X size={14} />
                                        </button>
                                    </BadgeClosableDemo>
                                ))}
                            </div>
                        ) : (
                            <div className="flex items-center justify-center h-12">
                                <span className="text-muted-foreground text-sm">
                                    No modules added yet. Add your first module below.
                                </span>
                            </div>
                        )}
                    </div>

                    <div className="flex justify-between gap-x-2 mt-4">
                        <Input
                            id="newCourse"
                            placeholder="Add your modules here"
                            className="placeholder:text-opacity-25 flex-grow border border-[#f1f5f9] hover:border-gray-300 transition-all duration-300 placeholder:text-grey-100"
                        />
                        <Button variant="secondary" size="icon" className="flex-shrink-0 w-auto px-4 py-2 hover:border-gray-300 transition-all duration-300"
                            onClick={() => passNewMod()}>
                            <Plus />
                        </Button>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="flex justify-content-end">
                <Button>Save changes</Button>
            </CardFooter>
        </Card>
    )
}

export default UserEdit;