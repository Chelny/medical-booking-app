import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import classNames from 'classnames'
import { useTranslation } from 'next-i18next'
import styles from './MultiStepProgressBar.module.css'

type MultiStepProgressBarProps = {
  stepProgressBarInfo: StepProgressBarInfo[]
  currentStepIndex: number
  goToStep: (index: number) => void
}

export const MultiStepProgressBar = (props: MultiStepProgressBarProps): JSX.Element => {
  const { t } = useTranslation()

  const handleClick = (stepIndex: number): void => {
    props.goToStep(stepIndex)
  }

  return (
    <div className={styles.progressBarWrapper}>
      {props.stepProgressBarInfo.map((info: StepProgressBarInfo, index: number) => (
        <div key={index} className={styles.stepsContainer}>
          <div
            className={`${styles.stepContainer} ${classNames({
              [styles.stepContainerCompleted]: index < props.currentStepIndex,
              [styles.stepContainerActive]: index == props.currentStepIndex,
              [styles.stepContainerNotCompleted]: index > props.currentStepIndex,
            })}`}
            role="button"
            onClick={() => handleClick(index)}
          >
            <div
              className={`${styles.iconWrapper} ${classNames({
                [styles.iconWrapperCompleted]: index <= props.currentStepIndex,
                [styles.iconWrapperActive]: index == props.currentStepIndex,
                [styles.iconWrapperNotCompleted]: index > props.currentStepIndex,
              })}`}
            >
              <FontAwesomeIcon icon={info.iconName} size="lg" />
            </div>
            <div
              className={`${styles.title} ${classNames({
                [styles.titleCompleted]: index <= props.currentStepIndex,
                [styles.titleNotCompleted]: index > props.currentStepIndex,
              })}`}
            >
              {t(info.translation.key, { ns: info.translation.namespace ?? 'common' })}
            </div>
          </div>
          {index < props.stepProgressBarInfo.length - 1 && (
            <div
              className={`${styles.line} ${classNames({
                [styles.lineCompleted]: index < props.currentStepIndex,
                [styles.lineNotCompleted]: index >= props.currentStepIndex,
              })}`}
            ></div>
          )}
        </div>
      ))}
    </div>
  )
}
