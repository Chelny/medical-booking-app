import { FormEvent } from 'react'
import { useTranslation } from 'next-i18next'
import FormElement from 'components/form/FormElement'
import { Gender, GendersMap } from 'configs/genders.enum'
import { LanguagesMap, Locales } from 'configs/locales'
import { Common } from 'constants/common'

type UserProfilePersonalInfoProps = {
  values: { [key: string]: number | string }
  errors: IStringMap
  handleChange: (event: FormEvent<HTMLElement>) => void
}

const UserProfilePersonalInfo = ({ values, errors, handleChange }: UserProfilePersonalInfoProps): JSX.Element => {
  const { t } = useTranslation()

  return (
    <>
      <FormElement fieldName="firstName" error={errors.firstName}>
        <input
          data-testid="form-input-first-name"
          type="text"
          id="first-name"
          value={values.firstName}
          aria-required={true}
          aria-invalid={!!errors.firstName}
          aria-errormessage={`${Common.ERROR_MESSAGE_ID_PREFIX}_firstName`}
          onChange={handleChange}
        />
      </FormElement>
      <FormElement fieldName="lastName" error={errors.lastName}>
        <input
          data-testid="form-input-last-name"
          type="text"
          id="last-name"
          value={values.lastName}
          aria-required={true}
          aria-invalid={!!errors.lastName}
          aria-errormessage={`${Common.ERROR_MESSAGE_ID_PREFIX}_lastName`}
          onChange={handleChange}
        />
      </FormElement>
      <FormElement fieldName="gender" error={errors.gender}>
        <fieldset
          className="checkbox-radio-group"
          aria-required={true}
          aria-invalid={!!errors.gender}
          aria-errormessage={`${Common.ERROR_MESSAGE_ID_PREFIX}_gender`}
        >
          <legend>{t('FORM.LABEL.SELECT_GENDER')}</legend>
          {GendersMap.map((gender: Gender) => (
            <div key={gender}>
              <input
                data-testid={`form-radio-gender-${gender}`}
                type="radio"
                id={`gender-${gender}`}
                name="gender"
                checked={values.gender === gender}
                value={gender}
                onChange={handleChange}
              />
              <label htmlFor={`gender-${gender}`}>{t(`GENDERS.${gender}`)}</label>
            </div>
          ))}
        </fieldset>
      </FormElement>
      <FormElement fieldName="birthDate" error={errors.birthDate}>
        <input
          data-testid="form-input-birth-date"
          type="date"
          id="birthDate"
          min={Common.BIRTH_DATE.MIN}
          max={Common.BIRTH_DATE.MAX}
          value={values.birthDate}
          aria-required={true}
          aria-invalid={!!errors.birthDate}
          aria-errormessage={`${Common.ERROR_MESSAGE_ID_PREFIX}_birthDate`}
          onChange={handleChange}
        />
      </FormElement>
      <FormElement fieldName="language" error={errors.language}>
        <select
          data-testid="form-input-language"
          id="language"
          value={values.language}
          aria-required={true}
          aria-invalid={!!errors.language}
          aria-errormessage={`${Common.ERROR_MESSAGE_ID_PREFIX}_language`}
          onChange={handleChange}
        >
          {LanguagesMap.map((code: string) => (
            <option key={code} value={code}>
              {Locales[code].label}
            </option>
          ))}
        </select>
      </FormElement>
    </>
  )
}

export default UserProfilePersonalInfo
