import {
  Tags,
  TagsContent,
  TagsEmpty,
  TagsInput,
  TagsList,
  TagsTrigger,
  TagsValue,
} from "@/components/ui/shadcn-io/tags"
import { PlusIcon } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"

type TagsCreatorProps = {
    tags: string[]
    setTags: (value: string[]) => void
}

/**
 * Our custom tags creator which uses components from shadcn.io.
 * Accepts a string[] and func for updating that input
 */
export default function TagsCreator({ tags, setTags }: TagsCreatorProps) {
  const [selected, setSelected] = useState<string[]>(tags)
  const [newTag, setNewTag] = useState<string>("")

  const handleRemove = (value: string) => {
    if (!selected.includes(value)) return
    setTags(tags.filter((v) => v != value))
    console.log(tags)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleCreateTag()
    }
  }

  useEffect(() => {
    setSelected(tags)
  }, [tags])

  const handleCreateTag = () => {
    if (tags.length >= 5) {
      toast.warning("A maximum of 5 tags can be added.")
      return
    }
    if (tags.includes(newTag)) {
      toast.warning("Cannot have duplicate tags")
      return
    }
    if (newTag == "") {
      return
    }
    setTags([...tags, newTag]);
    setSelected((prev) => [...prev, newTag]);
    setNewTag("");
  };

  return (
    <Tags className="">
      <TagsTrigger className="p-1" type="button">
        {selected.map((tag) => (
          <TagsValue key={tag} onRemove={() => handleRemove(tag)}>
            {tag}
          </TagsValue>
        ))}
      </TagsTrigger>
      <TagsContent>
        <TagsInput value={newTag} onValueChange={setNewTag} onKeyDown={handleKeyDown} placeholder="Search tag..." />
        <TagsList className="py-0">
          <TagsEmpty>
            <button
              className="mx-auto flex cursor-pointer items-center gap-2"
              onClick={handleCreateTag}
              type="button"
            >
              <PlusIcon className="text-muted-foreground" size={14} />
              Create new tag: {newTag}
            </button>
          </TagsEmpty>
        </TagsList>
      </TagsContent>
    </Tags>
  )
}