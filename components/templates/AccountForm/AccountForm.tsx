import { ChangeEvent } from 'react'
import { FormElement, FormWrapper, PasswordStrengthMeter } from 'components'
import { Regex } from 'constantss'
import { IAccountFormData } from 'interfaces'

type AccountFormProps = IAccountFormData & { updateFields: (fields: Partial<IAccountFormData>) => void }

export const AccountForm = (props: AccountFormProps): JSX.Element => {
  return (
    <FormWrapper>
      <FormElement
        fieldName="email"
        type="email"
        required={true}
        pattern={Regex.EMAIL_PATTERN.source}
        value={props.email}
        onChange={(e: ChangeEvent<HTMLInputElement>) => props.updateFields({ email: e.target.value })}
      />
      <FormElement
        fieldName="username"
        type="text"
        required={false}
        pattern={Regex.USERNAME_PATTERN.source}
        value={props.username}
        hints={['USERNAME']}
        onChange={(e: ChangeEvent<HTMLInputElement>) => props.updateFields({ username: e.target.value })}
      />
      {typeof props.password != 'undefined' && (
        <FormElement
          fieldName="password"
          type="password"
          required={true}
          pattern={Regex.PASSWORD_PATTERN.source}
          value={props.password}
          onChange={(e: ChangeEvent<HTMLInputElement>) => props.updateFields({ password: e.target.value })}
        />
      )}
      {typeof props.password != 'undefined' && <PasswordStrengthMeter password={props.password} />}
      {typeof props.passwordConfirmation != 'undefined' && (
        <FormElement
          fieldName="passwordConfirmation"
          type="password"
          required={true}
          pattern={Regex.PASSWORD_PATTERN.source}
          value={props.passwordConfirmation}
          onChange={(e: ChangeEvent<HTMLInputElement>) => props.updateFields({ passwordConfirmation: e.target.value })}
        />
      )}
    </FormWrapper>
  )
}
