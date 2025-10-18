import { Button } from "../ui/button";
import { ContainerTextFlip } from "../ui/container-text-flip";

export default function Hero() {
  return (
    <section className="h-full w-full overflow-hidden">
      <div className="container border-t border-b border-dashed mx-auto">

        <div className="relative flex w-full max-w-6xl flex-col justify-start border-l border-r border-t-0 border-dashed px-5 py-12 md:items-center md:justify-center lg:mx-auto">
          <p className="text-muted-foreground flex items-center gap-3 text-sm">
            <span className="inline-block size-2 rounded bg-green-500" />
            NEW Notes Coming Soon
          </p>
          <div className="mb-7 mt-3 w-full max-w-xl text-5xl font-semibold tracking-tighter md:mb-10 md:text-center md:text-6xl lg:relative lg:mb-0 lg:text-left lg:text-7xl">
            <h1 className="relative z-10 inline md:mr-3">
              A Smarter Way to <br className="block md:hidden" /> Find{" "}
              <br className="block md:hidden" />
            </h1>
            <ContainerTextFlip
              className="absolute text-4xl font-semibold tracking-tighter md:bottom-4 md:left-1/2 md:-translate-x-1/2 md:text-5xl lg:-bottom-4 lg:left-auto lg:translate-x-0 lg:text-7xl"
              words={["Notes", "Cheatsheets", "Answer Keys", "Knowledge"]}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
