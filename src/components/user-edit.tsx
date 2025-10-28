import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { Label } from "@/components/ui/label"
import BadgeClosableDemo from "./removable-badge"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { Plus, Pencil, User } from "lucide-react"
import { useState, useEffect } from "react"
import * as z from "zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage
} from "@/components/ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { callPresigned, confirmUserImage, updateUser, updateUserImage } from "@/services/UserService"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { useNavigate } from "react-router-dom"

//Form to ensure validation.
const formSchema = z.object({
  username: z.string().min(1, "Username must be filled."),
  email: z.string().email("Invalid email address"),
  major: z.string().min(1, "Major must be filed"),
  newCourse: z.array(z.string()).optional(),
})

function UserEdit(currentUser) {
  currentUser = currentUser["currentUser"]
  let curMods = currentUser["modules"]

  const [curModsState, setCurMods] = useState(() => curMods)
  const [userMod, setUserMod] = useState("")
  const [previewImage, setPreviewImage] = useState(currentUser["imageUrl"] || "")

const addNewMod = () => {
  console.log(curModsState)
  const trimmed = userMod.trim().toLowerCase(); 
  if (trimmed === "") return;

  if (curModsState.includes(trimmed)) {
    toast.error("Module already added!");
    return;
  }
  setCurMods((prev) => [...prev, trimmed]);
  setUserMod("");
};

  const removeModule = (moduleName: string) => {
    console.log('hi')
    setCurMods((prev) => prev.filter((m) => m !== moduleName))
  }

  const handleInputChange = (event) => { setUserMod(event.target.value) }

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


  const onInvalid = (errors: any) => {
    toast.error("Please fix the highlighted fields")
  }

  useEffect(() => {
    if (isSubmitSuccessful) {
      console.log('ok')
    }
  }, [isSubmitSuccessful])


  const [selectedFile, setSelectedFile] = useState<any>()
  const fileChanging = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file.");
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    console.log(previewUrl)
    setPreviewImage(previewUrl);
    setSelectedFile(file);
  };
  const nav = useNavigate();
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    values.newCourse = curModsState

    let newValues = {}
    newValues['fullName'] = values['username']
    newValues['major'] = values['major']
    newValues['modules'] = values['newCourse']

    updateUser(newValues)
      .then((response) => {
        if (!selectedFile) {
          toast.success("Successfully updated your account details!")
        } else {
          updateUserImage(selectedFile.type).then(async (url) => {
            let presigned = url.uploadUrl;
            callPresigned(String(presigned), selectedFile).then((r) => {
              let uploadRes = r;
              if (!uploadRes) { toast.error('Unable to upload your image.') }
              confirmUserImage().then((response) => {
                toast.success('Successfully updated your account details!')
                setTimeout(() => window.location.reload(), 500);
              }).catch((err) => {
                toast.error('Something went wrong somewhere.')
              })
            })


          })
        }
      })
      .catch((err) => {
        toast.error("Unable to do so now. Please try again and fill in the values properly.")
        console.error(err)
      })
  }


  return (
    <Card className="hover:shadow-xl transition-all duration-300 pl-4 pr-4">
      <CardHeader>
        <CardTitle>Account</CardTitle>
        <CardDescription>
          Make changes to your account here. Click save when you&apos;re done.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form className="space-y-8" onSubmit={handleSubmit(onSubmit, onInvalid)}   onKeyDown={(e) => {
    if (e.key === "Enter") e.preventDefault();
  }}>
          <div className="flex justify-center ml-auto mr-auto">
            <div className="relative w-28 h-28">
              <Avatar className="w-28 h-28 border-2 border-gray-200">
                {previewImage ? (
                  <AvatarImage src={previewImage} />
                ) : (
                  <AvatarFallback>
                    <User className="w-10 h-10 text-gray-500" />
                  </AvatarFallback>
                )}
              </Avatar>

              <input
                type="file"
                accept="image/*"
                id="avatarUpload"
                className="hidden"
                onChange={fileChanging}
              />

              <Button
                type="button"
                size="icon"
                variant="secondary"
                onClick={() => document.getElementById("avatarUpload")?.click()}
                className="absolute bottom-0 right-0 rounded-full w-8 h-8 shadow-md hover:shadow-lg border bg-white text-gray-800"
              >
                <Pencil className="w-4 h-4" />
              </Button>
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
                      <FormMessage className="transition-all duration-200 min-h-[1.25rem]" />
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
                      <FormMessage className="transition-all duration-200 min-h-[1.25rem]" />
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
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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
                  formNoValidate
                  placeholder="Add your modules here"

                />
                <Button type="button" onClick={addNewMod}
                >
                  <Plus />
                </Button>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex justify-end">
            <Button type="submit" className="!text-sm">
              Update Profile
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  )
}

export default UserEdit