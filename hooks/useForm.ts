import { JSXElementConstructor, ReactElement, useState } from 'react'

interface IForm {
  steps: ReactElement[]
  currentStepIndex: number
  step: ReactElement
  isFirstStep: boolean
  isLastStep: boolean
  back: () => void
  next: () => void
  goTo: (index: number) => void
}

export const useForm = (steps: ReactElement[]): IForm => {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0)
  const [completedStepsCount, setCompletedStepsCount] = useState<number>(0)

  const back = (): void => {
    setCurrentStepIndex((index: number) => {
      if (index <= 0) return index
      return index - 1
    })
  }

  const next = (): void => {
    setCurrentStepIndex((index: number) => {
      if (index >= steps.length - 1) return index
      setCompletedStepsCount(index + 1)
      return index + 1
    })
  }

  const goTo = (index: number): void => {
    if (index <= completedStepsCount) setCurrentStepIndex(index)
  }

  return {
    steps,
    currentStepIndex,
    step: steps[currentStepIndex],
    isFirstStep: currentStepIndex === 0,
    isLastStep: currentStepIndex === steps.length - 1,
    back,
    next,
    goTo,
  }
}
