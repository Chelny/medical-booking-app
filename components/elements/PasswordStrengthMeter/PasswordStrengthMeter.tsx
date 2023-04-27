import { InputHTMLAttributes, useEffect, useState } from 'react'
import { useTranslation } from 'next-i18next'
import zxcvbn from 'zxcvbn'
import styles from './PasswordStrengthMeter.module.css'

type PasswordStrengthMeterProps = {
  password: InputHTMLAttributes<HTMLInputElement>['value']
}

export const PasswordStrengthMeter = (props: PasswordStrengthMeterProps): JSX.Element => {
  const { t } = useTranslation()
  const [meter, setMeter] = useState<number>(0)

  useEffect(() => {
    if (typeof props.password === 'string') setMeter(zxcvbn(props.password).score)
  }, [props.password])

  return (
    <>
      <meter className={styles.meter} max={4} value={meter} data-testid="password-strength-meter" />
      <p className={styles.strengthText}>
        &nbsp;{props.password?.valueOf() && t(`FORM.PASSWORD_STRENGTH.SCALE.${meter}`)}
      </p>
    </>
  )
}
