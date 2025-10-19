// components/tutorial/stepsForUpload.ts
import type { Step } from 'react-joyride';

export type UploadStage = 'pending' | 'uploaded' | 'done';


export function getUploadSteps(
  file: File | null,
  stage: UploadStage,
  currentStep: number
): Step[] {

  let steps: Step[] = [];

  switch (currentStep) {
    case 1:
      steps = [
        {
          target: '#upload-dropzone',
          title: <div className='text-center'>Step 1</div>,
          content: <div className='max-w-50'>This is where you can drop and see what files you have add!</div>,
          placement: 'top',
          disableBeacon: true,
        },
        {
          target: '#upload-dropzone',
          title: <div className='text-center'>Step 2</div>,
          content: <div className="flex flex-col items-center gap-3 w-full">
            <img
              src="https://puniazcdhuhkxycbtwar.supabase.co/storage/v1/object/sign/test/uploadfile.gif?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9iMGIxY2IzMC1hNDc5LTQzYWQtYTIyYi0xOGZlZWIyYjE3OWEiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJ0ZXN0L3VwbG9hZGZpbGUuZ2lmIiwiaWF0IjoxNzYwODYwMzI0LCJleHAiOjE3OTIzOTYzMjR9.JrRLwNt5ccDzGfpKlVtkArhCLMRNi9lUeanrRcapyF4"
              alt="Drag & drop demo"
              className="max-h-80 rounded-md"
            />
            <p className="text-xs text-muted-foreground text-center">
              Drag a file here or click to select.
            </p>
          </div>,
          placement: 'top',
          disableBeacon: true,
        },
        {
          target: '#next-button',
          title: <div className='text-center'>Step 3</div>,
          content: <div className='max-w-50'>Click next to continue!</div>,
          placement: 'top',
          disableBeacon: true,
        },
      ];
      break;

    case 2:
      steps = [
        {
          target: '#details-step-1',
          title: <div className='text-center'>Step 1</div>,
          content: <div className='max-w-50'>Fill in title and description.</div>,
          placement: 'left',
          disableBeacon: true,
        },
        {
          target: '#details-step-2',
          title: <div className='text-center'>Step 2</div>,
          content: <div className='max-w-50'>You may add in the course code and you will yield better search results for your notes!</div>,
          placement: 'right',
          disableBeacon: true,
        },
        {
          target: '#details-step-3',
          title: <div className='text-center'>Step 3</div>,
          content: <div className='max-w-50'>Adding tags like "Finals" will give better search results for your notes too!</div>,
          placement: 'left',
          disableBeacon: true,
        }, {
          target: '#details-step-4',
          title: <div className='text-center'>Step 4</div>,
          content: <div className='max-w-50'>Input your price for your notes or you can set it for free too! </div>,
          placement: 'left',
          disableBeacon: true,
        },
        {
          target: '#next-button',
          title: <div className='text-center'>Step 5</div>,
          content: <div className='max-w-50'>Click next to continue!</div>,
          placement: 'top',
          disableBeacon: true,
        },
      ];
      break;

    case 3:
      steps = [
        {
          target: '#review-summary',
          title: <div className='text-center'>Step 1</div>,
          content: 'Double-check your information.',
          placement: 'top',
          disableBeacon: true,
        },
        {
          target: '#publish-button',
          title: <div className='text-center'>Step 2</div>,
          content: <div className='max-w-50 text-center'>You're almost there! <br/><br/>Click publish to upload your notes!</div>,
          placement: 'top',
          disableBeacon: true,
        },
      ];
      break;

    case 4:
      steps = [
        {
          target: '#publish-done',
          title: 'Publish',
          content:
            stage === 'done'
              ? 'All set 🎉 View it or go to Notes.'
              : 'Uploading… this will switch to “Done” when complete.',
          placement: 'top',
          disableBeacon: true,
        },
      ];
      break;
  }

  // If current step >= 2 but file not uploaded yet, hide later tours
  if (currentStep >= 2 && !file) {
    steps = [];
  }

  // ✅ fix: actually return the array
  return steps;
}
