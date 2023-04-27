import { ChangeEvent } from 'react'
import { useTranslation } from 'next-i18next'
import { FormElement, FormWrapper } from 'components'
import { LanguagesMap, Locales } from 'configs'
import { Common, Regex } from 'constantss'
import { GendersMap } from 'enums'
import { IUserFormData } from 'interfaces'
import { Utilities } from 'utils'

type UserFormProps = IUserFormData & { updateFields: (fields: Partial<IUserFormData>) => void }

export const UserForm = (props: UserFormProps): JSX.Element => {
  const { t } = useTranslation()

  return (
    <FormWrapper>
      <FormElement
        fieldName="firstName"
        type="text"
        required={true}
        pattern={Regex.NAME_PATTERN.source}
        value={props.firstName}
        onChange={(e: ChangeEvent<HTMLInputElement>) => props.updateFields({ firstName: e.target.value })}
      />
      <FormElement
        fieldName="lastName"
        type="text"
        required={true}
        pattern={Regex.NAME_PATTERN.source}
        value={props.lastName}
        onChange={(e: ChangeEvent<HTMLInputElement>) => props.updateFields({ lastName: e.target.value })}
      />
      <FormElement
        fieldName="gender"
        type="radio"
        list={GendersMap}
        required={true}
        value={props.gender}
        onChange={(e: ChangeEvent<HTMLInputElement>) => props.updateFields({ gender: e.target.value })}
      />
      <FormElement
        fieldName="birthDate"
        type="date"
        required={true}
        pattern={Regex.BIRTH_DATE_PATTERN.source}
        min={Common.BIRTH_DATE.MIN}
        max={Common.BIRTH_DATE.MAX}
        value={Utilities.formatISOToStringDate(props.birthDate)}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          props.updateFields({ birthDate: Utilities.utcToZonedTime(e.target.value) })
        }
      />
      <FormElement
        fieldName="language"
        type="select"
        required={true}
        value={props.language}
        onChange={(e: ChangeEvent<HTMLSelectElement>) => props.updateFields({ language: e.target.value })}
      >
        <option value="" disabled={!!props.language}>
          {t('FORM.PLACEHOLDER.SELECT')}
        </option>
        {LanguagesMap.map((code: string, index: number) => (
          <option key={index} value={code}>
            {Locales[code].label}
          </option>
        ))}
      </FormElement>
    </FormWrapper>
  )
}
