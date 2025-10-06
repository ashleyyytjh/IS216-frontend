
import * as z from "zod"

export const formSchema = z.object({
    username: z.string().min(0, "Username is required"),
    email: z.string().email("Invalid Email Address"),
    major: z.string().min(0, "Major is required"),
    newCourse: z.string().optional()
})