import { useTranslation } from 'next-i18next'
import { Button } from 'components'
import styles from './MultiStepActionButtons.module.css'

type MultiStepActionButtonsProps = {
  isFirstStep: boolean
  isLastStep: boolean
  back: () => void
  submitButtonLabel?: string
}

export const MultiStepActionButtons = (props: MultiStepActionButtonsProps): JSX.Element => {
  const { t } = useTranslation()

  return (
    <div className={styles.actionButtons}>
      {!props.isFirstStep && (
        <Button type="button" className={styles.prevButton} onClick={props.back}>
          {t('BUTTON.BACK')}
        </Button>
      )}
      <Button type="submit" className={styles.nextButton}>
        {props.isLastStep ? `${props.submitButtonLabel ?? t('BUTTON.SUBMIT')}` : t('BUTTON.NEXT')}
      </Button>
    </div>
  )
}
