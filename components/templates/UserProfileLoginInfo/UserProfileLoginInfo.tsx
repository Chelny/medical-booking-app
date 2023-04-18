import { FormEvent } from 'react'
import FormElement from 'components/elements/FormElement/FormElement'
import PasswordStrengthMeter from 'components/elements/PasswordStrengthMeter/PasswordStrengthMeter'
import { Common } from 'constants/common'

type UserProfileLoginInfoProps = {
  values: { [key: string]: number | string }
  errors: IStringMap
  handleChange: (event: FormEvent<HTMLElement>) => void
}

const UserProfileLoginInfo = ({ values, errors, handleChange }: UserProfileLoginInfoProps): JSX.Element => {
  return (
    <>
      <FormElement fieldName="email" error={errors.email}>
        <input
          data-testid="form-input-email"
          type="email"
          id="email"
          autoComplete="email"
          value={values.email}
          aria-required={true}
          aria-invalid={!!errors.email}
          aria-errormessage={`${Common.ERROR_MESSAGE_ID_PREFIX}_email`}
          onChange={handleChange}
        />
      </FormElement>
      <FormElement fieldName="username" error={errors.username} hints={['USERNAME']} optional>
        <input
          data-testid="form-input-username"
          type="text"
          id="username"
          value={values.username}
          aria-required="false"
          aria-invalid={!!errors.username}
          aria-errormessage={`${Common.ERROR_MESSAGE_ID_PREFIX}_username`}
          onChange={handleChange}
        />
      </FormElement>
      <FormElement fieldName="password" error={errors.password}>
        <input
          data-testid="form-input-password"
          type="password"
          id="password"
          autoComplete="new-password"
          value={values.password}
          aria-required={true}
          aria-invalid={!!errors.password}
          aria-errormessage={`${Common.ERROR_MESSAGE_ID_PREFIX}_password`}
          onChange={handleChange}
        />
      </FormElement>
      <PasswordStrengthMeter password={values.password} />
      <FormElement fieldName="passwordConfirmation" error={errors.passwordConfirmation}>
        <input
          data-testid="form-input-password-confirmation"
          type="password"
          id="password-confirmation"
          value={values.passwordConfirmation}
          aria-required={true}
          aria-invalid={!!errors.passwordConfirmation}
          aria-errormessage={`${Common.ERROR_MESSAGE_ID_PREFIX}_passwordConfirmation`}
          onChange={handleChange}
        />
      </FormElement>
    </>
  )
}

export default UserProfileLoginInfo
