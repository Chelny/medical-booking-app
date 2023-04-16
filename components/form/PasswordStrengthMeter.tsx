import { InputHTMLAttributes, useEffect, useState } from 'react'
import { useTranslation } from 'next-i18next'
import zxcvbn from 'zxcvbn'
import styles from 'styles/modules/PasswordStrengthMeter.module.css'

type PasswordStrengthMeterProps = {
  password: InputHTMLAttributes<HTMLInputElement>['value']
}

const PasswordStrengthMeter = ({ password }: PasswordStrengthMeterProps): JSX.Element => {
  const { t } = useTranslation()
  const [meter, setMeter] = useState(0)

  useEffect(() => {
    if (typeof password === 'string') setMeter(zxcvbn(password).score)
  }, [password])

  return (
    <>
      <meter className={styles.meter} max={4} value={meter} data-testid="password-strength-meter" />
      <p className="text-light-mode-text-tertiary text-end dark:text-dark-mode-text-tertiary">
        &nbsp;{password?.valueOf() && t(`FORM.PASSWORD_STRENGTH.SCALE.${meter}`)}
      </p>
    </>
  )
}

export default PasswordStrengthMeter
