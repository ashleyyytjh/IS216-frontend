import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { Label } from "@/components/ui/label"
import BadgeClosableDemo from "./removable-badge"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { Plus } from "lucide-react"
import { useState } from "react"
import * as z from "zod"
import { useForm } from "react-hook-form"
import { Pencil } from 'lucide-react';
import { toast } from "sonner";


import {
    Form, FormControl, FormField, FormItem, FormLabel, FormMessage
} from "@/components/ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { formSchema } from "./update-form/update-form"

//Need to hook the updating function here.
function UserEdit(currentUser) {
    currentUser = currentUser['currentUser']
    let curMods = currentUser['modules']
    const [curModsState, setCurMods] = useState(() => curMods)
    const [userMod, setUserMod] = useState("")
    const addNewMod = () => {
        setCurMods(prev => [...prev, userMod])
        setUserMod("")
    }
    const removeModule = (moduleName: String) => {
        setCurMods(prev => prev.filter((m) => m !== moduleName))
        setUserMod("")
    }
    const handleInputChange = (event) => { setUserMod(event.target.value) }
    const onSubmit = (values: z.infer<typeof formSchema>) => { 

        values.newCourse = curModsState;
        //update code here. if ok,
        toast.success('Successfully updated your account details!')
        toast.error('Something went wrong, please try again later.')
        console.log(values)

    }
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: currentUser['username'],
            email: currentUser['email'],
            major: currentUser['major']
        },
    })
    return (

        <Card className="hover:shadow-xl transition-all duration-300 pl-4 pr-4">
            <CardHeader>
                <CardTitle>Account</CardTitle>
                <CardDescription>
                    Make changes to your account here. Click save when you&apos;re
                    done.
                </CardDescription>
            </CardHeader>
            <Form {...form}>
                <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
                    <CardContent className="flex flex-col gap-y-6">
                        <div className="flex flex-col md:flex-row gap-6 w-full">
                            <div className="grid gap-2 w-full md:w-1/2">
                                <FormField
                                    control={form.control}
                                    name="username"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Username</FormLabel>
                                            <FormControl>
                                                <Input {...field} className="placeholder:text-opacity-25 border border-[#f1f5f9] hover:border-gray-300 transition-all duration-300 w-full" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="grid gap-2 w-full md:w-1/2">
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input disabled placeholder={currentUser['email']} {...field} className="placeholder:text-opacity-25 border border-[#f1f5f9] hover:border-gray-300 transition-all duration-300 w-full" />
                                            </FormControl>

                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        <div className="grid gap-2 w-full">
                            <FormField
                                control={form.control}
                                name="major"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Major</FormLabel>
                                        <FormControl>
                                            <Input placeholder={currentUser['major']} {...field} className="placeholder:text-opacity-25 border border-[#f1f5f9] hover:border-gray-300 transition-all duration-300 w-full" />
                                        </FormControl>

                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid gap-2 w-full">
                            <Label htmlFor="tabs-demo-username">Modules Taken</Label>
                            <div className="p-4 border-2 border-dashed border-gray-200 rounded-lg bg-gray-50/50 min-h-[80px] transition-colors hover:border-gray-300">
                                {curModsState.length > 0 ? (
                                    <div className="flex flex-wrap gap-2">
                                        {curModsState.map((module) => (
                                            <BadgeClosableDemo
                                                key={module}
                                                variant="secondary"
                                                currentModCode={module}
                                                onRemove={() => removeModule(module)}
                                                className="bg-slate-900 text-white hover:bg-slate-800 px-3 py-1.5 text-sm font-medium transition-colors"
                                            >
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

                            <div className="flex justify-between gap-x-2 mt-4 w-[100%]">
                                <FormField
                                    control={form.control}
                                    name="newCourse"
                                    render={({ field }) => (
                                        <FormItem className="w-full">
                                            <FormLabel>Add your modules taken</FormLabel>
                                            <FormControl>
                                                <div className="flex flex-row gap-x-2">
                                                    <Input
                                                        {...field} id="newCourse"
                                                        value={userMod}
                                                        placeholder="Add your modules here"
                                                        className="placeholder:text-opacity-25 w-[95%] flex-grow border border-[#f1f5f9] hover:border-gray-300 transition-all duration-300 placeholder:text-grey-100"
                                                        onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault() } }}
                                                        onChange={handleInputChange} />
                                                    <div>
                                                        <Button variant="secondary" type="button" size="icon" className="flex-shrink-0 w-auto px-4 py-2 hover:border-gray-300 transition-all duration-300"
                                                            onClick={() => addNewMod()}>
                                                            <Plus />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-center w-full md:justify-end">
                        <Button type="submit" className="w-[100%] md:w-auto">Update Profile  <Pencil /></Button>
                    </CardFooter>

                </form>
            </Form>
        </Card>
    )
}
export default UserEdit;

