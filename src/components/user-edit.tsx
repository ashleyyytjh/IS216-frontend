  import { Input } from "./ui/input"
  import { Button } from "./ui/button"
  import { Label } from "@/components/ui/label"
  import BadgeClosableDemo from "./removable-badge"
  import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card"
  import { Plus, Pencil, Camera } from "lucide-react"
  import { useState, useEffect } from "react"
  import * as z from "zod"
  import { useForm } from "react-hook-form"
  import { toast } from "sonner"
  import {
    Form, FormControl, FormField, FormItem, FormLabel, FormMessage
  } from "@/components/ui/form"
  import { zodResolver } from "@hookform/resolvers/zod"
  import { updateUser } from "@/services/UserService"
  import { Avatar, AvatarImage } from "./ui/avatar"

  const formSchema = z.object({
    username: z.string().min(0, "Username must be filled."),
    email: z.string().email("Invalid email address"),
    major: z.string().min(0, "Major must be filed"),
    newCourse: z.array(z.string()).optional(),
  })

  function UserEdit(currentUser) {
    currentUser = currentUser["currentUser"]
    let curMods = currentUser["modules"]

    const [curModsState, setCurMods] = useState(() => curMods)
    const [userMod, setUserMod] = useState("")
    const [previewImage, setPreviewImage] = useState(currentUser["imageUrl"] || "")
    const [selectedFile, setSelectedFile] = useState<File | null>(null)

    const addNewMod = () => {
      if (userMod.trim() === "") return
      setCurMods((prev) => [...prev, userMod])
      setUserMod("")
    }

    const removeModule = (moduleName: string) => {
      setCurMods((prev) => prev.filter((m) => m !== moduleName))
    }

    const handleInputChange = (event) => setUserMod(event.target.value)

    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        username: currentUser["fullName"] || currentUser["username"] || "",
        email: currentUser["email"] || "",
        major: currentUser["major"] || "",
        newCourse: [],
      },
      mode: "onSubmit",
    })

    const {
      handleSubmit,
      formState: { isSubmitting, isSubmitSuccessful, errors },
    } = form

    const onSubmit = (values: z.infer<typeof formSchema>) => {
      values.newCourse = curModsState

      let newValues = {}
      newValues['fullName'] = values['username']
      newValues['major'] = values['major']
      newValues['modules'] = values['newCourse']

      // keep your existing updateUser
      updateUser(newValues)
        .then((response) => {
          toast.success("Successfully updated your account details!")
          console.log(response)
        })
        .catch((err) => {
          toast.error("Unable to do so now. Please try again.")
          console.error(err)
        })
    }

    const onInvalid = (errors: any) => {
      toast.error("Please fix the highlighted fields")
    }

    useEffect(() => {
      if (isSubmitSuccessful) {
        console.log('ok')
      }
    }, [isSubmitSuccessful])

    return (
      <Card className="hover:shadow-xl transition-all duration-300 pl-4 pr-4">
        <CardHeader>
          <CardTitle>Account</CardTitle>
          <CardDescription>
            Make changes to your account here. Click save when you&apos;re done.
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form className="space-y-8" onSubmit={handleSubmit(onSubmit, onInvalid)}>
            <div className="flex justify-center ml-auto mr-auto">
              <div className="relative w-24 h-24">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={previewImage} alt="User avatar" />
                </Avatar>

                <label
                  htmlFor="avatar-upload"
                  className="absolute bottom-1 right-1 flex items-center justify-center
                    w-8 h-8 rounded-full bg-black/70 text-white cursor-pointer
                    hover:bg-black transition"
                >
                  <Camera className="w-4 h-4" />
                </label>

                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      const file = e.target.files[0]
                      setSelectedFile(file)

                      // show preview immediately
                      const reader = new FileReader()
                      reader.onload = () => {
                        setPreviewImage(reader.result as string)
                      }
                      reader.readAsDataURL(file)
                    }
                  }}
                />
              </div>
            </div>

            <CardContent className="flex flex-col gap-y-6">
              <div className="flex flex-col md:flex-row gap-6 w-full">
                <div className="grid gap-2 w-full md:w-1/2">
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
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
                          <Input disabled {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Major */}
              <div className="grid gap-2 w-full">
                <FormField
                  control={form.control}
                  name="major"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Major</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Modules */}
              <div className="grid gap-2 w-full">
                <Label>Modules Taken</Label>
                <div className="p-4 border-2 border-dashed border-gray-200 rounded-lg bg-gray-50/50 min-h-[80px]">
                  {curModsState.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {curModsState.map((module) => (
                        <BadgeClosableDemo
                          key={module}
                          currentModCode={module}
                          onRemove={() => removeModule(module)}
                          className="bg-slate-900 text-white hover:bg-slate-800 px-3 py-1.5 text-sm font-medium"
                        />
                      ))}
                    </div>
                  ) : (
                    <span className="text-muted-foreground text-sm">
                      No modules added yet.
                    </span>
                  )}
                </div>

                <div className="flex gap-x-2 mt-4">
                  <Input
                    value={userMod}
                    onChange={handleInputChange}
                    placeholder="Add your modules here"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        addNewMod()
                      }
                    }}
                  />
                  <Button type="button" onClick={addNewMod}>
                    <Plus />
                  </Button>
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex justify-end">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Updating..." : "Update Profile"} <Pencil />
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    )
  }

  export default UserEdit