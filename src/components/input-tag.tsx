import { useState } from "react";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { X } from "lucide-react";

export function InputTag({ value = [], onChange } : {value:string[], onChange:(tags:string[])=>void}) {
    //current user input.
    const [curInput, setCurInput] = useState("")

    const addTag = (e ) => {
        let newInput = curInput.trim();
        
        if (e.key === "Enter" && newInput !== "") {
            e.preventDefault()
            if (!value.includes(curInput.trim())) {
                onChange([...value, curInput.trim()])
            }
            setCurInput("")
        }
    }
    const removeTag = (tag) => {
        onChange(value.filter((t) =>  t !== tag ))
    }

    return (
        <div className="flex flex-wrap gap-2 p-2 border rounded-md bg-white transition">
            {value.map((tag) => (
                <Badge
                    key={tag}
                    className="flex items-center gap-1 bg-gray-100 text-gray-700"
                >
                    {tag}
                    <X className="h-3 w-3 cursor-pointer hover:text-red-500" onClick={() => removeTag(tag)} />
                </Badge>
            ))}
            <Input
                className="flex-1 border-none shadow-none focus-visible:ring-0 p-0 text-sm"
                placeholder="Add tag..."
                value={curInput}
                onChange={(e) => setCurInput(e.target.value)}
                onKeyDown={addTag}
            />
        </div>
    )
}