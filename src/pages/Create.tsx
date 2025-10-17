import { Button } from "@/components/ui/button";
import { Choicebox, ChoiceboxItem } from "@/components/ui/shadcn-io/choicebox";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { CircleCheck } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { ChangeEvent, FormEvent, useState } from "react";
const options = [
  {
    id: "upload",
    name: "Upload PDF",
    description: (
      <p>
        Works best with text-written notes. In-house support for annotations in
        the{" "}
        <Button className="px-0 underline" variant="link" asChild>
          <Link to="/forum">forum</Link>
        </Button>
      </p>
    ),
    features: ["Max 10MB", "Knowledge Graph", "Text highlighting built-in"],
    cta: "Get started for free",
  },
  {
    id: "compose",
    name: "Compose",
    description: (
      <p>
        Use our built-in rich text editor, and handle publishing rules when
        you're done!
      </p>
    ),
    features: [
      "Rich-text Editor with markdown",
      "Supports '/' blocks",
      "Code Input",
      "Toggle public viewing",
    ],
    cta: "Subscribe to Pro",
    popular: true,
  },
];

export default function Create() {
  const [selected, setSelected] = useState<boolean>(false);
  const navigate = useNavigate()

  const handleSelect = (e: ChangeEvent<HTMLInputElement>) => {
    if (selected) {
      return;
    }
    setSelected(true);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const option = formData.get("create_type");
    navigate(`/${option}`)
  };

  return (
    <div className="not-prose flex flex-col gap-16 px-8 py-24 text-center">
      <div className="flex flex-col items-center justify-center gap-8">
        <h1 className="mb-0 text-balance font-medium text-5xl tracking-tighter!">
          Select a Create Mode
        </h1>
        <p className="mx-auto mt-0 mb-0 max-w-2xl text-balance text-lg text-muted-foreground">
          We offer a rich-text editor for creating notes on our platform.
          Alternatively, upload your notes PDF files.
        </p>
        <form onSubmit={handleSubmit}>
          <Choicebox
            name="create_type"
            defaultValue="1"
            className="mt-8 grid w-full max-w-4xl gap-8 md:grid-cols-2"
            onChange={handleSelect}
          >
            {options.map((option) => (
              <ChoiceboxItem
                key={option.id}
                value={option.id}
                className={cn(
                  "group text-left border-none group p-0",
                  '[&[data-state="checked"]]:border-transparent !important',
                  '[&[data-state="checked"]]:bg-transparent !important'
                )}
              >
                <Card
                  className={cn([
                    "relative w-full aspect-[5/3] md:aspect-[6/7] text-left transition-all",
                    "group-data-[state=checked]:border-primary",
                    "group-data-[state=checked]:ring-2",
                  ])}
                  key={option.id}
                >
                  <CardHeader>
                    <CardTitle className="font-medium text-xl">
                      {option.name}
                    </CardTitle>
                    <CardDescription>{option.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-2">
                    {option.features.map((feature, index) => (
                      <div
                        className="flex items-center gap-2 text-muted-foreground text-sm"
                        key={index}
                      >
                        <CircleCheck className="h-4 w-4" />
                        {feature}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </ChoiceboxItem>
            ))}
          </Choicebox>
          <div className="flex w-full justify-end my-4">
            <Button disabled={!selected} size="sm">
              Proceed
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
