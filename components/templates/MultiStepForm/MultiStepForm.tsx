import { MouseEventHandler, useState } from 'react'
import classNames from 'classnames'
import { useTranslation } from 'next-i18next'
import Button from 'components/elements/Button/Button'
import styles from './MultiStepForm.module.css'

type MultiStepFormProps = {
  fieldGroups: JSX.Element[]
  submitBtnLabel: string
  onComplete?: MouseEventHandler<HTMLButtonElement>
}

const MultiStepForm = ({ fieldGroups, submitBtnLabel, onComplete }: MultiStepFormProps): JSX.Element => {
  const { t } = useTranslation()
  const [step, setStep] = useState(0)

  const Navigation = () => (
    <div className={styles.actionButtons}>
      {step === fieldGroups.length - 1 && (
        <Button type="submit" className={styles.submitButton} handleClick={onComplete}>
          {submitBtnLabel}
        </Button>
      )}
      {step < fieldGroups.length - 1 && (
        <Button
          type="button"
          className={styles.nextButton}
          disabled={false}
          handleClick={() => {
            setStep(step + 1)
          }}
        >
          {t('BUTTON.NEXT')}
        </Button>
      )}
      {step > 0 && (
        <Button
          type="button"
          className={styles.prevButton}
          handleClick={() => {
            setStep(step - 1)
          }}
        >
          {t('BUTTON.BACK')}
        </Button>
      )}
    </div>
  )

  // Mark the input group already filled as blue or gray if not
  const renderMarkers = () => {
    const markers = []
    for (let i = 0; i < fieldGroups.length; i++) {
      markers.push(
        <span key={i} className={classNames({ [styles.activeStep]: step >= i, [styles.inactiveStep]: step < i })} />
      )
    }
    return markers
  }

  const Dots = () => <div className={styles.dots}>{renderMarkers()}</div>

  return (
    <form noValidate>
      {fieldGroups[step]}
      <Navigation />
      <Dots />
    </form>
  )
}

export default MultiStepForm
