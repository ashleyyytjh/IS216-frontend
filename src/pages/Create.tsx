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
import Joyride, { CallBackProps, STATUS, Step } from "react-joyride";
import CustomTooltip from "@/components/tutorial/TooltipComponent";
import TypingText from "@/components/ui/shadcn-io/typing-text";
import { motion } from "framer-motion";
import { WritingText } from "@/components/ui/shadcn-io/writing-text";
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
    tour: "step-1",
    motion: "left",
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
    tour: "step-2",
    motion: "right",
  },
];

export default function Create() {
  const [title, setTitle] = useState(true);
  const [typing, setTyping] = useState(true);
  const [run, setRun] = useState<boolean>(false);
  const steps: Step[] = [
    {
      target: "#step-1",
      title: (
        <div className="flex flex-row gap-2">
          <TypingText
            text={["Uploading of notes!"]}
            typingSpeed={10}
            startOnVisible
            showCursor={false}
            cursorCharacter="|"
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={24}
            height={24}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="icon icon-tabler icons-tabler-outline icon-tabler-notes"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M5 3m0 2a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2z" />
            <path d="M9 7l6 0" />
            <path d="M9 11l6 0" />
            <path d="M9 15l4 0" />
          </svg>
        </div>
      ),
      content: (
        <TypingText
          text={[
            "This is where you can start your journey as a seller with your ready-made notes (PDF) !",
          ]}
          typingSpeed={20}
          showCursor={false}
          startOnVisible
          cursorCharacter="|"
        />
      ),
      disableBeacon: true,
      placement: "left",
    },
    {
      target: "#step-2",
      title: (
        <div className="flex flex-row gap-2">
          <TypingText
            text={["Write It Your Way!"]}
            typingSpeed={10}
            showCursor={false}
            startOnVisible
            cursorCharacter="|"
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={24}
            height={24}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="icon icon-tabler icons-tabler-outline icon-tabler-scribble"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M3 15c2 3 4 4 7 4s7 -3 7 -7s-3 -7 -6 -7s-5 1.5 -5 4s2 5 6 5s8.408 -2.453 10 -5" />
          </svg>
        </div>
      ),
      content: (
        <TypingText
          text={[
            "Or create and publish notes with rich formatting with our editor!",
          ]}
          typingSpeed={20}
          showCursor={false}
          startOnVisible
          cursorCharacter="|"
        />
      ),
      placement: "right",
    },
    {
      target: "#step-3",
      title: (
        <div className="flex flex-row gap-2">
          <TypingText
            text={["Now, let's start uploading!"]}
            typingSpeed={10}
            showCursor={false}
            startOnVisible
            cursorCharacter="|"
          />
        </div>
      ),
      content: (
        <TypingText
          text={["Choose one of the above options and click proceed!"]}
          typingSpeed={20}
          showCursor={false}
          startOnVisible
          cursorCharacter="|"
        />
      ),
      placement: "right",
    },
  ];
  const [selected, setSelected] = useState<boolean>(false);
  const navigate = useNavigate();

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
    navigate(`/${option}`);
  };
  const handleClickStart = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();

    setRun(true);
  };

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status, type } = data;
    const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];

    if (finishedStatuses.includes(status)) {
      setRun(false);
    }
  };

  return (
    <div className="not-prose flex flex-col gap-16 px-8 py-20 text-center">
      {/* <Joyride
        tooltipComponent={CustomTooltip}
        callback={handleJoyrideCallback}
        run={run}
        showProgress
        showSkipButton
        disableScrolling
        continuous
        steps={steps}
        styles={{
          options: {
            zIndex: 10,
          },
        }}
      ></Joyride> */}
      <div className="flex flex-col items-center justify-center gap-8">
        <motion.div
          initial={{ y: "-100vh", scale: 0.4 }}
          animate={{ y: 0, scale: 1.0 }}
          transition={{ type: "spring", bounce: 0.2, duration: 0.2, mass: 1 }}
          onAnimationComplete={() => setTitle(!title)}
        >
          <h1 className="mb-0 text-balance font-medium text-5xl tracking-tighter!">
            Select a Create Mode
          </h1>
        </motion.div>

        {!title && (
          <WritingText
            className="mx-auto mt-0 mb-0 max-w-2xl text-balance text-lg text-muted-foreground"
            text="We offer a rich-text editor for creating notes on our platform. Alternatively, upload your notes PDF files."
            inView={true}
            transition={{
              type: "spring",
              bounce: 0,
              duration: 0.2,
              delay: 0.05,
            }}
            onComplete={() => setTyping(!typing)}
          />
        )}

            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={typing ? { opacity: 0, scale: 0.98, pointerEvents: "none" } 
                  : { opacity: 1, scale: 1, pointerEvents: "auto" }}
              transition={{
                duration: 0.4,
                scale: { type: "spring", visualDuration: 0.4, bounce: 0.7 },
                delay: 0.5,
              }}
            >
              {/* <div className="text-muted-foreground flex flex-col md:flex-row gap-5 justify-center ">
                <p className="my-auto ">Not sure how to start?</p>

                <Button size="default" onClick={handleClickStart}>
                  Click here
                </Button>
              </div> */}
              <form onSubmit={handleSubmit}>
                <Choicebox
                  name="create_type"
                  defaultValue="1"
                  className="mt-8 grid w-full max-w-4xl gap-8 md:grid-cols-2"
                  onChange={handleSelect}
                >
                  {options.map((option) => (
                    <ChoiceboxItem
                      id={option.tour}
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
                          "relative w-full aspect-[5/3] md:aspect-[6/7] text-left transition-all hover:scale-102",
                          "group-data-[state=checked]:border-primary",
                          "group-data-[state=checked]:ring-gray-600",
                        ])}
                        key={option.id}
                      >
                        <CardHeader>
                          <CardTitle className="font-medium text-xl">
                            {option.name}
                          </CardTitle>
                          <CardDescription>
                            {option.description}
                          </CardDescription>
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
                <div className="flex w-full justify-center mb-4 mt-10 ">
                  <Button disabled={!selected} size="sm" id="step-3">
                    Proceed
                  </Button>
                </div>
              </form>
            </motion.div>
      </div>
    </div>
  );
}
