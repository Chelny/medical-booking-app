import { MouseEventHandler } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useTranslation } from 'next-i18next'
import Button from 'components/Button'
import styles from 'styles/modules/BackButton.module.css'

type BackButtonProps = {
  disabled?: boolean
  handleClick?: MouseEventHandler<HTMLButtonElement>
}

const BackButton = ({ disabled, handleClick }: BackButtonProps): JSX.Element => {
  const { t } = useTranslation()

  return (
    <div className="w-fit mb-2">
      <Button type="button" className={styles.btn} disabled={disabled} handleClick={handleClick}>
        <FontAwesomeIcon icon="long-arrow-left" />
        <span>{t('BUTTON.BACK')}</span>
      </Button>
    </div>
  )
}

export default BackButton
