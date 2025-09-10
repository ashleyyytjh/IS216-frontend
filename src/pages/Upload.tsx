'use client';
import { Dropzone, DropzoneContent, DropzoneEmptyState } from '@/components/ui/shadcn-io/dropzone';
import { useState, useEffect } from 'react';
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import * as React from "react"

const Upload = () => {
  const [files, setFiles] = useState<File[] | undefined>();
  const [percent, setPercent] = React.useState(0)
  const [isImporting, setIsImporting] = React.useState(false)



  const handleDrop = (files: File[]) => {
    console.log(files);
    setFiles(files);
  };

  const [currentStep, setCurrentStep] = React.useState(1)


  const filesProgress = 100;



  const steps = [
    "Upload files",
    "Details",
    "Finish"
  ]
  const totalSteps = steps.length
  const progress = (currentStep / totalSteps) * 100




  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }
  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }
  const deleteFile = (fileName: string) => {
    if (!files) return
    setFiles(files.filter((f) => f.name !== fileName))
  }


  return (
    <>
      <div className="px-4 md:px-25 lg:px-40 py-25">
        <div className='flex flex-col  gap-10 '>
        {steps[currentStep - 1] == "Upload files" ? 
        <section id = "upload" className='flex flex-col gap-10'>
          <div className='text-center text-4xl'>UPLOAD YOUR FILESSSS</div>
          <Dropzone
            maxFiles={3}
            onDrop={handleDrop}
            onError={console.error}
            src={files}
            className='bg-gray-100 hover:cursor-pointer hover:bg-gray-200'
          >
            <DropzoneEmptyState />
            <DropzoneContent />
          </Dropzone>

          {/* progress bar for files */}
          {files ? files.map(file => (
            <div
              className="  w-full flex flex-row"
              style={{
                all: 'revert',
                display: 'flex',
                justifyContent: 'center',
                alignSelf: 'flex-start',
                width: '100%',
                fontSize: '14px',
                lineHeight: '1.5',
                letterSpacing: 'normal',
                alignItems: 'center'
              }}
            >
              <div className='row-span-1'>
                <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="green" className="icon icon-tabler icons-tabler-filled icon-tabler-file-check"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M12 2l.117 .007a1 1 0 0 1 .876 .876l.007 .117v4l.005 .15a2 2 0 0 0 1.838 1.844l.157 .006h4l.117 .007a1 1 0 0 1 .876 .876l.007 .117v9a3 3 0 0 1 -2.824 2.995l-.176 .005h-10a3 3 0 0 1 -2.995 -2.824l-.005 -.176v-14a3 3 0 0 1 2.824 -2.995l.176 -.005zm3.707 10.293a1 1 0 0 0 -1.414 0l-3.293 3.292l-1.293 -1.292a1 1 0 1 0 -1.414 1.414l2 2a1 1 0 0 0 1.414 0l4 -4a1 1 0 0 0 0 -1.414m-.707 -9.294l4 4.001h-4z" /></svg>
              </div>
              <div className='w-full flex flex-col'>
                <span className='mx-7'>{file.name}</span>
                <div className='flex flex-row align-middle gap-2'>
                  <Progress value={filesProgress} className='bg-gray-200 [&>div]:bg-green-500 [&>div]:rounded-full h-1.5 ml-7 self-center' />
                  <span>{filesProgress}%</span>
                </div>

              </div>
              <div className='hover:cursor-pointer' onClick={() => deleteFile(file.name)}>
                <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-trash"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M4 7l16 0" /><path d="M10 11l0 6" /><path d="M14 11l0 6" /><path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" /><path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" /></svg>
              </div>

            </div>

          ))


            : ""}

          </section>











          : ""}

        




          <div
            className="flex justify-center self-start pt-6 w-full"
            style={{
              all: 'revert',
              display: 'flex',
              justifyContent: 'center',
              alignSelf: 'flex-start',
              paddingTop: '1.5rem',
              width: '100%',
              fontSize: '14px',
              lineHeight: '1.5',
              letterSpacing: 'normal'
            }}
          >

            <div className="w-full max-w-md space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">
                    Step {currentStep} of {totalSteps}
                  </span>
                  <span className="text-muted-foreground">
                    {steps[currentStep - 1]}
                  </span>
                </div>
                <Progress value={progress} className="w-full" />
              </div>







              <div className="flex justify-between">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                >
                  <ChevronLeft className="mr-1 h-4 w-4" />
                  Previous
                </Button>
                <Button
                  size="sm"
                  onClick={nextStep}
                  disabled={!files || files.length<1}
                >
                  {currentStep === totalSteps ? "Complete" : "Next"}
                  {currentStep !== totalSteps && (
                    <ChevronRight className="ml-1 h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>

  )

}


export default Upload;