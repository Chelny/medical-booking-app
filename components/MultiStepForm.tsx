import { useState } from 'react'
import { useTranslation } from 'next-i18next'
import Button from 'components/Button'

type MultiStepFormProps = {
  fieldGroups: JSX.Element[]
  submitBtnLabel: string
  onComplete?: React.MouseEventHandler<HTMLButtonElement>
}

const MultiStepForm = ({ fieldGroups, submitBtnLabel, onComplete }: MultiStepFormProps): JSX.Element => {
  const { t } = useTranslation()
  const [step, setStep] = useState(0)

  const Navigation = () => (
    <div className="flex flex-cols flex-row-reverse gap-1">
      {step === fieldGroups.length - 1 && (
        <Button type="submit" className="flex-[0_50%]" onClick={onComplete}>
          <>{submitBtnLabel}</>
        </Button>
      )}
      {step < fieldGroups.length - 1 && (
        <Button
          className="flex-[0_50%]"
          disabled={false}
          onClick={() => {
            setStep(step + 1)
          }}
        >
          {t('BUTTON.NEXT')}
        </Button>
      )}
      {step > 0 && (
        <Button
          className="flex-[0_50%]"
          onClick={() => {
            setStep(step - 1)
          }}
        >
          {t('BUTTON.BACK')}
        </Button>
      )}
    </div>
  )

  // Mark the input group already filled as blue or gray if not
  const Dots = () => <div className="w-full flex items-center justify-center gap-1 py-4">{renderMarkers()}</div>
  const renderMarkers = () => {
    let markers = []
    for (let i = 0; i < fieldGroups.length; i++) {
      markers.push(
        <span
          key={i}
          className={
            step >= i ? 'rounded-full w-2 h-2 bg-primary-day dark:bg-primary-night' : 'rounded-full w-2 h-2 bg-medium'
          }
        />
      )
    }
    return markers
  }

  return (
    <>
      {fieldGroups[step]}
      <Navigation />
      <Dots />
    </>
  )
}

export default MultiStepForm
