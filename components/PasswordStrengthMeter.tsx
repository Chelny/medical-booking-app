import { useTranslation } from 'next-i18next'
import { InputHTMLAttributes, useEffect, useState } from 'react'
import zxcvbn from 'zxcvbn'

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
      <meter
        data-testid="password-strength-meter"
        className="w-full h-[0.5rem] rounded mx-auto mb-2 bg-medium"
        max={4}
        value={meter}
      />
      <p className="text-medium text-right">
        &nbsp;{password?.valueOf() && t(`FORM.PASSWORD_STRENGTH.SCALE.${meter}`)}
      </p>
    </>
  )
}

export default PasswordStrengthMeter
