import React from 'react'
import { useTranslation } from 'next-i18next'
import zxcvbn from 'zxcvbn'

type PasswordStrengthMeterProps = {
  password: React.InputHTMLAttributes<HTMLInputElement>['value']
}

const PasswordStrengthMeter = ({ password }: PasswordStrengthMeterProps) => {
  const { t } = useTranslation()
  const [meter, setMeter] = React.useState(0)

  React.useEffect(() => {
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
