"use client"

import type React from "react"

import { useState } from "react"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { X, Plus } from "lucide-react"
import { toast } from "sonner"
import { User } from "@/types/types"
import { createUser } from "@/services/UserService"
import { mockCourses } from "@/assets/data"

const UserSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  fullName:  z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Please enter a valid email address"),
  yearOfStudy: z.number().min(1).max(6),
  major: z.string().min(1, "Please select a major"),
  modules: z.array(z.string()).min(1, "Please add at least one module"),
})


type UserFormData = z.infer<typeof UserSchema>


const commonModules = [
  "Data Structures & Algorithms",
  "Database Systems",
  "Web Development",
  "Machine Learning",
  "Software Engineering",
  "Computer Networks",
  "Operating Systems",
  "Calculus I",
  "Calculus II",
  "Linear Algebra",
  "Statistics",
  "Microeconomics",
  "Macroeconomics",
  "Financial Accounting",
  "Marketing Principles",
  "Organic Chemistry",
  "Physics I",
  "Physics II",
  "Research Methods",
]
interface UserCreationFormProps {
  user: User; 
  changeSuccessfulState?: () => Promise<void>; 
}
export function UserCreationForm( {user, changeSuccessfulState } : UserCreationFormProps) {
  const [formData, setFormData] = useState<UserFormData>({
    username: user!.username,
    fullName: "",
    email: user!.email || "",
    yearOfStudy: 1,
    major: "",
    modules: [],
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [newModule, setNewModule] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const handleInputChange = (field: keyof UserFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const addModule = (module: string) => {
    if (module && !formData.modules?.includes(module)) {
      handleInputChange("modules", [...(formData.modules || []), module])
    }
    setNewModule("")
  }

  const removeModule = (moduleToRemove: string) => {
    handleInputChange("modules", formData.modules?.filter((m) => m !== moduleToRemove) || [])
  }

  const validateForm = (): boolean => {
    try {
      UserSchema.parse(formData)
      setErrors({})
      return true
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {}
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0] as string] = err.message
          }
        })
        setErrors(newErrors)
      }
      return false
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      toast.error("Error", {
        description: "Please fix the errors in the form",
      })
      return
    }

    setIsSubmitting(true)

    try {
      console.log("User created:", formData)
      toast.success("Success!", {
        description: "User account created successfully",
      })  
      await createUser(formData);

      console.log(formData)
      await changeSuccessfulState!()

    } catch (error) {
      toast.error("Error", {
        description: "There was an error creating the user account",
      })
      console.error("Error creating user:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (

    <Card className="w-full">
      <CardHeader>
        <CardTitle>User Information</CardTitle>
        <CardDescription>Enter the user details below. All fields are required.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Username */}
          <div className="space-y-2 ">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              className="opacity-50"
              placeholder="Enter username"
              value={formData.username || ""}
              readOnly={true}
            />
            {errors.username && <p className="text-sm text-destructive">{errors.username}</p>}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              className="opacity-50"
              readOnly={true}
              type="email"
              placeholder="Enter email address"
              value={formData.email || ""}
            />
            {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="fullName">Email</Label>
            <Input
              id="fullname"
              className="opacity-50"
              readOnly={true}
              type="text"
              placeholder="Enter email address"
              value={formData.fullName || ""}
            />
            {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
          </div>

          {/* Year of Study */}
          <div className="space-y-2">
            <Label htmlFor="yearOfStudy">Year of Study</Label>
            <Select
              value={formData.yearOfStudy?.toString() || "1"}
              onValueChange={(value) => handleInputChange("yearOfStudy", Number.parseInt(value))}
            >
              <SelectTrigger className={errors.yearOfStudy ? "border-destructive" : ""}>
                <SelectValue placeholder="Select year of study" />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5, 6].map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    Year {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.yearOfStudy && <p className="text-sm text-destructive">{errors.yearOfStudy}</p>}
          </div>

          {/* Major */}
          <div className="space-y-2">
            <Label htmlFor="major">Major</Label>
            <Select value={formData.major || ""} onValueChange={(value) => handleInputChange("major", value)}>
              <SelectTrigger className={errors.major ? "border-destructive" : ""}>
                <SelectValue placeholder="Select major" />
              </SelectTrigger>
              <SelectContent>
                {mockCourses.map((major) => (
                  <SelectItem key={major.id} value={major.name}>
                    {major.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.major && <p className="text-sm text-destructive">{errors.major}</p>}
          </div>

          {/* Modules */}
          <div className="space-y-2">
            <Label>Modules</Label>

            {/* Add module input */}
            <div className="flex gap-2">
              <Input
                placeholder="Type module name or select from dropdown"
                value={newModule}
                onChange={(e) => setNewModule(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    addModule(newModule)
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => addModule(newModule)}
                disabled={!newModule}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {/* Common modules dropdown */}
            {/* <Select onValueChange={addModule}>
              <SelectTrigger>
                <SelectValue placeholder="Or select from common modules" />
              </SelectTrigger>
              <SelectContent>
                {commonModules
                  .filter((module) => !formData.modules?.includes(module))
                  .map((module) => (
                    <SelectItem key={module} value={module}>
                      {module}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select> */}

            {/* Selected modules */}
            {formData.modules && formData.modules.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.modules.map((module) => (
                  <Badge key={module} variant="secondary" className=" flex items-center gap-1">
                    {module}
                    <Button

                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-auto p-0 hover:bg-transparent font-black"
                      onClick={() => removeModule(module)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            )}

            {errors.modules && <p className="text-sm text-destructive">{errors.modules}</p>}
          </div>

          {/* Submit Button */}
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Creating User..." : "Create User"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
