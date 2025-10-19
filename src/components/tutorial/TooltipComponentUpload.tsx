// components/joyride/CustomTooltip.tsx
import { TooltipRenderProps } from 'react-joyride';
import { Card, CardHeader, CardContent, CardFooter, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'
import { Separator } from "@/components/ui/separator"

export default function CustomTooltipUpload({
  backProps,
  closeProps,
  continuous,
  index,
  primaryProps,
  skipProps,
  step,
  tooltipProps,
  size,
}: TooltipRenderProps) {
  return (
    <Card
      {...tooltipProps}
      className={cn(
        'relative bg-background/95 animate-in fade-in zoom-in-95 border-0 isolate aspect-video  rounded-xl  shadow-lg ring-1 ring-black/5 gap-5 ',
        'p-4 rounded-xl'
      )}
    >
      <button
        {...closeProps}
        className="absolute top-2 right-2 text-muted-foreground hover:text-foreground"
      >
        <X className="h-4 w-4" />
      </button>



      <CardHeader>
        {step.title && (
          <CardTitle className="text-lg font-semibold text-foreground">
            {step.title}
          </CardTitle>
        )}
        {/* <Button size="sm" variant="ghost" className="text-muted-foreground w-auto" {...skipProps} > {skipProps.title || 'Skip'} </Button> */}
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground flex flex-row justify-between p-0 ">
        <Button
          size="icon"
          variant="ghost"
          {...backProps}
          disabled={index === 0}
          className={cn(
            "h-8 w-8 bg-transparent hover:bg-transparent text-muted-foreground hover:text-foreground my-auto ",
            index === 0 && "opacity-40 cursor-not-allowed"
          )}
        >
          <ChevronLeftIcon className="h-4 w-4 hover:scale-102" />
        </Button>

        <span className='my-auto'>
          {step.content}
        </span>
        {continuous && (
          <Button
            size="icon"
            {...primaryProps}
            className="h-8 w-8 bg-transparent hover:bg-transparent text-muted-foreground hover:text-foreground my-auto"
            variant="ghost"
          >
            <ChevronRightIcon className="h-4 w-4 " />
          </Button>
        )}
      </CardContent>


      <CardFooter className="flex flex-col pt-3">
        <div className="w-full flex justify-center">

          <p className="text-[12px] text-muted-foreground select-none my-auto">
            <span className="text-foreground">{(index ?? 0) + 1} of </span>

            <span className="text-foreground">{size ?? 1}</span>
          </p>

        </div>

       <Separator className='my-2'/>
        <Button  variant="ghost" className="text-muted-foreground w-auto h-auto p-0 hover:scale-102 hover:bg-transparent" {...skipProps} > <span className='text-[11px] flex align-middle'>Don't show</span> </Button>
       
      </CardFooter>
    </Card>
  );
}
