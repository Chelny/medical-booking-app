import { MouseEventHandler } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useTranslation } from 'next-i18next'
import { Button } from 'components'
import styles from './BackButton.module.css'

type BackButtonProps = {
  disabled?: boolean
  onClick?: MouseEventHandler<HTMLButtonElement>
}

export const BackButton = (props: BackButtonProps): JSX.Element => {
  const { t } = useTranslation()

  return (
    <div className="w-fit mb-2">
      <Button type="button" className={styles.btn} disabled={props.disabled} onClick={props.onClick}>
        <FontAwesomeIcon icon="long-arrow-left" />
        <span>{t('BUTTON.BACK')}</span>
      </Button>
    </div>
  )
}
